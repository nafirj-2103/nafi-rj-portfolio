import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { name, email, description, budget, timeline } = req.body;

  // Validate required fields
  if (!name || !email || !description) {
    return res.status(400).json({ message: 'Name, email, and description are required' });
  }

  // Get email credentials from environment variables
  const emailUser = process.env.EMAIL_USER;
  const emailPassword = process.env.EMAIL_PASSWORD;
  const adminEmail = process.env.ADMIN_EMAIL;

  if (!emailUser || !emailPassword || !adminEmail) {
    console.error('Email credentials not configured');
    return res.status(500).json({ message: 'Email service not configured' });
  }

  // Create email transporter
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: emailUser,
      pass: emailPassword
    }
  });

  try {
    // Send email to admin
    await transporter.sendMail({
      from: emailUser,
      to: adminEmail,
      subject: `New Inquiry from ${name}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #FFC107; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
            .header h1 { color: #000; margin: 0; font-size: 24px; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
            .field { margin-bottom: 20px; padding: 15px; background: #fff; border-radius: 6px; border-left: 4px solid #FFC107; }
            .field-label { font-weight: bold; color: #555; margin-bottom: 5px; font-size: 12px; text-transform: uppercase; }
            .field-value { font-size: 16px; color: #333; }
            .footer { text-align: center; margin-top: 20px; color: #888; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>📬 New Inquiry Received</h1>
            </div>
            <div class="content">
              <div class="field">
                <div class="field-label">Name</div>
                <div class="field-value">${name}</div>
              </div>
              <div class="field">
                <div class="field-label">Email</div>
                <div class="field-value"><a href="mailto:${email}">${email}</a></div>
              </div>
              <div class="field">
                <div class="field-label">Project Description</div>
                <div class="field-value">${description}</div>
              </div>
              <div class="field">
                <div class="field-label">Budget</div>
                <div class="field-value">${budget || 'Not specified'}</div>
              </div>
              <div class="field">
                <div class="field-label">Timeline</div>
                <div class="field-value">${timeline || 'Not specified'}</div>
              </div>
            </div>
            <div class="footer">
              Sent from NAFI Creations Website<br/>
              ${new Date().toLocaleString()}
            </div>
          </div>
        </body>
        </html>
      `
    });

    // Send confirmation email to client
    await transporter.sendMail({
      from: emailUser,
      to: email,
      subject: 'We received your inquiry - NAFI Creations',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #FFC107; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
            .header h1 { color: #000; margin: 0; font-size: 28px; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; text-align: center; }
            .checkmark { font-size: 48px; margin-bottom: 20px; }
            .footer { text-align: center; margin-top: 20px; color: #888; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Thank You, ${name}!</h1>
            </div>
            <div class="content">
              <div class="checkmark">✅</div>
              <h2>Your inquiry has been received!</h2>
              <p>We have received your inquiry and will review it shortly.</p>
              <p>We'll get back to you within 24-48 hours.</p>
              <p style="margin-top: 30px;">Best regards,<br/><strong>NAFI Creations</strong></p>
            </div>
            <div class="footer">
              © NAFI Creations
            </div>
          </div>
        </body>
        </html>
      `
    });

    console.log('✅ Emails sent successfully');
    return res.status(200).json({ 
      success: true, 
      message: 'Inquiry submitted successfully! Check your email for confirmation.' 
    });

  } catch (error) {
    console.error('Email error:', error.message);
    return res.status(500).json({ message: 'Failed to send email. Please try again.' });
  }
}
