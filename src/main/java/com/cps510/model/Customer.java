package com.cps510.model;

/**
 * Model class representing a Customer entity.
 * Maps to the Customer table in the database.
 * 
 * @author CPS510 Team
 * @version 1.0
 */
public class Customer {
    private Long customerId;
    private String customerName;
    private String customerEmail;
    private String customerPhone;

    public Customer() {
    }

    public Customer(Long customerId, String customerName, String customerEmail, String customerPhone) {
        this.customerId = customerId;
        this.customerName = customerName;
        this.customerEmail = customerEmail;
        this.customerPhone = customerPhone;
    }

    public Long getCustomerId() {
        return customerId;
    }

    public void setCustomerId(Long customerId) {
        this.customerId = customerId;
    }

    public String getCustomerName() {
        return customerName;
    }

    public void setCustomerName(String customerName) {
        this.customerName = customerName;
    }

    public String getCustomerEmail() {
        return customerEmail;
    }

    public void setCustomerEmail(String customerEmail) {
        this.customerEmail = customerEmail;
    }

    public String getCustomerPhone() {
        return customerPhone;
    }

    public void setCustomerPhone(String customerPhone) {
        this.customerPhone = customerPhone;
    }
}

