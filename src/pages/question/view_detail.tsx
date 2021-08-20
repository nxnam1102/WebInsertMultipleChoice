import { HtmlEditor } from "devextreme-react/html-editor";
import React from "react";
import AppPopup from "../../components/controls/popup";

export const FormDetail = (props: any) => {
  let formRef = props.formRef;
  return (
    <div>
      <AppPopup height={500} popupRef={formRef}>
        <HtmlEditor value={props.value} height={400} readOnly />
      </AppPopup>
    </div>
  );
};
