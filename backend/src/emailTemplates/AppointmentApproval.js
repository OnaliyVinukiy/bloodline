export const AppointmentApproval = (appointment) => {
  const startDate = new Date(
    `${appointment.selectedDate} ${appointment.selectedSlot}`
  );
  const endDate = new Date(startDate.getTime() + 60 * 60 * 1000);

  const googleCalendarURL = `https://www.google.com/calendar/render?action=TEMPLATE&text=Blood+Donation+Appointment&dates=${
    startDate.toISOString().replace(/[-:]/g, "").split(".")[0]
  }/${
    endDate.toISOString().replace(/[-:]/g, "").split(".")[0]
  }&details=Your+appointment+has+been+approved+by+NBTS.&location=National+Blood+Transfusion+Services,+Narahenpita,+Elvitigala+Mawatha,+Colombo&sf=true&output=xml`;

  return `
    <div style="font-family: Arial, sans-serif; background-color: #f4f4f9; padding: 20px; border-radius: 10px; max-width: 600px; margin: 0 auto;">
      <div style="background-color: #c6f6d5; padding: 10px; border-radius: 5px; text-align: center;">
        <h2 style="color: #2d3748;">Appointment Approval Notification</h2>
      </div>
      <div style="margin-top: 20px;">
        <p style="font-size: 16px; color: #4a5568;">Dear ${appointment.donorInfo.fullName},</p>
        <p style="font-size: 16px; color: #4a5568;">We are pleased to inform you that your appointment request has been approved by the NBTS Team.</p>
        <p style="font-size: 16px; color: #4a5568;"><strong>Appointment Date:</strong> ${appointment.selectedDate}</p>
        <p style="font-size: 16px; color: #4a5568;"><strong>Appointment Time:</strong> ${appointment.selectedSlot}</p>
        <p style="font-size: 16px; color: #4a5568;"><strong>Appointment Status:</strong> ${appointment.status}</p>
        <p style="font-size: 16px; color: #4a5568;"><strong>Location:</strong> National Blood Transfusion Services, Narahenpita, Elvitigala Mawatha, Colombo</p>
        <p style="font-size: 16px; color: #4a5568;"><strong>Google Maps:</strong> <a href="https://maps.app.goo.gl/px5b65FchLixu4Z7A" target="_blank" style="color: #3182ce; text-decoration: none;">Click here</a></p>
        <p style="font-size: 16px; color: #4a5568;">Thank you for your valuable contribution to saving lives! We look forward to seeing you at the appointment.</p>
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
