export type Config = {
  numberOfParticipants: number;
  programDays: number;
  isPaid: boolean;
  hasMinors: boolean;
  isStationary: boolean;
  needsFoodProgram: boolean;
  qualifiesForYouthPrize: boolean;
  dailyTransportNeeded: boolean;
  hoursPerDay: number;
};

export type Rates = {
  internHourlyRate: number;
  coordinatorHourlyRate: number;
  dailyFoodCost: number;
  dailySupplies: number;
  laptopCost: number;
  trainingMaterials: number;
  vanCost: number;
  busCostPerHour: number;
};

export type Costs = {
  staffing: number;
  food: number;
  equipment: number;
  transport: number;
  total: number;
};

export type Recommendation = {
  type: 'required' | 'warning' | 'info';
  message: string;
  details: string[];
};

useEffect(() => {
  const newRecommendations: Recommendation[] = [];

  if (config.hasMinors) {
    newRecommendations.push({
      type: 'required' as const,  // Explicitly type as literal
      message: 'Contact Youth Safety Manager immediately for program approval and safety protocols.',
      details: [
        'All staff must complete Safety of Minors training',
        'Background checks required for all staff',
        'One-on-one interactions must be monitored'
      ]
    });
  }

  if (config.qualifiesForYouthPrize) {
    newRecommendations.push({
      type: 'required' as const,
      message: 'Food Safety Training Required for YouthPrize Partnership',
      details: [
        'Two staff members must complete food management training',
        'Food safety certification required',
        'Regular food safety protocols must be maintained'
      ]
    });
  }

  if (config.isPaid && config.programDays > 60) {
    newRecommendations.push({
      type: 'warning' as const,
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