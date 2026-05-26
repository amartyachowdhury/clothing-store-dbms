-- ======================================================================
-- CPS510 - Assignment 5
-- Stand-alone script: drops (if exist), creates schema, inserts data,
-- creates views, and runs advanced queries. Oracle 11g compatible.
-- Output spooled to a5_output.lst
-- ======================================================================

SET ECHO ON FEEDBACK ON VERIFY OFF PAGESIZE 200 LINESIZE 180 TRIMSPOOL ON
SET SERVEROUTPUT ON
ALTER SESSION SET NLS_DATE_FORMAT = 'YYYY-MM-DD';
SET DEFINE OFF;
SPOOL a5_output.lst

PROMPT =====================================================================
PROMPT A5: DROP OBJECTS (ignore errors if objects do not exist)
PROMPT =====================================================================

-- ---------- Drop views (ignore if not found)
BEGIN
  FOR v IN (SELECT view_name FROM user_views
            WHERE view_name IN ('V_ORDERS_SUMMARY','V_ORDER_LINE_ITEMS','V_PAYMENTS')) LOOP
    EXECUTE IMMEDIATE 'DROP VIEW '||v.view_name;
  END LOOP;
EXCEPTION WHEN OTHERS THEN NULL;
END;
/
-- ---------- Drop tables in child->parent order
BEGIN
  FOR t IN (SELECT table_name FROM user_tables
            WHERE table_name IN ('ORDERITEM','PAYMENT','ORDER_','PRODUCT','EMPLOYEE','CUSTOMER','CATEGORY_')) LOOP
    EXECUTE IMMEDIATE 'DROP TABLE '||t.table_name||' CASCADE CONSTRAINTS';
  END LOOP;
EXCEPTION WHEN OTHERS THEN NULL;
END;
/
-- ---------- Drop sequences (ignore if not found)
DECLARE
  PROCEDURE drop_seq(p_name VARCHAR2) IS
  BEGIN
    EXECUTE IMMEDIATE 'DROP SEQUENCE '||p_name;
  EXCEPTION WHEN OTHERS THEN NULL;
  END;
BEGIN
  drop_seq('CUSTOMER_SEQ');
  drop_seq('EMPLOYEE_SEQ');
  drop_seq('PRODUCT_SEQ');
  drop_seq('ORDER_SEQ');
  drop_seq('PAYMENT_SEQ');
END;
/
PROMPT Drops complete.

PROMPT =====================================================================
PROMPT A5: CREATE TABLES
PROMPT =====================================================================

-- 1) CATEGORY_
CREATE TABLE Category_ (
  category_id    NUMBER         PRIMARY KEY,
  category_name  VARCHAR2(64)   NOT NULL
);

-- 2) CUSTOMER
CREATE TABLE Customer (
  customer_id    NUMBER          PRIMARY KEY,
  customer_name  VARCHAR2(128)   NOT NULL,
  customer_email VARCHAR2(64),
  customer_phone VARCHAR2(64)    NOT NULL
);

-- 3) EMPLOYEE
CREATE TABLE Employee (
  employee_id    NUMBER          PRIMARY KEY,
  employee_name  VARCHAR2(128)   NOT NULL,
  employee_email VARCHAR2(64)    NOT NULL,
  employee_phone VARCHAR2(64)    NOT NULL,
  employee_role  VARCHAR2(64)    NOT NULL
);

-- 4) PRODUCT
CREATE TABLE Product (
  product_id        NUMBER          PRIMARY KEY,
  product_name      VARCHAR2(128)   NOT NULL,
  product_size      VARCHAR2(64)    NOT NULL,
  product_colour    VARCHAR2(64)    NOT NULL,
  product_brand     VARCHAR2(128)   NOT NULL,
  product_price     NUMBER(10,2)    NOT NULL,
  product_stock_qty NUMBER          NOT NULL,
  category_id       NUMBER          NOT NULL,
  CONSTRAINT FK_PROD_CAT   FOREIGN KEY (category_id) REFERENCES Category_(category_id),
  CONSTRAINT CK_PROD_PRICE CHECK (product_price > 0),
  CONSTRAINT CK_PROD_STOCK CHECK (product_stock_qty >= 0)
);

-- 5) ORDER_
CREATE TABLE Order_ (
  order_id      NUMBER          PRIMARY KEY,
  order_date    DATE            NOT NULL,
  total_amount  NUMBER(12,2)    NOT NULL,
  order_status  VARCHAR2(64)    NOT NULL,
  customer_id   NUMBER          NOT NULL,
  employee_id   NUMBER          NOT NULL,
  CONSTRAINT FK_ORDER_CUST  FOREIGN KEY (customer_id) REFERENCES Customer(customer_id),
  CONSTRAINT FK_ORDER_EMP   FOREIGN KEY (employee_id) REFERENCES Employee(employee_id),
  CONSTRAINT CK_ORDER_TOTAL CHECK (total_amount > 0)
);

-- 6) PAYMENT
CREATE TABLE Payment (
  payment_id      NUMBER          PRIMARY KEY,
  order_id        NUMBER          NOT NULL,
  payment_method  VARCHAR2(64)    NOT NULL,
  payment_amount  NUMBER(12,2)    NOT NULL,
  payment_status  VARCHAR2(64)    NOT NULL,
  CONSTRAINT FK_PAY_ORDER   FOREIGN KEY (order_id) REFERENCES Order_(order_id),
  CONSTRAINT CK_PAY_METHOD  CHECK (payment_method IN ('Cash','Debit','Credit')),
  CONSTRAINT CK_PAY_AMOUNT  CHECK (payment_amount > 0)
);

-- 7) ORDERITEM (bridge)
CREATE TABLE OrderItem (
  order_id    NUMBER       NOT NULL,
  product_id  NUMBER       NOT NULL,
  item_qty    NUMBER       NOT NULL,
  unit_price  NUMBER(10,2) NOT NULL,
  CONSTRAINT PK_ORDERITEM     PRIMARY KEY (order_id, product_id),
  CONSTRAINT FK_OI_ORDER      FOREIGN KEY (order_id)   REFERENCES Order_(order_id),
  CONSTRAINT FK_OI_PRODUCT    FOREIGN KEY (product_id) REFERENCES Product(product_id),
  CONSTRAINT CK_OI_QTY        CHECK (item_qty > 0),
  CONSTRAINT CK_OI_PRICE      CHECK (unit_price > 0)
);

PROMPT Tables created.

PROMPT =====================================================================
PROMPT A5: SEQUENCES + BEFORE INSERT TRIGGERS (auto IDs)
PROMPT =====================================================================

CREATE SEQUENCE CUSTOMER_SEQ START WITH 1 INCREMENT BY 1 NOCACHE;
CREATE SEQUENCE EMPLOYEE_SEQ START WITH 1 INCREMENT BY 1 NOCACHE;
CREATE SEQUENCE PRODUCT_SEQ  START WITH 1 INCREMENT BY 1 NOCACHE;
CREATE SEQUENCE ORDER_SEQ    START WITH 1 INCREMENT BY 1 NOCACHE;
CREATE SEQUENCE PAYMENT_SEQ  START WITH 1 INCREMENT BY 1 NOCACHE;

CREATE OR REPLACE TRIGGER CUSTOMER_BI
BEFORE INSERT ON Customer FOR EACH ROW
WHEN (NEW.customer_id IS NULL)
BEGIN SELECT CUSTOMER_SEQ.NEXTVAL INTO :NEW.customer_id FROM dual; END;
/
CREATE OR REPLACE TRIGGER EMPLOYEE_BI
BEFORE INSERT ON Employee FOR EACH ROW
WHEN (NEW.employee_id IS NULL)
BEGIN SELECT EMPLOYEE_SEQ.NEXTVAL INTO :NEW.employee_id FROM dual; END;
/
CREATE OR REPLACE TRIGGER PRODUCT_BI
BEFORE INSERT ON Product FOR EACH ROW
WHEN (NEW.product_id IS NULL)
BEGIN SELECT PRODUCT_SEQ.NEXTVAL INTO :NEW.product_id FROM dual; END;
/
CREATE OR REPLACE TRIGGER ORDER_BI
BEFORE INSERT ON Order_ FOR EACH ROW
WHEN (NEW.order_id IS NULL)
BEGIN SELECT ORDER_SEQ.NEXTVAL INTO :NEW.order_id FROM dual; END;
/
CREATE OR REPLACE TRIGGER PAYMENT_BI
BEFORE INSERT ON Payment FOR EACH ROW
WHEN (NEW.payment_id IS NULL)
BEGIN SELECT PAYMENT_SEQ.NEXTVAL INTO :NEW.payment_id FROM dual; END;
/

PROMPT Sequences & triggers created.

PROMPT =====================================================================
PROMPT A5: DATA INSERTION (sample dataset)
PROMPT =====================================================================

-- Categories (explicit IDs)
INSERT INTO Category_ (category_id, category_name) VALUES (1,'Men''s Wear');
INSERT INTO Category_ (category_id, category_name) VALUES (2,'Women''s Wear');
INSERT INTO Category_ (category_id, category_name) VALUES (3,'Accessories');

-- Customers (explicit IDs; triggers only fill when NULL)
INSERT INTO Customer (customer_id, customer_name, customer_email, customer_phone)
VALUES (1,'John Doe','john@example.com','416-555-1001');
INSERT INTO Customer (customer_id, customer_name, customer_email, customer_phone)
VALUES (2,'Jane Smith','jane@example.com','416-555-1002');
INSERT INTO Customer (customer_id, customer_name, customer_email, customer_phone)
VALUES (3,'Mark Chan','mark@example.com','416-555-1003');

-- Employees
INSERT INTO Employee (employee_id, employee_name, employee_email, employee_phone, employee_role)
VALUES (1,'Alice Johnson','alice@example.com','416-555-2001','Cashier');
INSERT INTO Employee (employee_id, employee_name, employee_email, employee_phone, employee_role)
VALUES (2,'Bob Lee','bob@example.com','416-555-2002','Cashier');

-- Products
INSERT INTO Product (product_id, product_name, product_size, product_colour, product_brand,
                     product_price, product_stock_qty, category_id)
VALUES (1,'Blue Jeans','M','Blue','Levis',59.99,100,1);

INSERT INTO Product (product_id, product_name, product_size, product_colour, product_brand,
                     product_price, product_stock_qty, category_id)
VALUES (2,'Red Dress','S','Red','Zara',89.50,80,2);

INSERT INTO Product (product_id, product_name, product_size, product_colour, product_brand,
                     product_price, product_stock_qty, category_id)
VALUES (3,'Leather Belt','L','Brown','Fossil',19.99,200,3);

-- Never-ordered item for Q4
INSERT INTO Product (product_id, product_name, product_size, product_colour, product_brand,
                     product_price, product_stock_qty, category_id)
VALUES (4,'Socks','M','White','Hanes',5.99,500,3);

-- Orders (two in Oct; one in Sep for INTERSECT demo)
INSERT INTO Order_ (order_id, order_date, total_amount, order_status, customer_id, employee_id)
VALUES (1, DATE '2025-10-04', 79.98, 'Completed', 1, 1);

INSERT INTO Order_ (order_id, order_date, total_amount, order_status, customer_id, employee_id)
VALUES (2, DATE '2025-10-05', 89.50, 'Pending',   2, 2);

INSERT INTO Order_ (order_id, order_date, total_amount, order_status, customer_id, employee_id)
VALUES (3, DATE '2025-09-28', 89.50, 'Completed', 2, 2);

-- Payments (no payment for order 3 on purpose)
INSERT INTO Payment (payment_id, order_id, payment_method, payment_amount, payment_status)
VALUES (1, 1, 'Credit', 79.98, 'Paid');

INSERT INTO Payment (payment_id, order_id, payment_method, payment_amount, payment_status)
VALUES (2, 2, 'Cash',   89.50, 'Pending');

-- Order lines
INSERT INTO OrderItem (order_id, product_id, item_qty, unit_price) VALUES (1, 1, 1, 59.99);
INSERT INTO OrderItem (order_id, product_id, item_qty, unit_price) VALUES (1, 3, 1, 19.99);
INSERT INTO OrderItem (order_id, product_id, item_qty, unit_price) VALUES (2, 2, 1, 89.50);
INSERT INTO OrderItem (order_id, product_id, item_qty, unit_price) VALUES (3, 2, 1, 89.50);

COMMIT;
PROMPT Data insertion complete.

-- Sync sequences to MAX(id)+1 so future auto IDs won’t collide
DECLARE
  PROCEDURE sync_seq(p_seq VARCHAR2, p_tab VARCHAR2, p_col VARCHAR2) IS
    v_max NUMBER; v_val NUMBER; v_diff NUMBER;
  BEGIN
    EXECUTE IMMEDIATE 'SELECT NVL(MAX('||p_col||'),0) FROM '||p_tab INTO v_max;
    EXECUTE IMMEDIATE 'SELECT '||p_seq||'.NEXTVAL FROM dual' INTO v_val;
    v_diff := v_max + 1 - v_val;
    IF v_diff > 0 THEN
      EXECUTE IMMEDIATE 'ALTER SEQUENCE '||p_seq||' INCREMENT BY '||v_diff;
      EXECUTE IMMEDIATE 'SELECT '||p_seq||'.NEXTVAL FROM dual' INTO v_val;
      EXECUTE IMMEDIATE 'ALTER SEQUENCE '||p_seq||' INCREMENT BY 1';
    END IF;
  EXCEPTION WHEN OTHERS THEN NULL;
  END;
BEGIN
  sync_seq('CUSTOMER_SEQ','Customer','customer_id');
  sync_seq('EMPLOYEE_SEQ','Employee','employee_id');
  sync_seq('PRODUCT_SEQ', 'Product', 'product_id');
  sync_seq('ORDER_SEQ',   'Order_',  'order_id');
  sync_seq('PAYMENT_SEQ', 'Payment', 'payment_id');
END;
/
PROMPT Sequences synchronized.

PROMPT =====================================================================
PROMPT A5: OPTIONAL VIEWS (used in A4-2; handy for screenshots)
PROMPT =====================================================================

CREATE OR REPLACE VIEW V_ORDERS_SUMMARY AS
SELECT
  o.order_id, o.order_date, o.order_status, o.total_amount,
  c.customer_name, e.employee_name
FROM Order_ o
JOIN Customer c ON c.customer_id = o.customer_id
JOIN Employee e ON e.employee_id = o.employee_id;

CREATE OR REPLACE VIEW V_ORDER_LINE_ITEMS AS
SELECT
  oi.order_id, p.product_id, p.product_name, p.product_brand,
  p.product_size, p.product_colour, cat.category_name,
  oi.item_qty, oi.unit_price, (oi.item_qty * oi.unit_price) AS line_total
FROM OrderItem oi
JOIN Product   p   ON p.product_id   = oi.product_id
JOIN Category_ cat ON cat.category_id = p.category_id;

CREATE OR REPLACE VIEW V_PAYMENTS AS
SELECT
  p.payment_id, p.order_id, p.payment_method, p.payment_amount, p.payment_status,
  o.order_date, c.customer_name
FROM Payment p
JOIN Order_  o ON o.order_id = p.order_id
JOIN Customer c ON c.customer_id = o.customer_id;

PROMPT Views created.

PROMPT =====================================================================
PROMPT A5: ADVANCED QUERIES (Q1..Q6)
PROMPT Each query shows a different concept: TOP-N, NOT EXISTS, HAVING,
PROMPT MINUS, INTERSECT, and anti-join (LEFT JOIN … IS NULL).
PROMPT =====================================================================

-- Formatting for nicer output
COLUMN product_name     FORMAT A32
COLUMN product_brand    FORMAT A20
COLUMN product_size     FORMAT A6
COLUMN product_colour   FORMAT A12
COLUMN category_name    FORMAT A24
COLUMN customer_name    FORMAT A32
COLUMN employee_name    FORMAT A32
COLUMN payment_method   FORMAT A12
COLUMN order_status     FORMAT A12
COLUMN product_revenue  FORMAT 999,999,990.00
COLUMN category_revenue FORMAT 999,999,990.00
COLUMN total_paid       FORMAT 999,999,990.00
COLUMN sales_total      FORMAT 999,999,990.00
COLUMN line_total       FORMAT 999,999,990.00

PROMPT === Q1: Top 5 products by revenue (join + aggregate + 11g TOP-N) ===
SELECT *
FROM (
  SELECT p.product_name, SUM(oi.item_qty * oi.unit_price) AS product_revenue
  FROM OrderItem oi JOIN Product p ON p.product_id = oi.product_id
  GROUP BY p.product_name
  ORDER BY product_revenue DESC
)
WHERE ROWNUM <= 5;

PROMPT === Q2: Orders with no PAID payment recorded (NOT EXISTS) ===
SELECT o.order_id, o.order_date, o.total_amount
FROM   Order_ o
WHERE  NOT EXISTS (
  SELECT 1 FROM Payment p
  WHERE  p.order_id = o.order_id
  AND    p.payment_status = 'Paid'
)
ORDER BY o.order_date DESC;

PROMPT === Q3: Category revenue > 100 (GROUP BY + HAVING) ===
SELECT cat.category_name, SUM(oi.item_qty * oi.unit_price) AS category_revenue
FROM   OrderItem oi
JOIN   Product   p   ON p.product_id    = oi.product_id
JOIN   Category_ cat ON cat.category_id = p.category_id
GROUP BY cat.category_name
HAVING  SUM(oi.item_qty * oi.unit_price) > 100
ORDER BY category_revenue DESC;

PROMPT === Q4: Products never ordered (SET OP: MINUS) ===
SELECT product_id, product_name FROM Product
MINUS
SELECT DISTINCT p.product_id, p.product_name
FROM   Product p JOIN OrderItem oi ON oi.product_id = p.product_id
ORDER BY product_name;

PROMPT === Q5: Customers who purchased in BOTH Month 9 and Month 10 (INTERSECT) ===
SELECT c1.customer_id, c1.customer_name
FROM (
  SELECT DISTINCT c.customer_id, c.customer_name
  FROM   Customer c JOIN Order_ o ON o.customer_id = c.customer_id
  WHERE  EXTRACT(MONTH FROM o.order_date) = 9
) c1
INTERSECT
SELECT c2.customer_id, c2.customer_name
FROM (
  SELECT DISTINCT c.customer_id, c.customer_name
  FROM   Customer c JOIN Order_ o ON o.customer_id = c.customer_id
  WHERE  EXTRACT(MONTH FROM o.order_date) = 10
) c2
ORDER BY customer_name;

PROMPT === Q6: Orders with NO payment row at all (LEFT JOIN anti-match) ===
SELECT o.order_id, o.order_date, o.order_status, o.total_amount
FROM   Order_ o
LEFT JOIN Payment p ON p.order_id = o.order_id
WHERE  p.order_id IS NULL
ORDER BY o.order_date DESC;

PROMPT =====================================================================
PROMPT End of A5 script
PROMPT =====================================================================
SPOOL OFF