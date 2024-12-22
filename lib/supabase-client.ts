"use client";

import { createClient } from '@supabase/supabase-js';

// Mock data for development/testing
export const mockData = {
  patients: [
    {
      id: '1',
      first_name: 'John',
      last_name: 'Doe',
      date_of_birth: '1990-01-01',
      email: 'john@example.com',
      phone: '123-456-7890',
      created_at: new Date().toISOString(),
    },
    {
      id: '2',
      first_name: 'Jane',
      last_name: 'Smith',
      date_of_birth: '1985-05-15',
      email: 'jane@example.com',
      phone: '098-765-4321',
      created_at: new Date().toISOString(),
    },
  ],
  voiceNotes: [
    {
      id: '1',
      transcription: 'Patient reports mild fever and cough...',
      created_at: new Date().toISOString(),
      patients: {
        id: '1',
        first_name: 'John',
        last_name: 'Doe'
      }
    }
  ]
};

// Initialize Supabase client with fallback to mock data
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://mock.supabase.co',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'mock-key'
);