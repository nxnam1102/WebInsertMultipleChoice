/* eslint-disable radix */
//import aesjs from "aes-js";
import i18n from "i18next";
import lodash from "lodash";
import moment from "moment";
import StackTrace, { StackFrame } from "stacktrace-js";
import { DataLogging } from "../interface/app_log";
import { CommonService } from "../services/common";

const LoggingType = {
  ERROR: "ERROR",
  SUCCESS: "SUCCESS",
  INFO: "INFO",
  WARNING: "WARNING",
};
export const AppLogging = {
  success: (data: any) => {
    try {
      addToast(data, {
        appearance: `${LoggingType.SUCCESS}`.toLowerCase(),
      });
    } catch (error) {
      console.log(error);
    }
  },
  error: (data: any) => {
    try {
      console.log(data);
      let trace: StackFrame[] = [];
      addToast(data && data.message ? data.message : data, {
        appearance: `${LoggingType.ERROR}`.toLowerCase(),
      });
      if (data instanceof Error) {
        StackTrace.fromError(data).then((res) => {
          let result = res.slice(0, 5);
          trace = result;
          let dataLogging: DataLogging = {
            type: "ERROR",
            message: data.message,
            userId: 20,
            stack: trace.length > 0 ? null : data.stack ? data.stack : null,
            trace: trace.length > 0 ? trace : null,
            name: data && data.name ? data.name : "ERROR",
          };
          CommonService.WriteLog(dataLogging);
        });
      } else {
        let dataLogging: DataLogging = {
          type: "ERROR",
          message: data && data.message ? data.message : data,
          userId: 20,
          stack: null,
          trace: null,
          name: data && data.name ? data.name : "ERROR",
        };
        CommonService.WriteLog(dataLogging);
      }
    } catch (error) {
      console.log(error);
    }
  },
  info: (data: any) => {
    try {
      addToast(data, {
        appearance: `${LoggingType.INFO}`.toLowerCase(),
      });
    } catch (error) {
      console.log(error);
    }
  },
  warning: (data: any) => {
    try {
      addToast(data, {
        appearance: `${LoggingType.WARNING}`.toLowerCase(),
      });
    } catch (error) {
      console.log(error);
    }
  },
};

const threadDelay = (ms: number) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

const getDateNow = () => {
  const date = new Date();
  return (
    date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate()
  );
};
const getTimeNow = () => {
  const date = new Date();
  let time = "",
    hour = "",
    minute = "";
  if (date.getHours() < 10) {
    hour = "0" + date.getHours().toString();
  } else {
    hour = date.getHours().toString();
  }
  if (date.getMinutes() < 10) {
    minute = "0" + date.getMinutes().toString();
  } else {
    minute = date.getMinutes().toString();
  }
  time = hour + minute;
  return time;
};

const getDateTimeNow = () => {
  const date = new Date();
  return (
    date.getFullYear() +
    "-" +
    (date.getMonth() + 1) +
    "-" +
    date.getDate() +
    " " +
    date.getHours() +
    ":" +
    date.getMinutes() +
    ":" +
    date.getSeconds()
  );
};

const getDateTimeByString = (
  dateString: string | number | Date,
  format: any
) => {
  return getTimeByDate(new Date(dateString), format);
};

const getDateTimeByDTString = (
  dateString: string | number | Date,
  timeString = "",
  format: any
) => {
  let date = new Date(dateString);
  if (timeString !== null && timeString !== "") {
    if (timeString.length === 3) {
      timeString = "0" + timeString;
    }
    const hour = parseInt(timeString.substring(0, 2));
    const minute = parseInt(timeString.substring(2, 4));
    date.setHours(hour);
    date.setMinutes(minute);
  }

  return getTimeByDate(date, format);
};

const getTimeByDate = (date: Date, format: string) => {
  const year = checkTime(date.getFullYear());
  const month = checkTime(date.getMonth() + 1);
  const day = checkTime(date.getDate());
  const hour = checkTime(date.getHours());
  const minute = checkTime(date.getMinutes());
  const second = checkTime(date.getSeconds());
  return format
    .replace("dd", day)
    .replace("MM", month)
    .replace("yyyy", year)
    .replace("HH", hour)
    .replace("mm", minute)
    .replace("ss", second);
};

const getDateTimeInLanguage = () => {
  let currentTime =
    localStorage.getItem("i18nextLng") === "vi"
      ? `${moment().format("DD/MM/YYYY")}`
      : `${moment().locale("en").format("MMM Do, YY")}`;
  return currentTime;
};

const checkTime = (i: string | number) => {
  if (i < 10) {
    i = `0${i}`;
  }
  return i.toString();
};

const thousandsSeparators = (num: string | number) => {
  num = num ? num : 0;
  num = num.toString();
  num = num.replace(/,/g, "");
  var num_parts = num.toString().split(".");
  num_parts[0] = num_parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return num_parts.join(".");
};

const getDateTimeNow1 = () => {
  const date = new Date();
  return (
    date.getFullYear() +
    "-" +
    (date.getMonth() + 1) +
    "-" +
    date.getDate() +
    " " +
    date.getHours() +
    ":" +
    date.getMinutes()
  );
};

function encrypt(value: string, pass: string) {
  const CryptoJS = require("crypto-js");
  let salt = CryptoJS.lib.WordArray.random(128 / 8);

  let key = CryptoJS.PBKDF2(pass, salt, {
    keySize: 256 / 32,
    iterations: 100,
  });

  let iv = CryptoJS.lib.WordArray.random(128 / 8);

  let encrypted = CryptoJS.AES.encrypt(value, key, {
    iv: iv,
    padding: CryptoJS.pad.Pkcs7,
    mode: CryptoJS.mode.CBC,
  });

  let transitmessage = salt.toString() + iv.toString() + encrypted.toString();
  return transitmessage;
}

function decrypt(value: string, pass: string) {
  const CryptoJS = require("crypto-js");
  let salt = CryptoJS.enc.Hex.parse(value.substr(0, 32));
  let iv = CryptoJS.enc.Hex.parse(value.substr(32, 32));
  let encrypted = value.substring(64);

  let key = CryptoJS.PBKDF2(pass, salt, {
    keySize: 256 / 32,
    iterations: 100,
  });

  let decrypted = CryptoJS.AES.decrypt(encrypted, key, {
    iv: iv,
    padding: CryptoJS.pad.Pkcs7,
    mode: CryptoJS.mode.CBC,
  });
  return decrypted.toString(CryptoJS.enc.Utf8);
}

function removeAccents(value: string) {
  var AccentsMap = [
    "aàảãáạăằẳẵắặâầẩẫấậ",
    "AÀẢÃÁẠĂẰẲẴẮẶÂẦẨẪẤẬ",
    "dđ",
    "DĐ",
    "eèẻẽéẹêềểễếệ",
    "EÈẺẼÉẸÊỀỂỄẾỆ",
    "iìỉĩíị",
    "IÌỈĨÍỊ",
    "oòỏõóọôồổỗốộơờởỡớợ",
    "OÒỎÕÓỌÔỒỔỖỐỘƠỜỞỠỚỢ",
    "uùủũúụưừửữứự",
    "UÙỦŨÚỤƯỪỬỮỨỰ",
    "yỳỷỹýỵ",
    "YỲỶỸÝỴ",
  ];
  for (var i = 0; i < AccentsMap.length; i++) {
    var re = new RegExp("[" + AccentsMap[i].substr(1) + "]", "g");
    var char = AccentsMap[i][0];
    value = value.replace(re, char);
  }
  return value;
}
function acronymtNumber(labelValue: string | number) {
  // Nine Zeroes for Billions
  return Math.abs(Number(labelValue)) >= 1.0e9
    ? {
        value: Math.round((Math.abs(Number(labelValue)) / 1.0e9) * 10) / 10,
        acronymt: i18n.t("common:billion"),
      }
    : // Six Zeroes for Millions
    Math.abs(Number(labelValue)) >= 1.0e6
    ? {
        value: Math.round((Math.abs(Number(labelValue)) / 1.0e6) * 10) / 10,
        acronymt: i18n.t("common:million"),
      }
    : // Three Zeroes for Thousands
    Math.abs(Number(labelValue)) >= 1.0e3
    ? {
        value: Math.round((Math.abs(Number(labelValue)) / 1.0e3) * 10) / 10,
        acronymt: i18n.t("common:thousand"),
      }
    : { value: Math.abs(Number(labelValue)), acronymt: "" };
}
export function addToast(...args: any[]) {
  const add = lodash.get(window, "__react_toast_provider.current.add");
  const test = lodash.get(window, "__react_toast_provider.current");
  console.log(test);
  if (!add) {
    console.log("Some helpful error.");
    return;
  }
  add(...args);
}
const Utils = {
  threadDelay: (ms: number) => threadDelay(ms),
  getDateNow: () => getDateNow(),
  getTimeNow: () => getTimeNow(),
  getDateTimeNow: () => getDateTimeNow(),
  getDateTimeNow1: () => getDateTimeNow1(),
  getTimeByDate: (date: Date, format: string) => getTimeByDate(date, format),
  getDateTimeByString: (dateString: string | number | Date, format: any) =>
    getDateTimeByString(dateString, format),
  getDateTimeByDTString: (
    dateString: string | number | Date,
    timeString: string | undefined,
    format: any
  ) => getDateTimeByDTString(dateString, timeString, format),
  getDateTimeInLanguage: () => getDateTimeInLanguage(),
  thousandsSeparators: (num: string | number) => thousandsSeparators(num),
  removeAccents: (value: string) => removeAccents(value),
  encrypt: (value: string, pass: string) => encrypt(value, pass),
  decrypt: (value: string, pass: string) => decrypt(value, pass),
  acronymtNumber: (number: string | number) => acronymtNumber(number),
};

export default Utils;
