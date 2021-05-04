//
import TextBox, { ITextBoxOptions } from "devextreme-react/text-box";
import { FC } from "react";
import { useTranslation } from "react-i18next";
import { AppControlProps } from "../../../interface/component";
import { Validator, RequiredRule } from "devextreme-react/validator";
// import AppControlBase from "../control_base";
import { Namespace } from "../../../constants/language";

//styles
import styles from "./index.module.scss";

//interface
interface Props extends ITextBoxOptions, AppControlProps {}

//Render view on Screen
const AppTextBox: FC<Props> = (props) => {
  const { t } = useTranslation(Namespace.common);

  return (
    // <AppControlBase className={props.component}>

    // </AppControlBase>
    <TextBox className={styles.input} {...props}>
      {props.children}
      <Validator>
        {props.required && <RequiredRule message={t("field_required")} />}
      </Validator>
    </TextBox>
  );
};

export default AppTextBox;
