/**********************
 * VOICE ENGINE
 **********************/
let voiceEnabled = true;
let currentStep = -1;

function speak(text) {
    if (!("speechSynthesis" in window) || !voiceEnabled) return;

    const speech = new SpeechSynthesisUtterance(text);
    speech.rate = 1;
    speech.pitch = 1.2;

    const voices = speechSynthesis.getVoices();
    speech.voice = voices.find(v => v.name.includes("Female")) || voices[0];

    speechSynthesis.speak(speech);
}

let root = null;
let M = 0;
let L = 0;
let searchPath = [];

/**********************
 * NODE
 **********************/
let nodeIdCounter = 0;

class Node {
    constructor(isLeaf = false) {
        this.id = nodeIdCounter++;   // ✅ UNIQUE ID
        this.keys = [];
        this.children = [];
        this.isLeaf = isLeaf;
        this.next = null;
        this.parent = null;
        this.x = 0;
        this.y = 0;
    }
}

/**********************
 * CREATE TREE
 **********************/
function createTree() {
    M = parseInt(document.getElementById("internalDegree").value);
    L = parseInt(document.getElementById("leafDegree").value);

    if (!M || !L || M < 3 || L < 2) {
        alert("Invalid degree");
        return;
    }

    root = new Node(true);
    speak(`Created B Plus Tree`);
    drawTree();
}

/**********************
 * SEARCH
 **********************/
function searchNode() {
    const value = parseInt(document.getElementById("value").value);
    if (isNaN(value)) return;

    searchPath = [];
    currentStep = -1;

    let node = root;

    while (!node.isLeaf) {
       searchPath.push(node.id);
        let i = 0;
        while (i < node.keys.length && value >= node.keys[i]) i++;
        node = node.children[i];
    }

    searchPath.push(node.id); // leaf

    animateSearch(value);
}

function animateSearch(value) {
    let i = 0;

    const interval = setInterval(() => {
        if (i >= searchPath.length) {
            clearInterval(interval);

            const found = searchPath[searchPath.length - 1].keys.includes(value);

            if (found) speak(`Value ${value} found`);
            else speak(`Value ${value} not found`);

            setTimeout(() => {
                searchPath = [];
                currentStep = -1;
                drawTree();
            }, 1500);

            return;
        }

        currentStep = i;
        drawTree();
        i++;

    }, 500); // speed of animation
}

/**********************
 * INSERT
 **********************/
function insert() {
    if (!root) return alert("Create tree first");

    const value = parseInt(document.getElementById("value").value);
    if (isNaN(value)) return;

    if (searchValue(value)) {
        speak(`Value ${value} already exists`);
        return;
    }

    const leaf = findLeaf(root, value);
    leaf.keys.push(value);
    leaf.keys.sort((a, b) => a - b);

    speak(`Inserted ${value} in leaf`);

    if (leaf.keys.length > L) {
        speak(`Splitting leaf node`);
        splitLeaf(leaf);
    }

    drawTree();
}

function searchValue(value) {
    let node = root;
    while (!node.isLeaf) {
        let i = 0;
        while (i < node.keys.length && value >= node.keys[i]) i++;
        node = node.children[i];
    }
    return node.keys.includes(value);
}

/**********************
 * SPLIT
 **********************/
function splitLeaf(leaf) {
    const newLeaf = new Node(true);
    const mid = Math.ceil(L / 2);

    newLeaf.keys = leaf.keys.splice(mid);
    newLeaf.next = leaf.next;
    leaf.next = newLeaf;
    newLeaf.parent = leaf.parent;

    const promoteKey = newLeaf.keys[0];

    if (!leaf.parent) {
        const newRoot = new Node(false);
        newRoot.keys = [promoteKey];
        newRoot.children = [leaf, newLeaf];
        leaf.parent = newRoot;
        newLeaf.parent = newRoot;
        root = newRoot;
        speak(`New root created`);
    } else {
        insertIntoInternal(leaf.parent, promoteKey, newLeaf);
    }
}

function insertIntoInternal(node, key, newChild) {
    let i = 0;
    while (i < node.keys.length && key > node.keys[i]) i++;
    node.keys.splice(i, 0, key);
    node.children.splice(i + 1, 0, newChild);
    newChild.parent = node;

    if (node.children.length > M) {
        speak(`Splitting internal node`);
        splitInternal(node);
    }
}

function splitInternal(node) {
    const newInternal = new Node(false);
    const midIndex = Math.floor(M / 2);
    const promoteKey = node.keys[midIndex];

    newInternal.keys = node.keys.splice(midIndex + 1);
    node.keys.splice(midIndex);

    newInternal.children = node.children.splice(midIndex + 1);
    newInternal.children.forEach(c => c.parent = newInternal);

    if (!node.parent) {
        const newRoot = new Node(false);
        newRoot.keys = [promoteKey];
        newRoot.children = [node, newInternal];
        node.parent = newRoot;
        newInternal.parent = newRoot;
        root = newRoot;
        speak(`New root created`);
    } else {
        insertIntoInternal(node.parent, promoteKey, newInternal);
    }
}

/**********************
 * DELETE
 **********************/
function deleteNode() {
    const value = parseInt(document.getElementById("value").value);
    if (isNaN(value)) return;

    if (!searchValue(value)) {
        speak(`Value ${value} not found`);
        return;
    }

    searchPath = [];
    deleteFromLeaf(root, value);

    speak(`Deleted ${value}`);
    drawTree();
}

function deleteFromLeaf(node, value) {
    if (!node.isLeaf) {
        // Traverse to the correct child
        let i = 0;
        while (i < node.keys.length && value >= node.keys[i]) i++;
        deleteFromLeaf(node.children[i], value);
        return;
    }

    // Remove the value from leaf
    node.keys = node.keys.filter(k => k !== value);

    // Update parent separator key if needed
    if (node.parent) {
        const parent = node.parent;
        const indexInParent = parent.children.indexOf(node);

        // If the deleted value was used as a key in the parent, replace it
        if (indexInParent > 0 && parent.keys[indexInParent - 1] === value) {
            parent.keys[indexInParent - 1] = node.keys[0] || (node.next ? node.next.keys[0] : null);
        }
    }

    // If root and empty, set root to null
    if (node === root) {
        if (node.keys.length === 0) root = null;
        drawTree();
        return;
    }

    // Handle underflow if leaf has less than minimum keys
    const minKeys = Math.ceil(L / 2);
    if (node.keys.length < minKeys) handleUnderflow(node);

    drawTree();
}
function handleUnderflow(node) {
    const parent = node.parent;
    const index = parent.children.indexOf(node);
    const left = index > 0 ? parent.children[index - 1] : null;
    const right = index < parent.children.length - 1 ? parent.children[index + 1] : null;
    const minKeys = node.isLeaf ? Math.ceil(L / 2) : Math.ceil((M - 1) / 2);

    // Borrow from left sibling
    if (left && left.keys.length > minKeys) {
        if (node.isLeaf) {
            node.keys.unshift(left.keys.pop());
            parent.keys[index - 1] = node.keys[0];
        } else {
            node.keys.unshift(parent.keys[index - 1]);
            parent.keys[index - 1] = left.keys.pop();
            node.children.unshift(left.children.pop());
            node.children[0].parent = node;
        }
        speak("Borrowed from left sibling");
        drawTree();
        return;
    }

    // Borrow from right sibling
    if (right && right.keys.length > minKeys) {
        if (node.isLeaf) {
            node.keys.push(right.keys.shift());
            parent.keys[index] = right.keys[0];
        } else {
            node.keys.push(parent.keys[index]);
            parent.keys[index] = right.keys.shift();
            node.children.push(right.children.shift());
            node.children[node.children.length - 1].parent = node;
        }
        speak("Borrowed from right sibling");
        drawTree();
        return;
    }

    // Merge
    if (left) {
        if (node.isLeaf) {
            left.keys = left.keys.concat(node.keys);
            left.next = node.next;
        } else {
            left.keys.push(parent.keys[index - 1]);
            left.keys = left.keys.concat(node.keys);
            left.children = left.children.concat(node.children);
            node.children.forEach(c => c.parent = left);
        }
        parent.keys.splice(index - 1, 1);
        parent.children.splice(index, 1);
        speak("Merged with left sibling");
    } else if (right) {
        if (node.isLeaf) {
            node.keys = node.keys.concat(right.keys);
            node.next = right.next;
        } else {
            node.keys.push(parent.keys[index]);
            node.keys = node.keys.concat(right.keys);
            node.children = node.children.concat(right.children);
            right.children.forEach(c => c.parent = node);
        }
        parent.keys.splice(index, 1);
        parent.children.splice(index + 1, 1);
        speak("Merged with right sibling");
    }

    if (parent === root && parent.keys.length === 0) {
        root = parent.children[0];
        root.parent = null;
        speak("Root updated after merge");
    } else if (parent.keys.length < Math.ceil((M - 1) / 2)) {
        handleUnderflow(parent);
    }

    drawTree();
}

/**********************
 * FIND LEAF
 **********************/
function findLeaf(node, value) {
    if (node.isLeaf) return node;
    let i = 0;
    while (i < node.keys.length && value >= node.keys[i]) i++;
    return findLeaf(node.children[i], value);
}

/**********************
 * DRAW TREE
 **********************/
function drawTree() {
    const svg = document.getElementById("tree");
    svg.innerHTML = "";
    if (!root) return;

    const levels = [];
    collectLevels(root, 0, levels);
    const levelHeight = 120;

    levels.forEach((level, depth) => {
        let totalWidth = 0;
        level.forEach(node => totalWidth += getNodeWidth(node) + 40);
        let startX = (svg.clientWidth - totalWidth) / 2;

        level.forEach(node => {
            node.x = startX;
            node.y = depth * levelHeight + 50;
            drawNode(svg, node);
            startX += getNodeWidth(node) + 40;
        });
    });

    drawConnections(svg, root);
    drawLeafLinks(svg);
}

/**********************
 * DRAW NODE
 **********************/
function drawNode(svg, node) {
    const width = getNodeWidth(node);

    const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");

    rect.setAttribute("x", node.x);
    rect.setAttribute("y", node.y);
    rect.setAttribute("width", width);
    rect.setAttribute("height", 40);
    rect.setAttribute("rx", 10);

    // 🎯 COLOR LOGIC (IMPORTANT)
    let color;

    if (searchPath[currentStep] === node.id) {
        color = "#ffd700"; // 🌟 current node (bright yellow)
    }
    else if (searchPath.includes(node.id)) {
        color = "#ffe066"; // 🟡 visited nodes
    }
    else {
        color = node.isLeaf ? "#ff6ec7" : "#7f5af0"; // 💗 pink + violet
    }

    // 🚀 APPLY COLOR USING STYLE (overrides CSS)
    rect.style.fill = color;

    svg.appendChild(rect);

    // 🔤 TEXT
    node.keys.forEach((key, i) => {
        const text = document.createElementNS("http://www.w3.org/2000/svg", "text");

        text.setAttribute("x", node.x + 20 + i * 40);
        text.setAttribute("y", node.y + 25);
        text.setAttribute("text-anchor", "middle");
        text.setAttribute("fill", "white");

        text.textContent = key;
        svg.appendChild(text);
    });
}
/**********************
 * CONNECTIONS
 **********************/
function drawConnections(svg, node) {
    if (node.isLeaf) return;
    node.children.forEach(child => {
        const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
        line.setAttribute("x1", node.x + getNodeWidth(node) / 2);
        line.setAttribute("y1", node.y + 40);
        line.setAttribute("x2", child.x + getNodeWidth(child) / 2);
        line.setAttribute("y2", child.y);
        line.setAttribute("stroke", "white");
        svg.appendChild(line);
        drawConnections(svg, child);
    });
}

/**********************
 * LEAF LINKS
 **********************/
function drawLeafLinks(svg) {
    let node = root;
    while (node && !node.isLeaf) node = node.children[0];

    while (node && node.next) {
        const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
        line.setAttribute("x1", node.x + getNodeWidth(node));
        line.setAttribute("y1", node.y + 20);
        line.setAttribute("x2", node.next.x);
        line.setAttribute("y2", node.next.y + 20);
        line.setAttribute("stroke", "yellow");
        line.setAttribute("stroke-dasharray", "5,5");
        svg.appendChild(line);
        node = node.next;
    }
}

/**********************
 * HELPERS
 **********************/
function getNodeWidth(node) {
    return node.keys.length * 40 + 20;
}

function collectLevels(node, depth, levels) {
    if (!levels[depth]) levels[depth] = [];
    levels[depth].push(node);
    if (!node.isLeaf) node.children.forEach(child => collectLevels(child, depth + 1, levels));
}
