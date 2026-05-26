-- ==========================================================
-- A3 – Clothing Retail Store DBMS (Oracle 11g)
-- Tables: Category_, Customer, Employee, Product, Order_, Payment, OrderItem
-- Notes:
--   * CATEGORY is reserved -> using Category_
--   * ORDER is reserved -> using Order_
--   * 'size' column renamed to 'product_size', conflict with SQL keyword
-- ==========================================================

-- 1) CATEGORY_
CREATE TABLE Category_ (
  category_id          NUMBER           PRIMARY KEY,
  category_name        VARCHAR2(128)    NOT NULL
);

-- 2) CUSTOMER
CREATE TABLE Customer (
  customer_id           NUMBER          PRIMARY KEY,
  customer_name         VARCHAR2(128)   NOT NULL,
  customer_email        VARCHAR2(64),
  customer_phone        VARCHAR2(64)    NOT NULL
);


-- 3) EMPLOYEE
CREATE TABLE Employee (
  employee_id       NUMBER          PRIMARY KEY,
  employee_name     VARCHAR2(128)   NOT NULL,
  employee_email    VARCHAR2(64)    NOT NULL,
  employee_phone    VARCHAR2(64)    NOT NULL,
  employee_role     VARCHAR2(64)    NOT NULL
);


-- 4) PRODUCT (FK -> Category_)
CREATE TABLE Product (
  product_id            NUMBER          PRIMARY KEY,
  product_name          VARCHAR2(128)   NOT NULL,
  product_size          VARCHAR2(64)    NOT NULL,
  product_colour        VARCHAR2(64)    NOT NULL,
  product_brand         VARCHAR2(128)   NOT NULL,
  product_price         NUMBER(10,2)    NOT NULL,
  product_stock_qty     NUMBER          NOT NULL,
  category_id           NUMBER          NOT NULL,
  CONSTRAINT fk_product_category FOREIGN KEY (category_id) REFERENCES Category_(category_id),
  CONSTRAINT ck_product_price CHECK (product_price > 0),
  CONSTRAINT ck_product_stock CHECK (product_stock_qty >= 0)    
);


-- 5) ORDER_ (FKs -> Customer, Employee)
CREATE TABLE Order_ (
  order_id      NUMBER          PRIMARY KEY,
  order_date    DATE            NOT NULL,
  total_amount  NUMBER(12,2)    NOT NULL,
  order_status  VARCHAR2(64)    NOT NULL,
  customer_id   NUMBER          NOT NULL,
  employee_id   NUMBER          NOT NULL,
  CONSTRAINT fk_order_customer FOREIGN KEY (customer_id) REFERENCES Customer(customer_id),
  CONSTRAINT fk_order_employee FOREIGN KEY (employee_id) REFERENCES Employee(employee_id),
  CONSTRAINT ck_order_total CHECK (total_amount > 0)
);


-- 6) PAYMENT (FK -> Order_)
CREATE TABLE Payment (
  payment_id        NUMBER          PRIMARY KEY,
  order_id          NUMBER          NOT NULL,
  payment_method    VARCHAR2(64)    NOT NULL,
  payment_amount    NUMBER(12,2)    NOT NULL,
  payment_status    VARCHAR2(64)    NOT NULL,
  CONSTRAINT fk_payment_order FOREIGN KEY (order_id) REFERENCES Order_(order_id),
  CONSTRAINT ck_payment_method CHECK (payment_method IN ('Cash', 'Debit', 'Credit')),
  CONSTRAINT ck_payment_amount CHECK (payment_amount > 0)
);


-- 7) ORDERITEM (assoc: Order_ x Product) – composite PK; FKs -> Order_, Product
CREATE TABLE OrderItem (
  order_id    NUMBER       NOT NULL,
  product_id  NUMBER       NOT NULL,
  item_qty    NUMBER       NOT NULL,
  unit_price  NUMBER(10,2) NOT NULL,
  CONSTRAINT pk_orderitem PRIMARY KEY (order_id, product_id),
  CONSTRAINT fk_orderitem_order FOREIGN KEY (order_id)   REFERENCES Order_(order_id),
  CONSTRAINT fk_orderitem_product FOREIGN KEY (product_id) REFERENCES Product(product_id),
  CONSTRAINT ck_orderitem_qty CHECK (item_qty > 0),
  CONSTRAINT ck_orderitem_unit_price CHECK (unit_price > 0)
);