import React, { useEffect, useState } from 'react';
import { createUseStyles } from 'react-jss';
import { useIntl } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EditIcon from '@mui/icons-material/Edit';
import Button from 'components/Button';
import Card from 'components/Card';
import CardActions from 'components/CardActions';
import CardContent from 'components/CardContent';
import CardTitle from 'components/CardTitle';
import IconButton from 'components/IconButton';
import Loading from 'components/Loading';
import TextField from 'components/TextField';
import Typography from 'components/Typography';
import useTheme from 'misc/hooks/useTheme';
import useLocationSearch from 'misc/hooks/useLocationSearch';
import actionsClient from 'app/actions/client';
import * as pages from 'constants/pages';
import pagesURLs from 'constants/pagesURLs';

const getClasses = createUseStyles((theme) => ({
    container: {
        display: 'flex',
        flexDirection: 'column',
        gap: `${theme.spacing(2)}px`,
    },
    header: {
        alignItems: 'center',
        display: 'flex',
        gap: `${theme.spacing(1)}px`,
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        gap: `${theme.spacing(2)}px`,
    },
    fieldGroup: {
        display: 'flex',
        flexDirection: 'column',
        gap: `${theme.spacing(0.5)}px`,
    },
    notification: {
        bottom: `${theme.spacing(2)}px`,
        position: 'fixed',
        right: `${theme.spacing(2)}px`,
        zIndex: 1400,
    },
}));

const isValidEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
};

function ClientDetails() {
    const { formatMessage } = useIntl();
    const { theme } = useTheme();
    const classes = getClasses({ theme });
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { id } = useParams();
    const locationSearch = useLocationSearch();

    const isNewClient = id === 'new';

    const { currentClient, isFetchingClient, isCreating, isUpdating } = useSelector(
        ({ client }) => client
    );

    const [state, setState] = useState({
        isEditMode: isNewClient,
        notification: null,
        formData: {
            firstName: '',
            lastName: '',
            email: '',
        },
        originalData: null,
        validationErrors: {},
    });

    useEffect(() => {
        if (!isNewClient) {
            dispatch(actionsClient.fetchClient(id));
        }
    }, [id, isNewClient, dispatch]);

    useEffect(() => {
        if (currentClient && !isNewClient) {
            const data = {
                firstName: currentClient.firstName || '',
                lastName: currentClient.lastName || '',
                email: currentClient.email || '',
            };
            setState(prev => ({
                ...prev,
                formData: data,
                originalData: data,
            }));
        }
    }, [currentClient, isNewClient]);

    const showNotification = (message, variant = 'success') => {
        setState(prev => ({ ...prev, notification: { message, variant } }));
        setTimeout(() => {
            setState(prev => ({ ...prev, notification: null }));
        }, 3000);
    };

    const validateForm = () => {
        const errors = {};

        if (!state.formData.firstName.trim()) {
            errors.firstName = formatMessage({ id: 'validation.required' });
        } else if (state.formData.firstName.length > 100) {
            errors.firstName = formatMessage({ id: 'validation.maxLength' }, { max: 100 });
        }

        if (!state.formData.lastName.trim()) {
            errors.lastName = formatMessage({ id: 'validation.required' });
        } else if (state.formData.lastName.length > 100) {
            errors.lastName = formatMessage({ id: 'validation.maxLength' }, { max: 100 });
        }

        if (!state.formData.email.trim()) {
            errors.email = formatMessage({ id: 'validation.required' });
        } else if (!isValidEmail(state.formData.email)) {
            errors.email = formatMessage({ id: 'validation.invalidEmail' });
        } else if (state.formData.email.length > 100) {
            errors.email = formatMessage({ id: 'validation.maxLength' }, { max: 100 });
        }

        setState(prev => ({ ...prev, validationErrors: errors }));
        return Object.keys(errors).length === 0;
    };

    const handleSave = async () => {
        if (!validateForm()) {
            return;
        }

        try {
            if (isNewClient) {
                await dispatch(actionsClient.createClient(state.formData));
                showNotification(formatMessage({ id: 'message.createSuccess' }));
                handleBack();
            } else {
                await dispatch(actionsClient.updateClient(id, state.formData));
                showNotification(formatMessage({ id: 'message.updateSuccess' }));
                setState(prev => ({
                    ...prev,
                    isEditMode: false,
                    originalData: state.formData,
                }));
            }
        } catch (error) {
            showNotification(formatMessage({ id: 'message.error' }), 'error');
        }
    };

    const handleCancel = () => {
        if (isNewClient) {
            handleBack();
        } else {
            setState(prev => ({
                ...prev,
                isEditMode: false,
                formData: prev.originalData,
                validationErrors: {},
            }));
        }
    };

    const handleBack = () => {
        const params = new URLSearchParams(locationSearch);
        params.delete('id');
        navigate(`${pagesURLs[pages.clientPage]}?${params.toString()}`);
    };

    const handleFieldChange = (field, value) => {
        setState(prev => ({
            ...prev,
            formData: { ...prev.formData, [field]: value },
            validationErrors: { ...prev.validationErrors, [field]: undefined },
        }));
    };

    if (isFetchingClient) {
        return <Loading />;
    }

    return (
        <div className={classes.container}>
            <Card>
                <CardTitle>
                    <div className={classes.header}>
                        <IconButton onClick={handleBack}>
                            <ArrowBackIcon />
                        </IconButton>
                        <Typography variant="title">
                            <strong>
                                {isNewClient
                                    ? formatMessage({ id: 'btn.create' })
                                    : `${currentClient?.firstName} ${currentClient?.lastName}` || ''}
                            </strong>
                        </Typography>
                    </div>
                    {!state.isEditMode && !isNewClient && (
                        <IconButton onClick={() => setState(prev => ({ ...prev, isEditMode: true }))}>
                            <EditIcon />
                        </IconButton>
                    )}
                </CardTitle>
                <CardContent>
                    <div className={classes.form}>
                        {state.isEditMode ? (
                            <>
                                <TextField
                                    label={formatMessage({ id: 'field.firstName' })}
                                    value={state.formData.firstName}
                                    onChange={(e) => handleFieldChange('firstName', e.target.value)}
                                    isError={!!state.validationErrors.firstName}
                                    helperText={state.validationErrors.firstName}
                                    required
                                />
                                <TextField
                                    label={formatMessage({ id: 'field.lastName' })}
                                    value={state.formData.lastName}
                                    onChange={(e) => handleFieldChange('lastName', e.target.value)}
                                    isError={!!state.validationErrors.lastName}
                                    helperText={state.validationErrors.lastName}
                                    required
                                />
                                <TextField
                                    label={formatMessage({ id: 'field.email' })}
                                    value={state.formData.email}
                                    onChange={(e) => handleFieldChange('email', e.target.value)}
                                    isError={!!state.validationErrors.email}
                                    helperText={state.validationErrors.email}
                                    required
                                />
                            </>
                        ) : (
                            <>
                                <div className={classes.fieldGroup}>
                                    <Typography color="secondary">
                                        {formatMessage({ id: 'field.firstName' })}
                                    </Typography>
                                    <Typography>
                                        <strong>{currentClient?.firstName}</strong>
                                    </Typography>
                                </div>
                                <div className={classes.fieldGroup}>
                                    <Typography color="secondary">
                                        {formatMessage({ id: 'field.lastName' })}
                                    </Typography>
                                    <Typography>
                                        <strong>{currentClient?.lastName}</strong>
                                    </Typography>
                                </div>
                                <div className={classes.fieldGroup}>
                                    <Typography color="secondary">
                                        {formatMessage({ id: 'field.email' })}
                                    </Typography>
                                    <Typography>{currentClient?.email}</Typography>
                                </div>
                            </>
                        )}
                    </div>
                </CardContent>
                {state.isEditMode && (
                    <CardActions>
                        <Button onClick={handleCancel} variant="secondary">
                            {formatMessage({ id: 'btn.cancel' })}
                        </Button>
                        <Button
                            onClick={handleSave}
                            isLoading={isCreating || isUpdating}
                            variant="primary"
                        >
                            <Typography color="inherit">
                                <strong>
                                    {isNewClient ? formatMessage({ id: 'btn.create' }) : formatMessage({ id: 'btn.save' })}
                                </strong>
                            </Typography>
                        </Button>
                    </CardActions>
                )}
            </Card>

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

export default ClientDetails;