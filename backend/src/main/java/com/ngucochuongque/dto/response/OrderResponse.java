package com.ngucochuongque.dto.response;

import lombok.*;

import java.time.OffsetDateTime;
import java.util.List;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class OrderResponse {
    private Integer id;
    private String orderCode;
    private String status;
    private String customerName;
    private String customerPhone;
    private String customerEmail;
    private String address;
    private String city;
    private String district;
    private String deliveryMethod;
    private String paymentMethod;
    private Integer subtotal;
    private Integer shippingCost;
    private Integer totalAmount;
    private Integer userId;
    private List<OrderItemResponse> items;
    private OffsetDateTime createdAt;

    @Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
    public static class OrderItemResponse {
        private String productName;
        private Integer quantity;
        private Integer priceAtPurchase;
    }
}
