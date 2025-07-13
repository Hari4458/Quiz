/*
  # Allow public access to quizzes table

  1. Security Changes
    - Add policy to allow anonymous users to read quizzes
    - Keep existing authenticated user policies intact
*/

-- Allow anonymous users to read quizzes (for the quiz app)
CREATE POLICY "Allow anonymous users to read quizzes"
  ON quizzes
  FOR SELECT
  TO anon
  USING (true);