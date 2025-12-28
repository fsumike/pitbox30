import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Settings, Gauge } from 'lucide-react';
import SetupSheet from '../components/SetupSheet';
import LoadSetupsButton from '../components/LoadSetupsButton';
import DynoImageCapture from '../components/DynoImageCapture';
import CarNumberBox from '../components/CarNumberBox';
import { Setup } from '../lib/supabase';

function IMCASportMods() {
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


  // Define the setup data structure with IMCA SportMod specific sections
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
      chassis_type: { feature: '', comment: 'Chassis configuration' }
    },
    weight: {
      total_weight: { feature: '', comment: 'Minimum weight 2350 lbs with driver' },
      left_side_weight: { feature: '', comment: 'Maximum 58% left side weight' },
      rear_weight: { feature: '', comment: 'Percentage of total weight' },
      cross_weight: { feature: '', comment: 'Percentage of cross weight' }
    },
    front_end: {
      front_clip: { feature: '', comment: 'Tubular or OEM style' },
      steering_box: { feature: '', comment: 'Type and ratio' },
      spindle_type: { feature: '', comment: 'Spindle specifications' },
      bumpsteer: { feature: '', comment: 'Bumpsteer settings' },
      ackermann: { feature: '', comment: 'Ackermann adjustment' }
    },
    suspension: {
      front_suspension: { feature: '', comment: 'Type (three-link, swing arm, etc.)' },
      rear_suspension: { feature: '', comment: 'Type (three-link, leaf spring, etc.)' },
      j_bar: { feature: '', comment: 'J-bar or panhard settings' },
      lift_bar: { feature: '', comment: 'Lift bar settings and angle' },
      pull_bar: { feature: '', comment: 'Pull bar settings if equipped' }
    },
    left_front: {
      lf_spring: { feature: '', comment: 'Spring rate (lbs)' },
      lf_shock: { feature: '', comment: 'Shock type and valving' },
      lf_ride_height: { feature: '', comment: 'Ride height measurement' },
      lf_camber: { feature: '', comment: 'Camber setting' },
      lf_caster: { feature: '', comment: 'Caster setting' },
      lf_toe: { feature: '', comment: 'Toe setting' }
    },
    right_front: {
      rf_spring: { feature: '', comment: 'Spring rate (lbs)' },
      rf_shock: { feature: '', comment: 'Shock type and valving' },
      rf_ride_height: { feature: '', comment: 'Ride height measurement' },
      rf_camber: { feature: '', comment: 'Camber setting' },
      rf_caster: { feature: '', comment: 'Caster setting' },
      rf_toe: { feature: '', comment: 'Toe setting' }
    },
    left_rear: {
      lr_spring: { feature: '', comment: 'Spring rate (lbs)' },
      lr_shock: { feature: '', comment: 'Shock type and valving' },
      lr_ride_height: { feature: '', comment: 'Ride height measurement' },
      lr_tube: { feature: '', comment: 'Lower control arm tube length' },
      lr_link_height: { feature: '', comment: 'Link mounting height' }
    },
    right_rear: {
      rr_spring: { feature: '', comment: 'Spring rate (lbs)' },
      rr_shock: { feature: '', comment: 'Shock type and valving' },
      rr_ride_height: { feature: '', comment: 'Ride height measurement' },
      rr_tube: { feature: '', comment: 'Lower control arm tube length' },
      rr_link_height: { feature: '', comment: 'Link mounting height' }
    },
    tires: {
      lf_tire: { feature: '', comment: 'Left front tire compound and size' },
      rf_tire: { feature: '', comment: 'Right front tire compound and size' },
      lr_tire: { feature: '', comment: 'Left rear tire compound and size' },
      rr_tire: { feature: '', comment: 'Right rear tire compound and size' },
      stagger: { feature: '', comment: 'Rear tire stagger measurement' },
      tire_pressures: { feature: '', comment: 'Starting tire pressures' },
      tire_temps: { feature: '', comment: 'Tire temperature readings' }
    },
    engine: {
      engine_type: { feature: '', comment: 'Engine specifications (typically 602 crate)' },
      displacement: { feature: '', comment: 'Engine displacement (ci)' },
      carburetor: { feature: '', comment: 'Carburetor type and size' },
      timing: { feature: '', comment: 'Ignition timing' },
      headers: { feature: '', comment: 'Header type and size' },
      oil_type: { feature: '', comment: 'Oil type and weight' }
    },
    drivetrain: {
      transmission: { feature: '', comment: 'Transmission type' },
      gear_ratio: { feature: '', comment: 'Final drive ratio' },
      differential: { feature: '', comment: 'Differential type and settings' },
      driveshaft: { feature: '', comment: 'Driveshaft specifications' }
    },
    brake_bias: {
      front_bias: { feature: '', comment: 'Front brake bias percentage' },
      rear_bias: { feature: '', comment: 'Rear brake bias percentage' },
      bias_adjustment: { feature: '', comment: 'Brake bias adjuster setting' }
    },
    notes: {
      track_notes: { feature: '', comment: 'Track condition notes' },
      setup_notes: { feature: '', comment: 'General setup notes' },
      performance_notes: { feature: '', comment: 'Performance and handling notes' },
      maintenance_notes: { feature: '', comment: 'Maintenance items to address' }
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
      <div className="relative rounded-2xl overflow-hidden">
        <img
          src="/imca_southern_sportmod.jpg"
          alt="IMCA SportMod race car"
          className="w-full h-64 md:h-80 object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">IMCA SportMods</h1>
          <p className="text-gray-200 text-sm md:text-base max-w-2xl">
            Entry-level modified class designed to be affordable and accessible while still providing competitive racing.
          </p>
        </div>
      </div>

      <div className="glass-panel p-6 bg-gradient-to-br from-green-500/10 to-teal-500/10 dark:from-green-500/20 dark:to-teal-500/20">
        <div className="mb-6">
          <p className="text-gray-700 dark:text-gray-300">
            IMCA SportMods (also known as Northern SportMods) are an entry-level modified class designed to be more affordable and accessible than full Modifieds.
            These cars typically feature sealed crate engines, specific suspension requirements, and tire regulations to control costs while still providing competitive racing.
            Use our comprehensive setup tools to optimize your SportMod's performance while staying within class regulations.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 items-stretch">
          <LoadSetupsButton carType="imca-sportmod" onLoadSetup={handleLoadSetup} />
          
          
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
        title="IMCA SportMod"
        carType="imca-sportmod"
        description="Track and optimize your IMCA SportMod setup with our detailed setup sheet. Monitor chassis adjustments, suspension settings, and tire data while ensuring compliance with class rules and regulations."
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
            fields: ["total_weight", "left_side_weight", "rear_weight", "cross_weight"]
          },
          {
            title: "Front End",
            fields: ["front_clip", "steering_box", "spindle_type", "bumpsteer", "ackermann"]
          },
          {
            title: "Suspension",
            fields: ["front_suspension", "rear_suspension", "j_bar", "lift_bar", "pull_bar"]
          },
          {
            title: "Left Front",
            fields: ["lf_spring", "lf_shock", "lf_ride_height", "lf_camber", "lf_caster", "lf_toe"]
          },
          {
            title: "Right Front",
            fields: ["rf_spring", "rf_shock", "rf_ride_height", "rf_camber", "rf_caster", "rf_toe"]
          },
          {
            title: "Left Rear",
            fields: ["lr_spring", "lr_shock", "lr_ride_height", "lr_tube", "lr_link_height"]
          },
          {
            title: "Right Rear",
            fields: ["rr_spring", "rr_shock", "rr_ride_height", "rr_tube", "rr_link_height"]
          },
          {
            title: "Tires",
            fields: ["lf_tire", "rf_tire", "lr_tire", "rr_tire", "stagger", "tire_pressures", "tire_temps"]
          },
          {
            title: "Engine",
            fields: ["engine_type", "displacement", "carburetor", "timing", "headers", "oil_type"]
          },
          {
            title: "Drivetrain",
            fields: ["transmission", "gear_ratio", "differential", "driveshaft"]
          },
          {
            title: "Brake Bias",
            fields: ["front_bias", "rear_bias", "bias_adjustment"]
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

export default IMCASportMods;
