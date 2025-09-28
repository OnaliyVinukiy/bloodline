export const DonorWelcome = (donor: any): string => {
  const { fullName } = donor;

  return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Welcome to Bloodline!</title>
  </head>
  <body style="font-family: Arial, sans-serif; background-color: #f7f7f7; padding: 20px;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
          <div style="background-color: #dc2626; color: #ffffff; padding: 20px; text-align: center;">
              <h1 style="margin: 0; font-size: 24px;">🩸 Welcome to Bloodline!</h1>
          </div>
  
          <div style="padding: 30px;">
              <p style="font-size: 16px; color: #333333;">Hello ${fullName},</p>
              
              <p style="font-size: 16px; color: #333333;">
                  Thank you for completing your registration and joining our mission to save lives. We are grateful for your commitment to becoming a blood donor in Sri Lanka.
              </p>
  
              <p style="font-size: 16px; color: #333333;">
                  Your profile is now complete. You can use our system to:
              </p>
              
              <ul style="list-style-type: disc; padding-left: 20px; color: #333333;">
                  <li style="margin-bottom: 10px;">Book and manage your blood donation appointments.</li>
                  <li style="margin-bottom: 10px;">Check your donor eligibility for upcoming drives.</li>
                  <li style="margin-bottom: 10px;">Find nearby blood donation camps across the island.</li>
              </ul>
  
              <p style="text-align: center; margin-top: 30px;">
                  <a href="YOUR_APP_URL/login" 
                     style="display: inline-block; padding: 12px 25px; background-color: #dc2626; color: #ffffff; text-decoration: none; border-radius: 5px; font-weight: bold;">
                      Go to Your Profile
                  </a>
              </p>
  
              <p style="font-size: 14px; color: #666666; margin-top: 30px;">
                  Together, every drop counts!
              </p>
          </div>
  
          <div style="background-color: #e5e5e5; padding: 15px; text-align: center; font-size: 12px; color: #999999;">
              <p style="margin: 0;">Bloodline Blood Bank Management System | National Blood Transfusion Service, Sri Lanka</p>
          </div>
      </div>
  </body>
  </html>
  `;
};
