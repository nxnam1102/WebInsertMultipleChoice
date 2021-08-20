import { Button } from "devextreme-react/button";
import { Form, Item } from "devextreme-react/form";
import { HtmlEditor } from "devextreme-react/html-editor";
import React, { useRef, useState } from "react";
import AppPopup from "../../components/controls/popup";

export const FormUpdateQuestion = (props: any) => {
  let data = props.data;
  let formRef = props.formRef;
  let dataSourceQuestionType = [
    { code: "one", name: "Một đáp án" },
    { code: "multiple", name: "Nhiều đáp án" },
  ];
  let dataSourceType = [
    { code: "html", name: "HTML Copy" },
    { code: "html_code", name: "HTML Code" },
    { code: "normal", name: "Bình thường" },
  ];
  const [type, setType] = useState("normal");
  const [resultFromCode, setResultFromCode] = useState("");
  const formDataRef = useRef<any>(null);
  const resultPopupRef = useRef<any>(null);
  return (
    <div>
      <AppPopup height={700} popupRef={formRef}>
        <Form formData={data} ref={formDataRef}>
          <Item itemType="group" colCount={2} colSpan={2}>
            <Item
              dataField="QuestionId"
              editorOptions={{
                readOnly: true,
              }}
            />
            <Item
              dataField="QuestionType"
              editorType="dxSelectBox"
              editorOptions={{
                dataSource: dataSourceQuestionType,
                displayExpr: "name",
                valueExpr: "code",
              }}
            />
            <Item dataField="Remarks" />
            <Item
              dataField="Type"
              editorType="dxSelectBox"
              editorOptions={{
                dataSource: dataSourceType,
                displayExpr: "name",
                valueExpr: "code",
                value: type ? type : "normal",
                onValueChanged: (e: any) => {
                  setType(e.value);
                },
              }}
            />
            {type === "normal" ? (
              <Item
                dataField="Question"
                editorType="dxTextArea"
                colSpan={2}
                editorOptions={{ height: 450 }}
              />
            ) : type === "html_code" ? (
              <Item
                dataField="Question"
                editorType="dxTextArea"
                colSpan={2}
                editorOptions={{ height: 450 }}
              />
            ) : (
              <Item
                dataField="Question"
                editorType="dxHtmlEditor"
                colSpan={2}
                editorOptions={{
                  height: 450,
                  toolbar: {
                    items: [
                      "font",
                      "color",
                      "bold",
                      "italic",
                      "underline",
                      "alignCenter",
                      "alignJustify",
                      "alignLeft",
                      "alignRight",
                      "background",
                      "blockquote",
                      "bulletList",
                      "clear",
                      "codeBlock",
                      "decreaseIndent",
                      "deleteColumn",
                      "deleteRow",
                      "deleteTable",
                      "header",
                      "image",
                      "increaseIndent",
                      "insertColumnLeft",
                      "insertColumnRight",
                      "insertRowAbove",
                      "insertRowBelow",
                      "insertTable",
                      "link",
                      "orderedList",
                      "separator",
                      "size",
                      "subscript",
                      "superscript",
                      "variable",
                      "strike",
                      "undo",
                      "redo",
                    ],
                  },
                }}
              />
            )}
          </Item>
          <Item></Item>
        </Form>
        <div
          style={{
            justifyContent: "flex-end",
            display: "flex",
          }}
        >
          <div
            style={{
              borderWidth: 1,
              borderColor: "red",
              display: "flex",
              justifyContent: "flex-end",
              flexDirection: "row",
              width: "50%",
            }}
          >
            {type === "html_code" && (
              <Button
                style={{ marginRight: 10 }}
                text={"Kết quả"}
                type={"default"}
                onClick={() => {
                  let formData =
                    formDataRef.current?.instance?.option("formData");
                  let question = formData?.Question;
                  setResultFromCode(question);
                  resultPopupRef?.current?.instance?.show();
                }}
              />
            )}

            <Button
              style={{ marginRight: 10 }}
              text={"Lưu"}
              type={"success"}
              onClick={() => {
                let data = formDataRef.current?.instance?.option("formData");
                if (typeof props.saveFunction === "function") {
                  props.saveFunction(data);
                }
              }}
            />
            <Button
              text={"Hủy"}
              type={"danger"}
              onClick={() => {
                formRef?.current?.instance?.hide();
              }}
            />
          </div>
        </div>
      </AppPopup>
      <AppPopup popupRef={resultPopupRef} height={500}>
        <HtmlEditor value={resultFromCode} readOnly={true} height={400} />
      </AppPopup>
    </div>
  );
};
