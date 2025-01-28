import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import UserTable from './components/UserTable';
import Modal from './components/Modal';
import DeleteConfirmation from './components/DeleteConfirmation';
import UserForm from './components/UserForm';
import { fetchUsers, createUser, updateUser, deleteUser } from './services/api';
import './App.css';

const App = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteConfirmation, setDeleteConfirmation] = useState({
    show: false,
    userId: null
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);
  const itemsPerPage = 5; // Should match the API's ITEMS_PER_PAGE
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    loadUsers();
  }, [currentPage]);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const { users: data, total } = await fetchUsers(currentPage);
      setUsers(data);
      setTotalUsers(total);
      setError(null);
    } catch (err) {
      setError('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = async (userData) => {
    try {
      setIsSubmitting(true);
      const newUser = await createUser(userData);
      setUsers(prev => [...prev, newUser]);
      setIsFormOpen(false);
    } catch (err) {
      setError('Failed to create user');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateUser = async (userData) => {
    if (!selectedUser) return;
    try {
      setIsSubmitting(true);
      const updatedUser = await updateUser(selectedUser.id, userData);
      setUsers(prev => prev.map(user => 
        user.id === selectedUser.id ? updatedUser : user
      ));
      setSelectedUser(null);
      setIsFormOpen(false);
    } catch (err) {
      setError('Failed to update user');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteClick = (userId) => {
    setDeleteConfirmation({ show: true, userId });
  };

  const handleDeleteConfirm = async () => {
    if (!deleteConfirmation.userId) return;
    
    try {
      setLoading(true);
      await deleteUser(deleteConfirmation.userId);
      setUsers(prev => prev.filter(user => user.id !== deleteConfirmation.userId));
      setDeleteConfirmation({ show: false, userId: null });
    } catch (err) {
      setError('Failed to delete user');
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(user => 
    `${user.firstName} ${user.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="app-container">
      <div className="app-content">
        <Header
          searchTerm={searchTerm}
          onSearch={setSearchTerm}
          onAddUser={() => setIsFormOpen(true)}
        />

        {error && (
          <div className="error-message">
            <p>{error}</p>
          </div>
        )}

        <UserTable
          users={filteredUsers}
          onEdit={(user) => {
            setSelectedUser(user);
            setIsFormOpen(true);
          }}
          onDelete={handleDeleteClick}
          currentPage={currentPage}
          totalUsers={totalUsers}
          itemsPerPage={itemsPerPage}
          onPageChange={setCurrentPage}
          loading={loading}
        />

        <Modal
          isOpen={isFormOpen}
          onClose={() => {
            setIsFormOpen(false);
            setSelectedUser(null);
          }}
          title={selectedUser ? 'Edit User' : 'Add User'}
          disabled={isSubmitting}
        >
          <UserForm
            user={selectedUser}
            onSubmit={selectedUser ? handleUpdateUser : handleCreateUser}
            onCancel={() => {
              setIsFormOpen(false);
              setSelectedUser(null);
            }}
            isSubmitting={isSubmitting}
          />
        </Modal>

        <Modal
          isOpen={deleteConfirmation.show}
          onClose={() => setDeleteConfirmation({ show: false, userId: null })}
          title="Delete User"
          disabled={loading}
        >
          <DeleteConfirmation
            onConfirm={handleDeleteConfirm}
            onCancel={() => setDeleteConfirmation({ show: false, userId: null })}
            isLoading={loading}
          />
        </Modal>
      </div>
    </div>
  );
}

export default App;
