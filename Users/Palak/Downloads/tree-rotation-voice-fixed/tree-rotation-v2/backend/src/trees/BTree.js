/**
 * BTree.js  –  thin JS wrapper around the C++ BTree executable.
 * Keeps the same public API: insert(key), getTree()
 */
const CppBridge = require('./CppBridge');

class BTree {
    constructor(t = 2) {
        this._bridge = new CppBridge('btree.exe');
        this._tree   = null;
        // Initialize the C++ process with the degree
        this._ready = this._bridge.send({ cmd: 'create', degree: t })
            .then(res => { this._tree = res.tree; });
    }

    async insert(key) {
        await this._ready;
        const res = await this._bridge.send({ cmd: 'insert', value: key });
        this._tree = res.tree;
        return res;
    }

    async delete(key) {
        await this._ready;
        const res = await this._bridge.send({ cmd: 'delete', value: key });
        this._tree = res.tree;
        return res;
    }

    async search(key) {
        await this._ready;
        const res = await this._bridge.send({ cmd: 'search', value: key });
        return res;
    }

    async reset() {
        await this._ready;
        const res = await this._bridge.send({ cmd: 'reset' });
        this._tree = res.tree;
        return res;
    }

    getTree() {
        return this._tree;
    }
}

module.exports = BTree;
