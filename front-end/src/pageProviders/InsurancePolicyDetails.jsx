
import React from 'react';
import InsurancePolicyDetailsPage from 'pages/insurancePolicyDetails';

import PageContainer from "./components/PageContainer";

const InsurancePolicyDetails = (props) => {
    return (
        <PageContainer>
            <InsurancePolicyDetailsPage {...props} />
        </PageContainer>
    );
};

export default InsurancePolicyDetails;