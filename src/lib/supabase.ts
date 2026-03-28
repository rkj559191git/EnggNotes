import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface Branch {
  id: string;
  name: string;
  code: string;
  created_at: string;
}

export interface Semester {
  id: string;
  number: number;
  branch_id: string;
  created_at: string;
}

export interface Subject {
  id: string;
  name: string;
  code: string;
  branch_code: string;
  semester: number;
  description?: string;
  created_at: string;
}

export interface Note {
  id: string;
  title: string;
  description?: string;
  subject_id: string;
  pdf_url: string;
  unit?: number;
  views: number;
  downloads: number;
  created_at: string;
}