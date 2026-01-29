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
import Select from 'components/Select';
import MenuItem from 'components/MenuItem';
import TextField from 'components/TextField';
import Typography from 'components/Typography';
import useTheme from 'misc/hooks/useTheme';
import useLocationSearch from 'misc/hooks/useLocationSearch';
import actionsInsurance from 'app/actions/insurancePolicy';
import * as pages from 'constants/pages';
import pagesURLs from 'constants/pagesURLs';
import { POLICY_TYPES, RISK_OPTIONS } from 'app/mocks/insurancePolicies';

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

function InsurancePolicyDetails() {
    const { formatMessage } = useIntl();
    const { theme } = useTheme();
    const classes = getClasses({ theme });
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { id } = useParams();
    const locationSearch = useLocationSearch();

    const isNewPolicy = id === 'new';

    const { currentPolicy, isFetchingPolicy, isCreating, isUpdating } = useSelector(
        ({ insurancePolicy }) => insurancePolicy
    );

    const [state, setState] = useState({
        isEditMode: isNewPolicy,
        notification: null,
        formData: {
            policyNumber: '',
            policyType: '',
            startDate: '',
            endDate: '',
            coveredRisks: [],
        },
        originalData: null,
        validationErrors: {},
    });

    useEffect(() => {
        if (!isNewPolicy) {
            dispatch(actionsInsurance.fetchPolicy(id));
        }
    }, [id, isNewPolicy, dispatch]);

    useEffect(() => {
        if (currentPolicy && !isNewPolicy) {
            const data = {
                policyNumber: currentPolicy.policyNumber || '',
                policyType: currentPolicy.policyType || '',
                startDate: currentPolicy.startDate || '',
                endDate: currentPolicy.endDate || '',
                coveredRisks: currentPolicy.coveredRisks || [],
            };
            setState(prev => ({
                ...prev,
                formData: data,
                originalData: data,
            }));
        }
    }, [currentPolicy, isNewPolicy]);

    const showNotification = (message, variant = 'success') => {
        setState(prev => ({ ...prev, notification: { message, variant } }));
        setTimeout(() => {
            setState(prev => ({ ...prev, notification: null }));
        }, 3000);
    };

    const validateForm = () => {
        const errors = {};

        if (!state.formData.policyNumber.trim()) {
            errors.policyNumber = formatMessage({ id: 'validation.required' });
        } else if (state.formData.policyNumber.length > 100) {
            errors.policyNumber = formatMessage({ id: 'validation.maxLength' }, { max: 100 });
        }

        if (!state.formData.policyType) {
            errors.policyType = formatMessage({ id: 'validation.required' });
        }

        if (!state.formData.startDate) {
            errors.startDate = formatMessage({ id: 'validation.required' });
        }

        if (!state.formData.endDate) {
            errors.endDate = formatMessage({ id: 'validation.required' });
        }

        if (state.formData.startDate && state.formData.endDate) {
            if (new Date(state.formData.endDate) <= new Date(state.formData.startDate)) {
                errors.endDate = formatMessage({ id: 'validation.dateRange' });
            }
        }

        setState(prev => ({ ...prev, validationErrors: errors }));
        return Object.keys(errors).length === 0;
    };

    const handleSave = async () => {
        if (!validateForm()) {
            return;
        }

        try {
            if (isNewPolicy) {
                await dispatch(actionsInsurance.createPolicy(state.formData));
                showNotification(formatMessage({ id: 'message.createSuccess' }));
                handleBack();
            } else {
                await dispatch(actionsInsurance.updatePolicy(id, state.formData));
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
        if (isNewPolicy) {
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
        navigate(`${pagesURLs[pages.insurancePage]}?${params.toString()}`);
    };

    const handleFieldChange = (field, value) => {
        setState(prev => ({
            ...prev,
            formData: { ...prev.formData, [field]: value },
            validationErrors: { ...prev.validationErrors, [field]: undefined },
        }));
    };

    if (isFetchingPolicy) {
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
                                {isNewPolicy
                                    ? formatMessage({ id: 'btn.create' })
                                    : currentPolicy?.policyNumber || ''}
                            </strong>
                        </Typography>
                    </div>
                    {!state.isEditMode && !isNewPolicy && (
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
                                    label={formatMessage({ id: 'field.policyNumber' })}
                                    value={state.formData.policyNumber}
                                    onChange={(e) => handleFieldChange('policyNumber', e.target.value)}
                                    isError={!!state.validationErrors.policyNumber}
                                    helperText={state.validationErrors.policyNumber}
                                    required
                                />
                                <div className={classes.fieldGroup}>
                                    <Typography color="secondary">
                                        {formatMessage({ id: 'field.policyType' })} *
                                    </Typography>
                                    <Select
                                        value={state.formData.policyType}
                                        onChange={(e) => handleFieldChange('policyType', e.target.value)}
                                        fullWidth
                                    >
                                        {POLICY_TYPES.map((type) => (
                                            <MenuItem key={type} value={type}>
                                                <Typography>{formatMessage({ id: `policyType.${type}` })}</Typography>
                                            </MenuItem>
                                        ))}
                                    </Select>
                                    {state.validationErrors.policyType && (
                                        <Typography color="error">{state.validationErrors.policyType}</Typography>
                                    )}
                                </div>
                                <TextField
                                    inputType="date"
                                    label={`${formatMessage({ id: 'field.startDate' })} *`}
                                    value={state.formData.startDate}
                                    onChange={(e) => handleFieldChange('startDate', e.target.value)}
                                    isError={!!state.validationErrors.startDate}
                                    helperText={state.validationErrors.startDate}
                                    fullWidth
                                    required
                                    InputLabelProps={{ shrink: true }}
                                />
                                <TextField
                                    inputType="date"
                                    label={`${formatMessage({ id: 'field.endDate' })} *`}
                                    value={state.formData.endDate}
                                    onChange={(e) => handleFieldChange('endDate', e.target.value)}
                                    isError={!!state.validationErrors.endDate}
                                    helperText={state.validationErrors.endDate}
                                    required
                                    InputLabelProps={{ shrink: true }}
                                />
                                <div className={classes.fieldGroup}>
                                    <Typography color="secondary">
                                        {formatMessage({ id: 'field.coveredRisks' })}
                                    </Typography>
                                    <Select
                                        multiple
                                        value={state.formData.coveredRisks}
                                        onChange={(e) => handleFieldChange('coveredRisks', e.target.value)}
                                        renderValue={(selected) =>
                                            selected
                                                .map(risk => formatMessage({ id: `risk.${risk}` }))
                                                .join(', ')
                                        }
                                        fullWidth
                                    >
                                        {RISK_OPTIONS.map((risk) => (
                                            <MenuItem key={risk} value={risk}>
                                                <Typography>{formatMessage({ id: `risk.${risk}` })}</Typography>
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </div>
                            </>
                        ) : (
                            <>
                                <div className={classes.fieldGroup}>
                                    <Typography color="secondary">
                                        {formatMessage({ id: 'field.policyNumber' })}
                                    </Typography>
                                    <Typography>
                                        <strong>{currentPolicy?.policyNumber}</strong>
                                    </Typography>
                                </div>
                                <div className={classes.fieldGroup}>
                                    <Typography color="secondary">
                                        {formatMessage({ id: 'field.policyType' })}
                                    </Typography>
                                    <Typography>
                                        {formatMessage({ id: `policyType.${currentPolicy?.policyType}` })}
                                    </Typography>
                                </div>
                                <div className={classes.fieldGroup}>
                                    <Typography color="secondary">
                                        {formatMessage({ id: 'field.startDate' })}
                                    </Typography>
                                    <Typography>{currentPolicy?.startDate}</Typography>
                                </div>
                                <div className={classes.fieldGroup}>
                                    <Typography color="secondary">
                                        {formatMessage({ id: 'field.endDate' })}
                                    </Typography>
                                    <Typography>{currentPolicy?.endDate}</Typography>
                                </div>
                                <div className={classes.fieldGroup}>
                                    <Typography color="secondary">
                                        {formatMessage({ id: 'field.coveredRisks' })}
                                    </Typography>
                                    <Typography>
                                        {currentPolicy?.coveredRisks?.map((risk) => formatMessage({ id: `risk.${risk}` })).join(', ')}
                                    </Typography>
                                </div>
                                <div className={classes.fieldGroup}>
                                    <Typography color="secondary">
                                        {formatMessage({ id: 'field.client' })}
                                    </Typography>
                                    <Typography>
                                        {currentPolicy?.client?.firstName} {currentPolicy?.client?.lastName} ({currentPolicy?.client?.email})
                                    </Typography>
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
                                    {isNewPolicy ? formatMessage({ id: 'btn.create' }) : formatMessage({ id: 'btn.save' })}
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

export default InsurancePolicyDetails;