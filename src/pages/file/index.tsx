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
  Selection,
  Scrolling,
  FilterRow,
  Lookup,
} from "devextreme-react/data-grid";
import { DropDownBox, Form, SelectBox } from "devextreme-react";
import { Item } from "devextreme-react/form";

//#endregion
const File = () => {
  const dispatch = useDispatch();
  const data = useSelector((store: AppState) => store.userReducer.data);
  useEffect(() => {
    dispatch(Actions.fetchData());
  }, []);
  const [categorySelectedValue, setCategorySelectedValue] = useState([]);
  const [categoryVisible, setCategoryVisible] = useState(false);
  const [setSelectedValue, setSetSelectedValue] = useState([]);
  const [setVisible, setSetVisible] = useState(false);
  const [fileType, setFileType] = useState("Question");
  const dataGrid_Category_onSelectionChanged = (e: any) => {
    setCategorySelectedValue(e.selectedRowKeys);
    setCategoryVisible(false);
  };
  const dataGrid_Set_onSelectionChanged = (e: any) => {
    setSetSelectedValue(e.selectedRowKeys);
    setSetVisible(false);
  };
  useEffect(() => {}, []);
  const dataGridCategoryRender = (e: any) => {
    return (
      <DataGrid
        dataSource={[{ Id: 1, Name: "namnx" }]}
        columns={["Id", "Name"]}
        hoverStateEnabled={true}
        selectedRowKeys={categorySelectedValue}
        onSelectionChanged={dataGrid_Category_onSelectionChanged}
        height={300}
      >
        <Selection mode="single" />
        <Scrolling mode="virtual" />
        <Paging enabled={true} pageSize={10} />
        <FilterRow visible={true} />
      </DataGrid>
    );
  };
  const CategoryDropdown = () => {
    return (
      <DropDownBox
        value={1}
        opened={categoryVisible}
        valueExpr="Id"
        displayExpr="Name"
        placeholder="Ch???n danh m???c"
        showClearButton={false}
        dataSource={[{ Id: 1, Name: "namnx" }]}
        contentRender={dataGridCategoryRender}
        onOpenedChange={(e) => {
          setCategoryVisible(e);
        }}
      />
    );
  };

  //set drop down render
  const dataGridSetRender = (e: any) => {
    return (
      <DataGrid
        dataSource={[{ Id: 1, Name: "namnx" }]}
        columns={["Id", "Name"]}
        hoverStateEnabled={true}
        selectedRowKeys={setSelectedValue}
        onSelectionChanged={dataGrid_Set_onSelectionChanged}
        height={300}
      >
        <Selection mode="single" />
        <Scrolling mode="virtual" />
        <Paging enabled={true} pageSize={10} />
        <FilterRow visible={true} />
      </DataGrid>
    );
  };
  const SetDropdown = () => {
    return (
      <DropDownBox
        value={1}
        opened={setVisible}
        valueExpr="Id"
        displayExpr="Name"
        placeholder="Ch???n danh m???c"
        showClearButton={false}
        dataSource={[{ Id: 1, Name: "namnx" }]}
        contentRender={dataGridSetRender}
        onOpenedChange={(e) => {
          setSetVisible(e);
        }}
      />
    );
  };

  const FileTypeDropdown = () => {
    return (
      <SelectBox
        value={fileType}
        valueExpr="Id"
        displayExpr="Name"
        placeholder="Ch???n danh m???c"
        showClearButton={false}
        onValueChanged={(e) => {
          setFileType(e.value);
        }}
        dataSource={[
          { Id: "Question", Name: "C??u h???i" },
          { Id: "Answer", Name: "????p ??n" },
        ]}
      />
    );
  };

  return (
    <div>
      <Form className={"header-form"}>
        <Item
          itemType="group"
          colCount={fileType === "Answer" ? 3 : 2}
          colSpan={1}
        >
          <Item
            label={{ text: "File ???????c ghim v??o", showColon: false }}
            render={FileTypeDropdown}
          ></Item>
          <Item
            label={{ text: "Danh m???c", showColon: false }}
            render={CategoryDropdown}
          ></Item>
          <Item
            label={{ text: "B??? c??u h???i", showColon: false }}
            render={SetDropdown}
          ></Item>
          <Item
            label={{ text: "C??u h???i", showColon: false }}
            render={SetDropdown}
          ></Item>
          {fileType === "Answer" && (
            <Item
              label={{ text: "????p ??n", showColon: false }}
              render={SetDropdown}
            ></Item>
          )}
        </Item>
      </Form>
      <DataGrid
        dataSource={Array.isArray(data) ? data : []}
        showBorders={true}
        searchPanel={{ visible: true, highlightSearchText: true }}
        columnAutoWidth={true}
        rowAlternationEnabled={true}
      >
        <Paging defaultPageSize={20} />
        <Pager
          showPageSizeSelector={true}
          allowedPageSizes={[10, 20, 30]}
          showInfo={true}
        />

        <Column dataField="FileId" caption={"M?? t???p"} allowEditing={false} />
        <Column dataField="FileName" caption={"T??n t???p"} />
        <Column dataField="Type" caption={"Lo???i"} />
        <Column dataField="Path" caption={"???????ng d???n"} />
        <Column dataField="UseType" visible={false} allowEditing={false}>
          <Lookup
            dataSource={[
              { value: "Question", name: "C??u h???i" },
              { value: "Answer", name: "????p ??n" },
              { value: null, name: "C??u h???i" },
            ]}
            valueExpr={"value"}
            displayExpr={"name"}
          />
        </Column>
        <Column dataField="Remark" caption={"Ghi ch??"} />
        <Column
          dataField="CreateDate"
          caption={"Ng??y t???o"}
          allowEditing={false}
        />
        <Column dataField="CategoryId" visible={false} allowEditing={false} />
        <Column dataField="SetId" visible={false} allowEditing={false} />
        <Column dataField="QuestionId" visible={false} allowEditing={false} />
        <Column dataField="AnswerId" visible={false} allowEditing={false} />
      </DataGrid>
    </div>
  );
};
export default File;
