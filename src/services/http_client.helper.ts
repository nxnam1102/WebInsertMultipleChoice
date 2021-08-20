import axios from "axios";
import APP_CONSTANTS from "../constants/app";
import { AppLogging } from "../helpers/utilities";
import { AppConfigData } from "../interface/service";

const API_TIMEOUT = 60000;
const CONFIG = (window as any).__CONFIG__ as AppConfigData;
export const ApiAddress = CONFIG.API_URL;
export const timeout = (
  ms: number,
  promise: any,
  rejectMsg = "Request Time Out"
) => {
  return Promise.race([
    new Promise((resolve, reject) => {
      promise.then(resolve, reject);
    }),
    new Promise((_, reject) =>
      setTimeout(() => {
        reject(rejectMsg);
      }, ms)
    ),
  ]);
};
const getUri = (controller: string, action: string, obj: any) => {
  let arr = [];
  let constrollerStr = "";
  if (controller !== "") {
    constrollerStr = "/" + controller;
  }
  if (obj === null || obj === undefined) {
    return constrollerStr + "/" + action;
  }
  for (var key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      arr.push(key + "=" + obj[key]);
    }
  }
  return constrollerStr + "/" + action + "?" + arr.join("&");
};
const instance = axios.create({
  baseURL: ApiAddress,
  timeout: API_TIMEOUT,
  headers: {
    "Content-Type": "application/json",
    Accept: "*/*",
    //"Accept-Encoding": "gzip, deflate",
    //"Access-Control-Allow-Origin": "*",
  },
});
export const Request = (controller: string) => {
  return {
    getAsync: async (action: string, params?: any) => {
      let simpleUri = "";
      try {
        let uri = getUri(controller, action, params);
        simpleUri = uri.split("?")[0];
        // instance.defaults.headers["SessionId"] =
        //   params.sesionId !== undefined ? params.sessionId : "";
        let result = await instance.get(uri);
        if (result.data) {
          return result.data;
        } else {
          return result;
        }
      } catch (error) {
        console.log(error);
        throw new Error(error + " " + simpleUri);
      }
    },
    postAsync: async (action: string, params?: any) => {
      let simpleUri = "";
      try {
        let uri = getUri(controller, action, null);
        simpleUri = uri.split("?")[0];
        let result = await instance.post(uri, JSON.stringify(params));
        return result.data;
      } catch (error) {
        console.log(error);
        throw new Error(error + " " + simpleUri);
      }
    },
    postFileAsync: async (action: string, params?: any) => {
      let simpleUri = "";
      try {
        let uri = getUri(controller, action, null);
        simpleUri = uri.split("?")[0];
        let formData = new FormData();
        formData.append("file", params);
        let result = await instance.post(uri, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        return result.data;
      } catch (error) {
        console.log(error);
        throw new Error(error + " " + simpleUri);
      }
    },
    uploadFileAsync: async (file: any) => {
      const CryptoJS = require("crypto-js");
      try {
        const formData = new FormData();
        formData.append("appDomain", APP_CONSTANTS.APPDOMAIN);
        formData.append("appDB", APP_CONSTANTS.APPDOMAIN);
        formData.append("file", file, file.name);
        const time = new Date().getTime();
        const secrect = APP_CONSTANTS.CONSTVALUE.SECRETKEYAPIUPLOAD;
        const stringSha256 =
          time + APP_CONSTANTS.KEYUPLOAD + file.name.toLowerCase() + secrect;
        const jsha256 = CryptoJS.SHA256(stringSha256);
        const token = btoa(
          APP_CONSTANTS.KEYUPLOAD +
            "." +
            time +
            "." +
            jsha256.toString().toLowerCase()
        );
        let response: any = await timeout(
          API_TIMEOUT,
          fetch(APP_CONSTANTS.APIUPLOAD, {
            method: "POST",
            headers: new Headers({
              TOKEN: token,
            }),
            body: formData,
          })
        ).catch((error) => {
          AppLogging.error(error);
        });
        console.log(response);
        // if (response.status === 200) {
        //   let responseJson = await response.json();
        //   return responseJson;
        // }
      } catch (error) {
        AppLogging.error(error);
      }
    },
  };
};
