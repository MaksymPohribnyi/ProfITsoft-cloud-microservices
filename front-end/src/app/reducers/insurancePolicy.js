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
} from '../constants/actionTypes';

const initialState = {
    list: [],
    currentPolicy: null,
    filters: {
        policyType: '',
        startDate: '',
        endDate: '',
    },
    pagination: {
        page: 1,
        pageSize: 10,
        total: 0,
        totalPages: 0,
    },
    isFetching: false,
    isFetchingPolicy: false,
    isCreating: false,
    isUpdating: false,
    isDeleting: false,
    error: null,
};

export default function Reducer(state = initialState, action) {
    switch (action.type) {
        case REQUEST_INSURANCE_POLICIES:
            console.log('Reducer called with action:', action.type, action.payload);
            return {
                ...state,
                isFetching: true,
                error: null,
            };
        case RECEIVE_INSURANCE_POLICIES:
            console.log('RECEIVE_INSURANCE_POLICIES with data:', action.payload);
            return {
                ...state,
                list: action.payload.data,
                pagination: {
                    page: action.payload.page,
                    pageSize: action.payload.pageSize,
                    total: action.payload.total,
                    totalPages: action.payload.totalPages,
                },
                isFetching: false,
            };

        case ERROR_INSURANCE_POLICIES:
            return {
                ...state,
                isFetching: false,
                error: action.payload,
            };

        case REQUEST_INSURANCE_POLICY:
            return {
                ...state,
                isFetchingPolicy: true,
                error: null,
            };

        case RECEIVE_INSURANCE_POLICY:
            return {
                ...state,
                currentPolicy: action.payload,
                isFetchingPolicy: false,
            };

        case ERROR_INSURANCE_POLICY:
            return {
                ...state,
                isFetchingPolicy: false,
                error: action.payload,
            };

        case REQUEST_CREATE_INSURANCE_POLICY:
            return {
                ...state,
                isCreating: true,
                error: null,
            };

        case SUCCESS_CREATE_INSURANCE_POLICY:
            return {
                ...state,
                isCreating: false,
            };

        case ERROR_CREATE_INSURANCE_POLICY:
            return {
                ...state,
                isCreating: false,
                error: action.payload,
            };

        case REQUEST_UPDATE_INSURANCE_POLICY:
            return {
                ...state,
                isUpdating: true,
                error: null,
            };

        case SUCCESS_UPDATE_INSURANCE_POLICY:
            return {
                ...state,
                currentPolicy: action.payload,
                isUpdating: false,
            };

        case ERROR_UPDATE_INSURANCE_POLICY:
            return {
                ...state,
                isUpdating: false,
                error: action.payload,
            };

        case REQUEST_DELETE_INSURANCE_POLICY:
            return {
                ...state,
                isDeleting: true,
                error: null,
            };

        case SUCCESS_DELETE_INSURANCE_POLICY:
            return {
                ...state,
                list: state.list.filter(p => p.id !== action.payload),
                isDeleting: false,
            };

        case ERROR_DELETE_INSURANCE_POLICY:
            return {
                ...state,
                isDeleting: false,
                error: action.payload,
            };

        case SET_INSURANCE_POLICIES_FILTERS:
            return {
                ...state,
                filters: action.payload,
            };

        case SET_INSURANCE_POLICIES_PAGINATION:
            return {
                ...state,
                pagination: {
                    ...state.pagination,
                    ...action.payload,
                },
            };

        default: return state;
    }
}