import { configureStore } from "@reduxjs/toolkit";

import {
  themeReducer,
  logInStatusReducer,
  accessModalReducer,
  sideMenuMobileReducer,
  moreAboutUserModalReducer
} from "../features";

export const store = configureStore({
  reducer: {
    darkThemeStatus: themeReducer,
    logInStatus: logInStatusReducer,
    accessModal: accessModalReducer,
    sideMenuMobile: sideMenuMobileReducer,
    moreAboutUserModal: moreAboutUserModalReducer
  },
});
