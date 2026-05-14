// Red-Black Tree C++ - communicates via JSON over stdin/stdout
#include <iostream>
#include <string>
#include <sstream>

enum Color { RED, BLACK };

struct Node {
    int value;
    Color color;
    Node* left   = nullptr;
    Node* right  = nullptr;
    Node* parent = nullptr;
    Node(int v) : value(v), color(RED) {}
};

Node* rbRoot = nullptr;

// ─── Rotations ───────────────────────────────────────────────────────────────
void rotateLeft(Node* x) {
    if (!x || !x->right) return;
    Node* y = x->right;
    x->right = y->left;
    if (y->left) y->left->parent = x;
    y->parent = x->parent;
    if (!x->parent)          rbRoot = y;
    else if (x == x->parent->left) x->parent->left  = y;
    else                           x->parent->right = y;
    y->left  = x;
    x->parent = y;
}

void rotateRight(Node* x) {
    if (!x || !x->left) return;
    Node* y = x->left;
    x->left = y->right;
    if (y->right) y->right->parent = x;
    y->parent = x->parent;
    if (!x->parent)           rbRoot = y;
    else if (x == x->parent->right) x->parent->right = y;
    else                            x->parent->left  = y;
    y->right  = x;
    x->parent = y;
}

// ─── Insert fix ──────────────────────────────────────────────────────────────
void fixInsert(Node* node) {
    while (node != rbRoot && node->parent && node->parent->color == RED) {
        Node* parent = node->parent;
        Node* gp     = parent->parent;
        if (!gp) break;

        if (parent == gp->left) {
            Node* uncle = gp->right;
            if (uncle && uncle->color == RED) {
                parent->color = BLACK;
                uncle->color  = BLACK;
                gp->color     = RED;
                node = gp;
            } else {
                if (node == parent->right) { node = parent; rotateLeft(node); }
                node->parent->color = BLACK;
                gp->color = RED;
                rotateRight(gp);
            }
        } else {
            Node* uncle = gp->left;
            if (uncle && uncle->color == RED) {
                parent->color = BLACK;
                uncle->color  = BLACK;
                gp->color     = RED;
                node = gp;
            } else {
                if (node == parent->left) { node = parent; rotateRight(node); }
                node->parent->color = BLACK;
                gp->color = RED;
                rotateLeft(gp);
            }
        }
    }
    if (rbRoot) rbRoot->color = BLACK;
}

void insert(int val) {
    Node* newNode = new Node(val);
    Node* parent  = nullptr;
    Node* cur     = rbRoot;
    while (cur) {
        parent = cur;
        if (val < cur->value) cur = cur->left;
        else                  cur = cur->right;
    }
    newNode->parent = parent;
    if (!parent)              rbRoot = newNode;
    else if (val < parent->value) parent->left  = newNode;
    else                          parent->right = newNode;
    fixInsert(newNode);
}

// ─── Delete fix ──────────────────────────────────────────────────────────────
void transplant(Node* u, Node* v) {
    if (!u->parent)          rbRoot = v;
    else if (u == u->parent->left) u->parent->left  = v;
    else                           u->parent->right = v;
    if (v) v->parent = u->parent;
}

Node* minimum(Node* n) { while (n->left) n = n->left; return n; }

void fixDelete(Node* x) {
    while (x != rbRoot && x && x->color == BLACK) {
        if (!x || !x->parent) break;
        if (x == x->parent->left) {
            Node* w = x->parent->right;
            if (!w) { x = x->parent; continue; }
            if (w->color == RED) {
                w->color = BLACK; x->parent->color = RED;
                rotateLeft(x->parent); w = x->parent->right;
            }
            if ((!w->left || w->left->color == BLACK) &&
                (!w->right || w->right->color == BLACK)) {
                w->color = RED; x = x->parent;
            } else {
                if (!w->right || w->right->color == BLACK) {
                    if (w->left) w->left->color = BLACK;
                    w->color = RED; rotateRight(w); w = x->parent->right;
                }
                w->color = x->parent->color;
                x->parent->color = BLACK;
                if (w->right) w->right->color = BLACK;
                rotateLeft(x->parent); x = rbRoot;
            }
        } else {
            Node* w = x->parent->left;
            if (!w) { x = x->parent; continue; }
            if (w->color == RED) {
                w->color = BLACK; x->parent->color = RED;
                rotateRight(x->parent); w = x->parent->left;
            }
            if ((!w->left || w->left->color == BLACK) &&
                (!w->right || w->right->color == BLACK)) {
                w->color = RED; x = x->parent;
            } else {
                if (!w->left || w->left->color == BLACK) {
                    if (w->right) w->right->color = BLACK;
                    w->color = RED; rotateLeft(w); w = x->parent->left;
                }
                w->color = x->parent->color;
                x->parent->color = BLACK;
                if (w->left) w->left->color = BLACK;
                rotateRight(x->parent); x = rbRoot;
            }
        }
    }
    if (x) x->color = BLACK;
}

void deleteNode(int val) {
    Node* node = rbRoot;
    while (node && node->value != val)
        node = val < node->value ? node->left : node->right;
    if (!node) return;

    Node* y = node;
    Color yOrig = y->color;
    Node* x;

    if (!node->left) {
        x = node->right;
        transplant(node, node->right);
    } else if (!node->right) {
        x = node->left;
        transplant(node, node->left);
    } else {
        y = minimum(node->right);
        yOrig = y->color;
        x = y->right;
        if (y->parent == node) {
            if (x) x->parent = y;
        } else {
            transplant(y, y->right);
            y->right = node->right;
            y->right->parent = y;
        }
        transplant(node, y);
        y->left = node->left;
        y->left->parent = y;
        y->color = node->color;
    }
    delete node;
    if (yOrig == BLACK) fixDelete(x);
}

bool search(Node* n, int val) {
    if (!n) return false;
    if (val == n->value) return true;
    return val < n->value ? search(n->left, val) : search(n->right, val);
}

// ─── Serialize ───────────────────────────────────────────────────────────────
std::string toJSON(Node* n) {
    if (!n) return "null";
    std::ostringstream o;
    o << "{\"value\":" << n->value
      << ",\"color\":\"" << (n->color == RED ? "red" : "black") << "\""
      << ",\"left\":"  << toJSON(n->left)
      << ",\"right\":" << toJSON(n->right)
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

        if (cmd == "insert" && !valStr.empty()) {
            insert(std::stoi(valStr));
            std::cout << "{\"ok\":true,\"tree\":" << toJSON(rbRoot) << "}" << std::endl;

        } else if (cmd == "delete" && !valStr.empty()) {
            deleteNode(std::stoi(valStr));
            std::cout << "{\"ok\":true,\"tree\":" << toJSON(rbRoot) << "}" << std::endl;

        } else if (cmd == "search" && !valStr.empty()) {
            bool found = search(rbRoot, std::stoi(valStr));
            std::cout << "{\"ok\":true,\"found\":" << (found ? "true" : "false")
                      << ",\"tree\":" << toJSON(rbRoot) << "}" << std::endl;

        } else if (cmd == "getTree") {
            std::cout << "{\"ok\":true,\"tree\":" << toJSON(rbRoot) << "}" << std::endl;

        } else if (cmd == "reset") {
            rbRoot = nullptr;
            std::cout << "{\"ok\":true,\"tree\":null}" << std::endl;

        } else {
            std::cout << "{\"ok\":false,\"error\":\"unknown command\"}" << std::endl;
        }
    }
    return 0;
}
