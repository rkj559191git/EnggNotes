/*
  # FreeEnggNotes Database Schema

  ## Overview
  This migration creates the complete database structure for the FreeEnggNotes platform,
  enabling engineering students to browse and download study materials organized by
  branch, semester, and subject.

  ## New Tables

  ### 1. `branches`
  Stores engineering branches (CSE, ME, CE, EE, EC, Civil)
  - `id` (uuid, primary key) - Unique identifier
  - `name` (text) - Branch full name (e.g., "Computer Science Engineering")
  - `code` (text, unique) - Branch code (e.g., "CSE")
  - `created_at` (timestamptz) - Record creation timestamp

  ### 2. `semesters`
  Stores semester information (1st to 8th)
  - `id` (uuid, primary key) - Unique identifier
  - `number` (integer, unique) - Semester number (1-8)
  - `name` (text) - Semester display name (e.g., "1st Semester")
  - `created_at` (timestamptz) - Record creation timestamp

  ### 3. `subjects`
  Stores subject information linked to branches and semesters
  - `id` (uuid, primary key) - Unique identifier
  - `name` (text) - Subject name (e.g., "Data Structures")
  - `code` (text) - Subject code (e.g., "CS201")
  - `branch_id` (uuid, foreign key) - Reference to branches table
  - `semester_id` (uuid, foreign key) - Reference to semesters table
  - `description` (text) - Subject description
  - `created_at` (timestamptz) - Record creation timestamp

  ### 4. `notes`
  Stores individual notes/study materials with PDF URLs
  - `id` (uuid, primary key) - Unique identifier
  - `title` (text) - Note title
  - `description` (text) - Note description
  - `subject_id` (uuid, foreign key) - Reference to subjects table
  - `pdf_url` (text) - Google Drive or direct PDF URL
  - `views` (integer) - View count for analytics
  - `downloads` (integer) - Download count for analytics
  - `created_at` (timestamptz) - Record creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp

  ## Security

  ### Row Level Security (RLS)
  - All tables have RLS enabled for data protection
  - Public read access for browsing (unauthenticated users can view)
  - Write access restricted to authenticated users (for admin panel)

  ### Policies

  #### branches table
  1. Public read access - Anyone can view branches
  2. Authenticated insert - Only logged-in users can add branches
  3. Authenticated update - Only logged-in users can update branches
  4. Authenticated delete - Only logged-in users can delete branches

  #### semesters table
  1. Public read access - Anyone can view semesters
  2. Authenticated insert - Only logged-in users can add semesters
  3. Authenticated update - Only logged-in users can update semesters
  4. Authenticated delete - Only logged-in users can delete semesters

  #### subjects table
  1. Public read access - Anyone can view subjects
  2. Authenticated insert - Only logged-in users can add subjects
  3. Authenticated update - Only logged-in users can update subjects
  4. Authenticated delete - Only logged-in users can delete subjects

  #### notes table
  1. Public read access - Anyone can view notes
  2. Authenticated insert - Only logged-in users can add notes
  3. Authenticated update - Only logged-in users can update notes
  4. Authenticated delete - Only logged-in users can delete notes

  ## Indexes
  - Created indexes on foreign keys for optimal query performance
  - Created index on subject name for efficient search functionality

  ## Notes
  - All IDs use UUID for security and scalability
  - Timestamps use timestamptz for timezone awareness
  - Foreign key constraints ensure data integrity
  - Default values prevent null-related errors
  - Cascading deletes maintain referential integrity
*/

-- Create branches table
CREATE TABLE IF NOT EXISTS branches (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  code text UNIQUE NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create semesters table
CREATE TABLE IF NOT EXISTS semesters (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  number integer UNIQUE NOT NULL CHECK (number >= 1 AND number <= 8),
  name text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create subjects table
CREATE TABLE IF NOT EXISTS subjects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  code text NOT NULL,
  branch_id uuid NOT NULL REFERENCES branches(id) ON DELETE CASCADE,
  semester_id uuid NOT NULL REFERENCES semesters(id) ON DELETE CASCADE,
  description text DEFAULT '',
  created_at timestamptz DEFAULT now()
);

-- Create notes table
CREATE TABLE IF NOT EXISTS notes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text DEFAULT '',
  subject_id uuid NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
  pdf_url text NOT NULL,
  views integer DEFAULT 0,
  downloads integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_subjects_branch_id ON subjects(branch_id);
CREATE INDEX IF NOT EXISTS idx_subjects_semester_id ON subjects(semester_id);
CREATE INDEX IF NOT EXISTS idx_subjects_name ON subjects(name);
CREATE INDEX IF NOT EXISTS idx_notes_subject_id ON notes(subject_id);

-- Enable Row Level Security
ALTER TABLE branches ENABLE ROW LEVEL SECURITY;
ALTER TABLE semesters ENABLE ROW LEVEL SECURITY;
ALTER TABLE subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE notes ENABLE ROW LEVEL SECURITY;

-- RLS Policies for branches
CREATE POLICY "Public read access for branches"
  ON branches FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Authenticated users can insert branches"
  ON branches FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update branches"
  ON branches FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete branches"
  ON branches FOR DELETE
  TO authenticated
  USING (true);

-- RLS Policies for semesters
CREATE POLICY "Public read access for semesters"
  ON semesters FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Authenticated users can insert semesters"
  ON semesters FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update semesters"
  ON semesters FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete semesters"
  ON semesters FOR DELETE
  TO authenticated
  USING (true);

-- RLS Policies for subjects
CREATE POLICY "Public read access for subjects"
  ON subjects FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Authenticated users can insert subjects"
  ON subjects FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update subjects"
  ON subjects FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete subjects"
  ON subjects FOR DELETE
  TO authenticated
  USING (true);

-- RLS Policies for notes
CREATE POLICY "Public read access for notes"
  ON notes FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Authenticated users can insert notes"
  ON notes FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update notes"
  ON notes FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete notes"
  ON notes FOR DELETE
  TO authenticated
  USING (true);

-- Insert default branches
INSERT INTO branches (name, code) VALUES
  ('Computer Science Engineering', 'CSE'),
  ('Mechanical Engineering', 'ME'),
  ('Civil Engineering', 'CE'),
  ('Electrical Engineering', 'EE'),
  ('Electronics & Communication', 'EC'),
  ('Civil Engineering', 'CIVIL')
ON CONFLICT (code) DO NOTHING;

-- Insert default semesters
INSERT INTO semesters (number, name) VALUES
  (1, '1st Semester'),
  (2, '2nd Semester'),
  (3, '3rd Semester'),
  (4, '4th Semester'),
  (5, '5th Semester'),
  (6, '6th Semester'),
  (7, '7th Semester'),
  (8, '8th Semester')
ON CONFLICT (number) DO NOTHING;
