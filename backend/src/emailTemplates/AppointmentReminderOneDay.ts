export const AppointmentReminderOneDay = (appointment: any) => {
  return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #c00;">Tomorrow's Blood Donation Appointment</h2>
        <p>Dear ${appointment.donorInfo.fullName},</p>
        <p>This is a reminder that you have a blood donation appointment tomorrow:</p>
        
        <div style="background: #f9f9f9; padding: 15px; border-left: 4px solid #c00; margin: 20px 0;">
          <p><strong>Date:</strong> ${new Date(
            appointment.selectedDate
          ).toLocaleDateString()}</p>
          <p><strong>Time:</strong> ${appointment.selectedSlot}</p>
          <p><strong>Location:</strong> National Blood Transfusion Service</p>
        </div>
        
        <p>Important reminders for tomorrow:</p>
        <ul>
          <li>Eat a healthy meal 2-3 hours before donating</li>
          <li>Drink an extra 16 oz of water before your appointment</li>
          <li>Avoid fatty foods before donating</li>
          <li>Bring a valid photo ID</li>
        </ul>
        
        <p>If you're not feeling well or need to reschedule, please contact us immediately.</p>
        
        <p>We appreciate your commitment to saving lives!</p>
        
        <p style="color: #666; font-size: 0.9em; margin-top: 30px;">
          Bloodline Blood Bank Management System
        </p>
      </div>
    `;
};
