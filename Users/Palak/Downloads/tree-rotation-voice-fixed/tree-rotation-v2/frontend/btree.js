/**********************
 * VOICE ENGINE (FIXED)
 **********************/
let speakQueue = [];
let isSpeaking = false;

// Chrome has a bug where speechSynthesis pauses silently after ~15s
// Keep it alive with a periodic resume
setInterval(() => {
    if (window.speechSynthesis && window.speechSynthesis.speaking) {
        window.speechSynthesis.resume();
    }
}, 5000);

function speak(text) {
    if (!("speechSynthesis" in window)) return;

    // Add to queue
    speakQueue.push(text);
    processQueue();
}

function processQueue() {
    if (isSpeaking || speakQueue.length === 0) return;

    isSpeaking = true;
    const text = speakQueue.shift();

    // Cancel anything currently playing before starting new
    window.speechSynthesis.cancel();

    // Small delay after cancel so browser resets cleanly
    setTimeout(() => {
        const speech = new SpeechSynthesisUtterance(text);
        speech.rate = 1;
        speech.pitch = 1.2;
        speech.volume = 1;

        // Wait for voices to be loaded (important on first load)
        const setVoice = () => {
            const voices = window.speechSynthesis.getVoices();
            if (voices.length > 0) {
                speech.voice = voices.find(v => v.lang.startsWith("en") && v.name.toLowerCase().includes("female"))
                    || voices.find(v => v.lang.startsWith("en"))
                    || voices[0];
            }
        };

        if (window.speechSynthesis.getVoices().length === 0) {
            window.speechSynthesis.addEventListener("voiceschanged", setVoice, { once: true });
        } else {
            setVoice();
        }

        speech.onend = () => {
            isSpeaking = false;
            processQueue(); // speak next in queue
        };

        speech.onerror = () => {
            isSpeaking = false;
            processQueue(); // skip errored item, continue
        };

        window.speechSynthesis.speak(speech);
    }, 100);
}

/**********************
 * B-TREE IMPLEMENTATION
 **********************/

const treeSVG = document.getElementById("tree");

let searchPath = []; // 🔍 track search highlighting (stores node IDs)

class BTreeNode {
    constructor(t, leaf = false) {
        this.t = t;
        this.leaf = leaf;
        this.keys = [];
        this.children = [];
        this.id = Math.random();
    }
}

class BTree {
    constructor(order) {
        this.order = order;
        this.t = Math.ceil(order / 2);
        this.root = new BTreeNode(this.t, true);
    }

    /**********************
     * SEARCH
     **********************/
    search(node, key, path = []) {
        let i = 0;

        while (i < node.keys.length && key > node.keys[i]) i++;

        path.push(node.id); // ✅ track the node visited, not keys

        if (i < node.keys.length && node.keys[i] === key) {
            return true;
        }

        if (node.leaf) return false;

        return this.search(node.children[i], key, path);
    }

    /**********************
     * INSERT
     **********************/
    insert(key) {
        let r = this.root;

        if (r.keys.length === this.order - 1) {
            const s = new BTreeNode(this.t, false);
            this.root = s;
            s.children[0] = r;

            speak(`Splitting root node`);

            this.splitChild(s, 0);
            this.insertNonFull(s, key);
        } else {
            this.insertNonFull(r, key);
        }
    }

    insertNonFull(node, key) {
        let i = node.keys.length - 1;

        if (node.leaf) {
            node.keys.push(0);
            while (i >= 0 && key < node.keys[i]) {
                node.keys[i + 1] = node.keys[i];
                i--;
            }
            node.keys[i + 1] = key;

            speak(`Inserted ${key} in leaf node`);
        } else {
            while (i >= 0 && key < node.keys[i]) i--;
            i++;

            if (node.children[i].keys.length === this.order - 1) {
                speak(`Splitting child node`);

                highlightNode(node.children[i]);
                this.splitChild(node, i);

                if (key > node.keys[i]) i++;
            }

            this.insertNonFull(node.children[i], key);
        }
    }

    splitChild(parent, i) {
        const t = this.t;
        const y = parent.children[i];
        const z = new BTreeNode(t, y.leaf);

        const mid = y.keys[t - 1];

        z.keys = y.keys.slice(t);
        y.keys = y.keys.slice(0, t - 1);

        if (!y.leaf) {
            z.children = y.children.slice(t);
            y.children = y.children.slice(0, t);
        }

        parent.children.splice(i + 1, 0, z);
        parent.keys.splice(i, 0, mid);
    }

    /**********************
     * DELETE
     **********************/
    delete(key) {
        this.deleteNode(this.root, key);

        if (this.root.keys.length === 0 && !this.root.leaf) {
            this.root = this.root.children[0];
        }
    }

    deleteNode(node, key) {
        let idx = this.findKey(node, key);

        // CASE 1: key in node
        if (idx < node.keys.length && node.keys[idx] === key) {

            if (node.leaf) {
                speak(`Deleting ${key} from leaf`);
                node.keys.splice(idx, 1);
            } else {
                this.deleteInternal(node, key, idx);
            }

        } else {
            if (node.leaf) {
                speak(`Value ${key} not found`);
                return;
            }

            let flag = (idx === node.keys.length);

            if (node.children[idx].keys.length < this.t) {
                this.fill(node, idx);
            }

            if (flag && idx > node.keys.length) {
                this.deleteNode(node.children[idx - 1], key);
            } else {
                this.deleteNode(node.children[idx], key);
            }
        }
    }

    deleteInternal(node, key, idx) {
        const predChild = node.children[idx];
        const succChild = node.children[idx + 1];

        if (predChild.keys.length >= this.t) {
            let pred = this.getPredecessor(predChild);
            speak(`Replacing with predecessor ${pred}`);
            node.keys[idx] = pred;
            this.deleteNode(predChild, pred);
        }
        else if (succChild.keys.length >= this.t) {
            let succ = this.getSuccessor(succChild);
            speak(`Replacing with successor ${succ}`);
            node.keys[idx] = succ;
            this.deleteNode(succChild, succ);
        }
        else {
            speak(`Merging nodes`);
            this.merge(node, idx);
            this.deleteNode(predChild, key);
        }
    }

    getPredecessor(node) {
        while (!node.leaf) node = node.children[node.children.length - 1];
        return node.keys[node.keys.length - 1];
    }

    getSuccessor(node) {
        while (!node.leaf) node = node.children[0];
        return node.keys[0];
    }

    fill(node, idx) {
        if (idx !== 0 && node.children[idx - 1].keys.length >= this.t) {
            this.borrowFromPrev(node, idx);
        }
        else if (idx !== node.keys.length && node.children[idx + 1].keys.length >= this.t) {
            this.borrowFromNext(node, idx);
        }
        else {
            if (idx !== node.keys.length) this.merge(node, idx);
            else this.merge(node, idx - 1);
        }
    }

    borrowFromPrev(node, idx) {
        const child = node.children[idx];
        const sibling = node.children[idx - 1];

        child.keys.unshift(node.keys[idx - 1]);

        if (!child.leaf) {
            child.children.unshift(sibling.children.pop());
        }

        node.keys[idx - 1] = sibling.keys.pop();
    }

    borrowFromNext(node, idx) {
        const child = node.children[idx];
        const sibling = node.children[idx + 1];

        child.keys.push(node.keys[idx]);

        if (!child.leaf) {
            child.children.push(sibling.children.shift());
        }

        node.keys[idx] = sibling.keys.shift();
    }

    merge(node, idx) {
        const child = node.children[idx];
        const sibling = node.children[idx + 1];

        child.keys.push(node.keys[idx]);
        child.keys = child.keys.concat(sibling.keys);

        if (!child.leaf) {
            child.children = child.children.concat(sibling.children);
        }

        node.keys.splice(idx, 1);
        node.children.splice(idx + 1, 1);
    }

    findKey(node, key) {
        let idx = 0;
        while (idx < node.keys.length && node.keys[idx] < key) idx++;
        return idx;
    }
}

let btree = null;

/**********************
 * CREATE TREE
 **********************/
function createTree() {
    const order = Number(document.getElementById("order").value);

    if (order < 3) {
        alert("Order must be at least 3");
        return;
    }

    btree = new BTree(order);
    treeSVG.innerHTML = "";

    speak(`Created B Tree of order ${order}`);
}

/**********************
 * INSERT
 **********************/
function insert() {
    const value = Number(document.getElementById("value").value);

    if (!btree) return alert("Create tree first!");
    if (isNaN(value)) return;

    btree.insert(value);
    render();
}

/**********************
 * SEARCH
 **********************/
function searchNode() {
    const value = Number(document.getElementById("value").value);
    searchPath = [];

    const found = btree.search(btree.root, value, searchPath);

    render();

    if (found) speak(`Value ${value} found`);
    else speak(`Value ${value} not found`);

    setTimeout(() => {
        searchPath = [];
        render();
    }, 2000);
}

/**********************
 * DELETE
 **********************/
function deleteNode() {
    const value = Number(document.getElementById("value").value);

    if (!btree) return;
    if (isNaN(value)) return;

    btree.delete(value);

    render();
}

/**********************
 * RENDER TREE
 **********************/
function render() {
    treeSVG.innerHTML = "";
    const width = treeSVG.clientWidth;
    const positions = calculatePositions(btree.root, width);

    drawTree(btree.root, positions);
}

/**********************
 * POSITION
 **********************/
function calculatePositions(node, width) {
    const positions = new Map();

    function helper(node, depth, xMin, xMax) {
        if (!node) return;

        const x = (xMin + xMax) / 2;
        const y = 80 + depth * 120;

        positions.set(node.id, { x, y });

        const childWidth = (xMax - xMin) / node.children.length;

        node.children.forEach((child, i) => {
            helper(child, depth + 1,
                xMin + i * childWidth,
                xMin + (i + 1) * childWidth
            );
        });
    }

    helper(node, 0, 0, width);
    return positions;
}

/**********************
 * DRAW TREE
 **********************/
function drawTree(node, positions) {
    if (!node) return;

    const { x, y } = positions.get(node.id);

    const keyWidth = 45;
    const nodeWidth = node.keys.length * keyWidth;
    const startX = x - nodeWidth / 2;

    const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    rect.setAttribute("x", startX);
    rect.setAttribute("y", y);
    rect.setAttribute("width", nodeWidth);
    rect.setAttribute("height", 40);

    // 🔍 Highlight search path using CSS class (overrides svg rect CSS rule)
    if (searchPath.includes(node.id)) {
        rect.setAttribute("class", "node-search");
    } else {
        rect.setAttribute("class", "node-normal");
    }

    rect.setAttribute("rx", 8);
    rect.setAttribute("stroke", "#5e5f06");
    rect.setAttribute("stroke-width", "2");

    treeSVG.appendChild(rect);

    node.keys.forEach((key, i) => {
        const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
        text.setAttribute("x", startX + i * keyWidth + keyWidth / 2);
        text.setAttribute("y", y + 25);
        text.setAttribute("text-anchor", "middle");
        text.setAttribute("fill", "white");
        text.setAttribute("font-weight", "bold");
        text.textContent = key;
        treeSVG.appendChild(text);
    });

    node.children.forEach(child => {
        const childPos = positions.get(child.id);

        const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
        line.setAttribute("x1", x);
        line.setAttribute("y1", y + 40);
        line.setAttribute("x2", childPos.x);
        line.setAttribute("y2", childPos.y);
        line.setAttribute("stroke", "#94a3b8");
        treeSVG.appendChild(line);

        drawTree(child, positions);
    });
}

/**********************
 * ANIMATION
 **********************/
function highlightNode(node) {
    setTimeout(() => render(), 300);
}