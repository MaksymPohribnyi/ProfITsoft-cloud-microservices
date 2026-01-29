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
    SUCCESS_UPDATE_CLIENT
} from "../constants/actionTypes";
import { MOCK_CLIENTS } from "../mocks/insurancePolicies";
import axios from "axios";
import config from "config";

let mockStorage = [...MOCK_CLIENTS];

// Action creators
const requestClients = () => ({ type: REQUEST_CLIENTS });
const receiveClients = (data) => ({ type: RECEIVE_CLIENTS, payload: data });
const errorClients = (error) => ({ type: ERROR_CLIENTS, payload: error });

const requestClient = () => ({ type: REQUEST_CLIENT });
const receiveClient = (client) => ({ type: RECEIVE_CLIENT, payload: client });
const errorClient = (error) => ({ type: ERROR_CLIENT, payload: error });

const requestCreate = () => ({ type: REQUEST_CREATE_CLIENT });
const successCreate = (client) => ({ type: SUCCESS_CREATE_CLIENT, payload: client });
const errorCreate = (error) => ({ type: ERROR_CREATE_CLIENT, payload: error });

const requestUpdate = () => ({ type: REQUEST_UPDATE_CLIENT });
const successUpdate = (client) => ({ type: SUCCESS_UPDATE_CLIENT, payload: client });
const errorUpdate = (error) => ({ type: ERROR_UPDATE_CLIENT, payload: error });

const requestDelete = () => ({ type: REQUEST_DELETE_CLIENT });
const successDelete = (id) => ({ type: SUCCESS_DELETE_CLIENT, payload: id });
const errorDelete = (error) => ({ type: ERROR_DELETE_CLIENT, payload: error });

export const setFilters = (filters) => ({ type: SET_CLIENTS_FILTERS, payload: filters });
export const setPagination = (pagination) => ({ type: SET_CLIENTS_PAGINATION, payload: pagination });

const getClients = (filters, page, pageSize) => {
    const { USERS_SERVICE } = config;
    return axios.get(`${USERS_SERVICE}/clients`, {
        params: { ...filters, page, pageSize }
    });
};

const getClient = (id) => {
    const { USERS_SERVICE } = config;
    return axios.get(`${USERS_SERVICE}/clients/${id}`);
};

const createClientAPI = (clientData) => {
    const { USERS_SERVICE } = config;
    return axios.post(`${USERS_SERVICE}/clients`, clientData);
};

const updateClientAPI = (id, clientData) => {
    const { USERS_SERVICE } = config;
    return axios.put(`${USERS_SERVICE}/clients/${id}`, clientData);
};

const deleteClientAPI = (id) => {
    const { USERS_SERVICE } = config;
    return axios.delete(`${USERS_SERVICE}/clients/${id}`);
};


const applyFiltersAndPagination = (clients, filters, page, pageSize) => {
    let filtered = [...clients];

    if (filters.firstName) {
        filtered = filtered.filter(c =>
            c.firstName.toLowerCase().includes(filters.firstName.toLowerCase())
        );
    }

    if (filters.lastName) {
        filtered = filtered.filter(c =>
            c.lastName.toLowerCase().includes(filters.lastName.toLowerCase())
        );
    }

    if (filters.email) {
        filtered = filtered.filter(c =>
            c.email.toLowerCase().includes(filters.email.toLowerCase())
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
        totalPages: Math.ceil(total / pageSize)
    };
};

export const fetchClients = (filters = {}, page = 1, pageSize = 10) => (dispatch) => {
    dispatch(requestClients());
    return getClients(filters, page, pageSize)
        .catch(() => {
            const result = applyFiltersAndPagination(mockStorage, filters, page, pageSize);
            return result;
        })
        .then((result) => {
            dispatch(receiveClients(result));
            return result;
        })
        .catch((error) => {
            console.error('Error in fetchClients:', error);
            dispatch(errorClients(error));
        });
};

export const fetchClient = (id) => (dispatch) => {
    dispatch(requestClient());
    return getClient(id)
        .catch(() => {
            const client = mockStorage.find(c => c.id === id);
            if (client) {
                return client;
            }
            return Promise.reject({ message: `Client not found by id = ${id}` });
        })
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
        .catch(() => {
            const newClient = {
                ...clientData,
                id: `${Date.now()}-${Math.random()}`,
                insurancePolicies: []
            };
            mockStorage.push(newClient);
            return newClient;
        })
        .then((newClient) => {
            dispatch(successCreate(newClient));
            return newClient;
        })
        .catch((error) => {
            dispatch(errorCreate(error));
        });
};

export const updateClient = (id, clientData) => (dispatch) => {
    dispatch(requestUpdate());
    return updateClientAPI(id, clientData)
        .catch(() => {
            const index = mockStorage.findIndex(c => c.id === id);
            if (index !== -1) {
                mockStorage[index] = { ...mockStorage[index], ...clientData };
                return mockStorage[index];
            }
            return Promise.reject({ message: `Client not found by id = ${id}` });
        })
        .then((updatedClient) => {
            dispatch(successUpdate(updatedClient));
            return updatedClient;
        })
        .catch((error) => {
            dispatch(errorUpdate(error));
        });
};

export const deleteClient = (id) => (dispatch) => {
    dispatch(requestDelete());
    return deleteClientAPI(id)
        .catch(() => {
            const index = mockStorage.findIndex(c => c.id === id);
            if (index !== -1) {
                mockStorage.splice(index, 1);
                return id;
            }
            return Promise.reject({ message: `Client not found by id = ${id}` });
        })
        .then((deletedId) => {
            dispatch(successDelete(deletedId));
            return deletedId;
        })
        .catch((error) => {
            dispatch(errorDelete(error));
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