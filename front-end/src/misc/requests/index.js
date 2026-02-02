import axios from "axios";
import config from "config";

const apiClient = axios.create({
  baseURL: config.API_BASE_URL || window.location.origin,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

const addAxiosInterceptors = ({ onSignOut }) => {
  apiClient.interceptors.response.use(
    (response) => response.data,
    (error) => {
      if (error.response?.status === 401) {
        return Promise.reject([{ code: "UNAUTHORIZED" }]);
      }

      const errorData = error.response?.data;
      if (Array.isArray(errorData)) {
        throw errorData;
      }
      throw (
        error.response?.data || [
          { code: "UNKNOWN_ERROR", description: error.message },
        ]
      );
    },
  );
};

export { addAxiosInterceptors, apiClient };

export default apiClient;
