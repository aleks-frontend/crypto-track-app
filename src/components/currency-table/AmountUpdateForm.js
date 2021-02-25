import React from 'react';
import styled from 'styled-components';

import GenericButton from '../styled/GenericButton';
import { fontSizes } from '../../helpers';

const AmountUpdateFormMain = styled.form`
    display: flex;
    flex-direction: column;
    justify-content: center;
`;

const AmountUpdateFormInput = styled.input`
    height: 1.5rem;
    background: #fff;
    font-size: ${fontSizes.regular};
`;

const AmountUpdateForm = ({ handleFormSubmit, inputValue, handleInputChange }) => {
    return (
        <AmountUpdateFormMain onSubmit={handleFormSubmit}>
            <AmountUpdateFormInput
                type="number"
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