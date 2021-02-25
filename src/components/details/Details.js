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

class Details extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            name: '',
            cmcRank: '',
            symbol: '',
            price: '',
            totalSupply: '',
            loaded: false
        };

        this.fetchInterval = null;

        this.navigateToHome = this.navigateToHome.bind(this);
        this.fetchData = this.fetchData.bind(this);
    }

    fetchData() {
        const { currencyId } = this.props.match.params;
        const endpointURL = `${baseEndpointURL}/quotes/latest?id=${currencyId}&CMC_PRO_API_KEY=${apiKey}`;

        fetch(endpointURL)
            .then(response => response.json())
            .then(result => {
                const currencyDetails = result.data[currencyId];
                const { name, cmc_rank: cmcRank, symbol, total_supply: totalSupply } = currencyDetails;
                const { price } = currencyDetails.quote.USD;

                this.setState({
                    name,
                    cmcRank,
                    symbol,
                    price,
                    totalSupply,
                    loaded: true
                });
            })
            .catch(err => {
                console.error(err);
            });
    }

    componentDidMount() {
        this.fetchData();
        // this.fetchInterval = setInterval(() => {
        //     this.fetchData();
        // }, 60000)
    }

    componentWillUnmount() {
        clearInterval(this.fetchInterval);
    }

    navigateToHome() {
        this.props.history.push(`/`);
    }

    render(props) {
        const { name, cmcRank, symbol, price, totalSupply } = this.state;

        return (
            <>
                <DetailsMain>
                    {this.state.loaded ?
                        <>
                            <DetailsHeading>{name}</DetailsHeading>
                            <DetailsItem><strong>Symbol:</strong> {symbol}</DetailsItem>
                            <DetailsItem><strong>CMC Rank:</strong> {cmcRank}</DetailsItem>
                            <DetailsItem><strong>Current Price:</strong> ${price.toFixed(2)}</DetailsItem>
                            <DetailsItem><strong>Total Supply:</strong> ${totalSupply}</DetailsItem>
                            <GenericButton onClick={this.navigateToHome}>Back to Homepage</GenericButton>
                        </>
                        : <LoadingSpinner />
                    }
                </DetailsMain>
            </>
        )
    }
}

export default Details;
