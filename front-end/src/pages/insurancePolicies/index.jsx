import React, { useMemo } from 'react';
import IntlProvider from 'misc/providers/IntlProvider';
import useLocationSearch from 'misc/hooks/useLocationSearch';

import getMessages from './intl';
import InsurancePoliciesList from './containers/InsurancePoliciesList';

function Index(props) {
    const { lang } = useLocationSearch();
    const messages = useMemo(() => getMessages(lang), [lang]);

    return (
        <IntlProvider messages={messages}>
            <InsurancePoliciesList {...props} />
        </IntlProvider>
    );
}

export default Index;