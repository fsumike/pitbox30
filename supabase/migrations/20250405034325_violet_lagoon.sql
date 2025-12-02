-- Add Hyper Racing 600 specific fields if they don't exist yet
DO $$
BEGIN
  -- Check if columns exist before adding them
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'setups' AND column_name = 'lf_shock_number') THEN
    ALTER TABLE setups ADD COLUMN lf_shock_number text DEFAULT '';
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'setups' AND column_name = 'rf_shock_number') THEN
    ALTER TABLE setups ADD COLUMN rf_shock_number text DEFAULT '';
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'setups' AND column_name = 'lr_shock_number') THEN
    ALTER TABLE setups ADD COLUMN lr_shock_number text DEFAULT '';
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'setups' AND column_name = 'rr_shock_number') THEN
    ALTER TABLE setups ADD COLUMN rr_shock_number text DEFAULT '';
  END IF;

  -- Add weight fields if they don't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'setups' AND column_name = 'lf_weight') THEN
    ALTER TABLE setups ADD COLUMN lf_weight numeric DEFAULT 0;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'setups' AND column_name = 'rf_weight') THEN
    ALTER TABLE setups ADD COLUMN rf_weight numeric DEFAULT 0;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'setups' AND column_name = 'lr_weight') THEN
    ALTER TABLE setups ADD COLUMN lr_weight numeric DEFAULT 0;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'setups' AND column_name = 'rr_weight') THEN
    ALTER TABLE setups ADD COLUMN rr_weight numeric DEFAULT 0;
  END IF;

  -- Add block height fields if they don't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'setups' AND column_name = 'lf_spring_installed_height') THEN
    ALTER TABLE setups ADD COLUMN lf_spring_installed_height numeric DEFAULT 0;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'setups' AND column_name = 'rf_spring_installed_height') THEN
    ALTER TABLE setups ADD COLUMN rf_spring_installed_height numeric DEFAULT 0;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'setups' AND column_name = 'lr_spring_installed_height') THEN
    ALTER TABLE setups ADD COLUMN lr_spring_installed_height numeric DEFAULT 0;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'setups' AND column_name = 'rr_spring_installed_height') THEN
    ALTER TABLE setups ADD COLUMN rr_spring_installed_height numeric DEFAULT 0;
  END IF;

  -- Add spring rate fields if they don't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'setups' AND column_name = 'lf_spring_rate') THEN
    ALTER TABLE setups ADD COLUMN lf_spring_rate numeric DEFAULT 0;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'setups' AND column_name = 'rf_spring_rate') THEN
    ALTER TABLE setups ADD COLUMN rf_spring_rate numeric DEFAULT 0;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'setups' AND column_name = 'lr_spring_rate') THEN
    ALTER TABLE setups ADD COLUMN lr_spring_rate numeric DEFAULT 0;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'setups' AND column_name = 'rr_spring_rate') THEN
    ALTER TABLE setups ADD COLUMN rr_spring_rate numeric DEFAULT 0;
  END IF;

  -- Add specific Hyper Racing 600 fields if they don't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'setups' AND column_name = 'king_pin_angle') THEN
    ALTER TABLE setups ADD COLUMN king_pin_angle numeric DEFAULT 0;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'setups' AND column_name = 'toe') THEN
    ALTER TABLE setups ADD COLUMN toe numeric DEFAULT 0;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'setups' AND column_name = 'jacobs_ladder_height') THEN
    ALTER TABLE setups ADD COLUMN jacobs_ladder_height numeric DEFAULT 0;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'setups' AND column_name = 'panhard_height_front') THEN
    ALTER TABLE setups ADD COLUMN panhard_height_front numeric DEFAULT 0;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'setups' AND column_name = 'panhard_height_rear') THEN
    ALTER TABLE setups ADD COLUMN panhard_height_rear numeric DEFAULT 0;
  END IF;

  -- Add engine and fuel system fields if they don't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'setups' AND column_name = 'engine_type') THEN
    ALTER TABLE setups ADD COLUMN engine_type text DEFAULT '';
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'setups' AND column_name = 'gearing') THEN
    ALTER TABLE setups ADD COLUMN gearing text DEFAULT '';
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'setups' AND column_name = 'exhaust') THEN
    ALTER TABLE setups ADD COLUMN exhaust text DEFAULT '';
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'setups' AND column_name = 'injection') THEN
    ALTER TABLE setups ADD COLUMN injection text DEFAULT '';
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'setups' AND column_name = 'fuel_pressure') THEN
    ALTER TABLE setups ADD COLUMN fuel_pressure numeric DEFAULT 0;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'setups' AND column_name = 'fuel_map') THEN
    ALTER TABLE setups ADD COLUMN fuel_map text DEFAULT '';
  END IF;
END $$;