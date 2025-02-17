import { ObjectId } from "mongodb";

export interface User {
  sub: string;
  firstName: string;
  lastName: string;
  email: string;
  birthdate: Date | null;
  avatar: string | null;
  role: string;
}

export interface Donor {
  _id?: ObjectId;
  nic: string;
  fullName: string;
  email: string;
  contactNumber: string;
  address: string;
  birthdate: string;
  age: number;
  bloodGroup: string;
  avatar: string | null;
  gender: string;
}

export interface BloodDonor {
  _id?: ObjectId;
  nic: string;
  fullName: string;
  email: string;
  contactNumber: string;
  contactNumberHome: string;
  contactNumberOffice: string;
  address: string;
  addressOffice: string;
  birthdate: string;
  age: number;
  bloodGroup: string;
  avatar: string | null;
  gender: string;
}

export interface StepperProps {
  onNextStep: () => void;
  onPreviousStep: () => void;
  onFormDataChange: (data: any) => void;
  formData: any;
}
