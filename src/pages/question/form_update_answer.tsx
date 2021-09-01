import { Button } from "devextreme-react/button";
import { cloneDeep } from "lodash";
import React, { useEffect, useState } from "react";
import { v4 } from "uuid";
import AppPopup from "../../components/controls/popup";
import { FormAnswerList } from "./form_answer_list";

export const FormUpdateAnswer = (props: any) => {
  let dataDefault = cloneDeep(props.data);
  let formRef = props.formRef;
  const [data, setData] = useState<any[]>([cloneDeep(props.data)]);
  useEffect(() => {
    if (props.isHaveData === true) {
      setData(cloneDeep([props.data]));
    } else if (props.data) {
      let initData = [];
      for (let i = 0; i < 4; i++) {
        let newData = cloneDeep(props.data);
        newData.Id = v4();
        initData.push(newData);
      }
      setData(initData);
    } else {
      setData([props.data]);
    }
  }, [props.data, props.isHaveData]);
  return (
    <div>
      <AppPopup
        height={700}
        popupRef={formRef}
        titleRender={() => {
          return (
            <div
              style={{
                marginTop: 20,
                justifyContent: "space-between",
                display: "flex",
                flexDirection: "row",
              }}
            >
              <div
                style={{
                  borderWidth: 1,
                  borderColor: "red",
                  display: "flex",
                  //justifyContent: "flex-end",
                  flexDirection: "row",
                  width: "50%",
                }}
              >
                {dataDefault?.ActionType === "A" && (
                  <Button
                    style={{ marginRight: 10 }}
                    stylingMode={"text"}
                    type={"success"}
                    icon={"add"}
                    onClick={() => {
                      let newData = cloneDeep(data);
                      dataDefault.Id = v4();
                      newData.push(dataDefault);
                      setData(newData);
                    }}
                  />
                )}

                <Button
                  style={{ marginRight: 10 }}
                  icon={"save"}
                  type={"default"}
                  stylingMode={"text"}
                  onClick={() => {
                    let newData = cloneDeep(data);
                    if (typeof props.saveFunction === "function") {
                      props.saveFunction(newData);
                    }
                  }}
                />
              </div>
              <Button
                icon={"close"}
                type={"danger"}
                stylingMode={"text"}
                onClick={() => {
                  formRef?.current?.instance?.hide();
                }}
              />
            </div>
          );
        }}
      >
        <FormAnswerList
          actionType={dataDefault?.ActionType}
          data={data}
          updateData={(object: any) => {
            let id = object.Id;
            let newData = cloneDeep(data);
            let index = newData.findIndex((x) => x.Id === id);
            if (index >= 0) {
              newData[index] = cloneDeep(object);
              setData(newData);
            }
          }}
          deleteData={(object: any) => {
            let id = object.Id;
            let newData = cloneDeep(data);
            let index = newData.findIndex((x) => x.Id === id);
            if (index >= 0) {
              newData.splice(index, 1);
              setData(newData);
            }
          }}
        />
      </AppPopup>
    </div>
  );
};
