package com.cps510.dao;

import com.cps510.model.Order;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.Date;
import java.util.List;

/**
 * Data Access Object (DAO) for Order entity.
 * Provides CRUD operations, customer-based queries, order status updates, total calculations, and search functionality.
 * Uses Spring JDBC for database operations and joins with Customer and Employee tables.
 * Handles both V_ORDERS_SUMMARY view queries and direct table queries for different use cases.
 * 
 * @author CPS510 Team
 * @version 1.0
 */
@Repository
public class OrderDAO {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    /**
     * RowMapper implementation for mapping ResultSet rows from V_ORDERS_SUMMARY view to Order objects.
     * Note: V_ORDERS_SUMMARY view doesn't include customer_id/employee_id, only names.
     * Handles optional fields gracefully for queries that may not include all columns.
     */
    private static final class OrderRowMapper implements RowMapper<Order> {
        @Override
        public Order mapRow(ResultSet rs, int rowNum) throws SQLException {
            Order order = new Order();
            order.setOrderId(rs.getLong("order_id"));
            order.setOrderDate(rs.getTimestamp("order_date"));
            order.setTotalAmount(rs.getBigDecimal("total_amount"));
            order.setOrderStatus(rs.getString("order_status"));
            // Note: V_ORDERS_SUMMARY view doesn't include customer_id/employee_id, only names
            try {
                order.setCustomerId(rs.getLong("customer_id"));
            } catch (SQLException e) {
                // Not in view, will be null
            }
            try {
                order.setEmployeeId(rs.getLong("employee_id"));
            } catch (SQLException e) {
                // Not in view, will be null
            }
            try {
                order.setCustomerName(rs.getString("customer_name"));
            } catch (SQLException e) {
                // May not be present in all queries
            }
            try {
                order.setEmployeeName(rs.getString("employee_name"));
            } catch (SQLException e) {
                // May not be present in all queries
            }
            return order;
        }
    }

    /**
     * Retrieves all orders from the database using V_ORDERS_SUMMARY view, ordered by order date (descending).
     * Note: This query does not return customer_id or employee_id, only names.
     * 
     * @return List of all Order entities, ordered by order date (most recent first)
     */
    public List<Order> findAll() {
        String sql = "SELECT * FROM V_ORDERS_SUMMARY ORDER BY order_date DESC";
        return jdbcTemplate.query(sql, new OrderRowMapper());
    }

    /**
     * Retrieves an order by its unique ID, including customer and employee IDs.
     * Uses direct table query with joins to get all required fields including IDs.
     * 
     * @param orderId The unique identifier of the order
     * @return Order entity if found, null otherwise
     */
    public Order findById(Long orderId) {
        // Use direct table query to get IDs when needed
        String sql = "SELECT o.order_id, o.order_date, o.total_amount, o.order_status, " +
                     "o.customer_id, o.employee_id, c.customer_name, e.employee_name " +
                     "FROM Order_ o JOIN Customer c ON o.customer_id = c.customer_id " +
                     "JOIN Employee e ON o.employee_id = e.employee_id " +
                     "WHERE o.order_id = ?";
        List<Order> orders = jdbcTemplate.query(sql, new OrderRowMapperWithIds(), orderId);
        return orders.isEmpty() ? null : orders.get(0);
    }

    /**
     * Retrieves all orders for a specific customer, ordered by order date (descending).
     * 
     * @param customerId The unique identifier of the customer
     * @return List of orders for the specified customer, ordered by order date (most recent first)
     */
    public List<Order> findByCustomer(Long customerId) {
        String sql = "SELECT o.order_id, o.order_date, o.total_amount, o.order_status, " +
                     "o.customer_id, o.employee_id, c.customer_name, e.employee_name " +
                     "FROM Order_ o JOIN Customer c ON o.customer_id = c.customer_id " +
                     "JOIN Employee e ON o.employee_id = e.employee_id " +
                     "WHERE o.customer_id = ? ORDER BY o.order_date DESC";
        return jdbcTemplate.query(sql, new OrderRowMapperWithIds(), customerId);
    }

    /**
     * RowMapper implementation for mapping ResultSet rows from direct table queries to Order objects.
     * Includes customer_id and employee_id fields that are not in V_ORDERS_SUMMARY view.
     * Handles optional display fields gracefully.
     */
    private static final class OrderRowMapperWithIds implements RowMapper<Order> {
        @Override
        public Order mapRow(ResultSet rs, int rowNum) throws SQLException {
            Order order = new Order();
            order.setOrderId(rs.getLong("order_id"));
            order.setOrderDate(rs.getTimestamp("order_date"));
            order.setTotalAmount(rs.getBigDecimal("total_amount"));
            order.setOrderStatus(rs.getString("order_status"));
            order.setCustomerId(rs.getLong("customer_id"));
            order.setEmployeeId(rs.getLong("employee_id"));
            try {
                order.setCustomerName(rs.getString("customer_name"));
            } catch (SQLException e) {
                // May not be present in all queries
            }
            try {
                order.setEmployeeName(rs.getString("employee_name"));
            } catch (SQLException e) {
                // May not be present in all queries
            }
            return order;
        }
    }

    /**
     * Inserts a new order into the database.
     * Uses Oracle sequence (ORDER_SEQ) via trigger to auto-generate the ID.
     * Sets order date to current date if not provided.
     * 
     * @param order The Order entity to insert
     * @return The generated order ID
     */
    public Long insert(Order order) {
        String sql = "INSERT INTO Order_ (order_date, total_amount, order_status, customer_id, employee_id) " +
                     "VALUES (?, ?, ?, ?, ?)";
        Date orderDate = order.getOrderDate() != null ? order.getOrderDate() : new Date();
        jdbcTemplate.update(sql, orderDate, order.getTotalAmount(), order.getOrderStatus(),
                           order.getCustomerId(), order.getEmployeeId());
        
        String seqSql = "SELECT ORDER_SEQ.CURRVAL FROM dual";
        try {
            return jdbcTemplate.queryForObject(seqSql, Long.class);
        } catch (Exception e) {
            String maxSql = "SELECT NVL(MAX(order_id), 0) FROM Order_";
            return jdbcTemplate.queryForObject(maxSql, Long.class);
        }
    }

    /**
     * Updates an existing order in the database.
     * 
     * @param order The Order entity with updated information
     * @return Number of rows affected (should be 1 if update successful)
     */
    public int update(Order order) {
        String sql = "UPDATE Order_ SET order_date = ?, total_amount = ?, order_status = ?, " +
                     "customer_id = ?, employee_id = ? WHERE order_id = ?";
        return jdbcTemplate.update(sql, order.getOrderDate(), order.getTotalAmount(), 
                                   order.getOrderStatus(), order.getCustomerId(), 
                                   order.getEmployeeId(), order.getOrderId());
    }

    /**
     * Deletes an order from the database by ID.
     * 
     * @param orderId The unique identifier of the order to delete
     * @return Number of rows affected (should be 1 if delete successful)
     */
    public int delete(Long orderId) {
        String sql = "DELETE FROM Order_ WHERE order_id = ?";
        return jdbcTemplate.update(sql, orderId);
    }

    /**
     * Updates the total amount for a specific order.
     * Used when order items are added or removed.
     * 
     * @param orderId The unique identifier of the order
     * @param totalAmount The new total amount for the order
     * @return Number of rows affected (should be 1 if update successful)
     */
    public int updateTotalAmount(Long orderId, BigDecimal totalAmount) {
        String sql = "UPDATE Order_ SET total_amount = ? WHERE order_id = ?";
        return jdbcTemplate.update(sql, totalAmount, orderId);
    }

    /**
     * Updates the status for a specific order.
     * Used for business logic such as marking orders as completed when fully paid.
     * 
     * @param orderId The unique identifier of the order
     * @param status The new status for the order (e.g., "Pending", "Completed")
     * @return Number of rows affected (should be 1 if update successful)
     */
    public int updateOrderStatus(Long orderId, String status) {
        String sql = "UPDATE Order_ SET order_status = ? WHERE order_id = ?";
        return jdbcTemplate.update(sql, status, orderId);
    }

    /**
     * Retrieves the total amount for a specific order.
     * 
     * @param orderId The unique identifier of the order
     * @return The total amount of the order, or BigDecimal.ZERO if order not found
     */
    public BigDecimal getOrderTotalAmount(Long orderId) {
        String sql = "SELECT total_amount FROM Order_ WHERE order_id = ?";
        try {
            BigDecimal total = jdbcTemplate.queryForObject(sql, BigDecimal.class, orderId);
            return total != null ? total : BigDecimal.ZERO;
        } catch (Exception e) {
            return BigDecimal.ZERO;
        }
    }

    /**
     * Searches for orders by order ID, customer name, employee name, or status.
     * Uses case-insensitive LIKE pattern matching across multiple fields.
     * 
     * @param searchTerm The search term to match against order attributes
     * @return List of orders matching the search criteria, ordered by order date (descending)
     */
    public List<Order> search(String searchTerm) {
        String sql = "SELECT o.order_id, o.order_date, o.total_amount, o.order_status, " +
                     "o.customer_id, o.employee_id, c.customer_name, e.employee_name " +
                     "FROM Order_ o JOIN Customer c ON o.customer_id = c.customer_id " +
                     "JOIN Employee e ON o.employee_id = e.employee_id " +
                     "WHERE TO_CHAR(o.order_id) LIKE ? " +
                     "OR UPPER(c.customer_name) LIKE UPPER(?) " +
                     "OR UPPER(e.employee_name) LIKE UPPER(?) " +
                     "OR UPPER(o.order_status) LIKE UPPER(?) " +
                     "ORDER BY o.order_date DESC";
        String searchPattern = "%" + searchTerm + "%";
        return jdbcTemplate.query(sql, new OrderRowMapperWithIds(), searchPattern, searchPattern, searchPattern, searchPattern);
    }
}

