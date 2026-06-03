package com.example.ecommercebackend.controller;

import com.example.ecommercebackend.model.Wishlist;
import com.example.ecommercebackend.repository.WishlistRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth/wishlist")
public class WishlistController {

    @Autowired
    private WishlistRepository wishlistRepository;

    @GetMapping
    public ResponseEntity<?> getWishlist(@RequestParam String email) {
        Optional<Wishlist> opt = wishlistRepository.findByUserEmail(email);
        if (opt.isPresent()) {
            return ResponseEntity.ok(opt.get());
        } else {
            // Return empty wishlist if none exists
            return ResponseEntity.ok(new Wishlist(email, new java.util.ArrayList<>()));
        }
    }

    @PostMapping("/sync")
    public ResponseEntity<?> syncWishlist(@RequestBody Wishlist payload) {
        Optional<Wishlist> opt = wishlistRepository.findByUserEmail(payload.getUserEmail());
        Wishlist wishlist;
        if (opt.isPresent()) {
            wishlist = opt.get();
            wishlist.setItems(payload.getItems());
        } else {
            wishlist = new Wishlist(payload.getUserEmail(), payload.getItems());
        }
        Wishlist saved = wishlistRepository.save(wishlist);
        return ResponseEntity.ok(saved);
    }
}
