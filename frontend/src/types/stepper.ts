/*!
 * Bloodline Blood Bank Management System
 * Copyright (c) 2025 Onaliy Jayawardana
 * All rights reserved.
 *
 * Unauthorized copying, modification, or distribution of this code is prohibited.
 */
export interface StepperProps {
  onNextStep: () => void;
  onPreviousStep: () => void;
  onFormDataChange: (data: any) => void;
  formData: any;
}

export interface StepperPropsCamps {
  onNextStep: () => void;
  onPreviousStep: () => void;
}
