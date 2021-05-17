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
import { Button, DropDownBox, Form } from "devextreme-react";
import { Item } from "devextreme-react/form";

//#endregion
const Question = () => {
  const dispatch = useDispatch();
  const dataCategory = useSelector(
    (store: AppState) => store.categoryReducer.data
  );
  const dataSet = useSelector((store: AppState) => store.setReducer.data);
  const {
    categorySelectedValue,
    setSelectedValue,
    allAnswer,
    focusedRowIndex,
    dataAnswer,
    dataQuestion,
    questionSelectedValue,
  } = useSelector((store: AppState) => store.questionReducer);
  useEffect(() => {
    dispatch(Actions.fetchData());
  }, []);
  const [categoryVisible, setCategoryVisible] = useState(false);
  const [a, setSetSelectedValue] = useState([]);
  const [setVisible, setSetVisible] = useState(false);

  useEffect(() => {}, []);
  //category
  const dataGrid_Category_onSelectionChanged = (e: any) => {
    //dispatch(Actions.setState({ categorySelectedValue: e.selectedRowKeys }));
    setCategoryVisible(false);
    let categoryId = Array.isArray(e) && e.length > 0 ? e[0].CategoryId : -1;
    dispatch(
      Actions.changeCategoryId({
        categoryId,
        categorySelectedValue: e,
      })
    );
  };
  const dataGridCategoryRender = (e: any) => {
    return (
      <DataGrid
        dataSource={dataCategory}
        columns={["CategoryId", "CategoryName"]}
        hoverStateEnabled={true}
        selectedRowKeys={categorySelectedValue}
        columnAutoWidth
        onSelectedRowKeysChange={dataGrid_Category_onSelectionChanged}
        height={300}
      >
        <Selection mode="single" />
        <Scrolling mode="virtual" />
        <FilterRow visible={true} />
      </DataGrid>
    );
  };
  const CategoryDropdown = () => {
    return (
      <DropDownBox
        value={
          Array.isArray(categorySelectedValue) &&
          categorySelectedValue.length > 0
            ? categorySelectedValue[0].CategoryId
            : -1
        }
        opened={categoryVisible}
        valueExpr="CategoryId"
        displayExpr="CategoryName"
        placeholder="Chọn danh mục"
        showClearButton={false}
        dataSource={dataCategory}
        contentRender={dataGridCategoryRender}
        onOpenedChange={(e) => {
          setCategoryVisible(e);
        }}
      />
    );
  };

  //set drop down render
  const dataGrid_Set_onSelectionChanged = (e: any) => {
    dispatch(Actions.setState({ setSelectedValue: e.selectedRowKeys }));
    setSetVisible(false);
    let categoryId =
      Array.isArray(e.selectedRowKeys) && e.selectedRowKeys.length > 0
        ? e.selectedRowKeys[0].CategoryId
        : -1;
    let setId =
      Array.isArray(e.selectedRowKeys) && e.selectedRowKeys.length > 0
        ? e.selectedRowKeys[0].setId
        : -1;
    //dispatch(Actions.changeCategoryId({ categoryId, setId }));
  };
  const dataGridSetRender = (e: any) => {
    return (
      <DataGrid
        dataSource={dataSet}
        columns={["SetId", "SetName"]}
        hoverStateEnabled={true}
        columnAutoWidth
        selectedRowKeys={setSelectedValue}
        onSelectionChanged={dataGrid_Set_onSelectionChanged}
        height={300}
      >
        <Selection mode="single" />
        <Scrolling mode="virtual" />
        <FilterRow visible={true} />
      </DataGrid>
    );
  };
  const SetDropdown = () => {
    return (
      <DropDownBox
        value={
          Array.isArray(setSelectedValue) && setSelectedValue.length > 0
            ? setSelectedValue[0].SetId
            : -1
        }
        opened={setVisible}
        valueExpr="SetId"
        displayExpr="SetName"
        placeholder="Chọn bộ câu hỏi"
        showClearButton={false}
        dataSource={dataSet}
        contentRender={dataGridSetRender}
        onOpenedChange={(e) => {
          setSetVisible(e);
        }}
      />
    );
  };

  return (
    <div>
      <Form className={"header-form"} style={{ paddingBottom: 20 }}>
        <Item itemType="group" colCount={2} colSpan={1}>
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
        dataSource={Array.isArray(dataQuestion) ? dataQuestion : []}
        showBorders={true}
        searchPanel={{ visible: true, highlightSearchText: true }}
        columnAutoWidth={true}
        rowAlternationEnabled={true}
        selectedRowKeys={questionSelectedValue}
        defaultSelectedRowKeys={
          Array.isArray(dataQuestion) ? [dataQuestion[0]] : []
        }
        selection={{ mode: "single" }}
        onSelectionChanged={(e) => {
          let questionId =
            Array.isArray(e.selectedRowKeys) && e.selectedRowKeys.length > 0
              ? e.selectedRowKeys[0].QuestionId
              : -1;
          if (questionId === -1) {
            dispatch(
              Actions.setState({
                questionSelectedValue: e.selectedRowKeys,
              })
            );
          } else {
            let newDataAnswer = allAnswer?.filter(
              (x) => x.QuestionId === questionId
            );
            dispatch(
              Actions.setState({
                questionSelectedValue: e.selectedRowKeys,
                dataAnswer: newDataAnswer,
              })
            );
          }
        }}
        onToolbarPreparing={(e) => {
          e.toolbarOptions?.items?.unshift({
            location: "before",
            widget: "dxButton",
            options: {
              elementAttr: {
                class: "toolbar-btn-title",
              },
              type: "normal",
              text: "Câu hỏi",
              icon: "chevronnext",
              stylingMode: "text",
            },
          });
        }}
        // onFocusedRowChanging={(e) => {
        //   console.log(e);
        //   let questionId =
        //     Array.isArray(dataQuestion) && dataQuestion.length > 0
        //       ? dataQuestion[
        //           e.newRowIndex !== undefined && e.newRowIndex !== null
        //             ? e.newRowIndex
        //             : -1
        //         ].QuestionId
        //       : -1;
        //   let newDataAnswer = allAnswer?.filter(
        //     (x) => x.QuestionId === questionId
        //   );
        //   dispatch(
        //     Actions.setState({
        //       focusedRowIndex: e.newRowIndex,
        //       dataAnswer: newDataAnswer,
        //     })
        //   );
        // }}
      >
        <Selection mode={"single"} selectAllMode={"allPages"} />
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
        dataSource={Array.isArray(dataAnswer) ? dataAnswer : []}
        showBorders={true}
        searchPanel={{ visible: true, highlightSearchText: true }}
        columnAutoWidth={true}
        rowAlternationEnabled={true}
        // selectedRowKeys={questionSelectedValue}
        // onSelectionChanged={dataGrid_Question_onSelectionChanged}
        onToolbarPreparing={(e) => {
          e.toolbarOptions?.items?.unshift({
            location: "before",
            widget: "dxButton",
            options: {
              elementAttr: {
                class: "toolbar-btn-title",
              },
              type: "normal",
              text: "Đáp án",
              icon: "chevronnext",
              stylingMode: "text",
            },
          });
        }}
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
