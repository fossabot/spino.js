/*
AES-CBC (Cipher Block Chaining Mode)

This mode adds an XOR operation with the previous block's 
ciphertext before encryption. It is more secure than 
ECB because it introduces a level of dependency between blocks.
*/

const crypto = require('crypto');

const genkey = (encoding="hex") => {

    const key = crypto.randomBytes(32)
    const iv = crypto.randomBytes(16)

    return {
        [encoding]: {
            key: key.toString(encoding),
            iv: iv.toString(encoding)
        },
        buffer: {
            key,
            iv
        },
        key,
        iv
    }
}

const encrypt = (plaintext, key, iv, encoding="hex") => {
    if (!Buffer.isBuffer(key)) {
        try {
            key = Buffer.from(key, encoding)
        } catch (error) {
            throw new Error('Mismatched encoding types when passing key')
        }
    }

    if (!Buffer.isBuffer(iv)) {
        try {
            iv = Buffer.from(iv, encoding)
        } catch (error) {
            throw new Error('Mismatched encoding types when passing iv')
        }
    }

    const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
    let encryptedData = cipher.update(plaintext, 'utf8', encoding);
    encryptedData += cipher.final(encoding);

    return encryptedData
}

const decrypt = (encryptedData, key, iv, encoding="hex") => {

    if (!Buffer.isBuffer(key)) {
        try {
            key = Buffer.from(key, encoding)
        } catch (error) {
            throw new Error('Mismatched encoding types when passing key')
        }
    }

    if (!Buffer.isBuffer(iv)) {
        try {
            iv = Buffer.from(iv, encoding)
        } catch (error) {
            throw new Error('Mismatched encoding types when passing iv')
        }
    }

    const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
    let decryptedData = decipher.update(encryptedData, encoding, 'utf8');
    decryptedData += decipher.final('utf8');

    return decryptedData
}

module.exports = {genkey, encrypt, decrypt}