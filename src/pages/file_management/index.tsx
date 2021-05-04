//
import { FC, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, withRouter } from "react-router-dom";
import { cloneDeep } from "lodash";
import { Props } from "./index.interface";
import { Actions } from "./index.redux";

// components
import DataGrid, {
  Column,
  ColumnChooser,
  Editing,
  FilterPanel,
  Form,
  HeaderFilter,
  Pager,
  Paging,
  Popup as FormPopup,
} from "devextreme-react/data-grid";
import { Item } from "devextreme-react/form";
import Popup from "devextreme-react/popup";
import { confirm } from "devextreme/ui/dialog";
import { AppLogging } from "../../helpers/utilities";
import { Namespace } from "../../constants/language";
import { AppState } from "../../store/root_reducer";
// styles
import "./index.scss";

// object
// export const SysObject: SystemObject = {
//   objType: "DEMO_DOC",
//   objName: "DemoDocName",
//   tableName: "TBL_DEMO_DOC",
// };

// pages
const Index: FC<Props> = () => {
  //Create hook--------------------------------------------------------------------
  const dispatch = useDispatch();
  const { t } = useTranslation(Namespace.file_management);
  let [showFormBox, setShowFormBox] = useState(false);
  const [popupHeight, setPopupHeight] = useState(420);
  const [popupWidth, setPopupWidth] = useState(700);
  // const [selectedFile, setSelectedFile] = useState<any>();
  // let [uploading, setUploading] = useState(false);
  // let [progressValue, setProgressValue] = useState(0);
  const {
    acceptedFiles,
    fileRejections,
    getRootProps,
    getInputProps,
  } = useDropzone({
    accept: ".ppt, .pptx",
    multiple: false,
  });

  const location = useLocation();
  let paths = location.pathname.split("/");
  let selectedId = paths[2] !== undefined ? paths[2] : "";

  //Create state local-------------------------------------------------------------

  //Get state from redux-----------------------------------------------------------
  const { selectItem, listSkill, listFile, updateStatus } = useSelector(
    (store: AppState) => store.fileManagementReducer
  );

  //Run Effect---------------------------------------------------------------------
  useEffect(() => {
    //fetch data first
    dispatch(Actions.fetchData({ selectId: selectedId }));
  }, [dispatch, selectedId]);

  useEffect(() => {
    if (updateStatus !== "") {
      setShowFormBox(false);
      dispatch(Actions.setState({ updateStatus: "" }));
      acceptedFiles.length = 0;
      acceptedFiles.splice(0, acceptedFiles.length);
      fileRejections.length = 0;
      fileRejections.splice(0, fileRejections.length);
    }
  }, [updateStatus, dispatch, acceptedFiles, fileRejections]);

  useEffect(() => {
    if (fileRejections.length > 0) {
      let errors = fileRejections[0].errors;
      if (errors.length > 0) {
        if (errors[0].message !== "") {
          switch (errors[0].message) {
            case "File type must be .ppt, .pptx":
              AppLogging.error(t("wrong_file"));
              break;
            case "Too many files":
              AppLogging.error(t("too_many_files"));
              break;
            default:
              break;
          }
        }
      }
      setTimeout(() => {
        fileRejections.length = 0;
        fileRejections.splice(0, fileRejections.length);
      }, 1000);
    }
  }, [fileRejections, t]);

  //Event on Screen----------------------------------------------------------------
  //--Sử dụng function thường hoặc hook useCallback
  //const onChange = useCallback(() => {}, []);

  //Render view on Screen----------------------------------------------------------
  //--Bắt buộc sử dụng hook useMemo khi render
  //const renderView = useMemo(() => {}, []);

  //Chức năng mới
  const getDisplayOption = (value: any) => {
    if (value) {
      let option = t("Skill") + " " + value.skill;
      return option;
    }
    return "";
  };

  const handleBoxHidden = () => {
    setShowFormBox(false);
    acceptedFiles.length = 0;
    acceptedFiles.splice(0, acceptedFiles.length);
    fileRejections.length = 0;
    fileRejections.splice(0, fileRejections.length);
  };

  const resizePopup = (e: any) => {
    setPopupWidth(e.component?.option("width"));
    setPopupHeight(e.component?.option("height"));
  };

  const uploadFile = () => {
    dispatch(Actions.uploadFile({ uploadFile: acceptedFiles[0] }));
    setTimeout(() => {
      acceptedFiles.length = 0;
      acceptedFiles.splice(0, acceptedFiles.length);
    }, 1000);
  };

  const bytesToSize = (bytes: number) => {
    let sizes = ["Bytes", "KB", "MB", "GB", "TB"];
    if (bytes === 0) return "0 Byte";
    let i: number = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i)) + " " + sizes[i];
  };

  const handleSkillChange = (args: any) => {
    let cloneSelectItem = cloneDeep(selectItem)!;
    if (cloneSelectItem !== undefined) {
      cloneSelectItem.skill = args.value!;
    }
    dispatch(Actions.setState({ selectItem: cloneSelectItem }));
  };

  // Component Con

  const UploadForm = () => {
    return (
      <div className={"upload_form"}>
        <div className={"input_file"}>
          <div style={{}} className={"fileuploader_container"}>
            <section className={"container"}>
              <div {...getRootProps({ className: "dropzone" })}>
                <input className={"input_box"} {...getInputProps()} />
                <span className={"upload_panel"}>
                  {acceptedFiles.length > 0
                    ? acceptedFiles[0].name +
                      " - " +
                      bytesToSize(acceptedFiles[0].size)
                    : t("drag_drop_file")}
                </span>
                <em
                  style={
                    acceptedFiles.length > 0
                      ? { display: "none" }
                      : { display: "block" }
                  }
                >
                  {t("accept_ppt_pptx")}
                </em>
              </div>
            </section>
          </div>
        </div>
      </div>
    );
  };

  const PathComponent = (value: any) => {
    return (
      <span
        className="link_path"
        onClick={() => {
          let result = confirm(t("are_you_sure"), t("download_file"));
          result.then((dialogResult) => {
            if(dialogResult) {
              window.open(value.data.filePath!);
              setTimeout(() => {
                window.close();
              }, 1000);
            }
          });
        }}
      >
        {value.data.filePath}
      </span>
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
      location: "before",
      widget: "dxSelectBox",
      options: {
        value: selectItem?.skill,
        dataSource: listSkill,
        displayExpr: getDisplayOption,
        valueExpr: "id",
        onValueChanged: handleSkillChange,
        searchEnabled: false,
      },
    });
    e.toolbarOptions?.items?.unshift({
      location: "after",
      widget: "dxButton",
      options: {
        icon: "add",
        type: "normal",
        text: t("add_file"),
        elementAttr: {
          class: "toolbar_btn",
        },
        // styles: [{ backgroundColor: "#f4bf08", borderRadius: 20 }],
        onClick: (e: any) => {
          e.validationGroup.reset();
          setShowFormBox(true);
        },
      },
    });
  };

  return (
    <div className={"wrapper"}>
      {/* <SelectBox dropDownButtonComponent={ListIcon} /> */}
      <div className={"header"}>
        <div className={"row_1"}>
          <div className={"left"}>
            <h3>{t("lesson_files_management")}</h3>
          </div>
        </div>
      </div>
      <div className={"content"}>
        <DataGrid
          dataSource={listFile}
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
              title={t("file_edit")}
              showTitle={true}
              resizeEnabled
              onResizeEnd={resizePopup}
            ></FormPopup>
            <Form>
              <Item
                caption={t("file_info")}
                itemType="group"
                colCount={2}
                colSpan={2}
              >
                <Item dataField="fileName"></Item>
                <Item dataField="filePath" editorOptions={{ readOnly: true }} />
                <Item dataField="uploader" />
                <Item dataField="phrase" />
                <Item
                  dataField="createDate"
                  editorOptions={{ readOnly: true }}
                />
                <Item
                  dataField="updateDate"
                  editorOptions={{ readOnly: true }}
                />
              </Item>
            </Form>
          </Editing>
          <Column dataField="fileName" caption={t("file_name")} />
          <Column
            width={160}
            dataField="filePath"
            caption={t("file_path")}
            cellRender={PathComponent}
          />
          <Column dataField="uploader" caption={t("uploader")} />
          <Column dataField="createDate" caption={t("create_date")} />
          <Column dataField="updateDate" caption={t("update_date")} />
          <Column
            dataField="phrase"
            caption={t("phrase")}
            // hidingPriority={0}
          />
          <Column caption={"Action"} type={"buttons"}></Column>
        </DataGrid>
        <Popup
          width={popupWidth}
          height={popupHeight}
          resizeEnabled
          onResizeEnd={resizePopup}
          showTitle={true}
          title={t("upload_file")}
          visible={showFormBox}
          dragEnabled={true}
          onHiding={handleBoxHidden}
          contentRender={UploadForm}
          toolbarItems={[
            {
              location: "after",
              widget: "dxButton",
              options: {
                id: "button",
                text: t("upload_file"),
                // text: formatMessage("dxDataGrid-editingSaveRowChanges", ""),
                onClick: () => {
                  uploadFile();
                },
              },
              toolbar: "bottom",
            },
          ]}
        ></Popup>
      </div>
    </div>
  );
};

export default withRouter(Index);
