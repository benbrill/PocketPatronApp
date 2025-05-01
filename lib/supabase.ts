import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';
import 'react-native-url-polyfill/auto';

const supabaseUrl = 'https://vygupxxkyumsyvqotetf.supabase.co';
const supabaseAnonKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ5Z3VweHhreXVtc3l2cW90ZXRmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzUwMDIzNDksImV4cCI6MjA1MDU3ODM0OX0.N0wHpJCjQPavCQoi1d810k2fDzgcFFukNQmrEdNo_xw';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: false, // changed
    detectSessionInUrl: false,
  },
});
