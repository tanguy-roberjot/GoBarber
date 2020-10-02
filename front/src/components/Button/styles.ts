import styled, { keyframes } from 'styled-components';
import { shade } from 'polished';

import { FiLoader } from 'react-icons/fi';

const rotate = keyframes`
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
`;

export const Container = styled.button`
  background: #ff9000;
  height: 56px;
  border-radius: 10px;
  border: 0;
  padding: 0 16px;
  width: 100%;
  color: #312e38;
  font-weight: 500;
  margin-top: 16px;
  transition: background-color 0.2s;

  &:hover {
    background: ${shade(0.2, '#ff9000')};
  }
`;

export const Loader = styled(FiLoader)`
  animation: ${rotate} 2s linear infinite;
`;
