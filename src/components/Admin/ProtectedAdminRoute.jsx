import React from 'react';
import { useStore } from '../../context/StoreContext';
import { AdminLoginView } from './AdminLoginView';

export function ProtectedAdminRoute({ children }) {
  const { isAdminAuthenticated, adminUser } = useStore();

  // If not authenticated as Admin, render the dedicated Admin Login view
  if (!isAdminAuthenticated && !adminUser) {
    return <AdminLoginView />;
  }

  return <>{children}</>;
}
