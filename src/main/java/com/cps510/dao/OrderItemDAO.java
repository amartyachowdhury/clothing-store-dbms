package com.cps510.dao;

import com.cps510.model.OrderItem;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;

/**
 * Data Access Object (DAO) for OrderItem entity (bridge table).
 * Provides CRUD operations, order-based queries, and order total calculations.
 * Uses Spring JDBC for database operations and joins with Product and Category tables.
 * 
 * @author CPS510 Team
 * @version 1.0
 */
@Repository
public class OrderItemDAO {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    /**
     * RowMapper implementation for mapping ResultSet rows to OrderItem objects.
     * Handles optional fields from joined tables (product_name, product_brand, category_name, line_total) gracefully.
     */
    private static final class OrderItemRowMapper implements RowMapper<OrderItem> {
        @Override
        public OrderItem mapRow(ResultSet rs, int rowNum) throws SQLException {
            OrderItem item = new OrderItem();
            item.setOrderId(rs.getLong("order_id"));
            item.setProductId(rs.getLong("product_id"));
            item.setItemQty(rs.getInt("item_qty"));
            item.setUnitPrice(rs.getBigDecimal("unit_price"));
            try {
                item.setProductName(rs.getString("product_name"));
            } catch (SQLException e) {
                // May not be present in all queries
            }
            try {
                item.setProductBrand(rs.getString("product_brand"));
            } catch (SQLException e) {
                // May not be present in all queries
            }
            try {
                item.setCategoryName(rs.getString("category_name"));
            } catch (SQLException e) {
                // May not be present in all queries
            }
            try {
                item.setLineTotal(rs.getBigDecimal("line_total"));
            } catch (SQLException e) {
                // Calculate if not present
            }
            return item;
        }
    }

    /**
     * Retrieves all order items for a specific order using V_ORDER_LINE_ITEMS view.
     * Includes product and category information from joined tables.
     * 
     * @param orderId The unique identifier of the order
     * @return List of order items for the specified order, ordered by product name
     */
    public List<OrderItem> findByOrder(Long orderId) {
        String sql = "SELECT * FROM V_ORDER_LINE_ITEMS WHERE order_id = ? ORDER BY product_name";
        return jdbcTemplate.query(sql, new OrderItemRowMapper(), orderId);
    }

    /**
     * Retrieves a specific order item by order ID and product ID.
     * Includes product and category information from joined tables.
     * 
     * @param orderId The unique identifier of the order
     * @param productId The unique identifier of the product
     * @return OrderItem entity if found, null otherwise
     */
    public OrderItem findByOrderAndProduct(Long orderId, Long productId) {
        String sql = "SELECT oi.order_id, oi.product_id, oi.item_qty, oi.unit_price, " +
                     "p.product_name, p.product_brand, c.category_name " +
                     "FROM OrderItem oi JOIN Product p ON oi.product_id = p.product_id " +
                     "JOIN Category_ c ON p.category_id = c.category_id " +
                     "WHERE oi.order_id = ? AND oi.product_id = ?";
        List<OrderItem> items = jdbcTemplate.query(sql, new OrderItemRowMapper(), orderId, productId);
        return items.isEmpty() ? null : items.get(0);
    }

    /**
     * Inserts a new order item into the database.
     * 
     * @param item The OrderItem entity to insert
     * @return Number of rows affected (should be 1 if insert successful)
     */
    public int insert(OrderItem item) {
        String sql = "INSERT INTO OrderItem (order_id, product_id, item_qty, unit_price) VALUES (?, ?, ?, ?)";
        return jdbcTemplate.update(sql, item.getOrderId(), item.getProductId(), 
                                   item.getItemQty(), item.getUnitPrice());
    }

    /**
     * Updates an existing order item in the database.
     * 
     * @param item The OrderItem entity with updated information
     * @return Number of rows affected (should be 1 if update successful)
     */
    public int update(OrderItem item) {
        String sql = "UPDATE OrderItem SET item_qty = ?, unit_price = ? WHERE order_id = ? AND product_id = ?";
        return jdbcTemplate.update(sql, item.getItemQty(), item.getUnitPrice(),
                                   item.getOrderId(), item.getProductId());
    }

    /**
     * Deletes a specific order item from the database by order ID and product ID.
     * 
     * @param orderId The unique identifier of the order
     * @param productId The unique identifier of the product
     * @return Number of rows affected (should be 1 if delete successful)
     */
    public int delete(Long orderId, Long productId) {
        String sql = "DELETE FROM OrderItem WHERE order_id = ? AND product_id = ?";
        return jdbcTemplate.update(sql, orderId, productId);
    }

    /**
     * Deletes all order items for a specific order.
     * Used when deleting an order to maintain referential integrity.
     * 
     * @param orderId The unique identifier of the order
     * @return Number of rows affected
     */
    public int deleteByOrder(Long orderId) {
        String sql = "DELETE FROM OrderItem WHERE order_id = ?";
        return jdbcTemplate.update(sql, orderId);
    }

    /**
     * Calculates the total amount for a specific order by summing all order items.
     * Formula: SUM(item_qty * unit_price) for all items in the order.
     * 
     * @param orderId The unique identifier of the order
     * @return Total amount of the order, or BigDecimal.ZERO if no items exist
     */
    public BigDecimal calculateOrderTotal(Long orderId) {
        String sql = "SELECT SUM(item_qty * unit_price) FROM OrderItem WHERE order_id = ?";
        BigDecimal total = jdbcTemplate.queryForObject(sql, BigDecimal.class, orderId);
        return total != null ? total : BigDecimal.ZERO;
    }
}

