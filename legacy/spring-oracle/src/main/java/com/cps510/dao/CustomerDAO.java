package com.cps510.dao;

import com.cps510.model.Customer;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Repository;

import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.List;

/**
 * Data Access Object (DAO) for Customer entity.
 * Provides CRUD operations and search functionality for customers.
 * Uses Spring JDBC for database operations.
 * 
 * @author CPS510 Team
 * @version 1.0
 */
@Repository
public class CustomerDAO {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    /**
     * RowMapper implementation for mapping ResultSet rows to Customer objects.
     * Maps database columns to Customer entity properties.
     */
    private static final class CustomerRowMapper implements RowMapper<Customer> {
        @Override
        public Customer mapRow(ResultSet rs, int rowNum) throws SQLException {
            Customer customer = new Customer();
            customer.setCustomerId(rs.getLong("customer_id"));
            customer.setCustomerName(rs.getString("customer_name"));
            customer.setCustomerEmail(rs.getString("customer_email"));
            customer.setCustomerPhone(rs.getString("customer_phone"));
            return customer;
        }
    }

    /**
     * Retrieves all customers from the database, ordered by name.
     * 
     * @return List of all Customer entities, ordered by customer name
     */
    public List<Customer> findAll() {
        String sql = "SELECT customer_id, customer_name, customer_email, customer_phone FROM Customer ORDER BY customer_name";
        return jdbcTemplate.query(sql, new CustomerRowMapper());
    }

    /**
     * Retrieves a customer by their unique ID.
     * 
     * @param customerId The unique identifier of the customer
     * @return Customer entity if found, null otherwise
     */
    public Customer findById(Long customerId) {
        String sql = "SELECT customer_id, customer_name, customer_email, customer_phone FROM Customer WHERE customer_id = ?";
        List<Customer> customers = jdbcTemplate.query(sql, new CustomerRowMapper(), customerId);
        return customers.isEmpty() ? null : customers.get(0);
    }

    /**
     * Inserts a new customer into the database.
     * Uses Oracle sequence (CUSTOMER_SEQ) via trigger to auto-generate the ID.
     * 
     * @param customer The Customer entity to insert
     * @return The generated customer ID
     */
    public Long insert(Customer customer) {
        String sql = "INSERT INTO Customer (customer_name, customer_email, customer_phone) VALUES (?, ?, ?)";
        KeyHolder keyHolder = new GeneratedKeyHolder();
        
        jdbcTemplate.update(connection -> {
            PreparedStatement ps = connection.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);
            ps.setString(1, customer.getCustomerName());
            ps.setString(2, customer.getCustomerEmail());
            ps.setString(3, customer.getCustomerPhone());
            return ps;
        }, keyHolder);

        // Note: Oracle sequences are handled by triggers, so we may need to query the sequence
        // For now, we'll use a workaround to get the generated ID
        if (keyHolder.getKey() == null) {
            // Query the current sequence value
            String seqSql = "SELECT CUSTOMER_SEQ.CURRVAL FROM dual";
            try {
                Long id = jdbcTemplate.queryForObject(seqSql, Long.class);
                return id;
            } catch (Exception e) {
                // If sequence hasn't been used yet, get max + 1
                String maxSql = "SELECT NVL(MAX(customer_id), 0) FROM Customer";
                return jdbcTemplate.queryForObject(maxSql, Long.class);
            }
        }
        return keyHolder.getKey().longValue();
    }

    /**
     * Updates an existing customer in the database.
     * 
     * @param customer The Customer entity with updated information
     * @return Number of rows affected (should be 1 if update successful)
     */
    public int update(Customer customer) {
        String sql = "UPDATE Customer SET customer_name = ?, customer_email = ?, customer_phone = ? WHERE customer_id = ?";
        return jdbcTemplate.update(sql, customer.getCustomerName(), customer.getCustomerEmail(), 
                                   customer.getCustomerPhone(), customer.getCustomerId());
    }

    /**
     * Deletes a customer from the database by ID.
     * 
     * @param customerId The unique identifier of the customer to delete
     * @return Number of rows affected (should be 1 if delete successful)
     */
    public int delete(Long customerId) {
        String sql = "DELETE FROM Customer WHERE customer_id = ?";
        return jdbcTemplate.update(sql, customerId);
    }

    /**
     * Searches for customers by name, email, or phone number.
     * Uses case-insensitive LIKE pattern matching.
     * 
     * @param searchTerm The search term to match against customer name, email, or phone
     * @return List of customers matching the search criteria, ordered by customer name
     */
    public List<Customer> search(String searchTerm) {
        String sql = "SELECT customer_id, customer_name, customer_email, customer_phone FROM Customer " +
                     "WHERE UPPER(customer_name) LIKE UPPER(?) " +
                     "OR UPPER(customer_email) LIKE UPPER(?) " +
                     "OR UPPER(customer_phone) LIKE UPPER(?) " +
                     "ORDER BY customer_name";
        String searchPattern = "%" + searchTerm + "%";
        return jdbcTemplate.query(sql, new CustomerRowMapper(), searchPattern, searchPattern, searchPattern);
    }
}

