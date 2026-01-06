import { apiRequest, authApi } from '../lib/api';

describe('apiRequest', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  it('makes request to correct URL', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ data: 'test' }),
    });

    await apiRequest('/test-endpoint');

    expect(global.fetch).toHaveBeenCalledWith(
      'http://127.0.0.1:8000/api/v1/test-endpoint',
      expect.any(Object)
    );
  });

  it('includes Authorization header when token exists', async () => {
    localStorage.setItem('token', 'test-token');

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ data: 'test' }),
    });

    await apiRequest('/test-endpoint');

    expect(global.fetch).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: 'Bearer test-token',
        }),
      })
    );
  });

  it('does not include Authorization header when no token', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ data: 'test' }),
    });

    await apiRequest('/test-endpoint');

    const callArgs = (global.fetch as jest.Mock).mock.calls[0][1];
    expect(callArgs.headers.Authorization).toBeUndefined();
  });

  it('throws error on non-ok response', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      json: () => Promise.resolve({ detail: 'Not found' }),
    });

    await expect(apiRequest('/test-endpoint')).rejects.toThrow('Not found');
  });

  it('handles JSON parse error gracefully', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      json: () => Promise.reject(new Error('Invalid JSON')),
    });

    await expect(apiRequest('/test-endpoint')).rejects.toThrow('An error occurred');
  });

  it('passes custom options to fetch', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ data: 'test' }),
    });

    await apiRequest('/test-endpoint', {
      method: 'POST',
      body: JSON.stringify({ key: 'value' }),
    });

    expect(global.fetch).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({ key: 'value' }),
      })
    );
  });
});

describe('authApi', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('login sends credentials as form data', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ access_token: 'token' }),
    });

    await authApi.login({ username: 'test@test.com', password: 'pass' });

    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/auth/login'),
      expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining({
          'Content-Type': 'application/x-www-form-urlencoded',
        }),
      })
    );
  });

  it('signup sends user data as JSON', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ id: 1, email: 'test@test.com' }),
    });

    const userData = {
      email: 'test@test.com',
      password: 'password123',
      first_name: 'Test',
      last_name: 'User',
    };

    await authApi.signup(userData);

    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/auth/signup'),
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify(userData),
      })
    );
  });
});
