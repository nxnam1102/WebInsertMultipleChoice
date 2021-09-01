import { Button, DropDownBox, Form } from "devextreme-react";
import {
  Column,
  DataGrid,
  FilterRow,
  Lookup,
  Pager,
  Paging,
  Scrolling,
  Selection,
} from "devextreme-react/data-grid";
import { Item } from "devextreme-react/form";
import "moment/locale/vi";
import React, { useEffect, useMemo, useRef, useState } from "react";
import "react-pro-sidebar/dist/css/styles.css";
import { useDispatch, useSelector } from "react-redux";
import { useWindowDimensions } from "../../helpers/window-dimension";
import { AppState } from "../../store/root_reducer";
import { FormUpdateQuestion } from "./form_update_question";
import { FormUpdateAnswer } from "./form_update_answer";
import { Actions } from "./index.redux";
import { FormUpdateFile } from "./form_update_file";
import "./index.scss";
import { cloneDeep } from "lodash";
import AppPopup from "../../components/controls/popup";
import { ImAttachment } from "react-icons/im";
import { IoEye } from "react-icons/io5";
import { FormDetail } from "./view_detail";
import { confirm } from "devextreme/ui/dialog";
import { PreviewFile } from "./preview_file";
import { v4 } from "uuid";
import { isNotEmpty } from "../../helpers/utilities";

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
    dataFile,
    allFile,
    dataAnswer,
    dataQuestion,
    questionSelectedValue,
    answerSelectedValue,
    dataFileAnswer,
  } = useSelector((store: AppState) => store.questionReducer);
  useEffect(() => {
    dispatch(Actions.fetchData());
  }, []);
  const [categoryVisible, setCategoryVisible] = useState(false);
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
    setSetVisible(false);
    let categoryId =
      Array.isArray(e.selectedRowKeys) && e.selectedRowKeys.length > 0
        ? e.selectedRowKeys[0].CategoryId
        : -1;
    let setId =
      Array.isArray(e.selectedRowKeys) && e.selectedRowKeys.length > 0
        ? e.selectedRowKeys[0].SetId
        : -1;
    dispatch(
      Actions.changeCategoryId({ categoryId, setId, setSelectedValue: e })
    );
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
  const { height } = useWindowDimensions();
  const formEditQuestionRef = useRef<any>(null);
  const formEditAnswerRef = useRef<any>(null);
  const formEditFileRef = useRef<any>(null);
  const popupQuestionFileRef = useRef<any>(null);
  const popupAnswerFileRef = useRef<any>(null);
  const [dataFormQuestion, setDataFormQuestion] = useState();
  const [dataFormAnswer, setDataFormAnswer] = useState();
  const [dataFormFile, setDataFormFile] = useState();
  const gridQuestionRef = useRef<any>(null);
  const formDetailRef = useRef<any>(null);
  const [valueDetail, setValueDetail] = useState();
  const [dataPreviewFile, setDataPreviewFile] = useState();
  const formPreviewFileRef = useRef<any>(null);
  //===========render memo===============

  const renderGridQuestion = useMemo(() => {
    return (
      <DataGrid
        ref={gridQuestionRef}
        showRowLines={true}
        showColumnLines={true}
        className={"question-grid"}
        dataSource={Array.isArray(dataQuestion) ? dataQuestion : []}
        showBorders={true}
        searchPanel={{ visible: true, highlightSearchText: true }}
        columnAutoWidth={true}
        //rowAlternationEnabled={true}
        height={(height - 100) / 2}
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
            let newDataFile = allFile?.filter(
              (x) => x.QuestionId === questionId && x.UseType === "Question"
            );
            dispatch(
              Actions.setState({
                questionSelectedValue: e.selectedRowKeys,
                dataAnswer: newDataAnswer,
                dataFile: newDataFile,
                answerSelectedValue:
                  Array.isArray(newDataAnswer) && newDataAnswer.length > 0
                    ? [newDataAnswer[0]]
                    : undefined,
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
          e.toolbarOptions?.items?.unshift({
            location: "after",
            widget: "dxButton",
            options: {
              type: "success",
              stylingMode: "text",
              icon: "add",
              onClick: () => {
                let defaultData: any = {
                  CategoryId:
                    Array.isArray(categorySelectedValue) &&
                    categorySelectedValue.length > 0
                      ? categorySelectedValue[0].CategoryId
                      : -1,
                  SetId:
                    Array.isArray(setSelectedValue) &&
                    setSelectedValue.length > 0
                      ? setSelectedValue[0].SetId
                      : -1,
                  QuestionId: -1,
                  Question: "",
                  QuestionType: "one",
                  Remarks: "",
                  Type: "normal",
                  ActionType: "A",
                };
                setDataFormQuestion(defaultData);
                formEditQuestionRef?.current?.instance?.show();
              },
            },
          });
        }}
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
        <Column dataField="Question" caption={"Câu hỏi"} width={400} />
        <Column dataField="QuestionType" caption={"Loại câu hỏi"}>
          <Lookup
            dataSource={[
              { value: "multiple", name: "Nhiều đáp án" },
              { value: "one", name: "Một đáp án" },
            ]}
            valueExpr={"value"}
            displayExpr={"name"}
          />
        </Column>
        <Column dataField="Type" caption={"Loại"}>
          <Lookup
            dataSource={[
              { value: "html", name: "Html" },
              { value: "text", name: "Text" },
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
        <Column
          caption={"Action"}
          width={160}
          fixed
          fixedPosition={"right"}
          allowEditing={false}
          cellRender={(e) => {
            return (
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-around",
                  alignItems: "center",
                }}
              >
                <Button
                  stylingMode={"text"}
                  icon={"edit"}
                  type={"default"}
                  onClick={() => {
                    setValueDetail(e.data?.Question);
                    formDetailRef?.current?.instance?.show();
                  }}
                >
                  <IoEye size={20} />
                </Button>
                <Button
                  stylingMode={"text"}
                  icon={"edit"}
                  type={"default"}
                  onClick={() => {
                    popupQuestionFileRef?.current?.instance?.show();
                  }}
                >
                  <ImAttachment color={"#337AB7"} size={18} />
                </Button>
                <Button
                  stylingMode={"text"}
                  icon={"edit"}
                  type={"default"}
                  onClick={() => {
                    let data = cloneDeep(e?.data);
                    data.ActionType = "U";
                    setDataFormQuestion(data);
                    formEditQuestionRef?.current?.instance?.show();
                  }}
                />
                <Button
                  stylingMode={"text"}
                  icon={"trash"}
                  type={"danger"}
                  onClick={async () => {
                    let check = await confirm(
                      "Bạn có muốn xóa bản ghi này?",
                      "Xóa!!!"
                    );
                    if (!check) {
                      return;
                    }
                    let data = cloneDeep(e?.data);
                    data.ActionType = "D";
                    dispatch(
                      Actions.save({
                        data: data,
                        type: "question",
                      })
                    );
                  }}
                />
              </div>
            );
          }}
        />
      </DataGrid>
    );
  }, [
    allAnswer,
    allFile,
    categorySelectedValue,
    dataQuestion,
    dispatch,
    height,
    questionSelectedValue,
    setSelectedValue,
  ]);
  const renderFileQuestion = useMemo(() => {
    return (
      <AppPopup height={600} width={1200} popupRef={popupQuestionFileRef}>
        {/* ============Question File============= */}
        <DataGrid
          showRowLines={true}
          showColumnLines={true}
          className={"question-file-grid"}
          dataSource={Array.isArray(dataFile) ? dataFile : []}
          showBorders={true}
          searchPanel={{ visible: true, highlightSearchText: true }}
          columnAutoWidth={true}
          //rowAlternationEnabled={true}
          onToolbarPreparing={(e) => {
            e.toolbarOptions?.items?.unshift({
              location: "before",
              widget: "dxButton",
              options: {
                elementAttr: {
                  class: "toolbar-btn-title",
                },
                type: "normal",
                text: "Tệp câu hỏi",
                icon: "chevronnext",
                stylingMode: "text",
              },
            });
            e.toolbarOptions?.items?.unshift({
              location: "after",
              widget: "dxButton",
              options: {
                type: "success",
                stylingMode: "text",
                icon: "add",
                onClick: () => {
                  let defaultData: any = {
                    CategoryId:
                      Array.isArray(categorySelectedValue) &&
                      categorySelectedValue.length > 0
                        ? categorySelectedValue[0].CategoryId
                        : -1,
                    SetId:
                      Array.isArray(setSelectedValue) &&
                      setSelectedValue.length > 0
                        ? setSelectedValue[0].SetId
                        : -1,
                    QuestionId:
                      Array.isArray(questionSelectedValue) &&
                      questionSelectedValue.length > 0
                        ? questionSelectedValue[0].QuestionId
                        : -1,
                    AnswerId: null,
                    Path: "",
                    FileId: -1,
                    FileName: "",
                    UseType: "Question",
                    Type: "url",
                    Remarks: "",
                    ActionType: "A",
                    SelectType: "default",
                  };
                  setDataFormFile(defaultData);
                  formEditFileRef?.current?.instance?.show();
                },
              },
            });
          }}
        >
          <Column dataField="FileId" caption={"Mã tệp"} allowEditing={false} />
          <Column dataField="FileName" caption={"Tên tệp"} />
          <Column dataField="Type" caption={"Loại tệp"} />
          <Column dataField="Remark" caption={"Ghi chú"} allowEditing={false} />
          <Column
            dataField="CreateDate"
            caption={"Ngày tạo"}
            allowEditing={false}
            type={"date"}
            format={"DD-MM-YYYY"}
          />
          <Column dataField="Path" caption={"Đường dẫn"} width={300} />
          <Column dataField="UseType" caption={"Sử dụng cho"} />
          <Column
            caption={"Action"}
            width={80}
            fixed={true}
            fixedPosition={"right"}
            allowEditing={false}
            cellRender={(e) => {
              return (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-around",
                    alignItems: "center",
                  }}
                >
                  <Button
                    stylingMode={"text"}
                    icon={"edit"}
                    type={"default"}
                    onClick={async () => {
                      await setDataPreviewFile(e.data);
                      formPreviewFileRef?.current?.instance?.show();
                    }}
                  >
                    <IoEye size={20} />
                  </Button>
                  <Button
                    stylingMode={"text"}
                    icon={"trash"}
                    type={"danger"}
                    onClick={async () => {
                      let check = await confirm(
                        "Bạn có muốn xóa bản ghi này?",
                        "Xóa!!!"
                      );
                      if (!check) {
                        return;
                      }
                      let data = cloneDeep(e?.data);
                      data.ActionType = "D";
                      dispatch(
                        Actions.save({
                          data: { data },
                          type: "file",
                        })
                      );
                    }}
                  />
                </div>
              );
            }}
          />
        </DataGrid>
      </AppPopup>
    );
  }, [
    categorySelectedValue,
    dataFile,
    dispatch,
    questionSelectedValue,
    setSelectedValue,
  ]);
  const renderGridAnswer = useMemo(() => {
    return (
      <DataGrid
        showRowLines={true}
        showColumnLines={true}
        dataSource={Array.isArray(dataAnswer) ? dataAnswer : []}
        showBorders={true}
        searchPanel={{ visible: true, highlightSearchText: true }}
        columnAutoWidth={true}
        //rowAlternationEnabled={true}
        height={(height - 100) / 2}
        selectedRowKeys={answerSelectedValue}
        defaultSelectedRowKeys={
          Array.isArray(dataAnswer) && dataAnswer.length > 0
            ? [dataAnswer[0]]
            : []
        }
        selection={{ mode: "single" }}
        onSelectionChanged={(e) => {
          let answerId =
            Array.isArray(e.selectedRowKeys) && e.selectedRowKeys.length > 0
              ? e.selectedRowKeys[0].AnswerId
              : -1;
          let questionId =
            Array.isArray(e.selectedRowKeys) && e.selectedRowKeys.length > 0
              ? e.selectedRowKeys[0].QuestionId
              : -1;
          if (answerId === -1) {
            dispatch(
              Actions.setState({
                answerSelectedValue: e.selectedRowKeys,
              })
            );
          } else {
            let newDataFile = allFile?.filter(
              (x) =>
                x.QuestionId === questionId &&
                x.UseType === "Answer" &&
                x.AnswerId === answerId
            );
            dispatch(
              Actions.setState({
                answerSelectedValue: e.selectedRowKeys,
                dataFileAnswer: newDataFile,
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
              text: "Đáp án",
              icon: "chevronnext",
              stylingMode: "text",
            },
          });
          e.toolbarOptions?.items?.unshift({
            location: "after",
            widget: "dxButton",
            options: {
              type: "success",
              stylingMode: "text",
              icon: "add",
              onClick: () => {
                let defaultData: any = {
                  CategoryId:
                    Array.isArray(categorySelectedValue) &&
                    categorySelectedValue.length > 0
                      ? categorySelectedValue[0].CategoryId
                      : -1,
                  SetId:
                    Array.isArray(setSelectedValue) &&
                    setSelectedValue.length > 0
                      ? setSelectedValue[0].SetId
                      : -1,
                  QuestionId:
                    Array.isArray(questionSelectedValue) &&
                    questionSelectedValue.length > 0
                      ? questionSelectedValue[0].QuestionId
                      : Array.isArray(dataQuestion) && dataQuestion.length > 0
                      ? dataQuestion[0].QuestionId
                      : -1,
                  AnswerId: -1,
                  Answer: "",
                  IsTrueAnswer: "N",
                  Remarks: "",
                  Type: "normal",
                  ActionType: "A",
                  Id: v4(),
                };
                setDataFormAnswer(defaultData);
                formEditAnswerRef?.current?.instance?.show();
              },
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
        <Column dataField="Answer" caption={"Đáp án"} width={400} />
        <Column dataField="Remark" caption={"Ghi chú"} />
        <Column dataField="Type" caption={"Loại"}>
          <Lookup
            dataSource={[
              { value: "html", name: "Html" },
              { value: "text", name: "Text" },
            ]}
            valueExpr={"value"}
            displayExpr={"name"}
          />
        </Column>
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
        <Column
          caption={"Action"}
          width={160}
          allowEditing={false}
          fixed
          fixedPosition={"right"}
          cellRender={(e) => {
            return (
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-around",
                  alignItems: "center",
                }}
              >
                <Button
                  stylingMode={"text"}
                  icon={"edit"}
                  type={"default"}
                  onClick={() => {
                    setValueDetail(e.data?.Answer);
                    formDetailRef?.current?.instance?.show();
                  }}
                >
                  <IoEye size={20} />
                </Button>
                <Button
                  stylingMode={"text"}
                  icon={"edit"}
                  type={"default"}
                  onClick={() => {
                    popupAnswerFileRef?.current?.instance?.show();
                  }}
                >
                  <ImAttachment color={"#337AB7"} size={18} />
                </Button>
                <Button
                  stylingMode={"text"}
                  icon={"edit"}
                  type={"default"}
                  onClick={() => {
                    let data = cloneDeep(e?.data);
                    data.ActionType = "U";
                    setDataFormAnswer(data);
                    formEditAnswerRef?.current?.instance?.show();
                  }}
                />
                <Button
                  stylingMode={"text"}
                  icon={"trash"}
                  type={"danger"}
                  onClick={async () => {
                    let check = await confirm(
                      "Bạn có muốn xóa bản ghi này?",
                      "Xóa!!!"
                    );
                    if (!check) {
                      return;
                    }
                    let data = cloneDeep(e?.data);
                    data.ActionType = "D";
                    dispatch(
                      Actions.save({
                        data: [data],
                        type: "answer",
                      })
                    );
                  }}
                />
              </div>
            );
          }}
        />
      </DataGrid>
    );
  }, [
    allFile,
    answerSelectedValue,
    categorySelectedValue,
    dataAnswer,
    dataQuestion,
    dispatch,
    height,
    questionSelectedValue,
    setSelectedValue,
  ]);
  const renderFileAnswer = useMemo(() => {
    return (
      <AppPopup height={600} width={1200} popupRef={popupAnswerFileRef}>
        {/* ============Answer File============= */}
        <DataGrid
          showRowLines={true}
          showColumnLines={true}
          className={"answer-file-grid"}
          dataSource={Array.isArray(dataFileAnswer) ? dataFileAnswer : []}
          showBorders={true}
          searchPanel={{ visible: true, highlightSearchText: true }}
          columnAutoWidth={true}
          //rowAlternationEnabled={true}
          onToolbarPreparing={(e) => {
            e.toolbarOptions?.items?.unshift({
              location: "before",
              widget: "dxButton",
              options: {
                elementAttr: {
                  class: "toolbar-btn-title",
                },
                type: "normal",
                text: "Tệp đáp án",
                icon: "chevronnext",
                stylingMode: "text",
              },
            });
            e.toolbarOptions?.items?.unshift({
              location: "after",
              widget: "dxButton",
              options: {
                type: "success",
                stylingMode: "text",
                icon: "add",
                onClick: () => {
                  let defaultData: any = {
                    CategoryId:
                      Array.isArray(categorySelectedValue) &&
                      categorySelectedValue.length > 0
                        ? categorySelectedValue[0].CategoryId
                        : -1,
                    SetId:
                      Array.isArray(setSelectedValue) &&
                      setSelectedValue.length > 0
                        ? setSelectedValue[0].SetId
                        : -1,
                    QuestionId:
                      Array.isArray(questionSelectedValue) &&
                      questionSelectedValue.length > 0
                        ? questionSelectedValue[0].QuestionId
                        : -1,
                    AnswerId:
                      Array.isArray(answerSelectedValue) &&
                      answerSelectedValue.length > 0
                        ? answerSelectedValue[0].AnswerId
                        : -1,
                    Path: "",
                    FileId: -1,
                    FileName: "",
                    UseType: "Answer",
                    Type: "url",
                    Remarks: "",
                    SelectType: "default",
                    ActionType: "A",
                  };
                  setDataFormFile(defaultData);
                  formEditFileRef?.current?.instance?.show();
                },
              },
            });
          }}
        >
          <Column dataField="FileId" caption={"Mã tệp"} allowEditing={false} />
          <Column dataField="FileName" caption={"Tên tệp"} />
          <Column dataField="Type" caption={"Loại tệp"} />
          <Column dataField="Remark" caption={"Ghi chú"} allowEditing={false} />
          <Column
            dataField="CreateDate"
            caption={"Ngày tạo"}
            allowEditing={false}
            type={"date"}
            format={"DD-MM-YYYY"}
          />
          <Column dataField="Path" caption={"Đường dẫn"} width={300} />
          <Column dataField="UseType" caption={"Sử dụng cho"} />
          <Column
            fixed
            fixedPosition={"right"}
            caption={"Action"}
            width={80}
            allowEditing={false}
            cellRender={(e) => {
              return (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-around",
                    alignItems: "center",
                  }}
                >
                  <Button
                    stylingMode={"text"}
                    icon={"trash"}
                    type={"danger"}
                    onClick={async () => {
                      let check = await confirm(
                        "Bạn có muốn xóa bản ghi này?",
                        "Xóa!!!"
                      );
                      if (!check) {
                        return;
                      }
                      let data = cloneDeep(e?.data);
                      data.ActionType = "D";
                      dispatch(
                        Actions.save({
                          data: { data },
                          type: "file",
                        })
                      );
                    }}
                  />
                </div>
              );
            }}
          />
        </DataGrid>
      </AppPopup>
    );
  }, [
    answerSelectedValue,
    categorySelectedValue,
    dataFileAnswer,
    dispatch,
    questionSelectedValue,
    setSelectedValue,
  ]);
  const renderPopupMemo = useMemo(() => {
    return (
      <div>
        <FormDetail value={valueDetail} formRef={formDetailRef} />
        <FormUpdateQuestion
          formRef={formEditQuestionRef}
          data={dataFormQuestion}
          saveFunction={(data: any) => {
            let saveData = cloneDeep(data);
            if (`${saveData?.Type}`.includes("html")) {
              saveData.Type = "html";
            }
            dispatch(
              Actions.save({
                data: saveData,
                type: "question",
                callback: () => {
                  formEditQuestionRef?.current?.instance?.hide();
                },
              })
            );
          }}
        />
        <FormUpdateAnswer
          formRef={formEditAnswerRef}
          data={dataFormAnswer}
          isHaveData={
            Array.isArray(dataAnswer) && dataAnswer.length > 0 ? true : false
          }
          saveFunction={(data: any) => {
            let saveData = cloneDeep(data);
            if (Array.isArray(saveData) && saveData.length > 0) {
              saveData.forEach(function (v) {
                delete v.Open;
                if (`${v?.Type}`.includes("html")) {
                  v.Type = "html";
                }
              });
              saveData = saveData.filter((x) => {
                return isNotEmpty(x.Answer);
              });
              dispatch(
                Actions.save({
                  data: saveData,
                  type: "answer",
                  callback: () => {
                    formEditAnswerRef?.current?.instance?.hide();
                  },
                })
              );
            }
          }}
        />
        <FormUpdateFile
          formRef={formEditFileRef}
          data={dataFormFile}
          saveFunction={(data: any, file: any) => {
            dispatch(
              Actions.save({
                data: { data, file },
                type: "file",
                callback: () => {
                  formEditFileRef?.current?.instance?.hide();
                },
              })
            );
          }}
        />
        <PreviewFile formRef={formPreviewFileRef} data={dataPreviewFile} />
      </div>
    );
  }, [
    dataAnswer,
    dataFormAnswer,
    dataFormFile,
    dataFormQuestion,
    dataPreviewFile,
    dispatch,
    valueDetail,
  ]);
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
      {renderPopupMemo}
      <div className={"row-question"}>
        {/* ============Question============= */}
        {renderGridQuestion}
        {renderFileQuestion}
        <div style={{ paddingTop: 10 }} />
        {/* ============Answer============= */}
        {renderGridAnswer}
        {renderFileAnswer}
      </div>
    </div>
  );
};
export default Question;
