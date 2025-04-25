/*!
 * Bloodline Blood Bank Management System
 * Copyright (c) 2025 Onaliy Jayawardana
 * All rights reserved.
 *
 * Unauthorized copying, modification, or distribution of this code is prohibited.
 */
export const CampConfirmation = (camp: any) => {
  return `
      <div style="font-family: Arial, sans-serif; background-color: #f4f4f9; padding: 20px; border-radius: 10px; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #e2e8f0; padding: 10px; border-radius: 5px; text-align: center;">
          <h2 style="color: #2d3748;">Blood Donation Camp Request Confirmation</h2>
        </div>
        <div style="margin-top: 20px;">
          <p style="font-size: 16px; color: #4a5568;">Dear ${camp.fullName},</p>
          <p style="font-size: 16px; color: #4a5568;">Your request to organize a blood donation camp has been placed successfully. The NBTS team will review the application and will send the acceptance or rejection status.</p>
          <p style="font-size: 16px; color: #4a5568;"><strong>Date:</strong> ${camp.date}</p>
          <p style="font-size: 16px; color: #4a5568;"><strong>From:</strong> ${camp.startTime}</p>
          <p style="font-size: 16px; color: #4a5568;"><strong>To:</strong> ${camp.endTime}</p>
          <p style="font-size: 16px; color: #4a5568;"><strong>Status:</strong> ${camp.status}</p>
          <p style="font-size: 16px; color: #4a5568;">Thank you for your contribution to saving lives!</p>
        </div>
        <div style="margin-top: 30px; text-align: center; font-size: 16px; color: #4a5568;">
          <p>Best regards,</p>
          <p><strong>NBTS</strong></p>
        </div>
      </div>
    `;
};
