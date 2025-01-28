import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import UserForm from '../UserForm';

describe('UserForm', () => {
  const mockSubmit = jest.fn();
  const mockCancel = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders empty form in create mode', () => {
    render(<UserForm onSubmit={mockSubmit} onCancel={mockCancel} />);
    
    expect(screen.getByLabelText(/first name/i)).toHaveValue('');
    expect(screen.getByLabelText(/last name/i)).toHaveValue('');
    expect(screen.getByLabelText(/email/i)).toHaveValue('');
    expect(screen.getByLabelText(/department/i)).toHaveValue('');
    expect(screen.getByRole('button', { name: /create/i })).toBeInTheDocument();
  });

  it('renders form with user data in edit mode', () => {
    const user = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      department: 'Engineering'
    };

    render(<UserForm user={user} onSubmit={mockSubmit} onCancel={mockCancel} />);
    
    expect(screen.getByLabelText(/first name/i)).toHaveValue('John');
    expect(screen.getByLabelText(/last name/i)).toHaveValue('Doe');
    expect(screen.getByLabelText(/email/i)).toHaveValue('john@example.com');
    expect(screen.getByLabelText(/department/i)).toHaveValue('Engineering');
    expect(screen.getByRole('button', { name: /update/i })).toBeInTheDocument();
  });

  it('validates required fields on blur', async () => {
    render(<UserForm onSubmit={mockSubmit} onCancel={mockCancel} />);
    
    const firstNameInput = screen.getByLabelText(/first name/i);
    fireEvent.blur(firstNameInput);
    
    expect(await screen.findByText(/first name is required/i)).toBeInTheDocument();
  });

  it('validates email format', async () => {
    render(<UserForm onSubmit={mockSubmit} onCancel={mockCancel} />);
    
    const emailInput = screen.getByLabelText(/email/i);
    await userEvent.type(emailInput, 'invalid-email');
    fireEvent.blur(emailInput);
    
    expect(await screen.findByText(/invalid email address/i)).toBeInTheDocument();
  });

  it('submits form with valid data', async () => {
    render(<UserForm onSubmit={mockSubmit} onCancel={mockCancel} />);
    
    await userEvent.type(screen.getByLabelText(/first name/i), 'John');
    await userEvent.type(screen.getByLabelText(/last name/i), 'Doe');
    await userEvent.type(screen.getByLabelText(/email/i), 'john@example.com');
    await userEvent.type(screen.getByLabelText(/department/i), 'Engineering');
    
    fireEvent.click(screen.getByRole('button', { name: /create/i }));
    
    expect(mockSubmit).toHaveBeenCalledWith({
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      department: 'Engineering'
    });
  });

  it('shows loading state during submission', () => {
    render(<UserForm onSubmit={mockSubmit} onCancel={mockCancel} isSubmitting={true} />);
    
    expect(screen.getByText(/creating\.\.\./i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /creating\.\.\./i })).toBeDisabled();
  });

  it('calls onCancel when cancel button is clicked', () => {
    render(<UserForm onSubmit={mockSubmit} onCancel={mockCancel} />);
    
    fireEvent.click(screen.getByRole('button', { name: /cancel/i }));
    
    expect(mockCancel).toHaveBeenCalled();
  });
}); 