import LANGUAGE from "../constants/language";

export interface FormSettingItem {
  name: string;
  lable: string;
  type: FormSettingControlType;
  structure: FormSettingStructure;
  length?: number;
  visible: boolean;
  editable: boolean;
  required: boolean;
  defaultValue: string;
  valid: FormSettingValid;
  object: string;
  table: string;
  language: FormSettingLanguage;
  defined: boolean;
  viewGroup: number;
  viewOrder: number;
  linkObject?: string;
  linkTable?: string;
  linkUDO?: string;
}

// ARRAY
export const FormSettingLanguageArray = [LANGUAGE.EN, LANGUAGE.VN];
export const FormSettingControlTypeArray = [
  "NUMBER",
  "TEXT",
  "DATETIME",
  "BOOL",
  "UNIT",
];
export const FormSettingStructureTextArray = [
  "TEXT",
  "TEXTAREA",
  "EMAIL",
  "PHONE",
];

export const FormSettingStructureNumberArray = ["INTERGER"];

export const FormSettingStructureBoolArray = ["BOOLEAN"];

export const FormSettingStructureUnitArray = [
  "RATE",
  "AMOUNT",
  "PRICE",
  "QUANTITY",
  "PERCENTS",
] as const;

export const FormSettingStructureDatetimeArray = [
  "DATETIME",
  "DATE",
  "TIME",
] as const;

export const FormSettingValidArray = [
  "NONE",
  "VALUE",
  "LINKSYSOBJ",
  "LINKTABLE",
  "LINKUDO",
] as const;

//TYPE

export type FormSettingControlType = typeof FormSettingControlTypeArray[number];
export type FormSettingLanguage = typeof FormSettingLanguageArray[number];
export type FormSettingValid = typeof FormSettingValidArray[number];
export type FormSettingStructureText = typeof FormSettingStructureTextArray[number];
export type FormSettingStructureNumber = typeof FormSettingStructureNumberArray[number];
export type FormSettingStructureBool = typeof FormSettingStructureBoolArray[number];
export type FormSettingStructureUnit = typeof FormSettingStructureUnitArray[number];
export type FormSettingStructureDatetime = typeof FormSettingStructureDatetimeArray[number];
export type FormSettingStructure =
  | FormSettingStructureText
  | FormSettingStructureNumber
  | FormSettingStructureBool
  | FormSettingStructureUnit
  | FormSettingStructureDatetime;
