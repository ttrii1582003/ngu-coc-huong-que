package com.ngucochuongque.repository;

import com.ngucochuongque.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ProductRepository extends JpaRepository<Product, Integer> {

    @Query("SELECT p FROM Product p WHERE p.isActive = true ORDER BY p.id ASC")
    List<Product> findAllActive();

    @Query("SELECT p FROM Product p WHERE p.category.id = :cat AND p.isActive = true")
    List<Product> findByCategoryId(@Param("cat") String categoryId);

    @Query("SELECT p FROM Product p WHERE LOWER(p.name) LIKE LOWER(CONCAT('%', :q, '%')) AND p.isActive = true")
    List<Product> searchByName(@Param("q") String query);

    @Query("SELECT p FROM Product p WHERE p.category.id = :cat AND LOWER(p.name) LIKE LOWER(CONCAT('%', :q, '%')) AND p.isActive = true")
    List<Product> findByCategoryIdAndNameContaining(@Param("cat") String categoryId, @Param("q") String query);
}
