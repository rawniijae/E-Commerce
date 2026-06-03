package com.example.ecommercebackend.repository;

import com.example.ecommercebackend.model.Wishlist;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.Optional;

public interface WishlistRepository extends MongoRepository<Wishlist, String> {
    Optional<Wishlist> findByUserEmail(String userEmail);
}
