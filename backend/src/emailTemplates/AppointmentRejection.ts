/*!
 * Bloodline Blood Bank Management System
 * Copyright (c) 2025 Onaliy Jayawardana
 * All rights reserved.
 *
 * Unauthorized copying, modification, or distribution of this code is prohibited.
 */
export const AppointmentRejection = (appointment: any) => {
  return `
      <div style="font-family: Arial, sans-serif; background-color: #f4f4f9; padding: 20px; border-radius: 10px; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #e2e8f0; padding: 10px; border-radius: 5px; text-align: center;">
          <h2 style="color: #2d3748;">Appointment Rejection Notification</h2>
        </div>
        <div style="margin-top: 20px;">
          <p style="font-size: 16px; color: #4a5568;">Dear ${appointment.donorInfo.fullName},</p>
          <p style="font-size: 16px; color: #4a5568;">We regret to inform you that your appointment request has been rejected by the NBTS Team.</p>
          <p style="font-size: 16px; color: #4a5568;"><strong>Appointment Date:</strong> ${appointment.selectedDate}</p>
          <p style="font-size: 16px; color: #4a5568;"><strong>Appointment Time:</strong> ${appointment.selectedSlot}</p>
          <p style="font-size: 16px; color: #4a5568;"><strong>Appointment Status:</strong> ${appointment.status}</p>
           <p style="font-size: 16px; color: #4a5568;"><strong>Rejection Reason:</strong> ${appointment.reason}</p>
          <p style="font-size: 16px; color: #4a5568;">We appreciate your willingness to donate, and thank you for your understanding.</p>
        </div>
        <div style="margin-top: 30px; text-align: center; font-size: 16px; color: #4a5568;">
          <p>Best regards,</p>
          <p><strong>NBTS</strong></p>
        </div>
      </div>
    `;
};
