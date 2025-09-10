import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
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

const App = () => {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/profits" element={<ProfitManagement />} />
          <Route path="/servers" element={<ServerManagement />} />
          <Route path="/bank" element={<BankManagement />} />
          <Route path="/prepayments" element={<PrepaymentManagement />} />
          <Route path="/advertising" element={<AdvertisingManagement />} />
          <Route path="/billing" element={<BillingManagement />} />
          <Route path="/departments" element={<DepartmentManagement />} />
          <Route path="/suppliers" element={<SupplierManagement />} />
          <Route path="/research" element={<ResearchManagement />} />
          <Route path="/channels" element={<ChannelManagement />} />
          <Route path="/games" element={<GameManagement />} />
          <Route path="/import" element={<DataImport />} />
          <Route path="/reports" element={<Reports />} />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;