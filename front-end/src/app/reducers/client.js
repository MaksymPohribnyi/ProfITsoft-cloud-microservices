import {
    REQUEST_CLIENTS,
    RECEIVE_CLIENTS,
    ERROR_CLIENTS,
    REQUEST_CLIENT,
    RECEIVE_CLIENT,
    ERROR_CLIENT,
    REQUEST_CREATE_CLIENT,
    SUCCESS_CREATE_CLIENT,
    ERROR_CREATE_CLIENT,
    REQUEST_UPDATE_CLIENT,
    SUCCESS_UPDATE_CLIENT,
    ERROR_UPDATE_CLIENT,
    REQUEST_DELETE_CLIENT,
    SUCCESS_DELETE_CLIENT,
    ERROR_DELETE_CLIENT,
    SET_CLIENTS_FILTERS,
    SET_CLIENTS_PAGINATION,
} from '../constants/actionTypes';

const initialState = {
    list: [],
    currentClient: null,
    filters: {
        firstName: '',
        lastName: '',
        email: '',
    },
    pagination: {
        page: 1,
        pageSize: 10,
        total: 0,
        totalPages: 0,
    },
    isFetching: false,
    isFetchingClient: false,
    isCreating: false,
    isUpdating: false,
    isDeleting: false,
    error: null,
};

export default function Reducer(state = initialState, action) {
    switch (action.type) {
        case REQUEST_CLIENTS:
            return {
                ...state,
                isFetching: true,
                error: null,
            };

        case RECEIVE_CLIENTS:
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

        case ERROR_CLIENTS:
            return {
                ...state,
                isFetching: false,
                error: action.payload,
            };

        case REQUEST_CLIENT:
            return {
                ...state,
                isFetchingClient: true,
                error: null,
            };

        case RECEIVE_CLIENT:
            return {
                ...state,
                currentClient: action.payload,
                isFetchingClient: false,
            };

        case ERROR_CLIENT:
            return {
                ...state,
                isFetchingClient: false,
                error: action.payload,
            };

        case REQUEST_CREATE_CLIENT:
            return {
                ...state,
                isCreating: true,
                error: null,
            };

        case SUCCESS_CREATE_CLIENT:
            return {
                ...state,
                isCreating: false,
            };

        case ERROR_CREATE_CLIENT:
            return {
                ...state,
                isCreating: false,
                error: action.payload,
            };

        case REQUEST_UPDATE_CLIENT:
            return {
                ...state,
                isUpdating: true,
                error: null,
            };

        case SUCCESS_UPDATE_CLIENT:
            return {
                ...state,
                currentClient: action.payload,
                isUpdating: false,
            };

        case ERROR_UPDATE_CLIENT:
            return {
                ...state,
                isUpdating: false,
                error: action.payload,
            };

        case REQUEST_DELETE_CLIENT:
            return {
                ...state,
                isDeleting: true,
                error: null,
            };

        case SUCCESS_DELETE_CLIENT:
            return {
                ...state,
                list: state.list.filter(c => c.id !== action.payload),
                isDeleting: false,
            };

        case ERROR_DELETE_CLIENT:
            return {
                ...state,
                isDeleting: false,
                error: action.payload,
            };

        case SET_CLIENTS_FILTERS:
            return {
                ...state,
                filters: action.payload,
            };

        case SET_CLIENTS_PAGINATION:
            return {
                ...state,
                pagination: {
                    ...state.pagination,
                    ...action.payload,
                },
            };

        default:
            return state;
    }
}