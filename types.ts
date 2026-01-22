
export enum UserRole {
  ADMIN = 'ADMIN',
  REVIEWER = 'REVIEWER',
  FILING_AGENT = 'FILING_AGENT',
  VIEWER = 'VIEWER'
}

export enum SubscriptionTier {
  STARTER = 'STARTER',
  PROFESSIONAL = 'PROFESSIONAL',
  ENTERPRISE = 'ENTERPRISE'
}

export interface UserSubscription {
  tier: SubscriptionTier;
  status: 'active' | 'past_due' | 'canceled';
  ai_credits_remaining: number;
  billing_cycle: 'monthly' | 'yearly';
  renews_at: string;
}

export interface AffiliateProfile {
  referral_code: string;
  total_referrals: number;
  active_subscriptions: number;
  unpaid_earnings: number;
  total_earned: number;
}

export enum CaseStatus {
  NEW = 'NEW',
  NEEDS_DOCS = 'NEEDS_DOCS',
  READY_FOR_REVIEW = 'READY_FOR_REVIEW',
  COUNSEL_REVIEW = 'COUNSEL_REVIEW',
  APPROVED_TO_FILE = 'APPROVED_TO_FILE',
  FILED = 'FILED',
  PAID = 'PAID',
  REJECTED = 'REJECTED'
}

export enum ArtifactType {
  EXTRACTED_DATA = 'EXTRACTED_DATA',
  LEGAL_FORM = 'LEGAL_FORM',
  RESEARCH_DOSSIER = 'RESEARCH_DOSSIER',
  ORR_LETTER = 'ORR_LETTER',
  WATERFALL_MODEL = 'WATERFALL_MODEL'
}

export interface VaultArtifact {
  id: string;
  property_id: string;
  type: ArtifactType;
  filename: string;
  created_at: string;
  created_by: string;
  version: string;
  hash: string; // SHA-256 simulation
  content_preview?: string;
  is_verified: boolean;
}

export interface SystemNotification {
  id: string;
  type: 'DROP_ALERT' | 'DEADLINE' | 'SYSTEM' | 'INTEGRITY';
  title: string;
  message: string;
  timestamp: string;
  is_read: boolean;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  metadata?: any;
}

export interface WatchedJurisdiction {
  state: string;
  county: string;
  access_type: string;
  cadence: string;
  last_updated: string;
  next_expected: string;
  status: 'FRESH' | 'APPROACHING' | 'IMMINENT' | 'STALE' | 'UNKNOWN';
  alerts_enabled: boolean;
}

export enum LienType {
  GOVERNMENT = 'GOVERNMENT',
  MORTGAGE_1 = 'MORTGAGE_1',
  MORTGAGE_2 = 'MORTGAGE_2',
  HOA = 'HOA',
  JUDGMENT = 'JUDGMENT',
  MECHANIC = 'MECHANIC',
  OTHER = 'OTHER'
}

export interface Attorney {
  id: string;
  name: string;
  firm: string;
  bar_id: string;
  specialty: string[];
  jurisdictions: string[];
  contact_email: string;
  rating: number;
  cases_handled: number;
}

export interface LegalEngagement {
  id: string;
  property_id: string;
  attorney_id: string;
  status: 'PROPOSED' | 'RETAINED' | 'FILING_ACTIVE' | 'CLOSED';
  engagement_date: string;
  notes?: string;
}

export interface Lien {
  id: string;
  type: LienType;
  description: string;
  amount: number;
  priority: number;
  status?: 'PAID' | 'PARTIAL' | 'UNPAID';
  satisfied_amount?: number;
}

export interface User {
  id: string;
  email: string;
  role: UserRole;
  is_active: boolean;
  subscription?: UserSubscription;
  affiliate?: AffiliateProfile;
}

export interface JurisdictionRule {
  id: string;
  state: string;
  county: string;
  claim_deadline_days: number;
  required_documents: string[];
  filing_method: string;
  notes?: string;
  attorney_required: boolean;
}

export interface Claimant {
  id: string;
  name: string;
  relationship: 'OWNER' | 'HEIR' | 'CORPORATE_ENTITY';
  is_verified: boolean;
  verified_at?: string;
  verified_by_user_id?: string;
  verified_by_email?: string;
  contact_info?: string;
  verification_rationale?: string;
  confidence_score?: number;
}

export interface Property {
  id: string;
  state: string;
  county: string;
  parcel_id: string;
  address: string;
  tax_sale_date: string;
  deed_record_date?: string;
  sale_price: number;
  total_debt: number;
  surplus_amount: number;
  deadline_date: string;
  status: CaseStatus;
  assigned_to_user_id?: string;
  created_at: string;
  liens?: Lien[];
  claimants?: Claimant[];
  priority_score?: number;
  risk_level?: 'LOW' | 'MEDIUM' | 'HIGH';
  est_payout_days?: number;
}

export interface Document {
  id: string;
  property_id: string;
  filename: string;
  doc_type: string;
  tags: string[];
  extraction_status: 'QUEUED' | 'OCR_DONE' | 'LLM_DONE' | 'READY_FOR_REVIEW' | 'FAILED';
  extracted_fields: any;
  verified_by_human: boolean;
  ocr_text?: string;
}

export interface AuditEvent {
  id: string;
  entity_type: string;
  entity_id: string;
  action: string;
  metadata: any;
  created_at: string;
  actor_email?: string;
}
