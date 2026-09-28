// Copy to config.js locally, or let the deployment workflow generate it.
// The Supabase anon key is intentionally public and protected by Row Level Security.
window.BACKLOG_BUDDY_CONFIG = {
  SUPABASE_URL: 'https://YOUR_PROJECT_REF.supabase.co',
  SUPABASE_ANON_KEY: 'YOUR_PUBLIC_ANON_KEY'
};
