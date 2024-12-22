/*
  # Create voice notes table

  1. New Tables
    - `voice_notes`
      - `id` (uuid, primary key)
      - `doctor_id` (uuid, references doctor_profiles)
      - `patient_id` (uuid, references patients)
      - `transcription` (text)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on `voice_notes` table
    - Add policies for doctors to manage their voice notes
*/

CREATE TABLE IF NOT EXISTS voice_notes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  doctor_id uuid REFERENCES doctor_profiles(id) NOT NULL,
  patient_id uuid REFERENCES patients(id) NOT NULL,
  transcription text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE voice_notes ENABLE ROW LEVEL SECURITY;

-- Doctors can only see their own voice notes
CREATE POLICY "Doctors can view their own voice notes"
  ON voice_notes
  FOR SELECT
  TO authenticated
  USING (doctor_id = auth.uid());

-- Doctors can only create voice notes for their patients
CREATE POLICY "Doctors can create voice notes"
  ON voice_notes
  FOR INSERT
  TO authenticated
  WITH CHECK (doctor_id = auth.uid());