import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Validate environment variables
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please check your .env file and ensure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set.')
}

// Validate URL format
try {
  new URL(supabaseUrl)
} catch (error) {
  throw new Error(`Invalid Supabase URL format: "${supabaseUrl}". Please ensure your VITE_SUPABASE_URL includes the protocol (e.g., https://your-project-id.supabase.co)`)
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Quiz = {
  id: string
  question: string
  option_a: string
  option_b: string
  option_c: string
  option_d: string
  correct_option: 'A' | 'B' | 'C' | 'D'
  created_at: string
}

export type Participant = {
  id?: string
  name: string
  mobile: string
  correct_count: number
  submitted_at?: string
}