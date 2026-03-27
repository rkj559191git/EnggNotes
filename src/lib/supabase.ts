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
  name: string;
  created_at: string;
}

export interface Subject {
  id: string;
  name: string;
  code: string;
  branch_id: string;
  semester_id: string;
  description: string;
  created_at: string;
}

export interface Note {
  id: string;
  title: string;
  description: string;
  subject_id: string;
  pdf_url: string;
  views: number;
  downloads: number;
  created_at: string;
  updated_at: string;
}
