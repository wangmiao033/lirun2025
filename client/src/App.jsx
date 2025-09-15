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
import DashboardMinimal from './pages/Dashboard.minimal';
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
import SimpleTest from './pages/SimpleTest';

const App = () => {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <NotificationProvider>
          <Router>
            <Routes>
              <Route path="/test" element={<Test />} />
              <Route path="/simple-test" element={<SimpleTest />} />
              <Route path="/login" element={<Login />} />
              <Route path="/" element={
                <Layout>
                  <Routes>
                    <Route index element={<Navigate to="/dashboard" replace />} />
                    <Route path="dashboard" element={<DashboardMinimal />} />
                    <Route path="profits" element={<ProfitManagement />} />
                    <Route path="servers" element={<ServerManagement />} />
                    <Route path="bank" element={<BankManagement />} />
                    <Route path="prepayments" element={<PrepaymentManagement />} />
                    <Route path="advertising" element={<AdvertisingManagement />} />
                    <Route path="billing" element={<BillingManagement />} />
                    <Route path="departments" element={<DepartmentManagement />} />
                    <Route path="suppliers" element={<SupplierManagement />} />
                    <Route path="research" element={<ResearchManagement />} />
                    <Route path="channels" element={<ChannelManagement />} />
                    <Route path="games" element={<GameManagement />} />
                    <Route path="import" element={<DataImport />} />
                    <Route path="reports" element={<Reports />} />
                    <Route path="analytics" element={<AdvancedAnalytics />} />
                    <Route path="backup" element={<BackupManagement />} />
                  </Routes>
                </Layout>
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