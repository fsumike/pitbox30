# Race Type Feature - Implementation Summary

## Overview
Added the ability for users to categorize their saved setups by race type, allowing them to track which setups worked best for different racing scenarios.

## Race Type Options
Users can now categorize setups as:
- **Hot Laps** - Practice and qualifying runs
- **Heat Race** - Preliminary races
- **D Main** - Fourth-tier main event
- **C Main** - Third-tier main event
- **B Main** - Second-tier main event
- **A Main** - Top-tier main event

## What Was Changed

### 1. Database Schema
**File: `ADD_RACE_TYPE_MIGRATION.sql`**
- Added `race_type` column to `setups` table
- Constraint ensures only valid race types can be saved
- Added index for efficient filtering
- Fully backward compatible (existing setups will show no race type)

### 2. Type Definitions
**File: `src/types/index.ts`**
- Added `RaceType` type with all valid options
- Added `RACE_TYPE_OPTIONS` constant for UI dropdowns
- Updated `Setup` interface to include optional `race_type` field

### 3. Setup Sheet Component
**File: `src/components/SetupSheet.tsx`**
- Added race type dropdown selector below the best lap time input
- Selector is optional - users can leave it blank
- Race type value is saved with the setup
- Loads existing race type when editing a setup

### 4. Setups Hook
**File: `src/hooks/useSetups.ts`**
- Updated `saveSetup` function to accept and save race type
- Race type is included in the setup data sent to database

### 5. Saved Setups Page
**File: `src/pages/SavedSetups.tsx`**
- Added race type filter dropdown in the Filter & Sort panel
- Filter allows viewing setups by specific race type or all types
- Race type is displayed on each setup card with a blue badge
- Shows the human-readable label (e.g., "A Main" instead of "a_main")

## How to Use

### For Users:

1. **Saving a Setup with Race Type:**
   - Fill out your setup sheet as normal
   - Scroll down to find "Race Type (optional)"
   - Select the appropriate race type from the dropdown
   - Click "Save Setup"

2. **Viewing Setups by Race Type:**
   - Go to Saved Setups for any car class
   - Click "Filter & Sort" button
   - Use the "Filter by Race Type" dropdown
   - Select a race type to see only those setups

3. **Identifying Race Types:**
   - Look for the blue badge on setup cards
   - Badge appears below best lap time (if present)
   - Shows clear labels like "Heat Race" or "A Main"

### For Admins:

**IMPORTANT: You must run the database migration!**

1. Go to your Supabase Dashboard
2. Navigate to SQL Editor
3. Open the file `ADD_RACE_TYPE_MIGRATION.sql`
4. Copy the entire SQL script
5. Paste into SQL Editor and click "Run"
6. Verify success (should show "Success. No rows returned")

## Technical Details

### Database Column
```sql
race_type TEXT CHECK (
  race_type IS NULL OR
  race_type IN ('hot_laps', 'heat_race', 'd_main', 'c_main', 'b_main', 'a_main')
)
```

### Type Safety
- TypeScript type guards ensure only valid race types
- UI dropdowns prevent invalid input
- Database constraint provides final validation layer

### Performance
- Added index on `race_type` column for fast filtering
- Index only includes non-null values (partial index)
- Filter operations are efficient even with thousands of setups

## Backward Compatibility

- ✅ Existing setups continue to work (race_type is null)
- ✅ No data migration needed
- ✅ Optional field - users can ignore if not needed
- ✅ Filter defaults to "All Race Types"
- ✅ No UI clutter - only shows badge when race type is set

## Benefits

1. **Better Organization** - Quickly find setups for specific race situations
2. **Performance Tracking** - Compare which setups work best for heats vs. mains
3. **Strategic Planning** - Reference successful A Main setups vs. practice setups
4. **Data Analysis** - Track trends across different race types
5. **Team Communication** - Share context about when a setup was used

## Future Enhancements (Possible)

- Add statistics: "You've saved 15 A Main setups with avg lap time of..."
- Quick filters: Show buttons for each race type above the list
- Sort by race type: Group setups by race type in the display
- Race type insights: "Your fastest A Main setup was at [track]"
- Bulk operations: "Export all A Main setups"

## Notes

- Race type is completely optional
- Users can edit existing setups to add race type retroactively
- The feature works on all car classes
- Mobile-friendly design with proper touch targets
- Works offline (value is cached until sync)
