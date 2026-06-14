package com.ngucochuongque.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "product_benefits")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class ProductBenefit {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @Column(nullable = false)
    private String benefit;

    @Column(name = "sort_order", nullable = false)
    private Integer sortOrder = 0;
}
