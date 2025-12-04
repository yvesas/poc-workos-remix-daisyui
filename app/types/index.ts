// Types for Creative data model based on backend
export interface MetaCreative {
  id: number;
  creative_id: string;
  meta_campaign_id: string | null;
  meta_adset_id: string | null;
  meta_adcreative_id: string | null;
  meta_ad_id: string | null;
  campaign_name: string | null;
  campaign_objective: string | null;
  campaign_daily_budget: number | null;
  adset_name: string | null;
  adset_billing_event: string | null;
  adset_optimization_goal: string | null;
  adset_bid_strategy: string | null;
  adset_bid_amount: number | null;
  adset_daily_budget: number | null;
  adset_targeting_json: string | null;
  ad_title: string | null;
  ad_body: string | null;
  ad_website_url: string | null;
  ad_call_to_action: string | null;
}

export type CreativeStatus = 'pending' | 'active' | 'paused' | 'archived' | 'error';

export interface Creative {
  id: string;
  craft_id: string;
  platform: string;
  session_id: string;
  status: CreativeStatus;
  error_message: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
  is_deleted: boolean;
  meta_creative?: MetaCreative;
}

// User types
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  avatarUrl?: string;
}

// Theme types
export type DaisyTheme = 
  | 'light' 
  | 'dark' 
  | 'cupcake' 
  | 'business' 
  | 'night' 
  | 'dracula' 
  | 'winter';

export const DAISY_THEMES: DaisyTheme[] = [
  'light',
  'dark',
  'cupcake',
  'business',
  'night',
  'dracula',
  'winter',
];
