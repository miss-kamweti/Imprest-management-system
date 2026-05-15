import { Injectable } from '@angular/core';

interface OtpRecord {
  email: string;
  otp: string;
  createdAt: number;
}

@Injectable({
  providedIn: 'root'
})
export class OtpService {
  private storageKey = 'otp_2fa_data';
  private readonly OTP_TTL_MS = 5 * 60 * 1000; // 5 minutes


  generateAndStoreOtp(email: string): string {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const record: OtpRecord = {
      email: email.toLowerCase().trim(),
      otp,
      createdAt: Date.now()
    };
    const all = this.getAllRecords();
    const filtered = all.filter(r => r.email !== record.email);
    filtered.push(record);
    localStorage.setItem(this.storageKey, JSON.stringify(filtered));
    return otp;
  }

  /** Send the OTP via email */
  sendOtpEmail(email: string): string {
    const otp = this.generateAndStoreOtp(email);
    this.sendEmailViaService(email, otp);
    return otp;
  }

  /** Send email using email service - replace with your actual email service */
  private sendEmailViaService(email: string, otp: string): void {
    // For demonstration, we'll still log to console but show the OTP clearly
    // In production, replace this section with your actual email service integration
    // Examples:
    // 1. EmailJS: https://www.emailjs.com/
    // 2. SendGrid: https://sendgrid.com/
    // 3. Firebase Auth: https://firebase.google.com/products/auth
    // 4. AWS SES: https://aws.amazon.com/ses/
    // 5. Nodemailer (if you have a backend): https://nodemailer.com/
    
    console.log(`[OTP EMAIL SENT] To: ${email} | OTP: ${otp}`);
    console.log(`[DEVELOPMENT] In production, replace sendEmailViaService() with your email service integration`);
    
    // Uncomment and configure one of the examples below for actual email sending:
    
    // Example 1: Using EmailJS (you need to sign up and get your service ID, template ID, and public key)
    /*
    (function() {
      // Initialize EmailJS with your public key
      emailjs.init("YOUR_PUBLIC_KEY");
      
      // Send the email
      emailjs.sendForm('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', {
        to_email: email,
        otp_code: otp,
        message: `Your OTP code is ${otp}`
      }).then(function(response) {
        console.log('EmailJS: SUCCESS!', response.status, response.text);
      }, function(error) {
        console.log('EmailJS: FAILED...', error);
      });
    })();
    */
    
    // Example 2: Using a simple REST API endpoint (you would need to implement this backend)
    /*
    fetch('/api/send-otp', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, otp }),
    })
    .then(response => response.json())
    .then(data => console.log('Email sent:', data))
    .catch(error => console.error('Error sending email:', error));
    */
  }

  /** Verify the entered OTP for the given email */
  verifyOtp(email: string, enteredOtp: string): boolean {
    const record = this.getRecordForEmail(email);
    if (!record) return false;
    if (Date.now() - record.createdAt > this.OTP_TTL_MS) {
      this.clearOtp(email);
      return false;
    }
    if (record.otp === enteredOtp) {
      this.clearOtp(email);
      return true;
    }
    return false;
  }

  /** Check whether a valid OTP record exists for the email */
  hasActiveOtp(email: string): boolean {
    const record = this.getRecordForEmail(email);
    if (!record) return false;
    return Date.now() - record.createdAt <= this.OTP_TTL_MS;
  }

  /** Resend a fresh OTP */
  resendOtp(email: string): string {
    return this.sendOtpEmail(email);
  }

  /** Clear the OTP record for an email */
  clearOtp(email: string): void {
    const all = this.getAllRecords().filter(r => r.email !== email.toLowerCase().trim());
    localStorage.setItem(this.storageKey, JSON.stringify(all));
  }

  /** Seconds remaining before the current OTP expires */
  getSecondsRemaining(email: string): number {
    const record = this.getRecordForEmail(email);
    if (!record) return 0;
    const elapsed = Date.now() - record.createdAt;
    const remaining = this.OTP_TTL_MS - elapsed;
    return remaining > 0 ? Math.ceil(remaining / 1000) : 0;
  }

  private getRecordForEmail(email: string): OtpRecord | null {
    const all = this.getAllRecords();
    return all.find(r => r.email === email.toLowerCase().trim()) || null;
  }

  private getAllRecords(): OtpRecord[] {
     const data = localStorage.getItem(this.storageKey);
     return data ? JSON.parse(data) : [];
   }
 }
