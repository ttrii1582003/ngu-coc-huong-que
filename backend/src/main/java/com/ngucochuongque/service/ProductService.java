package com.ngucochuongque.service;

import com.ngucochuongque.dto.request.CreateProductRequest;
import com.ngucochuongque.dto.response.ProductResponse;
import com.ngucochuongque.entity.Category;
import com.ngucochuongque.entity.Product;
import com.ngucochuongque.entity.ProductBenefit;
import com.ngucochuongque.exception.ResourceNotFoundException;
import com.ngucochuongque.repository.CategoryRepository;
import com.ngucochuongque.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ProductService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;

    public List<ProductResponse> findAll(String category, String search) {
        List<Product> products;

        boolean hasCategory = category != null && !category.isBlank();
        boolean hasSearch   = search   != null && !search.isBlank();

        if (hasCategory && hasSearch) {
            products = productRepository.findByCategoryIdAndNameContaining(category, search);
        } else if (hasCategory) {
            products = productRepository.findByCategoryId(category);
        } else if (hasSearch) {
            products = productRepository.searchByName(search);
        } else {
            products = productRepository.findAllActive();
        }

        return products.stream().map(this::toResponse).toList();
    }

    public ProductResponse findById(Integer id) {
        Product p = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Sản phẩm không tồn tại: " + id));
        return toResponse(p);
    }

    @Transactional
    public ProductResponse create(CreateProductRequest req) {
        Category cat = categoryRepository.findById(req.getCategoryId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Danh mục không tồn tại"));
        Product p = new Product();
        applyRequest(p, req, cat);
        productRepository.save(p);
        return toResponse(p);
    }

    @Transactional
    public ProductResponse update(Integer id, CreateProductRequest req) {
        Product p = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Sản phẩm không tồn tại: " + id));
        Category cat = categoryRepository.findById(req.getCategoryId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Danh mục không tồn tại"));
        p.getBenefits().clear();
        applyRequest(p, req, cat);
        productRepository.save(p);
        return toResponse(p);
    }

    @Transactional
    public void delete(Integer id) {
        Product p = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Sản phẩm không tồn tại: " + id));
        p.setIsActive(false);
        productRepository.save(p);
    }

    private void applyRequest(Product p, CreateProductRequest req, Category cat) {
        p.setName(req.getName());
        p.setCategory(cat);
        p.setPrice(req.getPrice());
        p.setOriginalPrice(req.getOriginalPrice());
        p.setWeight(req.getWeight());
        p.setDescription(req.getDescription());
        p.setBgColor(req.getBgColor());
        p.setAccentColor(req.getAccentColor());
        p.setBadge(req.getBadge());
        p.setBadgeType(req.getBadgeType());
        p.setImageUrl(req.getImageUrl());
        if (req.getStockQuantity() != null) p.setStockQuantity(req.getStockQuantity());
        if (p.getIsActive() == null) p.setIsActive(true);
        if (p.getRating() == null) p.setRating(BigDecimal.valueOf(5.0));
        if (p.getReviews() == null) p.setReviews(0);
        List<String> benefits = req.getBenefits();
        if (benefits != null) {
            for (int i = 0; i < benefits.size(); i++) {
                ProductBenefit b = new ProductBenefit();
                b.setProduct(p);
                b.setBenefit(benefits.get(i));
                b.setSortOrder(i);
                p.getBenefits().add(b);
            }
        }
    }

    private ProductResponse toResponse(Product p) {
        List<String> benefits = p.getBenefits().stream()
                .map(b -> b.getBenefit())
                .toList();

        return ProductResponse.builder()
                .id(p.getId())
                .name(p.getName())
                .category(p.getCategory().getId())
                .price(p.getPrice())
                .originalPrice(p.getOriginalPrice())
                .weight(p.getWeight())
                .rating(p.getRating())
                .reviews(p.getReviews())
                .badge(p.getBadge())
                .badgeType(p.getBadgeType())
                .description(p.getDescription())
                .benefits(benefits)
                .bgColor(p.getBgColor())
                .accentColor(p.getAccentColor())
                .imageUrl(p.getImageUrl())
                .stockQuantity(p.getStockQuantity())
                .build();
    }
}
