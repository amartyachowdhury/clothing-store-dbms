package com.cps510.model;

import java.math.BigDecimal;

/**
 * Model class representing a Product entity.
 * Maps to the Product table in the database.
 * Contains product information including name, size, color, brand, price, and stock quantity.
 * 
 * @author CPS510 Team
 * @version 1.0
 */
public class Product {
    private Long productId;
    private String productName;
    private String productSize;
    private String productColour;
    private String productBrand;
    private BigDecimal productPrice;
    private Integer productStockQty;
    private Long categoryId;
    private String categoryName; // For display purposes

    public Product() {
    }

    public Product(Long productId, String productName, String productSize, String productColour, 
                   String productBrand, BigDecimal productPrice, Integer productStockQty, Long categoryId) {
        this.productId = productId;
        this.productName = productName;
        this.productSize = productSize;
        this.productColour = productColour;
        this.productBrand = productBrand;
        this.productPrice = productPrice;
        this.productStockQty = productStockQty;
        this.categoryId = categoryId;
    }

    public Long getProductId() {
        return productId;
    }

    public void setProductId(Long productId) {
        this.productId = productId;
    }

    public String getProductName() {
        return productName;
    }

    public void setProductName(String productName) {
        this.productName = productName;
    }

    public String getProductSize() {
        return productSize;
    }

    public void setProductSize(String productSize) {
        this.productSize = productSize;
    }

    public String getProductColour() {
        return productColour;
    }

    public void setProductColour(String productColour) {
        this.productColour = productColour;
    }

    public String getProductBrand() {
        return productBrand;
    }

    public void setProductBrand(String productBrand) {
        this.productBrand = productBrand;
    }

    public BigDecimal getProductPrice() {
        return productPrice;
    }

    public void setProductPrice(BigDecimal productPrice) {
        this.productPrice = productPrice;
    }

    public Integer getProductStockQty() {
        return productStockQty;
    }

    public void setProductStockQty(Integer productStockQty) {
        this.productStockQty = productStockQty;
    }

    public Long getCategoryId() {
        return categoryId;
    }

    public void setCategoryId(Long categoryId) {
        this.categoryId = categoryId;
    }

    public String getCategoryName() {
        return categoryName;
    }

    public void setCategoryName(String categoryName) {
        this.categoryName = categoryName;
    }
}

