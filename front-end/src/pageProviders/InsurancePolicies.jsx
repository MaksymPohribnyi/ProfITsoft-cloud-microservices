import React from 'react';
import InsurancePoliciesPage from 'pages/insurancePolicies';
import PageContainer from './components/PageContainer';

const InsurancePolicies = (props) => {
    return (
        <PageContainer>
            <InsurancePoliciesPage {...props} />
        </PageContainer>
    );
};

export default InsurancePolicies;