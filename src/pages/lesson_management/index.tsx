import { useEffect, useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Actions } from "./index.redux";
import { AppState } from "../../store/root_reducer";
import { LessonData } from "./index.interface";
import { Namespace } from "../../constants/language";
import { cloneDeep } from "lodash";

import "./index.scss";

//components
import DataGrid, {
  Column,
  ColumnChooser,
  HeaderFilter,
  Pager,
  Paging,
  FilterPanel,
  Editing,
  Form as GridForm,
  RequiredRule,
  Popup as FormPopup,
} from "devextreme-react/data-grid";
import Form, { Item } from "devextreme-react/form";
import "devextreme-react/tag-box";
import "devextreme-react/text-area";
import AppPopup from "../../components/controls/popup";
import { formatMessage } from "devextreme/localization";
import { confirm } from "devextreme/ui/dialog";
import { Link } from "react-router-dom";

const FileManagement = () => {
  // Reset Hooks
  const dispatch = useDispatch();
  const { t } = useTranslation(Namespace.file_management);
  const tcommon = useTranslation(Namespace.common).t;
  const form: any = useRef(null);
  let [showFormBox, setShowFormBox] = useState(false);
  const [popupHeight, setPopupHeight] = useState(525);
  const [popupWidth, setPopupWidth] = useState(700);

  const addNewSource: LessonData = {
    id: "",
    lessonName: "",
    grade: "",
    status: "",
    tags: [],
    note: "",
    phrase: "",
  };

  // Get State from Redux
  const { listLesson, listGrade, listStatus, tags, updateStatus } = useSelector(
    (store: AppState) => store.lessonManagementReducer
  );

  let tagOptions = {
    items: tags,
    acceptCustomValue: true,
    openOnFieldClick: false,
  };

  // Use Effect
  useEffect(() => {
    dispatch(Actions.fetchData());
  }, [dispatch]);

  useEffect(() => {
    if (updateStatus !== "") {
      setShowFormBox(false);
      dispatch(Actions.setState({ updateStatus: "" }));
    }
  }, [updateStatus, dispatch]);

  // Functions

  const resizePopup = (e: any) => {
    setPopupWidth(e.component?.option("width"));
    setPopupHeight(e.component?.option("height"));
  };

  const closeAddNew = () => {
    confirm(t("cancel_message"), t("cancel")).then((res) => {
      if (res === true) {
        setShowFormBox(false);
        return;
      }
    });
  };

  // Sub Components
  const OpenFiles = (celldata: any) => {
    return (
      <div>
        <Link
          className={"item_btn"}
          to={`/file_manage/${celldata.data.lessonName}`}
        >
          Files
        </Link>
      </div>
    );
  };

  const onToolbarPreparing = (e: any) => {
    let searchPanel = e.toolbarOptions?.items?.find(
      (x: any) => x.name === "searchPanel"
    );
    if (searchPanel) {
      searchPanel.location = "before";
    }
    let columnChooserBtn = e.toolbarOptions?.items?.find(
      (x: any) => x.name === "columnChooserButton"
    );
    if (columnChooserBtn) {
      columnChooserBtn.options.elementAttr = {
        class: "toolbar_btn",
      };
    }
    e.toolbarOptions?.items?.unshift({
      location: "after",
      widget: "dxButton",
      options: {
        icon: "add",
        type: "normal",
        text: t("add_lesson"),
        elementAttr: {
          class: "toolbar_btn",
        },
        styles: [{ backgroundColor: "#f4bf08", borderRadius: 20 }],
        onClick: (e: any) => {
          if (form.current !== null) {
            form.current.instance.resetValues();
          }
          setShowFormBox(true);
        },
      },
    });
  };

  return (
    <div className="wrapper">
      <div className={"header"}>
        <div className={"row"}>
          <div className={"left"}>
            <h3>{t("lesson_management")}</h3>
          </div>
        </div>
      </div>
      <AppPopup
        title={t("add_lesson")}
        showTitle={true}
        visible={showFormBox}
        width={popupWidth}
        height={popupHeight}
        onResizeEnd={resizePopup}
        onHiding={() => {
          setShowFormBox(false);
        }}
        toolbarItems={[
          {
            location: "after",
            widget: "dxButton",
            options: {
              id: "button",
              text: formatMessage("dxDataGrid-editingSaveRowChanges", ""),
              useSubmitBehavior: true,
              validationGroup: "add_lesson",
              onClick: (e: any) => {
                if (e.validationGroup.validate().isValid === true) {
                  dispatch(Actions.addLesson(addNewSource));
                  // setShowFormBox(false);
                }
              },
            },
            toolbar: "bottom",
          },
          {
            location: "after",
            widget: "dxButton",
            options: {
              id: "button",
              text: formatMessage("Cancel", ""),
              onClick: closeAddNew,
            },
            toolbar: "bottom",
          },
        ]}
      >
        <Form
          ref={form}
          formData={addNewSource}
          showValidationSummary={true}
          validationGroup={"add_lesson"}
          showColonAfterLabel={false}
          // onFieldDataChanged={(e: any) => {
          //   console.log(e);
          // }}
        >
          <Item
            caption={t("infomation")}
            itemType="group"
            colCount={2}
            colSpan={2}
          >
            <Item label={{ text: t("name") }} dataField="lessonName">
              <RequiredRule message={tcommon("field_required")} />
            </Item>
            <Item
              dataField="grade"
              label={{ text: t("grade") }}
              editorType={"dxNumberBox"}
              editorOptions={{
                showSpinButtons: true,
                mode: "number",
                min: 1,
                format: "#0",
              }}
            />
            <Item label={{ text: t("id") }} dataField="id"></Item>
            <Item label={{ text: t("phrase") }} dataField="phrase"></Item>
            <Item
              label={{ text: t("status") }}
              dataField="status"
              editorType="dxSelectBox"
              editorOptions={{
                dataSource: listStatus,
                displayExpr: "status",
                valueExpr: "id",
                showClearButton: true,
              }}
            ></Item>
          </Item>
          <Item caption={t("tag")} itemType="group">
            <Item
              dataField="tags"
              label={{ visible: false }}
              editorType={"dxTagBox"}
              editorOptions={tagOptions}
            />
          </Item>
          <Item caption={t("note")} itemType="group">
            <Item
              label={{ text: "note", visible: false }}
              dataField="note"
              editorType="dxTextArea"
              editorOptions={{
                height: 118,
              }}
            ></Item>
          </Item>
        </Form>
      </AppPopup>
      <div className={"content"}>
        <DataGrid
          dataSource={cloneDeep(listLesson)}
          showBorders={true}
          columnAutoWidth={true}
          rowAlternationEnabled={true}
          selection={{ mode: "single" }}
          onToolbarPreparing={onToolbarPreparing}
          searchPanel={{
            visible: true,
            width: 300,
            highlightSearchText: true,
          }}
          onRowUpdating={(e) => console.log(e)}
          onRowRemoving={(e) => console.log(e)}
        >
          <ColumnChooser enabled={true} />
          <HeaderFilter visible={true} allowSearch={true} />
          <FilterPanel visible={true} />
          <Paging defaultPageSize={20} />
          <Pager
            showPageSizeSelector={true}
            allowedPageSizes={[10, 20, 30]}
            showInfo={true}
          />
          <Editing mode="popup" allowUpdating={true} allowDeleting useIcons>
            <FormPopup
              width={popupWidth}
              height={popupHeight}
              title={t("lesson_edit")}
              showTitle={true}
              resizeEnabled
              onResizeEnd={resizePopup}
            ></FormPopup>
            <GridForm colCount={1}>
              <Item
                caption={t("lesson_info")}
                itemType="group"
                colCount={2}
                colSpan={2}
              >
                <Item dataField="lessonName">
                  <RequiredRule message={tcommon("field_required")} />
                </Item>
                <Item
                  dataField="grade"
                  editorType={"dxSelectBox"}
                  editorOptions={{
                    dataSource: listGrade,
                    displayExpr: "grade",
                    valueExpr: "grade",
                  }}
                />
                <Item dataField="id" editorOptions={{ readOnly: true }}></Item>
                <Item dataField="phrase" />
                <Item
                  dataField="status"
                  editorType={"dxSelectBox"}
                  editorOptions={{
                    dataSource: listStatus,
                    displayExpr: "status",
                    valueExpr: "status",
                  }}
                />
              </Item>
              <Item caption={t("tag")} itemType="group">
                <Item
                  dataField="tags"
                  label={{ visible: false }}
                  editorType={"dxTagBox"}
                  editorOptions={{
                    value: tags,
                    acceptCustomValue: true,
                    openOnFieldClick: true,
                  }}
                />
              </Item>
              <Item caption={t("note")} itemType="group">
                <Item
                  label={{ text: "note", visible: false }}
                  dataField="note"
                  editorType="dxTextArea"
                  editorOptions={{
                    height: 118,
                  }}
                ></Item>
              </Item>
            </GridForm>
          </Editing>
          <Column dataField="id" visible={false} />
          <Column dataField="lessonName" caption={t("lesson_name")} />
          <Column dataField="status" caption={t("status")} />
          <Column dataField="creator" caption={t("creator")} />
          <Column dataField="createDate" caption={t("create_date")} />
          <Column dataField="updateDate" caption={t("update_date")} />
          <Column dataField="grade" caption={t("grade")} />
          <Column dataField="phrase" visible={false} />
          <Column dataField="tags" visible={false} />
          <Column dataField="note" visible={false} />
          <Column caption={"Action"} type={"buttons"} />
          <Column
            caption={t("file_manage")}
            type={"buttons"}
            cellRender={OpenFiles}
          ></Column>
        </DataGrid>
      </div>
    </div>
  );
};

export default FileManagement;
