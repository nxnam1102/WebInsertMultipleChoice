//
import { Popup, IPopupOptions } from "devextreme-react/popup";
import ScrollView from "devextreme-react/scroll-view";
import { FC, useState } from "react";

//interface
interface Props extends IPopupOptions {
  popupRef?: any;
}
//Render view on Screen
const AppPopup: FC<Props> = (props) => {
  const { width, height, ...otherProps } = props;
  const [popupHeight, setPopupHeight] = useState(height ? height : undefined);
  const [popupWidth, setPopupWidth] = useState(width ? width : 700);
  const resizePopup = (e: any) => {
    setPopupWidth(e.component?.option("width"));
    setPopupHeight(e.component?.option("height"));
  };
  return (
    <Popup
      ref={otherProps.popupRef}
      width={popupWidth}
      height={popupHeight}
      resizeEnabled={true}
      onResizeEnd={resizePopup}
      {...otherProps}
    >
      <ScrollView height={"100%"} width={"100%"}>
        {otherProps.children}
      </ScrollView>
    </Popup>
  );
};
export default AppPopup;
