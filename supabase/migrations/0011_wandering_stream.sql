/*
  # Add Patient Records Support

  1. New Tables
    - `patient_records`
      - `id` (uuid, primary key)
      - `patient_id` (uuid, references patients)
      - `doctor_id` (uuid, references doctor_profiles)
      - `diagnosis` (text)
      - `prescription` (text)
      - `blockchain_hash` (text)
      - `created_at` (timestamptz)
      
  2. Security
    - Enable RLS on patient_records table
    - Add policies for record access
*/

CREATE TABLE IF NOT EXISTS patient_records (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id uuid REFERENCES patients(id) NOT NULL,
  doctor_id uuid REFERENCES doctor_profiles(id) NOT NULL,
  diagnosis text NOT NULL,
  prescription text,
  blockchain_hash text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE patient_records ENABLE ROW LEVEL SECURITY;

-- Doctors can view records they created
CREATE POLICY "Doctors can view records they created"
  ON patient_records
  FOR SELECT
  TO authenticated
  USING (doctor_id = auth.uid());

-- Patients can view their own records
CREATE POLICY "Patients can view their own records"
  ON patient_records
  FOR SELECT
  USING (patient_id = auth.uid());

-- Doctors can create records for their patients
CREATE POLICY "Doctors can create records"
  ON patient_records
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM patients
      WHERE patients.id = patient_id
      AND patients.doctor_id = auth.uid()
    )
  );

-- Add audit trigger
CREATE TRIGGER audit_patient_records_changes
  AFTER INSERT OR UPDATE OR DELETE ON patient_records
  FOR EACH ROW EXECUTE FUNCTION log_audit_event();

-- Add indexes
CREATE INDEX idx_patient_records_patient_id ON patient_records(patient_id);
CREATE INDEX idx_patient_records_doctor_id ON patient_records(doctor_id);
CREATE INDEX idx_patient_records_created_at ON patient_records(created_at);