import React from 'react';
import ClientDetailsPage from 'pages/clientDetails';
import PageContainer from './components/PageContainer';

const ClientDetails = (props) => {
    return (
        <PageContainer>
            <ClientDetailsPage {...props} />
        </PageContainer>
    );
};

export default ClientDetails;