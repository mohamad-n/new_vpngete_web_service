import * as bcrypt from 'bcrypt';
import * as CryptoJS from 'crypto-js';

export default {
  async hash(password: string): Promise<string> {
    // const saltOrRounds = 10;
    const salt = await bcrypt.genSalt();
    const hash = await bcrypt.hash(password, salt);
    return Promise.resolve(hash);
  },
  async isMatch(password: string, hash: string): Promise<boolean> {
    const isMatch = await bcrypt.compare(password, hash);
    return Promise.resolve(isMatch);
  },

  async encrypt(object: any, ENCRYPTION_KEY: string): Promise<any> {
    try {
      const result = CryptoJS.AES.encrypt(JSON.stringify(object), ENCRYPTION_KEY).toString();
      return Promise.resolve(result);
    } catch (error) {
      return Promise.reject('invalid');
    }
  },
  async decrypt(text: string, ENCRYPTION_KEY: string): Promise<any> {
    try {
      const bytes = CryptoJS.AES.decrypt(text, ENCRYPTION_KEY);
      const result = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
      return Promise.resolve(result);
    } catch (error) {
      return Promise.reject('invalid');
    }
  },

  decodePayload(content: string) {
    try {
      const [header, payload, signature] = content.split('.');
      const decodedPayload = JSON?.parse(atob(payload.replace(/-/g, '+').replace(/_/g, '/')));

      return decodedPayload;
    } catch (error) {
      return 'error';
    }
  },
};
