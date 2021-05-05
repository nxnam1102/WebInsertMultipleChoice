import "moment/locale/vi";
import React, { useEffect } from "react";
import "react-pro-sidebar/dist/css/styles.css";
import { useDispatch, useSelector } from "react-redux";
import { AppState } from "../../store/root_reducer";
import { Actions } from "./index.redux";
import "./index.scss";
import { DataGrid, Paging, Pager, Column } from "devextreme-react/data-grid";

//#endregion
const User = () => {
  const dispatch = useDispatch();
  const data = useSelector((store: AppState) => store.userReducer.data);
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
      >
        <Paging defaultPageSize={10} />
        <Pager
          showPageSizeSelector={true}
          allowedPageSizes={[5, 10, 20]}
          showInfo={true}
        />

        <Column dataField="UserId" visible={false} />
        <Column dataField="email" />
        <Column dataField="displayName" />
        <Column dataField="phoneNumber" />
        <Column
          dataField="photoURL"
          cellRender={(arg) => {
            return <img className={"user-image"} src={arg.value} />;
          }}
        />
        <Column dataField="uid" visible={false} />
        <Column dataField="userType" visible={false} />
      </DataGrid>
    </div>
  );
};
export default User;
