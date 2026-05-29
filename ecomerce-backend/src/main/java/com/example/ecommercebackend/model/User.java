package com.example.ecommercebackend.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;

@Document(collection = "users")
public class User {
    @Id
    private String id;

    private String username;
    private String password;
    private String email;

    private boolean isVerified;
    private String verificationOtp;
    private LocalDateTime verificationOtpExpiry;
    private String resetPasswordOtp;
    private LocalDateTime resetPasswordOtpExpiry;

    // Constructors
    public User() {}
    
    public User(String username, String password, String email) {
        this.username = username;
        this.password = password;
        this.email = email;
        this.isVerified = false;
    }

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public boolean isVerified() { return isVerified; }
    public void setVerified(boolean verified) { isVerified = verified; }

    public String getVerificationOtp() { return verificationOtp; }
    public void setVerificationOtp(String verificationOtp) { this.verificationOtp = verificationOtp; }

    public LocalDateTime getVerificationOtpExpiry() { return verificationOtpExpiry; }
    public void setVerificationOtpExpiry(LocalDateTime verificationOtpExpiry) { this.verificationOtpExpiry = verificationOtpExpiry; }

    public String getResetPasswordOtp() { return resetPasswordOtp; }
    public void setResetPasswordOtp(String resetPasswordOtp) { this.resetPasswordOtp = resetPasswordOtp; }

    public LocalDateTime getResetPasswordOtpExpiry() { return resetPasswordOtpExpiry; }
    public void setResetPasswordOtpExpiry(LocalDateTime resetPasswordOtpExpiry) { this.resetPasswordOtpExpiry = resetPasswordOtpExpiry; }
}