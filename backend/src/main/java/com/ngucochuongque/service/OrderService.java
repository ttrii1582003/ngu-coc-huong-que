package com.ngucochuongque.service;

import com.ngucochuongque.dto.request.CreateOrderRequest;
import com.ngucochuongque.dto.request.OrderItemRequest;
import com.ngucochuongque.dto.response.OrderResponse;
import com.ngucochuongque.entity.Order;
import com.ngucochuongque.entity.OrderItem;
import com.ngucochuongque.entity.Product;
import com.ngucochuongque.exception.ResourceNotFoundException;
import com.ngucochuongque.repository.OrderRepository;
import com.ngucochuongque.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class OrderService {

    private static final int FREE_SHIPPING_THRESHOLD = 300_000;
    private static final int STANDARD_SHIPPING       = 30_000;
    private static final int EXPRESS_SHIPPING        = 45_000;

    private final OrderRepository   orderRepository;
    private final ProductRepository productRepository;

    @Transactional
    public OrderResponse createOrder(CreateOrderRequest req) {
        // 1. Lấy products từ DB và tính subtotal (không tin số từ client)
        List<OrderItemRequest> itemReqs = req.getItems();
        int subtotal = 0;

        Order order = new Order();
        order.setOrderCode(generateOrderCode());
        order.setCustomerName(req.getCustomerName());
        order.setCustomerPhone(req.getCustomerPhone().replaceAll("\\s", ""));
        order.setCustomerEmail(req.getCustomerEmail());
        order.setAddress(req.getAddress());
        order.setCity(req.getCity());
        order.setDistrict(req.getDistrict());
        order.setDeliveryMethod(req.getDeliveryMethod());
        order.setPaymentMethod(req.getPaymentMethod());
        order.setStatus("pending");

        for (OrderItemRequest itemReq : itemReqs) {
            Product product = productRepository.findById(itemReq.getProductId())
                    .orElseThrow(() -> new ResourceNotFoundException(
                            "Sản phẩm không tồn tại: " + itemReq.getProductId()));

            OrderItem item = new OrderItem();
            item.setOrder(order);
            item.setProduct(product);
            item.setQuantity(itemReq.getQuantity());
            item.setPriceAtPurchase(product.getPrice());
            item.setProductName(product.getName());

            subtotal += product.getPrice() * itemReq.getQuantity();
            order.getItems().add(item);
        }

        // 2. Tính phí ship
        int shippingCost = calcShipping(req.getDeliveryMethod(), subtotal);
        order.setSubtotal(subtotal);
        order.setShippingCost(shippingCost);
        order.setTotalAmount(subtotal + shippingCost);

        orderRepository.save(order);

        return toResponse(order);
    }

    @Transactional(readOnly = true)
    public OrderResponse findByCode(String orderCode) {
        Order order = orderRepository.findByOrderCode(orderCode)
                .orElseThrow(() -> new ResourceNotFoundException("Đơn hàng không tồn tại: " + orderCode));
        return toResponse(order);
    }

    private int calcShipping(String method, int subtotal) {
        if ("express".equals(method)) return EXPRESS_SHIPPING;
        return subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : STANDARD_SHIPPING;
    }

    private String generateOrderCode() {
        String code;
        do {
            code = "HQ" + UUID.randomUUID().toString()
                    .replace("-", "")
                    .substring(0, 8)
                    .toUpperCase();
        } while (orderRepository.existsByOrderCode(code));
        return code;
    }

    private OrderResponse toResponse(Order order) {
        List<OrderResponse.OrderItemResponse> items = order.getItems().stream()
                .map(i -> OrderResponse.OrderItemResponse.builder()
                        .productName(i.getProductName())
                        .quantity(i.getQuantity())
                        .priceAtPurchase(i.getPriceAtPurchase())
                        .build())
                .toList();

        return OrderResponse.builder()
                .orderCode(order.getOrderCode())
                .status(order.getStatus())
                .customerName(order.getCustomerName())
                .customerPhone(order.getCustomerPhone())
                .city(order.getCity())
                .deliveryMethod(order.getDeliveryMethod())
                .paymentMethod(order.getPaymentMethod())
                .subtotal(order.getSubtotal())
                .shippingCost(order.getShippingCost())
                .totalAmount(order.getTotalAmount())
                .items(items)
                .createdAt(order.getCreatedAt())
                .build();
    }
}
