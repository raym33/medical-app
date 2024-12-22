/*
  # Enhanced Security for Medical Records

  1. New Tables
    - `encrypted_patient_data`: Stores sensitive patient information with encryption
      - `id` (uuid, primary key)
      - `patient_id` (uuid, references patients)
      - `data_type` (text): Type of encrypted data (e.g., 'medical_history', 'diagnosis')
      - `encrypted_data` (text): Encrypted medical data
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

    - `audit_logs`: Tracks all data access and modifications
      - `id` (uuid, primary key)
      - `user_id` (uuid): ID of the user performing the action
      - `action_type` (text): Type of action performed
      - `table_name` (text): Name of the table affected
      - `record_id` (uuid): ID of the affected record
      - `timestamp` (timestamptz)
      - `ip_address` (text): IP address of the request

  2. Security
    - Enable RLS on new tables
    - Add policies for data access control
    - Add audit logging triggers
*/

-- Create encrypted_patient_data table
CREATE TABLE IF NOT EXISTS encrypted_patient_data (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id uuid REFERENCES patients(id) NOT NULL,
  data_type text NOT NULL,
  encrypted_data text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create audit_logs table
CREATE TABLE IF NOT EXISTS audit_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id),
  action_type text NOT NULL,
  table_name text NOT NULL,
  record_id uuid NOT NULL,
  timestamp timestamptz DEFAULT now(),
  ip_address text
);

-- Enable RLS
ALTER TABLE encrypted_patient_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Policies for encrypted_patient_data
CREATE POLICY "Doctors can read their patients' encrypted data"
  ON encrypted_patient_data
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM patients
      WHERE patients.id = encrypted_patient_data.patient_id
      AND patients.doctor_id = auth.uid()
    )
  );

CREATE POLICY "Doctors can insert encrypted data for their patients"
  ON encrypted_patient_data
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM patients
      WHERE patients.id = encrypted_patient_data.patient_id
      AND patients.doctor_id = auth.uid()
    )
  );

-- Policies for audit_logs
CREATE POLICY "Doctors can read audit logs for their actions"
  ON audit_logs
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- Create audit logging function
CREATE OR REPLACE FUNCTION log_audit_event()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO audit_logs (
    user_id,
    action_type,
    table_name,
    record_id,
    ip_address
  ) VALUES (
    auth.uid(),
    TG_OP,
    TG_TABLE_NAME,
    CASE
      WHEN TG_OP = 'DELETE' THEN OLD.id
      ELSE NEW.id
    END,
    current_setting('request.headers', true)::json->>'x-forwarded-for'
  );
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Add audit triggers to sensitive tables
CREATE TRIGGER audit_patients_changes
  AFTER INSERT OR UPDATE OR DELETE ON patients
  FOR EACH ROW EXECUTE FUNCTION log_audit_event();

CREATE TRIGGER audit_encrypted_data_changes
  AFTER INSERT OR UPDATE OR DELETE ON encrypted_patient_data
  FOR EACH ROW EXECUTE FUNCTION log_audit_event();

-- Add updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add updated_at triggers
CREATE TRIGGER update_encrypted_patient_data_updated_at
  BEFORE UPDATE ON encrypted_patient_data
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();