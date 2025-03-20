export interface RewardRedemption {
  id: number;
  childId: number;
  rewardId: number;
  points_spent: number;
  message: string | null;
  redeemed_at: string;
  redemptionDate: string;
  reward: {
    id: number;
    name: string;
    description: string;
    pointCost: number;
  };
}
