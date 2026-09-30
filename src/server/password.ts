import {
  randomBytes,
  scrypt as scryptCallback,
  timingSafeEqual,
} from "node:crypto";

function deriveKey(password: string, salt: string): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    scryptCallback(password, salt, 64, (error, key) => {
      if (error) reject(error);
      else resolve(key);
    });
  });
}

export async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const hash = await deriveKey(password, salt);
  return `scrypt$${salt}$${hash.toString("hex")}`;
}

export async function verifyPassword(password: string, encodedHash: string) {
  const [algorithm, salt, hash] = encodedHash.split("$");
  if (
    algorithm !== "scrypt" ||
    !salt ||
    !/^[a-f0-9]{32}$/i.test(salt) ||
    !hash ||
    !/^[a-f0-9]{128}$/i.test(hash)
  ) {
    return false;
  }

  const expected = Buffer.from(hash, "hex");
  const actual = await deriveKey(password, salt);
  return timingSafeEqual(expected, actual);
}