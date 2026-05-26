package com.cps510.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.datasource.DriverManagerDataSource;

import javax.sql.DataSource;

/**
 * Database configuration class.
 * Configures the Oracle database connection and JDBC template beans.
 * Reads database connection properties from application.properties.
 * 
 * @author CPS510 Team
 * @version 1.0
 */
@Configuration
public class DatabaseConfig {

    @Value("${spring.datasource.url}")
    private String url;

    @Value("${spring.datasource.username}")
    private String username;

    @Value("${spring.datasource.password}")
    private String password;

    @Value("${spring.datasource.driver-class-name}")
    private String driverClassName;

    /**
     * Creates and configures the DataSource bean for Oracle database connection.
     * Connection details are read from application.properties.
     * 
     * @return Configured DataSource for Oracle database
     */
    @Bean
    public DataSource dataSource() {
        DriverManagerDataSource dataSource = new DriverManagerDataSource();
        dataSource.setDriverClassName(driverClassName);
        dataSource.setUrl(url);
        dataSource.setUsername(username);
        dataSource.setPassword(password);
        return dataSource;
    }

    /**
     * Creates and configures the JdbcTemplate bean for database operations.
     * JdbcTemplate provides a simplified interface for JDBC operations.
     * 
     * @param dataSource The DataSource bean to use for connections
     * @return Configured JdbcTemplate instance
     */
    @Bean
    public JdbcTemplate jdbcTemplate(DataSource dataSource) {
        return new JdbcTemplate(dataSource);
    }
}

