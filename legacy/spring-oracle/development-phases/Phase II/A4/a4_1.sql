-- ==========================================================
-- a4_1.sql  |  A4 (Part 1) – Inserts + simple queries (commented)
-- Schema: Category_, Customer, Employee, Product, Order_, Payment, OrderItem
-- Notes:
--   * Column names per A3:
--       - Category_: (category_id, category_name)
--       - OrderItem: (order_id, product_id, item_qty, unit_price)
--   * Each query has a clear comment explaining the intent.
--   * Clauses are on separate lines (SELECT / FROM / WHERE / GROUP BY / ORDER BY).
-- ==========================================================

-- Make dates readable in result grids (for screenshots)
ALTER SESSION SET NLS_DATE_FORMAT = 'YYYY-MM-DD';

-------------------------------------------------------------
-- SECTION 1 — INSERTS (populate every table with small, coherent data)
-------------------------------------------------------------

-- 1) CATEGORY_ — three categories used by the sample products
INSERT INTO Category_ (category_id, category_name) VALUES (1, 'Men''s Wear');
INSERT INTO Category_ (category_id, category_name) VALUES (2, 'Women''s Wear');
INSERT INTO Category_ (category_id, category_name) VALUES (3, 'Accessories');

-- 2) CUSTOMER — three distinct customers
INSERT INTO Customer (customer_id, customer_name, customer_email, customer_phone)
VALUES (1, 'John Doe',  'john.doe@example.com',  '555-1111');

INSERT INTO Customer (customer_id, customer_name, customer_email, customer_phone)
VALUES (2, 'Jane Smith','jane.smith@example.com','555-2222');

INSERT INTO Customer (customer_id, customer_name, customer_email, customer_phone)
VALUES (3, 'Mark Chan', 'mark.chan@example.com', '555-3333');

-- 3) EMPLOYEE — two employees with different roles
INSERT INTO Employee (employee_id, employee_name, employee_email, employee_phone, employee_role)
VALUES (1, 'Alice Johnson', 'alice.j@example.com', '555-4444', 'Cashier');

INSERT INTO Employee (employee_id, employee_name, employee_email, employee_phone, employee_role)
VALUES (2, 'Bob Lee',       'bob.lee@example.com',  '555-5555', 'Sales');

-- 4) PRODUCT — three products across the three categories
INSERT INTO Product
  (product_id, product_name, product_size, product_colour, product_brand, product_price, product_stock_qty, category_id)
VALUES
  (1, 'Blue Jeans', 'M', 'Blue', 'Levis', 59.99, 100, 1);

INSERT INTO Product
  (product_id, product_name, product_size, product_colour, product_brand, product_price, product_stock_qty, category_id)
VALUES
  (2, 'Red Dress', 'S', 'Red', 'Zara', 89.50,  50, 2);

INSERT INTO Product
  (product_id, product_name, product_size, product_colour, product_brand, product_price, product_stock_qty, category_id)
VALUES
  (3, 'Leather Belt', 'L', 'Brown', 'Fossil', 19.99, 200, 3);

-- 5) ORDER_ — two orders (yesterday: completed; today: pending)
INSERT INTO Order_ (order_id, order_date, total_amount, order_status, customer_id, employee_id)
VALUES (1, SYSDATE - 1, 79.98, 'Completed', 1, 1);

INSERT INTO Order_ (order_id, order_date, total_amount, order_status, customer_id, employee_id)
VALUES (2, SYSDATE,     89.50, 'Pending',   2, 2);

-- 6) PAYMENT — one paid, one pending; matches the two orders above
INSERT INTO Payment (payment_id, order_id, payment_method, payment_amount, payment_status)
VALUES (1, 1, 'Credit', 79.98, 'Paid');

INSERT INTO Payment (payment_id, order_id, payment_method, payment_amount, payment_status)
VALUES (2, 2, 'Cash',   89.50, 'Pending');

-- 7) ORDERITEM — line items for each order (quantities and unit prices)
--    Order 1: Blue Jeans + Leather Belt = 59.99 + 19.99 = 79.98
INSERT INTO OrderItem (order_id, product_id, item_qty, unit_price) VALUES (1, 1, 1, 59.99);
INSERT INTO OrderItem (order_id, product_id, item_qty, unit_price) VALUES (1, 3, 1, 19.99);
--    Order 2: Red Dress = 89.50
INSERT INTO OrderItem (order_id, product_id, item_qty, unit_price) VALUES (2, 2, 1, 89.50);


-------------------------------------------------------------
-- SECTION 2 — SIMPLE QUERIES (≥ 8; at least one per table)
-------------------------------------------------------------

-- Q1 — CATEGORY_ + PRODUCT:
--      Counts how many products exist in each category.
--      LEFT JOIN is used so categories with zero products still appear.
SELECT
  c.category_name              AS category,
  COUNT(p.product_id)          AS product_count
FROM
  Category_ c
LEFT JOIN
  Product p
ON
  p.category_id = c.category_id
GROUP BY
  c.category_name
ORDER BY
  product_count DESC,
  category;

-- Q2 — CUSTOMER:
--      Lists all customers alphabetically, showing contact info.
SELECT
  c.customer_id,
  c.customer_name,
  c.customer_email,
  c.customer_phone
FROM
  Customer c
ORDER BY
  c.customer_name;

-- Q3 — EMPLOYEE:
--      Shows headcount per employee role (simple GROUP BY).
SELECT
  e.employee_role,
  COUNT(*) AS headcount
FROM
  Employee e
GROUP BY
  e.employee_role
ORDER BY
  headcount DESC;

-- Q4 — PRODUCT:
--      Returns products priced over $50, highest price first.
SELECT
  p.product_id,
  p.product_name,
  p.product_price
FROM
  Product p
WHERE
  p.product_price > 50
ORDER BY
  p.product_price DESC;

-- Q5 — ORDER_:
--      Lists orders placed in the last 7 days, newest first.
--      Useful to confirm recent activity by date/status/total.
SELECT
  o.order_id,
  o.order_date,
  o.order_status,
  o.total_amount
FROM
  Order_ o
WHERE
  o.order_date >= TRUNC(SYSDATE) - 7
ORDER BY
  o.order_date DESC;

-- Q6 — PAYMENT:
--      Aggregates total money collected per payment method.
--      Validates that amounts sum as expected across methods.
SELECT
  p.payment_method,
  SUM(p.payment_amount) AS total_collected
FROM
  Payment p
GROUP BY
  p.payment_method
ORDER BY
  total_collected DESC;

-- Q7 — ORDERITEM:
--      Rolls up line items per order:
--      * total_items = sum of item quantities
--      * line_total = sum of (item_qty * unit_price)
SELECT
  oi.order_id,
  SUM(oi.item_qty)                    AS total_items,
  SUM(oi.item_qty * oi.unit_price)    AS line_total
FROM
  OrderItem oi
GROUP BY
  oi.order_id
ORDER BY
  oi.order_id;

-- Q8 — CUSTOMER → ORDER_ → PAYMENT:
--      Customer-level summary:
--      * num_orders = how many orders a customer has
--      * total_paid = sum of payments received (0 if none)
--      LEFT JOINs ensure customers with no orders still appear.
SELECT
  c.customer_name,
  COUNT(DISTINCT o.order_id)          AS num_orders,
  SUM(NVL(p.payment_amount, 0))       AS total_paid
FROM
  Customer c
LEFT JOIN
  Order_   o ON o.customer_id = c.customer_id
LEFT JOIN
  Payment  p ON p.order_id     = o.order_id
GROUP BY
  c.customer_name
ORDER BY
  total_paid DESC,
  num_orders DESC,
  c.customer_name;

-- Persist the inserted rows
COMMIT;