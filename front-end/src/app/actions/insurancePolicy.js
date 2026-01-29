import {
    ERROR_CREATE_INSURANCE_POLICY,
    ERROR_DELETE_INSURANCE_POLICY,
    ERROR_INSURANCE_POLICIES,
    ERROR_INSURANCE_POLICY,
    ERROR_UPDATE_INSURANCE_POLICY,
    RECEIVE_INSURANCE_POLICIES,
    RECEIVE_INSURANCE_POLICY,
    REQUEST_CREATE_INSURANCE_POLICY,
    REQUEST_DELETE_INSURANCE_POLICY,
    REQUEST_INSURANCE_POLICIES,
    REQUEST_INSURANCE_POLICY,
    REQUEST_UPDATE_INSURANCE_POLICY,
    SET_INSURANCE_POLICIES_FILTERS,
    SET_INSURANCE_POLICIES_PAGINATION,
    SUCCESS_CREATE_INSURANCE_POLICY,
    SUCCESS_DELETE_INSURANCE_POLICY,
    SUCCESS_UPDATE_INSURANCE_POLICY
}
    from "../constants/actionTypes";
import { MOCK_POLICIES } from "../mocks/insurancePolicies";
import config from "config";
import axios from "axios";

let mockStorage = [...MOCK_POLICIES];

const requestPolicies = () => ({ type: REQUEST_INSURANCE_POLICIES });
const receivePolicies = (data) => ({ type: RECEIVE_INSURANCE_POLICIES, payload: data });
const errorPolicies = (error) => ({ type: ERROR_INSURANCE_POLICIES, payload: error });

const requestPolicy = () => ({ type: REQUEST_INSURANCE_POLICY });
const receivePolicy = (policy) => ({ type: RECEIVE_INSURANCE_POLICY, payload: policy });
const errorPolicy = (error) => ({ type: ERROR_INSURANCE_POLICY, payload: error });

const requestCreate = () => ({ type: REQUEST_CREATE_INSURANCE_POLICY });
const successCreate = (policy) => ({ type: SUCCESS_CREATE_INSURANCE_POLICY, payload: policy });
const errorCreate = (error) => ({ type: ERROR_CREATE_INSURANCE_POLICY, payload: error });

const requestUpdate = () => ({ type: REQUEST_UPDATE_INSURANCE_POLICY });
const successUpdate = (policy) => ({ type: SUCCESS_UPDATE_INSURANCE_POLICY, payload: policy });
const errorUpdate = (error) => ({ type: ERROR_UPDATE_INSURANCE_POLICY, payload: error });

const requestDelete = () => ({ type: REQUEST_DELETE_INSURANCE_POLICY });
const successDelete = (id) => ({ type: SUCCESS_DELETE_INSURANCE_POLICY, payload: id });
const errorDelete = (error) => ({ type: ERROR_DELETE_INSURANCE_POLICY, payload: error });

export const setFilters = (filters) => ({ type: SET_INSURANCE_POLICIES_FILTERS, payload: filters });
export const setPagination = (pagination) => ({ type: SET_INSURANCE_POLICIES_PAGINATION, payload: pagination });

const getPolicies = (filters, page, pageSize) => {
    const { USERS_SERVICE } = config;
    return axios.get(`${USERS_SERVICE}/insurance-policies`, {
        params: { ...filters, page, pageSize }
    });
};

const getPolicy = (id) => {
    const { USERS_SERVICE } = config;
    return axios.get(`${USERS_SERVICE}/insurance-policies/${id}`);
};

const createPolicyAPI = (policyData) => {
    const { USERS_SERVICE } = config;
    return axios.post(`${USERS_SERVICE}/insurance-policies`, policyData);
};

const updatePolicyAPI = (id, policyData) => {
    const { USERS_SERVICE } = config;
    return axios.put(`${USERS_SERVICE}/insurance-policies/${id}`, policyData);
};

const deletePolicyAPI = (id) => {
    const { USERS_SERVICE } = config;
    return axios.delete(`${USERS_SERVICE}/insurance-policies/${id}`);
};

const applyFiltersAndPagination = (policies, filters, page, pageSize) => {

    let filtered = [...policies];

    if (filters.policyType) {
        filtered = filtered.filter(p => p.policyType === filters.policyType);
    }

    if (filters.startDate) {
        filtered = filtered.filter(p => p.startDate >= filters.startDate);
    }

    if (filters.endDate) {
        filtered = filtered.filter(p => p.endDate <= filters.endDate);
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

}

export const fetchPolicies = (filters = {}, page = 1, pageSize = 10) => (dispatch) => {
    //TODO:
    console.log('fetchPolicies called:', { filters, page, pageSize });
    console.log('mockStorage length:', mockStorage.length);
    dispatch(requestPolicies());
    return getPolicies(filters, page, pageSize)
        .catch(() => {
            const result = applyFiltersAndPagination(mockStorage, filters, page, pageSize);
            return result;
        })
        .then((result) => {
            console.log('Dispatching receivePolicies with:', result);
            dispatch(receivePolicies(result));
            return result;
        })
        .catch((error) => {
            console.error('Error in fetchPolicies:', error);
            dispatch(errorPolicies(error));
        });
}

export const fetchPolicy = (id) => (dispatch) => {
    dispatch(requestPolicy());
    return getPolicy(id)
        .catch(() => {
            const policy = mockStorage.find(p => p.id === id);
            if (policy) {
                dispatch(receivePolicy(policy));
                return policy;
            }
            return Promise.reject({ message: `Policy not found by id = ${id}` });
        })
        .then((policy) => {
            dispatch(receivePolicy(policy))
            return policy;
        })
        .catch((error) => {
            dispatch(errorPolicy(error));
        });
};


export const createPolicy = (policyData) => (dispatch) => {
    dispatch(requestCreate());
    return createPolicyAPI(policyData)
        .catch(() => {
            const newPolicy = {
                ...policyData,
                id: `${Date.now()}-${Math.random()}`,
            };
            mockStorage.push(newPolicy);
            return newPolicy;
        })
        .then((newPolicy) => {
            dispatch(successCreate(newPolicy));
            return newPolicy;
        })
        .catch((error) => {
            dispatch(errorCreate(error));
        });
};

export const updatePolicy = (id, policyData) => (dispatch) => {
    dispatch(requestUpdate());
    return updatePolicyAPI(id, policyData)
        .catch(() => {
            const index = mockStorage.findIndex(p => p.id === id);
            if (index !== -1) {
                mockStorage[index] = { ...mockStorage[index], ...policyData };
                return mockStorage[index];
            }
            return Promise.reject({ message: `Policy not found by id = ${id}` });
        })
        .then((updatedPolicy) => {
            dispatch(successUpdate(updatedPolicy));
            return updatedPolicy;
        })
        .catch((error) => {
            dispatch(errorUpdate(error));
        });
};

export const deletePolicy = (id) => (dispatch) => {
    dispatch(requestDelete());
    return deletePolicyAPI(id)
        .catch(() => {
            const index = mockStorage.findIndex(p => p.id === id);
            if (index !== -1) {
                mockStorage.splice(index, 1);
                return id;
            }
            return Promise.reject({ message: `Policy not found by id = ${id}` });
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
    fetchPolicies,
    fetchPolicy,
    createPolicy,
    updatePolicy,
    deletePolicy,
    setFilters,
    setPagination,
};

export default exportFunctions;