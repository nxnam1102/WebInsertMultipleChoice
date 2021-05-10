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
import { DropDownBox, Form } from "devextreme-react";
import { Item } from "devextreme-react/form";

//#endregion
const Question = () => {
  const dispatch = useDispatch();
  const data = useSelector((store: AppState) => store.userReducer.data);
  useEffect(() => {
    dispatch(Actions.fetchData());
  }, []);
  const [categorySelectedValue, setCategorySelectedValue] = useState([]);
  const [categoryVisible, setCategoryVisible] = useState(false);
  const [setSelectedValue, setSetSelectedValue] = useState([]);
  const [setVisible, setSetVisible] = useState(false);
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
        placeholder="Chọn danh mục"
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
        placeholder="Chọn danh mục"
        showClearButton={false}
        dataSource={[{ Id: 1, Name: "namnx" }]}
        contentRender={dataGridSetRender}
        onOpenedChange={(e) => {
          setSetVisible(e);
        }}
      />
    );
  };

  return (
    <div>
      <Form className={"header-form"}>
        <Item itemType="group" colCount={2} colSpan={2}>
          <Item
            label={{ text: "Danh mục", showColon: false }}
            render={CategoryDropdown}
          ></Item>
          <Item
            label={{ text: "Bộ câu hỏi", showColon: false }}
            render={SetDropdown}
          ></Item>
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

        <Column dataField="CategoryId" visible={false} allowEditing={false} />
        <Column dataField="SetId" visible={false} allowEditing={false} />
        <Column
          dataField="QuestionId"
          caption={"Mã câu hỏi"}
          alignment={"left"}
          allowEditing={false}
        />
        <Column dataField="Question" caption={"Câu hỏi"} />
        <Column dataField="QuestionType" caption={"Loại"}>
          <Lookup
            dataSource={[
              { value: "one", name: "Một đáp án" },
              { value: "multiple", name: "Nhiều đáp án" },
              { value: null, name: "Một đáp án" },
            ]}
            valueExpr={"value"}
            displayExpr={"name"}
          />
        </Column>
        <Column
          dataField="CreateDate"
          caption={"Ngày tạo"}
          allowEditing={false}
        />
        <Column dataField="Remarks" caption={"Gợi ý"} />
      </DataGrid>
      <div style={{ height: 10 }} />
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
        <Column dataField="CategoryId" visible={false} allowEditing={false} />
        <Column dataField="SetId" visible={false} allowEditing={false} />
        <Column dataField="QuestionId" visible={false} allowEditing={false} />
        <Column
          dataField="AnswerId"
          caption={"Mã đáp án"}
          allowEditing={false}
        />
        <Column dataField="Answer" caption={"Đáp án"} />
        <Column dataField="Remark" caption={"Ghi chú"} />
        <Column dataField="IsTrueAnswer" caption={"Là đáp án đúng"}>
          <Lookup
            dataSource={[
              { value: "Y", name: "Đúng" },
              { value: "N", name: "Sai" },
              { value: null, name: "Sai" },
            ]}
            valueExpr={"value"}
            displayExpr={"name"}
          />
        </Column>
      </DataGrid>
    </div>
  );
};
export default Question;
