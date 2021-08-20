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

//#endregion
const Category = () => {
  const dispatch = useDispatch();
  const data = useSelector((store: AppState) => store.categoryReducer.data);
  useEffect(() => {
    dispatch(Actions.fetchData());
  }, []);
  return (
    <div>
      <DataGrid
        dataSource={Array.isArray(data) ? data : []}
        showBorders={true}
        searchPanel={{ visible: true, highlightSearchText: true }}
        columnAutoWidth={true}
        rowAlternationEnabled={true}
      >
        <Paging defaultPageSize={10} />
        <Pager
          showPageSizeSelector={true}
          allowedPageSizes={[5, 10, 20]}
          showInfo={true}
        />
        <Editing allowAdding allowDeleting allowUpdating mode="popup">
          <Popup title="Danh mục" showTitle={true} width={700} height={525} />
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
          caption={"Khóa danh mục"}
          allowEditing={false}
        />
        <Column dataField="CategoryName" caption={"Tên danh mục"} />
        <Column dataField="Remarks" caption={"Ghi chú"} />
        <Column
          caption={"Ảnh"}
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
          caption={"Ngày tạo"}
        />
      </DataGrid>
    </div>
  );
};
export default Category;
