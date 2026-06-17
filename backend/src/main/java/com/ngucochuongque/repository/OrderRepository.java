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
        "SELECT COUNT(o) FROM Order o WHERE o.createdAt >= :start AND o.createdAt < :end")
    long countOrdersInRange(
        @org.springframework.data.repository.query.Param("start") java.time.OffsetDateTime start,
        @org.springframework.data.repository.query.Param("end")   java.time.OffsetDateTime end);

    @org.springframework.data.jpa.repository.Query(
        "SELECT COALESCE(SUM(o.totalAmount), 0) FROM Order o WHERE o.createdAt >= :start AND o.createdAt < :end AND o.status <> 'cancelled'")
    long sumRevenueInRange(
        @org.springframework.data.repository.query.Param("start") java.time.OffsetDateTime start,
        @org.springframework.data.repository.query.Param("end")   java.time.OffsetDateTime end);
}
