
const { spawn } = require('child_process');
const path = require('path');

class CppBridge {
    constructor(exeName) {
        this.exePath = path.join(__dirname, 'cpp', exeName);
        this._proc = null;
        this._queue = [];   // pending { resolve, reject }
        this._buf = '';
        this._start();
    }
    _start() {
        this._proc = spawn(this.exePath, [], { stdio: ['pipe', 'pipe', 'pipe'] });

        this._proc.stdout.on('data', (chunk) => {
            this._buf += chunk.toString();
            let nl;
            while ((nl = this._buf.indexOf('\n')) !== -1) {
                const line = this._buf.slice(0, nl).trim();
                this._buf = this._buf.slice(nl + 1);
                if (!line) continue;
                const cb = this._queue.shift();
                if (!cb) continue;
                try {
                    cb.resolve(JSON.parse(line));
                } catch (e) {
                    cb.reject(new Error('Bad JSON from C++: ' + line));
                }
            }
        });

        this._proc.stderr.on('data', (d) => {
            console.error('[C++ stderr]', d.toString());
        });

        this._proc.on('exit', (code) => {
            // drain pending with error
            for (const cb of this._queue) cb.reject(new Error('C++ process exited: ' + code));
            this._queue = [];
        });
    }

    /**
     * Send a command object, get back a Promise<result>.
     */
    send(obj) {
        return new Promise((resolve, reject) => {
            this._queue.push({ resolve, reject });
            this._proc.stdin.write(JSON.stringify(obj) + '\n');
        });
    }
}

module.exports = CppBridge;
