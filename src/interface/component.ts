import { FormSettingItem } from "./form_settings";

export interface ComponentBase {
  objType: string;
  tableDocument: string;
  tableRow: string;
}

export interface SystemObject {
  objType: string;
  objName: string;
  tableName: string;
  tableName1?: string;
  tableName2?: string;
  tableName3?: string;
  tableName4?: string;
  tableName5?: string;
}

export interface AppControlProps {
  formSetting?: FormSettingItem;
  required?: boolean;
  editorOptions?: any;
}
