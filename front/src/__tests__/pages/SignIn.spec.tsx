import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import SignIn from '../../pages/SignIn';

const mockedSignIn = jest.fn();
const mockedAddToast = jest.fn();

jest.mock('react-router-dom', () => {
  return {
    useHistory: () => ({
      push: jest.fn(),
    }),
    Link: ({ children }: { children: React.ReactNode }) => children,
  };
});

jest.mock('../../hooks/Auth', () => {
  return {
    useAuth: () => ({
      signIn: mockedSignIn,
    }),
  };
});

jest.mock('../../hooks/Toast', () => {
  return {
    useToast: () => ({
      addToast: mockedAddToast,
    }),
  };
});

describe('SignIn', () => {
  beforeEach(() => {
    mockedSignIn.mockClear();
    mockedAddToast.mockClear();
  });

  it('should be able to sign in', async () => {
    const { getByPlaceholderText, getByText } = render(<SignIn />);

    const emailField = getByPlaceholderText('E-mail');
    const passwordField = getByPlaceholderText('Password');
    const buttonElement = getByText('Enter');

    fireEvent.change(emailField, { target: { value: 'johndoe@example.com' } });
    fireEvent.change(passwordField, { target: { value: '123123' } });

    fireEvent.click(buttonElement);

    await waitFor(() => {
      expect(mockedSignIn).toHaveBeenCalledWith({
        email: 'johndoe@example.com',
        password: '123123',
      });
    });
  });

  it('should be not able to sign in with invalid credentials', async () => {
    const { getByPlaceholderText, getByText } = render(<SignIn />);

    const emailField = getByPlaceholderText('E-mail');
    const passwordField = getByPlaceholderText('Password');
    const buttonElement = getByText('Enter');

    fireEvent.change(emailField, { target: { value: 'invalid-email' } });
    fireEvent.change(passwordField, { target: { value: '123123' } });

    fireEvent.click(buttonElement);

    await waitFor(() => {
      expect(mockedSignIn).not.toHaveBeenCalled();
    });
  });

  it('should display an error if login fails', async () => {
    mockedSignIn.mockImplementationOnce(() => {
      throw new Error();
    });

    const { getByPlaceholderText, getByText } = render(<SignIn />);

    const emailField = getByPlaceholderText('E-mail');
    const passwordField = getByPlaceholderText('Password');
    const buttonElement = getByText('Enter');

    fireEvent.change(emailField, { target: { value: 'johndoe@example.com' } });
    fireEvent.change(passwordField, { target: { value: '123123' } });

    fireEvent.click(buttonElement);

    await waitFor(() => {
      expect(mockedAddToast).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'error',
        }),
      );
    });
  });
});
