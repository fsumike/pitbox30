-- Re-populate with all 28 vehicle types
-- Source: 20251003195304_populate_default_checklists.sql

-- First, clear out any partial data
DELETE FROM default_checklists;

-- Execute the full migration from the file
-- This will be done by reading and executing the existing migration file
