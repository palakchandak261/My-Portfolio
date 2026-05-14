// AVL Tree C++ - communicates via JSON over stdin/stdout
#include <iostream>
#include <string>
#include <sstream>
#include <vector>
#include <algorithm>
#include <cmath>

// ─── JSON helpers (minimal, no external deps) ────────────────────────────────
std::string escStr(const std::string& s) { return "\"" + s + "\""; }
std::string jNum(int n) { std::ostringstream o; o << n; return o.str(); }

// ─── Node ────────────────────────────────────────────────────────────────────
struct Node {
    int value;
    Node* left  = nullptr;
    Node* right = nullptr;
    int   height = 1;
    Node(int v) : value(v) {}
};

// ─── AVL helpers ─────────────────────────────────────────────────────────────
int ht(Node* n) { return n ? n->height : 0; }
int bf(Node* n) { return n ? ht(n->left) - ht(n->right) : 0; }
void upd(Node* n) {
    if (n) n->height = 1 + std::max(ht(n->left), ht(n->right));
}

Node* rotR(Node* y) {
    Node* x  = y->left;
    Node* T2 = x->right;
    x->right = y;
    y->left  = T2;
    upd(y); upd(x);
    return x;
}
Node* rotL(Node* x) {
    Node* y  = x->right;
    Node* T2 = y->left;
    y->left  = x;
    x->right = T2;
    upd(x); upd(y);
    return y;
}

Node* insert(Node* node, int val) {
    if (!node) return new Node(val);
    if (val < node->value)      node->left  = insert(node->left,  val);
    else if (val > node->value) node->right = insert(node->right, val);
    else return node; // duplicate

    upd(node);
    int b = bf(node);

    if (b > 1  && val < node->left->value)  return rotR(node);
    if (b < -1 && val > node->right->value) return rotL(node);
    if (b > 1  && val > node->left->value)  { node->left  = rotL(node->left);  return rotR(node); }
    if (b < -1 && val < node->right->value) { node->right = rotR(node->right); return rotL(node); }
    return node;
}

Node* minNode(Node* n) { while (n->left) n = n->left; return n; }

Node* deleteNode(Node* node, int val) {
    if (!node) return nullptr;
    if      (val < node->value) node->left  = deleteNode(node->left,  val);
    else if (val > node->value) node->right = deleteNode(node->right, val);
    else {
        if (!node->left || !node->right) {
            Node* tmp = node->left ? node->left : node->right;
            delete node;
            return tmp;
        }
        Node* tmp = minNode(node->right);
        node->value = tmp->value;
        node->right = deleteNode(node->right, tmp->value);
    }
    upd(node);
    int b = bf(node);
    if (b > 1  && bf(node->left)  >= 0) return rotR(node);
    if (b > 1  && bf(node->left)  <  0) { node->left  = rotL(node->left);  return rotR(node); }
    if (b < -1 && bf(node->right) <= 0) return rotL(node);
    if (b < -1 && bf(node->right) >  0) { node->right = rotR(node->right); return rotL(node); }
    return node;
}

bool searchNode(Node* node, int val) {
    if (!node) return false;
    if (val == node->value) return true;
    return val < node->value ? searchNode(node->left, val) : searchNode(node->right, val);
}

// ─── Serialize to JSON ───────────────────────────────────────────────────────
std::string toJSON(Node* n) {
    if (!n) return "null";
    std::ostringstream o;
    o << "{\"value\":" << n->value
      << ",\"height\":" << n->height
      << ",\"left\":"  << toJSON(n->left)
      << ",\"right\":" << toJSON(n->right)
      << "}";
    return o.str();
}

// ─── Simple JSON field extractor ─────────────────────────────────────────────
std::string getField(const std::string& json, const std::string& key) {
    std::string search = "\"" + key + "\":";
    size_t pos = json.find(search);
    if (pos == std::string::npos) return "";
    pos += search.size();
    // skip whitespace
    while (pos < json.size() && json[pos] == ' ') pos++;
    if (json[pos] == '"') {
        size_t end = json.find('"', pos + 1);
        return json.substr(pos + 1, end - pos - 1);
    }
    size_t end = pos;
    while (end < json.size() && json[end] != ',' && json[end] != '}') end++;
    return json.substr(pos, end - pos);
}

// ─── Main loop ───────────────────────────────────────────────────────────────
int main() {
    Node* root = nullptr;
    std::string line;

    while (std::getline(std::cin, line)) {
        if (line.empty()) continue;

        std::string cmd = getField(line, "cmd");
        std::string valStr = getField(line, "value");

        if (cmd == "insert" && !valStr.empty()) {
            int val = std::stoi(valStr);
            root = insert(root, val);
            std::cout << "{\"ok\":true,\"tree\":" << toJSON(root) << "}" << std::endl;

        } else if (cmd == "delete" && !valStr.empty()) {
            int val = std::stoi(valStr);
            root = deleteNode(root, val);
            std::cout << "{\"ok\":true,\"tree\":" << toJSON(root) << "}" << std::endl;

        } else if (cmd == "search" && !valStr.empty()) {
            int val = std::stoi(valStr);
            bool found = searchNode(root, val);
            std::cout << "{\"ok\":true,\"found\":" << (found ? "true" : "false")
                      << ",\"tree\":" << toJSON(root) << "}" << std::endl;

        } else if (cmd == "getTree") {
            std::cout << "{\"ok\":true,\"tree\":" << toJSON(root) << "}" << std::endl;

        } else if (cmd == "reset") {
            // free memory
            root = nullptr;
            std::cout << "{\"ok\":true,\"tree\":null}" << std::endl;

        } else {
            std::cout << "{\"ok\":false,\"error\":\"unknown command\"}" << std::endl;
        }
    }
    return 0;
}
