// backend/src/config/cronJobs.js
import cron from 'node-cron';
import nodemailer from 'nodemailer';
import Batch from '../models/Batch.js';

// Setup email transporter (Uses Mailtrap or any standard SMTP for testing)
const transporter = nodemailer.createTransport({
  host: "sandbox.smtp.mailtrap.io", // For production, replace with Gmail/SendGrid SMTP config
  port: 2525,
  auth: {
    user: process.env.SMTP_USER || "your_mock_user", 
    pass: process.env.SMTP_PASS || "your_mock_pass"
  }
});

export const initCronJobs = () => {
  // Runs every day at 6:00 AM ('0 6 * * *')
  // For testing right now, we can set it to run every minute: '*/1 * * * *'
  cron.schedule('0 6 * * *', async () => {
    console.log('Running automated daily inventory health scan...');
    try {
      const today = new Date();
      const sevenDaysFromNow = new Date();
      sevenDaysFromNow.setDate(today.getDate() + 7);

      // Find all active inventory items expiring within the next 7 days
      const expiringSoonBatches = await Batch.find({
        quantityRemaining: { $gt: 0 },
        expiryDate: { $gte: today, $lte: sevenDaysFromNow },
        status: 'active'
      }).populate('productId');

      if (expiringSoonBatches.length === 0) {
        console.log('No critical item expirations flagged for today.');
        return;
      }

      // Generate a minimal, clean HTML table for the manager's digest
      let tableRows = '';
      expiringSoonBatches.forEach(batch => {
        const formattedDate = new Date(batch.expiryDate).toLocaleDateString();
        tableRows += `
          <tr>
            <td style="padding: 8px; border: 1px solid #ddd;">${batch.productId.name}</td>
            <td style="padding: 8px; border: 1px solid #ddd;">${batch.productId.barcode}</td>
            <td style="padding: 8px; border: 1px solid #ddd; color: red; font-weight: bold;">${formattedDate}</td>
            <td style="padding: 8px; border: 1px solid #ddd;">${batch.quantityRemaining} units</td>
          </tr>
        `;
      });

      const mailOptions = {
        from: '"Smart Inventory System" <alerts@storeinventory.com>',
        to: 'manager@store.com', // In real use, pull this from the Manager User accounts
        subject: '⚠️ CRITICAL: Stock Expiration Alert Daily Report',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #d9534f;">Expiring Stock Action Required</h2>
            <p>The following batches are expiring within 7 days and require immediate price markdown actions:</p>
            <table style="width: 100%; border-collapse: collapse;">
              <thead>
                <tr style="background-color: #f2f2f2;">
                  <th style="padding: 8px; border: 1px solid #ddd; text-align: left;">Product</th>
                  <th style="padding: 8px; border: 1px solid #ddd; text-align: left;">Barcode</th>
                  <th style="padding: 8px; border: 1px solid #ddd; text-align: left;">Expiry Date</th>
                  <th style="padding: 8px; border: 1px solid #ddd; text-align: left;">Qty Left</th>
                </tr>
              </thead>
              <tbody>
                ${tableRows}
              </tbody>
            </table>
          </div>
        `
      };

      await transporter.sendMail(mailOptions);
      console.log('Daily expiry automated notification email sent successfully.');
    } catch (error) {
      console.error('Error running automated baseline cron loop:', error);
    }
  });
};
