import "moment/locale/vi";
import React, { useEffect } from "react";
import "react-pro-sidebar/dist/css/styles.css";
import { useDispatch, useSelector } from "react-redux";
import { AppState } from "../../store/root_reducer";
import { Actions } from "./index.redux";
import "./index.scss";
import {
  DataGrid,
  Paging,
  Pager,
  Column,
  Form,
} from "devextreme-react/data-grid";
import { Editing } from "devextreme-react/data-grid";
import { Popup } from "devextreme-react/data-grid";
import { Item } from "devextreme-react/form";
import moment from "moment";
import { cloneDeep } from "lodash";

//#endregion
const Category = () => {
  const dispatch = useDispatch();
  const data = useSelector((store: AppState) => store.categoryReducer.data);
  useEffect(() => {
    dispatch(Actions.fetchData());
  }, []);
  let defaultData = {
    CategoryId: -1,
    CategoryName: null,
    ImageSrc: null,
    Remarks: null,
  };
  return (
    <div>
      <DataGrid
        dataSource={Array.isArray(data) ? data : []}
        showBorders={true}
        searchPanel={{ visible: true, highlightSearchText: true }}
        columnAutoWidth={true}
        rowAlternationEnabled={true}
        onRowRemoved={(e) => {
          let saveData = {
            ...cloneDeep(defaultData),
            ...e.data,
            ActionType: "D",
          };
          dispatch(Actions.SaveData(saveData));
        }}
        onRowInserted={(e) => {
          let saveData = {
            ...cloneDeep(defaultData),
            ...e.data,
            ActionType: "A",
          };
          dispatch(Actions.SaveData(saveData));
        }}
        onRowUpdated={(e) => {
          let saveData = {
            ...cloneDeep(defaultData),
            ...e.data,
            ActionType: "U",
          };
          dispatch(Actions.SaveData(saveData));
        }}
      >
        <Paging defaultPageSize={10} />
        <Pager
          showPageSizeSelector={true}
          allowedPageSizes={[5, 10, 20]}
          showInfo={true}
        />
        <Editing allowAdding allowDeleting allowUpdating mode="popup" useIcons>
          <Popup title="Danh m???c" showTitle={true} width={700} height={525} />
          <Form>
            <Item itemType="group" colCount={2} colSpan={2}>
              <Item dataField="CategoryName" />
              <Item dataField="ImageSrc" />
              <Item dataField="Remarks" colCount={2} colSpan={2} />
            </Item>
          </Form>
        </Editing>
        <Column
          alignment={"left"}
          dataField="CategoryId"
          caption={"Kh??a danh m???c"}
          allowEditing={false}
        />
        <Column dataField="CategoryName" caption={"T??n danh m???c"} />
        <Column dataField="Remarks" caption={"Ghi ch??"} />
        <Column
          caption={"???nh"}
          dataField="ImageSrc"
          cellRender={(arg) => {
            return (
              <img
                className={"image-category"}
                src={arg.value}
                alt={"category"}
              />
            );
          }}
        />
        <Column
          dataField="CreateDate"
          customizeText={(value: any) => {
            return moment(value.value, "YYYY-MM-DD").format("DD/MM/YYYY");
          }}
          caption={"Ng??y t???o"}
        />
      </DataGrid>
    </div>
  );
};
export default Category;
