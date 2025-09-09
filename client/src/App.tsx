import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Layout } from 'antd';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import ProfitList from './pages/ProfitList';
import ProfitForm from './pages/ProfitForm';
import DepartmentManagement from './pages/DepartmentManagement';
import DataImport from './pages/DataImport';
import Reports from './pages/Reports';

const { Content } = Layout;

const App: React.FC = () => {
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sidebar />
      <Layout>
        <Header />
        <Content>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/profits" element={<ProfitList />} />
            <Route path="/profits/new" element={<ProfitForm />} />
            <Route path="/profits/:id/edit" element={<ProfitForm />} />
            <Route path="/departments" element={<DepartmentManagement />} />
            <Route path="/import" element={<DataImport />} />
            <Route path="/reports" element={<Reports />} />
          </Routes>
        </Content>
      </Layout>
    </Layout>
  );
};

export default App;
