import { createClient } from '@supabase/supabase-js';

const getEnvVar = (key: string): string => {
  if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env[key]) {
    return import.meta.env[key];
  }
  if (typeof process !== 'undefined' && process.env && process.env[key]) {
    return process.env[key];
  }
  return '';
};

export const SUPABASE_URL =
  getEnvVar('VITE_SUPABASE_URL') || 'https://tymudevqzzlewgtngrld.supabase.co';

export const SUPABASE_ANON_KEY =
  getEnvVar('VITE_SUPABASE_ANON_KEY') ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR5bXVkZXZxenpsZXdndG5ncmxkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTIxMDUwODUsImV4cCI6MjEwNzY4MTA4NX0.N7zuv4lHUOCTAzWuLZU5woWf6FV8ozjQdxxbOlrKK3c';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
