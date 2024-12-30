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