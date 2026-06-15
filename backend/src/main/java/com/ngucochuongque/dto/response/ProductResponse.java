package com.ngucochuongque.dto.response;

import lombok.*;

import java.math.BigDecimal;
import java.util.List;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class ProductResponse {
    private Integer id;
    private String name;
    private String category;
    private Integer price;
    private Integer originalPrice;
    private String weight;
    private BigDecimal rating;
    private Integer reviews;
    private String badge;
    private String badgeType;
    private String description;
    private List<String> benefits;
    private String bgColor;
    private String accentColor;
    private String imageUrl;
}
