import React, { useEffect, useState } from 'react';
import { createUseStyles } from 'react-jss';
import { useIntl } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import FilterListIcon from '@mui/icons-material/FilterList';
import Button from 'components/Button';
import Card from 'components/Card';
import CardContent from 'components/CardContent';
import CardTitle from 'components/CardTitle';
import Dialog from 'components/Dialog';
import IconButton from 'components/IconButton';
import Loading from 'components/Loading';
import TextField from 'components/TextField';
import Typography from 'components/Typography';
import useTheme from 'misc/hooks/useTheme';
import useLocationSearch from 'misc/hooks/useLocationSearch';
import useChangePage from 'misc/hooks/useChangePage';
import actionsClient from 'app/actions/client';
import * as pages from 'constants/pages';
import pagesURLs from 'constants/pagesURLs';

const getClasses = createUseStyles((theme) => ({
    container: {
        display: 'flex',
        flexDirection: 'column',
        gap: `${theme.spacing(2)}px`,
        height: '100%',
        minHeight: 0,
    },
    headerActions: {
        display: 'flex',
        gap: `${theme.spacing(1)}px`,
    },
    filterDialog: {
        display: 'flex',
        flexDirection: 'column',
        gap: `${theme.spacing(2)}px`,
        padding: `${theme.spacing(2)}px`,
    },
    clientItem: {
        alignItems: 'center',
        borderBottom: `1px solid ${theme.colors.background.tertiary}`,
        cursor: 'pointer',
        display: 'flex',
        justifyContent: 'space-between',
        padding: `${theme.spacing(2)}px`,
        position: 'relative',
        '&:last-child': {
            borderBottom: 'none',
        },
    },
    clientInfo: {
        display: 'flex',
        flexDirection: 'column',
        gap: `${theme.spacing(0.5)}px`,
        flex: 1,
    },
    deleteButton: {
        opacity: 0,
        transition: 'opacity 0.2s',
        '$clientItem:hover &': {
            opacity: 1,
        },
    },
    pagination: {
        alignItems: 'center',
        display: 'flex',
        gap: `${theme.spacing(2)}px`,
        justifyContent: 'center',
        padding: `${theme.spacing(2)}px`,
    },
    notification: {
        bottom: `${theme.spacing(2)}px`,
        position: 'fixed',
        right: `${theme.spacing(2)}px`,
        zIndex: 1400,
    },
    dialogActions: {
        display: 'flex',
        gap: `${theme.spacing(1)}px`,
        justifyContent: 'flex-end',
        marginTop: `${theme.spacing(2)}px`,
    },
    card: {
        flex: 1,
        minHeight: 0,
        overflow: 'hidden',
    },
    cardContentScrollable: {
        flex: '1 1 0',
        overflowY: 'auto',
    },
}));

function ClientsList() {
    const { formatMessage } = useIntl();
    const { theme } = useTheme();
    const classes = getClasses({ theme });
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const locationSearch = useLocationSearch();
    const changePage = useChangePage();

    const { list, filters, pagination, isFetching, isDeleting } = useSelector(
        ({ client }) => client
    );

    const [state, setState] = useState({
        isFilterDialogOpen: false,
        isDeleteDialogOpen: false,
        clientToDelete: null,
        notification: null,
        localFilters: {
            firstName: filters.firstName || '',
            lastName: filters.lastName || '',
            email: filters.email || '',
        },
    });

    useEffect(() => {
        const urlFilters = {
            firstName: locationSearch.firstName || '',
            lastName: locationSearch.lastName || '',
            email: locationSearch.email || '',
        };
        const urlPage = parseInt(locationSearch.page) || 1;

        dispatch(actionsClient.setFilters(urlFilters));
        dispatch(actionsClient.setPagination({ page: urlPage }));
        dispatch(actionsClient.fetchClients(urlFilters, urlPage, pagination.pageSize));
    }, [locationSearch.firstName, locationSearch.lastName, locationSearch.email, locationSearch.page, pagination.pageSize, dispatch]);

    const showNotification = (message, variant = 'success') => {
        setState(prev => ({ ...prev, notification: { message, variant } }));
        setTimeout(() => {
            setState(prev => ({ ...prev, notification: null }));
        }, 3000);
    };

    const handleFilterApply = () => {
        const newLocationSearch = {
            ...locationSearch,
            firstName: state.localFilters.firstName,
            lastName: state.localFilters.lastName,
            email: state.localFilters.email,
            page: '1',
        };
        changePage({ locationSearch: newLocationSearch });
        setState(prev => ({ ...prev, isFilterDialogOpen: false }));
    };

    const handleFilterReset = () => {
        const newLocationSearch = {
            ...locationSearch,
            firstName: '',
            lastName: '',
            email: '',
            page: '1',
        };
        setState(prev => ({
            ...prev,
            localFilters: { firstName: '', lastName: '', email: '' },
        }));
        changePage({ locationSearch: newLocationSearch });
    };

    const handleDeleteConfirm = async () => {
        try {
            await dispatch(actionsClient.deleteClient(state.clientToDelete.id));
            showNotification(formatMessage({ id: 'message.deleteSuccess' }));
            setState(prev => ({ ...prev, isDeleteDialogOpen: false, clientToDelete: null }));
        } catch (error) {
            showNotification(formatMessage({ id: 'message.error' }), 'error');
        }
    };

    const handlePageChange = (newPage) => {
        const newLocationSearch = {
            ...locationSearch,
            page: String(newPage),
        };
        changePage({ locationSearch: newLocationSearch });
    };

    const handleClientClick = (clientId) => {
        navigate(`${pagesURLs[pages.clientsDetailsPage]}/${clientId}?${new URLSearchParams(locationSearch).toString()}`);
    };

    const handleAddClient = () => {
        navigate(`${pagesURLs[pages.clientsDetailsPage]}/new?${new URLSearchParams(locationSearch).toString()}`);
    };

    if (isFetching) {
        return <Loading />;
    }

    return (
        <div className={classes.container}>
            <Card className={classes.card} disablePaddings>
                <CardTitle>
                    <Typography variant="title">
                        <strong>{formatMessage({ id: 'title' })}</strong>
                    </Typography>
                    <div className={classes.headerActions}>
                        <IconButton onClick={() => setState(prev => ({ ...prev, isFilterDialogOpen: true }))}>
                            <FilterListIcon />
                        </IconButton>
                        <Button onClick={handleAddClient} variant="primary">
                            <AddIcon style={{ marginRight: '4px' }} />
                            <Typography color="inherit">
                                {formatMessage({ id: 'btn.add' })}
                            </Typography>
                        </Button>
                    </div>
                </CardTitle>
                <CardContent className={classes.cardContentScrollable}>
                    {list.length === 0 ? (
                        <Loading variant="noData">
                            <Typography color="secondary">No clients found</Typography>
                        </Loading>
                    ) : (
                        <>
                            {list.map((client) => (
                                <div
                                    key={client.id}
                                    className={classes.clientItem}
                                    onClick={() => handleClientClick(client.id)}
                                >
                                    <div className={classes.clientInfo}>
                                        <Typography variant="subtitle">
                                            <strong>{client.firstName} {client.lastName}</strong>
                                        </Typography>
                                        <Typography color="secondary">
                                            {client.email}
                                        </Typography>
                                    </div>
                                    <div className={classes.deleteButton}>
                                        <IconButton
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setState(prev => ({
                                                    ...prev,
                                                    isDeleteDialogOpen: true,
                                                    clientToDelete: client,
                                                }));
                                            }}
                                        >
                                            <DeleteIcon />
                                        </IconButton>
                                    </div>
                                </div>
                            ))}
                        </>
                    )}
                </CardContent>

                {pagination.totalPages > 1 && (
                    <div className={classes.pagination}>
                        <Button
                            disabled={pagination.page === 1}
                            onClick={() => handlePageChange(pagination.page - 1)}
                            variant="secondary"
                        >
                            Previous
                        </Button>
                        <Typography>
                            Page {pagination.page} of {pagination.totalPages}
                        </Typography>
                        <Button
                            disabled={pagination.page === pagination.totalPages}
                            onClick={() => handlePageChange(pagination.page + 1)}
                            variant="secondary"
                        >
                            Next
                        </Button>
                    </div>
                )}
            </Card>

            <Dialog
                open={state.isFilterDialogOpen}
                onClose={() => setState(prev => ({ ...prev, isFilterDialogOpen: false }))}
            >
                <Card>
                    <CardTitle>
                        <Typography variant="subtitle">
                            <strong>{formatMessage({ id: 'btn.filter' })}</strong>
                        </Typography>
                    </CardTitle>
                    <CardContent>
                        <div className={classes.filterDialog}>
                            <TextField
                                label={formatMessage({ id: 'filter.firstName' })}
                                value={state.localFilters.firstName}
                                onChange={(e) =>
                                    setState(prev => ({
                                        ...prev,
                                        localFilters: { ...prev.localFilters, firstName: e.target.value },
                                    }))
                                }
                            />
                            <TextField
                                label={formatMessage({ id: 'filter.lastName' })}
                                value={state.localFilters.lastName}
                                onChange={(e) =>
                                    setState(prev => ({
                                        ...prev,
                                        localFilters: { ...prev.localFilters, lastName: e.target.value },
                                    }))
                                }
                            />
                            <TextField
                                label={formatMessage({ id: 'filter.email' })}
                                value={state.localFilters.email}
                                onChange={(e) =>
                                    setState(prev => ({
                                        ...prev,
                                        localFilters: { ...prev.localFilters, email: e.target.value },
                                    }))
                                }
                            />
                            <div className={classes.dialogActions}>
                                <Button onClick={handleFilterReset} variant="secondary">
                                    {formatMessage({ id: 'filter.reset' })}
                                </Button>
                                <Button onClick={handleFilterApply} variant="primary">
                                    {formatMessage({ id: 'filter.apply' })}
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </Dialog>

            <Dialog
                open={state.isDeleteDialogOpen}
                onClose={() => setState(prev => ({ ...prev, isDeleteDialogOpen: false }))}
            >
                <Card>
                    <CardTitle>
                        <Typography variant="subtitle">
                            <strong>{formatMessage({ id: 'dialog.delete.title' })}</strong>
                        </Typography>
                    </CardTitle>
                    <CardContent>
                        <Typography>
                            {formatMessage(
                                { id: 'dialog.delete.message' },
                                { clientName: `${state.clientToDelete?.firstName} ${state.clientToDelete?.lastName}` }
                            )}
                        </Typography>
                        <div className={classes.dialogActions}>
                            <Button
                                onClick={() => setState(prev => ({ ...prev, isDeleteDialogOpen: false }))}
                                variant="secondary"
                            >
                                {formatMessage({ id: 'btn.cancel' })}
                            </Button>
                            <Button
                                onClick={handleDeleteConfirm}
                                isLoading={isDeleting}
                                variant="primary"
                            >
                                {formatMessage({ id: 'btn.delete' })}
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </Dialog>

            {state.notification && (
                <div className={classes.notification}>
                    <Card variant={state.notification.variant}>
                        <CardContent>
                            <Typography color={state.notification.variant}>
                                {state.notification.message}
                            </Typography>
                        </CardContent>
                    </Card>
                </div>
            )}
        </div>
    );
}

export default ClientsList;