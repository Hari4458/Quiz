/*
  # Add sample quiz data

  1. Sample Data
    - Adds 5 sample quiz questions to the `quizzes` table
    - Each quiz has a question, 4 options (A, B, C, D), and correct answer
    - Questions cover general knowledge topics

  2. Data Structure
    - All questions follow the existing table schema
    - Correct options are properly set as A, B, C, or D
    - Created timestamps will be set automatically
*/

INSERT INTO quizzes (question, option_a, option_b, option_c, option_d, correct_option) VALUES
(
  'What is the capital of France?',
  'London',
  'Berlin',
  'Paris',
  'Madrid',
  'C'
),
(
  'Which planet is known as the Red Planet?',
  'Venus',
  'Mars',
  'Jupiter',
  'Saturn',
  'B'
),
(
  'What is the largest mammal in the world?',
  'African Elephant',
  'Blue Whale',
  'Giraffe',
  'Polar Bear',
  'B'
),
(
  'In which year did World War II end?',
  '1944',
  '1945',
  '1946',
  '1947',
  'B'
),
(
  'What is the chemical symbol for gold?',
  'Go',
  'Gd',
  'Au',
  'Ag',
  'C'
);