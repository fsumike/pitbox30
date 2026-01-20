import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Settings, Gauge } from 'lucide-react';
import SetupSheet from '../components/SetupSheet';
import LoadSetupsButton from '../components/LoadSetupsButton';
import DynoImageCapture from '../components/DynoImageCapture';
import CarNumberBox from '../components/CarNumberBox';
import { Setup } from '../lib/supabase';

function IMCAModifieds() {
  const location = useLocation();

  const [currentSetup, setCurrentSetup] = useState<Setup | null>(null);
  const [carNumber, setCarNumber] = useState('');
  const [trackName, setTrackName] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  const handleLoadSetup = (setup: Setup) => {
    setCurrentSetup(setup);

    const carNum = setup?.car_number || setup?.setup_data?.general?.car_number?.feature || '';
    setCarNumber(carNum);

    const trackNm = setup?.track_name || setup?.setup_data?.general?.track_name?.feature || '';
    setTrackName(trackNm);

    const setupDate = setup?.setup_data?.general?.date?.feature ||
                     (setup?.created_at ? new Date(setup.created_at).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]);
    setDate(setupDate);
  };

  useEffect(() => {
    if (location.state?.loadedSetup) {
      handleLoadSetup(location.state.loadedSetup);
    }
  }, [location.state]);

  const initialSetupData = {
    general: {
      driver: { feature: '', comment: '' },
      car_number: { feature: '', comment: '' },
      track_name: { feature: '', comment: '' },
      track_condition: { feature: '', comment: 'Dry Slick, Tacky, Heavy, Wet' },
      class: { feature: 'IMCA Modified', comment: 'IMCA Modified - Midwest/National' },
      date: { feature: new Date().toISOString().split('T')[0], comment: '' }
    },
    weight_balance: {
      total_weight: { feature: '', comment: '2500 lbs minimum with driver' },
      lf_weight: { feature: '', comment: 'Left front corner weight' },
      rf_weight: { feature: '', comment: 'Right front corner weight' },
      lr_weight: { feature: '', comment: 'Left rear corner weight' },
      rr_weight: { feature: '', comment: 'Right rear corner weight' },
      cross_weight_percent: { feature: '', comment: 'Target cross weight %' },
      left_side_percent: { feature: '', comment: 'Maximum 58% left side' },
      rear_percent: { feature: '', comment: 'Rear weight percentage' }
    },
    chassis: {
      chassis_manufacturer: { feature: '', comment: 'Chassis brand (Hughes, Shaw, etc.)' },
      chassis_year: { feature: '', comment: 'Year of chassis' },
      wheelbase: { feature: '', comment: 'Wheelbase measurement' },
      frame_type: { feature: '', comment: 'Stock frame section or custom' }
    },
    front_suspension: {
      front_suspension_type: { feature: '', comment: 'Three-link, swing arm, or stock' },
      lf_spring_rate: { feature: '', comment: '200-400 lbs/in typical IMCA' },
      rf_spring_rate: { feature: '', comment: '200-400 lbs/in typical IMCA' },
      lf_shock_compression: { feature: '', comment: 'Compression setting' },
      lf_shock_rebound: { feature: '', comment: 'Rebound setting' },
      rf_shock_compression: { feature: '', comment: 'Compression setting' },
      rf_shock_rebound: { feature: '', comment: 'Rebound setting' },
      camber_lf: { feature: '', comment: 'Left front camber' },
      camber_rf: { feature: '', comment: 'Right front camber' },
      caster_lf: { feature: '', comment: 'Left front caster' },
      caster_rf: { feature: '', comment: 'Right front caster' },
      ride_height_lf: { feature: '', comment: 'Left front ride height' },
      ride_height_rf: { feature: '', comment: 'Right front ride height' }
    },
    rear_suspension: {
      rear_suspension_type: { feature: 'Pull Bar / 2-Link', comment: 'IMCA typically uses simpler pull bar or 2-link' },
      pull_bar_spring_type: { feature: '', comment: 'Progressive or linear spring' },
      pull_bar_spring_rate: { feature: '', comment: '600-1200 lbs typical progressive' },
      pull_bar_preload: { feature: '', comment: 'Pull bar spring preload' },
      pull_bar_angle: { feature: '', comment: 'Pull bar angle - less aggressive than 4-link cars' },
      pull_bar_length: { feature: '', comment: 'Pull bar length adjustment' },
      lr_shock_compression: { feature: '', comment: 'Compression setting' },
      lr_shock_rebound: { feature: '', comment: 'Rebound setting' },
      rr_shock_compression: { feature: '', comment: 'Compression setting' },
      rr_shock_rebound: { feature: '', comment: 'Rebound setting' },
      ride_height_lr: { feature: '', comment: 'Left rear ride height' },
      ride_height_rr: { feature: '', comment: 'Right rear ride height' },
      pinion_angle: { feature: '', comment: 'Pinion angle' }
    },
    rear_geometry: {
      j_bar_position: { feature: '', comment: 'J-bar or panhard bar position' },
      j_bar_angle: { feature: '', comment: 'J-bar angle' },
      rear_trailing_arms: { feature: '', comment: 'Trailing arm lengths if applicable' },
      rear_torque_link: { feature: '', comment: 'Torque link or lift bar settings' },
      axle_offset: { feature: '', comment: 'Rear axle offset measurement' }
    },
    steering_alignment: {
      toe_total_front: { feature: '', comment: '1/16" to 1/8" out typical' },
      ackermann_percent: { feature: '', comment: 'Ackermann steering geometry' },
      bump_steer_lf: { feature: '', comment: 'Minimize bump steer' },
      bump_steer_rf: { feature: '', comment: 'Minimize bump steer' },
      steering_quickener: { feature: '', comment: 'Steering quickener ratio if used' }
    },
    tires: {
      lf_compound: { feature: '', comment: 'Hoosier IMCA tire compound' },
      lf_size: { feature: '', comment: 'Tire size' },
      lf_cold_pressure: { feature: '', comment: 'Cold pressure' },
      lf_hot_pressure: { feature: '', comment: 'Hot pressure' },
      rf_compound: { feature: '', comment: 'Hoosier IMCA tire compound' },
      rf_size: { feature: '', comment: 'Tire size' },
      rf_cold_pressure: { feature: '', comment: 'Cold pressure' },
      rf_hot_pressure: { feature: '', comment: 'Hot pressure' },
      front_stagger: { feature: '', comment: 'Front tire stagger' },
      lr_compound: { feature: '', comment: 'Hoosier IMCA tire compound' },
      lr_size: { feature: '', comment: 'Tire size' },
      lr_cold_pressure: { feature: '', comment: 'Cold pressure' },
      lr_hot_pressure: { feature: '', comment: 'Hot pressure' },
      rr_compound: { feature: '', comment: 'Hoosier IMCA tire compound' },
      rr_size: { feature: '', comment: 'Tire size' },
      rr_cold_pressure: { feature: '', comment: 'Cold pressure' },
      rr_hot_pressure: { feature: '', comment: 'Hot pressure' },
      rear_stagger: { feature: '', comment: 'Rear tire stagger' }
    },
    engine_drivetrain: {
      engine_type: { feature: '', comment: 'IMCA sealed 365 ci engine or open' },
      engine_builder: { feature: '', comment: 'Engine builder' },
      carburetor: { feature: '', comment: 'IMCA legal carburetor' },
      gear_ratio: { feature: '', comment: 'Gear ratio' },
      final_drive: { feature: '', comment: 'Final drive ratio' },
      transmission_type: { feature: '', comment: 'Transmission type' }
    },
    body_aero: {
      body_style: { feature: '', comment: 'Body style and manufacturer' },
      spoiler_height: { feature: '', comment: 'Rear spoiler height' },
      nose_height: { feature: '', comment: 'Nose height' },
      body_rules: { feature: '', comment: 'IMCA body template compliance' }
    },
    session_notes: {
      track_prep: { feature: '', comment: 'Track preparation notes' },
      changes_made: { feature: '', comment: 'Changes during practice/qualifying/feature' },
      driver_notes: { feature: '', comment: 'Handling characteristics and feedback' },
      lap_times: { feature: '', comment: 'Best lap times' },
      tire_wear: { feature: '', comment: 'Tire wear observations' }
    }
  };

  const handleTrackChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTrackName(e.target.value);
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDate(e.target.value);
  };

  return (
    <div className="space-y-6">
      <div className="glass-panel p-6 bg-gradient-to-br from-red-500/10 to-orange-500/10 dark:from-red-500/20 dark:to-orange-500/20">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-4 text-red-600 dark:text-red-400">IMCA Modified (Midwest/National)</h1>
          <p className="text-gray-700 dark:text-gray-300">
            IMCA Modifieds are the most popular dirt modified class in America, featuring sealed 365 ci engines or open motors with
            restrictive rules. These cars typically use simpler pull bar or 2-link rear suspension instead of 4-link, with progressive
            springs (600-1200 lbs) and less aggressive geometry than high-powered modifieds. Bodies are flatter and less
            aero-dependent, using stock frame sections in many cases. Setup focus is on mechanical grip and preventing wheel spin
            with softer suspension settings.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 items-stretch">
          <LoadSetupsButton carType="imca-modified" onLoadSetup={handleLoadSetup} />
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
        title="IMCA Modified"
        carType="imca-modified"
        description="Midwest/National IMCA Modified setup with pull bar or 2-link suspension optimized for sealed engines."
        initialSetup={currentSetup}
        initialSetupData={initialSetupData}
        carNumber={carNumber}
        trackName={trackName}
        date={date}
        sections={[
          {
            title: "General Information",
            fields: ["driver", "car_number", "track_name", "track_condition", "class", "date"]
          },
          {
            title: "Weight & Balance",
            fields: ["total_weight", "lf_weight", "rf_weight", "lr_weight", "rr_weight", "cross_weight_percent", "left_side_percent", "rear_percent"]
          },
          {
            title: "Chassis",
            fields: ["chassis_manufacturer", "chassis_year", "wheelbase", "frame_type"]
          },
          {
            title: "Front Suspension",
            fields: ["front_suspension_type", "lf_spring_rate", "rf_spring_rate", "lf_shock_compression", "lf_shock_rebound", "rf_shock_compression", "rf_shock_rebound", "camber_lf", "camber_rf", "caster_lf", "caster_rf", "ride_height_lf", "ride_height_rf"]
          },
          {
            title: "Rear Suspension (Pull Bar / 2-Link)",
            fields: ["rear_suspension_type", "pull_bar_spring_type", "pull_bar_spring_rate", "pull_bar_preload", "pull_bar_angle", "pull_bar_length", "lr_shock_compression", "lr_shock_rebound", "rr_shock_compression", "rr_shock_rebound", "ride_height_lr", "ride_height_rr", "pinion_angle"]
          },
          {
            title: "Rear Geometry",
            fields: ["j_bar_position", "j_bar_angle", "rear_trailing_arms", "rear_torque_link", "axle_offset"]
          },
          {
            title: "Steering & Alignment",
            fields: ["toe_total_front", "ackermann_percent", "bump_steer_lf", "bump_steer_rf", "steering_quickener"]
          },
          {
            title: "Tires - Front",
            fields: ["lf_compound", "lf_size", "lf_cold_pressure", "lf_hot_pressure", "rf_compound", "rf_size", "rf_cold_pressure", "rf_hot_pressure", "front_stagger"]
          },
          {
            title: "Tires - Rear",
            fields: ["lr_compound", "lr_size", "lr_cold_pressure", "lr_hot_pressure", "rr_compound", "rr_size", "rr_cold_pressure", "rr_hot_pressure", "rear_stagger"]
          },
          {
            title: "Engine & Drivetrain",
            fields: ["engine_type", "engine_builder", "carburetor", "gear_ratio", "final_drive", "transmission_type"]
          },
          {
            title: "Body & Aero",
            fields: ["body_style", "spoiler_height", "nose_height", "body_rules"]
          },
          {
            title: "Session Notes",
            fields: ["track_prep", "changes_made", "driver_notes", "lap_times", "tire_wear"]
          }
        ]}
      />
    </div>
  );
}

export default IMCAModifieds;
