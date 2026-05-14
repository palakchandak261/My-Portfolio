const express   = require('express');
const router    = express.Router();

const AVL       = require('../trees/AVL');
const BTree     = require('../trees/BTree');
const BST       = require('../trees/BST');
const RBTree    = require('../trees/RBTree');
const BPlusTree = require('../trees/BPlusTree');

// Persistent tree instances — each backed by a C++ child process
const trees = {
    avl:      new AVL(),
    btree:    new BTree(2),
    bst:      new BST(),
    rbtree:   new RBTree(),
    bplustree: new BPlusTree(3, 2)
};

// ── POST /api/tree/:type/insert ──────────────────────────────────────────────
router.post('/:type/insert', async (req, res) => {
    try {
        const { type }  = req.params;
        const { value } = req.body;
        const tree = trees[type];
        if (!tree) return res.status(400).json({ error: 'Invalid tree type' });
        if (value === undefined || isNaN(value))
            return res.status(400).json({ error: 'Invalid number input' });

        await tree.insert(Number(value));
        res.json(tree.getTree());
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

// ── POST /api/tree/:type/delete ──────────────────────────────────────────────
router.post('/:type/delete', async (req, res) => {
    try {
        const { type }  = req.params;
        const { value } = req.body;
        const tree = trees[type];
        if (!tree) return res.status(400).json({ error: 'Invalid tree type' });
        if (value === undefined || isNaN(value))
            return res.status(400).json({ error: 'Invalid number input' });

        await tree.delete(Number(value));
        res.json(tree.getTree());
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

// ── GET /api/tree/:type/search/:value ────────────────────────────────────────
router.get('/:type/search/:value', async (req, res) => {
    try {
        const { type, value } = req.params;
        const tree = trees[type];
        if (!tree) return res.status(400).json({ error: 'Invalid tree type' });

        const result = await tree.search(Number(value));
        res.json(result);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

// ── POST /api/tree/:type/reset ───────────────────────────────────────────────
router.post('/:type/reset', async (req, res) => {
    try {
        const { type } = req.params;
        const tree = trees[type];
        if (!tree) return res.status(400).json({ error: 'Invalid tree type' });

        await tree.reset();
        res.json({ ok: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

// ── POST /api/tree/bplustree/create  (set M and L) ──────────────────────────
router.post('/bplustree/create', async (req, res) => {
    try {
        const { M, L } = req.body;
        if (!M || !L) return res.status(400).json({ error: 'M and L required' });
        // Replace the instance with new degrees
        trees.bplustree = new BPlusTree(Number(M), Number(L));
        await trees.bplustree._ready;
        res.json(trees.bplustree.getTree());
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
