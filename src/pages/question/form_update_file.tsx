import { HtmlEditor } from "devextreme-react";
import { Button } from "devextreme-react/button";
import { FileUploader } from "devextreme-react/file-uploader";
import { Form, Item } from "devextreme-react/form";
import { cloneDeep } from "lodash";
import React, { useRef, useState } from "react";
import AppPopup from "../../components/controls/popup";
import { isNotEmpty } from "../../helpers/utilities";

export const FormUpdateFile = (props: any) => {
  let data = props.data;
  let formRef = props.formRef;
  let dataSourceUseType = [
    { code: "Question", name: "Câu hỏi" },
    { code: "Answer", name: "Đáp án" },
  ];
  let dataSourceType = [
    { code: "url", name: "From url" },
    { code: "server", name: "Upload to server" },
    { code: "html", name: "Html" },
  ];
  let dataSourceSelectType = [
    { code: "default", name: "Mặc định" },
    { code: "audio", name: "Âm thanh" },
    { code: "image", name: "Hình ảnh" },
  ];
  let dataSourceSelectTypeHtml = [
    { code: "html", name: "HTML Copy" },
    { code: "html_code", name: "HTML Code" },
  ];
  const [type, setType] = useState("url");
  const [selectType, setSelectType] = useState("default");
  const formDataRef = useRef<any>(null);
  const [fileUpload, setFileUpload] = useState<any>();
  const [resultFromCode, setResultFromCode] = useState("");
  const resultPopupRef = useRef<any>(null);
  return (
    <div>
      <AppPopup height={750} popupRef={formRef}>
        <Form formData={data} ref={formDataRef}>
          <Item itemType="group" colCount={2} colSpan={2}>
            <Item
              dataField="FileId"
              editorOptions={{
                readOnly: true,
              }}
            />
            <Item dataField="FileName" isRequired />
            <Item
              dataField="UseType"
              editorType="dxSelectBox"
              editorOptions={{
                readOnly: true,
                dataSource: dataSourceUseType,
                displayExpr: "name",
                valueExpr: "code",
              }}
            />
            <Item
              dataField="Type"
              editorType="dxSelectBox"
              editorOptions={{
                dataSource: dataSourceType,
                displayExpr: "name",
                valueExpr: "code",
                value: type ? type : "url",
                onValueChanged: (e: any) => {
                  setType(e.value);
                  if (e.value === "html") {
                    setSelectType("html");
                  } else {
                    setSelectType("default");
                  }
                },
              }}
            />

            {type !== "server" && (
              <Item
                dataField="SelectType"
                editorType="dxSelectBox"
                editorOptions={{
                  dataSource:
                    type === "html"
                      ? dataSourceSelectTypeHtml
                      : dataSourceSelectType,
                  displayExpr: "name",
                  valueExpr: "code",
                  value: selectType
                    ? selectType
                    : type === "html"
                    ? "html"
                    : "default",
                  onValueChanged: (e: any) => {
                    setSelectType(e.value);
                  },
                }}
              />
            )}
            <Item dataField="Remarks" colSpan={2} />

            {type === "html" && selectType === "html_code" ? (
              <Item
                dataField="Path"
                editorType="dxTextArea"
                colSpan={2}
                editorOptions={{ height: 450 }}
              />
            ) : selectType === "html" && type === "html" ? (
              <Item
                dataField="Path"
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
            ) : type !== "url" ? (
              <Item
                dataField="Path"
                colSpan={2}
                render={(e) => {
                  return (
                    <FileUploader
                      multiple={false}
                      accept={"*"}
                      uploadMode={"useForm"}
                      onValueChanged={(e) => {
                        let data =
                          formDataRef.current?.instance?.option("formData");
                        if (isNotEmpty(data.FileName) === false) {
                          if (Array.isArray(e.value) && e.value.length > 0) {
                            let name = cloneDeep(e.value[0].name);
                            formDataRef.current?.instance?.updateData(
                              "FileName",
                              name.split(".").slice(0, -1).join(".")
                            );
                          }
                        }
                        setFileUpload(e.value);
                      }}
                    />
                  );
                }}
              />
            ) : (
              <Item dataField="Path" editorType="dxTextArea" colSpan={2} />
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
            {selectType === "html_code" && (
              <Button
                style={{ marginRight: 10 }}
                text={"Kết quả"}
                type={"default"}
                onClick={() => {
                  let formData =
                    formDataRef.current?.instance?.option("formData");
                  let path = formData?.Path;
                  setResultFromCode(path);
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
                  props.saveFunction(data, fileUpload);
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
