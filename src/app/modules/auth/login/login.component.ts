import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'src/app/core/services/user.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { OtpService } from 'src/app/core/services/otp.service';
import { User } from 'src/app/shared/models/user.model';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit, OnDestroy {
  username = '';
  password = '';
  otp = '';

  step: 'credentials' | 'otp' = 'credentials';
  pendingUser: User | null = null;
  pendingEmail = '';
  otpMessage = '';
  otpError = '';
  countdown = 0;
  private countdownInterval: any;

  constructor(
    private router: Router,
    private userService: UserService,
    private authService: AuthService,
    private otpService: OtpService
  ) {}

  ngOnInit(): void {
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/dashboard']);
    }
  }

  ngOnDestroy(): void {
    if (this.countdownInterval) {
      clearInterval(this.countdownInterval);
    }
  }

  /** Step 1 — validate username + password */
  onSubmitCredentials(): void {
    this.otpError = '';
    this.otpMessage = '';

    const u = this.username.trim();
    const p = this.password;

    if (!u || !p) {
      alert('Please enter both username and password');
      return;
    }

    const allUsers = this.userService.getUsers();
    const matchedUser = allUsers.find(
      user => user.username.toLowerCase() === u.toLowerCase()
    );

    if (!matchedUser || matchedUser.password !== p) {
      // Detect corrupted user storage (duplicate IDs or missing default users)
      const ids = allUsers.map(u => u.id);
      const hasDuplicateIds = new Set(ids).size !== ids.length;
      const hasAllDefaults = ['kinuthia', 'john', 'Jane', 'Molly']
        .every(name => allUsers.some(u => u.username.toLowerCase() === name.toLowerCase()));
      if (hasDuplicateIds || !hasAllDefaults) {
        localStorage.removeItem('erp_users');
        alert('User data was corrupted and has been reset. Please try logging in again.');
        return;
      }
      // Give a helpful hint based on whether the user exists
      if (!matchedUser) {
        alert('User not found. Check the username and try again.');
      } else {
        alert('Invalid password. If this account was created by an admin, the default password is: default123');
      }
      return;
    }

    // Credentials valid — move to OTP step
    this.pendingUser = matchedUser;
    this.pendingEmail = matchedUser.email;
    this.step = 'otp';

    // Send OTP to the user's registered email
    const sentOtp = this.otpService.sendOtpEmail(matchedUser.email);
    this.otpMessage = `OTP sent to ${matchedUser.email}`;
    console.log('Your OTP is:', sentOtp); // dev convenience

    this.startCountdown();
  }

  /** Step 2 — verify OTP and complete login */
  onSubmitOtp(): void {
    this.otpError = '';

    if (!this.otp || this.otp.length !== 6) {
      this.otpError = 'Please enter the 6-digit OTP code';
      return;
    }

    const isValid = this.otpService.verifyOtp(this.pendingEmail, this.otp);

    if (!isValid) {
      this.otpError = 'Invalid or expired OTP. Please try again.';
      return;
    }

    // OTP verified — complete login
    if (this.countdownInterval) {
      clearInterval(this.countdownInterval);
    }

    this.authService.setUser({
      id: this.pendingUser!.id,
      username: this.pendingUser!.username,
      email: this.pendingUser!.email,
      password: this.pendingUser!.password,
      role: this.pendingUser!.role,
      permissions: this.pendingUser!.permissions,
      department: this.pendingUser!.department,
      status: this.pendingUser!.status
    });

    this.router.navigate(['/dashboard']);
  }

  /** Resend a fresh OTP */
  onResendOtp(): void {
    this.otpError = '';
    const sentOtp = this.otpService.resendOtp(this.pendingEmail);
    this.otpMessage = `New OTP sent to ${this.pendingEmail}`;
    console.log('Your new OTP is:', sentOtp);
    this.otp = '';
    this.startCountdown();
  }

  /** Go back to credentials step */
  onBack(): void {
    if (this.countdownInterval) {
      clearInterval(this.countdownInterval);
    }
    this.step = 'credentials';
    this.otp = '';
    this.otpMessage = '';
    this.otpError = '';
    this.pendingUser = null;
    this.countdown = 0;
  }

  private startCountdown(): void {
    this.countdown = 300; // 5 minutes in seconds
    if (this.countdownInterval) {
      clearInterval(this.countdownInterval);
    }
    this.countdownInterval = setInterval(() => {
      this.countdown--;
      if (this.countdown <= 0) {
        clearInterval(this.countdownInterval);
        this.otpError = 'OTP expired. Please request a new code.';
      }
    }, 1000);
  }
}
