package com.cps510.model;

import java.math.BigDecimal;
import java.util.Date;

/**
 * Model class representing an Order entity.
 * Maps to the Order_ table in the database.
 * Contains order information including date, total amount, status, and references to customer and employee.
 * Also includes display fields (customerName, employeeName) for UI purposes.
 * 
 * @author CPS510 Team
 * @version 1.0
 */
public class Order {
    private Long orderId;
    private Date orderDate;
    private BigDecimal totalAmount;
    private String orderStatus;
    private Long customerId;
    private Long employeeId;
    private String customerName; // For display purposes
    private String employeeName; // For display purposes

    public Order() {
    }

    public Order(Long orderId, Date orderDate, BigDecimal totalAmount, String orderStatus, 
                 Long customerId, Long employeeId) {
        this.orderId = orderId;
        this.orderDate = orderDate;
        this.totalAmount = totalAmount;
        this.orderStatus = orderStatus;
        this.customerId = customerId;
        this.employeeId = employeeId;
    }

    public Long getOrderId() {
        return orderId;
    }

    public void setOrderId(Long orderId) {
        this.orderId = orderId;
    }

    public Date getOrderDate() {
        return orderDate;
    }

    public void setOrderDate(Date orderDate) {
        this.orderDate = orderDate;
    }

    public BigDecimal getTotalAmount() {
        return totalAmount;
    }

    public void setTotalAmount(BigDecimal totalAmount) {
        this.totalAmount = totalAmount;
    }

    public String getOrderStatus() {
        return orderStatus;
    }

    public void setOrderStatus(String orderStatus) {
        this.orderStatus = orderStatus;
    }

    public Long getCustomerId() {
        return customerId;
    }

    public void setCustomerId(Long customerId) {
        this.customerId = customerId;
    }

    public Long getEmployeeId() {
        return employeeId;
    }

    public void setEmployeeId(Long employeeId) {
        this.employeeId = employeeId;
    }

    public String getCustomerName() {
        return customerName;
    }

    public void setCustomerName(String customerName) {
        this.customerName = customerName;
    }

    public String getEmployeeName() {
        return employeeName;
    }

    public void setEmployeeName(String employeeName) {
        this.employeeName = employeeName;
    }
}

