import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import ProfitManagement from './pages/ProfitManagement';
import ServerManagement from './pages/ServerManagement';
import BankManagement from './pages/BankManagement';
import PrepaymentManagement from './pages/PrepaymentManagement';
import AdvertisingManagement from './pages/AdvertisingManagement';
import DepartmentManagement from './pages/DepartmentManagement';
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
          <Route path="/departments" element={<DepartmentManagement />} />
          <Route path="/import" element={<DataImport />} />
          <Route path="/reports" element={<Reports />} />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;