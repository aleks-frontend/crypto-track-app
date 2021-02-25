import React, { Component } from 'react';
import styled from 'styled-components';

import AmountUpdateForm from './AmountUpdateForm';
import { fontSizes } from '../../helpers';

const CurrencyRowCell = styled.td`
    font-size: ${fontSizes.regular};
    font-weight: ${props => props.bold ? '700' : '400'};
    color: ${props =>
        props.colorType ?
            (props.colorType === 'primary' ? 'green' : 'red') : 'inherit'};
    cursor: ${props => props.pointerCursor ? 'pointer' : 'auto'};
    text-align: center;
    border: 1px solid #fff;
`;

class CurrencyRow extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userCoinAmount: '',
            userCoinValue: ''
        };
        this.handleAmountChange = this.handleAmountChange.bind(this);
        this.handleAmountSubmit = this.handleAmountSubmit.bind(this);
        this.getUserCoinValue = this.getUserCoinValue.bind(this);
    }

    componentDidMount() {
        const localStorageRef = Number(localStorage.getItem(this.props.currency.symbol));

        if (localStorageRef !== 0) {
            this.setState({
                userCoinAmount: localStorageRef,
                userCoinValue: this.getUserCoinValue(localStorageRef)
            });
        } else if (localStorageRef === 0) {
            localStorage.removeItem(this.props.currency.symbol);
        }
    }

    componentDidUpdate() {
        // After each state update, we check if the userCoinAmount was updated 
        // and if so we store the new value to localStorage
        if (this.state.userCoinAmount !== '') {
            localStorage.setItem(this.props.currency.symbol, this.state.userCoinAmount);
        }
    }

    // Helper method for getting the user's coin value
    // It will be a product of the current coin amount and the current coin price
    getUserCoinValue(amount) {
        return (amount * this.props.currency.quote.USD.price).toFixed(2);
    }

    handleAmountChange(e) {
        this.setState({ userCoinAmount: e.target.value });
    }

    handleAmountSubmit(e) {
        this.setState({
            userCoinValue: Number(this.getUserCoinValue(this.state.userCoinAmount)) || ''
        });

        if (Number(this.state.userCoinAmount) === 0) {
            this.setState({ userCoinAmount: '' });
        }

        e.preventDefault();
    }

    render() {
        const { currency } = this.props;
        const { name, symbol } = currency;
        const { price, percent_change_24h: percentChange24h } = currency.quote.USD;

        return (
            <tr>
                <CurrencyRowCell 
                    pointerCursor={true} 
                    bold={true}
                    onClick={() => this.props.navigateToDetails(this.props.currency.id)}>
                    {name}
                </CurrencyRowCell>
                <CurrencyRowCell>{symbol}</CurrencyRowCell>
                <CurrencyRowCell>$ {price.toFixed(2)}</CurrencyRowCell>
                <CurrencyRowCell
                    colorType={percentChange24h.toFixed(2) > 0 ? 'primary' : 'secondary'}>
                    {percentChange24h.toFixed(2)} %
                </CurrencyRowCell>
                <CurrencyRowCell>
                    <AmountUpdateForm
                        handleFormSubmit={this.handleAmountSubmit}
                        inputValue={this.state.userCoinAmount}
                        handleInputChange={this.handleAmountChange} />
                </CurrencyRowCell>
                <CurrencyRowCell>$ {this.state.userCoinValue}</CurrencyRowCell>
            </tr>
        );
    }
}

export default CurrencyRow;
