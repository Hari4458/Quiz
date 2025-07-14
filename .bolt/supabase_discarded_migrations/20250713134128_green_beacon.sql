@@ .. @@
 ALTER TABLE participants ADD COLUMN mobile_number text NOT NULL;

 -- Add constraint to ensure mobile number is valid (10-15 digits)
-ALTER TABLE participants ADD CONSTRAINT participants_mobile_number_check CHECK (mobile_number ~ '^[0-9]{10,15}$');
+ALTER TABLE participants ADD CONSTRAINT participants_mobile_number_check CHECK (mobile_number ~ '^[0-9]{10}$');