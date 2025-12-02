import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Settings, Gauge } from 'lucide-react';
import SetupSheet from '../components/SetupSheet';
import LoadSetupsButton from '../components/LoadSetupsButton';
import DynoImageCapture from '../components/DynoImageCapture';
import CarNumberBox from '../components/CarNumberBox';
import { Setup } from '../lib/supabase';

function StreetStock() {
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


  // Define the setup data structure with Street Stock specific sections
  const initialSetupData = {
    general: {
      car_number: { feature: '', comment: '' },
      track_track: { feature: '', comment: '' },
      track_conditions: { feature: '', comment: '' },
      date: { feature: new Date().toISOString().split('T')[0], comment: '' }
    },
    chassis: {
      chassis_make: { feature: '', comment: 'Vehicle make and model' },
      chassis_year: { feature: '', comment: 'Year of chassis' },
      frame_type: { feature: '', comment: 'Stock or modified frame' },
      wheelbase: { feature: '', comment: 'Wheelbase measurement' }
    },
    weight: {
      total_weight: { feature: '', comment: 'Total weight with driver (lbs)' },
      left_side_weight: { feature: '', comment: 'Left side percentage (%)' },
      rear_weight: { feature: '', comment: 'Rear weight percentage (%)' },
      cross_weight: { feature: '', comment: 'Cross weight percentage (%)' },
      minimum_weight: { feature: '', comment: 'Class minimum weight requirement' }
    },
    front_end: {
      front_clip: { feature: '', comment: 'Front clip type' },
      steering_box: { feature: '', comment: 'Steering box type and ratio' },
      upper_control_arms: { feature: '', comment: 'Upper control arm specifications' },
      lower_control_arms: { feature: '', comment: 'Lower control arm specifications' },
      camber: { feature: '', comment: 'Camber settings' },
      caster: { feature: '', comment: 'Caster settings' },
      toe: { feature: '', comment: 'Toe settings' }
    },
    rear_end: {
      rear_end_type: { feature: '', comment: 'Rear end type (Ford 9", GM 10-bolt, etc.)' },
      gear_ratio: { feature: '', comment: 'Rear end gear ratio' },
      rear_end_width: { feature: '', comment: 'Rear end width' },
      trailing_arms: { feature: '', comment: 'Trailing arm specifications' },
      panhard_bar: { feature: '', comment: 'Panhard bar height and mounting' }
    },
    left_front: {
      lf_spring: { feature: '', comment: 'Spring rate (lbs)' },
      lf_shock: { feature: '', comment: 'Shock type and valving' },
      lf_ride_height: { feature: '', comment: 'Ride height measurement' },
      lf_camber: { feature: '', comment: 'Camber setting' },
      lf_caster: { feature: '', comment: 'Caster setting' },
      lf_toe: { feature: '', comment: 'Toe setting' },
      lf_tire_compound: { feature: '', comment: 'Tire compound' },
      lf_tire_pressure: { feature: '', comment: 'Tire pressure (psi)' }
    },
    right_front: {
      rf_spring: { feature: '', comment: 'Spring rate (lbs)' },
      rf_shock: { feature: '', comment: 'Shock type and valving' },
      rf_ride_height: { feature: '', comment: 'Ride height measurement' },
      rf_camber: { feature: '', comment: 'Camber setting' },
      rf_caster: { feature: '', comment: 'Caster setting' },
      rf_toe: { feature: '', comment: 'Toe setting' },
      rf_tire_compound: { feature: '', comment: 'Tire compound' },
      rf_tire_pressure: { feature: '', comment: 'Tire pressure (psi)' }
    },
    left_rear: {
      lr_spring: { feature: '', comment: 'Spring rate (lbs)' },
      lr_shock: { feature: '', comment: 'Shock type and valving' },
      lr_ride_height: { feature: '', comment: 'Ride height measurement' },
      lr_tire_compound: { feature: '', comment: 'Tire compound' },
      lr_tire_pressure: { feature: '', comment: 'Tire pressure (psi)' }
    },
    right_rear: {
      rr_spring: { feature: '', comment: 'Spring rate (lbs)' },
      rr_shock: { feature: '', comment: 'Shock type and valving' },
      rr_ride_height: { feature: '', comment: 'Ride height measurement' },
      rr_tire_compound: { feature: '', comment: 'Tire compound' },
      rr_tire_pressure: { feature: '', comment: 'Tire pressure (psi)' }
    },
    engine: {
      engine_type: { feature: '', comment: 'Engine specifications' },
      displacement: { feature: '', comment: 'Engine displacement (ci)' },
      compression: { feature: '', comment: 'Compression ratio' },
      carburetor: { feature: '', comment: 'Carburetor type and size' },
      intake: { feature: '', comment: 'Intake manifold' },
      heads: { feature: '', comment: 'Cylinder head specifications' },
      cam: { feature: '', comment: 'Camshaft specifications' },
      exhaust: { feature: '', comment: 'Header/exhaust specifications' },
      ignition: { feature: '', comment: 'Ignition system' },
      timing: { feature: '', comment: 'Ignition timing' }
    },
    drivetrain: {
      transmission: { feature: '', comment: 'Transmission type' },
      clutch: { feature: '', comment: 'Clutch specifications' },
      torque_converter: { feature: '', comment: 'Torque converter specifications' },
      driveshaft: { feature: '', comment: 'Driveshaft material and size' }
    },
    brakes: {
      front_brakes: { feature: '', comment: 'Front brake specifications' },
      rear_brakes: { feature: '', comment: 'Rear brake specifications' },
      brake_bias: { feature: '', comment: 'Brake bias adjustment' },
      master_cylinder: { feature: '', comment: 'Master cylinder size' }
    },
    notes: {
      track_notes: { feature: '', comment: 'Track condition notes' },
      setup_notes: { feature: '', comment: 'General setup notes' },
      performance_notes: { feature: '', comment: 'Performance feedback' },
      maintenance_notes: { feature: '', comment: 'Maintenance items' }
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
      <div className="glass-panel p-6 bg-gradient-to-br from-blue-500/10 to-purple-500/10 dark:from-blue-500/20 dark:to-purple-500/20">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-4 text-blue-600 dark:text-blue-400">Street Stocks</h1>
          <p className="text-gray-700 dark:text-gray-300">
            Street Stocks (also known as Pure Stocks, Hobby Stocks, or Factory Stocks depending on the region) are an entry-level dirt track racing class 
            that emphasizes affordability and accessibility. These cars typically feature stock frames, limited modifications, and strict rule sets 
            designed to keep costs down while providing competitive racing. Use our comprehensive setup tools to find the edge within your class rules.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 items-stretch">
          <LoadSetupsButton carType="street-stock" onLoadSetup={handleLoadSetup} />
          
          
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
        title="Street Stock"
        carType="street-stock"
        description="Track and optimize your Street Stock setup with our detailed setup sheet. Monitor chassis adjustments, suspension settings, and engine parameters while staying within class rules and regulations."
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
            title: "Chassis",
            fields: ["chassis_make", "chassis_year", "frame_type", "wheelbase"]
          },
          {
            title: "Weight",
            fields: ["total_weight", "left_side_weight", "rear_weight", "cross_weight", "minimum_weight"]
          },
          {
            title: "Front End",
            fields: ["front_clip", "steering_box", "upper_control_arms", "lower_control_arms", "camber", "caster", "toe"]
          },
          {
            title: "Rear End",
            fields: ["rear_end_type", "gear_ratio", "rear_end_width", "trailing_arms", "panhard_bar"]
          },
          {
            title: "Left Front",
            fields: ["lf_spring", "lf_shock", "lf_ride_height", "lf_camber", "lf_caster", "lf_toe", "lf_tire_compound", "lf_tire_pressure"]
          },
          {
            title: "Right Front",
            fields: ["rf_spring", "rf_shock", "rf_ride_height", "rf_camber", "rf_caster", "rf_toe", "rf_tire_compound", "rf_tire_pressure"]
          },
          {
            title: "Left Rear",
            fields: ["lr_spring", "lr_shock", "lr_ride_height", "lr_tire_compound", "lr_tire_pressure"]
          },
          {
            title: "Right Rear",
            fields: ["rr_spring", "rr_shock", "rr_ride_height", "rr_tire_compound", "rr_tire_pressure"]
          },
          {
            title: "Engine",
            fields: ["engine_type", "displacement", "compression", "carburetor", "intake", "heads", "cam", "exhaust", "ignition", "timing"]
          },
          {
            title: "Drivetrain",
            fields: ["transmission", "clutch", "torque_converter", "driveshaft"]
          },
          {
            title: "Brakes",
            fields: ["front_brakes", "rear_brakes", "brake_bias", "master_cylinder"]
          },
          {
            title: "Notes",
            fields: ["track_notes", "setup_notes", "performance_notes", "maintenance_notes"]
          }
        ]}
      />
    </div>
  );
}

export default StreetStock;
