package com.cps510.controller;

import com.cps510.dao.*;
import com.cps510.model.Order;
import com.cps510.model.OrderItem;
import com.cps510.model.Product;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import java.math.BigDecimal;
import java.util.List;

/**
 * Controller for Order entity operations.
 * Handles HTTP requests for order CRUD operations, order item management, and search functionality.
 * Provides endpoints for listing, viewing, creating, updating, and deleting orders.
 * Also manages order items and automatically recalculates order totals.
 * 
 * @author CPS510 Team
 * @version 1.0
 */
@Controller
@RequestMapping("/orders")
public class OrderController {

    @Autowired
    private OrderDAO orderDAO;

    @Autowired
    private CustomerDAO customerDAO;

    @Autowired
    private EmployeeDAO employeeDAO;

    @Autowired
    private ProductDAO productDAO;

    @Autowired
    private OrderItemDAO orderItemDAO;

    @GetMapping
    public String listOrders(@RequestParam(required = false) String search, Model model) {
        List<Order> orders;
        if (search != null && !search.trim().isEmpty()) {
            orders = orderDAO.search(search.trim());
            model.addAttribute("searchTerm", search);
        } else {
            orders = orderDAO.findAll();
        }
        model.addAttribute("orders", orders);
        return "orders/list";
    }

    @GetMapping("/{id}")
    public String viewOrder(@PathVariable Long id, Model model) {
        Order order = orderDAO.findById(id);
        if (order == null) {
            return "redirect:/orders";
        }
        List<OrderItem> items = orderItemDAO.findByOrder(id);
        model.addAttribute("order", order);
        model.addAttribute("items", items);
        return "orders/view";
    }

    @GetMapping("/new")
    public String showOrderForm(Model model) {
        model.addAttribute("order", new Order());
        model.addAttribute("customers", customerDAO.findAll());
        model.addAttribute("employees", employeeDAO.findAll());
        return "orders/form";
    }

    @PostMapping("/new")
    public String createOrder(@ModelAttribute Order order, RedirectAttributes redirectAttributes) {
        try {
            if (order.getTotalAmount() == null) {
                order.setTotalAmount(BigDecimal.ZERO);
            }
            if (order.getOrderStatus() == null || order.getOrderStatus().isEmpty()) {
                order.setOrderStatus("Pending");
            }
            Long orderId = orderDAO.insert(order);
            redirectAttributes.addFlashAttribute("successMessage", "Order created successfully!");
            return "redirect:/orders/" + orderId;
        } catch (Exception e) {
            redirectAttributes.addFlashAttribute("errorMessage", "Error creating order: " + e.getMessage());
            return "redirect:/orders/new";
        }
    }

    @GetMapping("/{id}/items")
    public String viewOrderItems(@PathVariable Long id, Model model) {
        Order order = orderDAO.findById(id);
        if (order == null) {
            return "redirect:/orders";
        }
        List<OrderItem> items = orderItemDAO.findByOrder(id);
        model.addAttribute("order", order);
        model.addAttribute("items", items);
        model.addAttribute("products", productDAO.findAll());
        return "orders/items";
    }

    @PostMapping("/{id}/items/add")
    public String addOrderItem(@PathVariable Long id, @RequestParam Long productId,
                              @RequestParam Integer itemQty, @RequestParam BigDecimal unitPrice,
                              RedirectAttributes redirectAttributes) {
        try {
            Product product = productDAO.findById(productId);
            if (product == null) {
                redirectAttributes.addFlashAttribute("errorMessage", "Product not found!");
                return "redirect:/orders/" + id + "/items";
            }

            OrderItem item = new OrderItem(id, productId, itemQty, unitPrice);
            orderItemDAO.insert(item);

            // Recalculate order total
            BigDecimal total = orderItemDAO.calculateOrderTotal(id);
            orderDAO.updateTotalAmount(id, total);

            redirectAttributes.addFlashAttribute("successMessage", "Item added to order!");
            return "redirect:/orders/" + id + "/items";
        } catch (Exception e) {
            redirectAttributes.addFlashAttribute("errorMessage", "Error adding item: " + e.getMessage());
            return "redirect:/orders/" + id + "/items";
        }
    }

    @PostMapping("/{id}/items/delete")
    public String deleteOrderItem(@PathVariable Long id, @RequestParam Long productId,
                                 RedirectAttributes redirectAttributes) {
        try {
            orderItemDAO.delete(id, productId);
            
            // Recalculate order total
            BigDecimal total = orderItemDAO.calculateOrderTotal(id);
            orderDAO.updateTotalAmount(id, total);

            redirectAttributes.addFlashAttribute("successMessage", "Item removed from order!");
            return "redirect:/orders/" + id + "/items";
        } catch (Exception e) {
            redirectAttributes.addFlashAttribute("errorMessage", "Error removing item: " + e.getMessage());
            return "redirect:/orders/" + id + "/items";
        }
    }

    @GetMapping("/{id}/edit")
    public String showEditForm(@PathVariable Long id, Model model) {
        Order order = orderDAO.findById(id);
        if (order == null) {
            return "redirect:/orders";
        }
        model.addAttribute("order", order);
        model.addAttribute("customers", customerDAO.findAll());
        model.addAttribute("employees", employeeDAO.findAll());
        return "orders/form";
    }

    @PostMapping("/{id}/edit")
    public String updateOrder(@PathVariable Long id, @ModelAttribute Order order, RedirectAttributes redirectAttributes) {
        try {
            order.setOrderId(id);
            orderDAO.update(order);
            redirectAttributes.addFlashAttribute("successMessage", "Order updated successfully!");
            return "redirect:/orders/" + id;
        } catch (Exception e) {
            redirectAttributes.addFlashAttribute("errorMessage", "Error updating order: " + e.getMessage());
            return "redirect:/orders/" + id + "/edit";
        }
    }

    @PostMapping("/{id}/delete")
    public String deleteOrder(@PathVariable Long id, RedirectAttributes redirectAttributes) {
        try {
            // Delete order items first
            orderItemDAO.deleteByOrder(id);
            // Then delete the order
            orderDAO.delete(id);
            redirectAttributes.addFlashAttribute("successMessage", "Order deleted successfully!");
        } catch (Exception e) {
            redirectAttributes.addFlashAttribute("errorMessage", "Error deleting order: " + e.getMessage());
        }
        return "redirect:/orders";
    }
}

