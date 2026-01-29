import React from 'react';
import ClientsPage from 'pages/clients';
import PageContainer from './components/PageContainer';

const Clients = (props) => {
    return (
        <PageContainer>
            <ClientsPage {...props} />
        </PageContainer>
    );
};

export default Clients;