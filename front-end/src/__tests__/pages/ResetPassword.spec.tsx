import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';

import api from '../../services/api';

import ResetPassword from '../../pages/ResetPassword';

const mockedHistoryPush = jest.fn();
const mockedAddToast = jest.fn();

jest.mock('react-router-dom', () => ({
  useHistory: () => ({
    push: mockedHistoryPush,
  }),
  useLocation: () => ({
    search: '?token=asdasdasd',
  }),
  Link: ({ children }: { children: React.ReactNode }) => children,
}));

jest.mock('../../hooks/Toast', () => {
  return {
    useToast: () => ({
      addToast: mockedAddToast,
    }),
  };
});

jest.spyOn(api, 'post').mockImplementation(jest.fn());

describe('ResetPassword', () => {
  beforeEach(() => {
    mockedHistoryPush.mockClear();
    mockedAddToast.mockClear();
  });

  it('should be able to reset password', async () => {
    const { getByPlaceholderText, getByText } = render(<ResetPassword />);

    const passwordField = getByPlaceholderText('New password');
    const passwordConfirmation = getByPlaceholderText(
      'New password confirmation',
    );
    const buttonElement = getByText('Change password');

    fireEvent.change(passwordConfirmation, { target: { value: '123123' } });
    fireEvent.change(passwordField, { target: { value: '123123' } });

    fireEvent.click(buttonElement);

    await waitFor(() => {
      expect(mockedHistoryPush).toHaveBeenCalledWith('/');
    });
  });

  it('should be not able to reset password with not maching confirmation', async () => {
    const { getByPlaceholderText, getByText } = render(<ResetPassword />);

    const passwordField = getByPlaceholderText('New password');
    const passwordConfirmation = getByPlaceholderText(
      'New password confirmation',
    );
    const buttonElement = getByText('Change password');

    fireEvent.change(passwordConfirmation, { target: { value: '123123' } });
    fireEvent.change(passwordField, { target: { value: '123' } });

    fireEvent.click(buttonElement);

    await waitFor(() => {
      expect(mockedHistoryPush).not.toHaveBeenCalled();
    });

    await waitFor(() => {
      expect(mockedAddToast).not.toHaveBeenCalled();
    });
  });

  // it('should display an error if token not found in location', async () => {
  //   const { getByPlaceholderText, getByText } = render(<ResetPassword />);

  //   const passwordField = getByPlaceholderText('New password');
  //   const passwordConfirmation = getByPlaceholderText(
  //     'New password confirmation',
  //   );
  //   const buttonElement = getByText('Change password');

  //   fireEvent.change(passwordConfirmation, { target: { value: '123123' } });
  //   fireEvent.change(passwordField, { target: { value: '123123' } });

  //   fireEvent.click(buttonElement);

  //   await waitFor(() => {
  //     expect(mockedAddToast).toHaveBeenCalledWith(
  //       expect.objectContaining({
  //         type: 'error',
  //       }),
  //     );
  //   });
  // });

  it('should display an error if reset password fails', async () => {
    jest.spyOn(api, 'post').mockImplementationOnce(() => {
      throw new Error();
    });

    const { getByPlaceholderText, getByText } = render(<ResetPassword />);

    const passwordField = getByPlaceholderText('New password');
    const passwordConfirmation = getByPlaceholderText(
      'New password confirmation',
    );
    const buttonElement = getByText('Change password');

    fireEvent.change(passwordConfirmation, { target: { value: '123123' } });
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
