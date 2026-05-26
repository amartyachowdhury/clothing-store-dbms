package com.cps510.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

import java.sql.Connection;
import java.sql.Statement;

/**
 * Service for managing database schema operations:
 * - Dropping tables, views, and sequences
 * - Creating tables, sequences, triggers, and views
 * - Populating tables with sample data
 * - Querying table data
 */
@Service
public class SchemaService {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    /**
     * Drops all tables, views, and sequences in the correct order.
     * Handles errors gracefully if objects don't exist.
     */
    public String dropAllTables() {
        try (Connection conn = jdbcTemplate.getDataSource().getConnection();
             Statement stmt = conn.createStatement()) {
            
            // Drop views first
            String dropViewsSQL = 
                "BEGIN " +
                "  FOR v IN (SELECT view_name FROM user_views " +
                "            WHERE view_name IN ('V_ORDERS_SUMMARY','V_ORDER_LINE_ITEMS','V_PAYMENTS')) LOOP " +
                "    EXECUTE IMMEDIATE 'DROP VIEW '||v.view_name; " +
                "  END LOOP; " +
                "EXCEPTION WHEN OTHERS THEN NULL; " +
                "END;";
            stmt.execute(dropViewsSQL);
            
            // Drop tables
            String dropTablesSQL =
                "BEGIN " +
                "  FOR t IN (SELECT table_name FROM user_tables " +
                "            WHERE table_name IN ('ORDERITEM','PAYMENT','ORDER_','PRODUCT','EMPLOYEE','CUSTOMER','CATEGORY_')) LOOP " +
                "    EXECUTE IMMEDIATE 'DROP TABLE '||t.table_name||' CASCADE CONSTRAINTS'; " +
                "  END LOOP; " +
                "EXCEPTION WHEN OTHERS THEN NULL; " +
                "END;";
            stmt.execute(dropTablesSQL);
            
            // Drop sequences
            String dropSeqsSQL =
                "DECLARE " +
                "  PROCEDURE drop_seq(p_name VARCHAR2) IS " +
                "  BEGIN " +
                "    EXECUTE IMMEDIATE 'DROP SEQUENCE '||p_name; " +
                "  EXCEPTION WHEN OTHERS THEN NULL; " +
                "  END; " +
                "BEGIN " +
                "  drop_seq('CUSTOMER_SEQ'); " +
                "  drop_seq('EMPLOYEE_SEQ'); " +
                "  drop_seq('PRODUCT_SEQ'); " +
                "  drop_seq('ORDER_SEQ'); " +
                "  drop_seq('PAYMENT_SEQ'); " +
                "END;";
            stmt.execute(dropSeqsSQL);
            
            return "All tables, views, and sequences dropped successfully.";
        } catch (Exception e) {
            return "Error dropping tables: " + e.getMessage();
        }
    }

    /**
     * Creates all tables, sequences, triggers, and views.
     */
    public String createAllTables() {
        try (Connection conn = jdbcTemplate.getDataSource().getConnection();
             Statement stmt = conn.createStatement()) {
            
            // Create tables
            stmt.execute("CREATE TABLE Category_ (category_id NUMBER PRIMARY KEY, category_name VARCHAR2(64) NOT NULL)");
            stmt.execute("CREATE TABLE Customer (customer_id NUMBER PRIMARY KEY, customer_name VARCHAR2(128) NOT NULL, customer_email VARCHAR2(64), customer_phone VARCHAR2(64) NOT NULL)");
            stmt.execute("CREATE TABLE Employee (employee_id NUMBER PRIMARY KEY, employee_name VARCHAR2(128) NOT NULL, employee_email VARCHAR2(64) NOT NULL, employee_phone VARCHAR2(64) NOT NULL, employee_role VARCHAR2(64) NOT NULL)");
            stmt.execute("CREATE TABLE Product (product_id NUMBER PRIMARY KEY, product_name VARCHAR2(128) NOT NULL, product_size VARCHAR2(64) NOT NULL, product_colour VARCHAR2(64) NOT NULL, product_brand VARCHAR2(128) NOT NULL, product_price NUMBER(10,2) NOT NULL, product_stock_qty NUMBER NOT NULL, category_id NUMBER NOT NULL, CONSTRAINT FK_PROD_CAT FOREIGN KEY (category_id) REFERENCES Category_(category_id), CONSTRAINT CK_PROD_PRICE CHECK (product_price > 0), CONSTRAINT CK_PROD_STOCK CHECK (product_stock_qty >= 0))");
            stmt.execute("CREATE TABLE Order_ (order_id NUMBER PRIMARY KEY, order_date DATE NOT NULL, total_amount NUMBER(12,2) NOT NULL, order_status VARCHAR2(64) NOT NULL, customer_id NUMBER NOT NULL, employee_id NUMBER NOT NULL, CONSTRAINT FK_ORDER_CUST FOREIGN KEY (customer_id) REFERENCES Customer(customer_id), CONSTRAINT FK_ORDER_EMP FOREIGN KEY (employee_id) REFERENCES Employee(employee_id), CONSTRAINT CK_ORDER_TOTAL CHECK (total_amount > 0))");
            stmt.execute("CREATE TABLE Payment (payment_id NUMBER PRIMARY KEY, order_id NUMBER NOT NULL, payment_method VARCHAR2(64) NOT NULL, payment_amount NUMBER(12,2) NOT NULL, payment_status VARCHAR2(64) NOT NULL, CONSTRAINT FK_PAY_ORDER FOREIGN KEY (order_id) REFERENCES Order_(order_id), CONSTRAINT CK_PAY_METHOD CHECK (payment_method IN ('Cash','Debit','Credit')), CONSTRAINT CK_PAY_AMOUNT CHECK (payment_amount > 0))");
            stmt.execute("CREATE TABLE OrderItem (order_id NUMBER NOT NULL, product_id NUMBER NOT NULL, item_qty NUMBER NOT NULL, unit_price NUMBER(10,2) NOT NULL, CONSTRAINT PK_ORDERITEM PRIMARY KEY (order_id, product_id), CONSTRAINT FK_OI_ORDER FOREIGN KEY (order_id) REFERENCES Order_(order_id), CONSTRAINT FK_OI_PRODUCT FOREIGN KEY (product_id) REFERENCES Product(product_id), CONSTRAINT CK_OI_QTY CHECK (item_qty > 0), CONSTRAINT CK_OI_PRICE CHECK (unit_price > 0))");
            
            // Create sequences
            stmt.execute("CREATE SEQUENCE CUSTOMER_SEQ START WITH 1 INCREMENT BY 1 NOCACHE");
            stmt.execute("CREATE SEQUENCE EMPLOYEE_SEQ START WITH 1 INCREMENT BY 1 NOCACHE");
            stmt.execute("CREATE SEQUENCE PRODUCT_SEQ START WITH 1 INCREMENT BY 1 NOCACHE");
            stmt.execute("CREATE SEQUENCE ORDER_SEQ START WITH 1 INCREMENT BY 1 NOCACHE");
            stmt.execute("CREATE SEQUENCE PAYMENT_SEQ START WITH 1 INCREMENT BY 1 NOCACHE");
            
            // Create triggers
            stmt.execute("CREATE OR REPLACE TRIGGER CUSTOMER_BI BEFORE INSERT ON Customer FOR EACH ROW WHEN (NEW.customer_id IS NULL) BEGIN SELECT CUSTOMER_SEQ.NEXTVAL INTO :NEW.customer_id FROM dual; END;");
            stmt.execute("CREATE OR REPLACE TRIGGER EMPLOYEE_BI BEFORE INSERT ON Employee FOR EACH ROW WHEN (NEW.employee_id IS NULL) BEGIN SELECT EMPLOYEE_SEQ.NEXTVAL INTO :NEW.employee_id FROM dual; END;");
            stmt.execute("CREATE OR REPLACE TRIGGER PRODUCT_BI BEFORE INSERT ON Product FOR EACH ROW WHEN (NEW.product_id IS NULL) BEGIN SELECT PRODUCT_SEQ.NEXTVAL INTO :NEW.product_id FROM dual; END;");
            stmt.execute("CREATE OR REPLACE TRIGGER ORDER_BI BEFORE INSERT ON Order_ FOR EACH ROW WHEN (NEW.order_id IS NULL) BEGIN SELECT ORDER_SEQ.NEXTVAL INTO :NEW.order_id FROM dual; END;");
            stmt.execute("CREATE OR REPLACE TRIGGER PAYMENT_BI BEFORE INSERT ON Payment FOR EACH ROW WHEN (NEW.payment_id IS NULL) BEGIN SELECT PAYMENT_SEQ.NEXTVAL INTO :NEW.payment_id FROM dual; END;");
            
            // Create views
            stmt.execute("CREATE OR REPLACE VIEW V_ORDERS_SUMMARY AS SELECT o.order_id, o.order_date, o.order_status, o.total_amount, c.customer_name, e.employee_name FROM Order_ o JOIN Customer c ON c.customer_id = o.customer_id JOIN Employee e ON e.employee_id = o.employee_id");
            stmt.execute("CREATE OR REPLACE VIEW V_ORDER_LINE_ITEMS AS SELECT oi.order_id, p.product_id, p.product_name, p.product_brand, p.product_size, p.product_colour, cat.category_name, oi.item_qty, oi.unit_price, (oi.item_qty * oi.unit_price) AS line_total FROM OrderItem oi JOIN Product p ON p.product_id = oi.product_id JOIN Category_ cat ON cat.category_id = p.category_id");
            stmt.execute("CREATE OR REPLACE VIEW V_PAYMENTS AS SELECT p.payment_id, p.order_id, p.payment_method, p.payment_amount, p.payment_status, o.order_date, c.customer_name FROM Payment p JOIN Order_ o ON o.order_id = p.order_id JOIN Customer c ON c.customer_id = o.customer_id");
            
            return "All tables, sequences, triggers, and views created successfully.";
        } catch (Exception e) {
            return "Error creating tables: " + e.getMessage();
        }
    }

    /**
     * Populates all tables with sample data.
     */
    public String populateAllTables() {
        try (Connection conn = jdbcTemplate.getDataSource().getConnection();
             Statement stmt = conn.createStatement()) {
            
            // Insert Categories
            stmt.execute("INSERT INTO Category_ (category_id, category_name) VALUES (1,'Men''s Wear')");
            stmt.execute("INSERT INTO Category_ (category_id, category_name) VALUES (2,'Women''s Wear')");
            stmt.execute("INSERT INTO Category_ (category_id, category_name) VALUES (3,'Accessories')");
            
            // Insert Customers
            stmt.execute("INSERT INTO Customer (customer_id, customer_name, customer_email, customer_phone) VALUES (1,'John Doe','john@example.com','416-555-1001')");
            stmt.execute("INSERT INTO Customer (customer_id, customer_name, customer_email, customer_phone) VALUES (2,'Jane Smith','jane@example.com','416-555-1002')");
            stmt.execute("INSERT INTO Customer (customer_id, customer_name, customer_email, customer_phone) VALUES (3,'Mark Chan','mark@example.com','416-555-1003')");
            
            // Insert Employees
            stmt.execute("INSERT INTO Employee (employee_id, employee_name, employee_email, employee_phone, employee_role) VALUES (1,'Alice Johnson','alice@example.com','416-555-2001','Cashier')");
            stmt.execute("INSERT INTO Employee (employee_id, employee_name, employee_email, employee_phone, employee_role) VALUES (2,'Bob Lee','bob@example.com','416-555-2002','Cashier')");
            
            // Insert Products
            stmt.execute("INSERT INTO Product (product_id, product_name, product_size, product_colour, product_brand, product_price, product_stock_qty, category_id) VALUES (1,'Blue Jeans','M','Blue','Levis',59.99,100,1)");
            stmt.execute("INSERT INTO Product (product_id, product_name, product_size, product_colour, product_brand, product_price, product_stock_qty, category_id) VALUES (2,'Red Dress','S','Red','Zara',89.50,80,2)");
            stmt.execute("INSERT INTO Product (product_id, product_name, product_size, product_colour, product_brand, product_price, product_stock_qty, category_id) VALUES (3,'Leather Belt','L','Brown','Fossil',19.99,200,3)");
            stmt.execute("INSERT INTO Product (product_id, product_name, product_size, product_colour, product_brand, product_price, product_stock_qty, category_id) VALUES (4,'Socks','M','White','Hanes',5.99,500,3)");
            
            // Insert Orders
            stmt.execute("INSERT INTO Order_ (order_id, order_date, total_amount, order_status, customer_id, employee_id) VALUES (1, DATE '2025-10-04', 79.98, 'Completed', 1, 1)");
            stmt.execute("INSERT INTO Order_ (order_id, order_date, total_amount, order_status, customer_id, employee_id) VALUES (2, DATE '2025-10-05', 89.50, 'Pending', 2, 2)");
            stmt.execute("INSERT INTO Order_ (order_id, order_date, total_amount, order_status, customer_id, employee_id) VALUES (3, DATE '2025-09-28', 89.50, 'Completed', 2, 2)");
            
            // Insert Payments
            stmt.execute("INSERT INTO Payment (payment_id, order_id, payment_method, payment_amount, payment_status) VALUES (1, 1, 'Credit', 79.98, 'Paid')");
            stmt.execute("INSERT INTO Payment (payment_id, order_id, payment_method, payment_amount, payment_status) VALUES (2, 2, 'Cash', 89.50, 'Pending')");
            
            // Insert OrderItems
            stmt.execute("INSERT INTO OrderItem (order_id, product_id, item_qty, unit_price) VALUES (1, 1, 1, 59.99)");
            stmt.execute("INSERT INTO OrderItem (order_id, product_id, item_qty, unit_price) VALUES (1, 3, 1, 19.99)");
            stmt.execute("INSERT INTO OrderItem (order_id, product_id, item_qty, unit_price) VALUES (2, 2, 1, 89.50)");
            stmt.execute("INSERT INTO OrderItem (order_id, product_id, item_qty, unit_price) VALUES (3, 2, 1, 89.50)");
            
            // Sync sequences
            String syncSeqsSQL =
                "DECLARE " +
                "  PROCEDURE sync_seq(p_seq VARCHAR2, p_tab VARCHAR2, p_col VARCHAR2) IS " +
                "    v_max NUMBER; v_val NUMBER; v_diff NUMBER; " +
                "  BEGIN " +
                "    EXECUTE IMMEDIATE 'SELECT NVL(MAX('||p_col||'),0) FROM '||p_tab INTO v_max; " +
                "    EXECUTE IMMEDIATE 'SELECT '||p_seq||'.NEXTVAL FROM dual' INTO v_val; " +
                "    v_diff := v_max + 1 - v_val; " +
                "    IF v_diff > 0 THEN " +
                "      EXECUTE IMMEDIATE 'ALTER SEQUENCE '||p_seq||' INCREMENT BY '||v_diff; " +
                "      EXECUTE IMMEDIATE 'SELECT '||p_seq||'.NEXTVAL FROM dual' INTO v_val; " +
                "      EXECUTE IMMEDIATE 'ALTER SEQUENCE '||p_seq||' INCREMENT BY 1'; " +
                "    END IF; " +
                "  EXCEPTION WHEN OTHERS THEN NULL; " +
                "  END; " +
                "BEGIN " +
                "  sync_seq('CUSTOMER_SEQ','Customer','customer_id'); " +
                "  sync_seq('EMPLOYEE_SEQ','Employee','employee_id'); " +
                "  sync_seq('PRODUCT_SEQ', 'Product', 'product_id'); " +
                "  sync_seq('ORDER_SEQ',   'Order_',  'order_id'); " +
                "  sync_seq('PAYMENT_SEQ', 'Payment', 'payment_id'); " +
                "END;";
            stmt.execute(syncSeqsSQL);
            
            conn.commit();
            return "Sample data inserted successfully.";
        } catch (Exception e) {
            return "Error populating tables: " + e.getMessage();
        }
    }

    /**
     * Queries and returns summary information about all tables.
     */
    public String queryTables() {
        StringBuilder result = new StringBuilder();
        
        try {
            String[] tables = {"Category_", "Customer", "Employee", "Product", "Order_", "Payment", "OrderItem"};
            
            for (String table : tables) {
                Integer count = jdbcTemplate.queryForObject(
                    "SELECT COUNT(*) FROM " + table, Integer.class);
                result.append(table).append(": ").append(count).append(" rows\n");
            }
            
            // Check views
            String[] views = {"V_ORDERS_SUMMARY", "V_ORDER_LINE_ITEMS", "V_PAYMENTS"};
            for (String view : views) {
                try {
                    Integer count = jdbcTemplate.queryForObject(
                        "SELECT COUNT(*) FROM " + view, Integer.class);
                    result.append(view).append(": ").append(count).append(" rows\n");
                } catch (Exception e) {
                    result.append(view).append(": view not found\n");
                }
            }
            
            return result.toString();
        } catch (Exception e) {
            return "Error querying tables: " + e.getMessage();
        }
    }
}

