
import React, { useState } from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import PropertyDetail from './components/PropertyDetail';
import PropertyForm from './components/PropertyForm';
import JurisdictionRules from './components/JurisdictionRules';
import UserAdmin from './components/UserAdmin';
import { User, UserRole } from './types';

const MOCK_USER: User = {
  id: 'u1',
  email: 'admin@prospector.ai',
  role: UserRole.ADMIN,
  is_active: true
};

const App: React.FC = () => {
  const [isLiveMode, setIsLiveMode] = useState(false);

  return (
    <Router>
      <Routes>
        <Route element={<Layout user={MOCK_USER} isLiveMode={isLiveMode} setIsLiveMode={setIsLiveMode} />}>
          <Route path="/" element={<Dashboard isLiveMode={isLiveMode} />} />
          <Route path="/properties/new" element={<PropertyForm />} />
          <Route path="/properties/:id" element={<PropertyDetail />} />
          <Route path="/admin/rules" element={<JurisdictionRules />} />
          <Route path="/admin/users" element={<UserAdmin />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
