const CppBridge = require('./CppBridge');

class RBTree {
    constructor() {
        this._bridge = new CppBridge('rbtree.exe');
        this._tree   = null;
    }
    async insert(value) {
        const res = await this._bridge.send({ cmd: 'insert', value });
        this._tree = res.tree; return res;
    }
    async delete(value) {
        const res = await this._bridge.send({ cmd: 'delete', value });
        this._tree = res.tree; return res;
    }
    async search(value) { return this._bridge.send({ cmd: 'search', value }); }
    async reset() {
        const res = await this._bridge.send({ cmd: 'reset' });
        this._tree = null; return res;
    }
    getTree() { return this._tree; }
}
module.exports = RBTree;
