export interface User {
    sub: string;
    firstName: string;
    lastName: string;
    email: string;
    birthdate: string | Date;
    avatar: string | null;
    role: string;
  }
  