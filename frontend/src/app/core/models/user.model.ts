export enum Role {
  ADMIN = 'ADMIN',
  PARENT = 'PARENT',
  CHILD = 'CHILD',
}

export interface User {
  id: number;
  name: string;
  email: string;
  password?: string; // Optional as we don't always want to expose password
  picture?: string;
  dateOfBirth?: Date;
  deleted: boolean;
  role: Role;
}

// Optional: Type guard function to check if an object is a User
export function isUser(obj: any): obj is User {
  return (
    obj &&
    typeof obj.id === 'number' &&
    typeof obj.name === 'string' &&
    typeof obj.email === 'string' &&
    typeof obj.deleted === 'boolean' &&
    Object.values(Role).includes(obj.role)
  );
}
