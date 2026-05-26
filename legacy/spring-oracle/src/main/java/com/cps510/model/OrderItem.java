package com.cps510.model;

import java.math.BigDecimal;

/**
 * Model class representing an OrderItem entity (bridge table).
 * Maps to the OrderItem table in the database.
 * Represents a line item in an order, linking orders to products with quantity and unit price.
 * Also includes display fields from joined tables (productName, productBrand, categoryName) for UI purposes.
 * Contains a calculated lineTotal field (itemQty * unitPrice).
 * 
 * @author CPS510 Team
 * @version 1.0
 */
public class OrderItem {
    private Long orderId;
    private Long productId;
    private Integer itemQty;
    private BigDecimal unitPrice;
    private String productName; // From join
    private String productBrand; // From join
    private String categoryName; // From join
    private BigDecimal lineTotal; // Calculated: itemQty * unitPrice

    public OrderItem() {
    }

    public OrderItem(Long orderId, Long productId, Integer itemQty, BigDecimal unitPrice) {
        this.orderId = orderId;
        this.productId = productId;
        this.itemQty = itemQty;
        this.unitPrice = unitPrice;
    }

    public Long getOrderId() {
        return orderId;
    }

    public void setOrderId(Long orderId) {
        this.orderId = orderId;
    }

    public Long getProductId() {
        return productId;
    }

    public void setProductId(Long productId) {
        this.productId = productId;
    }

    public Integer getItemQty() {
        return itemQty;
    }

    public void setItemQty(Integer itemQty) {
        this.itemQty = itemQty;
    }

    public BigDecimal getUnitPrice() {
        return unitPrice;
    }

    public void setUnitPrice(BigDecimal unitPrice) {
        this.unitPrice = unitPrice;
    }

    public String getProductName() {
        return productName;
    }

    public void setProductName(String productName) {
        this.productName = productName;
    }

    public String getProductBrand() {
        return productBrand;
    }

    public void setProductBrand(String productBrand) {
        this.productBrand = productBrand;
    }

    public String getCategoryName() {
        return categoryName;
    }

    public void setCategoryName(String categoryName) {
        this.categoryName = categoryName;
    }

    public BigDecimal getLineTotal() {
        if (itemQty != null && unitPrice != null) {
            return unitPrice.multiply(new BigDecimal(itemQty));
        }
        return lineTotal;
    }

    public void setLineTotal(BigDecimal lineTotal) {
        this.lineTotal = lineTotal;
    }
}

