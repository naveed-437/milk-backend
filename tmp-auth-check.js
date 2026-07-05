const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();
const fetch = require('node-fetch');

(async () => {
  try {
    const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);
    const email = process.env.TEST_EMAIL || 'test@example.com';
    const password = process.env.TEST_PASSWORD || 'Test1234!';

    console.log('LOGIN ATTEMPT', email);
    const login = await supabase.auth.signInWithPassword({ email, password });
    console.log('LOGIN_ERROR', login.error ? login.error.message : 'ok');
    console.log('TOKEN_PRESENT', Boolean(login.data?.session?.access_token));

    if (!login.data?.session?.access_token) {
      process.exit(0);
    }

    const token = login.data.session.access_token;
    const res = await fetch('http://127.0.0.1:5000/api/dashboard/overview', {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    const body = await res.text();
    console.log('STATUS', res.status);
    console.log('BODY', body);
  } catch (err) {
    console.error('EXCEPTION', err);
  }
})();
