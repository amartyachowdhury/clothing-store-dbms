package com.cps510.dao;

import com.cps510.model.Payment;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;

/**
 * Data Access Object (DAO) for Payment entity.
 * Provides CRUD operations, order-based queries, payment calculations, and search functionality.
 * Uses Spring JDBC for database operations and joins with Order and Customer tables.
 * 
 * @author CPS510 Team
 * @version 1.0
 */
@Repository
public class PaymentDAO {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    /**
     * RowMapper implementation for mapping ResultSet rows to Payment objects.
     * Handles optional fields from joined tables (order_date, customer_name) gracefully.
     */
    private static final class PaymentRowMapper implements RowMapper<Payment> {
        @Override
        public Payment mapRow(ResultSet rs, int rowNum) throws SQLException {
            Payment payment = new Payment();
            payment.setPaymentId(rs.getLong("payment_id"));
            payment.setOrderId(rs.getLong("order_id"));
            payment.setPaymentMethod(rs.getString("payment_method"));
            payment.setPaymentAmount(rs.getBigDecimal("payment_amount"));
            payment.setPaymentStatus(rs.getString("payment_status"));
            try {
                payment.setOrderDate(rs.getTimestamp("order_date"));
            } catch (SQLException e) {
                // May not be present in all queries
            }
            try {
                payment.setCustomerName(rs.getString("customer_name"));
            } catch (SQLException e) {
                // May not be present in all queries
            }
            return payment;
        }
    }

    /**
     * Retrieves all payments from the database using V_PAYMENTS view, ordered by payment ID (descending).
     * 
     * @return List of all Payment entities with order and customer information
     */
    public List<Payment> findAll() {
        String sql = "SELECT * FROM V_PAYMENTS ORDER BY payment_id DESC";
        return jdbcTemplate.query(sql, new PaymentRowMapper());
    }

    /**
     * Retrieves a payment by its unique ID.
     * 
     * @param paymentId The unique identifier of the payment
     * @return Payment entity if found, null otherwise
     */
    public Payment findById(Long paymentId) {
        String sql = "SELECT * FROM V_PAYMENTS WHERE payment_id = ?";
        List<Payment> payments = jdbcTemplate.query(sql, new PaymentRowMapper(), paymentId);
        return payments.isEmpty() ? null : payments.get(0);
    }

    /**
     * Retrieves all payments for a specific order.
     * 
     * @param orderId The unique identifier of the order
     * @return List of payments for the specified order
     */
    public List<Payment> findByOrder(Long orderId) {
        String sql = "SELECT * FROM V_PAYMENTS WHERE order_id = ?";
        return jdbcTemplate.query(sql, new PaymentRowMapper(), orderId);
    }

    /**
     * Inserts a new payment into the database.
     * Uses Oracle sequence (PAYMENT_SEQ) via trigger to auto-generate the ID.
     * 
     * @param payment The Payment entity to insert
     * @return The generated payment ID
     */
    public Long insert(Payment payment) {
        String sql = "INSERT INTO Payment (order_id, payment_method, payment_amount, payment_status) " +
                     "VALUES (?, ?, ?, ?)";
        jdbcTemplate.update(sql, payment.getOrderId(), payment.getPaymentMethod(),
                           payment.getPaymentAmount(), payment.getPaymentStatus());
        
        String seqSql = "SELECT PAYMENT_SEQ.CURRVAL FROM dual";
        try {
            return jdbcTemplate.queryForObject(seqSql, Long.class);
        } catch (Exception e) {
            String maxSql = "SELECT NVL(MAX(payment_id), 0) FROM Payment";
            return jdbcTemplate.queryForObject(maxSql, Long.class);
        }
    }

    /**
     * Updates an existing payment in the database.
     * 
     * @param payment The Payment entity with updated information
     * @return Number of rows affected (should be 1 if update successful)
     */
    public int update(Payment payment) {
        String sql = "UPDATE Payment SET order_id = ?, payment_method = ?, payment_amount = ?, " +
                     "payment_status = ? WHERE payment_id = ?";
        return jdbcTemplate.update(sql, payment.getOrderId(), payment.getPaymentMethod(),
                                   payment.getPaymentAmount(), payment.getPaymentStatus(),
                                   payment.getPaymentId());
    }

    /**
     * Deletes a payment from the database by ID.
     * 
     * @param paymentId The unique identifier of the payment to delete
     * @return Number of rows affected (should be 1 if delete successful)
     */
    public int delete(Long paymentId) {
        String sql = "DELETE FROM Payment WHERE payment_id = ?";
        return jdbcTemplate.update(sql, paymentId);
    }

    /**
     * Calculates the total amount of paid payments for a specific order.
     * Only includes payments with status 'Paid'.
     * 
     * @param orderId The unique identifier of the order
     * @return Total amount of paid payments, or BigDecimal.ZERO if no paid payments exist
     */
    public BigDecimal getTotalPaidAmount(Long orderId) {
        String sql = "SELECT NVL(SUM(payment_amount), 0) FROM Payment WHERE order_id = ? AND payment_status = 'Paid'";
        BigDecimal total = jdbcTemplate.queryForObject(sql, BigDecimal.class, orderId);
        return total != null ? total : BigDecimal.ZERO;
    }

    /**
     * Searches for payments by payment ID, order ID, payment method, status, or amount.
     * Uses case-insensitive LIKE pattern matching across multiple fields.
     * 
     * @param searchTerm The search term to match against payment attributes
     * @return List of payments matching the search criteria, ordered by payment ID (descending)
     */
    public List<Payment> search(String searchTerm) {
        String sql = "SELECT p.payment_id, p.order_id, p.payment_method, p.payment_amount, p.payment_status, " +
                     "o.order_date, c.customer_name " +
                     "FROM Payment p " +
                     "JOIN Order_ o ON p.order_id = o.order_id " +
                     "JOIN Customer c ON o.customer_id = c.customer_id " +
                     "WHERE TO_CHAR(p.payment_id) LIKE ? " +
                     "OR TO_CHAR(p.order_id) LIKE ? " +
                     "OR UPPER(p.payment_method) LIKE UPPER(?) " +
                     "OR UPPER(p.payment_status) LIKE UPPER(?) " +
                     "OR TO_CHAR(p.payment_amount) LIKE ? " +
                     "ORDER BY p.payment_id DESC";
        String searchPattern = "%" + searchTerm + "%";
        return jdbcTemplate.query(sql, new PaymentRowMapper(), searchPattern, searchPattern, searchPattern, searchPattern, searchPattern);
    }
}

