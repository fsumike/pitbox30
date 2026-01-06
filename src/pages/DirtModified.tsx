import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Settings, Gauge } from 'lucide-react';
import SetupSheet from '../components/SetupSheet';
import LoadSetupsButton from '../components/LoadSetupsButton';
import DynoImageCapture from '../components/DynoImageCapture';
import CarNumberBox from '../components/CarNumberBox';
import { Setup } from '../lib/supabase';

function DirtModified() {
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
      class: { feature: 'Big Block', comment: 'DIRTcar Big Block Modified - Northeast' },
      date: { feature: new Date().toISOString().split('T')[0], comment: '' }
    },
    weight_balance: {
      total_weight: { feature: '', comment: '2500 lbs minimum with driver' },
      lf_weight: { feature: '', comment: 'Left front corner weight' },
      rf_weight: { feature: '', comment: 'Right front corner weight' },
      lr_weight: { feature: '', comment: 'Left rear corner weight' },
      rr_weight: { feature: '', comment: 'Right rear corner weight' },
      cross_weight_percent: { feature: '', comment: 'Target cross weight %' },
      left_side_percent: { feature: '', comment: 'Maximum 60% left side' },
      rear_percent: { feature: '', comment: 'Rear weight percentage' }
    },
    front_suspension: {
      lf_spring_rate: { feature: '', comment: '400-600 lbs/in typical Big Block' },
      rf_spring_rate: { feature: '', comment: '400-600 lbs/in typical Big Block' },
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
      rear_suspension_type: { feature: '4-Link', comment: 'Big Blocks run 4-link suspension' },
      pull_bar_spring_rate: { feature: '', comment: '1200-2000 lbs/in typical for high HP' },
      pull_bar_preload: { feature: '', comment: 'Pull bar spring preload' },
      pull_bar_angle: { feature: '', comment: 'Pull bar angle - critical for "on the bars" setup' },
      lr_shock_compression: { feature: '', comment: 'Compression setting' },
      lr_shock_rebound: { feature: '', comment: 'Rebound setting' },
      rr_shock_compression: { feature: '', comment: 'Compression setting' },
      rr_shock_rebound: { feature: '', comment: 'Rebound setting' },
      ride_height_lr: { feature: '', comment: 'Left rear ride height' },
      ride_height_rr: { feature: '', comment: 'Right rear ride height' },
      rear_steer: { feature: '', comment: 'Rear steer measurement' },
      pinion_angle: { feature: '', comment: 'Pinion angle' }
    },
    fourlink_settings: {
      upper_lr_link_length: { feature: '', comment: 'Controls roll center & forward bite' },
      upper_rr_link_length: { feature: '', comment: 'Controls roll center & forward bite' },
      lower_lr_link_length: { feature: '', comment: 'Controls rear steer geometry' },
      lower_rr_link_length: { feature: '', comment: 'Controls rear steer geometry' },
      upper_lr_link_angle: { feature: '', comment: 'Critical for getting car "on the bars"' },
      upper_rr_link_angle: { feature: '', comment: 'Critical for getting car "on the bars"' },
      lower_lr_link_angle: { feature: '', comment: 'Affects rear steer on/off throttle' },
      lower_rr_link_angle: { feature: '', comment: 'Affects rear steer on/off throttle' },
      bird_cage_position_lr: { feature: '', comment: 'LR bird cage position' },
      bird_cage_position_rr: { feature: '', comment: 'RR bird cage position' },
      roll_center_height: { feature: '', comment: 'Calculated roll center height' }
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
      engine_size: { feature: '', comment: '480 ci maximum' },
      engine_builder: { feature: '', comment: 'Engine builder' },
      gear_ratio: { feature: '', comment: 'Gear ratio' },
      final_drive: { feature: '', comment: 'Final drive ratio' },
      transmission_type: { feature: '', comment: 'Transmission type' }
    },
    aerodynamics: {
      spoiler_angle: { feature: '', comment: 'Rear spoiler angle' },
      nose_height: { feature: '', comment: 'Nose height affects downforce' },
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
      <div className="glass-panel p-6 bg-gradient-to-br from-amber-500/10 to-yellow-500/10 dark:from-amber-500/20 dark:to-yellow-500/20">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-4 text-amber-600 dark:text-amber-400">DIRTcar Big Block Modified (Northeast)</h1>
          <p className="text-gray-700 dark:text-gray-300">
            Big Block Modifieds are the premier dirt modified class, featuring 480 ci open engines producing ~900 HP. These cars use
            sophisticated 4-link rear suspension with pull bar springs, designed to get the car "on the bars" and jack the left rear
            for maximum downforce through the body tunnel. Popular in the Northeast (Super DIRTcar Series), these cars require precise
            4-link geometry and aggressive setup adjustments.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 items-stretch">
          <LoadSetupsButton carType="dirt-modified-bigblock" onLoadSetup={handleLoadSetup} />
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
        title="DIRTcar Big Block Modified"
        carType="dirt-modified-bigblock"
        description="Northeast DIRTcar Big Block Modified setup with 4-link suspension and high horsepower optimization."
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
            title: "Front Suspension",
            fields: ["lf_spring_rate", "rf_spring_rate", "lf_shock_compression", "lf_shock_rebound", "rf_shock_compression", "rf_shock_rebound", "camber_lf", "camber_rf", "caster_lf", "caster_rf", "ride_height_lf", "ride_height_rf"]
          },
          {
            title: "Rear Suspension (4-Link)",
            fields: ["rear_suspension_type", "pull_bar_spring_rate", "pull_bar_preload", "pull_bar_angle", "lr_shock_compression", "lr_shock_rebound", "rr_shock_compression", "rr_shock_rebound", "ride_height_lr", "ride_height_rr", "rear_steer", "pinion_angle"]
          },
          {
            title: "4-Link Geometry",
            fields: ["upper_lr_link_length", "upper_rr_link_length", "lower_lr_link_length", "lower_rr_link_length", "upper_lr_link_angle", "upper_rr_link_angle", "lower_lr_link_angle", "lower_rr_link_angle", "bird_cage_position_lr", "bird_cage_position_rr", "roll_center_height"]
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
            fields: ["engine_size", "engine_builder", "gear_ratio", "final_drive", "transmission_type"]
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

export default DirtModified;
