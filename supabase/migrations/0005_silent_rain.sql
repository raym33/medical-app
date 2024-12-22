/*
  # Add default doctor account

  1. Changes
    - Creates default doctor account with email: doctor@example.com
    - Adds corresponding doctor profile
  
  2. Security
    - Password is hashed
    - RLS policies already in place from previous migrations
*/

-- Create default doctor account
INSERT INTO auth.users (
  id,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  raw_app_meta_data,
  raw_user_meta_data,
  is_super_admin,
  role
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  'doctor@example.com',
  crypt('password123', gen_salt('bf')),
  now(),
  now(),
  now(),
  '{"provider":"email","providers":["email"]}',
  '{}',
  false,
  'authenticated'
) ON CONFLICT (id) DO NOTHING;

-- Create doctor profile
INSERT INTO doctor_profiles (
  id,
  full_name,
  specialty,
  license_number
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  'Dr. Sarah Mitchell',
  'Family Medicine',
  'LIC123456'
) ON CONFLICT (id) DO NOTHING;