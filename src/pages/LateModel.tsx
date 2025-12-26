import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Settings, Gauge } from 'lucide-react';
import SetupSheet from '../components/SetupSheet';
import LoadSetupsButton from '../components/LoadSetupsButton';
import DynoImageCapture from '../components/DynoImageCapture';
import { Setup } from '../lib/supabase';

function LateModel() {
  const location = useLocation();

  const [currentSetup, setCurrentSetup] = useState<Setup | null>(null);

  // Define the setup data structure with Late Model specific sections
  const initialSetupData = {
    general: {
      car_number: { feature: '', comment: '' },
      track_track: { feature: '', comment: '' },
      track_conditions: { feature: '', comment: '' },
      date: { feature: new Date().toISOString().split('T')[0], comment: '' }
    },
    chassis: {
      chassis_manufacturer: { feature: '', comment: 'e.g., Rocket, Longhorn, etc.' },
      chassis_year: { feature: '', comment: '' },
      chassis_type: { feature: '', comment: 'XR1, etc.' }
    },
    weight: {
      total_weight: { feature: '', comment: 'Total weight with driver (lbs)' },
      left_side_weight: { feature: '', comment: 'Left side percentage' },
      rear_weight: { feature: '', comment: 'Rear weight percentage' },
      corner_weights: { feature: '', comment: 'Individual corner weights' },
      fuel_load: { feature: '', comment: 'Starting fuel weight' }
    },
    front_end: {
      front_clip: { feature: '', comment: 'Clip type and measurements' },
      steering_box: { feature: '', comment: 'Type and ratio' },
      spindle_length: { feature: '', comment: 'Spindle measurements' },
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
      lf_shock: { feature: '', comment: 'Shock type, valving, gas pressure' },
      lf_ride_height: { feature: '', comment: 'Ride height measurement' },
      lf_camber: { feature: '', comment: 'Static camber' },
      lf_caster: { feature: '', comment: 'Static caster' },
      lf_toe: { feature: '', comment: 'Toe setting' },
      lf_shock_travel: { feature: '', comment: 'Available shock travel' },
      lf_droop: { feature: '', comment: 'Droop limiter setting' }
    },
    right_front: {
      rf_spring: { feature: '', comment: 'Spring rate (lbs)' },
      rf_shock: { feature: '', comment: 'Shock type, valving, gas pressure' },
      rf_ride_height: { feature: '', comment: 'Ride height measurement' },
      rf_camber: { feature: '', comment: 'Static camber' },
      rf_caster: { feature: '', comment: 'Static caster' },
      rf_toe: { feature: '', comment: 'Toe setting' },
      rf_shock_travel: { feature: '', comment: 'Available shock travel' },
      rf_droop: { feature: '', comment: 'Droop limiter setting' }
    },
    left_rear: {
      lr_spring: { feature: '', comment: 'Spring rate (lbs)' },
      lr_shock: { feature: '', comment: 'Shock type, valving, gas pressure' },
      lr_ride_height: { feature: '', comment: 'Ride height measurement' },
      lr_shock_travel: { feature: '', comment: 'Available shock travel' },
      lr_droop: { feature: '', comment: 'Droop limiter setting' },
      lr_link_heights: { feature: '', comment: 'Upper/lower link heights' }
    },
    right_rear: {
      rr_spring: { feature: '', comment: 'Spring rate (lbs)' },
      rr_shock: { feature: '', comment: 'Shock type, valving, gas pressure' },
      rr_ride_height: { feature: '', comment: 'Ride height measurement' },
      rr_shock_travel: { feature: '', comment: 'Available shock travel' },
      rr_droop: { feature: '', comment: 'Droop limiter setting' },
      rr_link_heights: { feature: '', comment: 'Upper/lower link heights' }
    },
    tires: {
      lf_tire: { feature: '', comment: 'Compound, size, pressure' },
      rf_tire: { feature: '', comment: 'Compound, size, pressure' },
      lr_tire: { feature: '', comment: 'Compound, size, pressure' },
      rr_tire: { feature: '', comment: 'Compound, size, pressure' },
      cross: { feature: '', comment: 'Cross pattern' },
      stagger: { feature: '', comment: 'Front/rear stagger' },
      grooving: { feature: '', comment: 'Tire grooving pattern' },
      siping: { feature: '', comment: 'Tire siping pattern' }
    },
    engine: {
      engine_builder: { feature: '', comment: 'Engine builder name' },
      displacement: { feature: '', comment: 'Engine displacement (ci)' },
      compression: { feature: '', comment: 'Compression ratio' },
      carburetor: { feature: '', comment: 'Carburetor specs' },
      timing: { feature: '', comment: 'Total timing' },
      fuel_pressure: { feature: '', comment: 'Fuel pressure setting' },
      oil_pressure: { feature: '', comment: 'Oil pressure reading' }
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
      body_height: { feature: '', comment: 'Quarter panel heights' },
      side_boards: { feature: '', comment: 'Side board configuration' }
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

  return (
    <div className="space-y-6">
      <div className="glass-panel p-6 bg-gradient-to-br from-red-500/10 to-orange-500/10 dark:from-red-500/20 dark:to-orange-500/20">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-4 text-red-600 dark:text-red-400">Late Model</h1>
          <p className="text-gray-700 dark:text-gray-300">
            Super Late Models represent the pinnacle of dirt track racing technology, combining high-horsepower engines with sophisticated chassis and suspension designs. 
            These purpose-built race cars require precise setup adjustments and careful attention to detail to maximize their performance potential. 
            Use our comprehensive setup tools to track and optimize every aspect of your Late Model's setup for consistent success on the track.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 items-stretch">
          <LoadSetupsButton carType="late-model" onLoadSetup={handleLoadSetup} />
          
          
        </div>
      </div>

      <DynoImageCapture title="Motor" type="motor" />

      <SetupSheet 
        title="Late Model"
        carType="late-model"
        description="Track and optimize your Late Model setup with our comprehensive setup sheet. Monitor chassis adjustments, suspension settings, and tire data to maximize performance and consistency."
        initialSetup={currentSetup}
        initialSetupData={initialSetupData}
        carNumber={carNumber}
        trackName={trackName}
        date={date}
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
            fields: ["total_weight", "left_side_weight", "rear_weight", "corner_weights", "fuel_load"]
          },
          {
            title: "Front End",
            fields: ["front_clip", "steering_box", "spindle_length", "bumpsteer", "ackermann", "camber_gain"]
          },
          {
            title: "Suspension",
            fields: ["front_suspension", "rear_suspension", "bird_cages", "trailing_arms", "pull_bar", "lift_arm", "shock_angles"]
          },
          {
            title: "Left Front",
            fields: ["lf_spring", "lf_shock", "lf_ride_height", "lf_camber", "lf_caster", "lf_toe", "lf_shock_travel", "lf_droop"]
          },
          {
            title: "Right Front",
            fields: ["rf_spring", "rf_shock", "rf_ride_height", "rf_camber", "rf_caster", "rf_toe", "rf_shock_travel", "rf_droop"]
          },
          {
            title: "Left Rear",
            fields: ["lr_spring", "lr_shock", "lr_ride_height", "lr_shock_travel", "lr_droop", "lr_link_heights"]
          },
          {
            title: "Right Rear",
            fields: ["rr_spring", "rr_shock", "rr_ride_height", "rr_shock_travel", "rr_droop", "rr_link_heights"]
          },
          {
            title: "Tires",
            fields: ["lf_tire", "rf_tire", "lr_tire", "rr_tire", "cross", "stagger", "grooving", "siping"]
          },
          {
            title: "Engine",
            fields: ["engine_builder", "displacement", "compression", "carburetor", "timing", "fuel_pressure", "oil_pressure"]
          },
          {
            title: "Drivetrain",
            fields: ["transmission", "rear_end", "gear_ratio", "differential"]
          },
          {
            title: "Aero",
            fields: ["nose_height", "spoiler_angle", "body_height", "side_boards"]
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

export default LateModel;
