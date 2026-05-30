package com.example.ecommercebackend.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.nio.charset.StandardCharsets;

@Service
public class EmailService {

    @Autowired(required = false)
    private JavaMailSender mailSender;

    @Value("${resend.api.key:}")
    private String resendApiKey;

    @Value("${email.from:onboarding@resend.dev}")
    private String senderEmail;

    /**
     * Sends an email using Resend HTTP API if a key is configured,
     * otherwise falls back to SMTP (JavaMailSender).
     * 
     * Resend API uses HTTPS (port 443) which is NOT blocked by Render's free tier,
     * unlike SMTP ports 587/465 which ARE blocked.
     */
    public void sendSimpleMessage(String to, String subject, String body) {
        if (resendApiKey != null && !resendApiKey.isEmpty()) {
            sendViaResend(to, subject, body);
        } else {
            sendViaSmtp(to, subject, body);
        }
    }

    /**
     * Send email via Resend REST API over HTTPS.
     * This works on Render free tier because it uses port 443, not SMTP ports.
     */
    private void sendViaResend(String to, String subject, String body) {
        try {
            URL url = new URL("https://api.resend.com/emails");
            HttpURLConnection conn = (HttpURLConnection) url.openConnection();
            conn.setRequestMethod("POST");
            conn.setRequestProperty("Content-Type", "application/json");
            conn.setRequestProperty("Authorization", "Bearer " + resendApiKey);
            conn.setDoOutput(true);

            // Escape special characters for JSON
            String escapedBody = body
                    .replace("\\", "\\\\")
                    .replace("\"", "\\\"")
                    .replace("\n", "\\n")
                    .replace("\r", "\\r")
                    .replace("\t", "\\t");

            String escapedSubject = subject
                    .replace("\\", "\\\\")
                    .replace("\"", "\\\"");

            String jsonPayload = "{"
                    + "\"from\":\"Electronce <" + senderEmail + ">\","
                    + "\"to\":[\"" + to + "\"],"
                    + "\"subject\":\"" + escapedSubject + "\","
                    + "\"text\":\"" + escapedBody + "\""
                    + "}";

            try (OutputStream os = conn.getOutputStream()) {
                os.write(jsonPayload.getBytes(StandardCharsets.UTF_8));
            }

            int responseCode = conn.getResponseCode();
            if (responseCode < 200 || responseCode >= 300) {
                String errorBody = new String(conn.getErrorStream().readAllBytes(), StandardCharsets.UTF_8);
                throw new RuntimeException("Resend API error (HTTP " + responseCode + "): " + errorBody);
            }

            System.out.println("✅ Email sent via Resend API to: " + to);

        } catch (Exception e) {
            System.err.println("❌ Resend API email dispatch failed: " + e.getMessage());
            throw new RuntimeException("Resend email dispatch failed: " + e.getMessage(), e);
        }
    }

    /**
     * Fallback: Send email via traditional SMTP (works locally, blocked on Render free tier).
     */
    private void sendViaSmtp(String to, String subject, String body) {
        if (mailSender == null) {
            throw new RuntimeException("No email transport configured. Set resend.api.key or configure SMTP.");
        }
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(senderEmail);
        message.setTo(to);
        message.setSubject(subject);
        message.setText(body);
        mailSender.send(message);
        System.out.println("✅ Email sent via SMTP to: " + to);
    }
}
