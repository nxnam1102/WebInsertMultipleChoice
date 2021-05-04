import Button from "devextreme-react/button";
import DataGrid, {
  Column,
  ColumnChooser,
  Editing,
  FilterPanel,
  Form as FormGrid,
  HeaderFilter,
  Lookup,
  MasterDetail,
  Pager,
  Paging,
  Popup,
} from "devextreme-react/data-grid";
import Form, { Item } from "devextreme-react/form";
import SelectBox from "devextreme-react/select-box";
import { RequiredRule } from "devextreme-react/validator";
import { formatMessage } from "devextreme/localization";
import { confirm } from "devextreme/ui/dialog";
import lodash from "lodash";
import moment from "moment";
import "moment/locale/vi";
import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import "react-pro-sidebar/dist/css/styles.css";
import { useDispatch, useSelector } from "react-redux";
import { v4 } from "uuid";
import AppPopup from "../../components/controls/popup";
import utilities, { AppLogging } from "../../helpers/utilities";
import { Namespace } from "../../constants/language";
import { AppState } from "../../store/root_reducer";
import { AddNewData } from "./index.interface";
import { Actions } from "./index.redux";
import "./index.scss";

const CourseManagement = () => {
  //#region ----------hook funcion----------
  //translation
  const { t } = useTranslation(Namespace.course_management);
  const tu = useTranslation(Namespace.user_management).t;
  //dispatch
  const dispatch = useDispatch();
  //use state
  const [popupHeight, setPopupHeight] = useState(undefined);
  const [popupWidth, setPopupWidth] = useState(700);
  const [currentSchoolId, setCurrentSchoolId] = useState(null);
  const [currentPeriodic, setCurrentPeriodic] = useState("W");
  //use ref
  const addFormRef = useRef<any>(null);
  const popupAddRef = useRef<any>(null);
  //use selector
  const dataSchool = useSelector(
    (store: AppState) => store.courseManagementReducer.dataSchool
  );
  const dataCourse = useSelector(
    (store: AppState) => store.courseManagementReducer.dataCourse
  );
  const dataStage = useSelector(
    (store: AppState) => store.courseManagementReducer.dataStage
  );
  const isLoading = useSelector(
    (store: AppState) => store.courseManagementReducer.isLoading
  );
  //use effect
  useEffect(() => {
    dispatch(Actions.fetchData(undefined));
  }, [dispatch]);
  useEffect(() => {}, [currentSchoolId, dataCourse, dataStage, isLoading]);
  //#endregion
  //#region ----------function----------
  const resizePopup = (e: any) => {
    try {
      setPopupWidth(e.component?.option("width"));
      setPopupHeight(e.component?.option("height"));
    } catch (error) {
      AppLogging.error(error);
    }
  };
  const schoolChanged = (data: any) => {
    try {
      if (data.value !== data.previousValue) {
        setCurrentSchoolId(data.value);
        console.log(data.value);
        dispatch(Actions.fetchData(data.value));
      }
    } catch (error) {
      AppLogging.error(error);
    }
  };
  const periodicChanged = (data: any) => {
    try {
      if (data.value !== data.previousValue) {
        setCurrentPeriodic(data.value);
      }
    } catch (error) {
      AppLogging.error(error);
    }
  };
  const addNewClick = (e: any) => {
    try {
      if ((Array.isArray(dataStage) && dataStage.length > 0) === false) {
        dispatch(Actions.getDataStage(""));
      }
      popupAddRef.current.instance.show();
    } catch (error) {
      AppLogging.error(error);
    }
  };
  const closeAddNew = () => {
    try {
      confirm(tu("cancel_message"), tu("cancel")).then((res) => {
        if (res === true) {
          popupAddRef.current.instance.hide();
          return;
        }
      });
    } catch (error) {
      AppLogging.error(error);
    }
  };
  const saveAddNew = (e: any) => {
    try {
      if (e.validationGroup.validate().isValid === true) {
        dispatch(
          Actions.addNew({
            addNewData: addNewSource,
            currentSchoolId: currentSchoolId,
            callback: () => {
              popupAddRef.current.instance.hide();
              if (addFormRef) {
                addFormRef.current.instance.updateData(defaultAddNewData);
              }
            },
          })
        );
      }
    } catch (error) {
      AppLogging.error(error);
    }
  };
  const onToolbarPreparing = (e: any) => {
    try {
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
          elementAttr: {
            class: "toolbar_btn",
          },
          icon: "add",
          type: "normal",
          text: t("add_course"),
          onClick: addNewClick,
        },
      });
    } catch (error) {
      AppLogging.error(error);
    }
  };
  const onRowClick = (e: any) => {
    try {
      if (e.isExpanded === true) {
        e.component?.collapseRow(e.key);
      } else {
        e.component?.expandRow(e.key);
      }
    } catch (error) {
      AppLogging.error(error);
    }
  };
  const onPopupGridShowing = () => {
    try {
      if ((Array.isArray(dataStage) && dataStage.length > 0) === false) {
        dispatch(Actions.getDataStage(""));
      }
    } catch (error) {
      AppLogging.error(error);
    }
  };
  const cellButtonCalendarRender = () => (
    <Button
      className={"calendar-button"}
      type={"normal"}
      text={t("calendar")}
    ></Button>
  );
  const renderDetail = (data: any) => {
    return (
      <div>
        <div className={"detail_header"}>
          <div className={"detail_code"}>{`${data.data.data.course_code}`}</div>
          <div className={"detail_name"}>{`${data.data.data.course_name}`}</div>
        </div>
        <div style={{ display: "flex", flexDirection: "row" }}>
          <div className="column">
            <div className="label">{`${tu("status")}: `}</div>
            <div className="value">{`${
              datasourceStatus.find((x) => x.id === data.data.data.status)?.name
            }`}</div>
            <div className="label">{`${tu("school")}: `}</div>
            <div className="value">{`${
              dataSchool?.find((x) => x.id === data.data.data.school)?.name
            }`}</div>
          </div>
          <div className="column">
            <div className="label">{`${t("curriculum")}: `}</div>
            <div className="value">{`${data.data.data.curriculum}`}</div>
            <div className="label">{`${tu("grade")}: `}</div>
            <div className="value">{`${data.data.data.grade}`}</div>
          </div>
          <div className="column">
            <div className="label">{`${tu("create_date")}: `}</div>
            <div className="value">{`${data.data.data.create_date}`}</div>
            <div className="label">{`${t("effect_date")}: `}</div>
            <div className="value">{`${data.data.data.effect_date}`}</div>
          </div>
        </div>
      </div>
    );
  };
  //#endregion
  //#region ----------variable----------
  const datasourceStatus = [
    {
      id: "s",
      name: t("suspended"),
    },
    {
      id: "a",
      name: t("active"),
    },
  ];
  const currentSchool =
    Array.isArray(dataSchool) &&
    dataSchool.length > 0 &&
    dataSchool.find((x) => x.id === currentSchoolId)
      ? dataSchool.find((x) => x.id === currentSchoolId)
      : Array.isArray(dataSchool) && dataSchool.length > 0
      ? dataSchool[0]
      : {};
  let defaultAddNewData: AddNewData = {
    course_code: v4(),
    course_name: "",
    create_date: moment().toDate(),
    effect_date: moment().toDate(),
    curriculum: "1",
    grade: 1,
    school: currentSchool.id,
    status: "a",
    tag: [],
  };
  const addNewSource: AddNewData = defaultAddNewData;
  //#endregion

  return (
    <div className={"main"}>
      <div className={"header-row"}>
        <div>
          <div id={"school-title"} style={{ paddingBottom: 10 }}>{`${tu(
            "school"
          )}`}</div>
          <SelectBox
            className={"select-box"}
            dataSource={dataSchool}
            onValueChanged={schoolChanged}
            displayExpr={"name"}
            valueExpr={"id"}
            searchEnabled={true}
            value={currentSchool.id}
          />
        </div>
        <div className={"card-header"} id={"dashboard-card-1"}>
          <div className={"left-text"}>{tu("number_of_student")}</div>
          <div className={"right-text"}>
            {`${
              currentSchool.numStudent
                ? utilities.acronymtNumber(currentSchool.numStudent).value
                : ""
            }`}
            <div className={"acronymt"}>
              {`${
                currentSchool.numStudent
                  ? utilities.acronymtNumber(currentSchool.numStudent).acronymt
                  : ""
              }`}
            </div>
          </div>
        </div>
        <div className={"card-header"} id={"dashboard-card-2"}>
          <div className={"left-text"}>{tu("number_of_teacher")}</div>
          <div className={"right-text"}>
            {`${
              currentSchool.numTeacher
                ? utilities.acronymtNumber(currentSchool.numTeacher).value
                : ""
            }`}
            <div className={"acronymt"}>
              {`${
                currentSchool.numTeacher
                  ? utilities.acronymtNumber(currentSchool.numTeacher).acronymt
                  : ""
              }`}
            </div>
          </div>
        </div>
        <div className={"card-header"} id={"dashboard-card-3"}>
          <div className={"left-text"}>{tu("revenue")}</div>
          <div className={"right-text"}>
            {`${
              currentSchool.revenue
                ? utilities.acronymtNumber(currentSchool.revenue).value
                : ""
            }`}
            <div className={"acronymt"}>
              {`${
                currentSchool.revenue
                  ? utilities.acronymtNumber(currentSchool.revenue).acronymt
                  : ""
              }`}
            </div>
          </div>
        </div>
        <div className={"card-header"} id={"dashboard-card-4"}>
          <div className={"left-text"}>{tu("recive_revenue")}</div>
          <div className={"right-text"}>
            {`${
              currentSchool.revenueRecive
                ? utilities.acronymtNumber(currentSchool.revenueRecive).value
                : ""
            }`}
            <div className={"acronymt"}>
              {`${
                currentSchool.revenueRecive
                  ? utilities.acronymtNumber(currentSchool.revenueRecive)
                      .acronymt
                  : ""
              }`}
            </div>
          </div>
        </div>
        <div className={"card-header"} id={"dashboard-card-5"}>
          <div className={"left-text"}>{tu("ratio")}</div>
          <div className={"right-text"}>{`15%`}</div>
        </div>
      </div>
      <div>
        <AppPopup
          popupRef={popupAddRef}
          id={"add_course_popup"}
          title={t("add_course")}
          showTitle={true}
          height={700}
          toolbarItems={[
            {
              location: "after",
              widget: "dxButton",
              options: {
                id: "button",
                text: formatMessage("dxDataGrid-editingSaveRowChanges", ""),
                useSubmitBehavior: true,
                validationGroup: "add_course",
                onClick: saveAddNew,
              },
              toolbar: "bottom",
            },
            {
              location: "after",
              widget: "dxButton",
              options: {
                id: "button",
                text: formatMessage("Cancel", ""),
                useSubmitBehavior: true,
                onClick: closeAddNew,
              },
              toolbar: "bottom",
            },
          ]}
        >
          <Form
            formData={addNewSource}
            showValidationSummary={true}
            validationGroup={"add_course"}
            showColonAfterLabel={false}
            ref={addFormRef}
          >
            <Item itemType="group" colCount={2} colSpan={2}>
              <Item
                colSpan={2}
                dataField="school"
                label={{ text: tu("school") }}
                editorType={"dxSelectBox"}
                editorOptions={{
                  value: currentSchool.id,
                  dataSource: dataSchool,
                  displayExpr: "name",
                  valueExpr: "id",
                  searchEnabled: true,
                }}
              />
            </Item>
            <Item
              caption={t("infomation")}
              itemType="group"
              colCount={2}
              colSpan={2}
            >
              <Item label={{ text: t("course_name") }} dataField="course_name">
                <RequiredRule message={tu("require")} />
              </Item>
              <Item
                dataField="grade"
                label={{ text: tu("grade") }}
                editorType={"dxNumberBox"}
                editorOptions={{
                  showSpinButtons: true,
                  mode: "number",
                  min: 1,
                  format: "#0",
                }}
              />
              <Item
                label={{ text: t("course_code") }}
                editorOptions={{ readOnly: true }}
                dataField="course_code"
              ></Item>
              <Item
                dataField="curriculum"
                label={{ text: t("curriculum") }}
                editorType={"dxSelectBox"}
                editorOptions={{
                  dataSource: dataSchool,
                  displayExpr: "name",
                  valueExpr: "id",
                }}
              />
              <Item
                dataField="status"
                label={{ text: tu("status") }}
                editorType={"dxSelectBox"}
                editorOptions={{
                  dataSource: datasourceStatus,
                  displayExpr: "name",
                  valueExpr: "id",
                }}
              />
              <Item
                dataField="effect_date"
                label={{ text: t("effect_date") }}
                editorType={"dxDateBox"}
              />
            </Item>
            <Item caption={t("tag")} itemType="group" colCount={2} colSpan={2}>
              <Item
                label={{ visible: false }}
                dataField="tag"
                colSpan={2}
                editorType={"dxTagBox"}
                editorOptions={{
                  items: [],
                  acceptCustomValue: true,
                  openOnFieldClick: false,
                }}
              />
            </Item>
            <Item
              caption={t("file_upload_schedule")}
              itemType="group"
              colCount={2}
              colSpan={2}
            >
              <Item
                colSpan={1}
                label={{ text: t("periodic") }}
                editorType={"dxSelectBox"}
                editorOptions={{
                  dataSource: [
                    { id: "D", name: t("day") },
                    { id: "W", name: t("week") },
                    { id: "M", name: t("month") },
                  ],
                  displayExpr: "name",
                  valueExpr: "id",
                  value: currentPeriodic,
                  onValueChanged: periodicChanged,
                }}
              />
            </Item>
            <Item>
              <DataGrid
                id={"grid-state"}
                dataSource={lodash.cloneDeep(dataStage)}
                showBorders={true}
                columnAutoWidth={true}
                rowAlternationEnabled={true}
                columnResizingMode={"widget"}
                allowColumnResizing={true}
              >
                <HeaderFilter visible={true} allowSearch={true} />
                <FilterPanel visible={true} />
                <Paging defaultPageSize={20} />
                <Pager
                  showPageSizeSelector={true}
                  allowedPageSizes={[10, 20, 30]}
                  showNavigationButtons
                  showInfo={true}
                />
                <Column dataField="id" caption={t("curriculum_code")} />
                <Column dataField="name" caption={t("curriculum_name")} />
                <Column dataField="stage" caption={t("stage")} />
                <Column dataField="file" caption={t("file")} />
                <Column
                  dataField="start_date"
                  caption={t("start_date")}
                  dataType={"date"}
                />
                <Column
                  dataField="index"
                  caption={`${
                    currentPeriodic === "W"
                      ? t("week")
                      : currentPeriodic === "M"
                      ? t("month")
                      : t("day")
                  } ${t("index")}`}
                  dataType={"number"}
                />
                <Column dataField="status" caption={tu("status")}>
                  <Lookup
                    dataSource={[
                      { id: "f", name: t("finished") },
                      { id: "n", name: t("not_started") },
                      { id: "s", name: t("started") },
                    ]}
                    valueExpr={"id"}
                    displayExpr={"name"}
                  />
                </Column>
              </DataGrid>
            </Item>
          </Form>
        </AppPopup>
        <DataGrid
          dataSource={lodash.cloneDeep(dataCourse)}
          showBorders={true}
          columnAutoWidth={true}
          rowAlternationEnabled={true}
          columnResizingMode={"widget"}
          allowColumnResizing={true}
          onToolbarPreparing={onToolbarPreparing}
          searchPanel={{
            visible: true,
            width: 300,
            highlightSearchText: true,
          }}
          onRowClick={onRowClick}
        >
          <ColumnChooser enabled={true} />
          <HeaderFilter visible={true} allowSearch={true} />
          <FilterPanel visible={true} />
          <Paging defaultPageSize={20} />
          <Pager
            showPageSizeSelector={true}
            allowedPageSizes={[10, 20, 30]}
            showNavigationButtons
            showInfo={true}
          />
          <Editing mode="popup" allowUpdating={true} allowDeleting useIcons>
            <Popup
              onShowing={onPopupGridShowing}
              title={tu("edit_user")}
              showTitle={true}
              width={popupWidth}
              height={popupHeight}
              resizeEnabled
              onResizeEnd={resizePopup}
            />
            <FormGrid showValidationSummary showColonAfterLabel={false}>
              <Item itemType="group" colCount={2} colSpan={2}>
                <Item
                  colSpan={2}
                  dataField="school"
                  label={{ text: tu("school") }}
                  editorType={"dxSelectBox"}
                  editorOptions={{
                    value: currentSchool.id,
                    dataSource: dataSchool,
                    displayExpr: "name",
                    valueExpr: "id",
                  }}
                />
              </Item>
              <Item
                caption={t("infomation")}
                itemType="group"
                colCount={2}
                colSpan={2}
              >
                <Item
                  label={{ text: t("course_name") }}
                  dataField="course_name"
                >
                  <RequiredRule message={tu("require")} />
                </Item>
                <Item
                  dataField="grade"
                  label={{ text: tu("grade") }}
                  editorType={"dxNumberBox"}
                  editorOptions={{
                    showSpinButtons: true,
                    mode: "number",
                    min: 1,
                    format: "#0",
                  }}
                />
                <Item
                  label={{ text: t("course_code") }}
                  editorOptions={{ readOnly: true }}
                  dataField="course_code"
                ></Item>
                <Item
                  dataField="curriculum"
                  label={{ text: t("curriculum") }}
                  editorType={"dxSelectBox"}
                  editorOptions={{
                    dataSource: dataSchool,
                    displayExpr: "name",
                    valueExpr: "id",
                  }}
                />
                <Item
                  dataField="status"
                  label={{ text: tu("status") }}
                  editorType={"dxSelectBox"}
                  editorOptions={{
                    dataSource: datasourceStatus,
                    displayExpr: "name",
                    valueExpr: "id",
                  }}
                />
                <Item
                  dataField="effect_date"
                  label={{ text: t("effect_date") }}
                  editorType={"dxDateBox"}
                />
              </Item>
              <Item
                caption={t("tag")}
                itemType="group"
                colCount={2}
                colSpan={2}
              >
                <Item
                  label={{ visible: false }}
                  dataField="tag"
                  colSpan={2}
                  editorType={"dxTagBox"}
                  editorOptions={{
                    items: [],
                    acceptCustomValue: true,
                    openOnFieldClick: false,
                  }}
                />
              </Item>
              <Item
                caption={t("file_upload_schedule")}
                itemType="group"
                colCount={2}
                colSpan={2}
              >
                <Item
                  colSpan={1}
                  label={{ text: t("periodic") }}
                  editorType={"dxSelectBox"}
                  editorOptions={{
                    dataSource: [
                      { id: "D", name: t("day") },
                      { id: "W", name: t("week") },
                      { id: "M", name: t("month") },
                    ],
                    displayExpr: "name",
                    valueExpr: "id",
                    value: currentPeriodic,
                    onValueChanged: periodicChanged,
                  }}
                />
              </Item>
              <Item colCount={2} colSpan={2}>
                <DataGrid
                  id={"grid-state"}
                  dataSource={lodash.cloneDeep(dataStage)}
                  showBorders={true}
                  columnAutoWidth={true}
                  rowAlternationEnabled={true}
                  columnResizingMode={"widget"}
                  allowColumnResizing={true}
                >
                  <HeaderFilter visible={true} allowSearch={true} />
                  <FilterPanel visible={true} />
                  <Paging defaultPageSize={20} />
                  <Pager
                    showPageSizeSelector={true}
                    allowedPageSizes={[10, 20, 30]}
                    showNavigationButtons
                    showInfo={true}
                  />
                  <Column dataField="id" caption={t("curriculum_code")} />
                  <Column dataField="name" caption={t("curriculum_name")} />
                  <Column dataField="stage" caption={t("stage")} />
                  <Column dataField="file" caption={t("file")} />
                  <Column
                    dataField="start_date"
                    caption={t("start_date")}
                    dataType={"date"}
                  />
                  <Column
                    dataField="index"
                    caption={`${
                      currentPeriodic === "W"
                        ? t("week")
                        : currentPeriodic === "M"
                        ? t("month")
                        : t("day")
                    } ${t("index")}`}
                    dataType={"number"}
                  />
                  <Column dataField="status" caption={tu("status")}>
                    <Lookup
                      dataSource={[
                        { id: "f", name: t("finished") },
                        { id: "n", name: t("not_started") },
                        { id: "s", name: t("started") },
                      ]}
                      valueExpr={"id"}
                      displayExpr={"name"}
                    />
                  </Column>
                </DataGrid>
              </Item>
            </FormGrid>
          </Editing>
          <Column dataField="course_code" caption={t("course_code")} />
          <Column dataField="course_name" caption={t("course_name")} />
          <Column dataField="status" caption={tu("status")}>
            <Lookup
              dataSource={datasourceStatus}
              valueExpr={"id"}
              displayExpr={"name"}
            />
          </Column>
          <Column dataField="school" caption={tu("school")}>
            <Lookup
              dataSource={dataSchool}
              valueExpr={"id"}
              displayExpr={"name"}
            />
          </Column>
          <Column dataField="curriculum" caption={t("curriculum")} />
          <Column
            dataField="create_date"
            dataType={"date"}
            format={"dd/MM/yyyy"}
            caption={tu("create_date")}
            editorOptions={{ readOnly: true }}
          />
          <Column
            dataField="effect_date"
            dataType={"date"}
            format={"dd/MM/yyyy"}
            caption={t("effect_date")}
            editorOptions={{ readOnly: true }}
          />
          <Column dataField="grade" caption={tu("grade")} dataType={"number"} />
          <Column
            alignment={"center"}
            dataField="file_upload_schedule"
            caption={t("file_upload_schedule")}
            type={"button"}
            allowFiltering={false}
            cellRender={cellButtonCalendarRender}
          ></Column>
          <MasterDetail component={renderDetail} />
        </DataGrid>
      </div>
    </div>
  );
};
export default CourseManagement;
