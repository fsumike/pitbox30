import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Settings, Gauge } from 'lucide-react';
import SetupSheet from '../components/SetupSheet';
import LoadSetupsButton from '../components/LoadSetupsButton';
import DynoImageCapture from '../components/DynoImageCapture';
import CarNumberBox from '../components/CarNumberBox';
import { Setup } from '../lib/supabase';

function UMPModified() {
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
      class: { feature: 'UMP / USMTS Open Modified', comment: 'Southern / National Open Modified' },
      date: { feature: new Date().toISOString().split('T')[0], comment: '' }
    },
    weight_balance: {
      total_weight: { feature: '', comment: '2400 lbs minimum with driver' },
      lf_weight: { feature: '', comment: 'Left front corner weight' },
      rf_weight: { feature: '', comment: 'Right front corner weight' },
      lr_weight: { feature: '', comment: 'Left rear corner weight' },
      rr_weight: { feature: '', comment: 'Right rear corner weight' },
      cross_weight_percent: { feature: '', comment: 'Target cross weight %' },
      left_side_percent: { feature: '', comment: 'Maximum 58% left side' },
      rear_percent: { feature: '', comment: 'Rear weight percentage' }
    },
    chassis: {
      chassis_manufacturer: { feature: '', comment: 'Chassis brand (Rocket, MasterSbilt, Longhorn, etc.)' },
      chassis_year: { feature: '', comment: 'Year of chassis' },
      wheelbase: { feature: '', comment: 'Wheelbase measurement' }
    },
    front_suspension: {
      lf_spring_rate: { feature: '', comment: '300-500 lbs/in typical UMP' },
      rf_spring_rate: { feature: '', comment: '300-500 lbs/in typical UMP' },
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
      rear_suspension_type: { feature: '3-Link / 4-Link', comment: 'UMP allows various suspension types' },
      pull_bar_spring_rate: { feature: '', comment: '800-1500 lbs/in typical for open motor' },
      pull_bar_preload: { feature: '', comment: 'Pull bar spring preload' },
      pull_bar_angle: { feature: '', comment: 'Pull bar angle' },
      lr_shock_compression: { feature: '', comment: 'Compression setting' },
      lr_shock_rebound: { feature: '', comment: 'Rebound setting' },
      rr_shock_compression: { feature: '', comment: 'Compression setting' },
      rr_shock_rebound: { feature: '', comment: 'Rebound setting' },
      ride_height_lr: { feature: '', comment: 'Left rear ride height' },
      ride_height_rr: { feature: '', comment: 'Right rear ride height' },
      pinion_angle: { feature: '', comment: 'Pinion angle' }
    },
    fourlink_settings: {
      upper_lr_link_length: { feature: '', comment: 'If using 4-link: upper left link' },
      upper_rr_link_length: { feature: '', comment: 'If using 4-link: upper right link' },
      lower_lr_link_length: { feature: '', comment: 'If using 4-link: lower left link' },
      lower_rr_link_length: { feature: '', comment: 'If using 4-link: lower right link' },
      upper_lr_link_angle: { feature: '', comment: 'Upper left link angle' },
      upper_rr_link_angle: { feature: '', comment: 'Upper right link angle' },
      lower_lr_link_angle: { feature: '', comment: 'Lower left link angle' },
      lower_rr_link_angle: { feature: '', comment: 'Lower right link angle' },
      bird_cage_position_lr: { feature: '', comment: 'LR bird cage position' },
      bird_cage_position_rr: { feature: '', comment: 'RR bird cage position' }
    },
    threelink_settings: {
      lift_bar_angle: { feature: '', comment: 'If using 3-link: lift bar angle' },
      lift_bar_length: { feature: '', comment: 'If using 3-link: lift bar length' },
      j_bar_position: { feature: '', comment: 'J-bar or panhard bar position' },
      j_bar_angle: { feature: '', comment: 'J-bar angle' }
    },
    steering_alignment: {
      toe_total_front: { feature: '', comment: '1/16" to 1/8" out typical' },
      ackermann_percent: { feature: '', comment: 'Ackermann steering geometry' },
      bump_steer_lf: { feature: '', comment: 'Minimize bump steer' },
      bump_steer_rf: { feature: '', comment: 'Minimize bump steer' }
    },
    tires: {
      lf_compound: { feature: '', comment: 'Hoosier tire compound' },
      lf_size: { feature: '', comment: 'Tire size' },
      lf_cold_pressure: { feature: '', comment: 'Cold pressure' },
      lf_hot_pressure: { feature: '', comment: 'Hot pressure' },
      rf_compound: { feature: '', comment: 'Hoosier tire compound' },
      rf_size: { feature: '', comment: 'Tire size' },
      rf_cold_pressure: { feature: '', comment: 'Cold pressure' },
      rf_hot_pressure: { feature: '', comment: 'Hot pressure' },
      front_stagger: { feature: '', comment: 'Front tire stagger' },
      lr_compound: { feature: '', comment: 'Hoosier tire compound' },
      lr_size: { feature: '', comment: 'Tire size' },
      lr_cold_pressure: { feature: '', comment: 'Cold pressure' },
      lr_hot_pressure: { feature: '', comment: 'Hot pressure' },
      rr_compound: { feature: '', comment: 'Hoosier tire compound' },
      rr_size: { feature: '', comment: 'Tire size' },
      rr_cold_pressure: { feature: '', comment: 'Cold pressure' },
      rr_hot_pressure: { feature: '', comment: 'Hot pressure' },
      rear_stagger: { feature: '', comment: 'Rear tire stagger' }
    },
    engine_drivetrain: {
      engine_size: { feature: '', comment: 'Open engine rules - typically 400-440 ci' },
      engine_builder: { feature: '', comment: 'Engine builder' },
      carburetor: { feature: '', comment: 'Carburetor type' },
      gear_ratio: { feature: '', comment: 'Gear ratio' },
      final_drive: { feature: '', comment: 'Final drive ratio' },
      transmission_type: { feature: '', comment: 'Transmission type' }
    },
    aerodynamics: {
      spoiler_angle: { feature: '', comment: 'Rear spoiler angle' },
      nose_height: { feature: '', comment: 'Nose height' },
      body_rake: { feature: '', comment: 'Body rake angle' },
      side_panel_angle: { feature: '', comment: 'Side panel configuration' }
    },
    session_notes: {
      track_prep: { feature: '', comment: 'Track preparation notes' },
      changes_made: { feature: '', comment: 'Changes during practice/qualifying/feature' },
      driver_notes: { feature: '', comment: 'Handling characteristics and feedback' },
      lap_times: { feature: '', comment: 'Best lap times' }
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
      <div className="glass-panel p-6 bg-gradient-to-br from-orange-500/10 to-red-500/10 dark:from-orange-500/20 dark:to-red-500/20">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-4 text-orange-600 dark:text-orange-400">UMP / USMTS Modified (Southern/National Open)</h1>
          <p className="text-gray-700 dark:text-gray-300">
            UMP (United Midwestern Promoters) and USMTS (United States Modified Touring Series) Modifieds are open-engine dirt modifieds
            popular in the Midwest and South. These cars feature open engine rules (typically 400-440 ci), 2400 lbs minimum weight,
            and flexible suspension options including 3-link, 4-link, or leaf spring setups. Unlike Northeast modifieds, UMP/USMTS cars
            focus more on horsepower and mechanical grip with less emphasis on aerodynamics. Suspension setups vary widely by builder
            and driver preference, with moderate spring rates (800-1500 lbs pull bar) between IMCA and Big Block levels.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 items-stretch">
          <LoadSetupsButton carType="ump-modified" onLoadSetup={handleLoadSetup} />
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
        title="UMP / USMTS Modified"
        carType="ump-modified"
        description="Southern/National UMP/USMTS Modified setup with flexible suspension options optimized for open engines."
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
            fields: ["chassis_manufacturer", "chassis_year", "wheelbase"]
          },
          {
            title: "Front Suspension",
            fields: ["lf_spring_rate", "rf_spring_rate", "lf_shock_compression", "lf_shock_rebound", "rf_shock_compression", "rf_shock_rebound", "camber_lf", "camber_rf", "caster_lf", "caster_rf", "ride_height_lf", "ride_height_rf"]
          },
          {
            title: "Rear Suspension",
            fields: ["rear_suspension_type", "pull_bar_spring_rate", "pull_bar_preload", "pull_bar_angle", "lr_shock_compression", "lr_shock_rebound", "rr_shock_compression", "rr_shock_rebound", "ride_height_lr", "ride_height_rr", "pinion_angle"]
          },
          {
            title: "4-Link Geometry (if applicable)",
            fields: ["upper_lr_link_length", "upper_rr_link_length", "lower_lr_link_length", "lower_rr_link_length", "upper_lr_link_angle", "upper_rr_link_angle", "lower_lr_link_angle", "lower_rr_link_angle", "bird_cage_position_lr", "bird_cage_position_rr"]
          },
          {
            title: "3-Link Geometry (if applicable)",
            fields: ["lift_bar_angle", "lift_bar_length", "j_bar_position", "j_bar_angle"]
          },
          {
            title: "Steering & Alignment",
            fields: ["toe_total_front", "ackermann_percent", "bump_steer_lf", "bump_steer_rf"]
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
            fields: ["engine_size", "engine_builder", "carburetor", "gear_ratio", "final_drive", "transmission_type"]
          },
          {
            title: "Aerodynamics",
            fields: ["spoiler_angle", "nose_height", "body_rake", "side_panel_angle"]
          },
          {
            title: "Session Notes",
            fields: ["track_prep", "changes_made", "driver_notes", "lap_times"]
          }
        ]}
      />
    </div>
  );
}

export default UMPModified;
