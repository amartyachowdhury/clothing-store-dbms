package com.cps510.controller;

import com.cps510.service.SchemaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

/**
 * Controller for administrative operations:
 * - Drop Tables
 * - Create Tables
 * - Populate Tables
 * - Query Tables
 */
@Controller
@RequestMapping("/admin")
public class AdminController {

    @Autowired
    private SchemaService schemaService;

    /**
     * Display the admin menu page.
     */
    @GetMapping
    public String adminMenu(Model model) {
        return "admin/menu";
    }

    /**
     * Drop all tables, views, and sequences.
     */
    @PostMapping("/drop-tables")
    public String dropTables(RedirectAttributes redirectAttributes) {
        String result = schemaService.dropAllTables();
        redirectAttributes.addFlashAttribute("message", result);
        redirectAttributes.addFlashAttribute("messageType", result.contains("Error") ? "danger" : "success");
        return "redirect:/admin";
    }

    /**
     * Create all tables, sequences, triggers, and views.
     */
    @PostMapping("/create-tables")
    public String createTables(RedirectAttributes redirectAttributes) {
        String result = schemaService.createAllTables();
        redirectAttributes.addFlashAttribute("message", result);
        redirectAttributes.addFlashAttribute("messageType", result.contains("Error") ? "danger" : "success");
        return "redirect:/admin";
    }

    /**
     * Populate all tables with sample data.
     */
    @PostMapping("/populate-tables")
    public String populateTables(RedirectAttributes redirectAttributes) {
        String result = schemaService.populateAllTables();
        redirectAttributes.addFlashAttribute("message", result);
        redirectAttributes.addFlashAttribute("messageType", result.contains("Error") ? "danger" : "success");
        return "redirect:/admin";
    }

    /**
     * Query tables and display summary.
     */
    @GetMapping("/query-tables")
    public String queryTables(Model model) {
        String result = schemaService.queryTables();
        model.addAttribute("queryResult", result);
        return "admin/menu";
    }
}

