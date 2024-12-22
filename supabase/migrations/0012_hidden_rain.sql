/*
  # Add Blockchain Records and Video Call Support

  1. New Tables
    - `blockchain_records`
      - `id` (uuid, primary key)
      - `record_id` (uuid, references patient_records)
      - `hash` (text)
      - `transaction_id` (text)
      - `verified` (boolean)
      - `created_at` (timestamptz)

    - `video_sessions`
      - `id` (uuid, primary key)
      - `doctor_id` (uuid, references doctor_profiles)
      - `patient_id` (uuid, references patients)
      - `start_time` (timestamptz)
      - `end_time` (timestamptz)
      - `status` (text)
      - `room_id` (text)

  2. Security
    - Enable RLS on all tables
    - Add policies for record access
    - Add audit logging
*/

-- Blockchain Records Table
CREATE TABLE IF NOT EXISTS blockchain_records (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  record_id uuid REFERENCES patient_records(id) NOT NULL,
  hash text NOT NULL,
  transaction_id text NOT NULL,
  verified boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Video Sessions Table
CREATE TABLE IF NOT EXISTS video_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  doctor_id uuid REFERENCES doctor_profiles(id) NOT NULL,
  patient_id uuid REFERENCES patients(id) NOT NULL,
  start_time timestamptz NOT NULL,
  end_time timestamptz,
  status text CHECK (status IN ('waiting', 'active', 'completed', 'cancelled')),
  room_id text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE blockchain_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE video_sessions ENABLE ROW LEVEL SECURITY;

-- Blockchain Records Policies
CREATE POLICY "Users can view their own blockchain records"
  ON blockchain_records
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM patient_records pr
      WHERE pr.id = record_id
      AND (pr.doctor_id = auth.uid() OR pr.patient_id = auth.uid())
    )
  );

-- Video Sessions Policies
CREATE POLICY "Doctors can manage their video sessions"
  ON video_sessions
  FOR ALL
  TO authenticated
  USING (doctor_id = auth.uid());

CREATE POLICY "Patients can view their video sessions"
  ON video_sessions
  FOR SELECT
  USING (patient_id = auth.uid());

-- Add audit triggers
CREATE TRIGGER audit_blockchain_records_changes
  AFTER INSERT OR UPDATE OR DELETE ON blockchain_records
  FOR EACH ROW EXECUTE FUNCTION log_audit_event();

CREATE TRIGGER audit_video_sessions_changes
  AFTER INSERT OR UPDATE OR DELETE ON video_sessions
  FOR EACH ROW EXECUTE FUNCTION log_audit_event();

-- Add indexes
CREATE INDEX idx_blockchain_records_record_id ON blockchain_records(record_id);
CREATE INDEX idx_blockchain_records_hash ON blockchain_records(hash);
CREATE INDEX idx_video_sessions_doctor_id ON video_sessions(doctor_id);
CREATE INDEX idx_video_sessions_patient_id ON video_sessions(patient_id);
CREATE INDEX idx_video_sessions_status ON video_sessions(status);