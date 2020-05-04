import React from "react";

import ReduxProvider from "./redux";
import { NotificationProvider } from "./notification";

const AppProviders = ({ children }) => {
  return (
    <ReduxProvider>
      <NotificationProvider>{children}</NotificationProvider>
    </ReduxProvider>
  );
};

export default AppProviders;
