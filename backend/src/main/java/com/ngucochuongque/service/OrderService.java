package com.ngucochuongque.service;

import com.ngucochuongque.dto.request.CreateOrderRequest;
import com.ngucochuongque.dto.request.OrderItemRequest;
import com.ngucochuongque.dto.response.OrderResponse;
import com.ngucochuongque.dto.response.RevenuePointResponse;
import com.ngucochuongque.entity.Order;
import com.ngucochuongque.entity.OrderItem;
import com.ngucochuongque.entity.Product;
import com.ngucochuongque.exception.ResourceNotFoundException;
import com.ngucochuongque.repository.OrderRepository;
import com.ngucochuongque.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.time.ZoneId;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class OrderService {

    private static final int CENTRAL_STANDARD  = 20_000;
    private static final int CENTRAL_EXPRESS   = 35_000;
    private static final int CENTRAL_FREE      = 300_000;
    private static final int OTHER_STANDARD    = 30_000;
    private static final int OTHER_EXPRESS     = 55_000;
    private static final int OTHER_FREE        = 500_000;

    private static final java.util.Map<String, String> ZONE_MAP = java.util.Map.ofEntries(
        // Miền Trung (cửa hàng)
        java.util.Map.entry("Đà Nẵng",           "central"),  // + Quảng Nam cũ
        java.util.Map.entry("Huế",               "central"),  // Thừa Thiên Huế → Huế
        java.util.Map.entry("Quảng Ngãi",        "central"),  // + Kon Tum cũ
        java.util.Map.entry("Khánh Hòa",         "central"),  // + Phú Yên cũ
        java.util.Map.entry("Gia Lai",           "central"),  // + Bình Định cũ
        java.util.Map.entry("Đắk Lắk",          "central"),  // + Đắk Nông cũ
        java.util.Map.entry("Lâm Đồng",          "central"),  // + Ninh Thuận + Bình Thuận cũ
        // Miền Bắc
        java.util.Map.entry("Hà Nội",            "north"),
        java.util.Map.entry("Hải Phòng",         "north"),    // + Hải Dương cũ
        java.util.Map.entry("Quảng Ninh",        "north"),
        java.util.Map.entry("Nghệ An",           "north"),
        java.util.Map.entry("Thanh Hóa",         "north"),
        // Miền Nam
        java.util.Map.entry("TP. Hồ Chí Minh",  "south"),    // + Bình Dương + Bà Rịa-VT cũ
        java.util.Map.entry("Cần Thơ",           "south"),    // + Hậu Giang + Sóc Trăng cũ
        java.util.Map.entry("An Giang",          "south"),
        java.util.Map.entry("Đồng Nai",          "south"),    // + Bình Phước cũ
        java.util.Map.entry("Tây Ninh",          "south"),    // + Long An cũ
        java.util.Map.entry("Đồng Tháp",         "south"),    // + Tiền Giang cũ
        java.util.Map.entry("Vĩnh Long",         "south"),    // + Bến Tre + Trà Vinh cũ
        java.util.Map.entry("Cà Mau",            "south"),    // + Bạc Liêu cũ
        // Miền Bắc – các tỉnh mở rộng
        java.util.Map.entry("Tuyên Quang",       "north"),    // + Hà Giang cũ
        java.util.Map.entry("Lào Cai",           "north"),    // + Yên Bái cũ
        java.util.Map.entry("Thái Nguyên",       "north"),    // + Bắc Kạn cũ
        java.util.Map.entry("Phú Thọ",           "north"),    // + Vĩnh Phúc + Hòa Bình cũ
        java.util.Map.entry("Bắc Ninh",          "north"),    // + Bắc Giang cũ
        java.util.Map.entry("Hưng Yên",          "north"),    // + Thái Bình cũ
        java.util.Map.entry("Ninh Bình",         "north"),    // + Hà Nam + Nam Định cũ
        java.util.Map.entry("Quảng Trị",         "north"),    // + Quảng Bình cũ
        java.util.Map.entry("Hà Tĩnh",           "north"),
        java.util.Map.entry("Sơn La",            "north"),
        java.util.Map.entry("Cao Bằng",          "north"),
        java.util.Map.entry("Điện Biên",         "north"),
        java.util.Map.entry("Lai Châu",          "north"),
        java.util.Map.entry("Lạng Sơn",          "north")
    );

    private final OrderRepository   orderRepository;
    private final ProductRepository productRepository;

    @Transactional
    public OrderResponse createOrder(CreateOrderRequest req, Integer userId) {
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
        order.setUserId(userId);

        for (OrderItemRequest itemReq : itemReqs) {
            Product product = productRepository.findById(itemReq.getProductId())
                    .orElseThrow(() -> new ResourceNotFoundException(
                            "Sản phẩm không tồn tại: " + itemReq.getProductId()));

            if (Boolean.FALSE.equals(product.getIsActive())) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                        "Sản phẩm '" + product.getName() + "' hiện không còn bán");
            }
            if (product.getStockQuantity() < itemReq.getQuantity()) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                        "Sản phẩm '" + product.getName() + "' chỉ còn " + product.getStockQuantity() + " sản phẩm");
            }
            product.setStockQuantity(product.getStockQuantity() - itemReq.getQuantity());
            productRepository.save(product);

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
        int shippingCost = calcShipping(req.getDeliveryMethod(), subtotal, req.getCity());
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

    @Transactional(readOnly = true)
    public List<OrderResponse> findMyOrders(Integer userId) {
        return orderRepository.findByUserIdOrderByCreatedAtDesc(userId)
                .stream().map(this::toResponse).toList();
    }

    private int calcShipping(String method, int subtotal, String city) {
        String zone = ZONE_MAP.getOrDefault(city != null ? city : "", "other");
        boolean isCentral = "central".equals(zone);
        int freeThreshold = isCentral ? CENTRAL_FREE : OTHER_FREE;
        if ("express".equals(method)) return isCentral ? CENTRAL_EXPRESS : OTHER_EXPRESS;
        return subtotal >= freeThreshold ? 0 : (isCentral ? CENTRAL_STANDARD : OTHER_STANDARD);
    }

    @Transactional(readOnly = true)
    public Map<String, Long> getStats() {
        ZoneId tz = ZoneId.of("Asia/Ho_Chi_Minh");
        OffsetDateTime todayStart = java.time.LocalDate.now(tz)
                .atStartOfDay(tz).toOffsetDateTime();
        OffsetDateTime todayEnd = todayStart.plusDays(1);
        OffsetDateTime monthStart = java.time.LocalDate.now(tz).withDayOfMonth(1)
                .atStartOfDay(tz).toOffsetDateTime();
        return Map.of(
            "ordersToday",   orderRepository.countActiveOrdersInRange(todayStart, todayEnd),
            "revenueToday",  orderRepository.sumRevenueInRange(todayStart, todayEnd),
            "pendingCount",  orderRepository.countByStatus("pending"),
            "revenueMonth",  orderRepository.sumRevenueInRange(monthStart, todayEnd)
        );
    }

    @Transactional(readOnly = true)
    public List<RevenuePointResponse> getRevenueSeries(String groupBy, LocalDate from, LocalDate to) {
        ZoneId tz = ZoneId.of("Asia/Ho_Chi_Minh");
        OffsetDateTime start = from.atStartOfDay(tz).toOffsetDateTime();
        OffsetDateTime end   = to.plusDays(1).atStartOfDay(tz).toOffsetDateTime();
        List<Object[]> rows = "month".equals(groupBy)
                ? orderRepository.findMonthlyRevenue(start, end)
                : orderRepository.findDailyRevenue(start, end);
        return rows.stream().map(r -> RevenuePointResponse.builder()
                .period(r[0].toString())
                .orderCount(((Number) r[1]).longValue())
                .revenue(((Number) r[2]).longValue())
                .build()).toList();
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

    @Transactional(readOnly = true)
    public List<OrderResponse> findAllOrders(String status) {
        List<Order> orders = (status != null && !status.isBlank())
                ? orderRepository.findByStatusOrderByCreatedAtDesc(status)
                : orderRepository.findAllByOrderByCreatedAtDesc();
        return orders.stream().map(this::toResponse).toList();
    }

    @Transactional
    public OrderResponse updateStatus(Integer id, String status) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Đơn hàng không tồn tại: " + id));
        String prevStatus = order.getStatus();
        order.setStatus(status);
        // Hoàn stock khi chuyển sang cancelled (chỉ hoàn 1 lần)
        if ("cancelled".equals(status) && !"cancelled".equals(prevStatus)) {
            for (OrderItem item : order.getItems()) {
                Product product = item.getProduct();
                if (product != null) {
                    product.setStockQuantity(product.getStockQuantity() + item.getQuantity());
                    productRepository.save(product);
                }
            }
        }
        return toResponse(orderRepository.save(order));
    }

    @Transactional
    public OrderResponse cancelByCustomer(String orderCode, Integer userId) {
        Order order = orderRepository.findByOrderCode(orderCode)
                .orElseThrow(() -> new ResourceNotFoundException("Đơn hàng không tồn tại: " + orderCode));
        if (!order.getUserId().equals(userId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Không có quyền hủy đơn này");
        }
        if (!"pending".equals(order.getStatus())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "Chỉ có thể hủy đơn hàng đang chờ xác nhận");
        }
        order.setStatus("cancelled");
        for (OrderItem item : order.getItems()) {
            Product product = item.getProduct();
            if (product != null) {
                product.setStockQuantity(product.getStockQuantity() + item.getQuantity());
                productRepository.save(product);
            }
        }
        return toResponse(orderRepository.save(order));
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
                .id(order.getId())
                .orderCode(order.getOrderCode())
                .status(order.getStatus())
                .customerName(order.getCustomerName())
                .customerPhone(order.getCustomerPhone())
                .customerEmail(order.getCustomerEmail())
                .address(order.getAddress())
                .city(order.getCity())
                .district(order.getDistrict())
                .deliveryMethod(order.getDeliveryMethod())
                .paymentMethod(order.getPaymentMethod())
                .subtotal(order.getSubtotal())
                .shippingCost(order.getShippingCost())
                .totalAmount(order.getTotalAmount())
                .userId(order.getUserId())
                .items(items)
                .createdAt(order.getCreatedAt())
                .build();
    }
}
