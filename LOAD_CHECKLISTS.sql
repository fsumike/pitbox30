/*
  # Populate Default Maintenance Checklists for All Vehicle Types

  1. Purpose
    - Provides detailed, class-specific maintenance checklists for all 28 vehicle types
    - Based on real racing maintenance procedures and best practices
    - Covers Post-Race, Shop/Garage, and Pre-Race maintenance categories

  2. Features
    - Users can customize these checklists by deleting unwanted items
    - Users can restore back to defaults at any time
    - Users can add their own custom items

  3. Checklist Categories
    - post_race: Immediate maintenance after racing
    - shop: Weekly/mid-week garage maintenance
    - pre_race: Final checks before heading to track
*/

-- Delete existing default checklists to start fresh
DELETE FROM default_checklists;

-- 410 SPRINTS
INSERT INTO default_checklists (vehicle_type, checklist_data) VALUES (
'410',
'{
  "post_race": [
    {"id": "410-pr-1", "text": "Wash car immediately after feature race", "completed": false, "category": "post_race"},
    {"id": "410-pr-2", "text": "Remove hood and air cleaner, plug injection stacks with towels or wash plugs", "completed": false, "category": "post_race"},
    {"id": "410-pr-3", "text": "Disconnect generator wire from mag, unplug and remove mag box", "completed": false, "category": "post_race"},
    {"id": "410-pr-4", "text": "Inspect shock travel and note any changes", "completed": false, "category": "post_race"},
    {"id": "410-pr-5", "text": "Check for chassis damage, cracks, or bent components", "completed": false, "category": "post_race"},
    {"id": "410-pr-6", "text": "Inspect torsion bars and stops for wear", "completed": false, "category": "post_race"},
    {"id": "410-pr-7", "text": "Check all wing mounting bolts and wing condition", "completed": false, "category": "post_race"},
    {"id": "410-pr-8", "text": "Inspect tires for cuts, tears, or unusual wear patterns", "completed": false, "category": "post_race"},
    {"id": "410-pr-9", "text": "Check fuel cell for leaks or damage", "completed": false, "category": "post_race"},
    {"id": "410-pr-10", "text": "Note any driver feedback about handling or mechanical issues", "completed": false, "category": "post_race"}
  ],
  "shop": [
    {"id": "410-sh-1", "text": "Change engine oil and filter", "completed": false, "category": "shop"},
    {"id": "410-sh-2", "text": "Cut open oil filter and inspect for bearing material", "completed": false, "category": "shop"},
    {"id": "410-sh-3", "text": "Inspect and torque all motor plate bolts", "completed": false, "category": "shop"},
    {"id": "410-sh-4", "text": "Check and adjust valve lash to spec", "completed": false, "category": "shop"},
    {"id": "410-sh-5", "text": "Inspect magneto timing and connections", "completed": false, "category": "shop"},
    {"id": "410-sh-6", "text": "Repack front wheel bearings with waterproof grease", "completed": false, "category": "shop"},
    {"id": "410-sh-7", "text": "Check rear axle bearings for play or noise", "completed": false, "category": "shop"},
    {"id": "410-sh-8", "text": "Inspect all suspension bushings and heim joints", "completed": false, "category": "shop"},
    {"id": "410-sh-9", "text": "Check shock shaft for straightness and seal leaks", "completed": false, "category": "shop"},
    {"id": "410-sh-10", "text": "Verify shock gas pressure and rebuild if needed", "completed": false, "category": "shop"},
    {"id": "410-sh-11", "text": "Inspect steering components and tighten all bolts", "completed": false, "category": "shop"},
    {"id": "410-sh-12", "text": "Check birdcage condition and bearing preload", "completed": false, "category": "shop"},
    {"id": "410-sh-13", "text": "Inspect chain guard and driveline components", "completed": false, "category": "shop"},
    {"id": "410-sh-14", "text": "Check fuel pump operation and filter condition", "completed": false, "category": "shop"},
    {"id": "410-sh-15", "text": "Clean or replace air filter elements", "completed": false, "category": "shop"},
    {"id": "410-sh-16", "text": "Inspect all safety equipment (belts, nets, head restraint)", "completed": false, "category": "shop"},
    {"id": "410-sh-17", "text": "Record bearing numbers and track all setup changes", "completed": false, "category": "shop"}
  ],
  "pre_race": [
    {"id": "410-pre-1", "text": "Verify fuel load and fuel cell venting", "completed": false, "category": "pre_race"},
    {"id": "410-pre-2", "text": "Check tire pressures for track conditions", "completed": false, "category": "pre_race"},
    {"id": "410-pre-3", "text": "Torque all wheel nuts to spec", "completed": false, "category": "pre_race"},
    {"id": "410-pre-4", "text": "Confirm wing angle and side board settings", "completed": false, "category": "pre_race"},
    {"id": "410-pre-5", "text": "Double-check torsion bar stops and measurements", "completed": false, "category": "pre_race"},
    {"id": "410-pre-6", "text": "Verify stagger and wheel offset", "completed": false, "category": "pre_race"},
    {"id": "410-pre-7", "text": "Check brake fluid level and pedal feel", "completed": false, "category": "pre_race"},
    {"id": "410-pre-8", "text": "Test all electrical systems (transponder, radio, ignition)", "completed": false, "category": "pre_race"},
    {"id": "410-pre-9", "text": "Confirm gear ratio matches track setup", "completed": false, "category": "pre_race"},
    {"id": "410-pre-10", "text": "Walk around inspection for any loose components", "completed": false, "category": "pre_race"}
  ]
}'::jsonb
);

-- 360 SPRINTS
INSERT INTO default_checklists (vehicle_type, checklist_data) VALUES (
'360',
'{
  "post_race": [
    {"id": "360-pr-1", "text": "Wash car immediately and inspect for damage", "completed": false, "category": "post_race"},
    {"id": "360-pr-2", "text": "Check shock travel and suspension wear", "completed": false, "category": "post_race"},
    {"id": "360-pr-3", "text": "Inspect wing components and mounting hardware", "completed": false, "category": "post_race"},
    {"id": "360-pr-4", "text": "Check tire condition and unusual wear", "completed": false, "category": "post_race"},
    {"id": "360-pr-5", "text": "Note any chassis damage or bent parts", "completed": false, "category": "post_race"}
  ],
  "shop": [
    {"id": "360-sh-1", "text": "Change engine oil and inspect filter for debris", "completed": false, "category": "shop"},
    {"id": "360-sh-2", "text": "Inspect valve train and adjust valve lash", "completed": false, "category": "shop"},
    {"id": "360-sh-3", "text": "Check ignition system and spark plug condition", "completed": false, "category": "shop"},
    {"id": "360-sh-4", "text": "Repack wheel bearings every 4-6 races", "completed": false, "category": "shop"},
    {"id": "360-sh-5", "text": "Inspect and lubricate suspension bushings", "completed": false, "category": "shop"},
    {"id": "360-sh-6", "text": "Check shock seals and gas pressure", "completed": false, "category": "shop"},
    {"id": "360-sh-7", "text": "Inspect steering components for wear", "completed": false, "category": "shop"},
    {"id": "360-sh-8", "text": "Check birdcage bearings and adjustment", "completed": false, "category": "shop"},
    {"id": "360-sh-9", "text": "Inspect driveline and chain/belt condition", "completed": false, "category": "shop"},
    {"id": "360-sh-10", "text": "Clean air filter and check fuel system", "completed": false, "category": "shop"},
    {"id": "360-sh-11", "text": "Verify all safety equipment is current", "completed": false, "category": "shop"}
  ],
  "pre_race": [
    {"id": "360-pre-1", "text": "Set tire pressures for track conditions", "completed": false, "category": "pre_race"},
    {"id": "360-pre-2", "text": "Torque all wheel nuts", "completed": false, "category": "pre_race"},
    {"id": "360-pre-3", "text": "Verify wing settings and measurements", "completed": false, "category": "pre_race"},
    {"id": "360-pre-4", "text": "Check fuel level and system operation", "completed": false, "category": "pre_race"},
    {"id": "360-pre-5", "text": "Test transponder and radio communication", "completed": false, "category": "pre_race"},
    {"id": "360-pre-6", "text": "Confirm gear ratio and setup notes", "completed": false, "category": "pre_race"},
    {"id": "360-pre-7", "text": "Final walk-around inspection", "completed": false, "category": "pre_race"}
  ]
}'::jsonb
);

-- 600 MICRO
INSERT INTO default_checklists (vehicle_type, checklist_data) VALUES (
'600',
'{
  "post_race": [
    {"id": "600-pr-1", "text": "Wash car and seal air filter, tank vent, and exhaust", "completed": false, "category": "post_race"},
    {"id": "600-pr-2", "text": "Avoid high pressure on ECU, sensors, and bearing seals", "completed": false, "category": "post_race"},
    {"id": "600-pr-3", "text": "Check upper steering shaft movement and ream bushings if needed", "completed": false, "category": "post_race"},
    {"id": "600-pr-4", "text": "Verify collapsible steering shaft is free", "completed": false, "category": "post_race"},
    {"id": "600-pr-5", "text": "Check front hub play and adjust spindle nut", "completed": false, "category": "post_race"},
    {"id": "600-pr-6", "text": "Check coolant level", "completed": false, "category": "post_race"}
  ],
  "shop": [
    {"id": "600-sh-1", "text": "Remove and clean foam pre-filter with filter cleaner", "completed": false, "category": "shop"},
    {"id": "600-sh-2", "text": "Clean paper air filter element every 2-4 races", "completed": false, "category": "shop"},
    {"id": "600-sh-3", "text": "Turn fuel pump on every 4 days to circulate fuel (EFI)", "completed": false, "category": "shop"},
    {"id": "600-sh-4", "text": "Change 600cc engine oil every 3-4 races (or 6 with synthetic)", "completed": false, "category": "shop"},
    {"id": "600-sh-5", "text": "Repack front wheel bearings every 4 races with waterproof grease", "completed": false, "category": "shop"},
    {"id": "600-sh-6", "text": "Inspect all bearings - turn inner race and check for smooth rotation", "completed": false, "category": "shop"},
    {"id": "600-sh-7", "text": "Replace chain every 4 races", "completed": false, "category": "shop"},
    {"id": "600-sh-8", "text": "Replace 600cc throttle cable every 4 races", "completed": false, "category": "shop"},
    {"id": "600-sh-9", "text": "Replace connecting rods every 60 races", "completed": false, "category": "shop"},
    {"id": "600-sh-10", "text": "Replace piston rings every 15-30 races", "completed": false, "category": "shop"},
    {"id": "600-sh-11", "text": "Replace nylon guide blocks every 20 races (wishbone cars)", "completed": false, "category": "shop"},
    {"id": "600-sh-12", "text": "Rebuild master cylinder seasonally", "completed": false, "category": "shop"},
    {"id": "600-sh-13", "text": "Check brake rotor for lip formation", "completed": false, "category": "shop"},
    {"id": "600-sh-14", "text": "Replace torsion bars and bushings seasonally", "completed": false, "category": "shop"}
  ],
  "pre_race": [
    {"id": "600-pre-1", "text": "Set tire pressures for track surface", "completed": false, "category": "pre_race"},
    {"id": "600-pre-2", "text": "Torque all wheel nuts", "completed": false, "category": "pre_race"},
    {"id": "600-pre-3", "text": "Check fuel level and prime fuel system", "completed": false, "category": "pre_race"},
    {"id": "600-pre-4", "text": "Verify wing angle and settings", "completed": false, "category": "pre_race"},
    {"id": "600-pre-5", "text": "Test transponder and radio", "completed": false, "category": "pre_race"},
    {"id": "600-pre-6", "text": "Check brake operation and pedal feel", "completed": false, "category": "pre_race"},
    {"id": "600-pre-7", "text": "Final visual inspection", "completed": false, "category": "pre_race"}
  ]
}'::jsonb
);

-- LATE MODEL DIRT
INSERT INTO default_checklists (vehicle_type, checklist_data) VALUES (
'latemodel',
'{
  "post_race": [
    {"id": "lm-pr-1", "text": "Begin maintenance as soon as possible after race", "completed": false, "category": "post_race"},
    {"id": "lm-pr-2", "text": "Inspect chassis for damage or cracks", "completed": false, "category": "post_race"},
    {"id": "lm-pr-3", "text": "Check suspension components for bending or wear", "completed": false, "category": "post_race"},
    {"id": "lm-pr-4", "text": "Inspect shock shafts for straightness and damage", "completed": false, "category": "post_race"},
    {"id": "lm-pr-5", "text": "Check body panels and aerodynamic components", "completed": false, "category": "post_race"},
    {"id": "lm-pr-6", "text": "Assess tire condition and wear patterns", "completed": false, "category": "post_race"},
    {"id": "lm-pr-7", "text": "Analyze telemetry data from race", "completed": false, "category": "post_race"}
  ],
  "shop": [
    {"id": "lm-sh-1", "text": "Replace engine oil unless confirmed fresh", "completed": false, "category": "shop"},
    {"id": "lm-sh-2", "text": "Cut open oil filter and inspect for bearing material", "completed": false, "category": "shop"},
    {"id": "lm-sh-3", "text": "Check spark plugs and replace as needed", "completed": false, "category": "shop"},
    {"id": "lm-sh-4", "text": "Inspect coolant hoses for leaks or cracks", "completed": false, "category": "shop"},
    {"id": "lm-sh-5", "text": "Clean or replace air filters", "completed": false, "category": "shop"},
    {"id": "lm-sh-6", "text": "Check transmission fluid condition", "completed": false, "category": "shop"},
    {"id": "lm-sh-7", "text": "Remove differential cover and inspect for bearing material", "completed": false, "category": "shop"},
    {"id": "lm-sh-8", "text": "Examine ring and pinion wear pattern", "completed": false, "category": "shop"},
    {"id": "lm-sh-9", "text": "Inspect shocks for leaks and check gas pressure", "completed": false, "category": "shop"},
    {"id": "lm-sh-10", "text": "Check suspension bushings and bearings", "completed": false, "category": "shop"},
    {"id": "lm-sh-11", "text": "Inspect steering components and alignment", "completed": false, "category": "shop"},
    {"id": "lm-sh-12", "text": "Check brake pads and rotor condition", "completed": false, "category": "shop"},
    {"id": "lm-sh-13", "text": "Bleed and replace brake fluid if needed", "completed": false, "category": "shop"},
    {"id": "lm-sh-14", "text": "Inspect all safety equipment dates (belts, nets, fire system)", "completed": false, "category": "shop"},
    {"id": "lm-sh-15", "text": "Check wiring harnesses for damage or corrosion", "completed": false, "category": "shop"},
    {"id": "lm-sh-16", "text": "Verify data collection systems operational", "completed": false, "category": "shop"},
    {"id": "lm-sh-17", "text": "Perform compression test if engine condition questionable", "completed": false, "category": "shop"}
  ],
  "pre_race": [
    {"id": "lm-pre-1", "text": "Fill fuel tank completely", "completed": false, "category": "pre_race"},
    {"id": "lm-pre-2", "text": "Set tire pressures for track conditions", "completed": false, "category": "pre_race"},
    {"id": "lm-pre-3", "text": "Torque all wheel nuts", "completed": false, "category": "pre_race"},
    {"id": "lm-pre-4", "text": "Inspect tires for tears, cuts, or punctures", "completed": false, "category": "pre_race"},
    {"id": "lm-pre-5", "text": "Check engine oil and transmission fluid levels", "completed": false, "category": "pre_race"},
    {"id": "lm-pre-6", "text": "Verify coolant level", "completed": false, "category": "pre_race"},
    {"id": "lm-pre-7", "text": "Test radio communication with all crew", "completed": false, "category": "pre_race"},
    {"id": "lm-pre-8", "text": "Confirm transponder is working", "completed": false, "category": "pre_race"},
    {"id": "lm-pre-9", "text": "Review setup notes and confirm all changes applied", "completed": false, "category": "pre_race"},
    {"id": "lm-pre-10", "text": "Final walk-around inspection", "completed": false, "category": "pre_race"}
  ]
}'::jsonb
);

-- IMCA MODIFIEDS
INSERT INTO default_checklists (vehicle_type, checklist_data) VALUES (
'imca-modified',
'{
  "post_race": [
    {"id": "imca-pr-1", "text": "Wash and inspect car immediately", "completed": false, "category": "post_race"},
    {"id": "imca-pr-2", "text": "Check for chassis damage or bent components", "completed": false, "category": "post_race"},
    {"id": "imca-pr-3", "text": "Inspect suspension for wear or damage", "completed": false, "category": "post_race"},
    {"id": "imca-pr-4", "text": "Note tire wear patterns", "completed": false, "category": "post_race"},
    {"id": "imca-pr-5", "text": "Review track notes and setup changes", "completed": false, "category": "post_race"}
  ],
  "shop": [
    {"id": "imca-sh-1", "text": "Change engine oil and filter", "completed": false, "category": "shop"},
    {"id": "imca-sh-2", "text": "Inspect valve train components", "completed": false, "category": "shop"},
    {"id": "imca-sh-3", "text": "Check spark plugs and ignition system", "completed": false, "category": "shop"},
    {"id": "imca-sh-4", "text": "Inspect coolant system for leaks", "completed": false, "category": "shop"},
    {"id": "imca-sh-5", "text": "Clean air filter", "completed": false, "category": "shop"},
    {"id": "imca-sh-6", "text": "Check transmission fluid level and condition", "completed": false, "category": "shop"},
    {"id": "imca-sh-7", "text": "Inspect rear end gears and fluid", "completed": false, "category": "shop"},
    {"id": "imca-sh-8", "text": "Check shock condition and settings", "completed": false, "category": "shop"},
    {"id": "imca-sh-9", "text": "Inspect all suspension bushings", "completed": false, "category": "shop"},
    {"id": "imca-sh-10", "text": "Check steering components", "completed": false, "category": "shop"},
    {"id": "imca-sh-11", "text": "Inspect brake system and fluid", "completed": false, "category": "shop"},
    {"id": "imca-sh-12", "text": "Verify IMCA tech sticker placement", "completed": false, "category": "shop"},
    {"id": "imca-sh-13", "text": "Confirm all setup changes in track notes", "completed": false, "category": "shop"}
  ],
  "pre_race": [
    {"id": "imca-pre-1", "text": "Review IMCA tech inspection requirements", "completed": false, "category": "pre_race"},
    {"id": "imca-pre-2", "text": "Place inspection decal on left front roof corner", "completed": false, "category": "pre_race"},
    {"id": "imca-pre-3", "text": "Set tire pressures", "completed": false, "category": "pre_race"},
    {"id": "imca-pre-4", "text": "Torque all wheel nuts", "completed": false, "category": "pre_race"},
    {"id": "imca-pre-5", "text": "Check fuel level", "completed": false, "category": "pre_race"},
    {"id": "imca-pre-6", "text": "Verify transponder operation", "completed": false, "category": "pre_race"},
    {"id": "imca-pre-7", "text": "Test radio communication", "completed": false, "category": "pre_race"},
    {"id": "imca-pre-8", "text": "Confirm gear ratio and wheel offset settings", "completed": false, "category": "pre_race"}
  ]
}'::jsonb
);

-- WINGLESS SPRINTS
INSERT INTO default_checklists (vehicle_type, checklist_data) VALUES (
'wingless',
'{
  "post_race": [
    {"id": "wl-pr-1", "text": "Wash car and inspect for damage", "completed": false, "category": "post_race"},
    {"id": "wl-pr-2", "text": "Check suspension components for wear", "completed": false, "category": "post_race"},
    {"id": "wl-pr-3", "text": "Inspect steering system closely", "completed": false, "category": "post_race"},
    {"id": "wl-pr-4", "text": "Note tire wear patterns", "completed": false, "category": "post_race"}
  ],
  "shop": [
    {"id": "wl-sh-1", "text": "Change oil and inspect filter", "completed": false, "category": "shop"},
    {"id": "wl-sh-2", "text": "Check valve adjustment", "completed": false, "category": "shop"},
    {"id": "wl-sh-3", "text": "Inspect ignition system", "completed": false, "category": "shop"},
    {"id": "wl-sh-4", "text": "Repack wheel bearings", "completed": false, "category": "shop"},
    {"id": "wl-sh-5", "text": "Check shock seals and pressure", "completed": false, "category": "shop"},
    {"id": "wl-sh-6", "text": "Inspect all suspension bushings", "completed": false, "category": "shop"},
    {"id": "wl-sh-7", "text": "Check steering components thoroughly", "completed": false, "category": "shop"},
    {"id": "wl-sh-8", "text": "Inspect rear end and birdcages", "completed": false, "category": "shop"},
    {"id": "wl-sh-9", "text": "Clean fuel system and filters", "completed": false, "category": "shop"}
  ],
  "pre_race": [
    {"id": "wl-pre-1", "text": "Set tire pressures", "completed": false, "category": "pre_race"},
    {"id": "wl-pre-2", "text": "Torque wheel nuts", "completed": false, "category": "pre_race"},
    {"id": "wl-pre-3", "text": "Check fuel level", "completed": false, "category": "pre_race"},
    {"id": "wl-pre-4", "text": "Verify stagger settings", "completed": false, "category": "pre_race"},
    {"id": "wl-pre-5", "text": "Test all electrical systems", "completed": false, "category": "pre_race"},
    {"id": "wl-pre-6", "text": "Final safety inspection", "completed": false, "category": "pre_race"}
  ]
}'::jsonb
);

-- CRATE SPRINTS
INSERT INTO default_checklists (vehicle_type, checklist_data) VALUES (
'crate',
'{
  "post_race": [
    {"id": "cs-pr-1", "text": "Wash and inspect car", "completed": false, "category": "post_race"},
    {"id": "cs-pr-2", "text": "Check crate motor mounts and bolts", "completed": false, "category": "post_race"},
    {"id": "cs-pr-3", "text": "Inspect for damage", "completed": false, "category": "post_race"},
    {"id": "cs-pr-4", "text": "Check wing hardware", "completed": false, "category": "post_race"}
  ],
  "shop": [
    {"id": "cs-sh-1", "text": "Change oil following crate motor specs", "completed": false, "category": "shop"},
    {"id": "cs-sh-2", "text": "Check crate seal integrity", "completed": false, "category": "shop"},
    {"id": "cs-sh-3", "text": "Inspect all motor mounting bolts", "completed": false, "category": "shop"},
    {"id": "cs-sh-4", "text": "Service wheel bearings", "completed": false, "category": "shop"},
    {"id": "cs-sh-5", "text": "Check suspension components", "completed": false, "category": "shop"},
    {"id": "cs-sh-6", "text": "Inspect shocks", "completed": false, "category": "shop"},
    {"id": "cs-sh-7", "text": "Clean fuel system", "completed": false, "category": "shop"},
    {"id": "cs-sh-8", "text": "Check all safety equipment", "completed": false, "category": "shop"}
  ],
  "pre_race": [
    {"id": "cs-pre-1", "text": "Set tire pressures", "completed": false, "category": "pre_race"},
    {"id": "cs-pre-2", "text": "Torque wheels", "completed": false, "category": "pre_race"},
    {"id": "cs-pre-3", "text": "Check wing settings", "completed": false, "category": "pre_race"},
    {"id": "cs-pre-4", "text": "Verify fuel level", "completed": false, "category": "pre_race"},
    {"id": "cs-pre-5", "text": "Test electronics", "completed": false, "category": "pre_race"}
  ]
}'::jsonb
);

-- MINI SPRINT
INSERT INTO default_checklists (vehicle_type, checklist_data) VALUES (
'mini',
'{
  "post_race": [
    {"id": "ms-pr-1", "text": "Wash car thoroughly", "completed": false, "category": "post_race"},
    {"id": "ms-pr-2", "text": "Inspect for damage", "completed": false, "category": "post_race"},
    {"id": "ms-pr-3", "text": "Check suspension wear", "completed": false, "category": "post_race"},
    {"id": "ms-pr-4", "text": "Note tire condition", "completed": false, "category": "post_race"}
  ],
  "shop": [
    {"id": "ms-sh-1", "text": "Change engine oil", "completed": false, "category": "shop"},
    {"id": "ms-sh-2", "text": "Clean air filter", "completed": false, "category": "shop"},
    {"id": "ms-sh-3", "text": "Service wheel bearings", "completed": false, "category": "shop"},
    {"id": "ms-sh-4", "text": "Check chain wear and tension", "completed": false, "category": "shop"},
    {"id": "ms-sh-5", "text": "Inspect suspension bushings", "completed": false, "category": "shop"},
    {"id": "ms-sh-6", "text": "Check shock condition", "completed": false, "category": "shop"},
    {"id": "ms-sh-7", "text": "Inspect steering components", "completed": false, "category": "shop"},
    {"id": "ms-sh-8", "text": "Check brake system", "completed": false, "category": "shop"}
  ],
  "pre_race": [
    {"id": "ms-pre-1", "text": "Set tire pressures", "completed": false, "category": "pre_race"},
    {"id": "ms-pre-2", "text": "Torque all wheel nuts", "completed": false, "category": "pre_race"},
    {"id": "ms-pre-3", "text": "Check fuel level", "completed": false, "category": "pre_race"},
    {"id": "ms-pre-4", "text": "Verify wing settings", "completed": false, "category": "pre_race"},
    {"id": "ms-pre-5", "text": "Test transponder", "completed": false, "category": "pre_race"}
  ]
}'::jsonb
);

-- JR SPRINT
INSERT INTO default_checklists (vehicle_type, checklist_data) VALUES (
'jr',
'{
  "post_race": [
    {"id": "jr-pr-1", "text": "Wash car with parent/guardian supervision", "completed": false, "category": "post_race"},
    {"id": "jr-pr-2", "text": "Inspect for any damage", "completed": false, "category": "post_race"},
    {"id": "jr-pr-3", "text": "Check all safety equipment", "completed": false, "category": "post_race"},
    {"id": "jr-pr-4", "text": "Note tire wear", "completed": false, "category": "post_race"}
  ],
  "shop": [
    {"id": "jr-sh-1", "text": "Change engine oil per manufacturer schedule", "completed": false, "category": "shop"},
    {"id": "jr-sh-2", "text": "Clean or replace air filter", "completed": false, "category": "shop"},
    {"id": "jr-sh-3", "text": "Check spark plug condition", "completed": false, "category": "shop"},
    {"id": "jr-sh-4", "text": "Service wheel bearings", "completed": false, "category": "shop"},
    {"id": "jr-sh-5", "text": "Inspect chain and sprockets", "completed": false, "category": "shop"},
    {"id": "jr-sh-6", "text": "Check suspension components", "completed": false, "category": "shop"},
    {"id": "jr-sh-7", "text": "Inspect steering system", "completed": false, "category": "shop"},
    {"id": "jr-sh-8", "text": "Check brake operation", "completed": false, "category": "shop"},
    {"id": "jr-sh-9", "text": "Inspect all safety equipment dates", "completed": false, "category": "shop"}
  ],
  "pre_race": [
    {"id": "jr-pre-1", "text": "Set tire pressures correctly", "completed": false, "category": "pre_race"},
    {"id": "jr-pre-2", "text": "Torque all wheel nuts", "completed": false, "category": "pre_race"},
    {"id": "jr-pre-3", "text": "Check fuel level", "completed": false, "category": "pre_race"},
    {"id": "jr-pre-4", "text": "Verify all safety equipment properly fitted", "completed": false, "category": "pre_race"},
    {"id": "jr-pre-5", "text": "Test transponder", "completed": false, "category": "pre_race"},
    {"id": "jr-pre-6", "text": "Parent/guardian final inspection", "completed": false, "category": "pre_race"}
  ]
}'::jsonb
);

-- NON-WINGED 410
INSERT INTO default_checklists (vehicle_type, checklist_data) VALUES (
'nonwinged410',
'{
  "post_race": [
    {"id": "nw410-pr-1", "text": "Wash car immediately", "completed": false, "category": "post_race"},
    {"id": "nw410-pr-2", "text": "Plug injection stacks and protect ignition", "completed": false, "category": "post_race"},
    {"id": "nw410-pr-3", "text": "Inspect chassis for damage", "completed": false, "category": "post_race"},
    {"id": "nw410-pr-4", "text": "Check suspension components", "completed": false, "category": "post_race"},
    {"id": "nw410-pr-5", "text": "Inspect steering system closely", "completed": false, "category": "post_race"}
  ],
  "shop": [
    {"id": "nw410-sh-1", "text": "Change oil and cut filter for inspection", "completed": false, "category": "shop"},
    {"id": "nw410-sh-2", "text": "Check valve lash", "completed": false, "category": "shop"},
    {"id": "nw410-sh-3", "text": "Inspect magneto and timing", "completed": false, "category": "shop"},
    {"id": "nw410-sh-4", "text": "Repack wheel bearings", "completed": false, "category": "shop"},
    {"id": "nw410-sh-5", "text": "Check shock condition and pressure", "completed": false, "category": "shop"},
    {"id": "nw410-sh-6", "text": "Inspect all suspension points", "completed": false, "category": "shop"},
    {"id": "nw410-sh-7", "text": "Check steering components", "completed": false, "category": "shop"},
    {"id": "nw410-sh-8", "text": "Inspect rear end and birdcages", "completed": false, "category": "shop"},
    {"id": "nw410-sh-9", "text": "Clean fuel system", "completed": false, "category": "shop"}
  ],
  "pre_race": [
    {"id": "nw410-pre-1", "text": "Set tire pressures", "completed": false, "category": "pre_race"},
    {"id": "nw410-pre-2", "text": "Torque all wheels", "completed": false, "category": "pre_race"},
    {"id": "nw410-pre-3", "text": "Check fuel load", "completed": false, "category": "pre_race"},
    {"id": "nw410-pre-4", "text": "Verify stagger and offset", "completed": false, "category": "pre_race"},
    {"id": "nw410-pre-5", "text": "Test all electronics", "completed": false, "category": "pre_race"},
    {"id": "nw410-pre-6", "text": "Confirm gear ratio", "completed": false, "category": "pre_race"}
  ]
}'::jsonb
);

-- QUARTER MIDGET
INSERT INTO default_checklists (vehicle_type, checklist_data) VALUES (
'quarter',
'{
  "post_race": [
    {"id": "qm-pr-1", "text": "Clean car with parent/guardian", "completed": false, "category": "post_race"},
    {"id": "qm-pr-2", "text": "Inspect for damage", "completed": false, "category": "post_race"},
    {"id": "qm-pr-3", "text": "Check tire wear", "completed": false, "category": "post_race"},
    {"id": "qm-pr-4", "text": "Inspect safety equipment", "completed": false, "category": "post_race"}
  ],
  "shop": [
    {"id": "qm-sh-1", "text": "Change engine oil per class rules", "completed": false, "category": "shop"},
    {"id": "qm-sh-2", "text": "Clean air filter", "completed": false, "category": "shop"},
    {"id": "qm-sh-3", "text": "Check spark plug", "completed": false, "category": "shop"},
    {"id": "qm-sh-4", "text": "Service wheel bearings", "completed": false, "category": "shop"},
    {"id": "qm-sh-5", "text": "Inspect chain and sprockets", "completed": false, "category": "shop"},
    {"id": "qm-sh-6", "text": "Check suspension bushings", "completed": false, "category": "shop"},
    {"id": "qm-sh-7", "text": "Inspect steering components", "completed": false, "category": "shop"},
    {"id": "qm-sh-8", "text": "Verify all safety equipment current", "completed": false, "category": "shop"}
  ],
  "pre_race": [
    {"id": "qm-pre-1", "text": "Set tire pressures per class rules", "completed": false, "category": "pre_race"},
    {"id": "qm-pre-2", "text": "Torque wheel nuts", "completed": false, "category": "pre_race"},
    {"id": "qm-pre-3", "text": "Check fuel level", "completed": false, "category": "pre_race"},
    {"id": "qm-pre-4", "text": "Verify weight and placement", "completed": false, "category": "pre_race"},
    {"id": "qm-pre-5", "text": "Test transponder", "completed": false, "category": "pre_race"},
    {"id": "qm-pre-6", "text": "Guardian final safety check", "completed": false, "category": "pre_race"}
  ]
}'::jsonb
);

-- FOCUS MIDGET
INSERT INTO default_checklists (vehicle_type, checklist_data) VALUES (
'focus',
'{
  "post_race": [
    {"id": "fm-pr-1", "text": "Wash and inspect car", "completed": false, "category": "post_race"},
    {"id": "fm-pr-2", "text": "Check for chassis damage", "completed": false, "category": "post_race"},
    {"id": "fm-pr-3", "text": "Inspect suspension components", "completed": false, "category": "post_race"},
    {"id": "fm-pr-4", "text": "Note tire wear patterns", "completed": false, "category": "post_race"}
  ],
  "shop": [
    {"id": "fm-sh-1", "text": "Change Focus engine oil per spec", "completed": false, "category": "shop"},
    {"id": "fm-sh-2", "text": "Inspect valve train", "completed": false, "category": "shop"},
    {"id": "fm-sh-3", "text": "Check ignition system", "completed": false, "category": "shop"},
    {"id": "fm-sh-4", "text": "Service wheel bearings", "completed": false, "category": "shop"},
    {"id": "fm-sh-5", "text": "Inspect suspension bushings", "completed": false, "category": "shop"},
    {"id": "fm-sh-6", "text": "Check shock condition", "completed": false, "category": "shop"},
    {"id": "fm-sh-7", "text": "Inspect steering system", "completed": false, "category": "shop"},
    {"id": "fm-sh-8", "text": "Check brake system", "completed": false, "category": "shop"}
  ],
  "pre_race": [
    {"id": "fm-pre-1", "text": "Set tire pressures", "completed": false, "category": "pre_race"},
    {"id": "fm-pre-2", "text": "Torque all wheels", "completed": false, "category": "pre_race"},
    {"id": "fm-pre-3", "text": "Check fuel level", "completed": false, "category": "pre_race"},
    {"id": "fm-pre-4", "text": "Verify setup notes", "completed": false, "category": "pre_race"},
    {"id": "fm-pre-5", "text": "Test electronics", "completed": false, "category": "pre_race"}
  ]
}'::jsonb
);

-- DIRT MODIFIED 2
INSERT INTO default_checklists (vehicle_type, checklist_data) VALUES (
'modified2',
'{
  "post_race": [
    {"id": "dm2-pr-1", "text": "Wash car immediately", "completed": false, "category": "post_race"},
    {"id": "dm2-pr-2", "text": "Inspect for damage", "completed": false, "category": "post_race"},
    {"id": "dm2-pr-3", "text": "Check suspension wear", "completed": false, "category": "post_race"},
    {"id": "dm2-pr-4", "text": "Note tire condition", "completed": false, "category": "post_race"}
  ],
  "shop": [
    {"id": "dm2-sh-1", "text": "Change oil and filter", "completed": false, "category": "shop"},
    {"id": "dm2-sh-2", "text": "Inspect engine mounts", "completed": false, "category": "shop"},
    {"id": "dm2-sh-3", "text": "Check valve adjustment", "completed": false, "category": "shop"},
    {"id": "dm2-sh-4", "text": "Inspect cooling system", "completed": false, "category": "shop"},
    {"id": "dm2-sh-5", "text": "Service transmission", "completed": false, "category": "shop"},
    {"id": "dm2-sh-6", "text": "Check rear end fluid", "completed": false, "category": "shop"},
    {"id": "dm2-sh-7", "text": "Inspect shock absorbers", "completed": false, "category": "shop"},
    {"id": "dm2-sh-8", "text": "Check suspension bushings", "completed": false, "category": "shop"},
    {"id": "dm2-sh-9", "text": "Inspect brake system", "completed": false, "category": "shop"}
  ],
  "pre_race": [
    {"id": "dm2-pre-1", "text": "Set tire pressures", "completed": false, "category": "pre_race"},
    {"id": "dm2-pre-2", "text": "Torque wheels", "completed": false, "category": "pre_race"},
    {"id": "dm2-pre-3", "text": "Check fluid levels", "completed": false, "category": "pre_race"},
    {"id": "dm2-pre-4", "text": "Verify setup changes", "completed": false, "category": "pre_race"},
    {"id": "dm2-pre-5", "text": "Test electronics", "completed": false, "category": "pre_race"}
  ]
}'::jsonb
);

-- UMP MODIFIED
INSERT INTO default_checklists (vehicle_type, checklist_data) VALUES (
'ump-modified',
'{
  "post_race": [
    {"id": "ump-pr-1", "text": "Wash and inspect car", "completed": false, "category": "post_race"},
    {"id": "ump-pr-2", "text": "Check for damage", "completed": false, "category": "post_race"},
    {"id": "ump-pr-3", "text": "Inspect UMP-legal components", "completed": false, "category": "post_race"},
    {"id": "ump-pr-4", "text": "Note tire wear", "completed": false, "category": "post_race"}
  ],
  "shop": [
    {"id": "ump-sh-1", "text": "Change oil per UMP specs", "completed": false, "category": "shop"},
    {"id": "ump-sh-2", "text": "Inspect crate seal if applicable", "completed": false, "category": "shop"},
    {"id": "ump-sh-3", "text": "Check valve train", "completed": false, "category": "shop"},
    {"id": "ump-sh-4", "text": "Service transmission", "completed": false, "category": "shop"},
    {"id": "ump-sh-5", "text": "Check rear end", "completed": false, "category": "shop"},
    {"id": "ump-sh-6", "text": "Inspect suspension per UMP rules", "completed": false, "category": "shop"},
    {"id": "ump-sh-7", "text": "Check shock specifications", "completed": false, "category": "shop"},
    {"id": "ump-sh-8", "text": "Verify all components UMP legal", "completed": false, "category": "shop"}
  ],
  "pre_race": [
    {"id": "ump-pre-1", "text": "Review UMP tech requirements", "completed": false, "category": "pre_race"},
    {"id": "ump-pre-2", "text": "Set tire pressures", "completed": false, "category": "pre_race"},
    {"id": "ump-pre-3", "text": "Torque wheels", "completed": false, "category": "pre_race"},
    {"id": "ump-pre-4", "text": "Check fuel compliance", "completed": false, "category": "pre_race"},
    {"id": "ump-pre-5", "text": "Verify weight and placement", "completed": false, "category": "pre_race"}
  ]
}'::jsonb
);

-- IMCA SPORTMODS
INSERT INTO default_checklists (vehicle_type, checklist_data) VALUES (
'imca-sportmod',
'{
  "post_race": [
    {"id": "ism-pr-1", "text": "Wash and inspect car", "completed": false, "category": "post_race"},
    {"id": "ism-pr-2", "text": "Check for damage", "completed": false, "category": "post_race"},
    {"id": "ism-pr-3", "text": "Inspect suspension", "completed": false, "category": "post_race"},
    {"id": "ism-pr-4", "text": "Note tire wear", "completed": false, "category": "post_race"}
  ],
  "shop": [
    {"id": "ism-sh-1", "text": "Change oil and filter", "completed": false, "category": "shop"},
    {"id": "ism-sh-2", "text": "Check crate seal", "completed": false, "category": "shop"},
    {"id": "ism-sh-3", "text": "Inspect ignition system", "completed": false, "category": "shop"},
    {"id": "ism-sh-4", "text": "Service transmission", "completed": false, "category": "shop"},
    {"id": "ism-sh-5", "text": "Check rear end", "completed": false, "category": "shop"},
    {"id": "ism-sh-6", "text": "Inspect IMCA-approved shocks", "completed": false, "category": "shop"},
    {"id": "ism-sh-7", "text": "Check suspension components", "completed": false, "category": "shop"},
    {"id": "ism-sh-8", "text": "Verify IMCA tech sticker current", "completed": false, "category": "shop"}
  ],
  "pre_race": [
    {"id": "ism-pre-1", "text": "Review IMCA SportMod tech sheet", "completed": false, "category": "pre_race"},
    {"id": "ism-pre-2", "text": "Place inspection decal", "completed": false, "category": "pre_race"},
    {"id": "ism-pre-3", "text": "Set tire pressures", "completed": false, "category": "pre_race"},
    {"id": "ism-pre-4", "text": "Torque wheels", "completed": false, "category": "pre_race"},
    {"id": "ism-pre-5", "text": "Check fuel level", "completed": false, "category": "pre_race"}
  ]
}'::jsonb
);

-- B-MODIFIED
INSERT INTO default_checklists (vehicle_type, checklist_data) VALUES (
'b-modified',
'{
  "post_race": [
    {"id": "bm-pr-1", "text": "Wash and inspect car", "completed": false, "category": "post_race"},
    {"id": "bm-pr-2", "text": "Check for damage", "completed": false, "category": "post_race"},
    {"id": "bm-pr-3", "text": "Inspect suspension", "completed": false, "category": "post_race"},
    {"id": "bm-pr-4", "text": "Note tire condition", "completed": false, "category": "post_race"}
  ],
  "shop": [
    {"id": "bm-sh-1", "text": "Change oil and filter", "completed": false, "category": "shop"},
    {"id": "bm-sh-2", "text": "Check valve adjustment", "completed": false, "category": "shop"},
    {"id": "bm-sh-3", "text": "Inspect ignition", "completed": false, "category": "shop"},
    {"id": "bm-sh-4", "text": "Service transmission", "completed": false, "category": "shop"},
    {"id": "bm-sh-5", "text": "Check rear end fluid", "completed": false, "category": "shop"},
    {"id": "bm-sh-6", "text": "Inspect shocks", "completed": false, "category": "shop"},
    {"id": "bm-sh-7", "text": "Check suspension bushings", "completed": false, "category": "shop"},
    {"id": "bm-sh-8", "text": "Inspect brake system", "completed": false, "category": "shop"}
  ],
  "pre_race": [
    {"id": "bm-pre-1", "text": "Set tire pressures", "completed": false, "category": "pre_race"},
    {"id": "bm-pre-2", "text": "Torque wheels", "completed": false, "category": "pre_race"},
    {"id": "bm-pre-3", "text": "Check fluid levels", "completed": false, "category": "pre_race"},
    {"id": "bm-pre-4", "text": "Verify setup notes", "completed": false, "category": "pre_race"},
    {"id": "bm-pre-5", "text": "Test electronics", "completed": false, "category": "pre_race"}
  ]
}'::jsonb
);

-- CRATE LATE MODEL
INSERT INTO default_checklists (vehicle_type, checklist_data) VALUES (
'crate-latemodel',
'{
  "post_race": [
    {"id": "clm-pr-1", "text": "Begin maintenance immediately", "completed": false, "category": "post_race"},
    {"id": "clm-pr-2", "text": "Check crate seal integrity", "completed": false, "category": "post_race"},
    {"id": "clm-pr-3", "text": "Inspect chassis for damage", "completed": false, "category": "post_race"},
    {"id": "clm-pr-4", "text": "Check suspension components", "completed": false, "category": "post_race"},
    {"id": "clm-pr-5", "text": "Note tire wear", "completed": false, "category": "post_race"}
  ],
  "shop": [
    {"id": "clm-sh-1", "text": "Change oil per crate motor specs", "completed": false, "category": "shop"},
    {"id": "clm-sh-2", "text": "Verify crate seal unbroken", "completed": false, "category": "shop"},
    {"id": "clm-sh-3", "text": "Inspect motor mounts", "completed": false, "category": "shop"},
    {"id": "clm-sh-4", "text": "Check cooling system", "completed": false, "category": "shop"},
    {"id": "clm-sh-5", "text": "Service transmission", "completed": false, "category": "shop"},
    {"id": "clm-sh-6", "text": "Inspect rear end", "completed": false, "category": "shop"},
    {"id": "clm-sh-7", "text": "Check shock condition", "completed": false, "category": "shop"},
    {"id": "clm-sh-8", "text": "Inspect suspension bushings", "completed": false, "category": "shop"},
    {"id": "clm-sh-9", "text": "Check brake system", "completed": false, "category": "shop"},
    {"id": "clm-sh-10", "text": "Verify all safety equipment", "completed": false, "category": "shop"}
  ],
  "pre_race": [
    {"id": "clm-pre-1", "text": "Check crate seal visible", "completed": false, "category": "pre_race"},
    {"id": "clm-pre-2", "text": "Set tire pressures", "completed": false, "category": "pre_race"},
    {"id": "clm-pre-3", "text": "Torque all wheels", "completed": false, "category": "pre_race"},
    {"id": "clm-pre-4", "text": "Check fluid levels", "completed": false, "category": "pre_race"},
    {"id": "clm-pre-5", "text": "Test radio and transponder", "completed": false, "category": "pre_race"}
  ]
}'::jsonb
);

-- SUPER LATE MODEL
INSERT INTO default_checklists (vehicle_type, checklist_data) VALUES (
'super-latemodel',
'{
  "post_race": [
    {"id": "slm-pr-1", "text": "Begin maintenance immediately", "completed": false, "category": "post_race"},
    {"id": "slm-pr-2", "text": "Download and review data acquisition", "completed": false, "category": "post_race"},
    {"id": "slm-pr-3", "text": "Inspect chassis for cracks or damage", "completed": false, "category": "post_race"},
    {"id": "slm-pr-4", "text": "Check high-end suspension components", "completed": false, "category": "post_race"},
    {"id": "slm-pr-5", "text": "Inspect aerodynamic components", "completed": false, "category": "post_race"}
  ],
  "shop": [
    {"id": "slm-sh-1", "text": "Change premium racing oil", "completed": false, "category": "shop"},
    {"id": "slm-sh-2", "text": "Cut filter and inspect for bearing material", "completed": false, "category": "shop"},
    {"id": "slm-sh-3", "text": "Check valve train and springs", "completed": false, "category": "shop"},
    {"id": "slm-sh-4", "text": "Inspect cooling system thoroughly", "completed": false, "category": "shop"},
    {"id": "slm-sh-5", "text": "Service premium transmission", "completed": false, "category": "shop"},
    {"id": "slm-sh-6", "text": "Remove rear cover and inspect gears", "completed": false, "category": "shop"},
    {"id": "slm-sh-7", "text": "Rebuild shocks per schedule", "completed": false, "category": "shop"},
    {"id": "slm-sh-8", "text": "Inspect all suspension bearings", "completed": false, "category": "shop"},
    {"id": "slm-sh-9", "text": "Check brake system completely", "completed": false, "category": "shop"},
    {"id": "slm-sh-10", "text": "Verify data systems operational", "completed": false, "category": "shop"},
    {"id": "slm-sh-11", "text": "Inspect all safety equipment dates", "completed": false, "category": "shop"}
  ],
  "pre_race": [
    {"id": "slm-pre-1", "text": "Load data acquisition profiles", "completed": false, "category": "pre_race"},
    {"id": "slm-pre-2", "text": "Set precise tire pressures", "completed": false, "category": "pre_race"},
    {"id": "slm-pre-3", "text": "Torque all wheels to spec", "completed": false, "category": "pre_race"},
    {"id": "slm-pre-4", "text": "Verify all setup measurements", "completed": false, "category": "pre_race"},
    {"id": "slm-pre-5", "text": "Test all telemetry systems", "completed": false, "category": "pre_race"},
    {"id": "slm-pre-6", "text": "Confirm radio communication", "completed": false, "category": "pre_race"}
  ]
}'::jsonb
);

-- STREET STOCK
INSERT INTO default_checklists (vehicle_type, checklist_data) VALUES (
'street-stock',
'{
  "post_race": [
    {"id": "ss-pr-1", "text": "Wash and inspect car", "completed": false, "category": "post_race"},
    {"id": "ss-pr-2", "text": "Check for damage", "completed": false, "category": "post_race"},
    {"id": "ss-pr-3", "text": "Inspect stock components", "completed": false, "category": "post_race"},
    {"id": "ss-pr-4", "text": "Note tire wear", "completed": false, "category": "post_race"}
  ],
  "shop": [
    {"id": "ss-sh-1", "text": "Change oil per stock specs", "completed": false, "category": "shop"},
    {"id": "ss-sh-2", "text": "Check engine mounts", "completed": false, "category": "shop"},
    {"id": "ss-sh-3", "text": "Inspect cooling system", "completed": false, "category": "shop"},
    {"id": "ss-sh-4", "text": "Service transmission", "completed": false, "category": "shop"},
    {"id": "ss-sh-5", "text": "Check rear end fluid", "completed": false, "category": "shop"},
    {"id": "ss-sh-6", "text": "Inspect stock suspension", "completed": false, "category": "shop"},
    {"id": "ss-sh-7", "text": "Check brake system", "completed": false, "category": "shop"},
    {"id": "ss-sh-8", "text": "Verify all components are stock-legal", "completed": false, "category": "shop"}
  ],
  "pre_race": [
    {"id": "ss-pre-1", "text": "Review class rules", "completed": false, "category": "pre_race"},
    {"id": "ss-pre-2", "text": "Set tire pressures", "completed": false, "category": "pre_race"},
    {"id": "ss-pre-3", "text": "Torque wheels", "completed": false, "category": "pre_race"},
    {"id": "ss-pre-4", "text": "Check fluid levels", "completed": false, "category": "pre_race"},
    {"id": "ss-pre-5", "text": "Verify weight placement", "completed": false, "category": "pre_race"}
  ]
}'::jsonb
);

-- OUTLAW KART
INSERT INTO default_checklists (vehicle_type, checklist_data) VALUES (
'outlaw',
'{
  "post_race": [
    {"id": "ok-pr-1", "text": "Clean kart with parent/guardian", "completed": false, "category": "post_race"},
    {"id": "ok-pr-2", "text": "Inspect for damage", "completed": false, "category": "post_race"},
    {"id": "ok-pr-3", "text": "Check tire wear", "completed": false, "category": "post_race"},
    {"id": "ok-pr-4", "text": "Inspect safety equipment", "completed": false, "category": "post_race"}
  ],
  "shop": [
    {"id": "ok-sh-1", "text": "Change engine oil per schedule", "completed": false, "category": "shop"},
    {"id": "ok-sh-2", "text": "Clean air filter", "completed": false, "category": "shop"},
    {"id": "ok-sh-3", "text": "Check spark plug", "completed": false, "category": "shop"},
    {"id": "ok-sh-4", "text": "Service wheel bearings", "completed": false, "category": "shop"},
    {"id": "ok-sh-5", "text": "Inspect chain and sprockets", "completed": false, "category": "shop"},
    {"id": "ok-sh-6", "text": "Check chassis for cracks", "completed": false, "category": "shop"},
    {"id": "ok-sh-7", "text": "Inspect steering components", "completed": false, "category": "shop"},
    {"id": "ok-sh-8", "text": "Check brake operation", "completed": false, "category": "shop"},
    {"id": "ok-sh-9", "text": "Verify all safety equipment current", "completed": false, "category": "shop"}
  ],
  "pre_race": [
    {"id": "ok-pre-1", "text": "Set tire pressures per rules", "completed": false, "category": "pre_race"},
    {"id": "ok-pre-2", "text": "Torque wheel nuts", "completed": false, "category": "pre_race"},
    {"id": "ok-pre-3", "text": "Check fuel level and mixture", "completed": false, "category": "pre_race"},
    {"id": "ok-pre-4", "text": "Verify weight and placement", "completed": false, "category": "pre_race"},
    {"id": "ok-pre-5", "text": "Check all safety equipment fitted", "completed": false, "category": "pre_race"},
    {"id": "ok-pre-6", "text": "Guardian final inspection", "completed": false, "category": "pre_race"}
  ]
}'::jsonb
);

-- LO206 KART
INSERT INTO default_checklists (vehicle_type, checklist_data) VALUES (
'lo206-kart',
'{
  "post_race": [
    {"id": "lo-pr-1", "text": "Clean kart thoroughly", "completed": false, "category": "post_race"},
    {"id": "lo-pr-2", "text": "Check LO206 engine seal", "completed": false, "category": "post_race"},
    {"id": "lo-pr-3", "text": "Inspect for damage", "completed": false, "category": "post_race"},
    {"id": "lo-pr-4", "text": "Note tire condition", "completed": false, "category": "post_race"}
  ],
  "shop": [
    {"id": "lo-sh-1", "text": "Change oil per LO206 specs", "completed": false, "category": "shop"},
    {"id": "lo-sh-2", "text": "Verify engine seal intact", "completed": false, "category": "shop"},
    {"id": "lo-sh-3", "text": "Clean air filter", "completed": false, "category": "shop"},
    {"id": "lo-sh-4", "text": "Check spark plug condition", "completed": false, "category": "shop"},
    {"id": "lo-sh-5", "text": "Service wheel bearings", "completed": false, "category": "shop"},
    {"id": "lo-sh-6", "text": "Inspect chain wear and tension", "completed": false, "category": "shop"},
    {"id": "lo-sh-7", "text": "Check chassis alignment", "completed": false, "category": "shop"},
    {"id": "lo-sh-8", "text": "Inspect brake system", "completed": false, "category": "shop"}
  ],
  "pre_race": [
    {"id": "lo-pre-1", "text": "Verify LO206 seal visible", "completed": false, "category": "pre_race"},
    {"id": "lo-pre-2", "text": "Set tire pressures per rules", "completed": false, "category": "pre_race"},
    {"id": "lo-pre-3", "text": "Torque wheels", "completed": false, "category": "pre_race"},
    {"id": "lo-pre-4", "text": "Check fuel compliance", "completed": false, "category": "pre_race"},
    {"id": "lo-pre-5", "text": "Verify weight meets spec", "completed": false, "category": "pre_race"}
  ]
}'::jsonb
);

-- RESTRICTED BOX STOCK
INSERT INTO default_checklists (vehicle_type, checklist_data) VALUES (
'restricted-boxstock',
'{
  "post_race": [
    {"id": "rbs-pr-1", "text": "Clean kart with parent/guardian", "completed": false, "category": "post_race"},
    {"id": "rbs-pr-2", "text": "Check restrictor plate", "completed": false, "category": "post_race"},
    {"id": "rbs-pr-3", "text": "Inspect for damage", "completed": false, "category": "post_race"},
    {"id": "rbs-pr-4", "text": "Check tire wear", "completed": false, "category": "post_race"}
  ],
  "shop": [
    {"id": "rbs-sh-1", "text": "Change oil per class spec", "completed": false, "category": "shop"},
    {"id": "rbs-sh-2", "text": "Verify restrictor plate intact", "completed": false, "category": "shop"},
    {"id": "rbs-sh-3", "text": "Clean air filter", "completed": false, "category": "shop"},
    {"id": "rbs-sh-4", "text": "Check spark plug", "completed": false, "category": "shop"},
    {"id": "rbs-sh-5", "text": "Service wheel bearings", "completed": false, "category": "shop"},
    {"id": "rbs-sh-6", "text": "Inspect chain", "completed": false, "category": "shop"},
    {"id": "rbs-sh-7", "text": "Check chassis", "completed": false, "category": "shop"},
    {"id": "rbs-sh-8", "text": "Inspect safety equipment", "completed": false, "category": "shop"}
  ],
  "pre_race": [
    {"id": "rbs-pre-1", "text": "Verify restrictor legal", "completed": false, "category": "pre_race"},
    {"id": "rbs-pre-2", "text": "Set tire pressures", "completed": false, "category": "pre_race"},
    {"id": "rbs-pre-3", "text": "Torque wheels", "completed": false, "category": "pre_race"},
    {"id": "rbs-pre-4", "text": "Check fuel", "completed": false, "category": "pre_race"},
    {"id": "rbs-pre-5", "text": "Guardian check", "completed": false, "category": "pre_race"}
  ]
}'::jsonb
);

-- BOX STOCK CLASS
INSERT INTO default_checklists (vehicle_type, checklist_data) VALUES (
'boxstock',
'{
  "post_race": [
    {"id": "bs-pr-1", "text": "Clean kart thoroughly", "completed": false, "category": "post_race"},
    {"id": "bs-pr-2", "text": "Check engine seal", "completed": false, "category": "post_race"},
    {"id": "bs-pr-3", "text": "Inspect for damage", "completed": false, "category": "post_race"},
    {"id": "bs-pr-4", "text": "Note tire condition", "completed": false, "category": "post_race"}
  ],
  "shop": [
    {"id": "bs-sh-1", "text": "Change oil per box stock specs", "completed": false, "category": "shop"},
    {"id": "bs-sh-2", "text": "Verify engine seal unbroken", "completed": false, "category": "shop"},
    {"id": "bs-sh-3", "text": "Clean air filter", "completed": false, "category": "shop"},
    {"id": "bs-sh-4", "text": "Service bearings", "completed": false, "category": "shop"},
    {"id": "bs-sh-5", "text": "Inspect chain", "completed": false, "category": "shop"},
    {"id": "bs-sh-6", "text": "Check chassis", "completed": false, "category": "shop"},
    {"id": "bs-sh-7", "text": "Inspect brakes", "completed": false, "category": "shop"}
  ],
  "pre_race": [
    {"id": "bs-pre-1", "text": "Check seal visible", "completed": false, "category": "pre_race"},
    {"id": "bs-pre-2", "text": "Set tire pressures", "completed": false, "category": "pre_race"},
    {"id": "bs-pre-3", "text": "Torque wheels", "completed": false, "category": "pre_race"},
    {"id": "bs-pre-4", "text": "Check fuel level", "completed": false, "category": "pre_race"}
  ]
}'::jsonb
);

-- 250 INTERMEDIATE
INSERT INTO default_checklists (vehicle_type, checklist_data) VALUES (
'intermediate250',
'{
  "post_race": [
    {"id": "i250-pr-1", "text": "Clean kart with parent/guardian", "completed": false, "category": "post_race"},
    {"id": "i250-pr-2", "text": "Inspect for damage", "completed": false, "category": "post_race"},
    {"id": "i250-pr-3", "text": "Check tire wear", "completed": false, "category": "post_race"},
    {"id": "i250-pr-4", "text": "Inspect safety equipment", "completed": false, "category": "post_race"}
  ],
  "shop": [
    {"id": "i250-sh-1", "text": "Change 2-stroke oil and fuel mix", "completed": false, "category": "shop"},
    {"id": "i250-sh-2", "text": "Clean air filter", "completed": false, "category": "shop"},
    {"id": "i250-sh-3", "text": "Check spark plug condition", "completed": false, "category": "shop"},
    {"id": "i250-sh-4", "text": "Inspect top end wear", "completed": false, "category": "shop"},
    {"id": "i250-sh-5", "text": "Service wheel bearings", "completed": false, "category": "shop"},
    {"id": "i250-sh-6", "text": "Inspect chain and sprockets", "completed": false, "category": "shop"},
    {"id": "i250-sh-7", "text": "Check chassis for cracks", "completed": false, "category": "shop"},
    {"id": "i250-sh-8", "text": "Inspect brake system", "completed": false, "category": "shop"}
  ],
  "pre_race": [
    {"id": "i250-pre-1", "text": "Mix fresh fuel per spec", "completed": false, "category": "pre_race"},
    {"id": "i250-pre-2", "text": "Set tire pressures", "completed": false, "category": "pre_race"},
    {"id": "i250-pre-3", "text": "Torque wheels", "completed": false, "category": "pre_race"},
    {"id": "i250-pre-4", "text": "Check jetting for conditions", "completed": false, "category": "pre_race"},
    {"id": "i250-pre-5", "text": "Guardian final check", "completed": false, "category": "pre_race"}
  ]
}'::jsonb
);

-- OPEN INTERMEDIATE
INSERT INTO default_checklists (vehicle_type, checklist_data) VALUES (
'open-intermediate',
'{
  "post_race": [
    {"id": "oi-pr-1", "text": "Clean kart thoroughly", "completed": false, "category": "post_race"},
    {"id": "oi-pr-2", "text": "Inspect for damage", "completed": false, "category": "post_race"},
    {"id": "oi-pr-3", "text": "Check tire wear", "completed": false, "category": "post_race"},
    {"id": "oi-pr-4", "text": "Inspect safety gear", "completed": false, "category": "post_race"}
  ],
  "shop": [
    {"id": "oi-sh-1", "text": "Change oil or mix fuel per engine type", "completed": false, "category": "shop"},
    {"id": "oi-sh-2", "text": "Clean air filter", "completed": false, "category": "shop"},
    {"id": "oi-sh-3", "text": "Check spark plug", "completed": false, "category": "shop"},
    {"id": "oi-sh-4", "text": "Service wheel bearings", "completed": false, "category": "shop"},
    {"id": "oi-sh-5", "text": "Inspect chain", "completed": false, "category": "shop"},
    {"id": "oi-sh-6", "text": "Check chassis", "completed": false, "category": "shop"},
    {"id": "oi-sh-7", "text": "Inspect brakes", "completed": false, "category": "shop"}
  ],
  "pre_race": [
    {"id": "oi-pre-1", "text": "Set tire pressures", "completed": false, "category": "pre_race"},
    {"id": "oi-pre-2", "text": "Torque wheels", "completed": false, "category": "pre_race"},
    {"id": "oi-pre-3", "text": "Check fuel", "completed": false, "category": "pre_race"},
    {"id": "oi-pre-4", "text": "Verify setup", "completed": false, "category": "pre_race"}
  ]
}'::jsonb
);

-- OPEN CLASS
INSERT INTO default_checklists (vehicle_type, checklist_data) VALUES (
'open-class',
'{
  "post_race": [
    {"id": "oc-pr-1", "text": "Clean kart", "completed": false, "category": "post_race"},
    {"id": "oc-pr-2", "text": "Inspect for damage", "completed": false, "category": "post_race"},
    {"id": "oc-pr-3", "text": "Check tire wear", "completed": false, "category": "post_race"}
  ],
  "shop": [
    {"id": "oc-sh-1", "text": "Service engine per type", "completed": false, "category": "shop"},
    {"id": "oc-sh-2", "text": "Clean filters", "completed": false, "category": "shop"},
    {"id": "oc-sh-3", "text": "Service bearings", "completed": false, "category": "shop"},
    {"id": "oc-sh-4", "text": "Inspect chain", "completed": false, "category": "shop"},
    {"id": "oc-sh-5", "text": "Check chassis", "completed": false, "category": "shop"},
    {"id": "oc-sh-6", "text": "Inspect brakes", "completed": false, "category": "shop"}
  ],
  "pre_race": [
    {"id": "oc-pre-1", "text": "Set tire pressures", "completed": false, "category": "pre_race"},
    {"id": "oc-pre-2", "text": "Torque wheels", "completed": false, "category": "pre_race"},
    {"id": "oc-pre-3", "text": "Check fuel", "completed": false, "category": "pre_race"}
  ]
}'::jsonb
);

-- SPORTSMAN CLASS
INSERT INTO default_checklists (vehicle_type, checklist_data) VALUES (
'sportsman',
'{
  "post_race": [
    {"id": "sp-pr-1", "text": "Clean kart", "completed": false, "category": "post_race"},
    {"id": "sp-pr-2", "text": "Inspect for damage", "completed": false, "category": "post_race"},
    {"id": "sp-pr-3", "text": "Check tire condition", "completed": false, "category": "post_race"}
  ],
  "shop": [
    {"id": "sp-sh-1", "text": "Service engine", "completed": false, "category": "shop"},
    {"id": "sp-sh-2", "text": "Clean air filter", "completed": false, "category": "shop"},
    {"id": "sp-sh-3", "text": "Service bearings", "completed": false, "category": "shop"},
    {"id": "sp-sh-4", "text": "Inspect chain", "completed": false, "category": "shop"},
    {"id": "sp-sh-5", "text": "Check chassis", "completed": false, "category": "shop"},
    {"id": "sp-sh-6", "text": "Inspect brakes", "completed": false, "category": "shop"}
  ],
  "pre_race": [
    {"id": "sp-pre-1", "text": "Set tire pressures", "completed": false, "category": "pre_race"},
    {"id": "sp-pre-2", "text": "Torque wheels", "completed": false, "category": "pre_race"},
    {"id": "sp-pre-3", "text": "Check fuel", "completed": false, "category": "pre_race"}
  ]
}'::jsonb
);

-- CAGED CLONE CLASS
INSERT INTO default_checklists (vehicle_type, checklist_data) VALUES (
'caged-clone',
'{
  "post_race": [
    {"id": "cc-pr-1", "text": "Clean kart with parent/guardian", "completed": false, "category": "post_race"},
    {"id": "cc-pr-2", "text": "Check clone engine seal", "completed": false, "category": "post_race"},
    {"id": "cc-pr-3", "text": "Inspect cage for damage", "completed": false, "category": "post_race"},
    {"id": "cc-pr-4", "text": "Check tire wear", "completed": false, "category": "post_race"}
  ],
  "shop": [
    {"id": "cc-sh-1", "text": "Change oil per clone specs", "completed": false, "category": "shop"},
    {"id": "cc-sh-2", "text": "Verify engine seal intact", "completed": false, "category": "shop"},
    {"id": "cc-sh-3", "text": "Clean air filter", "completed": false, "category": "shop"},
    {"id": "cc-sh-4", "text": "Check spark plug", "completed": false, "category": "shop"},
    {"id": "cc-sh-5", "text": "Service wheel bearings", "completed": false, "category": "shop"},
    {"id": "cc-sh-6", "text": "Inspect chain and sprockets", "completed": false, "category": "shop"},
    {"id": "cc-sh-7", "text": "Check cage integrity", "completed": false, "category": "shop"},
    {"id": "cc-sh-8", "text": "Inspect all safety equipment", "completed": false, "category": "shop"}
  ],
  "pre_race": [
    {"id": "cc-pre-1", "text": "Verify clone seal visible", "completed": false, "category": "pre_race"},
    {"id": "cc-pre-2", "text": "Set tire pressures per rules", "completed": false, "category": "pre_race"},
    {"id": "cc-pre-3", "text": "Torque wheel nuts", "completed": false, "category": "pre_race"},
    {"id": "cc-pre-4", "text": "Check fuel level", "completed": false, "category": "pre_race"},
    {"id": "cc-pre-5", "text": "Guardian final safety check", "completed": false, "category": "pre_race"}
  ]
}'::jsonb
);
