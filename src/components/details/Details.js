import React from 'react';
import styled from 'styled-components';

import GenericButton from '../styled/GenericButton';
import { cssSnippets, fontSizes, baseEndpointURL, apiKey } from '../../helpers';
import LoadingSpinner from '../UI/LoadingSpinner';

const DetailsMain = styled.div`
    ${cssSnippets.flexColumnCenter}
    min-height: 100vh;
`;

const DetailsHeading = styled.h1`
    margin: 1rem 0;
`;

const DetailsItem = styled.div`
    margin: 0.2em 0;
    font-size: ${fontSizes.regular};
`;

const Details = props => {
    const isMountedRef = React.useRef(false);
    const [currencyData, setCurrencyData] = React.useState({
        name: '',
        cmcRank: '',
        symbol: '',
        price: '',
        totalSupply: ''
    });
    const [loaded, setLoaded] = React.useState(false);

    // Helper function for routing back to homepage
    const navigateToHome = () => {
        props.history.push(`/`);
    };

    // Helper function for fetching the data
    const fetchData = () => {
        const { currencyId } = props.match.params;
        const endpointURL = `${baseEndpointURL}/quotes/latest?id=${currencyId}&CMC_PRO_API_KEY=${apiKey}`;

        fetch(endpointURL)
            .then(response => response.json())
            .then(result => {
                // Checking if the component got unmounted while the data was being fetched
                if (isMountedRef.current) {
                    const currencyDetails = result.data[currencyId];
                    const { name, cmc_rank: cmcRank, symbol, total_supply: totalSupply } = currencyDetails;
                    const { price } = currencyDetails.quote.USD;

                    // Setting the fetched data to 'currencyData' state
                    setCurrencyData(prevData => ({
                        ...prevData,
                        name,
                        cmcRank,
                        symbol,
                        price,
                        totalSupply
                    }));

                    // Setting the 'loaded' state to 'true' after the data is fetched
                    setLoaded(true);
                }
            })
            .catch(err => {
                console.error(err);
            });
    };

    React.useEffect(() => {
        isMountedRef.current = true;
        fetchData();

        // Fetching the data every 60 seconds
        let fetchInterval = setInterval(() => {
            fetchData();
        }, 60000);

        // Clearing the interval to prevent the momory leak once the component was unmounted
        return () => {
            isMountedRef.current = false;
            clearInterval(fetchInterval);
        };
    }, []);

    // Using destructuring to get all the values from the currency data
    const { name, cmcRank, symbol, price, totalSupply } = currencyData;

    return (
        <>
            <DetailsMain>
                {loaded ?
                    <>
                        <DetailsHeading>{name}</DetailsHeading>
                        <DetailsItem><strong>Symbol:</strong> {symbol}</DetailsItem>
                        <DetailsItem><strong>CMC Rank:</strong> {cmcRank}</DetailsItem>
                        <DetailsItem><strong>Current Price:</strong> ${price.toFixed(2)}</DetailsItem>
                        <DetailsItem><strong>Total Supply:</strong> ${totalSupply}</DetailsItem>
                        <GenericButton onClick={navigateToHome}>Back to Homepage</GenericButton>
                    </>
                    : <LoadingSpinner />
                }
            </DetailsMain>
        </>
    )
};

export default Details;
