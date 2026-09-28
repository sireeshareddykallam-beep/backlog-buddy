/* Lightweight Supabase Auth + REST adapter. No service-role key is ever used in the browser. */
window.bbSupabase = (() => {
  const cfg = window.BACKLOG_BUDDY_CONFIG || {};
  const enabled = Boolean(cfg.SUPABASE_URL && cfg.SUPABASE_ANON_KEY);
  const authKey = 'bb-supabase-session';
  let session = JSON.parse(localStorage.getItem(authKey) || 'null');
  const headers = (extra = {}) => ({
    apikey: cfg.SUPABASE_ANON_KEY,
    Authorization: `Bearer ${session?.access_token || cfg.SUPABASE_ANON_KEY}`,
    'Content-Type': 'application/json',
    ...extra
  });
  async function request(path, options = {}) {
    if (!enabled) throw new Error('Supabase is not configured');
    const response = await fetch(`${cfg.SUPABASE_URL}${path}`, {...options, headers: headers(options.headers)});
    const data = response.status === 204 ? null : await response.json().catch(() => null);
    if (!response.ok) throw new Error(data?.msg || data?.message || data?.error_description || `Request failed (${response.status})`);
    return data;
  }
  function save(next) { session = next; next ? localStorage.setItem(authKey, JSON.stringify(next)) : localStorage.removeItem(authKey); window.dispatchEvent(new CustomEvent('bb-auth-change', {detail: session})); }
  async function signUp(email, password, fullName) {
    const data = await request('/auth/v1/signup', {method:'POST', body:JSON.stringify({email,password,data:{full_name:fullName}})});
    if (data.access_token) save(data); return data;
  }
  async function signIn(email, password) {
    const data = await request('/auth/v1/token?grant_type=password', {method:'POST',body:JSON.stringify({email,password})}); save(data); return data;
  }
  async function signOut() { try { await request('/auth/v1/logout', {method:'POST'}); } finally { save(null); } }
  async function getSubjects() { return request('/rest/v1/subjects?select=id,name,code,description,branches(code),units(count)&active=eq.true&order=name'); }
  async function getPapers() { return request('/rest/v1/papers?select=id,exam_year,exam_type,file_url,license_type,subjects(name,code,semesters(label),regulations(code),universities(code))&verified_at=not.is.null&order=exam_year.desc'); }
  async function getProfile() { if (!session?.user?.id) return null; const rows=await request(`/rest/v1/profiles?id=eq.${session.user.id}&select=*`); return rows[0]||null; }
  async function saveStudyPlan(plan) { return request('/rest/v1/study_plans', {method:'POST',headers:{Prefer:'return=representation'},body:JSON.stringify(plan)}); }
  return {enabled, signUp, signIn, signOut, getSubjects, getPapers, getProfile, saveStudyPlan, get session(){return session;}};
})();
