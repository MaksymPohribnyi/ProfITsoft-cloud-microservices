import apiClient from "misc/requests";
import {
    ERROR_CLIENT,
    ERROR_CLIENTS,
    ERROR_CREATE_CLIENT,
    ERROR_DELETE_CLIENT,
    ERROR_UPDATE_CLIENT,
    RECEIVE_CLIENT,
    RECEIVE_CLIENTS,
    REQUEST_CLIENT,
    REQUEST_CLIENTS,
    REQUEST_CREATE_CLIENT,
    REQUEST_DELETE_CLIENT,
    REQUEST_UPDATE_CLIENT,
    SET_CLIENTS_FILTERS,
    SET_CLIENTS_PAGINATION,
    SUCCESS_CREATE_CLIENT,
    SUCCESS_DELETE_CLIENT,
    SUCCESS_UPDATE_CLIENT,
} from "../constants/actionTypes";

// Action creators
const requestClients = () => ({ type: REQUEST_CLIENTS });
const receiveClients = (data) => ({ type: RECEIVE_CLIENTS, payload: data });
const errorClients = (error) => ({ type: ERROR_CLIENTS, payload: error });

const requestClient = () => ({ type: REQUEST_CLIENT });
const receiveClient = (client) => ({ type: RECEIVE_CLIENT, payload: client });
const errorClient = (error) => ({ type: ERROR_CLIENT, payload: error });

const requestCreate = () => ({ type: REQUEST_CREATE_CLIENT });
const successCreate = (client) => ({
  type: SUCCESS_CREATE_CLIENT,
  payload: client,
});
const errorCreate = (error) => ({ type: ERROR_CREATE_CLIENT, payload: error });

const requestUpdate = () => ({ type: REQUEST_UPDATE_CLIENT });
const successUpdate = (client) => ({
  type: SUCCESS_UPDATE_CLIENT,
  payload: client,
});
const errorUpdate = (error) => ({ type: ERROR_UPDATE_CLIENT, payload: error });

const requestDelete = () => ({ type: REQUEST_DELETE_CLIENT });
const successDelete = (id) => ({ type: SUCCESS_DELETE_CLIENT, payload: id });
const errorDelete = (error) => ({ type: ERROR_DELETE_CLIENT, payload: error });

export const setFilters = (filters) => ({
  type: SET_CLIENTS_FILTERS,
  payload: filters,
});
export const setPagination = (pagination) => ({
  type: SET_CLIENTS_PAGINATION,
  payload: pagination,
});

const getClientsAPI = () => {
  return apiClient.get("/api/client");
};

const getClientAPI = (id) => {
  return apiClient.get(`/api/client/${id}`);
};

const createClientAPI = (clientData) => {
  return apiClient.post("/api/client", clientData);
};

const updateClientAPI = (id, clientData) => {
  return apiClient.put(`/api/client/${id}`, clientData);
};

const deleteClientAPI = (id) => {
  return apiClient.delete(`/api/client/${id}`);
};

const applyFiltersAndPagination = (clients, filters, page, pageSize) => {
  let filtered = [...clients];

  if (filters.firstName) {
    filtered = filtered.filter((c) =>
      c.firstName.toLowerCase().includes(filters.firstName.toLowerCase()),
    );
  }

  if (filters.lastName) {
    filtered = filtered.filter((c) =>
      c.lastName.toLowerCase().includes(filters.lastName.toLowerCase()),
    );
  }

  if (filters.email) {
    filtered = filtered.filter((c) =>
      c.email.toLowerCase().includes(filters.email.toLowerCase()),
    );
  }

  const total = filtered.length;
  const start = (page - 1) * pageSize;
  const paginatedData = filtered.slice(start, start + pageSize);

  return {
    data: paginatedData,
    total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize),
  };
};

export const fetchClients =
  (filters = {}, page = 1, pageSize = 10) =>
  (dispatch) => {
    dispatch(requestClients());
    return getClientsAPI()
      .then((allClients) => {
        const result = applyFiltersAndPagination(
          allClients,
          filters,
          page,
          pageSize,
        );
        dispatch(receiveClients(result));
        return result;
      })
      .catch((error) => {
        console.error("Error in fetchClients:", error);
        dispatch(errorClients(error));
      });
  };

export const fetchClient = (id) => (dispatch) => {
  dispatch(requestClient());
  return getClientAPI(id)
    .then((client) => {
      dispatch(receiveClient(client));
      return client;
    })
    .catch((error) => {
      dispatch(errorClient(error));
    });
};

export const createClient = (clientData) => (dispatch) => {
  dispatch(requestCreate());
  return createClientAPI(clientData)
    .then((newClient) => {
      dispatch(successCreate(newClient));
      return newClient;
    })
    .catch((error) => {
      dispatch(errorCreate(error));
      throw error;
    });
};

export const updateClient = (id, clientData) => (dispatch) => {
  dispatch(requestUpdate());
  return updateClientAPI(id, clientData)
    .then((updatedClient) => {
      dispatch(successUpdate(updatedClient));
      return updatedClient;
    })
    .catch((error) => {
      dispatch(errorUpdate(error));
      throw error;
    });
};

export const deleteClient = (id) => (dispatch) => {
  dispatch(requestDelete());
  return deleteClientAPI(id)
    .then((deletedId) => {
      dispatch(successDelete(deletedId));
      return deletedId;
    })
    .catch((error) => {
      dispatch(errorDelete(error));
      throw error;
    });
};

const exportFunctions = {
  fetchClients,
  fetchClient,
  createClient,
  updateClient,
  deleteClient,
  setFilters,
  setPagination,
};

export default exportFunctions;
