package com.cps510.dao;

import com.cps510.model.Product;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;

/**
 * Data Access Object (DAO) for Product entity.
 * Provides CRUD operations, category-based queries, and search functionality for products.
 * Uses Spring JDBC for database operations and joins with Category table.
 * 
 * @author CPS510 Team
 * @version 1.0
 */
@Repository
public class ProductDAO {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    /**
     * RowMapper implementation for mapping ResultSet rows to Product objects.
     * Handles optional category_name field gracefully for queries that may not include it.
     */
    private static final class ProductRowMapper implements RowMapper<Product> {
        @Override
        public Product mapRow(ResultSet rs, int rowNum) throws SQLException {
            Product product = new Product();
            product.setProductId(rs.getLong("product_id"));
            product.setProductName(rs.getString("product_name"));
            product.setProductSize(rs.getString("product_size"));
            product.setProductColour(rs.getString("product_colour"));
            product.setProductBrand(rs.getString("product_brand"));
            product.setProductPrice(rs.getBigDecimal("product_price"));
            product.setProductStockQty(rs.getInt("product_stock_qty"));
            product.setCategoryId(rs.getLong("category_id"));
            try {
                product.setCategoryName(rs.getString("category_name"));
            } catch (SQLException e) {
                // category_name may not be present in all queries
            }
            return product;
        }
    }

    /**
     * Retrieves all products from the database with their category names, ordered by product name.
     * Uses JOIN with Category_ table to include category information.
     * 
     * @return List of all Product entities with category information, ordered by product name
     */
    public List<Product> findAll() {
        String sql = "SELECT p.product_id, p.product_name, p.product_size, p.product_colour, p.product_brand, " +
                     "p.product_price, p.product_stock_qty, p.category_id, c.category_name " +
                     "FROM Product p JOIN Category_ c ON p.category_id = c.category_id " +
                     "ORDER BY p.product_name";
        return jdbcTemplate.query(sql, new ProductRowMapper());
    }

    /**
     * Retrieves a product by its unique ID, including category information.
     * 
     * @param productId The unique identifier of the product
     * @return Product entity if found, null otherwise
     */
    public Product findById(Long productId) {
        String sql = "SELECT p.product_id, p.product_name, p.product_size, p.product_colour, p.product_brand, " +
                     "p.product_price, p.product_stock_qty, p.category_id, c.category_name " +
                     "FROM Product p JOIN Category_ c ON p.category_id = c.category_id " +
                     "WHERE p.product_id = ?";
        List<Product> products = jdbcTemplate.query(sql, new ProductRowMapper(), productId);
        return products.isEmpty() ? null : products.get(0);
    }

    /**
     * Retrieves all products belonging to a specific category.
     * 
     * @param categoryId The unique identifier of the category
     * @return List of products in the specified category, ordered by product name
     */
    public List<Product> findByCategory(Long categoryId) {
        String sql = "SELECT p.product_id, p.product_name, p.product_size, p.product_colour, p.product_brand, " +
                     "p.product_price, p.product_stock_qty, p.category_id, c.category_name " +
                     "FROM Product p JOIN Category_ c ON p.category_id = c.category_id " +
                     "WHERE p.category_id = ? ORDER BY p.product_name";
        return jdbcTemplate.query(sql, new ProductRowMapper(), categoryId);
    }

    /**
     * Inserts a new product into the database.
     * Uses Oracle sequence (PRODUCT_SEQ) via trigger to auto-generate the ID.
     * 
     * @param product The Product entity to insert
     * @return The generated product ID
     */
    public Long insert(Product product) {
        String sql = "INSERT INTO Product (product_name, product_size, product_colour, product_brand, " +
                     "product_price, product_stock_qty, category_id) VALUES (?, ?, ?, ?, ?, ?, ?)";
        jdbcTemplate.update(sql, product.getProductName(), product.getProductSize(), product.getProductColour(),
                           product.getProductBrand(), product.getProductPrice(), product.getProductStockQty(),
                           product.getCategoryId());
        
        String seqSql = "SELECT PRODUCT_SEQ.CURRVAL FROM dual";
        try {
            return jdbcTemplate.queryForObject(seqSql, Long.class);
        } catch (Exception e) {
            String maxSql = "SELECT NVL(MAX(product_id), 0) FROM Product";
            return jdbcTemplate.queryForObject(maxSql, Long.class);
        }
    }

    /**
     * Updates an existing product in the database.
     * 
     * @param product The Product entity with updated information
     * @return Number of rows affected (should be 1 if update successful)
     */
    public int update(Product product) {
        String sql = "UPDATE Product SET product_name = ?, product_size = ?, product_colour = ?, " +
                     "product_brand = ?, product_price = ?, product_stock_qty = ?, category_id = ? " +
                     "WHERE product_id = ?";
        return jdbcTemplate.update(sql, product.getProductName(), product.getProductSize(), 
                                   product.getProductColour(), product.getProductBrand(), 
                                   product.getProductPrice(), product.getProductStockQty(),
                                   product.getCategoryId(), product.getProductId());
    }

    /**
     * Deletes a product from the database by ID.
     * 
     * @param productId The unique identifier of the product to delete
     * @return Number of rows affected (should be 1 if delete successful)
     */
    public int delete(Long productId) {
        String sql = "DELETE FROM Product WHERE product_id = ?";
        return jdbcTemplate.update(sql, productId);
    }

    /**
     * Searches for products by name, brand, colour, or category name.
     * Uses case-insensitive LIKE pattern matching across multiple fields.
     * 
     * @param searchTerm The search term to match against product attributes
     * @return List of products matching the search criteria, ordered by product name
     */
    public List<Product> search(String searchTerm) {
        String sql = "SELECT p.product_id, p.product_name, p.product_size, p.product_colour, p.product_brand, " +
                     "p.product_price, p.product_stock_qty, p.category_id, c.category_name " +
                     "FROM Product p JOIN Category_ c ON p.category_id = c.category_id " +
                     "WHERE UPPER(p.product_name) LIKE UPPER(?) " +
                     "OR UPPER(p.product_brand) LIKE UPPER(?) " +
                     "OR UPPER(p.product_colour) LIKE UPPER(?) " +
                     "OR UPPER(c.category_name) LIKE UPPER(?) " +
                     "ORDER BY p.product_name";
        String searchPattern = "%" + searchTerm + "%";
        return jdbcTemplate.query(sql, new ProductRowMapper(), searchPattern, searchPattern, searchPattern, searchPattern);
    }
}

