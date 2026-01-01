import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Settings, Gauge } from 'lucide-react';
import SetupSheet from '../components/SetupSheet';
import LoadSetupsButton from '../components/LoadSetupsButton';
import DynoImageCapture from '../components/DynoImageCapture';
import CarNumberBox from '../components/CarNumberBox';
import { Setup } from '../lib/supabase';

function FocusMidget() {
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
    other: {
      other_engine: { feature: '', comment: '' },
      other_fuel: { feature: '', comment: '' },
      other_ignition: { feature: '', comment: '' },
      other_weight_total: { feature: '', comment: '' },
      other_weight_left: { feature: '', comment: '' },
      other_weight_rear: { feature: '', comment: '' }
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
    left_rear: {
      left_rear_spring: { feature: '', comment: '' },
      left_rear_shock: { feature: '', comment: '' },
      left_rear_ride_height: { feature: '', comment: '' },
      left_rear_stagger: { feature: '', comment: '' },
      left_rear_offset: { feature: '', comment: '' },
      left_rear_tire_pressure: { feature: '', comment: '' }
    },
    right_rear: {
      right_rear_spring: { feature: '', comment: '' },
      right_rear_shock: { feature: '', comment: '' },
      right_rear_ride_height: { feature: '', comment: '' },
      right_rear_stagger: { feature: '', comment: '' },
      right_rear_offset: { feature: '', comment: '' },
      right_rear_tire_pressure: { feature: '', comment: '' }
    },
    notes: {
      notes_general: { feature: '', comment: '' },
      notes_track: { feature: '', comment: '' },
      notes_performance: { feature: '', comment: '' },
      notes_driver_feedback: { feature: '', comment: '' },
      notes_future_changes: { feature: '', comment: '' }
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
      <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-teal-600 via-teal-700 to-emerald-800 p-8">
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Focus Midget Cars</h1>
        <p className="text-gray-100 text-sm md:text-base max-w-2xl">
          Lightweight open-wheel racing with a focus on driver development and competitive racing.
        </p>
      </div>

      <div className="glass-panel p-6 bg-gradient-to-br from-teal-500/10 to-emerald-500/10 dark:from-teal-500/20 dark:to-emerald-500/20">
        <div className="mb-6">
          <p className="text-gray-700 dark:text-gray-300">
            Focus Midget cars offer an exciting entry point into open-wheel racing with their lightweight design and responsive handling.
            These purpose-built race cars feature a focus on driver development and competitive racing while maintaining safety standards.
            Use our comprehensive setup tools to fine-tune your Focus Midget's performance characteristics for optimal results on any track.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 items-stretch">
          <LoadSetupsButton carType="focus" onLoadSetup={handleLoadSetup} />
          
          
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
        title="Focus Midget"
        carType="focus"
        description="Track and optimize your Focus Midget car setup with our detailed setup sheet. Monitor engine parameters, chassis adjustments, and suspension settings to find the perfect balance for competitive racing."
        initialSetup={currentSetup}
        initialSetupData={initialSetupData}
        carNumber={carNumber}
        trackName={trackName}
        date={date}
        sections={[
          {
            title: "General",
            fields: ["car_number", "track_track", "track_conditions", "date"]
          },
          {
            title: "Other",
            fields: ["other_engine", "other_fuel", "other_ignition", "other_weight_total", "other_weight_left", "other_weight_rear", "final_gear"]
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
            title: "Left Rear",
            fields: ["left_rear_spring", "left_rear_shock", "left_rear_ride_height", "left_rear_stagger", "left_rear_offset", "left_rear_tire_pressure"]
          },
          {
            title: "Right Rear",
            fields: ["right_rear_spring", "right_rear_shock", "right_rear_ride_height", "right_rear_stagger", "right_rear_offset", "right_rear_tire_pressure"]
          },
          {
            title: "Notes",
            fields: ["notes_general", "notes_track", "notes_performance", "notes_driver_feedback", "notes_future_changes"]
          }
        ]}
      />
    </div>
  );
}

export default FocusMidget;
