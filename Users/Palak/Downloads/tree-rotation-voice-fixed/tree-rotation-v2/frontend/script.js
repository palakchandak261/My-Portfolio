/**********************
 * VOICE ENGINE
 **********************/
let voiceEnabled = true;
let voiceRate    = 1;
let voicePitch   = 1;
let speechQueue  = [];
let isSpeaking   = false;

setInterval(() => {
    if (window.speechSynthesis && window.speechSynthesis.speaking)
        window.speechSynthesis.resume();
}, 5000);

function speak(text) {
    if (!voiceEnabled || !("speechSynthesis" in window)) return;
    speechQueue.push(text);
    processSpeechQueue();
}

function processSpeechQueue() {
    if (isSpeaking || speechQueue.length === 0) return;
    isSpeaking = true;
    const text = speechQueue.shift();
    const speech = new SpeechSynthesisUtterance(text);
    speech.rate   = voiceRate;
    speech.pitch  = voicePitch;
    speech.volume = 1;
    const voices  = speechSynthesis.getVoices();
    const femaleVoice =
        voices.find(v => v.name.toLowerCase().includes("female")) ||
        voices.find(v => v.name.includes("Google UK English Female")) ||
        voices.find(v => v.name.includes("Microsoft Zira")) ||
        voices.find(v => v.lang === "en-GB") ||
        voices[0];
    if (femaleVoice) speech.voice = femaleVoice;
    speech.onend = () => { isSpeaking = false; processSpeechQueue(); };
    speechSynthesis.speak(speech);
}

function toggleVoice() {
    voiceEnabled = !voiceEnabled;
    if (!voiceEnabled) window.speechSynthesis.cancel();
    const btn = document.getElementById("voiceBtn");
    if (btn) btn.textContent = voiceEnabled ? "ON" : "OFF";
}

function setVoiceRate(v)  { voiceRate  = parseFloat(v); }
function setVoicePitch(v) { voicePitch = parseFloat(v); }

/**********************
 * DARK MODE
 **********************/
function toggleDark() {
    const html = document.documentElement;
    const isDark = html.getAttribute("data-theme") === "dark";
    html.setAttribute("data-theme", isDark ? "light" : "dark");
    localStorage.setItem("theme", isDark ? "light" : "dark");
    const btn = document.getElementById("darkBtn");
    if (btn) btn.textContent = isDark ? "🌙 Dark" : "☀ Light";
}

(function initTheme() {
    const saved = localStorage.getItem("theme") || "light";
    document.documentElement.setAttribute("data-theme", saved);
    window.addEventListener("DOMContentLoaded", () => {
        const btn = document.getElementById("darkBtn");
        if (btn) btn.textContent = saved === "dark" ? "☀ Light" : "🌙 Dark";
    });
})();

/**********************
 * GLOBAL SVG REFS
 **********************/
const bstSVG = document.getElementById("bstTree");
const avlSVG = document.getElementById("avlTree");
const rbSVG  = document.getElementById("rbTree");
const stepInfo = document.getElementById("stepInfo");

let rbRecoloredNodes  = new Set();
let currentSearchPath = [];

const rotateSound  = new Audio("rotate.mp3");
const rbRotateSound= new Audio("rb-rotate.mp3");
const recolorSound = new Audio("recolor.mp3");
let soundEnabled   = true;

function playSound(audio) {
    if (!soundEnabled) return;
    audio.currentTime = 0;
    audio.play().catch(() => {});
}

/**********************
 * STATS
 **********************/
let avlRotationCount = 0;
let rbRotationCount  = 0;
let rbRecolorCount   = 0;
let bstRotationCount = 0;
let statsChart       = null;

/**********************
 * GLOBAL STATE
 **********************/
let bstRoot = null;
let avlRoot = null;
let rbRoot  = null;
let snapshots     = [];
let step          = -1;
let prevPositions = {};
let bstSearchPath = [];
let avlSearchPath = [];
let rbSearchPath  = [];
let autoPlayTimer = null;
let currentRotation      = "";
let currentRotatedNodes  = new Set();
let currentRBRotation    = "";

function setLog(msg) {
    const el = document.getElementById("opLog");
    if (el) el.textContent = msg;
}

/**********************
 * SVG DEFS
 **********************/
function addSVGDefs(svg) {
    if (svg.querySelector("defs")) return;
    const defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");
    defs.innerHTML = `
        <radialGradient id="nodeGrad" cx="30%" cy="30%" r="70%">
            <stop offset="0%" stop-color="#7dd3fc"/>
            <stop offset="100%" stop-color="#0369a1"/>
        </radialGradient>
        <radialGradient id="rotatedGrad" cx="30%" cy="30%" r="70%">
            <stop offset="0%" stop-color="#fde047"/>
            <stop offset="100%" stop-color="#f97316"/>
        </radialGradient>
        <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="blur"/>
            <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
        <marker id="arrowHead" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto">
            <path d="M0,0 L0,6 L9,3 z" fill="#fb923c"/>
        </marker>
        <radialGradient id="blackGrad" cx="30%" cy="30%" r="70%">
            <stop offset="0%" stop-color="#1f2937"/>
            <stop offset="100%" stop-color="#000000"/>
        </radialGradient>`;
    svg.appendChild(defs);
}

/**********************
 * NODES
 **********************/
class Node {
    constructor(value) {
        this.value  = value;
        this.left   = null;
        this.right  = null;
        this.height = 1;
    }
}

class RBNode {
    constructor(value) {
        this.value  = value;
        this.left   = null;
        this.right  = null;
        this.parent = null;
        this.color  = "red";
    }
}

/**********************
 * BST
 **********************/
function insertBST(root, value) {
    if (!root) return new Node(value);
    if (value < root.value) root.left  = insertBST(root.left,  value);
    else                    root.right = insertBST(root.right, value);
    return root;
}

function deleteBST(root, key) {
    if (!root) return null;
    if      (key < root.value) root.left  = deleteBST(root.left,  key);
    else if (key > root.value) root.right = deleteBST(root.right, key);
    else {
        if (!root.left && !root.right) { speak(`BST: Removing leaf node ${key}.`); return null; }
        if (!root.left)  { speak(`BST: Node ${key} has only right child. Replacing with right child.`); return root.right; }
        if (!root.right) { speak(`BST: Node ${key} has only left child. Replacing with left child.`); return root.left; }
        let minNode = findMin(root.right);
        speak(`BST: Node ${key} has two children. Replacing with in-order successor ${minNode.value}.`);
        root.value = minNode.value;
        root.right = deleteBST(root.right, minNode.value);
    }
    return root;
}

function findMin(node) { while (node.left) node = node.left; return node; }

/**********************
 * AVL HELPERS
 **********************/
function height(n)  { return n ? n.height : 0; }
function balance(n) { return n ? height(n.left) - height(n.right) : 0; }

function rotateRight(y) {
    avlRotationCount++;
    playSound(rotateSound);
    const x = y.left, T2 = x.right;
    currentRotatedNodes.add(y.value);
    currentRotatedNodes.add(x.value);
    speak(`AVL: Rotating RIGHT at node ${y.value}. Node ${x.value} moves up.`);
    x.right = y; y.left = T2;
    y.height = Math.max(height(y.left), height(y.right)) + 1;
    x.height = Math.max(height(x.left), height(x.right)) + 1;
    return x;
}

function rotateLeft(x) {
    avlRotationCount++;
    playSound(rotateSound);
    const y = x.right, T2 = y.left;
    currentRotatedNodes.add(x.value);
    currentRotatedNodes.add(y.value);
    speak(`AVL: Rotating LEFT at node ${x.value}. Node ${y.value} moves up.`);
    y.left = x; x.right = T2;
    x.height = Math.max(height(x.left), height(x.right)) + 1;
    y.height = Math.max(height(y.left), height(y.right)) + 1;
    return y;
}

/**********************
 * AVL INSERT
 **********************/
function insertAVL(node, value) {
    if (!node) return new Node(value);
    if      (value < node.value) node.left  = insertAVL(node.left,  value);
    else if (value > node.value) node.right = insertAVL(node.right, value);
    else return node;
    node.height = 1 + Math.max(height(node.left), height(node.right));
    let b = balance(node);
    if (b > 1  && value < node.left.value)  { currentRotation = "LL Rotation"; speak(`AVL: Left Left imbalance at node ${node.value}. Performing Right rotation.`); return rotateRight(node); }
    if (b < -1 && value > node.right.value) { currentRotation = "RR Rotation"; speak(`AVL: Right Right imbalance at node ${node.value}. Performing Left rotation.`); return rotateLeft(node); }
    if (b > 1  && value > node.left.value)  { currentRotation = "LR Rotation"; speak(`AVL: Left Right imbalance at node ${node.value}. First rotating Left at ${node.left.value}, then Right at ${node.value}.`); node.left = rotateLeft(node.left); return rotateRight(node); }
    if (b < -1 && value < node.right.value) { currentRotation = "RL Rotation"; speak(`AVL: Right Left imbalance at node ${node.value}. First rotating Right at ${node.right.value}, then Left at ${node.value}.`); node.right = rotateRight(node.right); return rotateLeft(node); }
    return node;
}

/**********************
 * AVL DELETE
 **********************/
function deleteAVL(root, key) {
    if (!root) return root;
    if      (key < root.value) root.left  = deleteAVL(root.left,  key);
    else if (key > root.value) root.right = deleteAVL(root.right, key);
    else {
        if (!root.left || !root.right) {
            let temp = root.left ? root.left : root.right;
            root = temp ? temp : null;
        } else {
            let temp = findMin(root.right);
            root.value = temp.value;
            root.right = deleteAVL(root.right, temp.value);
        }
    }
    if (!root) return root;
    root.height = 1 + Math.max(height(root.left), height(root.right));
    let b = balance(root);
    if (b > 1  && balance(root.left)  >= 0) { currentRotation = "LL Rotation"; speak(`AVL delete: Left Left imbalance at node ${root.value}. Rotating Right.`); return rotateRight(root); }
    if (b > 1  && balance(root.left)  <  0) { currentRotation = "LR Rotation"; speak(`AVL delete: Left Right imbalance at node ${root.value}. Double rotation.`); root.left = rotateLeft(root.left); return rotateRight(root); }
    if (b < -1 && balance(root.right) <= 0) { currentRotation = "RR Rotation"; speak(`AVL delete: Right Right imbalance at node ${root.value}. Rotating Left.`); return rotateLeft(root); }
    if (b < -1 && balance(root.right) >  0) { currentRotation = "RL Rotation"; speak(`AVL delete: Right Left imbalance at node ${root.value}. Double rotation.`); root.right = rotateRight(root.right); return rotateLeft(root); }
    return root;
}

/**********************
 * RED-BLACK INSERT
 **********************/
function insertRB(value) {
    const newNode = new RBNode(value);
    let parent = null, current = rbRoot;
    while (current) { parent = current; current = value < current.value ? current.left : current.right; }
    newNode.parent = parent;
    if (!parent)              rbRoot = newNode;
    else if (value < parent.value) parent.left  = newNode;
    else                           parent.right = newNode;
    fixRBInsert(newNode);
}

function fixRBInsert(node) {
    while (node !== rbRoot && node.parent && node.parent.color === "red") {
        const parent = node.parent, gp = parent.parent;
        if (!gp) break;
        if (parent === gp.left) {
            const uncle = gp.right;
            if (uncle && uncle.color === "red") {
                speak(`RB: Recoloring parent ${parent.value}, uncle ${uncle.value}, grandparent ${gp.value}`);
                playSound(recolorSound);
                parent.color = "black"; uncle.color = "black"; gp.color = "red";
                rbRecolorCount += 3;
                rbRecoloredNodes.add(parent.value); rbRecoloredNodes.add(uncle.value); rbRecoloredNodes.add(gp.value);
                node = gp;
            } else {
                if (node === parent.right) { currentRBRotation = "LR Rotation (RB)"; speak(`Red-Black insert: Left Right case. Left rotating at node ${parent.value}.`); node = parent; rotateLeftRB(node); }
                else { currentRBRotation = "LL Rotation (RB)"; speak(`Red-Black insert: Left Left case. Right rotating at grandparent ${gp.value}.`); }
                node.parent.color = "black"; gp.color = "red";
                rbRecolorCount += 2;
                rbRecoloredNodes.add(node.parent.value); rbRecoloredNodes.add(gp.value);
                rotateRightRB(gp);
            }
        } else {
            const uncle = gp.left;
            if (uncle && uncle.color === "red") {
                speak("RB: Recoloring parent, uncle, grandparent");
                parent.color = "black"; uncle.color = "black"; gp.color = "red";
                rbRecolorCount += 3;
                rbRecoloredNodes.add(parent.value); rbRecoloredNodes.add(uncle.value); rbRecoloredNodes.add(gp.value);
                node = gp;
            } else {
                if (node === parent.left) { currentRBRotation = "RL Rotation (RB)"; speak(`Red-Black insert: Right Left case. Right rotating at node ${parent.value}.`); node = parent; rotateRightRB(node); }
                else { currentRBRotation = "RR Rotation (RB)"; speak(`Red-Black insert: Right Right case. Left rotating at grandparent ${gp.value}.`); }
                node.parent.color = "black"; gp.color = "red";
                rbRecolorCount += 2;
                rbRecoloredNodes.add(node.parent.value); rbRecoloredNodes.add(gp.value);
                rotateLeftRB(gp);
            }
        }
    }
    if (rbRoot) rbRoot.color = "black";
}

function rotateLeftRB(x) {
    if (!x || !x.right) return;
    rbRotationCount++;
    speak(`Red-Black: Left rotation at node ${x.value}. Node ${x.right.value} moves up.`);
    playSound(rbRotateSound);
    const y = x.right; x.right = y.left;
    if (y.left) y.left.parent = x;
    y.parent = x.parent;
    if (!x.parent)              rbRoot = y;
    else if (x === x.parent.left) x.parent.left  = y;
    else                          x.parent.right = y;
    y.left = x; x.parent = y;
}

function rotateRightRB(x) {
    if (!x || !x.left) return;
    rbRotationCount++;
    speak(`Red-Black: Right rotation at node ${x.value}. Node ${x.left.value} moves up.`);
    playSound(rbRotateSound);
    const y = x.left; x.left = y.right;
    if (y.right) y.right.parent = x;
    y.parent = x.parent;
    if (!x.parent)               rbRoot = y;
    else if (x === x.parent.right) x.parent.right = y;
    else                           x.parent.left  = y;
    y.right = x; x.parent = y;
}

/**********************
 * RED-BLACK DELETE
 **********************/
function deleteRB(value) {
    let node = rbRoot;
    while (node && node.value !== value) node = value < node.value ? node.left : node.right;
    if (!node) return;
    deleteRBNode(node);
}

function deleteRBNode(node) {
    let y = node, yOriginalColor = y.color, x;
    if (!node.left) { x = node.right; transplant(node, node.right); }
    else if (!node.right) { x = node.left; transplant(node, node.left); }
    else {
        y = minimum(node.right); yOriginalColor = y.color; x = y.right;
        if (y.parent === node) { if (x) x.parent = y; }
        else { transplant(y, y.right); y.right = node.right; y.right.parent = y; }
        transplant(node, y); y.left = node.left; y.left.parent = y; y.color = node.color;
    }
    if (yOriginalColor === "black") fixRBDelete(x);
}

function transplant(u, v) {
    if (!u.parent)              rbRoot = v;
    else if (u === u.parent.left) u.parent.left  = v;
    else                          u.parent.right = v;
    if (v) v.parent = u.parent;
}

function minimum(node) { while (node.left) node = node.left; return node; }

function fixRBDelete(x) {
    while (x !== rbRoot && x && x.color === "black") {
        if (!x || !x.parent) break;
        if (x === x.parent.left) {
            let w = x.parent.right;
            if (!w) { x = x.parent; continue; }
            if (w.color === "red") {
                speak(`Red-Black delete fix: Case 1 — sibling ${w.value} is red. Left rotating at ${x.parent.value}.`);
                currentRBRotation = "Case 1 (Left Rotate)"; rbRotationCount++;
                w.color = "black"; x.parent.color = "red";
                rbRecoloredNodes.add(w.value); rbRecoloredNodes.add(x.parent.value); rbRecolorCount += 2;
                rotateLeftRB(x.parent); w = x.parent.right;
            }
            if ((!w.left || w.left.color === "black") && (!w.right || w.right.color === "black")) {
                speak(`Red-Black delete fix: Case 2 — both children of sibling ${w.value} are black. Recoloring sibling.`);
                w.color = "red"; rbRecoloredNodes.add(w.value); rbRecolorCount++; x = x.parent;
            } else {
                if (!w.right || w.right.color === "black") {
                    speak(`Red-Black delete fix: Case 3 — sibling ${w.value} right child is black. Right rotating at sibling.`);
                    if (w.left) { w.left.color = "black"; rbRecoloredNodes.add(w.left.value); }
                    w.color = "red"; rbRecoloredNodes.add(w.value); rbRecolorCount += 2;
                    currentRBRotation = "Case 3 (Right Rotate)"; rbRotationCount++;
                    rotateRightRB(w); w = x.parent.right;
                }
                speak(`Red-Black delete fix: Case 4 — final fix. Left rotating at ${x.parent.value}.`);
                currentRBRotation = "Case 4 (Left Rotate)"; rbRotationCount++;
                w.color = x.parent.color; x.parent.color = "black";
                if (w.right) { w.right.color = "black"; rbRecoloredNodes.add(w.right.value); }
                rbRecoloredNodes.add(w.value); rbRecoloredNodes.add(x.parent.value); rbRecolorCount += 3;
                rotateLeftRB(x.parent); x = rbRoot;
            }
        } else {
            let w = x.parent.left;
            if (!w) { x = x.parent; continue; }
            if (w.color === "red") {
                speak(`Red-Black delete fix: Case 1 — sibling ${w.value} is red. Right rotating at ${x.parent.value}.`);
                currentRBRotation = "Case 1 (Right Rotate)"; rbRotationCount++;
                w.color = "black"; x.parent.color = "red";
                rbRecoloredNodes.add(w.value); rbRecoloredNodes.add(x.parent.value); rbRecolorCount += 2;
                rotateRightRB(x.parent); w = x.parent.left;
            }
            if ((!w.left || w.left.color === "black") && (!w.right || w.right.color === "black")) {
                speak(`Red-Black delete fix: Case 2 — both children of sibling ${w.value} are black. Recoloring.`);
                w.color = "red"; rbRecoloredNodes.add(w.value); rbRecolorCount++; x = x.parent;
            } else {
                if (!w.left || w.left.color === "black") {
                    speak(`Red-Black delete fix: Case 3 — sibling ${w.value} left child is black. Left rotating at sibling.`);
                    if (w.right) { w.right.color = "black"; rbRecoloredNodes.add(w.right.value); }
                    w.color = "red"; rbRecoloredNodes.add(w.value); rbRecolorCount += 2;
                    currentRBRotation = "Case 3 (Left Rotate)"; rbRotationCount++;
                    rotateLeftRB(w); w = x.parent.left;
                }
                speak(`Red-Black delete fix: Case 4 — final fix. Right rotating at ${x.parent.value}.`);
                currentRBRotation = "Case 4 (Right Rotate)"; rbRotationCount++;
                w.color = x.parent.color; x.parent.color = "black";
                if (w.left) { w.left.color = "black"; rbRecoloredNodes.add(w.left.value); }
                rbRecoloredNodes.add(w.value); rbRecoloredNodes.add(x.parent.value); rbRecolorCount += 3;
                rotateRightRB(x.parent); x = rbRoot;
            }
        }
    }
    if (x) x.color = "black";
}

/**********************
 * SNAPSHOT
 **********************/
function saveSnapshot(action) {
    snapshots.push({
        bst: structuredClone(bstRoot),
        avl: structuredClone(avlRoot),
        rb:  structuredClone(rbRoot),
        action,
        rotation:     currentRotation,
        rbRotation:   currentRBRotation,
        rotatedNodes: [...currentRotatedNodes],
        rbRecolored:  [...rbRecoloredNodes]
    });
    step = snapshots.length - 1;
    currentRotation = ""; currentRBRotation = "";
    currentRotatedNodes.clear(); rbRecoloredNodes.clear();
}

/**********************
 * INSERT
 **********************/
function insert() {
    const input = document.getElementById("value");
    const val   = Number(input.value);
    if (isNaN(val) || input.value.trim() === "") { setLog("⚠ Enter a numeric value"); return; }

    // Duplicate check
    if (bstRoot && nodeExists(bstRoot, val)) {
        speak(`Value ${val} already exists in tree`);
        setLog(`⚠ Value ${val} already exists`);
        return;
    }

    bstRoot = insertBST(bstRoot, val);
    avlRoot = insertAVL(avlRoot, val);
    insertRB(val);

    const rotMsg = currentRotation ? ` — ${currentRotation}` : "";
    speak(`Inserted ${val} into all trees`);
    setLog(`✅ Inserted ${val}${rotMsg}`);

    saveSnapshot(`Inserted ${val}`);
    render();
    input.value = "";
    updateStats();
}

function nodeExists(node, val) {
    if (!node) return false;
    if (node.value === val) return true;
    return val < node.value ? nodeExists(node.left, val) : nodeExists(node.right, val);
}

/**********************
 * BULK INSERT
 **********************/
function bulkInsert() {
    const raw = document.getElementById("bulkInput").value;
    if (!raw.trim()) { setLog("⚠ Enter comma-separated values"); return; }
    const vals = raw.split(",").map(s => Number(s.trim())).filter(n => !isNaN(n));
    if (!vals.length) { setLog("⚠ No valid numbers found"); return; }

    vals.forEach(val => {
        if (!nodeExists(bstRoot, val)) {
            bstRoot = insertBST(bstRoot, val);
            avlRoot = insertAVL(avlRoot, val);
            insertRB(val);
            saveSnapshot(`Inserted ${val}`);
        }
    });

    speak(`Bulk inserted ${vals.length} values`);
    setLog(`⚡ Bulk inserted: ${vals.join(", ")}`);
    render();
    document.getElementById("bulkInput").value = "";
    updateStats();
}

/**********************
 * DELETE
 **********************/
function deleteNode() {
    const value = parseInt(document.getElementById("value").value);
    if (isNaN(value)) { setLog("⚠ Enter a numeric value"); return; }

    currentRBRotation = "";
    rbRecoloredNodes.clear();

    const bstBefore = JSON.stringify(bstRoot ?? {});
    bstRoot = deleteBST(bstRoot, value);
    avlRoot = deleteAVL(avlRoot, value);
    deleteRB(value);
    const bstAfter = JSON.stringify(bstRoot);

    if (bstBefore === bstAfter) {
        speak(`Value ${value} not found in trees`);
        setLog(`⚠ Value ${value} not found`);
        return;
    }

    speak(`Deleted ${value} from all trees`);
    setLog(`🗑 Deleted ${value}`);
    saveSnapshot(`Deleted ${value}`);
    render();
    document.getElementById("value").value = "";
    updateStats();
}

/**********************
 * SEARCH
 **********************/
let searchPath = [];

function searchNode() {
    const value = parseInt(document.getElementById("value").value);
    if (isNaN(value)) { setLog("⚠ Enter a numeric value"); return; }

    bstSearchPath = []; avlSearchPath = []; rbSearchPath = [];
    const foundBST = searchBSTPath(bstRoot, value, bstSearchPath);
    const foundAVL = searchBSTPath(avlRoot, value, avlSearchPath);
    const foundRB  = searchBSTPath(rbRoot,  value, rbSearchPath);

    saveSnapshot(`Searched ${value}`);
    render();

    const msg = (foundBST || foundAVL || foundRB) ? `Found ${value} ✔` : `${value} not found ✘`;
    speak(msg);
    setLog(`🔍 ${msg}`);

    setTimeout(() => { bstSearchPath = []; avlSearchPath = []; rbSearchPath = []; }, 2500);
}

function searchBSTPath(node, value, path) {
    if (!node) return false;
    path.push(node.value);
    if (value === node.value) return true;
    return value < node.value ? searchBSTPath(node.left, value, path) : searchBSTPath(node.right, value, path);
}

/**********************
 * RESET
 **********************/
function resetTrees() {
    bstRoot = null; avlRoot = null; rbRoot = null;
    snapshots = []; prevPositions = {}; step = -1;
    avlRotationCount = 0; rbRotationCount = 0; rbRecolorCount = 0;
    bstSVG.innerHTML = ""; avlSVG.innerHTML = ""; rbSVG.innerHTML = "";
    stepInfo.innerText = "Step 0";
    document.getElementById("avlRotationInfo").innerText = "";
    document.getElementById("rbRotationInfo").innerText  = "";
    setLog("↺ Trees reset");
    updateStats();
    stopAutoPlay();
}

/**********************
 * NAVIGATION
 **********************/
function nextStep()    { if (step < snapshots.length - 1) { step++; render(); } }
function prevStep()    { if (step > 0) { step--; render(); } }
function jumpToStart() { if (snapshots.length) { step = 0; render(); } }
function jumpToEnd()   { if (snapshots.length) { step = snapshots.length - 1; render(); } }

/**********************
 * AUTO-PLAY
 **********************/
function toggleAutoPlay() {
    if (autoPlayTimer) { stopAutoPlay(); return; }
    const btn = document.getElementById("autoPlayBtn");
    if (btn) btn.textContent = "⏸ Pause";
    const speed = parseInt(document.getElementById("autoSpeed").value) || 800;
    autoPlayTimer = setInterval(() => {
        if (step < snapshots.length - 1) { step++; render(); }
        else stopAutoPlay();
    }, speed);
}

function stopAutoPlay() {
    clearInterval(autoPlayTimer);
    autoPlayTimer = null;
    const btn = document.getElementById("autoPlayBtn");
    if (btn) btn.textContent = "▶ Auto-Play";
}

/**********************
 * PRESET SCENARIOS
 **********************/
const PRESETS = {
    sorted:    [1,2,3,4,5,6,7,8,9,10],
    reverse:   [10,9,8,7,6,5,4,3,2,1],
    avlll:     [30,20,10],
    avlrr:     [10,20,30],
    avllr:     [30,10,20],
    avlrl:     [10,30,20],
    rbrecolor: [10,20,30,15,25,5,1],
    balanced:  [8,4,12,2,6,10,14,1,3,5,7,9,11,13,15]
};

function loadPreset() {
    const key = document.getElementById("presetSelect").value;
    if (!key || !PRESETS[key]) return;
    resetTrees();
    const vals = PRESETS[key];
    vals.forEach(val => {
        bstRoot = insertBST(bstRoot, val);
        avlRoot = insertAVL(avlRoot, val);
        insertRB(val);
        saveSnapshot(`Inserted ${val}`);
    });
    speak(`Loaded preset: ${key}`);
    setLog(`📋 Preset loaded: ${key} (${vals.length} values)`);
    render();
    updateStats();
}

/**********************
 * WORST CASE DEMO
 **********************/
function runWorstCase() {
    document.getElementById("worstModal").style.display = "none";
    resetTrees();
    const vals = [1,2,3,4,5,6,7,8,9,10];
    vals.forEach(val => {
        bstRoot = insertBST(bstRoot, val);
        avlRoot = insertAVL(avlRoot, val);
        insertRB(val);
        saveSnapshot(`Inserted ${val}`);
    });
    speak("Worst case demo: inserting 1 through 10 in sorted order. Watch BST become a linked list.");
    setLog("⚠ Worst case: BST degenerates, AVL stays balanced");
    render();
    updateStats();
}

/**********************
 * SAVE / LOAD
 **********************/
function saveToStorage() {
    const data = { bst: bstRoot, avl: avlRoot, rb: rbRoot, snapshots, step };
    localStorage.setItem("treeState", JSON.stringify(data));
    setLog("💾 Tree saved to browser storage");
    speak("Tree saved");
}

function loadFromStorage() {
    const raw = localStorage.getItem("treeState");
    if (!raw) { setLog("⚠ No saved tree found"); return; }
    try {
        const data = JSON.parse(raw);
        bstRoot = data.bst; avlRoot = data.avl; rbRoot = data.rb;
        snapshots = data.snapshots || []; step = data.step ?? -1;
        render(); updateStats();
        setLog("📂 Tree loaded from storage");
        speak("Tree loaded");
    } catch(e) { setLog("⚠ Failed to load saved tree"); }
}

/**********************
 * SHARE URL
 **********************/
function shareURL() {
    try {
        const state = { bst: bstRoot, avl: avlRoot, rb: rbRoot, step };
        const encoded = btoa(JSON.stringify(state));
        const url = window.location.origin + window.location.pathname + "#" + encoded;
        navigator.clipboard.writeText(url).then(() => {
            setLog("🔗 URL copied to clipboard!");
            speak("Shareable URL copied to clipboard");
        });
    } catch(e) { setLog("⚠ Could not copy URL"); }
}

(function loadFromURL() {
    const hash = window.location.hash.slice(1);
    if (!hash) return;
    try {
        const data = JSON.parse(atob(hash));
        bstRoot = data.bst; avlRoot = data.avl; rbRoot = data.rb;
        step = data.step ?? -1;
        if (bstRoot || avlRoot || rbRoot) {
            saveSnapshot("Loaded from URL");
            render(); updateStats();
            setLog("🔗 Tree loaded from shared URL");
        }
    } catch(e) {}
})();

/**********************
 * EXPORT SVG
 **********************/
function exportSVG() {
    const svgs = [bstSVG, avlSVG, rbSVG];
    const labels = ["BST", "AVL", "Red-Black"];
    let combined = `<svg xmlns="http://www.w3.org/2000/svg" width="1300" height="450">`;
    combined += `<rect width="1300" height="450" fill="#fbc2eb"/>`;
    svgs.forEach((svg, i) => {
        combined += `<g transform="translate(${i * 430}, 0)">`;
        combined += `<text x="210" y="20" text-anchor="middle" font-family="Poppins" font-weight="bold" fill="#7f5af0">${labels[i]}</text>`;
        combined += svg.innerHTML;
        combined += `</g>`;
    });
    combined += `</svg>`;
    const blob = new Blob([combined], { type: "image/svg+xml" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "trees-export.svg";
    a.click();
    setLog("💾 SVG exported");
}

/**********************
 * DRAW HELPERS
 **********************/
function getBalanceValue(node) { return node ? height(node.left) - height(node.right) : 0; }
function getHeight(node) { if (!node) return 0; return 1 + Math.max(getHeight(node.left), getHeight(node.right)); }
function getNodeCount(node) { if (!node) return 0; return 1 + getNodeCount(node.left) + getNodeCount(node.right); }
function getDepth(node, val, d = 0) { if (!node) return -1; if (node.value === val) return d; const l = getDepth(node.left, val, d+1); return l >= 0 ? l : getDepth(node.right, val, d+1); }
function getSubtreeSize(node) { return getNodeCount(node); }

function drawLine(svg, x1, y1, x2, y2) {
    const l = document.createElementNS("http://www.w3.org/2000/svg", "line");
    l.setAttribute("x1", x1); l.setAttribute("y1", y1);
    l.setAttribute("x2", x2); l.setAttribute("y2", y2);
    l.setAttribute("stroke", "#94a3b8"); l.setAttribute("stroke-width", "2");
    svg.appendChild(l);
}

function drawLevelGuides(svg, root) {
    if (!root) return;
    const h = getHeight(root), levelGap = 70, startY = 40;
    for (let i = 0; i < h; i++) {
        const y = startY + i * levelGap;
        const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
        line.setAttribute("x1", 0); line.setAttribute("y1", y);
        line.setAttribute("x2", svg.clientWidth || 420); line.setAttribute("y2", y);
        line.setAttribute("stroke", "#cbd5e1"); line.setAttribute("stroke-width", "1");
        line.setAttribute("stroke-dasharray", "4,8"); line.setAttribute("opacity", "0.35");
        svg.appendChild(line);
        const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
        text.setAttribute("x", 8); text.setAttribute("y", y - 6);
        text.setAttribute("fill", "#94a3b8"); text.setAttribute("font-size", "10px"); text.setAttribute("opacity", "0.4");
        text.textContent = i;
        svg.appendChild(text);
    }
}

/**********************
 * DRAW BST / AVL NODE
 **********************/
function drawTree(svg, node, x, y, gap, rotatedNodes, showBalance, searchPath = []) {
    if (!node) return;
    if (node.left)  { drawLine(svg, x, y, x - gap, y + 70); drawTree(svg, node.left,  x - gap, y + 70, gap / 1.8, rotatedNodes, showBalance, searchPath); }
    if (node.right) { drawLine(svg, x, y, x + gap, y + 70); drawTree(svg, node.right, x + gap, y + 70, gap / 1.8, rotatedNodes, showBalance, searchPath); }
    drawNode(svg, x, y, node, rotatedNodes, showBalance, searchPath);
}

function drawNode(svg, x, y, node, rotatedNodes, showBalance, searchPath = []) {
    const value = node.value;
    const prev  = prevPositions[value] || { x, y };

    const c = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    const t = document.createElementNS("http://www.w3.org/2000/svg", "text");

    c.setAttribute("cx", prev.x); c.setAttribute("cy", prev.y); c.setAttribute("r", 18);
    t.setAttribute("x",  prev.x); t.setAttribute("y",  prev.y + 5);
    t.setAttribute("text-anchor", "middle"); t.textContent = value;

    c.style.transition = "cx 0.8s ease, cy 0.8s ease";
    t.style.transition = "x 0.8s ease, y 0.8s ease";

    if (searchPath && searchPath.includes(value)) {
        c.style.fill = "#22c55e"; c.style.stroke = "#14532d"; c.style.strokeWidth = "3";
    } else if (rotatedNodes && rotatedNodes.includes(value)) {
        c.style.fill = "url(#rotatedGrad)"; c.style.stroke = "#facc15"; c.style.strokeWidth = "3"; c.style.filter = "url(#glow)";
    } else {
        c.style.fill = "url(#nodeGrad)";
    }

    // Tooltip events
    c.style.cursor = "pointer";
    c.addEventListener("mouseenter", (e) => showTooltip(e, node, svg.id, showBalance));
    c.addEventListener("mouseleave", () => hideTooltip(svg.id));

    svg.appendChild(c); svg.appendChild(t);

    if (showBalance) {
        const bf = getBalanceValue(node);
        const bfText = document.createElementNS("http://www.w3.org/2000/svg", "text");
        bfText.setAttribute("x", prev.x + 24); bfText.setAttribute("y", prev.y - 10);
        bfText.setAttribute("class", "balance-text"); bfText.textContent = bf;
        bfText.style.transition = "x 0.8s ease, y 0.8s ease";
        svg.appendChild(bfText);
        requestAnimationFrame(() => { bfText.setAttribute("x", x + 24); bfText.setAttribute("y", y - 10); });
    }

    requestAnimationFrame(() => { c.setAttribute("cx", x); c.setAttribute("cy", y); t.setAttribute("x", x); t.setAttribute("y", y + 5); });
    prevPositions[value] = { x, y };
}

/**********************
 * DRAW RED-BLACK
 **********************/
function drawTreeRB(svg, node, x, y, gap, recoloredNodes, searchPath = []) {
    if (!node) return;
    if (node.left)  { drawLine(svg, x, y, x - gap, y + 70); drawTreeRB(svg, node.left,  x - gap, y + 70, gap / 1.8, recoloredNodes, searchPath); }
    if (node.right) { drawLine(svg, x, y, x + gap, y + 70); drawTreeRB(svg, node.right, x + gap, y + 70, gap / 1.8, recoloredNodes, searchPath); }
    drawRBNode(svg, x, y, node, recoloredNodes, searchPath);
}

function drawRBNode(svg, x, y, node, recoloredNodes = [], searchPath = []) {
    const c = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    const t = document.createElementNS("http://www.w3.org/2000/svg", "text");
    c.setAttribute("cx", x); c.setAttribute("cy", y); c.setAttribute("r", 22);

    if (searchPath && searchPath.includes(node.value)) {
        c.setAttribute("fill", "#22c55e"); c.setAttribute("stroke", "#14532d");
    } else {
        c.setAttribute("fill", node.color === "red" ? "#dc2626" : "#000000");
        c.setAttribute("stroke", node.color === "red" ? "#7f1d1d" : "#374151");
    }
    c.setAttribute("stroke-width", "3");
    if (recoloredNodes.includes(node.value)) c.style.filter = "drop-shadow(0 0 15px gold)";

    c.style.cursor = "pointer";
    c.addEventListener("mouseenter", (e) => showTooltip(e, node, svg.id, false, true));
    c.addEventListener("mouseleave", () => hideTooltip(svg.id));

    t.setAttribute("x", x); t.setAttribute("y", y + 5);
    t.setAttribute("text-anchor", "middle"); t.setAttribute("fill", "white");
    t.setAttribute("font-weight", "bold"); t.setAttribute("font-size", "14px");
    t.textContent = node.value;

    svg.appendChild(c); svg.appendChild(t);
}

/**********************
 * NODE TOOLTIP
 **********************/
function showTooltip(e, node, svgId, showBalance, isRB = false) {
    const suffix = svgId.replace("Tree", "").replace("bst","bst").replace("avl","avl").replace("rb","rb");
    const tipId  = "tooltip-" + (svgId === "bstTree" ? "bst" : svgId === "avlTree" ? "avl" : "rb");
    const tip    = document.getElementById(tipId);
    if (!tip) return;

    const root = svgId === "bstTree" ? bstRoot : svgId === "avlTree" ? avlRoot : rbRoot;
    const depth = getDepth(root, node.value);
    const size  = getSubtreeSize(node);

    let html = `<b>Value:</b> ${node.value}<br>`;
    html += `<b>Depth:</b> ${depth}<br>`;
    html += `<b>Subtree size:</b> ${size}<br>`;
    if (node.height !== undefined) html += `<b>Height:</b> ${node.height}<br>`;
    if (showBalance) html += `<b>Balance factor:</b> ${getBalanceValue(node)}<br>`;
    if (isRB) html += `<b>Color:</b> <span style="color:${node.color === 'red' ? '#f87171' : '#94a3b8'}">${node.color}</span><br>`;

    tip.innerHTML = html;
    tip.style.display = "block";

    const section = tip.closest(".tree-section");
    const rect    = section ? section.getBoundingClientRect() : { left: 0, top: 0 };
    tip.style.left = (e.clientX - rect.left + 12) + "px";
    tip.style.top  = (e.clientY - rect.top  + 12) + "px";
}

function hideTooltip(svgId) {
    const tipId = "tooltip-" + (svgId === "bstTree" ? "bst" : svgId === "avlTree" ? "avl" : "rb");
    const tip   = document.getElementById(tipId);
    if (tip) tip.style.display = "none";
}

/**********************
 * ROTATION ARROW
 **********************/
function drawRotationArrow(type, nodes) {
    if (nodes.length < 2) return;
    const [a, b] = nodes;
    const p1 = prevPositions[a], p2 = prevPositions[b];
    if (!p1 || !p2) return;
    const path  = document.createElementNS("http://www.w3.org/2000/svg", "path");
    const midX  = (p1.x + p2.x) / 2;
    const curve = type.includes("L") ? -80 : 80;
    path.setAttribute("d", `M ${p1.x} ${p1.y} Q ${midX} ${Math.min(p1.y, p2.y) + curve} ${p2.x} ${p2.y}`);
    path.setAttribute("fill", "none"); path.setAttribute("stroke", "#fb923c");
    path.setAttribute("stroke-width", "4"); path.setAttribute("marker-end", "url(#arrowHead)");
    avlSVG.appendChild(path);
    const len = path.getTotalLength();
    path.style.strokeDasharray = len; path.style.strokeDashoffset = len;
    path.animate([{ strokeDashoffset: len }, { strokeDashoffset: 0 }], { duration: 2200, easing: "ease-in-out" });
    setTimeout(() => path.remove(), 2400);
}

/**********************
 * RENDER
 **********************/
function render() {
    [bstSVG, avlSVG, rbSVG].forEach(s => { while (s.firstChild) s.removeChild(s.firstChild); });
    [bstSVG, avlSVG, rbSVG].forEach(addSVGDefs);

    const snap = snapshots[step];
    if (!snap) return;

    document.getElementById("avlRotationInfo").innerText = snap.rotation   || "No Rotation";
    document.getElementById("rbRotationInfo").innerText  = snap.rbRotation || "No Rotation";

    drawLevelGuides(bstSVG, snap.bst);
    drawLevelGuides(avlSVG, snap.avl);
    drawLevelGuides(rbSVG,  snap.rb);

    drawTree(bstSVG, snap.bst, 210, 40, 100, [],               false, bstSearchPath);
    drawTree(avlSVG, snap.avl, 210, 40, 100, snap.rotatedNodes, true,  avlSearchPath);
    drawTreeRB(rbSVG, snap.rb, 210, 40, 100, snap.rbRecolored,         rbSearchPath);

    if (snap.rotation) {
        explainRotation(snap.rotation);
        setTimeout(() => drawRotationArrow(snap.rotation, snap.rotatedNodes), 600);
    }

    stepInfo.innerText = `Step ${step + 1}/${snapshots.length} — ${snap.action}`;

    function showHeight(svg, root) {
        const h = Math.max(getHeight(root) - 1, 0);
        const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
        text.setAttribute("x", 300); text.setAttribute("y", 20);
        text.setAttribute("fill", "#38bdf8"); text.setAttribute("font-size", "14px");
        text.textContent = "Height: " + h;
        svg.appendChild(text);
    }
    showHeight(bstSVG, snap.bst);
    showHeight(avlSVG, snap.avl);
    showHeight(rbSVG,  snap.rb);

    const section = document.getElementById("compareSection");
    if (section && section.style.display === "block") renderComparison();
}

function explainRotation(type) {
    const msgs = { "LL Rotation": "AVL: Left Left rotation", "RR Rotation": "AVL: Right Right rotation", "LR Rotation": "AVL: Left Right rotation", "RL Rotation": "AVL: Right Left rotation" };
    if (msgs[type]) speak(msgs[type]);
}

/**********************
 * STATS CHART
 **********************/
function initChart() {
    const ctx = document.getElementById("statsChart").getContext("2d");
    statsChart = new Chart(ctx, {
        type: "bar",
        data: {
            labels: ["Height", "Complexity", "Rotations", "Recolorings"],
            datasets: [
                { label: "BST",        data: [0,0,0,0], backgroundColor: "rgba(10,245,14,0.7)",  categoryPercentage: 0.8, barPercentage: 0.8 },
                { label: "AVL Tree",   data: [0,0,0,0], backgroundColor: "rgba(52,127,247,0.7)", categoryPercentage: 0.8, barPercentage: 0.8 },
                { label: "Red-Black",  data: [0,0,0,0], backgroundColor: "rgba(244,24,24,0.7)",  categoryPercentage: 0.8, barPercentage: 0.8 }
            ]
        },
        options: { responsive: true, animation: { duration: 800 }, scales: { y: { beginAtZero: true } } }
    });
}

function updateStats() {
    if (!statsChart) return;
    const bstH = Math.max(getHeight(bstRoot) - 1, 0);
    const avlH = Math.max(getHeight(avlRoot) - 1, 0);
    const rbH  = Math.max(getHeight(rbRoot)  - 1, 0);
    const bstN = getNodeCount(bstRoot), avlN = getNodeCount(avlRoot), rbN = getNodeCount(rbRoot);
    statsChart.data.datasets[0].data = [bstH, bstN > 0 ? +Math.log2(bstN).toFixed(2) : 0, 0, 0];
    statsChart.data.datasets[1].data = [avlH, avlN > 0 ? +Math.log2(avlN).toFixed(2) : 0, avlRotationCount, 0];
    statsChart.data.datasets[2].data = [rbH,  rbN  > 0 ? +Math.log2(rbN).toFixed(2)  : 0, rbRotationCount, rbRecolorCount];
    statsChart.update();
}

function toggleStatsPanel() {
    const panel = document.getElementById("statsContainer");
    if (panel.style.display === "none") {
        panel.style.display = "block";
        setTimeout(() => { if (!statsChart) initChart(); else statsChart.resize(); updateStats(); }, 200);
    } else { panel.style.display = "none"; }
}

/**********************
 * COMPLEXITY PANEL
 **********************/
function showSearchComplexity() {
    const panel = document.getElementById("complexityInfo");
    const bstH  = getHeight(bstRoot);
    const avlN  = getNodeCount(avlRoot);
    const rbN   = getNodeCount(rbRoot);
    const bstN  = getNodeCount(bstRoot);
    const mem   = (n) => (n * 32 / 1024).toFixed(2);
    panel.innerHTML = `
        <h3>📐 Complexity Analysis</h3>
        <p><b>BST:</b> O(h) → O(${bstH}) &nbsp;<small>(Worst: O(n) if skewed)</small><br>Memory: ~${mem(bstN)} KB</p>
        <p><b>AVL:</b> O(log n) → ~O(${Math.log2(avlN||1).toFixed(2)})<br>Memory: ~${mem(avlN)} KB</p>
        <p><b>Red-Black:</b> O(log n) → ~O(${Math.log2(rbN||1).toFixed(2)})<br>Memory: ~${mem(rbN)} KB</p>
        <p><b>AVL Rotations:</b> ${avlRotationCount} &nbsp;|&nbsp; <b>RB Rotations:</b> ${rbRotationCount} &nbsp;|&nbsp; <b>RB Recolorings:</b> ${rbRecolorCount}</p>
    `;
    panel.style.display = panel.style.display === "none" ? "block" : "none";
}

/**********************
 * COMPARISON
 **********************/
function toggleComparison(event) {
    const section = document.getElementById("compareSection");
    const btn     = document.getElementById("cmpBtn");
    if (section.style.display === "none") {
        section.style.display = "block";
        if (btn) btn.textContent = "❌ Hide Compare";
        renderComparison();
    } else {
        section.style.display = "none";
        if (btn) btn.textContent = "🔍 Compare";
    }
}

function renderComparison() {
    if (step <= 0) return;
    const before = snapshots[step - 1], after = snapshots[step];
    const ids = ["beforeAVL","afterAVL","beforeRB","afterRB"];
    ids.forEach(id => { const el = document.getElementById(id); if (el) { el.innerHTML = ""; addSVGDefs(el); } });
    const bAVL = document.getElementById("beforeAVL"), aAVL = document.getElementById("afterAVL");
    const bRB  = document.getElementById("beforeRB"),  aRB  = document.getElementById("afterRB");
    if (bAVL) drawTree(bAVL, before.avl, 200, 40, 100, [], true);
    if (aAVL) drawTree(aAVL, after.avl,  200, 40, 100, after.rotatedNodes, true);
    if (bRB)  drawTreeRB(bRB, before.rb, 200, 40, 100, []);
    if (aRB)  drawTreeRB(aRB, after.rb,  200, 40, 100, after.rbRecolored);
}

/**********************
 * INFO PANELS
 **********************/
function showInfo(type) {
    const panel = document.getElementById("infoPanel");
    const info  = {
        bst: `<h2>🌳 Binary Search Tree</h2>
              <p>Left child &lt; node &lt; right child. No balancing — can degenerate to O(n).</p>
              <h3>Complexity</h3><ul><li>Best: O(log n)</li><li>Worst: O(n) (sorted input)</li></ul>
              <h3>Use Cases</h3><p>Simple lookups, teaching tree concepts</p>`,
        avl: `<h2>⚖ AVL Tree</h2>
              <p>Self-balancing BST. Balance factor = height(left) − height(right) ∈ {-1, 0, 1}.</p>
              <h3>Rotations</h3><ul><li>LL — Right rotation</li><li>RR — Left rotation</li><li>LR — Left then Right</li><li>RL — Right then Left</li></ul>
              <h3>Complexity</h3><ul><li>All ops: O(log n)</li></ul>
              <h3>Use Cases</h3><p>Databases, in-memory sorted sets, fast lookups</p>`,
        rb:  `<h2>🔴⚫ Red-Black Tree</h2>
              <p>Balanced BST using node colors. Less strictly balanced than AVL — faster inserts.</p>
              <h3>Properties</h3><ul><li>Root is black</li><li>No two consecutive red nodes</li><li>Equal black-height on all paths</li></ul>
              <h3>Complexity</h3><ul><li>All ops: O(log n)</li></ul>
              <h3>Use Cases</h3><p>C++ STL map/set, Linux kernel, Java TreeMap</p>`
    };
    panel.innerHTML = (info[type] || "") + `<br><button onclick="document.getElementById('infoPanel').style.display='none'">✕ Close</button>`;
    panel.style.display = "block";
}

/**********************
 * PSEUDOCODE
 **********************/
const PSEUDOCODE = {
    avl: `AVL INSERT(root, value):
  if root is null:
    return new Node(value)

  if value < root.value:
    root.left = INSERT(root.left, value)
  else if value > root.value:
    root.right = INSERT(root.right, value)
  else:
    return root  // duplicate

  root.height = 1 + max(H(left), H(right))
  balance = H(left) - H(right)

  // LL Case
  if balance > 1 and value < root.left.value:
    return rotateRight(root)

  // RR Case
  if balance < -1 and value > root.right.value:
    return rotateLeft(root)

  // LR Case
  if balance > 1 and value > root.left.value:
    root.left = rotateLeft(root.left)
    return rotateRight(root)

  // RL Case
  if balance < -1 and value < root.right.value:
    root.right = rotateRight(root.right)
    return rotateLeft(root)

  return root`,

    rb: `RB INSERT(value):
  newNode.color = RED
  BST insert newNode

  FIX-INSERT(newNode):
  while parent.color == RED:
    if parent == grandparent.left:
      uncle = grandparent.right

      // Case 1: Uncle is RED → Recolor
      if uncle.color == RED:
        parent.color = BLACK
        uncle.color  = BLACK
        grandparent.color = RED
        node = grandparent

      // Case 2/3: Uncle is BLACK → Rotate
      else:
        if node == parent.right:
          rotateLeft(parent)   // Case 2
        parent.color = BLACK
        grandparent.color = RED
        rotateRight(grandparent) // Case 3

    else: (mirror cases)

  root.color = BLACK`
};

function showPseudo(type) {
    const panel = document.getElementById("pseudoPanel");
    const title = document.getElementById("pseudoTitle");
    const code  = document.getElementById("pseudoCode");
    if (!panel) return;
    title.textContent = type === "avl" ? "AVL Insert Pseudocode" : "Red-Black Insert Pseudocode";
    code.textContent  = PSEUDOCODE[type] || "No pseudocode available";
    panel.style.display = panel.style.display === "none" ? "block" : "none";
}

/**********************
 * QUIZ MODE
 **********************/
const QUIZ_QUESTIONS = [
    { q: "What rotation fixes an LL imbalance in AVL?",       opts: ["Left Rotation","Right Rotation","Left-Right Rotation","Right-Left Rotation"], ans: 1 },
    { q: "What rotation fixes an RR imbalance in AVL?",       opts: ["Right Rotation","Left Rotation","Left-Right Rotation","Right-Left Rotation"], ans: 1 },
    { q: "What is the balance factor range in AVL?",          opts: ["-2 to 2","-1 to 1","0 to 1","-3 to 3"], ans: 1 },
    { q: "What color is the root in a Red-Black Tree?",       opts: ["Red","Black","Either","None"], ans: 1 },
    { q: "Can two consecutive red nodes exist in RB Tree?",   opts: ["Yes","No","Only at root","Only at leaves"], ans: 1 },
    { q: "AVL vs RB: which has faster lookups?",              opts: ["Red-Black","AVL","Same","Depends on input"], ans: 1 },
    { q: "What is the worst-case height of an AVL tree?",     opts: ["O(n)","O(log n)","O(n log n)","O(1)"], ans: 1 },
    { q: "Which tree is used in C++ STL map?",                opts: ["AVL","BST","Red-Black","B-Tree"], ans: 2 },
    { q: "What triggers a split in a B-Tree?",                opts: ["Underflow","Overflow","Rotation","Recolor"], ans: 1 },
    { q: "What is the time complexity of RB Tree insert?",    opts: ["O(n)","O(log n)","O(1)","O(n log n)"], ans: 1 }
];

let quizIndex = 0, quizScore = 0, quizAnswered = false;

function renderQuiz() {
    const q    = QUIZ_QUESTIONS[quizIndex % QUIZ_QUESTIONS.length];
    const body = document.getElementById("quizBody");
    const fb   = document.getElementById("quizFeedback");
    fb.textContent = "";
    quizAnswered   = false;
    body.innerHTML = `<div class="quiz-question">Q${quizIndex + 1}. ${q.q}</div>
        <div class="quiz-options">${q.opts.map((o, i) =>
            `<button onclick="answerQuiz(${i})">${o}</button>`).join("")}
        </div>
        <div style="margin-top:10px;font-size:13px;opacity:0.6">Score: ${quizScore}/${quizIndex}</div>`;
}

function answerQuiz(idx) {
    if (quizAnswered) return;
    quizAnswered = true;
    const q    = QUIZ_QUESTIONS[quizIndex % QUIZ_QUESTIONS.length];
    const btns = document.querySelectorAll(".quiz-options button");
    const fb   = document.getElementById("quizFeedback");
    btns[q.ans].classList.add("correct");
    if (idx === q.ans) {
        quizScore++;
        fb.textContent = "✅ Correct!";
        fb.style.color = "#22c55e";
        speak("Correct!");
    } else {
        btns[idx].classList.add("wrong");
        fb.textContent = `❌ Wrong. Correct answer: ${q.opts[q.ans]}`;
        fb.style.color = "#ef4444";
        speak("Wrong answer");
    }
}

function nextQuiz() { quizIndex++; renderQuiz(); }

function closeQuiz() {
    document.getElementById("quizModal").style.display = "none";
    speak(`Quiz ended. Score: ${quizScore} out of ${quizIndex}`);
    quizIndex = 0; quizScore = 0;
}

document.getElementById("quizModal").addEventListener("click", (e) => {
    if (e.target === e.currentTarget) closeQuiz();
});

/**********************
 * DROPDOWN
 **********************/
function toggleMenu() {
    const menu = document.getElementById("treeOptions");
    menu.style.display = menu.style.display === "block" ? "none" : "block";
}
function openTree(page) { window.location.href = page; }

document.addEventListener("click", (e) => {
    const wrap = document.querySelector(".dropdown-wrap");
    if (wrap && !wrap.contains(e.target)) document.getElementById("treeOptions").style.display = "none";
});

/**********************
 * KEYBOARD SHORTCUTS
 **********************/
document.addEventListener("keydown", (e) => {
    const tag = document.activeElement.tagName;
    if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") {
        if (e.key === "Enter") { e.preventDefault(); insert(); }
        return;
    }
    switch(e.key) {
        case "ArrowRight": nextStep();    break;
        case "ArrowLeft":  prevStep();    break;
        case "d": case "D": deleteNode(); break;
        case "s": case "S": searchNode(); break;
        case "r": case "R": resetTrees(); break;
        case " ": e.preventDefault(); toggleAutoPlay(); break;
        case "Escape":
            document.getElementById("infoPanel").style.display    = "none";
            document.getElementById("pseudoPanel").style.display  = "none";
            document.getElementById("complexityInfo").style.display = "none";
            document.getElementById("quizModal").style.display    = "none";
            document.getElementById("worstModal").style.display   = "none";
            break;
    }
});

/**********************
 * INIT QUIZ ON OPEN
 **********************/
document.getElementById("quizModal").addEventListener("transitionend", () => {});
document.querySelector('[onclick*="quizModal"]')?.addEventListener("click", () => {
    quizIndex = 0; quizScore = 0; renderQuiz();
});

// Also trigger on direct show
const origQuizShow = document.getElementById("quizModal");
const quizObserver = new MutationObserver(() => {
    if (origQuizShow.style.display === "flex") { quizIndex = 0; quizScore = 0; renderQuiz(); }
});
quizObserver.observe(origQuizShow, { attributes: true, attributeFilter: ["style"] });
