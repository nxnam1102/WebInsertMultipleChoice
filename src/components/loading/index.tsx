import { LoadPanel } from "devextreme-react/load-panel";
import "moment/locale/vi";
import React from "react";
import { useSelector } from "react-redux";
import "./index.scss";
import { AppState } from "../../store/root_reducer";
//import Lottie from "react-lottie";
//import animationData from "../../constants/lottie/23709-wokshop-icon.json";

const Loading = () => {
  const isLoading = useSelector(
    (state: AppState) => state.loadingReducer.isLoading
  );
  const loadingMessage = useSelector(
    (state: AppState) => state.loadingReducer.loadingMessage
  );
  return (
    <div className={"loading"}>
      {/* <Popup
        visible={isLoading}
        dragEnabled={false}
        closeOnOutsideClick={false}
        showTitle={false}
        width={300}
        height={250}
      >
        <Lottie
          options={{ animationData: animationData, autoplay: true, loop: true }}
        />
      </Popup> */}
      <LoadPanel
        shadingColor="rgba(0,0,0,0.4)"
        position={"center"}
        message={loadingMessage}
        visible={isLoading}
        showIndicator={true}
        shading={true}
        showPane={true}
      />
    </div>
  );
};
export default Loading;
