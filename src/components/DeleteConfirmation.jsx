import React from 'react';

const DeleteConfirmation = ({ onConfirm, onCancel, isLoading }) => {
  return (
    <div className="delete-confirmation">
      <p className="delete-message">
        Are you sure you want to delete this user? This action cannot be undone.
      </p>
      <div className="delete-actions">
        <button
          onClick={onCancel}
          disabled={isLoading}
          className="cancel-button"
        >
          Cancel
        </button>
        <button
          onClick={onConfirm}
          disabled={isLoading}
          className="delete-button"
        >
          {isLoading ? (
            <>
              <div className="loading-spinner"></div>
              <span>Deleting...</span>
            </>
          ) : (
            'Delete'
          )}
        </button>
      </div>
    </div>
  );
};

export default DeleteConfirmation;