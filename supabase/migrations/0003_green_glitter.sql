/*
  # Create documents table for AI-generated content

  1. New Tables
    - `documents`
      - `id` (uuid, primary key)
      - `doctor_id` (uuid, references doctor_profiles)
      - `patient_id` (uuid, references patients)
      - `type` (text)
      - `content` (text)
      - `model` (text)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on `documents` table
    - Add policies for doctors to manage their documents
*/

CREATE TABLE IF NOT EXISTS documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  doctor_id uuid REFERENCES doctor_profiles(id) NOT NULL,
  patient_id uuid REFERENCES patients(id) NOT NULL,
  type text NOT NULL,
  content text NOT NULL,
  model text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE documents ENABLE ROW LEVEL SECURITY;

-- Doctors can only see their own documents
CREATE POLICY "Doctors can view their own documents"
  ON documents
  FOR SELECT
  TO authenticated
  USING (doctor_id = auth.uid());

-- Doctors can only create documents for their patients
CREATE POLICY "Doctors can create documents"
  ON documents
  FOR INSERT
  TO authenticated
  WITH CHECK (doctor_id = auth.uid());