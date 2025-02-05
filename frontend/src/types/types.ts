export interface User {
    sub: string;
    firstName: string;
    lastName: string;
    email: string;
    birthdate: Date | null;
    avatar: string | null;
    role: string;
  }
  