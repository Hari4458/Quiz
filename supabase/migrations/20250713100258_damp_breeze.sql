/*
  # Create participants table

  1. New Tables
    - `participants`
      - `id` (uuid, primary key)
      - `name` (text, participant name)
      - `correct_count` (integer, number of correct answers)
      - `submitted_at` (timestamp, when quiz was submitted)

  2. Security
    - Enable RLS on `participants` table
    - Add policy for authenticated users to insert their own data
    - Add policy for authenticated users to read all participant data
*/

CREATE TABLE IF NOT EXISTS participants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  correct_count integer NOT NULL DEFAULT 0,
  submitted_at timestamptz DEFAULT now()
);

ALTER TABLE participants ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert participant data"
  ON participants
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Anyone can read participant data"
  ON participants
  FOR SELECT
  TO authenticated
  USING (true);