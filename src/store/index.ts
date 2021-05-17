import { createStore, compose, applyMiddleware } from "redux";
import createSagaMiddleware from "redux-saga";
import { createLogger } from "redux-logger";
import { rootReducer } from "./root_reducer";
import { rootSaga } from "./root_saga";

var store: any = undefined;
const Store = {
  init() {
    const sagaMiddleware = createSagaMiddleware();
    if (process.env.NODE_ENV !== "production") {
      store = createStore(
        rootReducer,
        compose(applyMiddleware(sagaMiddleware))
      );
    } else {
      store = createStore(rootReducer, applyMiddleware(sagaMiddleware));
    }
    sagaMiddleware.run(rootSaga);
  },
  getStore() {
    return store;
  },
};
export default Store;
