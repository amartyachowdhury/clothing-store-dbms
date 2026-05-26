package com.cps510.controller;

import com.cps510.dao.CategoryDAO;
import com.cps510.dao.ProductDAO;
import com.cps510.model.Product;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import java.util.List;

/**
 * Controller for Product entity operations.
 * Handles HTTP requests for product CRUD operations and search functionality.
 * Provides endpoints for listing, viewing, creating, updating, and deleting products.
 * 
 * @author CPS510 Team
 * @version 1.0
 */
@Controller
@RequestMapping("/products")
public class ProductController {

    @Autowired
    private ProductDAO productDAO;

    @Autowired
    private CategoryDAO categoryDAO;

    @GetMapping
    public String listProducts(@RequestParam(required = false) String search, Model model) {
        List<Product> products;
        if (search != null && !search.trim().isEmpty()) {
            products = productDAO.search(search.trim());
            model.addAttribute("searchTerm", search);
        } else {
            products = productDAO.findAll();
        }
        model.addAttribute("products", products);
        return "products/list";
    }

    @GetMapping("/{id}")
    public String viewProduct(@PathVariable Long id, Model model) {
        Product product = productDAO.findById(id);
        if (product == null) {
            return "redirect:/products";
        }
        model.addAttribute("product", product);
        return "products/view";
    }

    @GetMapping("/new")
    public String showProductForm(Model model) {
        model.addAttribute("product", new Product());
        model.addAttribute("categories", categoryDAO.findAll());
        return "products/form";
    }

    @PostMapping("/new")
    public String createProduct(@ModelAttribute Product product, RedirectAttributes redirectAttributes, Model model) {
        try {
            productDAO.insert(product);
            redirectAttributes.addFlashAttribute("successMessage", "Product created successfully!");
            return "redirect:/products";
        } catch (Exception e) {
            redirectAttributes.addFlashAttribute("errorMessage", "Error creating product: " + e.getMessage());
            model.addAttribute("categories", categoryDAO.findAll());
            return "redirect:/products/new";
        }
    }

    @GetMapping("/{id}/edit")
    public String showEditForm(@PathVariable Long id, Model model) {
        Product product = productDAO.findById(id);
        if (product == null) {
            return "redirect:/products";
        }
        model.addAttribute("product", product);
        model.addAttribute("categories", categoryDAO.findAll());
        return "products/form";
    }

    @PostMapping("/{id}/edit")
    public String updateProduct(@PathVariable Long id, @ModelAttribute Product product, RedirectAttributes redirectAttributes, Model model) {
        try {
            product.setProductId(id);
            productDAO.update(product);
            redirectAttributes.addFlashAttribute("successMessage", "Product updated successfully!");
            return "redirect:/products/" + id;
        } catch (Exception e) {
            redirectAttributes.addFlashAttribute("errorMessage", "Error updating product: " + e.getMessage());
            model.addAttribute("categories", categoryDAO.findAll());
            return "redirect:/products/" + id + "/edit";
        }
    }

    @PostMapping("/{id}/delete")
    public String deleteProduct(@PathVariable Long id, RedirectAttributes redirectAttributes) {
        try {
            productDAO.delete(id);
            redirectAttributes.addFlashAttribute("successMessage", "Product deleted successfully!");
        } catch (Exception e) {
            redirectAttributes.addFlashAttribute("errorMessage", "Error deleting product: " + e.getMessage());
        }
        return "redirect:/products";
    }
}

