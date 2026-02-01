import { apiClient } from "misc/requests";

import {
  RECEIVE_USER,
  REQUEST_SIGN_IN,
  REQUEST_SIGN_OUT,
  REQUEST_SIGN_UP,
  REQUEST_USER,
} from "../constants/actionTypes";

const receiveUser = (user) => ({
  payload: user,
  type: RECEIVE_USER,
});

const requestUser = () => ({
  type: REQUEST_USER,
});

const requestSignIn = () => ({
  type: REQUEST_SIGN_IN,
});

const requestSignUp = () => ({
  type: REQUEST_SIGN_UP,
});

const requestSignOut = () => ({
  type: REQUEST_SIGN_OUT,
});

const fetchRefreshToken = () => (dispatch) => {};

const fetchSignIn = () => (dispatch) => {};

const fetchSignOut = () => (dispatch) => {
  // call Gateway logout endpoint
  return apiClient
    .post("/logout")
    .catch((error) => {
      console.error("Logout error:", error);
    })
    .finally(() => {
      dispatch(requestSignOut());
      // Redirect to login page
      window.location.href = "/login";
    });
};

const fetchSignUp = () => (dispatch) => {};

const fetchUser = () => (dispatch) => {
  dispatch(requestUser());
  return apiClient
    .get("/profile")
    .then((user) => {
      const transformedUser = {
        email: user.email || "",
        firstName: user.name?.split(" ")[0] || user.name || "",
        lastName: user.name?.split(" ").slice(1).join(" ") || "",
        id: user.email || "",
        login: user.email || "",
        authorities: ["ENABLE_SEE_SECRET_PAGE"],
      };
      return dispatch(receiveUser(transformedUser));
    })
    .catch(() => {
      // 401 — user not authenticated, nothing to do
    });
};

const exportFunctions = {
  fetchRefreshToken,
  fetchSignIn,
  fetchSignOut,
  fetchSignUp,
  fetchUser,
};

export default exportFunctions;
