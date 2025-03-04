export interface RewardRedemption {
  id: number;
  childId: number;
  rewardId: number;
  pointsSpent: number;
  message: string;
  redemptionDate: Date;
} 