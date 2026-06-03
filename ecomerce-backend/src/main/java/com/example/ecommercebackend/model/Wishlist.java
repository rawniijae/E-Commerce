package com.example.ecommercebackend.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.util.List;

@Document(collection = "wishlists")
public class Wishlist {
    @Id
    private String id;
    private String userEmail;
    private List<Product> items;

    public Wishlist() {}

    public Wishlist(String userEmail, List<Product> items) {
        this.userEmail = userEmail;
        this.items = items;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    
    public String getUserEmail() { return userEmail; }
    public void setUserEmail(String userEmail) { this.userEmail = userEmail; }
    
    public List<Product> getItems() { return items; }
    public void setItems(List<Product> items) { this.items = items; }
}
