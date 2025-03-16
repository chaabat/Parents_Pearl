import { Reward } from './reward.model';

export interface RewardRedemption {
  id: number;
  childId: number;
  rewardId: number;
  reward?: Reward;
  pointCost: number;
  redemptionDate: string;
}
