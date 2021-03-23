"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const path = require("path");
const PNGBuffer = fs.readFileSync(path.join(__dirname, '../fixtures/hello.png'));
exports.PNGBuffer = PNGBuffer;
const PNGUint8Array = new Uint8Array(PNGBuffer);
exports.PNGUint8Array = PNGUint8Array;
const PNGArrayBuffer = PNGUint8Array.buffer;
exports.PNGArrayBuffer = PNGArrayBuffer;
//# sourceMappingURL=png.js.map