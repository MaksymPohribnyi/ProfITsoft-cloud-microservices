import useLocationSearch from "misc/hooks/useLocationSearch";
import IntlProvider from "misc/providers/IntlProvider";
import React, { useMemo } from "react";

import getMessages from './intl';
import InsurancePolicyDetails from "./containers/insurancePolicyDetails";

function Index(props) {
    const { lang } = useLocationSearch();
    const messages = useMemo(() => getMessages(lang), [lang]);

    return (
        <IntlProvider messages={messages}>
            <InsurancePolicyDetails {...props} />
        </IntlProvider>
    );
}

export default Index;