/*
  # Add Video Call Support

  1. New Tables
    - `video_calls`
      - `id` (uuid, primary key)
      - `doctor_id` (uuid, references doctor_profiles)
      - `patient_id` (uuid, references patients)
      - `start_time` (timestamptz)
      - `end_time` (timestamptz)
      - `status` (text)
      - `duration` (interval, computed)
      
  2. Security
    - Enable RLS on video_calls table
    - Add policies for video call access
*/

-- Create video_calls table
CREATE TABLE IF NOT EXISTS video_calls (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  doctor_id uuid REFERENCES doctor_profiles(id) NOT NULL,
  patient_id uuid REFERENCES patients(id) NOT NULL,
  start_time timestamptz NOT NULL,
  end_time timestamptz,
  status text NOT NULL CHECK (status IN ('active', 'completed', 'failed')),
  created_at timestamptz DEFAULT now(),
  duration interval GENERATED ALWAYS AS (end_time - start_time) STORED
);

-- Enable RLS
ALTER TABLE video_calls ENABLE ROW LEVEL SECURITY;

-- Doctors can view their own video calls
CREATE POLICY "Doctors can view their video calls"
  ON video_calls
  FOR SELECT
  TO authenticated
  USING (doctor_id = auth.uid());

-- Doctors can create video calls for their patients
CREATE POLICY "Doctors can create video calls"
  ON video_calls
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM patients
      WHERE patients.id = patient_id
      AND patients.doctor_id = auth.uid()
    )
  );

-- Doctors can update their own video calls
CREATE POLICY "Doctors can update their video calls"
  ON video_calls
  FOR UPDATE
  TO authenticated
  USING (doctor_id = auth.uid());

-- Add audit trigger
CREATE TRIGGER audit_video_calls_changes
  AFTER INSERT OR UPDATE OR DELETE ON video_calls
  FOR EACH ROW EXECUTE FUNCTION log_audit_event();

-- Add indexes
CREATE INDEX idx_video_calls_doctor_id ON video_calls(doctor_id);
CREATE INDEX idx_video_calls_patient_id ON video_calls(patient_id);
CREATE INDEX idx_video_calls_start_time ON video_calls(start_time);
CREATE INDEX idx_video_calls_status ON video_calls(status);