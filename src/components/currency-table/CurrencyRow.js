import React from 'react';
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

const CurrencyRow = (props) => {
    const [userCoinData, setUserCoinData] = React.useState({
        amount: '',
        value: ''
    });

    const [invalidCoinAmount, setInvalidCoinAmount] = React.useState(false);

    // Component did mount
    React.useEffect(() => {
        const localStorageRef = Number(localStorage.getItem(props.currency.symbol));

        if (localStorageRef !== 0) {
            setUserCoinData({
                amount: localStorageRef,
                value: getUserCoinValue(localStorageRef)
            });
        } else if (localStorageRef === 0) {
            localStorage.removeItem(props.currency.symbol);
        }
    }, []);

    // Component did update
    React.useEffect(() => {
        // After each state update, we check if the userCoinAmount was updated 
        // and if so we store the new value to localStorage
        if (Number(userCoinData.amount) >= 0) {
            localStorage.setItem(props.currency.symbol, userCoinData.amount);
        }
    }, [userCoinData, props.currency.symbol]);

    // Helper method for getting the user's coin value
    // It will be a product of the current coin amount and the current coin price
    const getUserCoinValue = (amount) => (amount * props.currency.quote.USD.price).toFixed(2);

    const handleAmountChange = e => {
        setUserCoinData({
            ...userCoinData,
            amount: e.target.value
        });
    };

    const handleAmountSubmit = (e) => {
        e.preventDefault();
        const regExp = /^[\d]*$/;
        const isValidInputValue = regExp.test(userCoinData.amount);

        // Checking if the amount input is a positive number
        // Setting the invalid state to true, which will add an invalid styling to the form
        if (!isValidInputValue) {
            setInvalidCoinAmount(true);
            return;
        }

        setInvalidCoinAmount(false);

        // Reseting both amount and value if amount is set to zero
        if (Number(userCoinData.amount) === 0) {
            setUserCoinData({
                value: '',
                amount: ''
            });
        } else {
            // Calculating the value of a coin if the value is not invalid or zero
            setUserCoinData({
                ...userCoinData,
                value: Number(getUserCoinValue(userCoinData.amount)) || '',
            });

        }
    }

    // Using object destructuring to get all the currency values received via props
    const { currency } = props;
    const { name, symbol } = currency;
    const { price, percent_change_24h: percentChange24h } = currency.quote.USD;

    return (
        <tr>
            <CurrencyRowCell
                pointerCursor={true}
                bold={true}
                onClick={() => props.navigateToDetails(props.currency.id)}>
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
                    handleFormSubmit={handleAmountSubmit}
                    inputValue={userCoinData.amount}
                    invalidCoinAmount={invalidCoinAmount}
                    handleInputChange={handleAmountChange} />
            </CurrencyRowCell>
            <CurrencyRowCell>$ {userCoinData.value}</CurrencyRowCell>
        </tr>
    );
};

export default CurrencyRow;
