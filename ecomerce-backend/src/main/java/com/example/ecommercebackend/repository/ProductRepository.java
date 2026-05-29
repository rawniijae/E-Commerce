package com.example.ecommercebackend.repository;

import com.example.ecommercebackend.model.Product;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface ProductRepository extends MongoRepository<Product, String> {
}
