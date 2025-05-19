export const AppointmentReminderOneWeek = (appointment: any) => {
    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #c00;">Blood Donation Appointment Reminder</h2>
        <p>Dear ${appointment.donorInfo.name},</p>
        <p>This is a friendly reminder about your upcoming blood donation appointment:</p>
        
        <div style="background: #f9f9f9; padding: 15px; border-left: 4px solid #c00; margin: 20px 0;">
          <p><strong>Date:</strong> ${new Date(appointment.selectedDate).toLocaleDateString()}</p>
          <p><strong>Time:</strong> ${appointment.selectedTime}</p>
          <p><strong>Location:</strong> ${appointment.selectedLocation}</p>
        </div>
        
        <p>Your appointment is in one week. Please remember to:</p>
        <ul>
          <li>Get a good night's sleep before your donation</li>
          <li>Eat a healthy meal before donating</li>
          <li>Drink plenty of fluids in the days leading up to your donation</li>
          <li>Bring a valid ID with you</li>
        </ul>
        
        <p>If you need to reschedule or cancel your appointment, please contact us as soon as possible.</p>
        
        <p>Thank you for your life-saving contribution!</p>
        
        <p style="color: #666; font-size: 0.9em; margin-top: 30px;">
          Bloodline Blood Bank Management System
        </p>
      </div>
    `;
  };