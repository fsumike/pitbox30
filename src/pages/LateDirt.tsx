import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Settings, Gauge } from 'lucide-react';
import SetupSheet from '../components/SetupSheet';
import LoadSetupsButton from '../components/LoadSetupsButton';
import DynoImageCapture from '../components/DynoImageCapture';
import CarNumberBox from '../components/CarNumberBox';
import { Setup } from '../lib/supabase';

function LateDirt() {
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
      class: { feature: '', comment: 'Super, Crate, Limited, Sportsman' },
      date: { feature: new Date().toISOString().split('T')[0], comment: '' }
    },
    weight_balance: {
      total_weight: { feature: '', comment: '2300-2500 lbs (Super), 2200-2400 lbs (Crate/Limited)' },
      lf_weight: { feature: '', comment: '600-700 lbs' },
      rf_weight: { feature: '', comment: '650-750 lbs' },
      lr_weight: { feature: '', comment: '550-650 lbs' },
      rr_weight: { feature: '', comment: '500-600 lbs' },
      cross_weight_percent: { feature: '', comment: '50-54%' },
      left_side_percent: { feature: '', comment: '48-52%' },
      rear_percent: { feature: '', comment: '48-52%' }
    },
    front_suspension: {
      lf_spring_rate: { feature: '', comment: '250-350 lbs/in (Crate), 300-450 lbs/in (Super)' },
      rf_spring_rate: { feature: '', comment: '250-350 lbs/in (Crate), 300-450 lbs/in (Super)' },
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
      rear_suspension_type: { feature: '', comment: '4-Link or Pull Bar' },
      lr_spring_rate: { feature: '', comment: '200-300 lbs/in (Crate), 225-375 lbs/in (Super)' },
      rr_spring_rate: { feature: '', comment: '200-300 lbs/in (Crate), 225-375 lbs/in (Super)' },
      lr_shock_compression: { feature: '', comment: 'Compression setting' },
      lr_shock_rebound: { feature: '', comment: 'Rebound setting' },
      rr_shock_compression: { feature: '', comment: 'Compression setting' },
      rr_shock_rebound: { feature: '', comment: 'Rebound setting' },
      ride_height_lr: { feature: '', comment: 'Left rear ride height' },
      ride_height_rr: { feature: '', comment: 'Right rear ride height' },
      rear_steer: { feature: '', comment: 'Rear steer measurement' },
      pinion_angle: { feature: '', comment: 'Pinion angle' }
    },
    steering_alignment: {
      toe_total_front: { feature: '', comment: '1/16" to 1/4" out' },
      ackermann_percent: { feature: '', comment: '50-100%' },
      bump_steer_lf: { feature: '', comment: 'Minimal' },
      bump_steer_rf: { feature: '', comment: 'Minimal' }
    },
    tires: {
      lf_compound: { feature: '', comment: 'Tire compound' },
      lf_size: { feature: '', comment: 'Tire size' },
      lf_cold_pressure: { feature: '', comment: '18-25 psi typical' },
      lf_hot_pressure: { feature: '', comment: 'Hot pressure' },
      rf_compound: { feature: '', comment: 'Tire compound' },
      rf_size: { feature: '', comment: 'Tire size' },
      rf_cold_pressure: { feature: '', comment: '18-25 psi typical' },
      rf_hot_pressure: { feature: '', comment: 'Hot pressure' },
      front_stagger: { feature: '', comment: '1"-4" typical' },
      lr_compound: { feature: '', comment: 'Tire compound' },
      lr_size: { feature: '', comment: 'Tire size' },
      lr_cold_pressure: { feature: '', comment: '18-25 psi typical' },
      lr_hot_pressure: { feature: '', comment: 'Hot pressure' },
      rr_compound: { feature: '', comment: 'Tire compound' },
      rr_size: { feature: '', comment: 'Tire size' },
      rr_cold_pressure: { feature: '', comment: '18-25 psi typical' },
      rr_hot_pressure: { feature: '', comment: 'Hot pressure' },
      rear_stagger: { feature: '', comment: '1"-4" typical' }
    },
    fourlink_settings: {
      upper_lr_link_length: { feature: '', comment: 'Affects roll center & bite' },
      upper_rr_link_length: { feature: '', comment: 'Affects roll center & bite' },
      lower_lr_link_length: { feature: '', comment: 'Affects axle location' },
      lower_rr_link_length: { feature: '', comment: 'Affects axle location' },
      upper_lr_link_angle_front: { feature: '', comment: 'Typical: 3-8° up' },
      upper_rr_link_angle_front: { feature: '', comment: 'Typical: 3-8° up' },
      lower_lr_link_angle_front: { feature: '', comment: 'Typical: 0-5° up or down' },
      lower_rr_link_angle_front: { feature: '', comment: 'Typical: 0-5° up or down' },
      upper_link_instant_center: { feature: '', comment: 'Side view measurement' },
      lower_link_instant_center: { feature: '', comment: 'Side view measurement' },
      fourlink_roll_center_height: { feature: '', comment: 'Typically 10-18"' },
      bird_cage_position_lr: { feature: '', comment: 'Affects link angles' },
      bird_cage_position_rr: { feature: '', comment: 'Affects link angles' }
    },
    pullbar_settings: {
      pull_bar_angle: { feature: '', comment: 'Typical: 5-12° up' },
      pull_bar_spring_rate: { feature: '', comment: 'Typical: 200-400 lbs/in' },
      pull_bar_spring_preload: { feature: '', comment: 'Affects rear steer' },
      pull_bar_length: { feature: '', comment: 'Measure axle to chassis' }
    },
    drivetrain: {
      gear_ratio: { feature: '', comment: 'Gear ratio' },
      final_drive: { feature: '', comment: 'Final drive' },
      transmission_type: { feature: '', comment: 'Transmission type' }
    },
    session_notes: {
      changes_made: { feature: '', comment: 'Document any changes made during practice, qualifying, or features' },
      driver_notes: { feature: '', comment: 'Track conditions, car handling, lap times, observations' }
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
          <h1 className="text-3xl font-bold mb-4 text-red-600 dark:text-red-400">Dirt Late Model</h1>
          <p className="text-gray-700 dark:text-gray-300">
            Dirt Late Models represent the pinnacle of dirt track racing. These sophisticated race cars require precise setup adjustments
            across multiple systems including weight distribution, suspension geometry, and tire management. Use this comprehensive setup
            sheet to document and optimize every aspect of your car's performance.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 items-stretch">
          <LoadSetupsButton carType="late-dirt" onLoadSetup={handleLoadSetup} />
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
        title="Dirt Late Model"
        carType="late-dirt"
        description="Multi-class dirt late model setup documentation with comprehensive weight, suspension, and tire tracking."
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
            title: "Rear Suspension",
            fields: ["rear_suspension_type", "lr_spring_rate", "rr_spring_rate", "lr_shock_compression", "lr_shock_rebound", "rr_shock_compression", "rr_shock_rebound", "ride_height_lr", "ride_height_rr", "rear_steer", "pinion_angle"]
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
            title: "4-Link Settings (If Applicable)",
            fields: ["upper_lr_link_length", "upper_rr_link_length", "lower_lr_link_length", "lower_rr_link_length", "upper_lr_link_angle_front", "upper_rr_link_angle_front", "lower_lr_link_angle_front", "lower_rr_link_angle_front", "upper_link_instant_center", "lower_link_instant_center", "fourlink_roll_center_height", "bird_cage_position_lr", "bird_cage_position_rr"]
          },
          {
            title: "Pull Bar Settings (If Applicable)",
            fields: ["pull_bar_angle", "pull_bar_spring_rate", "pull_bar_spring_preload", "pull_bar_length"]
          },
          {
            title: "Drivetrain",
            fields: ["gear_ratio", "final_drive", "transmission_type"]
          },
          {
            title: "Session Notes",
            fields: ["changes_made", "driver_notes"]
          }
        ]}
      />
    </div>
  );
}

export default LateDirt;
