package com.example.ecommercebackend.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;
import java.util.List;

@Document(collection = "orders")
public class Order {
    @Id
    private String id;
    
    private String userEmail;
    private String fullName;
    private String address;
    private String area;
    private String pincode;
    private String phone;
    private String paymentMethod;
    private double totalPrice;
    private LocalDateTime orderDate;
    private String status; // "PENDING", "CANCELLED", "COMPLETED"
    private List<OrderItem> items;

    public Order() {}

    public Order(String userEmail, String fullName, String address, String area, String pincode, String phone, String paymentMethod, double totalPrice, List<OrderItem> items) {
        this.userEmail = userEmail;
        this.fullName = fullName;
        this.address = address;
        this.area = area;
        this.pincode = pincode;
        this.phone = phone;
        this.paymentMethod = paymentMethod;
        this.totalPrice = totalPrice;
        this.items = items;
        this.orderDate = LocalDateTime.now();
        this.status = "PENDING";
    }

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getUserEmail() { return userEmail; }
    public void setUserEmail(String userEmail) { this.userEmail = userEmail; }
    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }
    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }
    public String getArea() { return area; }
    public void setArea(String area) { this.area = area; }
    public String getPincode() { return pincode; }
    public void setPincode(String pincode) { this.pincode = pincode; }
    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }
    public String getPaymentMethod() { return paymentMethod; }
    public void setPaymentMethod(String paymentMethod) { this.paymentMethod = paymentMethod; }
    public double getTotalPrice() { return totalPrice; }
    public void setTotalPrice(double totalPrice) { this.totalPrice = totalPrice; }
    public LocalDateTime getOrderDate() { return orderDate; }
    public void setOrderDate(LocalDateTime orderDate) { this.orderDate = orderDate; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public List<OrderItem> getItems() { return items; }
    public void setItems(List<OrderItem> items) { this.items = items; }
}
