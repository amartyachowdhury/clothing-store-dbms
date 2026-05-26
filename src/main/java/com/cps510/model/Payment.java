package com.cps510.model;

import java.math.BigDecimal;
import java.util.Date;

/**
 * Model class representing a Payment entity.
 * Maps to the Payment table in the database.
 * Contains payment information including method, amount, status, and reference to order.
 * Also includes display fields (orderDate, customerName) from joined tables for UI purposes.
 * 
 * @author CPS510 Team
 * @version 1.0
 */
public class Payment {
    private Long paymentId;
    private Long orderId;
    private String paymentMethod;
    private BigDecimal paymentAmount;
    private String paymentStatus;
    private Date orderDate; // From join
    private String customerName; // From join

    public Payment() {
    }

    public Payment(Long paymentId, Long orderId, String paymentMethod, BigDecimal paymentAmount, String paymentStatus) {
        this.paymentId = paymentId;
        this.orderId = orderId;
        this.paymentMethod = paymentMethod;
        this.paymentAmount = paymentAmount;
        this.paymentStatus = paymentStatus;
    }

    public Long getPaymentId() {
        return paymentId;
    }

    public void setPaymentId(Long paymentId) {
        this.paymentId = paymentId;
    }

    public Long getOrderId() {
        return orderId;
    }

    public void setOrderId(Long orderId) {
        this.orderId = orderId;
    }

    public String getPaymentMethod() {
        return paymentMethod;
    }

    public void setPaymentMethod(String paymentMethod) {
        this.paymentMethod = paymentMethod;
    }

    public BigDecimal getPaymentAmount() {
        return paymentAmount;
    }

    public void setPaymentAmount(BigDecimal paymentAmount) {
        this.paymentAmount = paymentAmount;
    }

    public String getPaymentStatus() {
        return paymentStatus;
    }

    public void setPaymentStatus(String paymentStatus) {
        this.paymentStatus = paymentStatus;
    }

    public Date getOrderDate() {
        return orderDate;
    }

    public void setOrderDate(Date orderDate) {
        this.orderDate = orderDate;
    }

    public String getCustomerName() {
        return customerName;
    }

    public void setCustomerName(String customerName) {
        this.customerName = customerName;
    }
}

