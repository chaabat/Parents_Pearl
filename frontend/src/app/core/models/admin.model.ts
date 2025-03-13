import { User,Role } from './user.model';

export interface Admin extends User {
  role: Role.PARENT;
}
