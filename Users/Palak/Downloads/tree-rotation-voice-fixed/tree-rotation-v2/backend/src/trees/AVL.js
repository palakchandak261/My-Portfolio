/**
 * AVL.js  –  thin JS wrapper around the C++ AVL executable.
 * Keeps the same public API: insert(value), getTree()
 */
const CppBridge = require('./CppBridge');

class AVLTree {
    constructor() {
        this._bridge = new CppBridge('avl.exe');
        this._tree   = null;
    }

    async insert(value) {
        const res = await this._bridge.send({ cmd: 'insert', value });
        this._tree = res.tree;
        return res;
    }

    async delete(value) {
        const res = await this._bridge.send({ cmd: 'delete', value });
        this._tree = res.tree;
        return res;
    }

    async search(value) {
        const res = await this._bridge.send({ cmd: 'search', value });
        return res;
    }

    async reset() {
        const res = await this._bridge.send({ cmd: 'reset' });
        this._tree = null;
        return res;
    }

    getTree() {
        return this._tree;
    }
}

module.exports = AVLTree;
