import "devextreme/dist/css/dx.light.css";
import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import {
  DefaultToast, ToastProps, ToastProvider
} from "react-toast-notifications";
import App from "./App";
import "./i18n";
import "./index.css";
import reportWebVitals from "./reportWebVitals";
import StoreProvider from "./store";

window.__react_toast_provider = React.createRef();
StoreProvider.init();
const reduxStore = StoreProvider.getStore();
function copyToClipboard(text) {
  var dummy = document.createElement("textarea");
  // to avoid breaking orgain page when copying more words
  // cant copy when adding below this code
  // dummy.style.display = 'none'
  document.body.appendChild(dummy);
  //Be careful if you use texarea. setAttribute('value', value), which works with "input" does not work with "textarea". – Eduard
  dummy.value = text;
  dummy.select();
  document.execCommand("copy");
  document.body.removeChild(dummy);
}
// ===== or when using modules =====
const CustomToast: React.FC<ToastProps> = ({ children, ...props }) => {
  return (
    <div
      id={"toast"}
      onClick={() => {
        copyToClipboard(children);
      }}
      style={{ cursor: "pointer" }}
    >
      <DefaultToast {...props}>{children}</DefaultToast>
    </div>
  );
};
ReactDOM.render(
  // <React.StrictMode>
  <Provider store={reduxStore}>
    <ToastProvider
      components={{ Toast: CustomToast }}
      autoDismiss
      autoDismissTimeout={5000}
      placement={"bottom-right"}
      ref={window.__react_toast_provider}
    >
      <App />
    </ToastProvider>
  </Provider>,
  // </React.StrictMode>,
  document.getElementById("root")
);
// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
