// BST C++ - communicates via JSON over stdin/stdout
#include <iostream>
#include <string>
#include <sstream>

struct Node {
    int value;
    Node* left  = nullptr;
    Node* right = nullptr;
    Node(int v) : value(v) {}
};

Node* insert(Node* root, int val) {
    if (!root) return new Node(val);
    if (val < root->value) root->left  = insert(root->left,  val);
    else                   root->right = insert(root->right, val);
    return root;
}

Node* minNode(Node* n) { while (n->left) n = n->left; return n; }

Node* deleteNode(Node* root, int val) {
    if (!root) return nullptr;
    if      (val < root->value) root->left  = deleteNode(root->left,  val);
    else if (val > root->value) root->right = deleteNode(root->right, val);
    else {
        if (!root->left && !root->right) { delete root; return nullptr; }
        if (!root->left)  { Node* t = root->right; delete root; return t; }
        if (!root->right) { Node* t = root->left;  delete root; return t; }
        Node* tmp = minNode(root->right);
        root->value = tmp->value;
        root->right = deleteNode(root->right, tmp->value);
    }
    return root;
}

bool search(Node* root, int val) {
    if (!root) return false;
    if (val == root->value) return true;
    return val < root->value ? search(root->left, val) : search(root->right, val);
}

std::string toJSON(Node* n) {
    if (!n) return "null";
    std::ostringstream o;
    o << "{\"value\":" << n->value
      << ",\"left\":"  << toJSON(n->left)
      << ",\"right\":" << toJSON(n->right)
      << "}";
    return o.str();
}

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

int main() {
    Node* root = nullptr;
    std::string line;

    while (std::getline(std::cin, line)) {
        if (line.empty()) continue;
        std::string cmd    = getField(line, "cmd");
        std::string valStr = getField(line, "value");

        if (cmd == "insert" && !valStr.empty()) {
            root = insert(root, std::stoi(valStr));
            std::cout << "{\"ok\":true,\"tree\":" << toJSON(root) << "}" << std::endl;

        } else if (cmd == "delete" && !valStr.empty()) {
            root = deleteNode(root, std::stoi(valStr));
            std::cout << "{\"ok\":true,\"tree\":" << toJSON(root) << "}" << std::endl;

        } else if (cmd == "search" && !valStr.empty()) {
            bool found = search(root, std::stoi(valStr));
            std::cout << "{\"ok\":true,\"found\":" << (found ? "true" : "false")
                      << ",\"tree\":" << toJSON(root) << "}" << std::endl;

        } else if (cmd == "getTree") {
            std::cout << "{\"ok\":true,\"tree\":" << toJSON(root) << "}" << std::endl;

        } else if (cmd == "reset") {
            root = nullptr;
            std::cout << "{\"ok\":true,\"tree\":null}" << std::endl;

        } else {
            std::cout << "{\"ok\":false,\"error\":\"unknown command\"}" << std::endl;
        }
    }
    return 0;
}
