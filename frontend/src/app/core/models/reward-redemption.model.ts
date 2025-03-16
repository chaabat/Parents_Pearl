export interface RewardRedemption {
  id: number;
  childId: number;
  rewardId: number;
  pointCost: number;
  message: string;
  redemptionDate: Date;
}
