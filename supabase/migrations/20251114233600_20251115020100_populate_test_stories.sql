/*
  # Populate Test Stories

  Creates sample stories for testing the story feature with racing-themed images
*/

-- Insert test stories using the first user in the database
DO $$
DECLARE
  test_user_id uuid;
  expires_time timestamptz;
BEGIN
  -- Get the first user ID from auth.users
  SELECT id INTO test_user_id FROM auth.users LIMIT 1;

  -- Set expiration to 24 hours from now
  expires_time := now() + interval '24 hours';

  -- Only insert if we found a user
  IF test_user_id IS NOT NULL THEN
    -- Story 1: Track Day
    INSERT INTO stories (user_id, media_url, media_type, duration, expires_at, text_overlay, filter, view_count)
    VALUES (
      test_user_id,
      'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7',
      'image',
      5,
      expires_time,
      'Track Day Vibes! 🏁',
      'none',
      0
    );

    -- Story 2: Race Car Close-up
    INSERT INTO stories (user_id, media_url, media_type, duration, expires_at, text_overlay, filter, view_count)
    VALUES (
      test_user_id,
      'https://images.unsplash.com/photo-1552820728-8b83bb6b773f',
      'image',
      5,
      expires_time,
      'Ready to Race!',
      'saturate',
      0
    );

    -- Story 3: Pit Stop
    INSERT INTO stories (user_id, media_url, media_type, duration, expires_at, text_overlay, filter, view_count)
    VALUES (
      test_user_id,
      'https://images.unsplash.com/photo-1580273916550-e323be2ae537',
      'image',
      5,
      expires_time,
      'Making Adjustments ⚙️',
      'contrast',
      0
    );

    -- Story 4: Victory Lane
    INSERT INTO stories (user_id, media_url, media_type, duration, expires_at, text_overlay, filter, view_count)
    VALUES (
      test_user_id,
      'https://images.unsplash.com/photo-1566023888-bd8be02bd57c',
      'image',
      5,
      expires_time,
      'Winner Winner! 🏆',
      'brightness',
      0
    );

    -- Story 5: Night Race
    INSERT INTO stories (user_id, media_url, media_type, duration, expires_at, text_overlay, filter, view_count)
    VALUES (
      test_user_id,
      'https://images.unsplash.com/photo-1516652589117-5fec46f75224',
      'image',
      5,
      expires_time,
      'Friday Night Lights',
      'none',
      0
    );

    RAISE NOTICE 'Successfully created 5 test stories for user %', test_user_id;
  ELSE
    RAISE NOTICE 'No users found in database. Please create a user first.';
  END IF;
END $$;
