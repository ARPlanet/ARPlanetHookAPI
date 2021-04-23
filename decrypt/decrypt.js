
const crypto = require('crypto');

/**
 * 加解密
 */
var EncryptionHelper = (function () {

    /**
     * 取得加密資料iv跟密文  (base64(alg:iv:encrypted))
     * @private
     * @param {string} dataEncodeType base64 或 hex
     * @param {string} hashData 自定義的hashData
     * @returns {object}
     */
    function decodeHashData(dataEncodeType, hashData) {
        let buff = null;
        buff = hashData;
        let encryptedText = buff.toString('utf8');
        console.log("encryptedText ==> " + encryptedText);
        let textParts = encryptedText.split(':');
        if (textParts.length == 3) {
            let alg = Buffer.from(textParts[0], 'utf8');
            let iv = Buffer.from(textParts[1], 'utf8');
            let encrypted = Buffer.from(textParts[2], dataEncodeType);
            console.log("alg ==> " + alg);
            console.log("iv ==> " + iv);
            console.log("encrypted ==> " + encrypted);
            return { alg: alg.toString(), iv: iv, encrypted: encrypted };
        }
        else {
            return undefined;
        }
    }
    /**
     * @public
     * @param {string} secretKey 密鑰
     * @param {string} hashData base64的加密資料
     * @param {string} encodeType 編碼方式 base64 或 hex
     * @returns {object} 資料物件
     */
    function decryptText(secretKey, hashData) {
        let EnCode_Type = "base64";
        let hashDataObj = decodeHashData(EnCode_Type, hashData);
        if (hashDataObj == undefined) {
            return null;
        }
        let decipher = crypto.createDecipheriv(hashDataObj.alg, Buffer.from(secretKey), hashDataObj.iv);
        let decrypted = decipher.update(hashDataObj.encrypted);
        decrypted = Buffer.concat([decrypted, decipher.final()]);
        console.log("iiv:" + hashDataObj.iv);
        return { iv: hashDataObj.iv.toString('utf8'), encrypted: hashDataObj.encrypted.toString(EnCode_Type), data: decrypted.toString() };
    }
    return {
        decryptText: decryptText
    };
})();
module.exports = EncryptionHelper;