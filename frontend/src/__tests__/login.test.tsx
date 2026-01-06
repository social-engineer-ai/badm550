import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import LoginPage from '../app/login/page';

// Mock useRouter
const mockPush = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

describe('LoginPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (global.fetch as jest.Mock).mockClear();
  });

  it('renders login form', () => {
    render(<LoginPage />);

    expect(screen.getByText('BADM 550')).toBeInTheDocument();
    expect(screen.getByText('PRACTICUM OPERATING SYSTEM')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('name@illinois.edu')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('••••••••')).toBeInTheDocument();
    expect(screen.getByText('ENTER SYSTEM')).toBeInTheDocument();
  });

  it('updates email and password fields on input', () => {
    render(<LoginPage />);

    const emailInput = screen.getByPlaceholderText('name@illinois.edu');
    const passwordInput = screen.getByPlaceholderText('••••••••');

    fireEvent.change(emailInput, { target: { value: 'test@illinois.edu' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });

    expect(emailInput).toHaveValue('test@illinois.edu');
    expect(passwordInput).toHaveValue('password123');
  });

  it('shows loading state during login', async () => {
    (global.fetch as jest.Mock).mockImplementation(() =>
      new Promise((resolve) =>
        setTimeout(() =>
          resolve({
            ok: true,
            json: () => Promise.resolve({ access_token: 'test-token' }),
          }),
          100
        )
      )
    );

    render(<LoginPage />);

    const emailInput = screen.getByPlaceholderText('name@illinois.edu');
    const passwordInput = screen.getByPlaceholderText('••••••••');
    const submitButton = screen.getByText('ENTER SYSTEM');

    fireEvent.change(emailInput, { target: { value: 'test@illinois.edu' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);

    expect(screen.getByText('AUTHENTICATING...')).toBeInTheDocument();
  });

  it('displays error on login failure', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      json: () => Promise.resolve({ detail: 'Invalid credentials' }),
    });

    render(<LoginPage />);

    const emailInput = screen.getByPlaceholderText('name@illinois.edu');
    const passwordInput = screen.getByPlaceholderText('••••••••');
    const submitButton = screen.getByText('ENTER SYSTEM');

    fireEvent.change(emailInput, { target: { value: 'test@illinois.edu' } });
    fireEvent.change(passwordInput, { target: { value: 'wrongpassword' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Invalid credentials')).toBeInTheDocument();
    });
  });

  it('redirects student to student dashboard on successful login', async () => {
    (global.fetch as jest.Mock)
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ access_token: 'test-token' }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ role: 'student' }),
      });

    render(<LoginPage />);

    const emailInput = screen.getByPlaceholderText('name@illinois.edu');
    const passwordInput = screen.getByPlaceholderText('••••••••');
    const submitButton = screen.getByText('ENTER SYSTEM');

    fireEvent.change(emailInput, { target: { value: 'student@illinois.edu' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/student');
    });
  });

  it('redirects teacher to instructor dashboard on successful login', async () => {
    (global.fetch as jest.Mock)
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ access_token: 'test-token' }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ role: 'teacher' }),
      });

    render(<LoginPage />);

    const emailInput = screen.getByPlaceholderText('name@illinois.edu');
    const passwordInput = screen.getByPlaceholderText('••••••••');
    const submitButton = screen.getByText('ENTER SYSTEM');

    fireEvent.change(emailInput, { target: { value: 'teacher@illinois.edu' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/instructor');
    });
  });

  it('stores token in localStorage on successful login', async () => {
    const mockSetItem = jest.spyOn(Storage.prototype, 'setItem');

    (global.fetch as jest.Mock)
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ access_token: 'test-jwt-token' }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ role: 'student' }),
      });

    render(<LoginPage />);

    const emailInput = screen.getByPlaceholderText('name@illinois.edu');
    const passwordInput = screen.getByPlaceholderText('••••••••');
    const submitButton = screen.getByText('ENTER SYSTEM');

    fireEvent.change(emailInput, { target: { value: 'test@illinois.edu' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockSetItem).toHaveBeenCalledWith('token', 'test-jwt-token');
    });

    mockSetItem.mockRestore();
  });
});
