const Index = {
  get: (key: string): string => {
    try {
      const { Utils } = require("../helpers/index");
      const SHA256 = require("crypto-js/sha256");
      const keySave = SHA256(key).toString();
      const value = localStorage.getItem(keySave);
      if (value !== "" && value !== null) {
        let data = Utils.decrypt(value, keySave);
        return data;
      }
      return "";
    } catch (error) {
      return "";
    }
  },
  set: (key: string, value: string): boolean => {
    try {
      const { Utils } = require("../helpers/index");
      const SHA256 = require("crypto-js/sha256");
      const keySave = SHA256(key).toString();
      let saveData = "";
      if (value !== "") {
        saveData = Utils.encrypt(value, keySave);
      }
      localStorage.setItem(keySave, saveData);
      return true;
    } catch (error) {
      return false;
    }
  },
  remove: (key: string): boolean => {
    try {
      const SHA256 = require("crypto-js/sha256");
      const keySave = SHA256(key).toString();
      localStorage.removeItem(keySave);
      return true;
    } catch (error) {
      return false;
    }
  },
};

export default Index;
