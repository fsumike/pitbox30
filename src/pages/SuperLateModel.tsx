import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Settings, Gauge } from 'lucide-react';
import SetupSheet from '../components/SetupSheet';
import LoadSetupsButton from '../components/LoadSetupsButton';
import DynoImageCapture from '../components/DynoImageCapture';
import CarNumberBox from '../components/CarNumberBox';
import { Setup } from '../lib/supabase';

function SuperLateModel() {
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


  // Define the setup data structure with Super Late Model specific sections
  const initialSetupData = {
    general: {
      car_number: { feature: '', comment: '' },
      track_track: { feature: '', comment: '' },
      track_conditions: { feature: '', comment: '' },
      date: { feature: new Date().toISOString().split('T')[0], comment: '' }
    },
    chassis: {
      chassis_manufacturer: { feature: '', comment: 'e.g., Rocket, Longhorn, Sweet-Bloomquist, etc.' },
      chassis_year: { feature: '', comment: 'Year of chassis' },
      chassis_type: { feature: '', comment: 'Model (XR1, Dominator, etc.)' }
    },
    weight: {
      total_weight: { feature: '', comment: 'Total weight with driver (lbs)' },
      left_side_weight: { feature: '', comment: 'Left side percentage (%)' },
      rear_weight: { feature: '', comment: 'Rear weight percentage (%)' },
      cross_weight: { feature: '', comment: 'Cross weight percentage (%)' },
      fuel_load: { feature: '', comment: 'Starting fuel weight (lbs)' }
    },
    front_end: {
      front_clip: { feature: '', comment: 'Clip type and measurements' },
      steering_box: { feature: '', comment: 'Type and ratio' },
      spindle_type: { feature: '', comment: 'Spindle specifications' },
      bumpsteer: { feature: '', comment: 'Bumpsteer settings' },
      ackermann: { feature: '', comment: 'Ackermann adjustment' },
      camber_gain: { feature: '', comment: 'Camber gain through travel' }
    },
    suspension: {
      front_suspension: { feature: '', comment: 'Type and configuration' },
      rear_suspension: { feature: '', comment: '4-link measurements' },
      bird_cages: { feature: '', comment: 'Bird cage settings' },
      trailing_arms: { feature: '', comment: 'Trailing arm angles and lengths' },
      pull_bar: { feature: '', comment: 'Pull bar settings' },
      lift_arm: { feature: '', comment: 'Lift arm settings' },
      shock_angles: { feature: '', comment: 'Front and rear shock angles' }
    },
    left_front: {
      lf_spring: { feature: '', comment: 'Spring rate (lbs)' },
      lf_spring_rubber: { feature: '', comment: 'Spring rubber configuration' },
      lf_shock: { feature: '', comment: 'Shock type, valving, gas pressure' },
      lf_shock_compression: { feature: '', comment: 'Compression setting' },
      lf_shock_rebound: { feature: '', comment: 'Rebound setting' },
      lf_ride_height: { feature: '', comment: 'Ride height measurement' },
      lf_camber: { feature: '', comment: 'Static camber' },
      lf_caster: { feature: '', comment: 'Static caster' },
      lf_toe: { feature: '', comment: 'Toe setting' },
      lf_shock_travel: { feature: '', comment: 'Available shock travel' },
      lf_droop: { feature: '', comment: 'Droop limiter setting' }
    },
    right_front: {
      rf_spring: { feature: '', comment: 'Spring rate (lbs)' },
      rf_spring_rubber: { feature: '', comment: 'Spring rubber configuration' },
      rf_shock: { feature: '', comment: 'Shock type, valving, gas pressure' },
      rf_shock_compression: { feature: '', comment: 'Compression setting' },
      rf_shock_rebound: { feature: '', comment: 'Rebound setting' },
      rf_ride_height: { feature: '', comment: 'Ride height measurement' },
      rf_camber: { feature: '', comment: 'Static camber' },
      rf_caster: { feature: '', comment: 'Static caster' },
      rf_toe: { feature: '', comment: 'Toe setting' },
      rf_shock_travel: { feature: '', comment: 'Available shock travel' },
      rf_droop: { feature: '', comment: 'Droop limiter setting' }
    },
    left_rear: {
      lr_spring: { feature: '', comment: 'Spring rate (lbs)' },
      lr_spring_rubber: { feature: '', comment: 'Spring rubber configuration' },
      lr_shock: { feature: '', comment: 'Shock type, valving, gas pressure' },
      lr_shock_compression: { feature: '', comment: 'Compression setting' },
      lr_shock_rebound: { feature: '', comment: 'Rebound setting' },
      lr_ride_height: { feature: '', comment: 'Ride height measurement' },
      lr_shock_travel: { feature: '', comment: 'Available shock travel' },
      lr_droop: { feature: '', comment: 'Droop limiter setting' },
      lr_link_heights: { feature: '', comment: 'Upper/lower link heights' },
      lr_trailing_arm_angle: { feature: '', comment: 'Trailing arm angle' },
      lr_pinion_angle: { feature: '', comment: 'Pinion angle' }
    },
    right_rear: {
      rr_spring: { feature: '', comment: 'Spring rate (lbs)' },
      rr_spring_rubber: { feature: '', comment: 'Spring rubber configuration' },
      rr_shock: { feature: '', comment: 'Shock type, valving, gas pressure' },
      rr_shock_compression: { feature: '', comment: 'Compression setting' },
      rr_shock_rebound: { feature: '', comment: 'Rebound setting' },
      rr_ride_height: { feature: '', comment: 'Ride height measurement' },
      rr_shock_travel: { feature: '', comment: 'Available shock travel' },
      rr_droop: { feature: '', comment: 'Droop limiter setting' },
      rr_link_heights: { feature: '', comment: 'Upper/lower link heights' },
      rr_trailing_arm_angle: { feature: '', comment: 'Trailing arm angle' },
      rr_pinion_angle: { feature: '', comment: 'Pinion angle' }
    },
    tires: {
      lf_tire_compound: { feature: '', comment: 'Left front compound' },
      lf_tire_size: { feature: '', comment: 'Left front size' },
      lf_tire_pressure: { feature: '', comment: 'Left front pressure (psi)' },
      rf_tire_compound: { feature: '', comment: 'Right front compound' },
      rf_tire_size: { feature: '', comment: 'Right front size' },
      rf_tire_pressure: { feature: '', comment: 'Right front pressure (psi)' },
      lr_tire_compound: { feature: '', comment: 'Left rear compound' },
      lr_tire_size: { feature: '', comment: 'Left rear size' },
      lr_tire_pressure: { feature: '', comment: 'Left rear pressure (psi)' },
      rr_tire_compound: { feature: '', comment: 'Right rear compound' },
      rr_tire_size: { feature: '', comment: 'Right rear size' },
      rr_tire_pressure: { feature: '', comment: 'Right rear pressure (psi)' },
      cross_pattern: { feature: '', comment: 'Cross pattern' },
      stagger: { feature: '', comment: 'Front/rear stagger' },
      grooving: { feature: '', comment: 'Tire grooving pattern' },
      siping: { feature: '', comment: 'Tire siping pattern' }
    },
    engine: {
      engine_builder: { feature: '', comment: 'Engine builder name' },
      engine_type: { feature: '', comment: 'Engine type (Open, Crate, etc.)' },
      displacement: { feature: '', comment: 'Engine displacement (ci)' },
      compression: { feature: '', comment: 'Compression ratio' },
      carburetor: { feature: '', comment: 'Carburetor specs' },
      timing: { feature: '', comment: 'Total timing' },
      fuel_pressure: { feature: '', comment: 'Fuel pressure setting' },
      oil_pressure: { feature: '', comment: 'Oil pressure reading' },
      water_temp: { feature: '', comment: 'Water temperature' }
    },
    drivetrain: {
      transmission: { feature: '', comment: 'Transmission type and ratios' },
      rear_end: { feature: '', comment: 'Rear end specifications' },
      gear_ratio: { feature: '', comment: 'Final drive ratio' },
      differential: { feature: '', comment: 'Differential/spool setup' }
    },
    aero: {
      nose_height: { feature: '', comment: 'Front nose height' },
      spoiler_angle: { feature: '', comment: 'Rear spoiler angle' },
      spoiler_height: { feature: '', comment: 'Spoiler height' },
      body_height: { feature: '', comment: 'Quarter panel heights' },
      side_boards: { feature: '', comment: 'Side board configuration' },
      roof_angle: { feature: '', comment: 'Roof angle' }
    },
    track_data: {
      banking: { feature: '', comment: 'Track banking angle' },
      surface: { feature: '', comment: 'Track surface type' },
      grip_level: { feature: '', comment: 'Track grip conditions' },
      temperature: { feature: '', comment: 'Track temperature' },
      moisture: { feature: '', comment: 'Track moisture level' }
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
      <div className="glass-panel p-6 bg-gradient-to-br from-red-500/10 to-purple-500/10 dark:from-red-500/20 dark:to-purple-500/20">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-4 text-red-600 dark:text-red-400">Super Late Model</h1>
          <p className="text-gray-700 dark:text-gray-300">
            Super Late Models represent the pinnacle of dirt track racing technology, combining high-horsepower engines with sophisticated chassis and suspension designs. 
            These purpose-built race cars require precise setup adjustments and careful attention to detail to maximize their performance potential. 
            Use our comprehensive setup tools to track and optimize every aspect of your Super Late Model's setup for consistent success on the track.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 items-stretch">
          <LoadSetupsButton carType="super-latemodel" onLoadSetup={handleLoadSetup} />
          
          
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
        title="Super Late Model"
        carType="super-latemodel"
        description="Track and optimize your Super Late Model setup with our comprehensive setup sheet. Monitor chassis adjustments, suspension settings, and tire data to maximize performance and consistency."
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
            fields: ["chassis_manufacturer", "chassis_year", "chassis_type"]
          },
          {
            title: "Weight",
            fields: ["total_weight", "left_side_weight", "rear_weight", "cross_weight", "fuel_load"]
          },
          {
            title: "Front End",
            fields: ["front_clip", "steering_box", "spindle_type", "bumpsteer", "ackermann", "camber_gain"]
          },
          {
            title: "Suspension",
            fields: ["front_suspension", "rear_suspension", "bird_cages", "trailing_arms", "pull_bar", "lift_arm", "shock_angles"]
          },
          {
            title: "Left Front",
            fields: ["lf_spring", "lf_spring_rubber", "lf_shock", "lf_shock_compression", "lf_shock_rebound", "lf_ride_height", "lf_camber", "lf_caster", "lf_toe", "lf_shock_travel", "lf_droop"]
          },
          {
            title: "Right Front",
            fields: ["rf_spring", "rf_spring_rubber", "rf_shock", "rf_shock_compression", "rf_shock_rebound", "rf_ride_height", "rf_camber", "rf_caster", "rf_toe", "rf_shock_travel", "rf_droop"]
          },
          {
            title: "Left Rear",
            fields: ["lr_spring", "lr_spring_rubber", "lr_shock", "lr_shock_compression", "lr_shock_rebound", "lr_ride_height", "lr_shock_travel", "lr_droop", "lr_link_heights", "lr_trailing_arm_angle", "lr_pinion_angle"]
          },
          {
            title: "Right Rear",
            fields: ["rr_spring", "rr_spring_rubber", "rr_shock", "rr_shock_compression", "rr_shock_rebound", "rr_ride_height", "rr_shock_travel", "rr_droop", "rr_link_heights", "rr_trailing_arm_angle", "rr_pinion_angle"]
          },
          {
            title: "Tires",
            fields: ["lf_tire_compound", "lf_tire_size", "lf_tire_pressure", "rf_tire_compound", "rf_tire_size", "rf_tire_pressure", "lr_tire_compound", "lr_tire_size", "lr_tire_pressure", "rr_tire_compound", "rr_tire_size", "rr_tire_pressure", "cross_pattern", "stagger", "grooving", "siping"]
          },
          {
            title: "Engine",
            fields: ["engine_builder", "engine_type", "displacement", "compression", "carburetor", "timing", "fuel_pressure", "oil_pressure", "water_temp"]
          },
          {
            title: "Drivetrain",
            fields: ["transmission", "rear_end", "gear_ratio", "differential"]
          },
          {
            title: "Aero",
            fields: ["nose_height", "spoiler_angle", "spoiler_height", "body_height", "side_boards", "roof_angle"]
          },
          {
            title: "Track Data",
            fields: ["banking", "surface", "grip_level", "temperature", "moisture"]
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

export default SuperLateModel;
