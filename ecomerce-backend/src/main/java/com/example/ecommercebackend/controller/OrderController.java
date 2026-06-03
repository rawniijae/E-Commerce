package com.example.ecommercebackend.controller;

import com.example.ecommercebackend.model.Order;
import com.example.ecommercebackend.model.OrderItem;
import com.example.ecommercebackend.repository.OrderRepository;
import com.example.ecommercebackend.service.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth/orders")
public class OrderController {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private EmailService emailService;

    @Value("${frontend.url:http://localhost:3000}")
    private String frontendUrl;

    @PostMapping("/place")
    public ResponseEntity<?> placeOrder(@RequestBody Order order) {
        try {
            order.setOrderDate(LocalDateTime.now());
            order.setStatus("PENDING");
            
            Order savedOrder = orderRepository.save(order);
            
            // Format order summary for email
            StringBuilder itemsText = new StringBuilder();
            if (order.getItems() != null) {
                for (OrderItem item : order.getItems()) {
                    itemsText.append("- ")
                             .append(item.getName())
                             .append(" (Qty: ")
                             .append(item.getQuantity())
                             .append(") @ ₹")
                             .append(String.format("%.2f", item.getPrice()))
                             .append("\n");
                }
            }
            
            String subject = "Order Confirmation - ELECTRONCE Grid";
            String cancelUrl = frontendUrl + "/cancel-purchase?orderId=" + savedOrder.getId();
            
            String body = "Greetings " + order.getFullName() + ",\n\n" +
                    "We have successfully received and queued your order on the ELECTRONCE Grid!\n\n" +
                    "Order Reference Code: " + savedOrder.getId() + "\n" +
                    "Date of Transaction: " + savedOrder.getOrderDate().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")) + "\n" +
                    "Total Price Assessment: ₹" + String.format("%.2f", savedOrder.getTotalPrice()) + "\n\n" +
                    "Acquired Components:\n" +
                    itemsText.toString() + "\n" +
                    "Shipping Destination Coordinates:\n" +
                    order.getAddress() + ", " + order.getArea() + " - " + order.getPincode() + "\n" +
                    "Contact Phone: " + order.getPhone() + "\n\n" +
                    "--------------------------------------------------\n" +
                    "CRITICAL OPTION: If you did not make this purchase, or if you wish to cancel this transaction, please access your grid controls immediately by clicking the link below:\n" +
                    cancelUrl + "\n\n" +
                    "On the cancellation portal, you can safely authorize the cancellation of this purchase.\n" +
                    "--------------------------------------------------\n\n" +
                    "Thank you for choosing ELECTRONCE.";
            
            try {
                emailService.sendSimpleMessage(order.getUserEmail(), subject, body);
            } catch (Exception e) {
                System.err.println("Order confirmation email failed for " + order.getUserEmail() + ": " + e.getMessage());
            }
            
            return ResponseEntity.ok(savedOrder);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("⛔ Order transaction failed: " + e.getMessage());
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getOrder(@PathVariable String id) {
        Optional<Order> opt = orderRepository.findById(id);
        if (opt.isPresent()) {
            return ResponseEntity.ok(opt.get());
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("⛔ Order not found in sector.");
    }

    @GetMapping("/user")
    public ResponseEntity<?> getUserOrders(@RequestParam String email) {
        try {
            java.util.List<Order> orders = orderRepository.findByUserEmail(email);
            // Sort orders by date descending (newest first)
            orders.sort((o1, o2) -> o2.getOrderDate().compareTo(o1.getOrderDate()));
            return ResponseEntity.ok(orders);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("⛔ Failed to retrieve orders: " + e.getMessage());
        }
    }

    @PostMapping("/cancel")
    public ResponseEntity<String> cancelOrder(@RequestParam String orderId) {
        Optional<Order> opt = orderRepository.findById(orderId);
        if (!opt.isPresent()) {
            return ResponseEntity.badRequest().body("⛔ Order ID not found in system.");
        }
        
        Order order = opt.get();
        if ("CANCELLED".equals(order.getStatus())) {
            return ResponseEntity.ok("✅ Order is already cancelled.");
        }
        
        order.setStatus("CANCELLED");
        orderRepository.save(order);
        
        try {
            String subject = "Order Cancellation Receipt - ELECTRONCE Grid";
            String body = "Dear " + order.getFullName() + ",\n\n" +
                    "This is a confirmation receipt that your purchase has been successfully CANCELLED upon your authorization request.\n\n" +
                    "Order Reference Code: " + order.getId() + "\n" +
                    "Total Price Refunded: ₹" + String.format("%.2f", order.getTotalPrice()) + "\n\n" +
                    "Any physical currency or credit authorization locks have been released.\n\n" +
                    "Thank you.";
            
            emailService.sendSimpleMessage(order.getUserEmail(), subject, body);
        } catch (Exception e) {
            System.err.println("Failed to send cancellation email: " + e.getMessage());
        }
        
        return ResponseEntity.ok("✅ Order successfully cancelled. Confirmation email has been sent.");
    }
}
