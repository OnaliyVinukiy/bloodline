/*!
 * Bloodline Blood Bank Management System
 * Copyright (c) 2025 Onaliy Jayawardana
 * All rights reserved.
 *
 * Unauthorized copying, modification, or distribution of this code is prohibited.
 */
export interface UserInfo {
  sub: string;
  given_name?: string;
  family_name?: string;
  email?: string;
  roles?: string[];
}
