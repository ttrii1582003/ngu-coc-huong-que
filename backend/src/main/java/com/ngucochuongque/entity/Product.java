package com.ngucochuongque.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "products")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false)
    private String name;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id", nullable = false)
    private Category category;

    @Column(nullable = false)
    private Integer price;

    @Column(name = "original_price")
    private Integer originalPrice;

    @Column(nullable = false, length = 20)
    private String weight;

    @Column(nullable = false, precision = 3, scale = 1)
    private BigDecimal rating;

    @Column(nullable = false)
    private Integer reviews = 0;

    @Column(length = 50)
    private String badge;

    @Column(name = "badge_type", length = 20)
    private String badgeType;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String description;

    @Column(name = "bg_color", nullable = false, length = 10)
    private String bgColor;

    @Column(name = "accent_color", nullable = false, length = 10)
    private String accentColor;

    @Column(name = "image_url", length = 500)
    private String imageUrl;

    @Column(name = "stock_quantity", nullable = false)
    private Integer stockQuantity = 0;

    @Column(name = "is_active", nullable = false)
    private Boolean isActive = true;

    @Column(name = "created_at")
    private OffsetDateTime createdAt;

    @Column(name = "updated_at")
    private OffsetDateTime updatedAt;

    @OneToMany(mappedBy = "product", fetch = FetchType.LAZY,
               cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("sortOrder ASC")
    private List<ProductBenefit> benefits = new ArrayList<>();

    @PrePersist
    void onCreate() {
        createdAt = updatedAt = OffsetDateTime.now();
    }

    @PreUpdate
    void onUpdate() {
        updatedAt = OffsetDateTime.now();
    }
}
