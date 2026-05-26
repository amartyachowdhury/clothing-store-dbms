package com.cps510.controller;

import com.cps510.dao.OrderDAO;
import com.cps510.dao.PaymentDAO;
import com.cps510.model.Payment;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import java.math.BigDecimal;
import java.util.List;

/**
 * Controller for Payment entity operations.
 * Handles HTTP requests for payment CRUD operations and search functionality.
 * Provides endpoints for listing, viewing, creating, updating, and deleting payments.
 * Automatically updates order status based on payment status (e.g., marks orders as "Completed" when fully paid).
 * 
 * @author CPS510 Team
 * @version 1.0
 */
@Controller
@RequestMapping("/payments")
public class PaymentController {

    @Autowired
    private PaymentDAO paymentDAO;

    @Autowired
    private OrderDAO orderDAO;

    @GetMapping
    public String listPayments(@RequestParam(required = false) String search, Model model) {
        List<Payment> payments;
        if (search != null && !search.trim().isEmpty()) {
            payments = paymentDAO.search(search.trim());
            model.addAttribute("searchTerm", search);
        } else {
            payments = paymentDAO.findAll();
        }
        model.addAttribute("payments", payments);
        return "payments/list";
    }

    @GetMapping("/{id}")
    public String viewPayment(@PathVariable Long id, Model model) {
        Payment payment = paymentDAO.findById(id);
        if (payment == null) {
            return "redirect:/payments";
        }
        model.addAttribute("payment", payment);
        return "payments/view";
    }

    @GetMapping("/new")
    public String showPaymentForm(@RequestParam(required = false) Long orderId, Model model) {
        Payment payment = new Payment();
        if (orderId != null) {
            payment.setOrderId(orderId);
        }
        model.addAttribute("payment", payment);
        model.addAttribute("orders", orderDAO.findAll());
        return "payments/form";
    }

    @PostMapping("/new")
    public String createPayment(@ModelAttribute Payment payment, RedirectAttributes redirectAttributes) {
        try {
            if (payment.getPaymentStatus() == null || payment.getPaymentStatus().isEmpty()) {
                payment.setPaymentStatus("Pending");
            }
            paymentDAO.insert(payment);
            
            // Update order status based on payment status
            updateOrderStatusBasedOnPayments(payment.getOrderId());
            
            redirectAttributes.addFlashAttribute("successMessage", "Payment created successfully!");
            return "redirect:/payments";
        } catch (Exception e) {
            redirectAttributes.addFlashAttribute("errorMessage", "Error creating payment: " + e.getMessage());
            return "redirect:/payments/new";
        }
    }

    @GetMapping("/{id}/edit")
    public String showEditForm(@PathVariable Long id, Model model) {
        Payment payment = paymentDAO.findById(id);
        if (payment == null) {
            return "redirect:/payments";
        }
        model.addAttribute("payment", payment);
        model.addAttribute("orders", orderDAO.findAll());
        return "payments/form";
    }

    @PostMapping("/{id}/edit")
    public String updatePayment(@PathVariable Long id, @ModelAttribute Payment payment, RedirectAttributes redirectAttributes) {
        try {
            payment.setPaymentId(id);
            Long orderId = payment.getOrderId();
            paymentDAO.update(payment);
            
            // Update order status based on payment status
            updateOrderStatusBasedOnPayments(orderId);
            
            redirectAttributes.addFlashAttribute("successMessage", "Payment updated successfully!");
            return "redirect:/payments/" + id;
        } catch (Exception e) {
            redirectAttributes.addFlashAttribute("errorMessage", "Error updating payment: " + e.getMessage());
            return "redirect:/payments/" + id + "/edit";
        }
    }

    @PostMapping("/{id}/delete")
    public String deletePayment(@PathVariable Long id, RedirectAttributes redirectAttributes) {
        try {
            // Get the order ID before deleting
            Payment payment = paymentDAO.findById(id);
            Long orderId = payment != null ? payment.getOrderId() : null;
            
            paymentDAO.delete(id);
            
            // Update order status after deletion (order might no longer be fully paid)
            if (orderId != null) {
                updateOrderStatusBasedOnPayments(orderId);
            }
            
            redirectAttributes.addFlashAttribute("successMessage", "Payment deleted successfully!");
        } catch (Exception e) {
            redirectAttributes.addFlashAttribute("errorMessage", "Error deleting payment: " + e.getMessage());
        }
        return "redirect:/payments";
    }

    /**
     * Updates the order status based on payment status.
     * If the order is fully paid (total paid >= order total), sets status to "Completed".
     * Otherwise, keeps it as "Pending".
     */
    private void updateOrderStatusBasedOnPayments(Long orderId) {
        try {
            BigDecimal orderTotal = orderDAO.getOrderTotalAmount(orderId);
            BigDecimal totalPaid = paymentDAO.getTotalPaidAmount(orderId);
            
            // Compare with tolerance for floating point comparison
            if (totalPaid.compareTo(orderTotal) >= 0 && orderTotal.compareTo(BigDecimal.ZERO) > 0) {
                // Order is fully paid
                orderDAO.updateOrderStatus(orderId, "Completed");
            } else {
                // Order is not fully paid yet
                orderDAO.updateOrderStatus(orderId, "Pending");
            }
        } catch (Exception e) {
            // Log error but don't fail the payment operation
            System.err.println("Error updating order status for order " + orderId + ": " + e.getMessage());
        }
    }
}

