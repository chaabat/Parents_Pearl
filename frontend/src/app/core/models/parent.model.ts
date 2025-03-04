import { User, Role } from './user.model';

export interface Parent extends User {
  role: Role.PARENT;
  children: number[]; // Array of child IDs
}
