package com.example.ecommercebackend.controller;

import com.example.ecommercebackend.model.User;
import com.example.ecommercebackend.repository.UserRepository;
import com.example.ecommercebackend.security.JwtTokenProvider;
import com.example.ecommercebackend.service.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.Random;

@RestController
@RequestMapping("/api/auth")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    @Autowired
    private EmailService emailService;

    @Value("${frontend.url:http://localhost:3000}")
    private String frontendUrl;

    @PostMapping("/register")
    public ResponseEntity<String> registerUser(@RequestBody User user) {
        // Check if email already exists
        if (userRepository.existsByEmail(user.getEmail())) {
            return ResponseEntity.badRequest().body("⛔ Email already registered");
        }

        // Secure password hashing
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        user.setVerified(false);

        // Generate verification OTP
        String otp = generateOtp();
        user.setVerificationOtp(otp);
        user.setVerificationOtpExpiry(LocalDateTime.now().plusMinutes(15));

        userRepository.save(user);

        // Send email with OTP and Link
        try {
            String subject = "Verify your Electronce Account";
            String verificationUrl = frontendUrl + "/verify-email?email=" + user.getEmail() + "&otp=" + otp;
            String body = "Welcome to Electronce!\n\n" +
                    "To complete your registration, please use the following One-Time Password (OTP):\n" +
                    "OTP Code: " + otp + "\n\n" +
                    "Or verify directly by clicking the link below:\n" +
                    verificationUrl + "\n\n" +
                    "This code will expire in 15 minutes.";
            
            emailService.sendSimpleMessage(user.getEmail(), subject, body);
        } catch (Exception e) {
            System.err.println("Email dispatch failed: " + e.getMessage());
            return ResponseEntity.ok("✅ Registration successful! (Email dispatch offline: please use verification code: " + otp + ")");
        }

        return ResponseEntity.ok("✅ Registration successful! Verification OTP sent to your email.");
    }

    @PostMapping("/verify-email")
    public ResponseEntity<String> verifyEmail(@RequestParam String email, @RequestParam String otp) {
        User user = userRepository.findByEmail(email).orElse(null);
        if (user == null) {
            return ResponseEntity.badRequest().body("⛔ Email not found");
        }

        if (user.isVerified()) {
            return ResponseEntity.ok("✅ Email is already verified.");
        }

        if (user.getVerificationOtp() == null || !user.getVerificationOtp().equals(otp)) {
            return ResponseEntity.badRequest().body("⛔ Invalid OTP");
        }

        if (user.getVerificationOtpExpiry() == null || user.getVerificationOtpExpiry().isBefore(LocalDateTime.now())) {
            return ResponseEntity.badRequest().body("⛔ OTP has expired. Please request a new one.");
        }

        user.setVerified(true);
        user.setVerificationOtp(null);
        user.setVerificationOtpExpiry(null);
        userRepository.save(user);

        return ResponseEntity.ok("✅ Email verified successfully! You can now login.");
    }

    @PostMapping("/resend-otp")
    public ResponseEntity<String> resendOtp(@RequestParam String email) {
        User user = userRepository.findByEmail(email).orElse(null);
        if (user == null) {
            return ResponseEntity.badRequest().body("⛔ Email not found");
        }

        if (user.isVerified()) {
            return ResponseEntity.badRequest().body("⛔ Email is already verified.");
        }

        String otp = generateOtp();
        user.setVerificationOtp(otp);
        user.setVerificationOtpExpiry(LocalDateTime.now().plusMinutes(15));
        userRepository.save(user);

        try {
            String subject = "Resend: Verify your Electronce Account";
            String verificationUrl = frontendUrl + "/verify-email?email=" + user.getEmail() + "&otp=" + otp;
            String body = "Please verify your Electronce account using the new One-Time Password (OTP):\n" +
                    "OTP Code: " + otp + "\n\n" +
                    "Or verify directly by clicking the link below:\n" +
                    verificationUrl + "\n\n" +
                    "This code will expire in 15 minutes.";
            
            emailService.sendSimpleMessage(user.getEmail(), subject, body);
        } catch (Exception e) {
            System.err.println("Email dispatch failed: " + e.getMessage());
            return ResponseEntity.ok("✅ Verification OTP generated! (Email dispatch offline: please use code: " + otp + ")");
        }

        return ResponseEntity.ok("✅ Verification OTP resent to your email.");
    }

    @PostMapping("/login")
    public ResponseEntity<String> loginUser(@RequestBody User loginUser) {
        User user = userRepository.findByEmail(loginUser.getEmail()).orElse(null);
        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("⛔ Email not registered");
        }

        // Compare using passwordEncoder
        if (!passwordEncoder.matches(loginUser.getPassword(), user.getPassword())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("⛔ Invalid password");
        }

        // Check if verified
        if (!user.isVerified()) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body("⛔ Account is not verified. Please verify your email first.");
        }

        // Generate JWT
        String token = jwtTokenProvider.generateToken(user.getEmail());

        return ResponseEntity.ok("✅ Login successful! Token: " + token);
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<String> forgotPassword(@RequestParam String email) {
        User user = userRepository.findByEmail(email).orElse(null);
        if (user == null) {
            return ResponseEntity.badRequest().body("⛔ Email not registered");
        }

        String otp = generateOtp();
        user.setResetPasswordOtp(otp);
        user.setResetPasswordOtpExpiry(LocalDateTime.now().plusMinutes(15));
        userRepository.save(user);

        try {
            String subject = "Reset your Electronce Password";
            String body = "You have requested to reset your password.\n\n" +
                    "Please use the following One-Time Password (OTP) to reset it:\n" +
                    "OTP Code: " + otp + "\n\n" +
                    "This code will expire in 15 minutes.";
            
            emailService.sendSimpleMessage(user.getEmail(), subject, body);
        } catch (Exception e) {
            System.err.println("Email dispatch failed: " + e.getMessage());
            return ResponseEntity.ok("✅ Password reset OTP generated! (Email dispatch offline: please use code: " + otp + ")");
        }

        return ResponseEntity.ok("✅ Password reset OTP sent to your email.");
    }

    @PostMapping("/reset-password")
    public ResponseEntity<String> resetPassword(@RequestParam String email, @RequestParam String otp, @RequestParam String newPassword) {
        User user = userRepository.findByEmail(email).orElse(null);
        if (user == null) {
            return ResponseEntity.badRequest().body("⛔ Email not found");
        }

        if (user.getResetPasswordOtp() == null || !user.getResetPasswordOtp().equals(otp)) {
            return ResponseEntity.badRequest().body("⛔ Invalid OTP");
        }

        if (user.getResetPasswordOtpExpiry() == null || user.getResetPasswordOtpExpiry().isBefore(LocalDateTime.now())) {
            return ResponseEntity.badRequest().body("⛔ OTP has expired. Please request a new one.");
        }

        // Securely hash and update password
        user.setPassword(passwordEncoder.encode(newPassword));
        user.setResetPasswordOtp(null);
        user.setResetPasswordOtpExpiry(null);
        userRepository.save(user);

        return ResponseEntity.ok("✅ Password reset successful! You can now login with your new password.");
    }    @PostMapping("/support-enquiry")
    public ResponseEntity<String> sendSupportEnquiry(
            @RequestParam String name,
            @RequestParam String email,
            @RequestParam String subject,
            @RequestParam String message) {
        
        try {
            // 1. Send notification email to the administrator (myecommerceweb20@gmail.com)
            String adminSubject = "[Support Enquiry] " + subject;
            String adminBody = "New Support Enquiry from Electronce Grid:\n\n" +
                    "Operative Name: " + name + "\n" +
                    "Contact Email: " + email + "\n" +
                    "Subject: " + subject + "\n\n" +
                    "Message payload:\n" + message;
            emailService.sendSimpleMessage("electronce20@gmail.com", adminSubject, adminBody);

            // 2. Send automatic confirmation receipt to the user
            String userSubject = "Support Receipt Confirmation: " + subject;
            String userBody = "Greetings " + name + ",\n\n" +
                    "We have successfully received your support enquiry regarding: \"" + subject + "\".\n\n" +
                    "A support drone has locked onto your coordinates, and our dispatch team will respond to your email (" + email + ") shortly.\n\n" +
                    "Transmission Payload:\n" +
                    "--------------------------------------------------\n" +
                    message + "\n" +
                    "--------------------------------------------------\n\n" +
                    "Thank you for contacting Electronce Support.";
            emailService.sendSimpleMessage(email, userSubject, userBody);
            
        } catch (Exception e) {
            System.err.println("Support email dispatch failed: " + e.getMessage());
            return ResponseEntity.ok("✅ Support enquiry transmitted successfully! (Email notification offline).");
        }

        return ResponseEntity.ok("✅ Enquiry transmitted successfully!");
    }



    private String generateOtp() {
        Random random = new Random();
        int otp = 100000 + random.nextInt(900000);
        return String.valueOf(otp);
    }
}