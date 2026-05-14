const CppBridge = require('./CppBridge');

class BPlusTree {
    constructor(M = 3, L = 2) {
        this._bridge = new CppBridge('bplustree.exe');
        this._tree   = null;
        this._ready  = this._bridge.send({ cmd: 'create', M, L })
            .then(res => { this._tree = res.tree; });
    }
    async insert(value) {
        await this._ready;
        const res = await this._bridge.send({ cmd: 'insert', value });
        this._tree = res.tree; return res;
    }
    async delete(value) {
        await this._ready;
        const res = await this._bridge.send({ cmd: 'delete', value });
        this._tree = res.tree; return res;
    }
    async search(value) {
        await this._ready;
        return this._bridge.send({ cmd: 'search', value });
    }
    async reset() {
        await this._ready;
        const res = await this._bridge.send({ cmd: 'reset' });
        this._tree = null; return res;
    }
    getTree() { return this._tree; }
}
module.exports = BPlusTree;
