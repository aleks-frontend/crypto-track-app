import React, { Component } from 'react';
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

class CurrencyTable extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currencies: [],
            loaded: false
        }

        this.navigateToDetails = this.navigateToDetails.bind(this);
        this.fetchData = this.fetchData.bind(this);
        this.fetchInterval = null;
    }

    fetchData() {
        const limit = 50;
        const endpointURL = `${baseEndpointURL}/listings/latest?limit=${limit}&CMC_PRO_API_KEY=${apiKey}`;

        fetch(endpointURL)
            .then(response => response.json())
            .then(result => {
                const currencies = result.data;

                this.setState({
                    currencies,
                    loaded: true
                });
            })
            .catch(err => {
                console.error(err);
            });
    }

    componentDidMount() {
        this.fetchData();
        this.fetchInterval = setInterval(() => {
            this.fetchData();
        }, 60000);
    }

    componentWillUnmount() {
        clearInterval(this.fetchData);
    }

    navigateToDetails(id) {
        this.props.history.push(`/currency/${id}`);
    }

    render() {
        return (
            <>
                <CurrencyTableWrapper>
                    {this.state.loaded ?
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
                                {this.state.currencies.map(currency => <CurrencyRow
                                    currency={currency}
                                    key={currency.id}
                                    navigateToDetails={this.navigateToDetails} />)}
                            </tbody>
                        </CurrencyTableMain>
                        : <LoadingSpinner />
                    }
                </CurrencyTableWrapper>
            </>
        );
    }
}

export default CurrencyTable;
