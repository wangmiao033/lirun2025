import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { NotificationProvider } from './contexts/NotificationContext';
import ProtectedRoute from './components/ProtectedRoute';
import ErrorBoundary from './components/ErrorBoundary';
import NotificationContainer from './components/NotificationContainer';
import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import ProfitManagement from './pages/ProfitManagement';
import ServerManagement from './pages/ServerManagement';
import BankManagement from './pages/BankManagement';
import PrepaymentManagement from './pages/PrepaymentManagement';
import AdvertisingManagement from './pages/AdvertisingManagement';
import BillingManagement from './pages/BillingManagement';
import DepartmentManagement from './pages/DepartmentManagement';
import SupplierManagement from './pages/SupplierManagement';
import ResearchManagement from './pages/ResearchManagement';
import ChannelManagement from './pages/ChannelManagement';
import GameManagement from './pages/GameManagement';
import DataImport from './pages/DataImport';
import Reports from './pages/Reports';
import AdvancedAnalytics from './pages/AdvancedAnalytics';
import BackupManagement from './pages/BackupManagement';

const App = () => {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <NotificationProvider>
          <Router>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/" element={
                <ProtectedRoute>
                  <Layout>
                    <Routes>
                      <Route index element={<Navigate to="/dashboard" replace />} />
                      <Route path="dashboard" element={<Dashboard />} />
                      <Route path="profits" element={<ProtectedRoute requiredPermission="projects:read"><ProfitManagement /></ProtectedRoute>} />
                      <Route path="servers" element={<ProtectedRoute requiredPermission="servers:read"><ServerManagement /></ProtectedRoute>} />
                      <Route path="bank" element={<ProtectedRoute requiredPermission="bank:read"><BankManagement /></ProtectedRoute>} />
                      <Route path="prepayments" element={<ProtectedRoute requiredPermission="prepayments:read"><PrepaymentManagement /></ProtectedRoute>} />
                      <Route path="advertising" element={<ProtectedRoute requiredPermission="advertising:read"><AdvertisingManagement /></ProtectedRoute>} />
                      <Route path="billing" element={<ProtectedRoute requiredPermission="billing:read"><BillingManagement /></ProtectedRoute>} />
                      <Route path="departments" element={<ProtectedRoute requiredPermission="departments:read"><DepartmentManagement /></ProtectedRoute>} />
                      <Route path="suppliers" element={<ProtectedRoute requiredPermission="suppliers:read"><SupplierManagement /></ProtectedRoute>} />
                      <Route path="research" element={<ProtectedRoute requiredPermission="research:read"><ResearchManagement /></ProtectedRoute>} />
                      <Route path="channels" element={<ProtectedRoute requiredPermission="channels:read"><ChannelManagement /></ProtectedRoute>} />
                      <Route path="games" element={<ProtectedRoute requiredPermission="games:read"><GameManagement /></ProtectedRoute>} />
                      <Route path="import" element={<ProtectedRoute requiredPermission="import:read"><DataImport /></ProtectedRoute>} />
                      <Route path="reports" element={<ProtectedRoute requiredPermission="reports:read"><Reports /></ProtectedRoute>} />
                      <Route path="analytics" element={<ProtectedRoute requiredPermission="analytics:read"><AdvancedAnalytics /></ProtectedRoute>} />
                      <Route path="backup" element={<ProtectedRoute requiredPermission="backup:read"><BackupManagement /></ProtectedRoute>} />
                    </Routes>
                  </Layout>
                </ProtectedRoute>
              } />
            </Routes>
            <NotificationContainer />
          </Router>
        </NotificationProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
};

export default App;