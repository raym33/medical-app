/*
  # Add Payment Support Tables

  1. New Tables
    - `payments`
      - `id` (uuid, primary key)
      - `doctor_address` (text)
      - `patient_address` (text)
      - `amount` (numeric)
      - `transaction_hash` (text)
      - `timestamp` (timestamptz)
      
  2. Security
    - Enable RLS on payments table
    - Add policies for payment access
*/

-- Create payments table
CREATE TABLE IF NOT EXISTS payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  doctor_address text NOT NULL,
  patient_address text NOT NULL,
  amount numeric NOT NULL,
  transaction_hash text NOT NULL UNIQUE,
  timestamp timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- Doctors can view their received payments
CREATE POLICY "Doctors can view their payments"
  ON payments
  FOR SELECT
  TO authenticated
  USING (doctor_address = current_user);

-- Add audit trigger
CREATE TRIGGER audit_payments_changes
  AFTER INSERT OR UPDATE OR DELETE ON payments
  FOR EACH ROW EXECUTE FUNCTION log_audit_event();

-- Add indexes
CREATE INDEX idx_payments_doctor_address ON payments(doctor_address);
CREATE INDEX idx_payments_patient_address ON payments(patient_address);
CREATE INDEX idx_payments_timestamp ON payments(timestamp);