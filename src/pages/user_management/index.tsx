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
import {
  EmailRule,
  PatternRule,
  RequiredRule,
} from "devextreme-react/validator";
import { formatMessage } from "devextreme/localization";
import { confirm } from "devextreme/ui/dialog";
import lodash from "lodash";
import moment from "moment";
import "moment/locale/vi";
import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import "react-pro-sidebar/dist/css/styles.css";
import { useDispatch, useSelector } from "react-redux";
import AppPopup from "../../components/controls/popup";
import utilities, { AppLogging } from "../../helpers/utilities";
import { Namespace } from "../../constants/language";
import { AppState } from "../../store/root_reducer";
import { AddNewData } from "./index.interface";
import { Actions } from "./index.redux";
import "./index.scss";

//#region ----------constance----------
const notAllowSpace = /^\S*$/;
const phonePattern = /^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/;
//#endregion
const UserManagement = () => {
  //#region ----------use hook function----------
  //useRef
  const popupAddRef = useRef<any>(null);
  const formAddRef = useRef<any>(null);
  //translation
  const { t } = useTranslation(Namespace.user_management);
  //dispatch
  const dispatch = useDispatch();
  //useState
  const [popupHeight, setPopupHeight] = useState(undefined);
  const [popupWidth, setPopupWidth] = useState(700);
  const [currentSchoolId, setCurrentSchoolId] = useState(null);
  //useSelector get data redux
  const dataSchool = useSelector(
    (store: AppState) => store.userManagementReducer.dataSchool
  );
  const dataUser = useSelector(
    (store: AppState) => store.userManagementReducer.dataUser
  );
  //useEffect load data init
  useEffect(() => {
    dispatch(Actions.fetchData(undefined));
  }, [dispatch]);
  useEffect(() => {}, [currentSchoolId, dataUser]);
  //#endregion

  //#region ----------variable----------
  const currentSchool =
    Array.isArray(dataSchool) &&
    dataSchool.length > 0 &&
    dataSchool.find((x) => x.id === currentSchoolId)
      ? dataSchool.find((x) => x.id === currentSchoolId)
      : Array.isArray(dataSchool) && dataSchool.length > 0
      ? dataSchool[0]
      : {};
  const datasourceStatus = [
    {
      id: "p",
      name: t("pending"),
    },
    {
      id: "a",
      name: t("approved"),
    },
    {
      id: "r",
      name: t("rejected"),
    },
  ];
  const defaultAddNewData: AddNewData = {
    user_name: "",
    course: "",
    email: "",
    grade: 1,
    name: "",
    password: "",
    phone_number: "",
    school: currentSchool.id,
    identity_card_number: "",
    status: "p",
    create_date: moment().toDate(),
    login_date: moment().toDate(),
  };
  const addNewSource = lodash.cloneDeep(defaultAddNewData);
  //#endregion

  //#region ----------function----------
  //hàm resizePopup
  const resizePopup = (e: any) => {
    try {
      setPopupWidth(e.component?.option("width"));
      setPopupHeight(e.component?.option("height"));
    } catch (error) {
      AppLogging.error(error);
    }
  };
  // hàm change school
  const schoolChanged = (data: any) => {
    try {
      if (data.value !== data.previousValue) {
        setCurrentSchoolId(data.value);
        dispatch(Actions.fetchData(data.value));
      }
    } catch (error) {
      AppLogging.error(error);
    }
  };
  //close popup add new
  const closeAddNew = () => {
    try {
      confirm(t("cancel_message"), t("cancel")).then((res) => {
        if (res === true) {
          popupAddRef.current.instance.hide();
          return;
        }
      });
    } catch (error) {
      AppLogging.error(error);
    }
  };
  //save add new
  const saveAddNew = (e: any) => {
    try {
      if (e.validationGroup.validate().isValid === true) {
        console.log(addNewSource);
        dispatch(
          Actions.addNew({
            addNewData: lodash.cloneDeep(addNewSource),
            currentSchoolId: currentSchoolId,
            callback: () => {
              popupAddRef.current.instance.hide();
              if (formAddRef) {
                formAddRef.current.instance.updateData(
                  lodash.cloneDeep(defaultAddNewData)
                );
              }
            },
          })
        );
      }
    } catch (error) {
      AppLogging.error(error);
    }
  };
  // toolbar prepairing
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
          icon: "add",
          type: "normal",
          text: t("add_user"),
          elementAttr: {
            class: "toolbar_btn",
          },
          onClick: (e: any) => {
            e.validationGroup.reset();
            popupAddRef.current.instance.show();
          },
        },
      });
    } catch (error) {
      AppLogging.error(error);
    }
  };
  //row grid click
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
  //custom text password
  const customTextPassword = (cellInfo: any) => {
    return "**********";
  };
  //render detail
  const renderDetail = (data: any) => {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "flex-start",
        }}
      >
        <img
          width={100}
          height={100}
          style={{ borderRadius: 50 }}
          src={
            "https://preview.keenthemes.com/metronic-v4/theme/assets/pages/media/profile/profile_user.jpg"
          }
          alt={"profile_image"}
        />
        <div className="column">
          <div id="userName">{`${data.data.data.user_name}`}</div>
          <div id="name">{`${data.data.data.name}`}</div>
        </div>
        <div className="column">
          <div className="label">{`${t("school")}`}</div>
          <div className="value">{`${
            dataSchool?.find((x) => x.id === data.data.data.school)?.name
          }`}</div>
          <div
            style={{
              flexDirection: "row",
              display: "flex",
              alignItems: "center",
              marginBottom: 10,
            }}
          >
            <div className="label">{`${t("grade")}: `}</div>
            <div
              className="value"
              style={{ marginBottom: 0 }}
            >{`${data.data.data.grade}`}</div>
          </div>
          <div className="label">{`${t("status")}`}</div>
          <div className="value">{`${
            datasourceStatus.find((x) => x.id === data.data.data.status)?.name
          }`}</div>
        </div>
        <div className="column">
          <div className="label">{`${"Email"}`}</div>
          <div className="value">{`${data.data.data.email}`}</div>
          <div className="label">{`${t("identity_card_number")}`}</div>
          <div className="value">{`${data.data.data.identity_card_number}`}</div>
          <div className="label">{`${t("phone_number")}`}</div>
          <div className="value">{`${data.data.data.phone_number}`}</div>
        </div>
        <div className="column">
          <div className="label">{`${t("login_date")}`}</div>
          <div className="value">{`${moment(data.data.data.login_date).format(
            "DD/MM/YYYY"
          )}`}</div>
          <div className="label">{`${t("create_date")}`}</div>
          <div className="value">{`${moment(data.data.data.create_date).format(
            "DD/MM/YYYY"
          )}`}</div>
        </div>
      </div>
    );
  };
  //#endregion

  return (
    <div className={"main"}>
      <div className={"namnx"} />
      <div className={"header-row"}>
        <div>
          <div id={"school-title"} style={{ paddingBottom: 10 }}>{`${t(
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
          <div className={"left-text"}>{t("number_of_student")}</div>
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
          <div className={"left-text"}>{t("number_of_teacher")}</div>
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
          <div className={"left-text"}>{t("revenue")}</div>
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
          <div className={"left-text"}>{t("recive_revenue")}</div>
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
          <div className={"left-text"}>{t("ratio")}</div>
          <div className={"right-text"}>{`15%`}</div>
        </div>
      </div>
      <div>
        <AppPopup
          title={t("add_user")}
          popupRef={popupAddRef}
          showTitle={true}
          toolbarItems={[
            {
              location: "after",
              widget: "dxButton",
              options: {
                id: "button",
                text: formatMessage("dxDataGrid-editingSaveRowChanges", ""),
                useSubmitBehavior: true,
                validationGroup: "add_user",
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
          <form>
            <Form
              formData={addNewSource}
              ref={formAddRef}
              showValidationSummary={true}
              validationGroup={"add_user"}
              showColonAfterLabel={false}
            >
              <Item itemType="group" colCount={2} colSpan={2}>
                <Item
                  colSpan={2}
                  dataField="school"
                  label={{ text: t("school") }}
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
                caption={t("teacher_infomation")}
                itemType="group"
                colCount={2}
                colSpan={2}
              >
                <Item label={{ text: t("name") }} dataField="name">
                  <RequiredRule message={t("require")} />
                </Item>
                <Item label={{ text: "email" }} dataField="email">
                  <RequiredRule message={t("require")} />
                  <EmailRule />
                </Item>
                <Item
                  label={{ text: t("identity_card_number") }}
                  dataField="identity_card_number"
                />
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
                <Item
                  label={{ text: t("phone_number") }}
                  dataField="phone_number"
                >
                  <PatternRule
                    pattern={phonePattern}
                    message={t("invalid_phone_number")}
                  />
                </Item>
              </Item>
              <Item
                caption={t("course_infomation")}
                itemType="group"
                colCount={2}
                colSpan={2}
              >
                <Item
                  label={{ text: t("course") }}
                  dataField="course"
                  colSpan={2}
                  editorType={"dxTagBox"}
                  editorOptions={{
                    dataSource: dataSchool,
                    displayExpr: "name",
                    valueExpr: "id",
                    searchEnabled: true,
                  }}
                />
              </Item>
              <Item
                caption={t("login_infomation")}
                itemType="group"
                colCount={2}
                colSpan={2}
              >
                <Item label={{ text: t("user_name") }} dataField="user_name">
                  <RequiredRule message={t("require")} />
                  <PatternRule
                    message={t("not_allow_space")}
                    pattern={notAllowSpace}
                  />
                </Item>
                <Item
                  label={{ text: t("password") }}
                  dataField="password"
                  editorOptions={{ mode: "password" }}
                >
                  <RequiredRule message={t("require")} />
                  <PatternRule
                    message={t("not_allow_space")}
                    pattern={notAllowSpace}
                  />
                </Item>
              </Item>
            </Form>
          </form>
        </AppPopup>
        <DataGrid
          onRowUpdating={(e) => {
            console.log(e);
          }}
          onRowRemoving={(e) => {
            console.log(e);
            e.cancel = true;
          }}
          dataSource={lodash.cloneDeep(dataUser)}
          showBorders={true}
          columnAutoWidth={true}
          rowAlternationEnabled={true}
          selection={{ mode: "single" }}
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
              title={t("edit_user")}
              showTitle={true}
              width={popupWidth}
              height={popupHeight}
              resizeEnabled
              onResizeEnd={resizePopup}
            />
            <FormGrid showValidationSummary showColonAfterLabel={false}>
              <Item
                dataField="school"
                editorType={"dxSelectBox"}
                colSpan={2}
                editorOptions={{
                  dataSource: dataSchool,
                  displayExpr: "name",
                  valueExpr: "id",
                }}
              />
              <Item
                itemType="group"
                caption={t("teacher_infomation")}
                colCount={2}
                colSpan={2}
              >
                <Item dataField="name">
                  <RequiredRule message={t("require")} />
                </Item>
                <Item dataField="email">
                  <RequiredRule message={t("require")} />
                  <EmailRule />
                </Item>
                <Item
                  dataField="grade"
                  editorType={"dxNumberBox"}
                  editorOptions={{
                    showSpinButtons: true,
                    mode: "number",
                    format: "#0",
                    min: 1,
                  }}
                />
                <Item
                  dataField="status"
                  editorType={"dxSelectBox"}
                  editorOptions={{
                    dataSource: datasourceStatus,
                    displayExpr: "name",
                    valueExpr: "id",
                  }}
                />
                <Item
                  label={{ text: t("phone_number") }}
                  dataField="phone_number"
                >
                  <PatternRule
                    pattern={phonePattern}
                    message={t("invalid_phone_number")}
                  />
                </Item>
                <Item
                  label={{ text: t("identity_card_number") }}
                  dataField="identity_card_number"
                />
              </Item>
              <Item
                itemType="group"
                caption={t("course_infomation")}
                colCount={2}
                colSpan={2}
              >
                <Item
                  colSpan={2}
                  label={{ text: t("course") }}
                  dataField={"course"}
                  editorType={"dxTagBox"}
                  editorOptions={{
                    dataSource: datasourceStatus,
                    displayExpr: "name",
                    valueExpr: "id",
                  }}
                />
              </Item>
              <Item
                itemType="group"
                caption={t("login_infomation")}
                colCount={2}
                colSpan={2}
              >
                <Item
                  dataField="user_name"
                  editorOptions={{ readOnly: true }}
                />
                <Item dataField="password" editorOptions={{ mode: "password" }}>
                  <RequiredRule message={t("require")} />
                  <PatternRule
                    message={t("not_allow_space")}
                    pattern={notAllowSpace}
                  />
                </Item>
                <Item dataField="create_date" />
                <Item dataField="login_date" />
              </Item>
            </FormGrid>
          </Editing>
          <Column dataField="user_name" caption={t("user_name")} />
          <Column dataField="name" caption={t("name")} />
          <Column dataField="school" caption={t("school")}>
            <Lookup
              dataSource={dataSchool}
              valueExpr={"id"}
              displayExpr={"name"}
            />
          </Column>
          <Column dataField="grade" dataType={"number"} caption={t("grade")} />
          <Column
            allowFiltering={false}
            allowSearch={false}
            visible={false}
            dataField="password"
            caption={t("password")}
            customizeText={customTextPassword}
          />
          <Column visible={false} dataField="email" caption={"Email"} />
          <Column
            visible={false}
            dataField="phone_number"
            caption={t("phone_number")}
          />
          <Column
            visible={false}
            dataField="identity_card_number"
            caption={t("identity_card_number")}
          />
          <Column
            dataField="create_date"
            dataType={"date"}
            format={"dd/MM/yyyy"}
            caption={t("create_date")}
            editorOptions={{ readOnly: true }}
          />
          <Column
            dataField="login_date"
            dataType={"date"}
            format={"dd/MM/yyyy"}
            caption={t("login_date")}
            editorOptions={{ readOnly: true }}
          />
          <Column dataField="status" caption={t("status")}>
            <Lookup
              dataSource={datasourceStatus}
              valueExpr={"id"}
              displayExpr={"name"}
            />
          </Column>
          <MasterDetail component={renderDetail} />
        </DataGrid>
      </div>
    </div>
  );
};
export default UserManagement;
