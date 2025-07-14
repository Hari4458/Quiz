/*
  # Add mobile number field to participants table

  1. Changes
    - Add `mobile_number` column to `participants` table
    - Column is required (NOT NULL)
    - Add check constraint for basic mobile number validation

  2. Security
    - No changes to existing RLS policies
*/

-- Add mobile_number column to participants table
ALTER TABLE participants 
ADD COLUMN mobile_number text NOT NULL DEFAULT '';

-- Add a basic check constraint for mobile number (10-15 digits)
ALTER TABLE participants 
ADD CONSTRAINT participants_mobile_number_check 
CHECK (mobile_number ~ '^[0-9]{10,15}$');

-- Remove the default after adding the column
ALTER TABLE participants 
ALTER COLUMN mobile_number DROP DEFAULT;