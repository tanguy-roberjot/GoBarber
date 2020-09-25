import React, { ButtonHTMLAttributes } from 'react';
import { Container, Loader } from './styles';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  loading?: boolean;
};

const Button: React.FC<ButtonProps> = ({ children, loading, ...rest }) => (
  <Container type="button" {...rest}>
    {loading ? <Loader size={18} color="#fff" /> : children}
  </Container>
);

export default Button;
