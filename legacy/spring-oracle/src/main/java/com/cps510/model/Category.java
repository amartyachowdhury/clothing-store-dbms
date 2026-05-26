package com.cps510.model;

/**
 * Model class representing a Category entity.
 * Maps to the Category_ table in the database.
 * Categories are used to classify products (e.g., Men's Wear, Women's Wear, Accessories).
 * 
 * @author CPS510 Team
 * @version 1.0
 */
public class Category {
    private Long categoryId;
    private String categoryName;

    public Category() {
    }

    public Category(Long categoryId, String categoryName) {
        this.categoryId = categoryId;
        this.categoryName = categoryName;
    }

    public Long getCategoryId() {
        return categoryId;
    }

    public void setCategoryId(Long categoryId) {
        this.categoryId = categoryId;
    }

    public String getCategoryName() {
        return categoryName;
    }

    public void setCategoryName(String categoryName) {
        this.categoryName = categoryName;
    }
}

