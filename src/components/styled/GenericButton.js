import styled from 'styled-components';

import { fontSizes, colors } from '../../helpers';

const GenericButton = styled.button`
    margin-top: ${props => props.compact ? 0 : '1rem'};
    ${props => props.compact && 'height: 1.5rem;'}
    ${props => props.compact && 'padding: 0.2em;'}
    font-size: ${fontSizes.regular};
    background: ${colors.silverChalice};
    border: none;
    transition: 0.3s ease-in-out all;

    &:hover { 
        border: none; 
        background: ${colors.doveGray};
    }
`;

export default GenericButton;
