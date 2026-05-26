package com.cps510.model;

/**
 * Model class representing an Employee entity.
 * Maps to the Employee table in the database.
 * Contains employee information including name, email, phone, and role.
 * 
 * @author CPS510 Team
 * @version 1.0
 */
public class Employee {
    private Long employeeId;
    private String employeeName;
    private String employeeEmail;
    private String employeePhone;
    private String employeeRole;

    public Employee() {
    }

    public Employee(Long employeeId, String employeeName, String employeeEmail, String employeePhone, String employeeRole) {
        this.employeeId = employeeId;
        this.employeeName = employeeName;
        this.employeeEmail = employeeEmail;
        this.employeePhone = employeePhone;
        this.employeeRole = employeeRole;
    }

    public Long getEmployeeId() {
        return employeeId;
    }

    public void setEmployeeId(Long employeeId) {
        this.employeeId = employeeId;
    }

    public String getEmployeeName() {
        return employeeName;
    }

    public void setEmployeeName(String employeeName) {
        this.employeeName = employeeName;
    }

    public String getEmployeeEmail() {
        return employeeEmail;
    }

    public void setEmployeeEmail(String employeeEmail) {
        this.employeeEmail = employeeEmail;
    }

    public String getEmployeePhone() {
        return employeePhone;
    }

    public void setEmployeePhone(String employeePhone) {
        this.employeePhone = employeePhone;
    }

    public String getEmployeeRole() {
        return employeeRole;
    }

    public void setEmployeeRole(String employeeRole) {
        this.employeeRole = employeeRole;
    }
}

