import "moment/locale/vi";
import React, { useEffect, useState } from "react";
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
  Form as FormGrid,
  Selection,
  Scrolling,
  FilterRow,
} from "devextreme-react/data-grid";
import { Editing } from "devextreme-react/data-grid";
import { Popup } from "devextreme-react/data-grid";
import moment from "moment";
import { DropDownBox } from "devextreme-react/drop-down-box";
import { Form, Item } from "devextreme-react/form";
import { cloneDeep } from "lodash";

//#endregion
const Set = () => {
  const dispatch = useDispatch();
  const data = useSelector((store: AppState) => store.setReducer.data);
  const categorySelectedValue = useSelector(
    (store: AppState) => store.setReducer.categorySelectedValue
  );
  const dataCategory = useSelector(
    (store: AppState) => store.categoryReducer.data
  );
  useEffect(() => {
    dispatch(Actions.fetchData());
  }, []);

  const [categoryVisible, setCategoryVisible] = useState(false);
  const dataGrid_Category_onSelectionChanged = (e: any) => {
    if (
      Array.isArray(e.selectedRowKeys) &&
      e.selectedRowKeys.length > 0 &&
      e.selectedRowKeys[0].CategoryId !== categorySelectedValue
    ) {
      dispatch(Actions.getDataByCategoryId(e.selectedRowKeys[0].CategoryId));
      setCategoryVisible(false);
    }
  };
  const dataGridCategoryRender = (e: any) => {
    return (
      <DataGrid
        dataSource={dataCategory}
        hoverStateEnabled={true}
        selectedRowKeys={[
          dataCategory?.find((x) => x.CategoryId === categorySelectedValue),
        ]}
        onSelectionChanged={dataGrid_Category_onSelectionChanged}
        height={300}
      >
        <Selection mode="single" />
        <Scrolling mode="virtual" />
        <Paging enabled={true} pageSize={10} />
        <FilterRow visible={true} />
        <Column dataField="CategoryId" caption={"Mã danh mục"} />
        <Column dataField="CategoryName" caption={"Tên danh mục"} />
        <Column
          caption={"Ảnh"}
          dataField="ImageSrc"
          cellRender={(arg) => {
            return <img className={"image-category"} src={arg.value} />;
          }}
        />
      </DataGrid>
    );
  };
  const categoryChanged = (value: any) => {};
  console.log(categorySelectedValue);
  const CategoryDropdown = () => {
    return (
      <DropDownBox
        value={categorySelectedValue}
        opened={categoryVisible}
        valueExpr="CategoryId"
        displayExpr="CategoryName"
        placeholder="Chọn danh mục"
        dataSource={dataCategory}
        showClearButton={false}
        contentRender={dataGridCategoryRender}
        onOpenedChange={(e) => {
          setCategoryVisible(e);
        }}
      />
    );
  };
  let defaultData = {
    CategoryId: -1,
    SetId: -1,
    SetName: null,
    Remarks: null,
  };
  return (
    <div>
      <Form className={"header-form"}>
        <Item itemType="group" colCount={2} colSpan={1}>
          <Item
            label={{ text: "Danh mục", showColon: false }}
            render={CategoryDropdown}
          ></Item>
        </Item>
      </Form>
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
            CategoryId: categorySelectedValue,
            ActionType: "D",
          };
          dispatch(Actions.SaveData(saveData));
        }}
        onRowInserted={(e) => {
          console.log(e);
          let saveData = {
            ...cloneDeep(defaultData),
            ...e.data,
            CategoryId: categorySelectedValue,
            ActionType: "A",
          };
          dispatch(Actions.SaveData(saveData));
        }}
        onRowUpdated={(e) => {
          let saveData = {
            ...cloneDeep(defaultData),
            ...e.data,
            CategoryId: categorySelectedValue,
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
          <Popup title="Danh mục" showTitle={true} width={700} height={525} />
          <FormGrid>
            <Item itemType="group" colCount={2} colSpan={2}>
              <Item dataField="SetName" />
              <Item dataField="Type" />
              <Item dataField="Remarks" colCount={2} colSpan={2} />
            </Item>
          </FormGrid>
        </Editing>
        <Column dataField="CategoryId" visible={false} allowEditing={false} />
        <Column
          alignment={"left"}
          dataField="SetId"
          caption={"Khóa bộ câu hỏi"}
          allowEditing={false}
        />
        <Column dataField="SetName" caption={"Tên bộ câu hỏi"} />
        <Column dataField="Remarks" caption={"Ghi chú"} />
        <Column dataField="Type" caption={"Loại"} />
        <Column
          dataField="CreateDate"
          allowEditing={false}
          customizeText={(value: any) => {
            return moment(value.value, "YYYY-MM-DD").format("DD/MM/YYYY");
          }}
          caption={"Ngày tạo"}
        />
      </DataGrid>
    </div>
  );
};
export default Set;
