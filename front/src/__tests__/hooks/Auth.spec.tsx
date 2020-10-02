import { renderHook, act } from '@testing-library/react-hooks';
import MockAdapter from 'axios-mock-adapter';
import { useAuth, AuthProvider } from '../../hooks/Auth';
import api from '../../services/api';

const apiMock = new MockAdapter(api);

describe('Auth hook', () => {
  it('should be able to sign in', async () => {
    const apiResponse = {
      user: { id: 'usr123', name: 'John Doe', email: 'johndoe@example.com' },
      token: 'token123',
    };

    apiMock.onPost('sessions').reply(200, apiResponse);

    const setItemSPy = jest.spyOn(Storage.prototype, 'setItem');

    const { result, waitForNextUpdate } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    });

    result.current.signIn({
      email: 'johndoe@example.com.br',
      password: '123456',
    });

    await waitForNextUpdate();

    expect(setItemSPy).toHaveBeenCalledWith(
      '@GoBarber:token',
      apiResponse.token,
    );
    expect(setItemSPy).toHaveBeenCalledWith(
      '@GoBarber:user',
      JSON.stringify(apiResponse.user),
    );
    expect(result.current.user.email).toEqual('johndoe@example.com');
  });

  it('should restore saved data from storage when auth inits', async () => {
    jest.spyOn(Storage.prototype, 'getItem').mockImplementation(key => {
      switch (key) {
        case '@GoBarber:token':
          return 'token123';
        case '@GoBarber:user':
          return JSON.stringify({
            id: 'usr123',
            name: 'John Doe',
            email: 'johndoe@example.com',
          });
        default:
          return null;
      }
    });

    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    });

    expect(result.current.user.email).toEqual('johndoe@example.com');
  });

  it('should be able to sign out', async () => {
    const removeItemSpy = jest.spyOn(Storage.prototype, 'removeItem');

    jest.spyOn(Storage.prototype, 'getItem').mockImplementation(key => {
      switch (key) {
        case '@GoBarber:token':
          return 'token123';
        case '@GoBarber:user':
          return JSON.stringify({
            id: 'usr123',
            name: 'John Doe',
            email: 'johndoe@example.com',
          });
        default:
          return null;
      }
    });

    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    });

    act(() => {
      result.current.signOut();
    });

    expect(result.current.user).toBeUndefined();
    expect(removeItemSpy).toHaveBeenCalledTimes(2);
  });

  it('should be able to update user data', async () => {
    const setItemSpy = jest.spyOn(Storage.prototype, 'setItem');

    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    });

    const user = {
      id: 'usr123',
      name: 'John Doe',
      email: 'johndoe@example.com',
      avatar_url: 'image-test.jpg',
    };

    act(() => {
      result.current.updateUser(user);
    });

    expect(setItemSpy).toHaveBeenCalledWith(
      '@GoBarber:user',
      JSON.stringify(user),
    );
    expect(result.current.user).toEqual(user);
  });
});
