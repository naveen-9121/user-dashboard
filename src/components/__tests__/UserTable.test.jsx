import { render, screen, fireEvent } from '@testing-library/react';
import UserTable from '../UserTable';

describe('UserTable', () => {
  const mockUsers = [
    {
      id: 1,
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      department: 'Engineering'
    },
    {
      id: 2,
      firstName: 'Jane',
      lastName: 'Smith',
      email: 'jane@example.com',
      department: 'Marketing'
    }
  ];

  const mockProps = {
    users: mockUsers,
    onEdit: jest.fn(),
    onDelete: jest.fn(),
    currentPage: 1,
    totalUsers: 2,
    itemsPerPage: 5,
    onPageChange: jest.fn(),
    loading: false
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders table with user data', () => {
    render(<UserTable {...mockProps} />);
    
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('jane@example.com')).toBeInTheDocument();
    expect(screen.getByText('Marketing')).toBeInTheDocument();
  });

  it('shows loading state', () => {
    render(<UserTable {...mockProps} loading={true} />);
    
    expect(screen.getByText(/loading users/i)).toBeInTheDocument();
  });

  it('shows empty state when no users', () => {
    render(<UserTable {...mockProps} users={[]} />);
    
    expect(screen.getByText(/no users found/i)).toBeInTheDocument();
  });

  it('calls onEdit when edit button is clicked', () => {
    render(<UserTable {...mockProps} />);
    
    const editButtons = screen.getAllByRole('button', { name: /edit/i });
    fireEvent.click(editButtons[0]);
    
    expect(mockProps.onEdit).toHaveBeenCalledWith(mockUsers[0]);
  });

  it('calls onDelete when delete button is clicked', () => {
    render(<UserTable {...mockProps} />);
    
    const deleteButtons = screen.getAllByRole('button', { name: /delete/i });
    fireEvent.click(deleteButtons[0]);
    
    expect(mockProps.onDelete).toHaveBeenCalledWith(mockUsers[0].id);
  });

  it('renders pagination when there are multiple pages', () => {
    render(<UserTable {...mockProps} totalUsers={12} />);
    
    expect(screen.getByText(/showing 1 to 5 of 12/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /next/i })).toBeInTheDocument();
  });

  it('handles page changes', () => {
    render(<UserTable {...mockProps} totalUsers={12} />);
    
    fireEvent.click(screen.getByRole('button', { name: /next/i }));
    
    expect(mockProps.onPageChange).toHaveBeenCalledWith(2);
  });
}); 