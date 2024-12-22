/*
  # Enhanced Medical Records Schema

  1. New Tables
    - `vital_signs`: Store patient vital measurements
      - `id` (uuid, primary key)
      - `patient_id` (uuid, references patients)
      - `blood_pressure` (text)
      - `heart_rate` (integer)
      - `temperature` (decimal)
      - `respiratory_rate` (integer)
      - `oxygen_saturation` (integer)
      - `measured_at` (timestamptz)

    - `allergies`: Track patient allergies
      - `id` (uuid, primary key)
      - `patient_id` (uuid, references patients)
      - `allergen` (text)
      - `reaction` (text)
      - `severity` (text)
      - `diagnosed_at` (timestamptz)

    - `medications`: Track prescribed medications
      - `id` (uuid, primary key)
      - `patient_id` (uuid, references patients)
      - `name` (text)
      - `dosage` (text)
      - `frequency` (text)
      - `start_date` (date)
      - `end_date` (date)
      - `instructions` (text)
      - `prescribed_by` (uuid, references doctor_profiles)

  2. Security
    - Enable RLS on all new tables
    - Add policies for data access control
    - Add audit logging triggers
*/

-- Create vital_signs table
CREATE TABLE IF NOT EXISTS vital_signs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id uuid REFERENCES patients(id) NOT NULL,
  blood_pressure text,
  heart_rate integer,
  temperature decimal(4,1),
  respiratory_rate integer,
  oxygen_saturation integer,
  measured_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

-- Create allergies table
CREATE TABLE IF NOT EXISTS allergies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id uuid REFERENCES patients(id) NOT NULL,
  allergen text NOT NULL,
  reaction text,
  severity text CHECK (severity IN ('mild', 'moderate', 'severe')),
  diagnosed_at timestamptz,
  created_at timestamptz DEFAULT now()
);

-- Create medications table
CREATE TABLE IF NOT EXISTS medications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id uuid REFERENCES patients(id) NOT NULL,
  name text NOT NULL,
  dosage text NOT NULL,
  frequency text NOT NULL,
  start_date date NOT NULL,
  end_date date,
  instructions text,
  prescribed_by uuid REFERENCES doctor_profiles(id) NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT valid_dates CHECK (end_date IS NULL OR end_date >= start_date)
);

-- Enable RLS
ALTER TABLE vital_signs ENABLE ROW LEVEL SECURITY;
ALTER TABLE allergies ENABLE ROW LEVEL SECURITY;
ALTER TABLE medications ENABLE ROW LEVEL SECURITY;

-- Policies for vital_signs
CREATE POLICY "Doctors can read their patients' vital signs"
  ON vital_signs
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM patients
      WHERE patients.id = vital_signs.patient_id
      AND patients.doctor_id = auth.uid()
    )
  );

CREATE POLICY "Doctors can insert vital signs for their patients"
  ON vital_signs
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM patients
      WHERE patients.id = vital_signs.patient_id
      AND patients.doctor_id = auth.uid()
    )
  );

-- Policies for allergies
CREATE POLICY "Doctors can read their patients' allergies"
  ON allergies
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM patients
      WHERE patients.id = allergies.patient_id
      AND patients.doctor_id = auth.uid()
    )
  );

CREATE POLICY "Doctors can manage allergies for their patients"
  ON allergies
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM patients
      WHERE patients.id = allergies.patient_id
      AND patients.doctor_id = auth.uid()
    )
  );

-- Policies for medications
CREATE POLICY "Doctors can read medications they prescribed"
  ON medications
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM patients
      WHERE patients.id = medications.patient_id
      AND patients.doctor_id = auth.uid()
    )
  );

CREATE POLICY "Doctors can manage medications they prescribe"
  ON medications
  FOR ALL
  TO authenticated
  USING (prescribed_by = auth.uid());

-- Add audit triggers
CREATE TRIGGER audit_vital_signs_changes
  AFTER INSERT OR UPDATE OR DELETE ON vital_signs
  FOR EACH ROW EXECUTE FUNCTION log_audit_event();

CREATE TRIGGER audit_allergies_changes
  AFTER INSERT OR UPDATE OR DELETE ON allergies
  FOR EACH ROW EXECUTE FUNCTION log_audit_event();

CREATE TRIGGER audit_medications_changes
  AFTER INSERT OR UPDATE OR DELETE ON medications
  FOR EACH ROW EXECUTE FUNCTION log_audit_event();

-- Add updated_at triggers for medications
CREATE TRIGGER update_medications_updated_at
  BEFORE UPDATE ON medications
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Add indexes for better query performance
CREATE INDEX idx_vital_signs_patient_id ON vital_signs(patient_id);
CREATE INDEX idx_vital_signs_measured_at ON vital_signs(measured_at);
CREATE INDEX idx_allergies_patient_id ON allergies(patient_id);
CREATE INDEX idx_medications_patient_id ON medications(patient_id);
CREATE INDEX idx_medications_prescribed_by ON medications(prescribed_by);