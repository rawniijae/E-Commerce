package com.example.ecommercebackend.config;

import com.example.ecommercebackend.model.Product;
import com.example.ecommercebackend.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private ProductRepository productRepository;

    @Override
    public void run(String... args) throws Exception {
        List<Product> defaultProducts = Arrays.asList(
            new Product("Apple iPhone 15 Pro Max", 124999.0, "MOBILE", "/images/iphone_15_pro.png"),
            new Product("Samsung Galaxy S24 Ultra", 119999.0, "MOBILE", "/images/galaxy_s24_ultra.png"),
            new Product("Apple Watch Series 9", 41999.0, "WEARABLE", "/images/apple_watch_9.png"),
            new Product("Apple Watch Ultra 2", 89999.0, "WEARABLE", "/images/apple_watch_ultra.png"),
            new Product("iPad Air M2 11-inch", 59999.0, "TABLET", "/images/ipad_air_m2.png"),
            new Product("JBL Charge 5 Bluetooth Speaker", 14999.0, "AUDIO", "/images/jbl_charge_5.png"),
            new Product("Meta Quest 3 VR Headset", 49999.0, "VR", "/images/meta_quest_3.png"),
            new Product("Nintendo Switch OLED", 32999.0, "CONSOLE", "/images/nintendo_switch_oled.png"),
            new Product("Samsung 55-inch 4K Smart TV", 64999.0, "TV", "/images/samsung_tv.png"),
            new Product("Microsoft Xbox Series X", 49999.0, "CONSOLE", "/images/xbox_series_x.png"),
            new Product("Sony WH-1000XM5 Headphones", 29999.0, "AUDIO", "/images/sony_headphones.png"),
            new Product("Apple MacBook Air M3", 114999.0, "LAPTOP", "/images/macbook_air_m3.png")
        );

        List<Product> existingProducts = productRepository.findAll();
        List<String> existingNames = existingProducts.stream().map(Product::getName).collect(Collectors.toList());

        List<Product> missingProducts = defaultProducts.stream()
                .filter(p -> !existingNames.contains(p.getName()))
                .collect(Collectors.toList());

        if (!missingProducts.isEmpty()) {
            productRepository.saveAll(missingProducts);
            System.out.println("Cloud database updated with " + missingProducts.size() + " new default products!");
        }
    }
}
