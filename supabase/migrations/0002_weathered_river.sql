/*
  # Create patients management system

  1. New Tables
    - `patients`
      - `id` (uuid, primary key)
      - `doctor_id` (uuid, references doctor_profiles)
      - `first_name` (text)
      - `last_name` (text)
      - `date_of_birth` (date)
      - `gender` (text)
      - `email` (text)
      - `phone` (text)
      - `address` (text)
      - `medical_history` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `patients` table
    - Add policies for doctors to manage their patients
*/

CREATE TABLE IF NOT EXISTS patients (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  doctor_id uuid REFERENCES doctor_profiles(id) NOT NULL,
  first_name text NOT NULL,
  last_name text NOT NULL,
  date_of_birth date NOT NULL,
  gender text NOT NULL,
  email text,
  phone text,
  address text,
  medical_history text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE patients ENABLE ROW LEVEL SECURITY;

-- Doctors can only see their own patients
CREATE POLICY "Doctors can view their own patients"
  ON patients
  FOR SELECT
  TO authenticated
  USING (doctor_id = auth.uid());

-- Doctors can only insert patients for themselves
CREATE POLICY "Doctors can add their own patients"
  ON patients
  FOR INSERT
  TO authenticated
  WITH CHECK (doctor_id = auth.uid());

-- Doctors can only update their own patients
CREATE POLICY "Doctors can update their own patients"
  ON patients
  FOR UPDATE
  TO authenticated
  USING (doctor_id = auth.uid());