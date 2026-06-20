package com.ngucochuongque.repository;

import com.ngucochuongque.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface OrderRepository extends JpaRepository<Order, Integer> {

    Optional<Order> findByOrderCode(String orderCode);

    boolean existsByOrderCode(String orderCode);

    List<Order> findByUserIdOrderByCreatedAtDesc(Integer userId);

    List<Order> findAllByOrderByCreatedAtDesc();

    List<Order> findByStatusOrderByCreatedAtDesc(String status);

    long countByStatus(String status);

    @org.springframework.data.jpa.repository.Query(
        "SELECT COUNT(o) FROM Order o WHERE o.createdAt >= :start AND o.createdAt < :end AND o.status <> 'cancelled'")
    long countActiveOrdersInRange(
        @org.springframework.data.repository.query.Param("start") java.time.OffsetDateTime start,
        @org.springframework.data.repository.query.Param("end")   java.time.OffsetDateTime end);

    @org.springframework.data.jpa.repository.Query(
        "SELECT COALESCE(SUM(o.totalAmount), 0) FROM Order o WHERE o.createdAt >= :start AND o.createdAt < :end AND o.status = 'delivered'")
    long sumRevenueInRange(
        @org.springframework.data.repository.query.Param("start") java.time.OffsetDateTime start,
        @org.springframework.data.repository.query.Param("end")   java.time.OffsetDateTime end);

    @org.springframework.data.jpa.repository.Query(value = """
        SELECT DATE(created_at AT TIME ZONE 'Asia/Ho_Chi_Minh') AS period,
               COUNT(*) AS order_count,
               COALESCE(SUM(total_amount), 0) AS revenue
        FROM orders
        WHERE created_at >= :start AND created_at < :end
          AND status = 'delivered'
        GROUP BY 1 ORDER BY 1
        """, nativeQuery = true)
    java.util.List<Object[]> findDailyRevenue(
        @org.springframework.data.repository.query.Param("start") java.time.OffsetDateTime start,
        @org.springframework.data.repository.query.Param("end")   java.time.OffsetDateTime end);

    @org.springframework.data.jpa.repository.Query(value = """
        SELECT TO_CHAR(created_at AT TIME ZONE 'Asia/Ho_Chi_Minh', 'YYYY-MM') AS period,
               COUNT(*) AS order_count,
               COALESCE(SUM(total_amount), 0) AS revenue
        FROM orders
        WHERE created_at >= :start AND created_at < :end
          AND status = 'delivered'
        GROUP BY 1 ORDER BY 1
        """, nativeQuery = true)
    java.util.List<Object[]> findMonthlyRevenue(
        @org.springframework.data.repository.query.Param("start") java.time.OffsetDateTime start,
        @org.springframework.data.repository.query.Param("end")   java.time.OffsetDateTime end);
}
