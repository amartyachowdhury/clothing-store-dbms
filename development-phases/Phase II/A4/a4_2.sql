-- ==========================================================
-- PART 2 — VIEWS + ADDITIONAL QUERIES (append to a4_1.sql)
-- Clauses on separate lines; brief comments for each query.
-- ==========================================================

-- Make dates readable in screenshots
ALTER SESSION SET NLS_DATE_FORMAT = 'YYYY-MM-DD';

-------------------------------------------------------------
-- VIEWS
-------------------------------------------------------------

-- V1: Orders with customer & employee names (report header)
CREATE OR REPLACE VIEW v_orders_summary AS
SELECT
  o.order_id,
  o.order_date,
  o.order_status,
  o.total_amount,
  c.customer_name,
  e.employee_name
FROM
  Order_   o
JOIN
  Customer c ON c.customer_id  = o.customer_id
JOIN
  Employee e ON e.employee_id  = o.employee_id;

-- Quick check (screenshot this with the SQL visible)
SELECT
  *
FROM
  v_orders_summary
WHERE
  ROWNUM <= 10;

-- V2: Line items with product/category and computed line_total
CREATE OR REPLACE VIEW v_order_line_items AS
SELECT
  oi.order_id,
  p.product_id,
  p.product_name,
  p.product_brand,
  p.product_size,
  p.product_colour,
  cat.category_name,
  oi.item_qty,
  oi.unit_price,
  (oi.item_qty * oi.unit_price) AS line_total
FROM
  OrderItem  oi
JOIN
  Product    p   ON p.product_id    = oi.product_id
JOIN
  Category_  cat ON cat.category_id = p.category_id;

-- Quick check
SELECT
  *
FROM
  v_order_line_items
WHERE
  ROWNUM <= 10;

-- V3: Payments joined to orders and customers (collections view)
CREATE OR REPLACE VIEW v_payments AS
SELECT
  p.payment_id,
  p.order_id,
  p.payment_method,
  p.payment_amount,
  p.payment_status,
  o.order_date,
  c.customer_name
FROM
  Payment   p
JOIN
  Order_    o ON o.order_id     = p.order_id
JOIN
  Customer  c ON c.customer_id  = o.customer_id;

-- Quick check
SELECT
  *
FROM
  v_payments
WHERE
  ROWNUM <= 10;

-------------------------------------------------------------
-- ADDITIONAL QUERIES (use the views; DISTINCT/GROUP/ORDER)
-------------------------------------------------------------

-- Q1: Completed orders (from v_orders_summary), newest first
SELECT
  order_id,
  order_date,
  customer_name,
  employee_name,
  total_amount
FROM
  v_orders_summary
WHERE
  order_status = 'Completed'
ORDER BY
  order_date DESC;

-- Q2: Distinct payment methods actually used
SELECT
  DISTINCT payment_method
FROM
  Payment
ORDER BY
  payment_method;

-- Q3: Sales by category (sum of line totals; high→low)
SELECT
  category_name,
  SUM(line_total) AS category_revenue
FROM
  v_order_line_items
GROUP BY
  category_name
ORDER BY
  category_revenue DESC;

-- Q4: Top 5 products by revenue
SELECT
  *
FROM
  (
    SELECT
      product_name,
      SUM(line_total) AS product_revenue
    FROM
      v_order_line_items
    GROUP BY
      product_name
    ORDER BY
      product_revenue DESC
  )
WHERE
  ROWNUM <= 5;

-- Q5: Customer lifetime payments (from v_payments)
SELECT
  customer_name,
  SUM(payment_amount) AS total_paid
FROM
  v_payments
GROUP BY
  customer_name
ORDER BY
  total_paid DESC,
  customer_name;

-- Q6: Employee sales performance (sum of order totals)
SELECT
  e.employee_name,
  SUM(o.total_amount) AS sales_total
FROM
  Employee e
JOIN
  Order_   o ON o.employee_id = e.employee_id
GROUP BY
  e.employee_name
ORDER BY
  sales_total DESC,
  e.employee_name;

-- Q7: Orders with no recorded payment (left join anti-match)
SELECT
  o.order_id,
  o.order_date,
  o.order_status,
  o.total_amount,
  c.customer_name
FROM
  Order_   o
JOIN
  Customer c ON c.customer_id = o.customer_id
LEFT JOIN
  Payment  p ON p.order_id    = o.order_id
WHERE
  p.payment_id IS NULL
ORDER BY
  o.order_date DESC;

-- Q8: Average order value (AOV) by customer (orders only)
SELECT
  c.customer_name,
  COUNT(o.order_id)   AS num_orders,
  AVG(o.total_amount) AS avg_order_value
FROM
  Customer c
LEFT JOIN
  Order_   o ON o.customer_id = c.customer_id
GROUP BY
  c.customer_name
ORDER BY
  avg_order_value DESC NULLS LAST,
  num_orders DESC,
  c.customer_name;

-- (No COMMIT needed here unless you’re also inserting data above)