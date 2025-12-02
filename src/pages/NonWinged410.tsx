import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Settings, Gauge } from 'lucide-react';
import SetupSheet from '../components/SetupSheet';
import LoadSetupsButton from '../components/LoadSetupsButton';
import DynoImageCapture from '../components/DynoImageCapture';
import CarNumberBox from '../components/CarNumberBox';
import { Setup } from '../lib/supabase';

function NonWinged410() {
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


  // Define the setup data structure with Non-Winged 410 specific sections
  const initialSetupData = {
    general: {
      car_number: { feature: '', comment: '' },
      track_track: { feature: '', comment: '' },
      track_conditions: { feature: '', comment: '' },
      date: { feature: new Date().toISOString().split('T')[0], comment: '' }
    },
    chassis: {
      chassis_manufacturer: { feature: '', comment: 'Chassis make and model' },
      chassis_year: { feature: '', comment: 'Year of chassis' },
      wheelbase_left: { feature: '', comment: 'Left side wheelbase measurement' },
      wheelbase_right: { feature: '', comment: 'Right side wheelbase measurement' },
      steering_box_ratio: { feature: '', comment: 'Steering box ratio' },
      steering_arm_length: { feature: '', comment: 'Steering arm length' }
    },
    weight: {
      total_weight: { feature: '', comment: 'Total weight with driver (lbs)' },
      left_weight_percentage: { feature: '', comment: 'Left side percentage (%)' },
      rear_weight_percentage: { feature: '', comment: 'Rear weight percentage (%)' },
      corner_weights: { feature: '', comment: 'Individual corner weights' }
    },
    engine: {
      engine_builder: { feature: '', comment: 'Engine builder name' },
      engine_type: { feature: '', comment: '410 cubic inch specifications' },
      compression_ratio: { feature: '', comment: 'Compression ratio' },
      fuel_type: { feature: '', comment: 'Fuel type (methanol, etc.)' },
      injection: { feature: '', comment: 'Injection system details' },
      timing: { feature: '', comment: 'Ignition timing' },
      fuel_pressure: { feature: '', comment: 'Fuel pressure setting' },
      nozzle_size: { feature: '', comment: 'Injector nozzle sizes' }
    },
    left_front: {
      lf_spring: { feature: '', comment: 'Spring rate (lbs)' },
      lf_shock_number: { feature: '', comment: 'Shock identification' },
      lf_shock_compression: { feature: '', comment: 'Compression setting' },
      lf_shock_rebound: { feature: '', comment: 'Rebound setting' },
      lf_ride_height: { feature: '', comment: 'Ride height measurement' },
      lf_tire_compound: { feature: '', comment: 'Left front compound' },
      lf_tire_pressure: { feature: '', comment: 'Left front pressure (psi)' },
      lf_tire_circumference: { feature: '', comment: 'Tire circumference' },
      lf_wheel_offset: { feature: '', comment: 'Wheel offset' },
      lf_camber: { feature: '', comment: 'Camber setting' },
      lf_caster: { feature: '', comment: 'Caster setting' }
    },
    right_front: {
      rf_spring: { feature: '', comment: 'Spring rate (lbs)' },
      rf_shock_number: { feature: '', comment: 'Shock identification' },
      rf_shock_compression: { feature: '', comment: 'Compression setting' },
      rf_shock_rebound: { feature: '', comment: 'Rebound setting' },
      rf_ride_height: { feature: '', comment: 'Ride height measurement' },
      rf_tire_compound: { feature: '', comment: 'Right front compound' },
      rf_tire_pressure: { feature: '', comment: 'Right front pressure (psi)' },
      rf_tire_circumference: { feature: '', comment: 'Tire circumference' },
      rf_wheel_offset: { feature: '', comment: 'Wheel offset' },
      rf_camber: { feature: '', comment: 'Camber setting' },
      rf_caster: { feature: '', comment: 'Caster setting' }
    },
    left_rear: {
      lr_spring: { feature: '', comment: 'Spring rate (lbs)' },
      lr_shock_number: { feature: '', comment: 'Shock identification' },
      lr_shock_compression: { feature: '', comment: 'Compression setting' },
      lr_shock_rebound: { feature: '', comment: 'Rebound setting' },
      lr_ride_height: { feature: '', comment: 'Ride height measurement' },
      lr_tire_compound: { feature: '', comment: 'Left rear compound' },
      lr_tire_pressure: { feature: '', comment: 'Left rear pressure (psi)' },
      lr_tire_circumference: { feature: '', comment: 'Tire circumference' },
      lr_wheel_offset: { feature: '', comment: 'Wheel offset' },
      lr_spacing: { feature: '', comment: 'Wheel spacing' }
    },
    right_rear: {
      rr_spring: { feature: '', comment: 'Spring rate (lbs)' },
      rr_shock_number: { feature: '', comment: 'Shock identification' },
      rr_shock_compression: { feature: '', comment: 'Compression setting' },
      rr_shock_rebound: { feature: '', comment: 'Rebound setting' },
      rr_ride_height: { feature: '', comment: 'Ride height measurement' },
      rr_tire_compound: { feature: '', comment: 'Right rear compound' },
      rr_tire_pressure: { feature: '', comment: 'Right rear pressure (psi)' },
      rr_tire_circumference: { feature: '', comment: 'Tire circumference' },
      rr_wheel_offset: { feature: '', comment: 'Wheel offset' },
      rr_spacing: { feature: '', comment: 'Wheel spacing' }
    },
    rear_end: {
      panhard_height: { feature: '', comment: 'Panhard bar height' },
      panhard_angle: { feature: '', comment: 'Panhard bar angle' },
      rear_stagger: { feature: '', comment: 'Rear tire stagger' },
      gear_ratio: { feature: '', comment: 'Final drive ratio' }
    },
    track_data: {
      track_banking: { feature: '', comment: 'Track banking angle' },
      track_surface: { feature: '', comment: 'Track surface type' },
      track_grip: { feature: '', comment: 'Track grip level' },
      track_length: { feature: '', comment: 'Track length' }
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
      <div className="glass-panel p-6 bg-gradient-to-br from-red-500/10 to-blue-500/10 dark:from-red-500/20 dark:to-blue-500/20">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-4 text-red-600 dark:text-red-400">Non-Winged 410 Sprint Cars</h1>
          <p className="text-gray-700 dark:text-gray-300">
            Non-Winged 410 Sprint Cars represent the purest form of high-powered sprint car racing, where driver skill and chassis setup are paramount. 
            Without the aerodynamic advantage of wings, these 410 cubic inch powered machines require precise handling characteristics and mechanical grip to perform at their best.
            Track your setup changes meticulously to master the art of non-winged sprint car racing at the highest level.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 items-stretch">
          <LoadSetupsButton carType="nonwinged410" onLoadSetup={handleLoadSetup} />
          
          
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
        title="Non-Winged 410 Sprint"
        carType="nonwinged410"
        description="Optimize your non-winged 410 sprint car setup with detailed tracking of chassis adjustments, suspension settings, and tire data to find the perfect balance for any track condition."
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
            fields: ["chassis_manufacturer", "chassis_year", "wheelbase_left", "wheelbase_right", "steering_box_ratio", "steering_arm_length"]
          },
          {
            title: "Weight",
            fields: ["total_weight", "left_weight_percentage", "rear_weight_percentage", "corner_weights"]
          },
          {
            title: "Engine",
            fields: ["engine_builder", "engine_type", "compression_ratio", "fuel_type", "injection", "timing", "fuel_pressure", "nozzle_size"]
          },
          {
            title: "Left Front",
            fields: ["lf_spring", "lf_shock_number", "lf_shock_compression", "lf_shock_rebound", "lf_ride_height", "lf_tire_compound", "lf_tire_pressure", "lf_tire_circumference", "lf_wheel_offset", "lf_camber", "lf_caster"]
          },
          {
            title: "Right Front",
            fields: ["rf_spring", "rf_shock_number", "rf_shock_compression", "rf_shock_rebound", "rf_ride_height", "rf_tire_compound", "rf_tire_pressure", "rf_tire_circumference", "rf_wheel_offset", "rf_camber", "rf_caster"]
          },
          {
            title: "Left Rear",
            fields: ["lr_spring", "lr_shock_number", "lr_shock_compression", "lr_shock_rebound", "lr_ride_height", "lr_tire_compound", "lr_tire_pressure", "lr_tire_circumference", "lr_wheel_offset", "lr_spacing"]
          },
          {
            title: "Right Rear",
            fields: ["rr_spring", "rr_shock_number", "rr_shock_compression", "rr_shock_rebound", "rr_ride_height", "rr_tire_compound", "rr_tire_pressure", "rr_tire_circumference", "rr_wheel_offset", "rr_spacing"]
          },
          {
            title: "Rear End",
            fields: ["panhard_height", "panhard_angle", "rear_stagger", "gear_ratio"]
          },
          {
            title: "Track Data",
            fields: ["track_banking", "track_surface", "track_grip", "track_length"]
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

export default NonWinged410;
