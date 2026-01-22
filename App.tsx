
import React, { useState } from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import PropertyDetail from './components/PropertyDetail';
import PropertyForm from './components/PropertyForm';
import JurisdictionRules from './components/JurisdictionRules';
import UserAdmin from './components/UserAdmin';
import GlobalResearch from './components/GlobalResearch';
import GlobalWaterfall from './components/GlobalWaterfall';
import GlobalPackager from './components/GlobalPackager';
import GlobalCounsel from './components/GlobalCounsel';
import GlobalCountyScanner from './components/GlobalCountyScanner';
import ComplianceCalendar from './components/ComplianceCalendar';
import WorkflowProtocol from './components/WorkflowProtocol';
import MarketIntelligence from './components/MarketIntelligence';
import SubscriptionManager from './components/SubscriptionManager';
import AffiliatePortal from './components/AffiliatePortal';
import DatabaseVault from './components/DatabaseVault';
import AdminSettings from './components/AdminSettings';
import { User, UserRole, SubscriptionTier } from './types';

const MOCK_USER: User = {
  id: 'u1',
  email: 'admin@prospector.ai',
  role: UserRole.ADMIN,
  is_active: true,
  subscription: {
    tier: SubscriptionTier.PROFESSIONAL,
    status: 'active',
    ai_credits_remaining: 450,
    billing_cycle: 'monthly',
    renews_at: '2025-04-15'
  },
  affiliate: {
    referral_code: 'PROS-9281',
    total_referrals: 12,
    active_subscriptions: 8,
    unpaid_earnings: 240.50,
    total_earned: 1450.00
  }
};

const App: React.FC = () => {
  // CRITICAL: System now defaults to TRUE. No fake data will appear until switched to Demo.
  const [isLiveMode, setIsLiveMode] = useState(true);

  return (
    <Router>
      <Routes>
        <Route element={<Layout user={MOCK_USER} isLiveMode={isLiveMode} setIsLiveMode={setIsLiveMode} />}>
          <Route path="/" element={<Dashboard isLiveMode={isLiveMode} />} />
          <Route path="/intelligence" element={<MarketIntelligence />} />
          <Route path="/workflow" element={<WorkflowProtocol />} />
          <Route path="/properties/new" element={<PropertyForm />} />
          <Route path="/properties/:id" element={<PropertyDetail />} />
          <Route path="/admin/rules" element={<JurisdictionRules />} />
          <Route path="/admin/users" element={<UserAdmin />} />
          <Route path="/admin/auth" element={<AdminSettings />} />
          <Route path="/research" element={<GlobalResearch />} />
          <Route path="/waterfall" element={<GlobalWaterfall />} />
          <Route path="/packager" element={<GlobalPackager />} />
          <Route path="/counsel" element={<GlobalCounsel />} />
          <Route path="/scanner" element={<GlobalCountyScanner />} />
          <Route path="/calendar" element={<ComplianceCalendar />} />
          <Route path="/billing" element={<SubscriptionManager user={MOCK_USER} />} />
          <Route path="/affiliate" element={<AffiliatePortal user={MOCK_USER} />} />
          <Route path="/vault" element={<DatabaseVault />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
