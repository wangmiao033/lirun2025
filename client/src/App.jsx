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
import Test from './pages/Test';

const App = () => {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <NotificationProvider>
          <Router>
            <Routes>
              <Route path="/test" element={<Test />} />
              <Route path="/login" element={<Login />} />
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <Layout>
                    <Dashboard />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
            </Routes>
            <NotificationContainer />
          </Router>
        </NotificationProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
};

export default App;