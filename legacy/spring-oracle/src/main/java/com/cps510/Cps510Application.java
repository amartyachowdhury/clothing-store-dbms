package com.cps510;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * Main Spring Boot application class.
 * Entry point for the CPS510 Database Management System web application.
 * 
 * @author CPS510 Team
 * @version 1.0
 */
@SpringBootApplication
public class Cps510Application {

    /**
     * Main method that starts the Spring Boot application.
     * 
     * @param args Command line arguments
     */
    public static void main(String[] args) {
        SpringApplication.run(Cps510Application.class, args);
    }
}

