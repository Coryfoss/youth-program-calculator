// At the top of YouthProgramCalculator.tsx
/* eslint-disable no-unused-vars */
/* eslint-disable prefer-const */
"use client";

import React, { useState, useEffect } from 'react';
import { HelpCircle } from 'lucide-react';

const YouthProgramCalculator = () => {
  // Previous state configurations remain the same
  const [config, setConfig] = useState({
    numberOfParticipants: 10,
    programDays: 30,
    isPaid: false,
    hasMinors: true,
    isStationary: true,
    needsFoodProgram: true,
    qualifiesForYouthPrize: false,
    dailyTransportNeeded: true,
    hoursPerDay: 6,
  });

  const [rates, setRates] = useState({
    internHourlyRate: 16.50,
    coordinatorHourlyRate: 28.00,
    dailyFoodCost: 20.00,
    dailySupplies: 14.00,
    laptopCost: 600.00,
    trainingMaterials: 200.00,
    vanCost: 56.00,
    busCostPerHour: 100.00,
  });

  const [costs, setCosts] = useState({
    staffing: 0,
    food: 0,
    equipment: 0,
    transport: 0,
    total: 0
  });

  const [recommendations, setRecommendations] = useState([]);
  const [showTooltip, setShowTooltip] = useState(false);

  // Calculate number of coordinators needed
  const calculateCoordinators = (participants) => {
    return Math.ceil(participants / 5);
  };

  // Generate recommendations based on program configuration
  useEffect(() => {
    const newRecommendations = []; // Change let to const

    // Youth Safety Requirements
    if (config.hasMinors) {
      newRecommendations.push({
        type: 'required',
        message: 'Contact Youth Safety Manager immediately for program approval and safety protocols.',
        details: [
          'All staff must complete Safety of Minors training',
          'Background checks required for all staff',
          'One-on-one interactions must be monitored'
        ]
      });
    }

    // YouthPrize Requirements
    if (config.qualifiesForYouthPrize) {
      newRecommendations.push({
        type: 'required',
        message: 'Food Safety Training Required for YouthPrize Partnership',
        details: [
          'Two staff members must complete food management training',
          'Food safety certification required',
          'Regular food safety protocols must be maintained'
        ]
      });
    }

    // Previous recommendations logic remains...
    if (config.isPaid && config.programDays > 60) {
      newRecommendations.push({
        type: 'warning',
        message: 'Program exceeds 60-day temp casual employment limit.',
        details: [
          'HR consultation required for programs exceeding 60 days',
          'Consider splitting program into segments',
          'Alternative employment categories may be needed'
        ]
      });
    }

    setRecommendations(newRecommendations);
  }, [config]);

  // Previous cost calculation effect remains the same
  useEffect(() => {
    const calculateCosts = () => {
      const equipmentCost = config.numberOfParticipants * 
        (rates.laptopCost + rates.trainingMaterials + 
         (rates.dailySupplies * config.programDays));

      const coordinators = calculateCoordinators(config.numberOfParticipants);
      const staffingCost = (coordinators * rates.coordinatorHourlyRate * 
        config.hoursPerDay * config.programDays) +
        (config.isPaid ? (config.numberOfParticipants * rates.internHourlyRate * 
        config.hoursPerDay * config.programDays) : 0);

      const foodCost = config.needsFoodProgram && !config.qualifiesForYouthPrize ?
        (config.numberOfParticipants * rates.dailyFoodCost * config.programDays) : 0;

      let transportCost = 0;
      if (config.dailyTransportNeeded) {
        if (config.numberOfParticipants <= 10) {
          transportCost = rates.vanCost * config.programDays;
        } else {
          transportCost = rates.busCostPerHour * 2 * config.programDays;
        }
      }

      const totalCost = equipmentCost + staffingCost + foodCost + transportCost;

      setCosts({
        staffing: staffingCost,
        food: foodCost,
        equipment: equipmentCost,
        transport: transportCost,
        total: totalCost
      });
    };

    calculateCosts();
  }, [config, rates]);

  // Handle configuration changes
  const handleConfigChange = (field, value) => {
    setConfig(prev => {
      const newConfig = {
        ...prev,
        [field]: typeof value === 'string' ? parseFloat(value) || 0 : value
      };

      // If program is not stationary, disable YouthPrize
      if (field === 'isStationary' && !value) {
        newConfig.qualifiesForYouthPrize = false;
      }

      return newConfig;
    });
  };

  return (
    <div className="max-w-7xl mx-auto p-8 bg-gray-100 min-h-screen">
      <div className="bg-white shadow-lg rounded-lg p-8 border border-gray-200">
        <h1 className="text-2xl font-bold mb-6">UMN Youth Program Budget Calculator</h1>

        {/* Fixed Cost Summary at Top */}
        <div className="sticky top-0 bg-white z-10 border-b border-gray-200 pb-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Cost Summary</h2>
          <div className="space-y-2">
            <p>Required Coordinators: {calculateCoordinators(config.numberOfParticipants)}</p>
            <p>Staffing Costs: ${costs.staffing.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</p>
            <p>Food Costs: ${costs.food.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</p>
            <p>Equipment & Supplies: ${costs.equipment.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</p>
            <p>Transportation Costs: ${costs.transport.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</p>
            <p className="text-xl font-bold">Total Program Cost: ${costs.total.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</p>
          </div>
        </div>

        {/* Recommendations Section */}
        {recommendations.length > 0 && (
          <div className="mb-6 space-y-4">
            <h2 className="text-xl font-semibold border-b border-gray-200 pb-2 mb-4">Program Recommendations</h2>
            {recommendations.map((rec, index) => (
              <div 
                key={index} 
                className={`p-6 rounded-lg shadow-sm ${
                  rec.type === 'required' 
                    ? 'bg-red-50 border border-red-200' 
                    : rec.type === 'warning'
                    ? 'bg-yellow-50 border border-yellow-200'
                    : 'bg-blue-50 border border-blue-200'
                }`}
              >
                <div className="font-semibold">{rec.message}</div>
                <ul className="mt-2 list-disc list-inside">
                  {rec.details.map((detail, i) => (
                    <li key={i} className="text-sm">{detail}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Program Configuration */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold border-b border-gray-200 pb-2 mb-4">Program Configuration</h2>
            
            <div className="space-y-2">
              <label className="block text-gray-700 font-medium mb-1">
                Number of Participants:
                <input
                  type="number"
                  className="w-full p-2 border rounded mt-1 bg-white border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                  value={config.numberOfParticipants}
                  onChange={(e) => handleConfigChange('numberOfParticipants', e.target.value)}
                />
              </label>

              <label className="block text-gray-700 font-medium mb-1">
                Program Days:
                <input
                  type="number"
                  className="w-full p-2 border rounded mt-1 bg-white border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                  value={config.programDays}
                  onChange={(e) => handleConfigChange('programDays', e.target.value)}
                />
              </label>

              <label className="block text-gray-700 font-medium mb-1">
                Hours Per Day:
                <input
                  type="number"
                  className="w-full p-2 border rounded mt-1 bg-white border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                  value={config.hoursPerDay}
                  onChange={(e) => handleConfigChange('hoursPerDay', e.target.value)}
                />
              </label>

              <div className="space-y-2">
                <label className="flex items-center py-2 hover:bg-gray-50 px-2 rounded-md cursor-pointer">
                  <input
                    type="checkbox"
                    checked={config.isPaid}
                    onChange={(e) => handleConfigChange('isPaid', e.target.checked)}
                    className="mr-2"
                  />
                  Paid Internship
                </label>

                <label className="flex items-center py-2 hover:bg-gray-50 px-2 rounded-md cursor-pointer">
                  <input
                    type="checkbox"
                    checked={config.hasMinors}
                    onChange={(e) => handleConfigChange('hasMinors', e.target.checked)}
                    className="mr-2"
                  />
                  Has Participants Under 18
                </label>

                <div className="flex items-center py-2 hover:bg-gray-50 px-2 rounded-md cursor-pointer relative">
                  <label className="flex items-center flex-1">
                    <input
                      type="checkbox"
                      checked={config.isStationary}
                      onChange={(e) => handleConfigChange('isStationary', e.target.checked)}
                      className="mr-2"
                    />
                    Stationary Program
                  </label>
                  <div className="relative inline-block">
                    <HelpCircle 
                      className="h-5 w-5 text-gray-500 cursor-help"
                      onMouseEnter={() => setShowTooltip(true)}
                      onMouseLeave={() => setShowTooltip(false)}
                    />
                    {showTooltip && (
                      <div className="absolute bottom-full mb-2 w-64 p-2 bg-black text-white text-sm rounded shadow-lg">
                        If the program is primarily in one place, programs like YouthPrize are available
                      </div>
                    )}
                  </div>
                </div>

                <label className="flex items-center py-2 hover:bg-gray-50 px-2 rounded-md cursor-pointer">
                  <input
                    type="checkbox"
                    checked={config.needsFoodProgram}
                    onChange={(e) => handleConfigChange('needsFoodProgram', e.target.checked)}
                    className="mr-2"
                  />
                  Needs Food Program
                </label>

                <label className="flex items-center py-2 hover:bg-gray-50 px-2 rounded-md cursor-pointer">
                  <input
                    type="checkbox"
                    checked={config.qualifiesForYouthPrize}
                    onChange={(e) => handleConfigChange('qualifiesForYouthPrize', e.target.checked)}
                    disabled={!config.isStationary}
                    className={`mr-2 ${!config.isStationary ? 'opacity-50 cursor-not-allowed' : ''}`}
                  />
                  Qualifies for Youth Prize
                </label>

                <label className="flex items-center py-2 hover:bg-gray-50 px-2 rounded-md cursor-pointer">
                  <input
                    type="checkbox"
                    checked={config.dailyTransportNeeded}
                    onChange={(e) => handleConfigChange('dailyTransportNeeded', e.target.checked)}
                    className="mr-2"
                  />
                  Daily Transportation Needed
                </label>
              </div>
            </div>
          </div>

          {/* Rates Configuration */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold border-b border-gray-200 pb-2 mb-4">Rates Configuration</h2>
            
            <div className="space-y-2">
              <label className="block text-gray-700 font-medium mb-1">
                Intern Hourly Rate ($):
                <input
                  type="number"
                  step="0.01"
                  className="w-full p-2 border rounded mt-1 bg-white border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                  value={rates.internHourlyRate}
                  onChange={(e) => handleRateChange('internHourlyRate', e.target.value)}
                />
              </label>

              <label className="block text-gray-700 font-medium mb-1">
                Coordinator Hourly Rate ($):
                <input
                  type="number"
                  step="0.01"
                  className="w-full p-2 border rounded mt-1 bg-white border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                  value={rates.coordinatorHourlyRate}
                  onChange={(e) => handleRateChange('coordinatorHourlyRate', e.target.value)}
                />
              </label>

              <label className="block text-gray-700 font-medium mb-1">
                Daily Food Cost per Person ($):
                <input
                  type="number"
                  step="0.01"
                  className="w-full p-2 border rounded mt-1 bg-white border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                  value={rates.dailyFoodCost}
                  onChange={(e) => handleRateChange('dailyFoodCost', e.target.value)}
                />
              </label>

              <label className="block text-gray-700 font-medium mb-1">
                Daily Supplies Cost per Person ($):
                <input
                  type="number"
                  step="0.01"
                  className="w-full p-2 border rounded mt-1 bg-white border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                  value={rates.dailySupplies}
                  onChange={(e) => handleRateChange('dailySupplies', e.target.value)}
                />
              </label>

              <label className="block text-gray-700 font-medium mb-1">
                Laptop Cost per Person ($):
                <input
                  type="number"
                  step="0.01"
                  className="w-full p-2 border rounded mt-1 bg-white border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                  value={rates.laptopCost}
                  onChange={(e) => handleRateChange('laptopCost', e.target.value)}
                />
              </label>

              <label className="block text-gray-700 font-medium mb-1">
                Training Materials per Person ($):
                <input
                  type="number"
                  step="0.01"
                  className="w-full p-2 border rounded mt-1 bg-white border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                  value={rates.trainingMaterials}
                  onChange={(e) => handleRateChange('trainingMaterials', e.target.value)}
                />
              </label>

              <label className="block text-gray-700 font-medium mb-1">
                Daily Van Cost ($):
                <input
                  type="number"
                  step="0.01"
                  className="w-full p-2 border rounded mt-1 bg-white border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                  value={rates.vanCost}
                  onChange={(e) => handleRateChange('vanCost', e.target.value)}
                />
              </label>

              <label className="block text-gray-700 font-medium mb-1">
                Bus Cost per Hour ($):
                <input
                  type="number"
                  step="0.01"
                  className="w-full p-2 border rounded mt-1 bg-white border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                  value={rates.busCostPerHour}
                  onChange={(e) => handleRateChange('busCostPerHour', e.target.value)}
                />
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default YouthProgramCalculator;