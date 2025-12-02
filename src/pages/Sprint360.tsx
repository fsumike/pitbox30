import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Settings, Gauge } from 'lucide-react';
import SetupSheet from '../components/SetupSheet';
import LoadSetupsButton from '../components/LoadSetupsButton';
import DynoImageCapture from '../components/DynoImageCapture';
import CarNumberBox from '../components/CarNumberBox';
import { Setup } from '../lib/supabase';

function Sprint360() {
  const location = useLocation();
  const [currentSetup, setCurrentSetup] = useState<Setup | null>(null);
  const [carNumber, setCarNumber] = useState('');
  const [trackName, setTrackName] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  const handleLoadSetup = (setup: Setup) => {
    setCurrentSetup(setup);

    // Extract car number from database column or setup_data
    const carNum = setup?.car_number || setup?.setup_data?.general?.car_number?.feature || '';
    setCarNumber(carNum);

    // Extract track name from database column or setup_data
    const trackNm = setup?.track_name || setup?.setup_data?.general?.track_track?.feature || '';
    setTrackName(trackNm);

    // Extract date from setup_data or use created_at
    const setupDate = setup?.setup_data?.general?.date?.feature ||
                     (setup?.created_at ? new Date(setup.created_at).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]);
    setDate(setupDate);
  };

  useEffect(() => {
    if (location.state?.loadedSetup) {
      handleLoadSetup(location.state.loadedSetup);
    }
  }, [location.state]);

  // Define the setup data structure with consistent sections
  const initialSetupData = {
    track: {
      track_name: { feature: '', comment: '' },
      weather: { feature: '', comment: '' },
      surface: { feature: '', comment: '' },
      start_finish: { feature: '', comment: '' },
      handling: { feature: '', comment: '' }
    },
    left_front: {
      left_front_psi: { feature: '', comment: '' },
      left_front_offset: { feature: '', comment: '' },
      left_front_block: { feature: '', comment: '' },
      left_front_bar: { feature: '', comment: '' },
      left_front_turns: { feature: '', comment: '' },
      left_front_shock: { feature: '', comment: '' },
      left_front_shock_pressure: { feature: '', comment: '' }
    },
    right_front: {
      right_front_psi: { feature: '', comment: '' },
      right_front_offset: { feature: '', comment: '' },
      right_front_block: { feature: '', comment: '' },
      right_front_bar: { feature: '', comment: '' },
      right_front_turns: { feature: '', comment: '' },
      right_front_shock: { feature: '', comment: '' },
      right_front_shock_pressure: { feature: '', comment: '' }
    },
    engine: {
      engine_name: { feature: '', comment: '' },
      engine_size: { feature: '', comment: '' },
      engine_adi: { feature: '', comment: '' },
      engine_air_fuel: { feature: '', comment: '' },
      engine_high_speed: { feature: '', comment: '' },
      engine_mid_low: { feature: '', comment: '' },
      engine_mid_pressure: { feature: '', comment: '' },
      engine_temperature: { feature: '', comment: '' },
      engine_max_rpm: { feature: '', comment: '' }
    },
    wing: {
      wing_nose_position: { feature: '', comment: '' },
      wing_front_guide: { feature: '', comment: '' },
      wing_front_wicker_bill: { feature: '', comment: '' },
      wing_top_position: { feature: '', comment: '' },
      wing_top_angle: { feature: '', comment: '' },
      wing_top_wicker_bill: { feature: '', comment: '' }
    },
    left_rear: {
      left_rear_psi: { feature: '', comment: '' },
      left_rear_bleeders: { feature: '', comment: '' },
      left_rear_inflator: { feature: '', comment: '' },
      left_rear_offset: { feature: '', comment: '' },
      left_rear_circumference: { feature: '', comment: '' },
      left_rear_compound: { feature: '', comment: '' },
      left_rear_spacing: { feature: '', comment: '' },
      left_rear_block: { feature: '', comment: '' },
      left_rear_bar: { feature: '', comment: '' },
      left_rear_turns: { feature: '', comment: '' },
      left_rear_radius_rod: { feature: '', comment: '' },
      left_rear_shock: { feature: '', comment: '' },
      left_rear_shock_pressure: { feature: '', comment: '' }
    },
    right_rear: {
      right_rear_psi: { feature: '', comment: '' },
      right_rear_bleeders: { feature: '', comment: '' },
      right_rear_inflator: { feature: '', comment: '' },
      right_rear_offset: { feature: '', comment: '' },
      right_rear_circumference: { feature: '', comment: '' },
      right_rear_compound: { feature: '', comment: '' },
      right_rear_spacing: { feature: '', comment: '' },
      right_rear_block: { feature: '', comment: '' },
      right_rear_bar: { feature: '', comment: '' },
      right_rear_turns: { feature: '', comment: '' },
      right_rear_radius_rod: { feature: '', comment: '' },
      right_rear_shock: { feature: '', comment: '' },
      right_rear_shock_pressure: { feature: '', comment: '' }
    },
    rear: {
      rear_watts_link_position: { feature: '', comment: '' },
      rear_link_size: { feature: '', comment: '' },
      rear_link_hole: { feature: '', comment: '' },
      rear_stagger: { feature: '', comment: '' },
      rear_fuel_load: { feature: '', comment: '' },
      rear_gear: { feature: '', comment: '' }
    },
    notes: {
      notes_track: { feature: '', comment: '' },
      notes_setup: { feature: '', comment: '' },
      notes_performance: { feature: '', comment: '' },
      notes_maintenance: { feature: '', comment: '' }
    }
  };

  // Track input for track name
  const handleTrackChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTrackName(e.target.value);
  };

  // Track input for date
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDate(e.target.value);
  };

  return (
    <div className="space-y-6">
      <div className="glass-panel p-6 bg-gradient-to-br from-purple-500/10 to-pink-500/10 dark:from-purple-500/20 dark:to-pink-500/20">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-4 text-purple-600 dark:text-purple-400">360 Sprint Cars</h1>
          <p className="text-gray-700 dark:text-gray-300">
            360 Sprint Cars represent the pinnacle of sprint car racing, featuring the most powerful engines and sophisticated setups.
            These high-horsepower machines demand precise tuning and setup expertise to harness their full potential.
            Every detail matters when competing at this level, from wing angles to shock settings.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 items-stretch">
          <LoadSetupsButton carType="360" onLoadSetup={handleLoadSetup} />


        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <CarNumberBox
          value={carNumber}
          onChange={setCarNumber}
        />

        <div className="glass-panel p-4">
          <label htmlFor="track-name" className="block text-lg font-bold mb-2">Track</label>
          <input
            id="track-name"
            type="text"
            value={trackName}
            onChange={handleTrackChange}
            className="w-full p-3 text-center text-lg font-medium rounded-lg bg-white/50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700"
            placeholder="Track Name"
          />
        </div>

        <div className="glass-panel p-4">
          <label htmlFor="setup-date" className="block text-lg font-bold mb-2">Date</label>
          <input
            id="setup-date"
            type="date"
            value={date}
            onChange={handleDateChange}
            className="w-full p-3 text-center text-lg font-medium rounded-lg bg-white/50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700"
          />
        </div>
      </div>


      <DynoImageCapture title="Motor" type="motor" />

      <SetupSheet
        title="360 Sprint"
        carType="360"
        description="Take control of your 360 sprint car setup with professional-grade tracking tools. Monitor and adjust every aspect of your car's performance, from aerodynamics to suspension, ensuring you're always ready for race day."
        initialSetup={currentSetup}
        initialSetupData={initialSetupData}
        carNumber={carNumber}
        trackName={trackName}
        date={date}
        sections={[
          {
            title: "Track",
            fields: ["track_name", "weather", "surface", "start_finish", "handling"]
          },
          {
            title: "Left Front",
            fields: ["left_front_psi", "left_front_offset", "left_front_block", "left_front_bar", "left_front_turns", "left_front_shock", "left_front_shock_pressure"]
          },
          {
            title: "Right Front",
            fields: ["right_front_psi", "right_front_offset", "right_front_block", "right_front_bar", "right_front_turns", "right_front_shock", "right_front_shock_pressure"]
          },
          {
            title: "Engine",
            fields: ["engine_name", "engine_size", "engine_adi", "engine_air_fuel", "engine_high_speed", "engine_mid_low", "engine_mid_pressure", "engine_temperature", "engine_max_rpm"]
          },
          {
            title: "Wing",
            fields: ["wing_nose_position", "wing_front_guide", "wing_front_wicker_bill", "wing_top_position", "wing_top_angle", "wing_top_wicker_bill"]
          },
          {
            title: "Left Rear",
            fields: ["left_rear_psi", "left_rear_bleeders", "left_rear_inflator", "left_rear_offset", "left_rear_circumference", "left_rear_compound", "left_rear_spacing", "left_rear_block", "left_rear_bar", "left_rear_turns", "left_rear_radius_rod", "left_rear_shock", "left_rear_shock_pressure"]
          },
          {
            title: "Right Rear",
            fields: ["right_rear_psi", "right_rear_bleeders", "right_rear_inflator", "right_rear_offset", "right_rear_circumference", "right_rear_compound", "right_rear_spacing", "right_rear_block", "right_rear_bar", "right_rear_turns", "right_rear_radius_rod", "right_rear_shock", "right_rear_shock_pressure"]
          },
          {
            title: "Rear",
            fields: ["rear_watts_link_position", "rear_link_size", "rear_link_hole", "rear_stagger", "rear_fuel_load", "rear_gear"]
          },
          {
            title: "Notes",
            fields: ["notes_track", "notes_setup", "notes_performance", "notes_maintenance"]
          }
        ]}
      />
    </div>
  );
}

export default Sprint360;
