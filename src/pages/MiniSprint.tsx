import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Settings, Gauge } from 'lucide-react';
import SetupSheet from '../components/SetupSheet';
import LoadSetupsButton from '../components/LoadSetupsButton';
import DynoImageCapture from '../components/DynoImageCapture';
import CarNumberBox from '../components/CarNumberBox';
import { Setup } from '../lib/supabase';

function MiniSprint() {
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
    const trackNm = setup?.track_name || setup?.setup_data?.general?.track_name?.feature || '';
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


  // Organized by corner with all related components
  const initialSetupData = {
    general: {
      car_number: { feature: '', comment: '' },
      track_name: { feature: '', comment: '' },
      track_size: { feature: '', comment: '' },
      track_condition: { feature: '', comment: '' },
      configuration: { feature: '', comment: '' },
      date: { feature: new Date().toISOString().split('T')[0], comment: '' },
      weather: { feature: '', comment: '' }
    },
    left_front: {
      lf_torsion_bar_size: { feature: '', comment: '' },
      lf_torsion_bar_turns: { feature: '', comment: '' },
      lf_shock: { feature: '', comment: '' },
      lf_tire_compound: { feature: '', comment: '' },
      lf_cold_pressure: { feature: '', comment: '' },
      lf_hot_pressure: { feature: '', comment: '' },
      lf_ride_height: { feature: '', comment: '' },
      lf_camber: { feature: '', comment: '' },
      lf_weight: { feature: '', comment: '' }
    },
    right_front: {
      rf_torsion_bar_size: { feature: '', comment: '' },
      rf_torsion_bar_turns: { feature: '', comment: '' },
      rf_shock: { feature: '', comment: '' },
      rf_tire_compound: { feature: '', comment: '' },
      rf_cold_pressure: { feature: '', comment: '' },
      rf_hot_pressure: { feature: '', comment: '' },
      rf_ride_height: { feature: '', comment: '' },
      rf_tire_offset: { feature: '', comment: '' },
      rf_caster: { feature: '', comment: '' },
      rf_camber: { feature: '', comment: '' },
      rf_toe: { feature: '', comment: '' },
      rf_weight: { feature: '', comment: '' }
    },
    left_rear: {
      lr_torsion_bar_size: { feature: '', comment: '' },
      lr_torsion_bar_turns: { feature: '', comment: '' },
      lr_shock: { feature: '', comment: '' },
      lr_tire_compound: { feature: '', comment: '' },
      lr_cold_pressure: { feature: '', comment: '' },
      lr_hot_pressure: { feature: '', comment: '' },
      lr_ride_height: { feature: '', comment: '' },
      lr_tire_circumference: { feature: '', comment: '' },
      lr_weight: { feature: '', comment: '' }
    },
    right_rear: {
      rr_torsion_bar_size: { feature: '', comment: '' },
      rr_torsion_bar_turns: { feature: '', comment: '' },
      rr_shock: { feature: '', comment: '' },
      rr_tire_compound: { feature: '', comment: '' },
      rr_cold_pressure: { feature: '', comment: '' },
      rr_hot_pressure: { feature: '', comment: '' },
      rr_ride_height: { feature: '', comment: '' },
      rr_tire_offset: { feature: '', comment: '' },
      rr_tire_circumference: { feature: '', comment: '' },
      rr_weight: { feature: '', comment: '' }
    },
    stagger_alignment: {
      stagger: { feature: '', comment: '' },
      rear_axle_square: { feature: '', comment: '' }
    },
    wing_winged: {
      wing_angle: { feature: '', comment: '' },
      wing_position: { feature: '', comment: '' },
      left_sideboard_height: { feature: '', comment: '' },
      right_sideboard_height: { feature: '', comment: '' }
    },
    wing_nonwinged: {
      nonwing_notes: { feature: '', comment: '' },
      nonwing_setup_differences: { feature: '', comment: '' }
    },
    gearing: {
      engine_sprocket: { feature: '', comment: '' },
      jackshaft_sprocket_engine: { feature: '', comment: '' },
      jackshaft_sprocket_axle: { feature: '', comment: '' },
      axle_sprocket: { feature: '', comment: '' },
      overall_ratio: { feature: '', comment: '' },
      clutch_type: { feature: '', comment: '' },
      clutch_springs: { feature: '', comment: '' },
      chain_tension: { feature: '', comment: '' }
    },
    engine: {
      engine_type: { feature: '', comment: '' },
      fuel_type: { feature: '', comment: '' },
      carburetor: { feature: '', comment: '' },
      jetting_main: { feature: '', comment: '' },
      jetting_pilot: { feature: '', comment: '' },
      air_filter: { feature: '', comment: '' }
    },
    chassis: {
      wheelbase: { feature: '', comment: '' },
      panhard_bar_height: { feature: '', comment: '' },
      front_axle_offset: { feature: '', comment: '' }
    },
    weight_distribution: {
      total_weight: { feature: '', comment: '' },
      cross_weight: { feature: '', comment: '' },
      rear_percentage: { feature: '', comment: '' },
      left_side_percentage: { feature: '', comment: '' }
    },

    notes: {
      setup_notes: { feature: '', comment: '' },
      track_notes: { feature: '', comment: '' },
      what_worked: { feature: '', comment: '' },
      next_time: { feature: '', comment: '' }
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
      <div className="glass-panel p-6 bg-gradient-to-br from-pink-500/10 to-purple-500/10 dark:from-pink-500/20 dark:to-purple-500/20">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-4 text-pink-600 dark:text-pink-400">Mini Sprints</h1>
          <p className="text-gray-700 dark:text-gray-300">
            Mini Sprints deliver intense racing action in a compact package. Track your essential setup changes
            from hot laps through the feature race. Each corner section includes torsion bars, shocks, tires, measurements,
            and weights - everything you need organized by corner for quick reference and adjustments.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 items-stretch">
          <LoadSetupsButton carType="mini" onLoadSetup={handleLoadSetup} />
          
          
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
        title="Mini Sprint"
        carType="mini"
        description="Quick-reference setup tracking organized by corner. Each corner includes torsion bars, shocks, tires, measurements, and weights. Separate sections for winged and non-winged configurations. Track what works and build your setup library."
        initialSetup={currentSetup}
        initialSetupData={initialSetupData}
        carNumber={carNumber}
        trackName={trackName}
        date={date}
        sections={[
          {
            title: "General",
            fields: ["car_number", "track_name", "track_size", "track_condition", "configuration", "date", "weather"]
          },
          {
            title: "Left Front",
            fields: ["lf_torsion_bar_size", "lf_torsion_bar_turns", "lf_shock", "lf_tire_compound", "lf_cold_pressure", "lf_hot_pressure", "lf_ride_height", "lf_camber", "lf_weight"]
          },
          {
            title: "Right Front",
            fields: ["rf_torsion_bar_size", "rf_torsion_bar_turns", "rf_shock", "rf_tire_compound", "rf_cold_pressure", "rf_hot_pressure", "rf_ride_height", "rf_tire_offset", "rf_caster", "rf_camber", "rf_toe", "rf_weight"]
          },
          {
            title: "Left Rear",
            fields: ["lr_torsion_bar_size", "lr_torsion_bar_turns", "lr_shock", "lr_tire_compound", "lr_cold_pressure", "lr_hot_pressure", "lr_ride_height", "lr_tire_circumference", "lr_weight"]
          },
          {
            title: "Right Rear",
            fields: ["rr_torsion_bar_size", "rr_torsion_bar_turns", "rr_shock", "rr_tire_compound", "rr_cold_pressure", "rr_hot_pressure", "rr_ride_height", "rr_tire_offset", "rr_tire_circumference", "rr_weight"]
          },
          {
            title: "Stagger & Alignment",
            fields: ["stagger", "rear_axle_square"]
          },
          {
            title: "Wing Setup (Winged)",
            fields: ["wing_angle", "wing_position", "left_sideboard_height", "right_sideboard_height"]
          },
          {
            title: "Non-Winged Setup",
            fields: ["nonwing_notes", "nonwing_setup_differences"]
          },
          {
            title: "Gearing & Drivetrain",
            fields: ["engine_sprocket", "jackshaft_sprocket_engine", "jackshaft_sprocket_axle", "axle_sprocket", "overall_ratio", "clutch_type", "clutch_springs", "chain_tension"]
          },
          {
            title: "Engine",
            fields: ["engine_type", "fuel_type", "carburetor", "jetting_main", "jetting_pilot", "air_filter"]
          },
          {
            title: "Chassis Setup",
            fields: ["wheelbase", "panhard_bar_height", "front_axle_offset"]
          },
          {
            title: "Weight Distribution",
            fields: ["total_weight", "cross_weight", "rear_percentage", "left_side_percentage"]
          },
          {
            title: "Notes",
            fields: ["setup_notes", "track_notes", "what_worked", "next_time"]
          }
        ]}
      />
    </div>
  );
}

export default MiniSprint;
