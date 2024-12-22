/*
  # Create doctor profiles table

  1. New Tables
    - `doctor_profiles`
      - `id` (uuid, primary key, references auth.users)
      - `full_name` (text)
      - `specialty` (text)
      - `license_number` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `doctor_profiles` table
    - Add policies for authenticated doctors to read and update their own profile
*/

CREATE TABLE IF NOT EXISTS doctor_profiles (
  id uuid PRIMARY KEY REFERENCES auth.users,
  full_name text NOT NULL,
  specialty text NOT NULL,
  license_number text NOT NULL UNIQUE,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE doctor_profiles ENABLE ROW LEVEL SECURITY;

-- Allow doctors to read their own profile
CREATE POLICY "Doctors can read own profile"
  ON doctor_profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

-- Allow doctors to update their own profile
CREATE POLICY "Doctors can update own profile"
  ON doctor_profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);