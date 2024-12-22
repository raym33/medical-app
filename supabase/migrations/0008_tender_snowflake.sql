/*
  # Enhanced Doctor Security Schema

  1. New Tables
    - `doctor_security_settings`
      - Stores doctor-specific security preferences and requirements
    - `doctor_sessions`
      - Tracks active doctor sessions with device info
    - `doctor_access_logs` 
      - Detailed audit trail of all access attempts
    
  2. Security Features
    - Multi-factor authentication support
    - IP-based access restrictions
    - Session management
    - Detailed audit logging
*/

-- Doctor security settings
CREATE TABLE IF NOT EXISTS doctor_security_settings (
  id uuid PRIMARY KEY REFERENCES doctor_profiles(id),
  mfa_enabled boolean DEFAULT false,
  allowed_ips text[],
  max_sessions integer DEFAULT 3,
  password_expires_days integer DEFAULT 90,
  last_password_change timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Doctor sessions
CREATE TABLE IF NOT EXISTS doctor_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  doctor_id uuid REFERENCES doctor_profiles(id) NOT NULL,
  device_info jsonb NOT NULL,
  ip_address text NOT NULL,
  last_active timestamptz DEFAULT now(),
  expires_at timestamptz NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Doctor access logs
CREATE TABLE IF NOT EXISTS doctor_access_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  doctor_id uuid REFERENCES doctor_profiles(id),
  action text NOT NULL,
  status text NOT NULL,
  ip_address text,
  device_info jsonb,
  details jsonb,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE doctor_security_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE doctor_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE doctor_access_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Doctors can read own security settings"
  ON doctor_security_settings
  FOR SELECT
  TO authenticated
  USING (id = auth.uid());

CREATE POLICY "Doctors can update own security settings"
  ON doctor_security_settings
  FOR UPDATE
  TO authenticated
  USING (id = auth.uid());

CREATE POLICY "Doctors can view own sessions"
  ON doctor_sessions
  FOR SELECT
  TO authenticated
  USING (doctor_id = auth.uid());

CREATE POLICY "Doctors can manage own sessions"
  ON doctor_sessions
  FOR ALL
  TO authenticated
  USING (doctor_id = auth.uid());

-- Functions
CREATE OR REPLACE FUNCTION check_doctor_security()
RETURNS trigger AS $$
BEGIN
  -- Check if password needs to be changed
  IF EXISTS (
    SELECT 1 FROM doctor_security_settings
    WHERE id = auth.uid()
    AND last_password_change + (password_expires_days || ' days')::interval < now()
  ) THEN
    RAISE EXCEPTION 'Password expired. Please change your password.';
  END IF;

  -- Check IP restrictions
  IF EXISTS (
    SELECT 1 FROM doctor_security_settings
    WHERE id = auth.uid()
    AND array_length(allowed_ips, 1) > 0
    AND NOT (current_setting('request.headers')::json->>'x-real-ip' = ANY(allowed_ips))
  ) THEN
    RAISE EXCEPTION 'Access denied from this IP address.';
  END IF;

  -- Check maximum sessions
  IF EXISTS (
    SELECT 1 FROM doctor_security_settings ds
    JOIN doctor_sessions s ON s.doctor_id = ds.id
    WHERE ds.id = auth.uid()
    GROUP BY ds.max_sessions
    HAVING count(*) >= ds.max_sessions
  ) THEN
    RAISE EXCEPTION 'Maximum number of active sessions reached.';
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Triggers
CREATE TRIGGER check_doctor_security_on_login
  AFTER INSERT ON doctor_sessions
  FOR EACH ROW
  EXECUTE FUNCTION check_doctor_security();

-- Indexes
CREATE INDEX idx_doctor_sessions_doctor_id ON doctor_sessions(doctor_id);
CREATE INDEX idx_doctor_sessions_expires_at ON doctor_sessions(expires_at);
CREATE INDEX idx_doctor_access_logs_doctor_id ON doctor_access_logs(doctor_id);
CREATE INDEX idx_doctor_access_logs_created_at ON doctor_access_logs(created_at);