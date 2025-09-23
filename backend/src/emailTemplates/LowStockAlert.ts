/*!
 * Bloodline Blood Bank Management System
 * Copyright (c) 2025 Onaliy Jayawardana
 * All rights reserved.
 *
 * Unauthorized copying, modification, or distribution of this code is prohibited.
 */

// A simple utility function to format numbers
const formatNumber = (num: number) => new Intl.NumberFormat().format(num);

export const lowStockAlert = (
  bloodType: string,
  remainingQuantity: number
): string => {
  return `
    <div style="font-family: Arial, sans-serif; background-color: #fcebeb; padding: 20px; border-radius: 10px; max-width: 600px; margin: 0 auto; border: 1px solid #f5c6cb;">
      <div style="background-color: #f5c6cb; padding: 10px; border-radius: 5px; text-align: center;">
        <h2 style="color: #721c24;">⚠️ Low Blood Stock Alert</h2>
      </div>
      <div style="margin-top: 20px;">
        <p style="font-size: 16px; color: #4a5568;">Dear Administrator,</p>
        <p style="font-size: 16px; color: #4a5568;">
          This is an automated notification to inform you that the blood stock for 
          <strong>${bloodType}</strong> has dropped below the critical threshold.
        </p>
        <p style="font-size: 16px; color: #4a5568;">
          The current remaining stock for ${bloodType} is: 
          <strong style="color: #721c24; font-size: 18px;">${formatNumber(
            remainingQuantity
          )} units</strong>.
        </p>
        <p style="font-size: 16px; color: #4a5568;">
          Please take immediate action to check the inventory and replenish the stock.
        </p>
      </div>
      <div style="margin-top: 30px; text-align: center; font-size: 14px; color: #6c757d;">
        <p>This message was sent by the Bloodline Blood Bank Management System.</p>
      </div>
    </div>
  `;
};
