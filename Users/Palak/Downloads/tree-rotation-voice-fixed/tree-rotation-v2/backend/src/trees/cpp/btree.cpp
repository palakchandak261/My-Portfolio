// B-Tree C++ - communicates via JSON over stdin/stdout
#include <iostream>
#include <string>
#include <sstream>
#include <vector>
#include <algorithm>

// ─── Node ────────────────────────────────────────────────────────────────────
struct BNode {
    int t;
    bool leaf;
    std::vector<int> keys;
    std::vector<BNode*> children;
    BNode(int t, bool leaf) : t(t), leaf(leaf) {}
};
// ─── BTree ───────────────────────────────────────────────────────────────────
struct BTree {
    int t;
    BNode* root;

    BTree(int t) : t(t) {
        root = new BNode(t, true);
    }

    void insertNonFull(BNode* node, int k) {
        int i = (int)node->keys.size() - 1;
        if (node->leaf) {
            node->keys.push_back(0);
            while (i >= 0 && k < node->keys[i]) {
                node->keys[i + 1] = node->keys[i];
                i--;
            }
            node->keys[i + 1] = k;
        } else {
            while (i >= 0 && k < node->keys[i]) i--;
            i++;
            if ((int)node->children[i]->keys.size() == 2 * t - 1) {
                splitChild(node, i);
                if (k > node->keys[i]) i++;
            }
            insertNonFull(node->children[i], k);
        }
    }

    void splitChild(BNode* parent, int i) {
        BNode* full = parent->children[i];
        BNode* newNode = new BNode(t, full->leaf);

        parent->keys.insert(parent->keys.begin() + i, full->keys[t - 1]);
        parent->children.insert(parent->children.begin() + i + 1, newNode);

        newNode->keys.assign(full->keys.begin() + t, full->keys.end());
        full->keys.resize(t - 1);

        if (!full->leaf) {
            newNode->children.assign(full->children.begin() + t, full->children.end());
            full->children.resize(t);
        }
    }

    void insert(int k) {
        if ((int)root->keys.size() == 2 * t - 1) {
            BNode* newRoot = new BNode(t, false);
            newRoot->children.push_back(root);
            splitChild(newRoot, 0);
            root = newRoot;
            insertNonFull(newRoot, k);
        } else {
            insertNonFull(root, k);
        }
    }

    // ── Delete helpers ──────────────────────────────────────────────────────
    int findKey(BNode* node, int k) {
        int idx = 0;
        while (idx < (int)node->keys.size() && node->keys[idx] < k) idx++;
        return idx;
    }

    int getPred(BNode* node) {
        while (!node->leaf) node = node->children.back();
        return node->keys.back();
    }

    int getSucc(BNode* node) {
        while (!node->leaf) node = node->children[0];
        return node->keys[0];
    }

    void borrowFromPrev(BNode* node, int idx) {
        BNode* child   = node->children[idx];
        BNode* sibling = node->children[idx - 1];
        child->keys.insert(child->keys.begin(), node->keys[idx - 1]);
        if (!child->leaf) child->children.insert(child->children.begin(), sibling->children.back());
        node->keys[idx - 1] = sibling->keys.back();
        sibling->keys.pop_back();
        if (!sibling->leaf) sibling->children.pop_back();
    }

    void borrowFromNext(BNode* node, int idx) {
        BNode* child   = node->children[idx];
        BNode* sibling = node->children[idx + 1];
        child->keys.push_back(node->keys[idx]);
        if (!child->leaf) child->children.push_back(sibling->children[0]);
        node->keys[idx] = sibling->keys[0];
        sibling->keys.erase(sibling->keys.begin());
        if (!sibling->leaf) sibling->children.erase(sibling->children.begin());
    }

    void merge(BNode* node, int idx) {
        BNode* child   = node->children[idx];
        BNode* sibling = node->children[idx + 1];
        child->keys.push_back(node->keys[idx]);
        child->keys.insert(child->keys.end(), sibling->keys.begin(), sibling->keys.end());
        if (!child->leaf)
            child->children.insert(child->children.end(), sibling->children.begin(), sibling->children.end());
        node->keys.erase(node->keys.begin() + idx);
        node->children.erase(node->children.begin() + idx + 1);
        delete sibling;
    }

    void fill(BNode* node, int idx) {
        if (idx != 0 && (int)node->children[idx - 1]->keys.size() >= t)
            borrowFromPrev(node, idx);
        else if (idx != (int)node->keys.size() && (int)node->children[idx + 1]->keys.size() >= t)
            borrowFromNext(node, idx);
        else {
            if (idx != (int)node->keys.size()) merge(node, idx);
            else merge(node, idx - 1);
        }
    }

    void deleteInternal(BNode* node, int k, int idx) {
        BNode* pred = node->children[idx];
        BNode* succ = node->children[idx + 1];
        if ((int)pred->keys.size() >= t) {
            int p = getPred(pred);
            node->keys[idx] = p;
            deleteNode(pred, p);
        } else if ((int)succ->keys.size() >= t) {
            int s = getSucc(succ);
            node->keys[idx] = s;
            deleteNode(succ, s);
        } else {
            merge(node, idx);
            deleteNode(pred, k);
        }
    }

    void deleteNode(BNode* node, int k) {
        int idx = findKey(node, k);
        if (idx < (int)node->keys.size() && node->keys[idx] == k) {
            if (node->leaf) node->keys.erase(node->keys.begin() + idx);
            else deleteInternal(node, k, idx);
        } else {
            if (node->leaf) return; // not found
            bool flag = (idx == (int)node->keys.size());
            if ((int)node->children[idx]->keys.size() < t) fill(node, idx);
            if (flag && idx > (int)node->keys.size()) deleteNode(node->children[idx - 1], k);
            else deleteNode(node->children[idx], k);
        }
    }

    void deleteKey(int k) {
        deleteNode(root, k);
        if (root->keys.empty() && !root->leaf) {
            BNode* old = root;
            root = root->children[0];
            delete old;
        }
    }

    bool search(BNode* node, int k) {
        int i = 0;
        while (i < (int)node->keys.size() && k > node->keys[i]) i++;
        if (i < (int)node->keys.size() && node->keys[i] == k) return true;
        if (node->leaf) return false;
        return search(node->children[i], k);
    }

    void reset() {
        root = new BNode(t, true);
    }
};

// ─── Serialize ───────────────────────────────────────────────────────────────
std::string toJSON(BNode* n) {
    if (!n) return "null";
    std::ostringstream o;
    o << "{\"t\":" << n->t
      << ",\"leaf\":" << (n->leaf ? "true" : "false")
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
    o << "]}";
    return o.str();
}

// ─── JSON field extractor ────────────────────────────────────────────────────
std::string getField(const std::string& json, const std::string& key) {
    std::string search = "\"" + key + "\":";
    size_t pos = json.find(search);
    if (pos == std::string::npos) return "";
    pos += search.size();
    while (pos < json.size() && json[pos] == ' ') pos++;
    if (json[pos] == '"') {
        size_t end = json.find('"', pos + 1);
        return json.substr(pos + 1, end - pos - 1);
    }
    size_t end = pos;
    while (end < json.size() && json[end] != ',' && json[end] != '}') end++;
    return json.substr(pos, end - pos);
}

// ─── Main ────────────────────────────────────────────────────────────────────
int main() {
    BTree* tree = nullptr;
    std::string line;

    while (std::getline(std::cin, line)) {
        if (line.empty()) continue;

        std::string cmd     = getField(line, "cmd");
        std::string valStr  = getField(line, "value");
        std::string degStr  = getField(line, "degree");

        if (cmd == "create") {
            int deg = degStr.empty() ? 2 : std::stoi(degStr);
            delete tree;
            tree = new BTree(deg);
            std::cout << "{\"ok\":true,\"tree\":" << toJSON(tree->root) << "}" << std::endl;

        } else if (cmd == "insert" && tree && !valStr.empty()) {
            tree->insert(std::stoi(valStr));
            std::cout << "{\"ok\":true,\"tree\":" << toJSON(tree->root) << "}" << std::endl;

        } else if (cmd == "delete" && tree && !valStr.empty()) {
            tree->deleteKey(std::stoi(valStr));
            std::cout << "{\"ok\":true,\"tree\":" << toJSON(tree->root) << "}" << std::endl;

        } else if (cmd == "search" && tree && !valStr.empty()) {
            bool found = tree->search(tree->root, std::stoi(valStr));
            std::cout << "{\"ok\":true,\"found\":" << (found ? "true" : "false")
                      << ",\"tree\":" << toJSON(tree->root) << "}" << std::endl;

        } else if (cmd == "getTree" && tree) {
            std::cout << "{\"ok\":true,\"tree\":" << toJSON(tree->root) << "}" << std::endl;

        } else if (cmd == "reset" && tree) {
            tree->reset();
            std::cout << "{\"ok\":true,\"tree\":" << toJSON(tree->root) << "}" << std::endl;

        } else {
            std::cout << "{\"ok\":false,\"error\":\"unknown command or tree not created\"}" << std::endl;
        }
    }
    return 0;
}
