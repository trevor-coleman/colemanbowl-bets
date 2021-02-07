const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

function randInt(min: number, max: number) {
  return Math.floor(Math.random() * (
      max - min)) + min;
}

export class RoomCodeManager {
  codeLength: number;
  usedCodes: Set<string>;

  // Generate 4-letter codes by default
  constructor(codeLength = 4) {
    this.codeLength = codeLength;
    this.usedCodes = new Set();
  }

  generateCode() {
    const min = 0;
    const max = Math.pow(ALPHABET.length, this.codeLength);
    let code = randInt(min, max);

    // If every code is already in use, just return a random code
    if (this.usedCodes.size >= max) {
      return this.encodeAlphabet(code);
    }

    // Keep incrementing by 1 until an unused code is found
    while (this.usedCodes.has(this.encodeAlphabet(code))) {
      code =
          (
              code + 1) % max;
    }
    this.usedCodes.add(this.encodeAlphabet(code));
    return this.encodeAlphabet(code);
  }

  encodeAlphabet(num: number) {
    let str = "";
    const len = ALPHABET.length;
    while (num > 0) {
      let radix = num % len;
      str = ALPHABET[radix] + str;
      num = Math.floor(num / len);
    }
    return str.padStart(this.codeLength, ALPHABET[0]);
  }

  releaseCode(code: string) {
    this.usedCodes.delete(code);
  }
}

const roomCode = new RoomCodeManager();

export default roomCode;
