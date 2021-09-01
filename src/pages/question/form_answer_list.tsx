import { Button } from "devextreme-react/button";
import { Form, Item } from "devextreme-react/form";
import { HtmlEditor } from "devextreme-react/html-editor";
import { cloneDeep } from "lodash";
import React, { useMemo, useRef, useState } from "react";
import {
  IoChevronDown,
  IoChevronUp,
  IoRemoveCircleOutline,
} from "react-icons/io5";
import AppPopup from "../../components/controls/popup";
import { isNotEmpty } from "../../helpers/utilities";
import "./index.scss";

export const FormAnswerList = (props: any) => {
  let data = useMemo(() => {
    return Array.isArray(props.data) ? cloneDeep(props.data) : [];
  }, [props.data]);
  let dataSourceAnswerType = useMemo(() => {
    return [
      { code: "Y", name: "Đáp án đúng" },
      { code: "N", name: "Đáp án sai" },
    ];
  }, []);
  let dataSourceType = useMemo(() => {
    return [
      { code: "html", name: "HTML Copy" },
      { code: "html_code", name: "HTML Code" },
      { code: "normal", name: "Bình thường" },
    ];
  }, []);
  //const [type, setType] = useState("normal");
  const [resultFromCode, setResultFromCode] = useState("");
  const formDataRef = useRef<any[]>([]);
  const resultPopupRef = useRef<any>(null);
  const renderItem = useMemo(() => {
    return (
      <div>
        {data.map((x: any, index: any) => {
          return (
            <div key={`${index}`}>
              {props.actionType === "A" && (
                <div
                  style={{
                    width: "100%",
                    flex: 1,
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    paddingBottom: 10,
                    paddingTop: 10,
                    borderBottomWidth: 1,
                    borderBottomStyle: "solid",
                    borderBottomColor: "#cccccc",
                  }}
                >
                  <Button
                    stylingMode={"text"}
                    onClick={() => {
                      props.deleteData(cloneDeep(x));
                    }}
                  >
                    <IoRemoveCircleOutline size={20} color={"red"} />
                  </Button>
                  <Button
                    onClick={() => {
                      let objectData = cloneDeep(x);
                      objectData.Open = x?.Open === true ? false : true;
                      props.updateData(objectData);
                    }}
                    stylingMode={"text"}
                    className={"button-collapse"}
                    style={{ display: "flex", flex: 9 / 10 }}
                  >
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        flex: 1,
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <div
                        style={{
                          marginLeft: 10,
                          fontSize: 25,
                          fontWeight: "bold",
                        }}
                      >
                        {`Đáp án ${index + 1}`}
                      </div>
                      <div>
                        {x?.Open === true ? (
                          <IoChevronUp size={20} />
                        ) : (
                          <IoChevronDown size={20} />
                        )}
                      </div>
                    </div>
                  </Button>
                </div>
              )}

              {(x?.Open === true || props.actionType !== "A") && (
                <div style={{ paddingTop: 10 }}>
                  <Form
                    formData={x}
                    ref={(el) => {
                      formDataRef.current.push(el);
                    }}
                  >
                    <Item itemType="group" colCount={2} colSpan={2}>
                      <Item
                        dataField="AnswerId"
                        editorOptions={{
                          readOnly: true,
                          value: x?.AnswerId ? x.AnswerId : -1,
                        }}
                      />
                      <Item
                        dataField="IsTrueAnswer"
                        editorType="dxSelectBox"
                        editorOptions={{
                          dataSource: dataSourceAnswerType,
                          displayExpr: "name",
                          valueExpr: "code",
                          value: x?.IsTrueAnswer ? x.IsTrueAnswer : "N",
                          onValueChanged: (e: any) => {
                            let objectData = cloneDeep(x);
                            if (isNotEmpty(objectData)) {
                              objectData.IsTrueAnswer = e.value;
                              props.updateData(objectData);
                            }
                          },
                        }}
                      />
                      <Item
                        dataField="Remarks"
                        editorOptions={{
                          value: x?.Remarks ? x.Remarks : "",
                          onValueChanged: (e: any) => {
                            let objectData = cloneDeep(x);
                            if (isNotEmpty(objectData)) {
                              objectData.Remarks = e.value;
                              props.updateData(objectData);
                            }
                          },
                        }}
                      />
                      <Item
                        dataField="Type"
                        editorType="dxSelectBox"
                        editorOptions={{
                          dataSource: dataSourceType,
                          displayExpr: "name",
                          valueExpr: "code",
                          value: x?.Type ? x.Type : "normal",
                          onValueChanged: (e: any) => {
                            let objectData = cloneDeep(x);
                            if (isNotEmpty(objectData)) {
                              objectData.Type = e.value;
                              props.updateData(objectData);
                            }
                          },
                        }}
                      />
                      {x?.Type === "html" ? (
                        <Item
                          dataField="Answer"
                          editorType="dxHtmlEditor"
                          colSpan={2}
                          editorOptions={{
                            value: x?.Answer ? x.Answer : "",
                            onValueChanged: (e: any) => {
                              let objectData = cloneDeep(x);
                              if (isNotEmpty(objectData)) {
                                objectData.Answer = e.value;
                                props.updateData(objectData);
                              }
                            },
                            height: 350,
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
                      ) : x?.Type === "html_code" ? (
                        <Item
                          dataField="Answer"
                          editorType="dxTextArea"
                          colSpan={2}
                          editorOptions={{
                            height: 200,
                            value: x?.Answer ? x.Answer : "",
                            onValueChanged: (e: any) => {
                              let objectData = cloneDeep(x);
                              if (isNotEmpty(objectData)) {
                                objectData.Answer = e.value;
                                props.updateData(objectData);
                              }
                            },
                          }}
                        />
                      ) : (
                        <Item
                          dataField="Answer"
                          editorType="dxTextArea"
                          colSpan={2}
                          editorOptions={{
                            height: 200,
                            value: x?.Answer ? x.Answer : "",
                            onValueChanged: (e: any) => {
                              let objectData = cloneDeep(x);
                              if (isNotEmpty(objectData)) {
                                objectData.Answer = e.value;
                                props.updateData(objectData);
                              }
                            },
                          }}
                        />
                      )}
                    </Item>
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
                      {x?.Type === "html_code" && (
                        <Button
                          style={{ marginRight: 10, marginTop: 10 }}
                          text={"Kết quả"}
                          type={"default"}
                          onClick={() => {
                            setResultFromCode(x?.Answer);
                            resultPopupRef?.current?.instance?.show();
                          }}
                        />
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  }, [data, dataSourceAnswerType, dataSourceType, props]);
  const renderPopupResult = useMemo(() => {
    console.log(resultFromCode);
    return (
      <AppPopup popupRef={resultPopupRef} height={500}>
        <HtmlEditor value={resultFromCode} readOnly={true} height={400} />
      </AppPopup>
    );
  }, [resultFromCode]);
  return (
    <div>
      {renderItem}
      {renderPopupResult}
    </div>
  );
};
