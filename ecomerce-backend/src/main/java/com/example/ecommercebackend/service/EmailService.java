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
     */
    public void sendSimpleMessage(String to, String subject, String body) {
        if (resendApiKey != null && !resendApiKey.isEmpty()) {
            sendViaResend(to, subject, body);
        } else {
            sendViaSmtp(to, subject, body);
        }
    }

    /**
     * Wraps plain text body into a branded HTML email with ELECTRONCE header.
     */
    private String buildBrandedHtml(String body) {
        // Convert plain text newlines to <br> for the body content
        String htmlBody = body
                .replace("&", "&amp;")
                .replace("<", "&lt;")
                .replace(">", "&gt;")
                .replace("\n", "<br>");

        return "<!DOCTYPE html>"
                + "<html><head><meta charset='UTF-8'></head>"
                + "<body style='margin:0;padding:0;background-color:#0a0a0f;font-family:Arial,Helvetica,sans-serif;'>"
                + "<table width='100%' cellpadding='0' cellspacing='0' style='background-color:#0a0a0f;padding:40px 0;'>"
                + "<tr><td align='center'>"
                + "<table width='600' cellpadding='0' cellspacing='0' style='background-color:#12121a;border-radius:16px;border:1px solid #1e1e2e;overflow:hidden;'>"

                // Header with ELECTRONCE branding
                + "<tr><td style='background:linear-gradient(135deg,#0a2a4a 0%,#0d1b2a 50%,#0a1628 100%);padding:40px 30px;text-align:center;border-bottom:1px solid #00fdee22;'>"
                + "<h1 style='margin:0;font-size:36px;font-weight:900;letter-spacing:8px;color:#00fdee;text-shadow:0 0 20px rgba(0,253,238,0.4);font-family:Arial,Helvetica,sans-serif;'>"
                + "ELECTRONCE"
                + "</h1>"
                + "<p style='margin:8px 0 0;font-size:11px;letter-spacing:4px;color:#00aaff;text-transform:uppercase;'>"
                + "Premium Electronics Grid"
                + "</p>"
                + "</td></tr>"

                // Body content
                + "<tr><td style='padding:35px 30px;color:#c8c8d0;font-size:15px;line-height:1.7;'>"
                + htmlBody
                + "</td></tr>"

                // Footer
                + "<tr><td style='padding:25px 30px;text-align:center;border-top:1px solid #1e1e2e;'>"
                + "<p style='margin:0;font-size:11px;color:#555568;letter-spacing:1px;'>"
                + "© 2026 Electronce. All rights reserved."
                + "</p>"
                + "<p style='margin:6px 0 0;font-size:10px;color:#3a3a4a;'>"
                + "This is an automated transmission from the Electronce Grid."
                + "</p>"
                + "</td></tr>"

                + "</table>"
                + "</td></tr>"
                + "</table>"
                + "</body></html>";
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

            String htmlContent = buildBrandedHtml(body);

            // Escape special characters for JSON
            String escapedHtml = htmlContent
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
                    + "\"html\":\"" + escapedHtml + "\""
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
