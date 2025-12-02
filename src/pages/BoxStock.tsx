import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Settings, Gauge } from 'lucide-react';
import SetupSheet from '../components/SetupSheet';
import LoadSetupsButton from '../components/LoadSetupsButton';
import DynoImageCapture from '../components/DynoImageCapture';
import CarNumberBox from '../components/CarNumberBox';
import { Setup } from '../lib/supabase';

function BoxStock() {
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


  // Define the setup data structure with Box Stock Kart specific sections
  const initialSetupData = {
    general: {
      car_number: { feature: '', comment: '' },
      track_track: { feature: '', comment: '' },
      track_conditions: { feature: '', comment: '' },
      date: { feature: new Date().toISOString().split('T')[0], comment: '' }
    },
    chassis: {
      chassis_manufacturer: { feature: '', comment: 'Kart chassis make and model' },
      chassis_year: { feature: '', comment: 'Year of chassis' },
      chassis_type: { feature: '', comment: 'Chassis configuration' },
      wheelbase: { feature: '', comment: 'Wheelbase measurement' },
      seat_position: { feature: '', comment: 'Seat position (forward/back)' }
    },
    weight: {
      total_weight: { feature: '', comment: 'Total weight with driver (lbs)' },
      left_side_weight: { feature: '', comment: 'Left side percentage (%)' },
      rear_weight: { feature: '', comment: 'Rear weight percentage (%)' },
      corner_weights: { feature: '', comment: 'Individual corner weights' },
      lead_placement: { feature: '', comment: 'Location of added weight' }
    },
    front_end: {
      caster: { feature: '', comment: 'Caster angle' },
      camber: { feature: '', comment: 'Camber setting' },
      toe: { feature: '', comment: 'Toe setting (in/out)' },
      kingpin_inclination: { feature: '', comment: 'Kingpin inclination angle' },
      spindle_height: { feature: '', comment: 'Spindle height' },
      front_track_width: { feature: '', comment: 'Front track width' },
      front_hub_spacing: { feature: '', comment: 'Front hub spacing' }
    },
    rear_end: {
      rear_track_width: { feature: '', comment: 'Rear track width' },
      rear_hub_spacing: { feature: '', comment: 'Rear hub spacing' },
      axle_type: { feature: '', comment: 'Axle type and stiffness' },
      axle_cassette: { feature: '', comment: 'Cassette type if applicable' },
      rear_ride_height: { feature: '', comment: 'Rear ride height' }
    },
    left_front: {
      lf_tire_compound: { feature: '', comment: 'Left front compound' },
      lf_tire_pressure: { feature: '', comment: 'Left front pressure (psi)' },
      lf_wheel_type: { feature: '', comment: 'Left front wheel type' },
      lf_camber: { feature: '', comment: 'Left front camber' },
      lf_caster: { feature: '', comment: 'Left front caster' }
    },
    right_front: {
      rf_tire_compound: { feature: '', comment: 'Right front compound' },
      rf_tire_pressure: { feature: '', comment: 'Right front pressure (psi)' },
      rf_wheel_type: { feature: '', comment: 'Right front wheel type' },
      rf_camber: { feature: '', comment: 'Right front camber' },
      rf_caster: { feature: '', comment: 'Right front caster' }
    },
    left_rear: {
      lr_tire_compound: { feature: '', comment: 'Left rear compound' },
      lr_tire_pressure: { feature: '', comment: 'Left rear pressure (psi)' },
      lr_wheel_type: { feature: '', comment: 'Left rear wheel type' }
    },
    right_rear: {
      rr_tire_compound: { feature: '', comment: 'Right rear compound' },
      rr_tire_pressure: { feature: '', comment: 'Right rear pressure (psi)' },
      rr_wheel_type: { feature: '', comment: 'Right rear wheel type' }
    },
    engine: {
      engine_builder: { feature: '', comment: 'Engine builder name' },
      engine_type: { feature: '', comment: 'Engine type (Box Stock)' },
      carburetor: { feature: '', comment: 'Carburetor specifications' },
      jetting: { feature: '', comment: 'Main/pilot jet sizes' },
      timing: { feature: '', comment: 'Ignition timing' },
      spark_plug: { feature: '', comment: 'Spark plug type' },
      fuel_type: { feature: '', comment: 'Fuel type and mix ratio' },
      exhaust: { feature: '', comment: 'Exhaust type' },
      air_filter: { feature: '', comment: 'Air filter type' }
    },
    drivetrain: {
      clutch_type: { feature: '', comment: 'Clutch type and engagement' },
      clutch_springs: { feature: '', comment: 'Clutch spring configuration' },
      gear_ratio: { feature: '', comment: 'Final drive ratio' },
      chain_size: { feature: '', comment: 'Chain size and type' },
      sprocket_front: { feature: '', comment: 'Front sprocket size' },
      sprocket_rear: { feature: '', comment: 'Rear sprocket size' }
    },
    chassis_adjustments: {
      front_torsion_bar: { feature: '', comment: 'Front torsion bar setting' },
      rear_torsion_bar: { feature: '', comment: 'Rear torsion bar setting' },
      third_bearing_support: { feature: '', comment: 'Third bearing support setting' },
      seat_struts: { feature: '', comment: 'Seat strut configuration' },
      side_rails: { feature: '', comment: 'Side rail adjustments' }
    },
    safety: {
      seat_position: { feature: '', comment: 'Seat position and fit' },
      belts_condition: { feature: '', comment: 'Condition of safety belts' },
      arm_restraints: { feature: '', comment: 'Arm restraint setup' },
      helmet_fit: { feature: '', comment: 'Helmet fit and condition' },
      neck_brace: { feature: '', comment: 'Neck brace type and fit' },
      chest_protector: { feature: '', comment: 'Chest protector type' }
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
      <div className="glass-panel p-6 bg-gradient-to-br from-green-500/10 to-blue-500/10 dark:from-green-500/20 dark:to-blue-500/20">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-4 text-green-600 dark:text-green-400">Box Stock Class Kart</h1>
          <p className="text-gray-700 dark:text-gray-300">
            Box Stock Class Karts are designed for youth racers, featuring sealed engines that must remain in their factory configuration. 
            These karts provide an affordable entry point into motorsports, teaching young drivers the fundamentals of racing while maintaining 
            strict safety and performance standards. Use our comprehensive setup tools to fine-tune your Box Stock Kart for optimal performance 
            within class regulations.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 items-stretch">
          <LoadSetupsButton carType="boxstock" onLoadSetup={handleLoadSetup} />
          
          
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
        title="Box Stock Class Kart"
        carType="boxstock"
        description="Track and optimize your Box Stock Kart setup with our comprehensive setup sheet. Monitor chassis adjustments, engine settings, and tire data to maximize performance while ensuring compliance with class regulations."
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
            fields: ["chassis_manufacturer", "chassis_year", "chassis_type", "wheelbase", "seat_position"]
          },
          {
            title: "Weight",
            fields: ["total_weight", "left_side_weight", "rear_weight", "corner_weights", "lead_placement"]
          },
          {
            title: "Front End",
            fields: ["caster", "camber", "toe", "kingpin_inclination", "spindle_height", "front_track_width", "front_hub_spacing"]
          },
          {
            title: "Rear End",
            fields: ["rear_track_width", "rear_hub_spacing", "axle_type", "axle_cassette", "rear_ride_height"]
          },
          {
            title: "Left Front",
            fields: ["lf_tire_compound", "lf_tire_pressure", "lf_wheel_type", "lf_camber", "lf_caster"]
          },
          {
            title: "Right Front",
            fields: ["rf_tire_compound", "rf_tire_pressure", "rf_wheel_type", "rf_camber", "rf_caster"]
          },
          {
            title: "Left Rear",
            fields: ["lr_tire_compound", "lr_tire_pressure", "lr_wheel_type"]
          },
          {
            title: "Right Rear",
            fields: ["rr_tire_compound", "rr_tire_pressure", "rr_wheel_type"]
          },
          {
            title: "Engine",
            fields: ["engine_builder", "engine_type", "carburetor", "jetting", "timing", "spark_plug", "fuel_type", "exhaust", "air_filter"]
          },
          {
            title: "Drivetrain",
            fields: ["clutch_type", "clutch_springs", "gear_ratio", "chain_size", "sprocket_front", "sprocket_rear"]
          },
          {
            title: "Chassis Adjustments",
            fields: ["front_torsion_bar", "rear_torsion_bar", "third_bearing_support", "seat_struts", "side_rails"]
          },
          {
            title: "Safety",
            fields: ["seat_position", "belts_condition", "arm_restraints", "helmet_fit", "neck_brace", "chest_protector"]
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

export default BoxStock;
