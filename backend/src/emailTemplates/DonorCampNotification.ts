/*!
 * Bloodline Blood Bank Management System
 * Copyright (c) 2025 Onaliy Jayawardana
 * All rights reserved.
 *
 * Unauthorized copying, modification, or distribution of this code is prohibited.
 */
export const DonorCampNotification = (donor: any, camp: any) => {
  const startDate = new Date(`${camp.date} ${camp.startTime}`);
  const endDate = new Date(`${camp.date} ${camp.endTime}`);

  const googleCalendarURL = `https://www.google.com/calendar/render?action=TEMPLATE&text=Blood+Donation+Camp&dates=${
    startDate.toISOString().replace(/[-:]/g, "").split(".")[0]
  }/${
    endDate.toISOString().replace(/[-:]/g, "").split(".")[0]
  }&details=A+blood+donation+camp+is+happening+in+your+city!+Please+consider+participating+to+help+save+lives.&location=${encodeURIComponent(
    camp.googleMapLink || camp.venue
  )}&sf=true&output=xml`;

  return `
        <div style="font-family: Arial, sans-serif; background-color: #f4f4f9; padding: 20px; border-radius: 10px; max-width: 600px; margin: 0 auto;">
          <div style="background-color: #c6f6d5; padding: 10px; border-radius: 5px; text-align: center;">
            <h2 style="color: #2d3748;">Blood Donation Camp Notification</h2>
          </div>
          <div style="margin-top: 20px;">
            <p style="font-size: 16px; color: #4a5568;">Dear ${donor.fullName},</p>
            <p style="font-size: 16px; color: #4a5568;">We are excited to inform you that a blood donation camp has been scheduled in your city, ${camp.city}. Your participation can make a significant impact in saving lives!</p>
            <p style="font-size: 16px; color: #4a5568;"><strong>Camp Date:</strong> ${camp.date}</p>
            <p style="font-size: 16px; color: #4a5568;"><strong>From:</strong> ${camp.startTime}</p>
            <p style="font-size: 16px; color: #4a5568;"><strong>To:</strong> ${camp.endTime}</p>
            <p style="font-size: 16px; color: #4a5568;"><strong>Location:</strong> ${camp.venue}</p>
            <p style="font-size: 16px; color: #4a5568;"><strong>Organized by:</strong> ${camp.organizationName}</p>
            <p style="font-size: 16px; color: #4a5568;">Please consider joining us to contribute to this noble cause.</p>
            <div style="margin-top: 20px; text-align: center;">
              <a href="${googleCalendarURL}" target="_blank" style="display: inline-block; padding: 10px 20px; background-color: #34a853; color: white; text-decoration: none; border-radius: 5px; font-size: 16px;">Add to Google Calendar</a>
            </div>
          </div>
          <div style="margin-top: 30px; text-align: center; font-size: 16px; color: #4a5568;">
            <p>Best regards,</p>
            <p><strong>NBTS</strong></p>
          </div>
        </div>
      `;
};
