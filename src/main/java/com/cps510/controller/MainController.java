package com.cps510.controller;

import com.cps510.dao.CustomerDAO;
import com.cps510.dao.OrderDAO;
import com.cps510.dao.ProductDAO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

/**
 * Main controller for the application dashboard/home page.
 * Handles the root URL and displays system statistics.
 * 
 * @author CPS510 Team
 * @version 1.0
 */
@Controller
public class MainController {

    @Autowired
    private CustomerDAO customerDAO;

    @Autowired
    private ProductDAO productDAO;

    @Autowired
    private OrderDAO orderDAO;

    /**
     * Displays the home page dashboard with system statistics.
     * Shows counts for customers, products, and orders.
     * 
     * @param model Spring MVC model for passing data to the view
     * @return View name "index" (maps to index.html template)
     */
    @GetMapping("/")
    public String index(Model model) {
        // Get statistics for dashboard
        long customerCount = customerDAO.findAll().size();
        long productCount = productDAO.findAll().size();
        long orderCount = orderDAO.findAll().size();
        
        model.addAttribute("customerCount", customerCount);
        model.addAttribute("productCount", productCount);
        model.addAttribute("orderCount", orderCount);
        
        return "index";
    }
}

