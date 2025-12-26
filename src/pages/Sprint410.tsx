import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Settings, Gauge } from 'lucide-react';
import SetupSheet from '../components/SetupSheet';
import LoadSetupsButton from '../components/LoadSetupsButton';
import DynoImageCapture from '../components/DynoImageCapture';
import CarNumberBox from '../components/CarNumberBox';
import { Setup } from '../lib/supabase';

function Sprint410() {
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
    general: {
      car_number: { feature: '', comment: '' },
      track_track: { feature: '', comment: '' },
      track_conditions: { feature: '', comment: '' },
      date: { feature: new Date().toISOString().split('T')[0], comment: '' }
    },
    left_front: {
      left_front_spring: { feature: '', comment: '' },
      left_front_shock: { feature: '', comment: '' },
      left_front_ride_height: { feature: '', comment: '' },
      left_front_stagger: { feature: '', comment: '' },
      left_front_offset: { feature: '', comment: '' },
      left_front_camber: { feature: '', comment: '' },
      left_front_tire_pressure: { feature: '', comment: '' }
    },
    right_front: {
      right_front_spring: { feature: '', comment: '' },
      right_front_shock: { feature: '', comment: '' },
      right_front_ride_height: { feature: '', comment: '' },
      right_front_stagger: { feature: '', comment: '' },
      right_front_offset: { feature: '', comment: '' },
      right_front_camber: { feature: '', comment: '' },
      right_front_tire_pressure: { feature: '', comment: '' }
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
      left_rear_spring: { feature: '', comment: '' },
      left_rear_shock: { feature: '', comment: '' },
      left_rear_ride_height: { feature: '', comment: '' },
      left_rear_stagger: { feature: '', comment: '' },
      left_rear_offset: { feature: '', comment: '' },
      left_rear_tire_pressure: { feature: '', comment: '' },
      left_rear_camber: { feature: '', comment: '' },
      left_rear_toe: { feature: '', comment: '' },
      left_rear_spring_rate: { feature: '', comment: '' },
      left_rear_shock_rebound: { feature: '', comment: '' },
      left_rear_shock_compression: { feature: '', comment: '' },
      left_rear_panhard_bar: { feature: '', comment: '' },
      left_rear_sway_bar: { feature: '', comment: '' }
    },
    right_rear: {
      right_rear_spring: { feature: '', comment: '' },
      right_rear_shock: { feature: '', comment: '' },
      right_rear_ride_height: { feature: '', comment: '' },
      right_rear_stagger: { feature: '', comment: '' },
      right_rear_offset: { feature: '', comment: '' },
      right_rear_tire_pressure: { feature: '', comment: '' },
      right_rear_camber: { feature: '', comment: '' },
      right_rear_toe: { feature: '', comment: '' },
      right_rear_spring_rate: { feature: '', comment: '' },
      right_rear_shock_rebound: { feature: '', comment: '' },
      right_rear_shock_compression: { feature: '', comment: '' },
      right_rear_panhard_bar: { feature: '', comment: '' },
      right_rear_sway_bar: { feature: '', comment: '' }
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
      notes_general: { feature: '', comment: '' },
      notes_track: { feature: '', comment: '' },
      notes_performance: { feature: '', comment: '' },
      notes_driver_feedback: { feature: '', comment: '' }
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
          <h1 className="text-3xl font-bold mb-4 text-purple-600 dark:text-purple-400">410 Sprint Cars</h1>
          <p className="text-gray-700 dark:text-gray-300">
            410 Sprint Cars represent the pinnacle of sprint car racing, featuring the most powerful engines and sophisticated setups. 
            These high-horsepower machines demand precise tuning and setup expertise to harness their full potential.
            Every detail matters when competing at this level, from wing angles to shock settings.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 items-stretch">
          <LoadSetupsButton carType="410" onLoadSetup={handleLoadSetup} />
          
          
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
        title="410 Sprint"
        carType="410"
        description="Take control of your 410 sprint car setup with professional-grade tracking tools. Monitor and adjust every aspect of your car's performance, from aerodynamics to suspension, ensuring you're always ready for race day."
        initialSetup={currentSetup}
        initialSetupData={initialSetupData}
        carNumber={carNumber}
        trackName={trackName}
        date={date}
        sections={[
          {
            title: "Track",
            fields: ["car_number", "track_track", "track_conditions", "date"]
          },
          {
            title: "Left Front",
            fields: ["left_front_spring", "left_front_shock", "left_front_ride_height", "left_front_stagger", "left_front_offset", "left_front_camber", "left_front_tire_pressure"]
          },
          {
            title: "Right Front",
            fields: ["right_front_spring", "right_front_shock", "right_front_ride_height", "right_front_stagger", "right_front_offset", "right_front_camber", "right_front_tire_pressure"]
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
            fields: ["left_rear_spring", "left_rear_shock", "left_rear_ride_height", "left_rear_stagger", "left_rear_offset", "left_rear_tire_pressure", "left_rear_camber", "left_rear_toe", "left_rear_spring_rate", "left_rear_shock_rebound", "left_rear_shock_compression", "left_rear_panhard_bar", "left_rear_sway_bar"]
          },
          {
            title: "Right Rear",
            fields: ["right_rear_spring", "right_rear_shock", "right_rear_ride_height", "right_rear_stagger", "right_rear_offset", "right_rear_tire_pressure", "right_rear_camber", "right_rear_toe", "right_rear_spring_rate", "right_rear_shock_rebound", "right_rear_shock_compression", "right_rear_panhard_bar", "right_rear_sway_bar"]
          },
          {
            title: "Rear",
            fields: ["rear_watts_link_position", "rear_link_size", "rear_link_hole", "rear_stagger", "rear_fuel_load", "rear_gear"]
          },
          {
            title: "Notes",
            fields: ["notes_general", "notes_track", "notes_performance", "notes_driver_feedback"]
          }
        ]}
      />
    </div>
  );
}

export default Sprint410;