import { render, screen, fireEvent } from '@testing-library/react';
import Modal from '../Modal';

describe('Modal', () => {
  const mockProps = {
    isOpen: true,
    onClose: jest.fn(),
    title: 'Test Modal',
    children: <div>Modal Content</div>
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders nothing when closed', () => {
    const { container } = render(<Modal {...mockProps} isOpen={false} />);
    expect(container).toBeEmptyDOMElement();
  });

  it('renders modal content when open', () => {
    render(<Modal {...mockProps} />);
    
    expect(screen.getByText('Test Modal')).toBeInTheDocument();
    expect(screen.getByText('Modal Content')).toBeInTheDocument();
  });

  it('calls onClose when close button is clicked', () => {
    render(<Modal {...mockProps} />);
    
    fireEvent.click(screen.getByRole('button'));
    
    expect(mockProps.onClose).toHaveBeenCalled();
  });

  it('disables close button when disabled prop is true', () => {
    render(<Modal {...mockProps} disabled={true} />);
    
    expect(screen.getByRole('button')).toBeDisabled();
  });
}); 