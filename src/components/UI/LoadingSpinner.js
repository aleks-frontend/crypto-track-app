import React from 'react';
import styled from 'styled-components';

const LoadingSpinnerMain = styled.img`
    width: 60px;
`;

const LoadingSpinner = () => <LoadingSpinnerMain src="/loading-spinner.gif" />;

export default LoadingSpinner;
