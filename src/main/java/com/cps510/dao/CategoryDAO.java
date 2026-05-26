package com.cps510.dao;

import com.cps510.model.Category;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;

/**
 * Data Access Object (DAO) for Category entity.
 * Provides CRUD operations for product categories.
 * Uses Spring JDBC for database operations.
 * 
 * @author CPS510 Team
 * @version 1.0
 */
@Repository
public class CategoryDAO {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    /**
     * RowMapper implementation for mapping ResultSet rows to Category objects.
     */
    private static final class CategoryRowMapper implements RowMapper<Category> {
        @Override
        public Category mapRow(ResultSet rs, int rowNum) throws SQLException {
            Category category = new Category();
            category.setCategoryId(rs.getLong("category_id"));
            category.setCategoryName(rs.getString("category_name"));
            return category;
        }
    }

    /**
     * Retrieves all categories from the database, ordered by category name.
     * 
     * @return List of all Category entities, ordered by category name
     */
    public List<Category> findAll() {
        String sql = "SELECT category_id, category_name FROM Category_ ORDER BY category_name";
        return jdbcTemplate.query(sql, new CategoryRowMapper());
    }

    /**
     * Retrieves a category by its unique ID.
     * 
     * @param categoryId The unique identifier of the category
     * @return Category entity if found, null otherwise
     */
    public Category findById(Long categoryId) {
        String sql = "SELECT category_id, category_name FROM Category_ WHERE category_id = ?";
        List<Category> categories = jdbcTemplate.query(sql, new CategoryRowMapper(), categoryId);
        return categories.isEmpty() ? null : categories.get(0);
    }

    /**
     * Inserts a new category into the database.
     * Note: Category ID must be provided as categories don't use auto-increment sequences.
     * 
     * @param category The Category entity to insert
     * @return Number of rows affected (should be 1 if insert successful)
     */
    public int insert(Category category) {
        String sql = "INSERT INTO Category_ (category_id, category_name) VALUES (?, ?)";
        return jdbcTemplate.update(sql, category.getCategoryId(), category.getCategoryName());
    }

    /**
     * Updates an existing category in the database.
     * 
     * @param category The Category entity with updated information
     * @return Number of rows affected (should be 1 if update successful)
     */
    public int update(Category category) {
        String sql = "UPDATE Category_ SET category_name = ? WHERE category_id = ?";
        return jdbcTemplate.update(sql, category.getCategoryName(), category.getCategoryId());
    }

    /**
     * Deletes a category from the database by ID.
     * 
     * @param categoryId The unique identifier of the category to delete
     * @return Number of rows affected (should be 1 if delete successful)
     */
    public int delete(Long categoryId) {
        String sql = "DELETE FROM Category_ WHERE category_id = ?";
        return jdbcTemplate.update(sql, categoryId);
    }
}

