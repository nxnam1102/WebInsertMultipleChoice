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
  ];
  const [type, setType] = useState("url");
  const formDataRef = useRef<any>(null);
  const [fileUpload, setFileUpload] = useState<any>();
  return (
    <div>
      <AppPopup height={450} popupRef={formRef}>
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
                },
              }}
            />
            <Item dataField="Remarks" colSpan={2} />

            {type !== "url" ? (
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
    </div>
  );
};
