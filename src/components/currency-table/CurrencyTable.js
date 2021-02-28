import React from 'react';
import styled from 'styled-components';

import CurrencyRow from './CurrencyRow';
import { baseEndpointURL, apiKey } from './../../helpers';
import LoadingSpinner from '../UI/LoadingSpinner';

const CurrencyTableWrapper = styled.div`
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    `

const CurrencyTableMain = styled.table`
    width: 80%;
    max-width: 90rem;

    tr:nth-child(even) { background: #e3e3e3; }
    tr:nth-child(odd) { background: #fff; }
`;

const CurrencyTableHead = styled.th`
    text-align: center;
`

const CurrencyTable = (props) => {
    const isMountedRef = React.useRef(false);
    const [currencies, setCurrencies] = React.useState([]);
    const [loaded, setLoaded] = React.useState(false);

    // Helper function for fetching the data
    const fetchData = () => {
        const limit = 50;
        const endpointURL = `${baseEndpointURL}/listings/latest?limit=${limit}&CMC_PRO_API_KEY=${apiKey}`;

        fetch(endpointURL)
            .then(response => response.json())
            .then(result => {
                // Preventing the state setting if the component got unmounted in the meanwhile
                if (isMountedRef.current) {
                    const fetchedCurrencies = result.data;

                    setCurrencies(fetchedCurrencies);
                    setLoaded(true);
                }
            })
            .catch(err => {
                console.error(err);
            });
    }

    // Component did mount
    React.useEffect(() => {
        isMountedRef.current = true;

        fetchData();
        let fetchInterval = setInterval(() => {
            fetchData();
        }, 60000);

        return () => {
            isMountedRef.current = false;
            clearInterval(fetchInterval);
        }
    }, []);

    // Helper function for routing to Details page/component
    const navigateToDetails = (id) => {
        props.history.push(`/currency/${id}`);
    };

    return (
        <>
            <CurrencyTableWrapper>
                {loaded ?
                    <CurrencyTableMain>
                        <thead>
                            <tr>
                                <CurrencyTableHead>Name</CurrencyTableHead>
                                <CurrencyTableHead>Short Name</CurrencyTableHead>
                                <CurrencyTableHead>$ Value</CurrencyTableHead>
                                <CurrencyTableHead>Last 24h</CurrencyTableHead>
                                <CurrencyTableHead>Amount you own</CurrencyTableHead>
                                <CurrencyTableHead>$ value of your coin</CurrencyTableHead>
                            </tr>
                        </thead>
                        <tbody>
                            {currencies.map(currency => <CurrencyRow
                                currency={currency}
                                key={currency.id}
                                navigateToDetails={navigateToDetails} />)}
                        </tbody>
                    </CurrencyTableMain>
                    : <LoadingSpinner />
                }
            </CurrencyTableWrapper>
        </>
    );
}

export default CurrencyTable;
