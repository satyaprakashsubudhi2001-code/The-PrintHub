import React from 'react';
import { useStore } from '../../context/StoreContext';
import { AdminLoginView } from './AdminLoginView';

export function ProtectedAdminRoute({ children }) {
  const { isAdminAuthenticated, adminUser } = useStore();

  // If not authenticated as Admin, strictly render the dedicated Admin Login terminal
  if (!isAdminAuthenticated || !adminUser || adminUser.role !== 'admin') {
    return <AdminLoginView />;
  }

  return <>{children}</>;
}
