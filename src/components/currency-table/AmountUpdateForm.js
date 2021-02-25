import React from 'react';
import styled from 'styled-components';

import GenericButton from '../styled/GenericButton';
import { fontSizes } from '../../helpers';

const AmountUpdateFormMain = styled.form`
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 1px;
    border: 1px solid ${props => props.invalid ? 'red' : 'transparent'};

    &::before {
        content: 'Please add only positive number values';
        display: ${props => props.invalid ? 'block' : 'none'};
        position: absolute;
        top: 0;
        left: 0;
        padding: 5px;
        width: 100%;
        background: #fff;
        border: 1px solid red;
        font-size: 0.7rem;
        font-weight: bold;
        transform: translateY(-100%);
    }
`;

const AmountUpdateFormInput = styled.input`
    height: 1.5rem;
    background: #fff;
    font-size: ${fontSizes.regular};
`;

const AmountUpdateForm = ({ handleFormSubmit, inputValue, handleInputChange, invalidCoinAmount }) => {
    return (
        <AmountUpdateFormMain
            onSubmit={handleFormSubmit}
            invalid={invalidCoinAmount}>
            <AmountUpdateFormInput
                type="text"
                value={inputValue}
                onChange={handleInputChange} />
            <GenericButton
                type="submit"
                compact={true}
                disabled={inputValue === ''}
            >Submit</GenericButton>
        </AmountUpdateFormMain>
    );
};

export default AmountUpdateForm;