/*
  # Allow anonymous users to insert participant data

  1. Security Changes
    - Add policy to allow anonymous (unauthenticated) users to insert participant data
    - This enables quiz participants to save their results without requiring authentication

  2. Changes
    - Create policy "Allow anonymous users to insert participant data" for INSERT operations
    - Policy applies to 'anon' role (unauthenticated users)
*/

-- Allow anonymous users to insert participant data
CREATE POLICY "Allow anonymous users to insert participant data"
  ON participants
  FOR INSERT
  TO anon
  WITH CHECK (true);