/*
  # Add mobile number field to participants table

  1. Changes
    - Add `mobile_number` column to `participants` table
    - Set as required field (NOT NULL)
    - Add constraint to ensure exactly 10 digits
    - Update RLS policies if needed

  2. Security
    - Maintain existing RLS policies
    - No changes to security model
*/

-- Add mobile_number column to participants table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'participants' AND column_name = 'mobile_number'
  ) THEN
    ALTER TABLE participants ADD COLUMN mobile_number text NOT NULL DEFAULT '';
    
    -- Add constraint to ensure mobile number is exactly 10 digits
    ALTER TABLE participants ADD CONSTRAINT participants_mobile_number_check 
    CHECK (mobile_number ~ '^[0-9]{10}$');
  END IF;
END $$;