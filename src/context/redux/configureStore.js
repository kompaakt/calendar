import { asyncDispatchMiddleware } from "./middleware";
import storage from "redux-persist/lib/storage";
import { persistStore, persistReducer } from "redux-persist";
import { createStore, combineReducers, applyMiddleware, compose } from "redux";

import { notifications, events, scheduledTasks } from "./reducers";

const persistConfig = {
  key: "root",
  storage,
  blacklist: ["notifications", "scheduledTasks"],
};

const persistedReducer = persistReducer(
  persistConfig,
  combineReducers({ events, notifications, scheduledTasks }),
  {
    events: [],
  }
);

const composeEnhancers =
  typeof window === "object" && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({})
    : compose;

const enhancer = composeEnhancers(applyMiddleware(asyncDispatchMiddleware));

const store = createStore(persistedReducer, enhancer);
const persistor = persistStore(store);

export { persistor, store };
