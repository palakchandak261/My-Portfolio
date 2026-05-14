// B+ Tree C++ - communicates via JSON over stdin/stdout
// Supports (M, L) B+ Tree: M = internal degree, L = leaf degree
#include <iostream>
#include <string>
#include <sstream>
#include <vector>
#include <algorithm>

static int nodeIdCounter = 0;

struct BPNode {
    int id;
    bool isLeaf;
    std::vector<int> keys;
    std::vector<BPNode*> children;
    BPNode* next   = nullptr;
    BPNode* parent = nullptr;

    BPNode(bool leaf) : id(nodeIdCounter++), isLeaf(leaf) {}
};

static BPNode* root = nullptr;
static int M = 0; // internal degree
static int L = 0; // leaf degree

// ─── Find leaf ───────────────────────────────────────────────────────────────
BPNode* findLeaf(BPNode* node, int val) {
    if (node->isLeaf) return node;
    int i = 0;
    while (i < (int)node->keys.size() && val >= node->keys[i]) i++;
    return findLeaf(node->children[i], val);
}

bool searchValue(int val) {
    if (!root) return false;
    BPNode* leaf = findLeaf(root, val);
    for (int k : leaf->keys) if (k == val) return true;
    return false;
}

// ─── Split helpers ───────────────────────────────────────────────────────────
void insertIntoInternal(BPNode* node, int key, BPNode* newChild);

void splitLeaf(BPNode* leaf) {
    BPNode* newLeaf = new BPNode(true);
    int mid = (L + 1) / 2; // ceil(L/2)

    newLeaf->keys.assign(leaf->keys.begin() + mid, leaf->keys.end());
    leaf->keys.resize(mid);

    newLeaf->next   = leaf->next;
    leaf->next      = newLeaf;
    newLeaf->parent = leaf->parent;

    int promoteKey = newLeaf->keys[0];

    if (!leaf->parent) {
        BPNode* newRoot = new BPNode(false);
        newRoot->keys     = { promoteKey };
        newRoot->children = { leaf, newLeaf };
        leaf->parent      = newRoot;
        newLeaf->parent   = newRoot;
        root = newRoot;
    } else {
        insertIntoInternal(leaf->parent, promoteKey, newLeaf);
    }
}

void splitInternal(BPNode* node) {
    BPNode* newInternal = new BPNode(false);
    int midIndex   = M / 2;
    int promoteKey = node->keys[midIndex];

    newInternal->keys.assign(node->keys.begin() + midIndex + 1, node->keys.end());
    node->keys.resize(midIndex);

    newInternal->children.assign(node->children.begin() + midIndex + 1, node->children.end());
    node->children.resize(midIndex + 1);

    for (BPNode* c : newInternal->children) c->parent = newInternal;

    if (!node->parent) {
        BPNode* newRoot = new BPNode(false);
        newRoot->keys     = { promoteKey };
        newRoot->children = { node, newInternal };
        node->parent      = newRoot;
        newInternal->parent = newRoot;
        root = newRoot;
    } else {
        insertIntoInternal(node->parent, promoteKey, newInternal);
    }
}

void insertIntoInternal(BPNode* node, int key, BPNode* newChild) {
    int i = 0;
    while (i < (int)node->keys.size() && key > node->keys[i]) i++;
    node->keys.insert(node->keys.begin() + i, key);
    node->children.insert(node->children.begin() + i + 1, newChild);
    newChild->parent = node;

    if ((int)node->children.size() > M) splitInternal(node);
}

// ─── Insert ──────────────────────────────────────────────────────────────────
void insert(int val) {
    if (!root) return;
    if (searchValue(val)) return; // no duplicates

    BPNode* leaf = findLeaf(root, val);
    leaf->keys.push_back(val);
    std::sort(leaf->keys.begin(), leaf->keys.end());

    if ((int)leaf->keys.size() > L) splitLeaf(leaf);
}

// ─── Delete ──────────────────────────────────────────────────────────────────
void handleUnderflow(BPNode* node);

void deleteFromLeaf(BPNode* node, int val) {
    if (!node->isLeaf) {
        int i = 0;
        while (i < (int)node->keys.size() && val >= node->keys[i]) i++;
        deleteFromLeaf(node->children[i], val);
        return;
    }

    node->keys.erase(std::remove(node->keys.begin(), node->keys.end(), val), node->keys.end());

    if (node->parent) {
        BPNode* parent = node->parent;
        int idx = 0;
        while (idx < (int)parent->children.size() && parent->children[idx] != node) idx++;
        if (idx > 0 && !parent->keys.empty() && parent->keys[idx - 1] == val) {
            parent->keys[idx - 1] = node->keys.empty()
                ? (node->next ? node->next->keys[0] : 0)
                : node->keys[0];
        }
    }

    if (node == root) {
        if (node->keys.empty()) root = nullptr;
        return;
    }

    int minKeys = (L + 1) / 2;
    if ((int)node->keys.size() < minKeys) handleUnderflow(node);
}

void handleUnderflow(BPNode* node) {
    BPNode* parent = node->parent;
    int index = 0;
    while (index < (int)parent->children.size() && parent->children[index] != node) index++;

    BPNode* left  = index > 0 ? parent->children[index - 1] : nullptr;
    BPNode* right = index < (int)parent->children.size() - 1 ? parent->children[index + 1] : nullptr;
    int minKeys   = node->isLeaf ? (L + 1) / 2 : (M - 1 + 1) / 2;

    // Borrow from left
    if (left && (int)left->keys.size() > minKeys) {
        if (node->isLeaf) {
            node->keys.insert(node->keys.begin(), left->keys.back());
            left->keys.pop_back();
            parent->keys[index - 1] = node->keys[0];
        } else {
            node->keys.insert(node->keys.begin(), parent->keys[index - 1]);
            parent->keys[index - 1] = left->keys.back();
            left->keys.pop_back();
            node->children.insert(node->children.begin(), left->children.back());
            node->children[0]->parent = node;
            left->children.pop_back();
        }
        return;
    }

    // Borrow from right
    if (right && (int)right->keys.size() > minKeys) {
        if (node->isLeaf) {
            node->keys.push_back(right->keys[0]);
            right->keys.erase(right->keys.begin());
            parent->keys[index] = right->keys[0];
        } else {
            node->keys.push_back(parent->keys[index]);
            parent->keys[index] = right->keys[0];
            right->keys.erase(right->keys.begin());
            node->children.push_back(right->children[0]);
            node->children.back()->parent = node;
            right->children.erase(right->children.begin());
        }
        return;
    }

    // Merge
    if (left) {
        if (node->isLeaf) {
            left->keys.insert(left->keys.end(), node->keys.begin(), node->keys.end());
            left->next = node->next;
        } else {
            left->keys.push_back(parent->keys[index - 1]);
            left->keys.insert(left->keys.end(), node->keys.begin(), node->keys.end());
            left->children.insert(left->children.end(), node->children.begin(), node->children.end());
            for (BPNode* c : node->children) c->parent = left;
        }
        parent->keys.erase(parent->keys.begin() + index - 1);
        parent->children.erase(parent->children.begin() + index);
        delete node;
    } else if (right) {
        if (node->isLeaf) {
            node->keys.insert(node->keys.end(), right->keys.begin(), right->keys.end());
            node->next = right->next;
        } else {
            node->keys.push_back(parent->keys[index]);
            node->keys.insert(node->keys.end(), right->keys.begin(), right->keys.end());
            node->children.insert(node->children.end(), right->children.begin(), right->children.end());
            for (BPNode* c : right->children) c->parent = node;
        }
        parent->keys.erase(parent->keys.begin() + index);
        parent->children.erase(parent->children.begin() + index + 1);
        delete right;
    }

    if (parent == root && parent->keys.empty()) {
        root = parent->children[0];
        root->parent = nullptr;
        delete parent;
    } else if (parent != root) {
        int parentMin = (M - 1 + 1) / 2;
        if ((int)parent->keys.size() < parentMin) handleUnderflow(parent);
    }
}

void deleteKey(int val) {
    if (!root || !searchValue(val)) return;
    deleteFromLeaf(root, val);
}

// ─── Serialize ───────────────────────────────────────────────────────────────
std::string toJSON(BPNode* n) {
    if (!n) return "null";
    std::ostringstream o;
    o << "{\"id\":" << n->id
      << ",\"isLeaf\":" << (n->isLeaf ? "true" : "false")
      << ",\"keys\":[";
    for (int i = 0; i < (int)n->keys.size(); i++) {
        if (i) o << ",";
        o << n->keys[i];
    }
    o << "],\"children\":[";
    for (int i = 0; i < (int)n->children.size(); i++) {
        if (i) o << ",";
        o << toJSON(n->children[i]);
    }
    o << "],\"next\":" << (n->next ? std::to_string(n->next->id) : "null")
      << "}";
    return o.str();
}

std::string getField(const std::string& json, const std::string& key) {
    std::string s = "\"" + key + "\":";
    size_t pos = json.find(s);
    if (pos == std::string::npos) return "";
    pos += s.size();
    while (pos < json.size() && json[pos] == ' ') pos++;
    if (json[pos] == '"') {
        size_t end = json.find('"', pos + 1);
        return json.substr(pos + 1, end - pos - 1);
    }
    size_t end = pos;
    while (end < json.size() && json[end] != ',' && json[end] != '}') end++;
    return json.substr(pos, end - pos);
}

int main() {
    std::string line;
    while (std::getline(std::cin, line)) {
        if (line.empty()) continue;
        std::string cmd    = getField(line, "cmd");
        std::string valStr = getField(line, "value");
        std::string mStr   = getField(line, "M");
        std::string lStr   = getField(line, "L");

        if (cmd == "create") {
            M = mStr.empty() ? 3 : std::stoi(mStr);
            L = lStr.empty() ? 2 : std::stoi(lStr);
            nodeIdCounter = 0;
            root = new BPNode(true);
            std::cout << "{\"ok\":true,\"tree\":" << toJSON(root) << "}" << std::endl;

        } else if (cmd == "insert" && root && !valStr.empty()) {
            insert(std::stoi(valStr));
            std::cout << "{\"ok\":true,\"tree\":" << toJSON(root) << "}" << std::endl;

        } else if (cmd == "delete" && root && !valStr.empty()) {
            deleteKey(std::stoi(valStr));
            std::cout << "{\"ok\":true,\"tree\":" << toJSON(root) << "}" << std::endl;

        } else if (cmd == "search" && root && !valStr.empty()) {
            bool found = searchValue(std::stoi(valStr));
            std::cout << "{\"ok\":true,\"found\":" << (found ? "true" : "false")
                      << ",\"tree\":" << toJSON(root) << "}" << std::endl;

        } else if (cmd == "getTree") {
            std::cout << "{\"ok\":true,\"tree\":" << toJSON(root) << "}" << std::endl;

        } else if (cmd == "reset") {
            root = nullptr;
            nodeIdCounter = 0;
            std::cout << "{\"ok\":true,\"tree\":null}" << std::endl;

        } else {
            std::cout << "{\"ok\":false,\"error\":\"unknown command or tree not created\"}" << std::endl;
        }
    }
    return 0;
}
