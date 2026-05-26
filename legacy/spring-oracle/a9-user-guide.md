# CPS510 Database Management System - User Guide

**Assignment 9 - User Guide (a9.pdf)**  
**Clothing Retail Store DBMS**

---

## Table of Contents

1. [Introduction](#introduction)
2. [Prerequisites](#prerequisites)
3. [Installation & Setup](#installation--setup)
4. [Launching the Application](#launching-the-application)
5. [Database Setup (First Time)](#database-setup-first-time)
6. [Using the Application](#using-the-application)
   - [Dashboard](#dashboard)
   - [Customer Management](#customer-management)
   - [Product Management](#product-management)
   - [Order Management](#order-management)
   - [Payment Tracking](#payment-tracking)
   - [Search Functionality](#search-functionality)
   - [Schema Management (Admin Menu)](#schema-management-admin-menu)
7. [Features Overview](#features-overview)
8. [Troubleshooting](#troubleshooting)
9. [Assignment Requirements Coverage](#assignment-requirements-coverage)

---

## Introduction

This user guide provides step-by-step instructions for launching and using the CPS510 Database Management System web application. The application is a complete database management system for a Clothing Retail Store, built with Spring Boot and connected to Oracle 11g database.

### What This Application Does

The CPS510 DBMS allows users to:
- Manage customer information
- Manage product catalog with categories and inventory
- Create and manage orders with order items
- Track payments for orders
- Search for records across all entities
- Manage database schema through an admin interface

---

## Prerequisites

Before launching the application, ensure you have the following installed:

### Required Software

1. **Java 11 or Higher**
   - Check installation: `java -version`
   - Download from: https://adoptium.net/

2. **Maven 3.6 or Higher**
   - Check installation: `mvn --version`
   - Install via Homebrew (Mac): `brew install maven`
   - Or download from: https://maven.apache.org/download.cgi

3. **Oracle 11g Database Access**
   - Access to Ryerson Oracle server: `oracle.scs.ryerson.ca:1521:orcl`
   - Your Ryerson database credentials (username and password)
   - OR local Oracle database instance

### Network Requirements

- Internet connection (for downloading dependencies during first build)
- Access to Ryerson Oracle database (if using school database)
- VPN connection may be required to access Ryerson's database from off-campus

---

## Installation & Setup

### Step 1: Obtain the Project

**Option A: Clone from GitHub**
```bash
git clone https://github.com/your-username/CPS510-DBMS.git
cd CPS510-DBMS
```

**Option B: Download and Extract**
1. Download the `a9.zip` file from GitHub
2. Extract the zip file
3. Open terminal/command prompt in the extracted folder

### Step 2: Configure Database Credentials

You need to configure your database credentials before launching.

**Option 1: Using Environment Variables (Recommended)**

For Unix/Mac:
```bash
export DB_USERNAME=your_ryerson_username
export DB_PASSWORD=your_ryerson_password
```

For Windows Command Prompt:
```cmd
set DB_USERNAME=your_ryerson_username
set DB_PASSWORD=your_ryerson_password
```

For Windows PowerShell:
```powershell
$env:DB_USERNAME="your_ryerson_username"
$env:DB_PASSWORD="your_ryerson_password"
```

**Option 2: Edit application.properties File**

1. Open the file: `src/main/resources/application.properties`
2. Find these lines:
   ```properties
   spring.datasource.username=your_username
   spring.datasource.password=your_password
   ```
3. Replace `your_username` and `your_password` with your actual Ryerson credentials
4. Save the file

**Note**: If using environment variables, the application will use those first. Otherwise, it will use the values in `application.properties`.

### Step 3: Verify Configuration

Check that the database URL is correct in `application.properties`:
```properties
spring.datasource.url=jdbc:oracle:thin:@oracle.scs.ryerson.ca:1521:orcl
```

If using a local Oracle database, update this URL accordingly.

---

## Launching the Application

### Method 1: Using Maven (Recommended)

1. **Open terminal/command prompt** in the project directory

2. **Build the project** (first time or after changes):
   ```bash
   mvn clean package
   ```
   This will:
   - Download dependencies (first time only)
   - Compile Java source code
   - Create executable JAR file

3. **Run the application**:
   ```bash
   mvn spring-boot:run
   ```

4. **Wait for startup message**:
   You should see:
   ```
   Started Cps510Application in X.XXX seconds
   ```

5. **Access the application**:
   Open your web browser and navigate to:
   ```
   http://localhost:8080
   ```

### Method 2: Using Executable JAR

1. **Build the JAR file**:
   ```bash
   mvn clean package
   ```

2. **Run the JAR file**:
   ```bash
   java -jar target/cps510-dbms-1.0.0.jar
   ```

3. **Access the application**:
   Open browser: `http://localhost:8080`

### Troubleshooting Launch Issues

**Port 8080 Already in Use:**
```bash
# Find and kill process on port 8080
lsof -ti:8080 | xargs kill -9
```

Or change port in `application.properties`:
```properties
server.port=8081
```

**Database Connection Failed:**
- Verify your credentials are correct
- Check if you have network access to Ryerson Oracle server
- Ensure VPN is connected (if required)
- Verify database URL is correct

**Build Errors:**
- Ensure Java 11+ is installed
- Ensure Maven is installed
- Check internet connection (needed for dependencies)

---

## Database Setup (First Time)

**IMPORTANT**: Before using the application, you must set up the database schema and populate it with sample data.

### Step 1: Access Admin Menu

1. Launch the application (see [Launching the Application](#launching-the-application))
2. Open browser: `http://localhost:8080`
3. Click on **"Admin"** in the navigation menu
   OR navigate directly to: `http://localhost:8080/admin`

### Step 2: Create Database Schema

1. On the Admin menu page, you'll see 4 options:
   - Drop Tables
   - Create Tables
   - Populate Tables
   - Query Tables

2. Click the **"Create Tables"** button (green card)
   - This creates all database tables, sequences, triggers, and views
   - Wait for success message: "All tables, sequences, triggers, and views created successfully."

### Step 3: Populate with Sample Data

1. Click the **"Populate Tables"** button (blue card)
   - This inserts sample data into all tables:
     - 3 Categories (Men's Wear, Women's Wear, Accessories)
     - 3 Customers
     - 2 Employees
     - 4 Products
     - 3 Orders
     - 2 Payments
     - 4 Order Items
   - Wait for success message: "Sample data inserted successfully."

### Step 4: Verify Database Setup

1. Click the **"Query Tables"** button (blue card)
2. You should see a summary showing:
   ```
   Category_: 3 rows
   Customer: 3 rows
   Employee: 2 rows
   Product: 4 rows
   Order_: 3 rows
   Payment: 2 rows
   OrderItem: 4 rows
   V_ORDERS_SUMMARY: 3 rows
   V_ORDER_LINE_ITEMS: 4 rows
   V_PAYMENTS: 2 rows
   ```

3. If you see data counts, database setup is complete! ✅

### Step 5: Start Using the Application

Now you can navigate back to the dashboard and start using all features:
- Go to: `http://localhost:8080`
- You'll see the dashboard with statistics

**Note**: If you need to start fresh, you can:
1. Click "Drop Tables" (removes everything)
2. Click "Create Tables" (recreates schema)
3. Click "Populate Tables" (adds sample data)

---

## Using the Application

### Dashboard

**Access**: `http://localhost:8080`

The dashboard provides an overview of your database:
- **Total Customers**: Number of customers in database
- **Total Products**: Number of products in catalog
- **Total Orders**: Number of orders placed

**Quick Actions**:
- **New Customer**: Create a new customer
- **New Product**: Add a new product
- **New Order**: Create a new order
- **New Payment**: Record a payment
- **Schema Management**: Access admin menu

**Navigation**:
Use the top navigation bar to access:
- Home (Dashboard)
- Customers
- Products
- Orders
- Payments
- Admin

---

### Customer Management

**Access**: `http://localhost:8080/customers` or click "Customers" in navigation

#### View All Customers

The Customers page displays a table with:
- Customer ID
- Customer Name
- Email Address
- Phone Number
- Actions (View, Edit, Delete)

#### Search for Customers

1. Use the **search box** at the top of the page
2. Enter search term (name, email, or phone)
3. Click **"Search"** button
4. Results are filtered and displayed
5. Click **"Clear Search"** to show all customers again

**Search Examples**:
- Search "John" - finds customers with "John" in name
- Search "416" - finds customers with "416" in phone
- Search "@example.com" - finds customers with that email domain

#### Create New Customer

1. Click **"New Customer"** button (top right)
2. Fill in the form:
   - **Name** (required): Customer's full name
   - **Email** (optional): Customer's email address
   - **Phone** (required): Customer's phone number
3. Click **"Save"** or **"Submit"**
4. You'll be redirected to the customers list with a success message

#### View Customer Details

1. Click **"View"** button next to any customer
2. See full customer information
3. Options to Edit or Delete customer

#### Edit Customer

1. Click **"Edit"** button next to a customer
   OR click **"View"** then **"Edit"**
2. Modify any fields
3. Click **"Save"** or **"Update"**
4. Changes are saved to database

#### Delete Customer

1. Click **"Delete"** button next to a customer
2. Confirm deletion in the popup dialog
3. Customer is removed from database
4. Success message displayed

**Note**: Deleting a customer may fail if they have associated orders (foreign key constraint).

---

### Product Management

**Access**: `http://localhost:8080/products` or click "Products" in navigation

#### View All Products

The Products page displays:
- Product ID
- Product Name
- Brand
- Size
- Color
- Price
- Stock Quantity
- Category
- Actions (View, Edit, Delete)

#### Search for Products

1. Use the **search box** at the top
2. Search by:
   - Product name
   - Brand
   - Color
   - Category name
3. Click **"Search"**
4. Results are filtered instantly

**Example Searches**:
- "Jeans" - finds all jeans products
- "Blue" - finds all blue products
- "Men's Wear" - finds products in that category

#### Create New Product

1. Click **"New Product"** button
2. Fill in the form:
   - **Name** (required): Product name (e.g., "Blue Jeans")
   - **Size** (required): Size (e.g., "S", "M", "L", "XL")
   - **Color** (required): Product color (e.g., "Blue", "Red")
   - **Brand** (required): Brand name (e.g., "Levis", "Nike")
   - **Price** (required): Product price (e.g., 59.99)
   - **Stock Quantity** (required): Available inventory (e.g., 100)
   - **Category** (required): Select from dropdown
     - Men's Wear
     - Women's Wear
     - Accessories
3. Click **"Save"**
4. Product is added to catalog

#### View Product Details

1. Click **"View"** button
2. See complete product information including:
   - All product attributes
   - Category information
   - Stock level

#### Edit Product

1. Click **"Edit"** button
2. Modify any product fields
3. Update price, stock quantity, or other attributes
4. Click **"Save"**

#### Delete Product

1. Click **"Delete"** button
2. Confirm deletion
3. Product is removed

**Note**: Cannot delete products that are in existing orders.

---

### Order Management

**Access**: `http://localhost:8080/orders` or click "Orders" in navigation

#### View All Orders

The Orders page displays:
- Order ID
- Order Date
- Customer Name
- Employee Name
- Total Amount
- Status (with color-coded badges):
  - Green: Completed
  - Yellow: Pending
  - Gray: Other statuses
- Actions (View, Items, Delete)

#### Search for Orders

1. Use the **search box**
2. Search by:
   - Order ID
   - Customer name
   - Employee name
   - Order status
3. Filtered results displayed

**Example**: Search "Completed" to see all completed orders

#### Create New Order

1. Click **"New Order"** button
2. Fill in the form:
   - **Order Date** (defaults to today)
   - **Customer**: Select from dropdown
   - **Employee**: Select from dropdown
   - **Total Amount**: Will be calculated automatically when items added
   - **Status**: Defaults to "Pending"
3. Click **"Save"**
4. Order is created (initially with $0.00 total)
5. Add items to the order (see below)

#### View Order Details

1. Click **"View"** button
2. See complete order information:
   - Order details
   - Customer information
   - Employee information
   - Order items (if any)
   - Payment information

#### Manage Order Items

1. Click **"Items"** button next to an order
2. View all items in the order
3. **Add Item**:
   - Select Product from dropdown
   - Enter Quantity
   - Enter Unit Price
   - Click "Add Item"
   - Order total automatically recalculates
4. **Remove Item**:
   - Click "Delete" next to an item
   - Order total automatically recalculates

**Important**: Order totals are automatically calculated based on items (quantity × unit price).

#### Edit Order

1. Click **"Edit"** button (if available)
2. Modify order details:
   - Change date
   - Change customer or employee
   - Update status
3. Click **"Save"**

#### Delete Order

1. Click **"Delete"** button
2. Confirm deletion
3. Order and all its items are removed

---

### Payment Tracking

**Access**: `http://localhost:8080/payments` or click "Payments" in navigation

#### View All Payments

The Payments page displays:
- Payment ID
- Order ID
- Customer Name
- Order Date
- Payment Method (Cash, Debit, Credit)
- Payment Amount
- Status (with badges):
  - Green: Paid
  - Yellow: Pending
- Actions (View, Delete)

#### Search for Payments

1. Use the **search box**
2. Search by:
   - Payment ID
   - Order ID
   - Payment method
   - Payment status
   - Amount
3. Filtered results displayed

#### Create New Payment

1. Click **"New Payment"** button
2. Fill in the form:
   - **Order**: Select order from dropdown
   - **Payment Method**: Select (Cash, Debit, Credit)
   - **Payment Amount**: Enter amount
   - **Payment Status**: Select (Paid or Pending)
3. Click **"Save"**
4. Payment is recorded
5. **Automatic Feature**: If payment is marked "Paid" and order is fully paid, order status automatically changes to "Completed"

#### View Payment Details

1. Click **"View"** button
2. See complete payment information
3. See associated order details

#### Edit Payment

1. Click **"Edit"** button
2. Modify payment details:
   - Change amount
   - Change status
   - Change payment method
3. Click **"Save"**
4. **Automatic Feature**: Order status is automatically updated based on payment status

#### Delete Payment

1. Click **"Delete"** button
2. Confirm deletion
3. Payment is removed
4. **Automatic Feature**: Order status is automatically updated (may revert to "Pending" if no longer fully paid)

---

### Search Functionality

**Available on all list pages**: Customers, Products, Orders, Payments

#### How to Search

1. **Locate the search box** at the top of any list page
2. **Enter your search term**
3. **Click "Search"** button
4. **View filtered results**

#### Search Features

- **Case-insensitive**: Searches work regardless of capitalization
- **Partial matching**: Finds records containing your search term
- **Multiple fields**: Searches across relevant fields for each entity

#### Search Examples

**Customers Page**:
- "John" → finds customers named "John Doe", "Johnny Smith", etc.
- "416" → finds customers with phone numbers containing "416"
- "@example.com" → finds customers with that email domain

**Products Page**:
- "Jeans" → finds all jeans products
- "Blue" → finds all blue-colored products
- "Levis" → finds all Levis brand products
- "Men's Wear" → finds products in that category

**Orders Page**:
- "1" → finds orders with ID 1, 10, 11, etc.
- "John" → finds orders for customer named John
- "Completed" → finds all completed orders

**Payments Page**:
- "Paid" → finds all paid payments
- "Credit" → finds all credit card payments
- "100" → finds payments with amount containing 100

#### Clear Search

- Click **"Clear Search"** button to see all records again
- Or delete the search term and search again

---

### Schema Management (Admin Menu)

**Access**: `http://localhost:8080/admin` or click "Admin" in navigation

The Admin menu provides complete database schema management through the web interface.

#### Drop Tables

**Warning**: This permanently deletes all tables, views, and sequences!

1. Click **"Drop Tables"** button (red card)
2. **Confirmation dialog** appears
3. Confirm deletion
4. All database objects are removed
5. Success message displayed

**Use Case**: Start fresh, remove all data and schema

#### Create Tables

Creates the complete database schema:

1. Click **"Create Tables"** button (green card)
2. Creates:
   - All 7 tables (Category_, Customer, Employee, Product, Order_, Payment, OrderItem)
   - All 5 sequences (for auto-increment IDs)
   - All 5 triggers (for auto-generating IDs)
   - All 3 views (V_ORDERS_SUMMARY, V_ORDER_LINE_ITEMS, V_PAYMENTS)
3. Success message displayed

**Use Case**: Set up database schema (must be done before Populate Tables)

#### Populate Tables

Inserts sample data into all tables:

1. Click **"Populate Tables"** button (blue card)
2. Inserts sample data:
   - 3 Categories
   - 3 Customers
   - 2 Employees
   - 4 Products
   - 3 Orders
   - 2 Payments
   - 4 Order Items
3. Synchronizes sequences to prevent ID conflicts
4. Success message displayed

**Use Case**: Add sample data for testing and demonstration

**Note**: Tables must exist first (use Create Tables before this)

#### Query Tables

Shows summary of all tables and views:

1. Click **"Query Tables"** button (blue card)
2. Displays row counts for:
   - Category_: X rows
   - Customer: X rows
   - Employee: X rows
   - Product: X rows
   - Order_: X rows
   - Payment: X rows
   - OrderItem: X rows
   - V_ORDERS_SUMMARY: X rows
   - V_ORDER_LINE_ITEMS: X rows
   - V_PAYMENTS: X rows

**Use Case**: Verify data exists, check table status

#### Typical Workflow

**First Time Setup**:
1. Drop Tables (optional - if starting fresh)
2. Create Tables (creates schema)
3. Populate Tables (adds sample data)
4. Query Tables (verify data exists)

**Reset/Start Fresh**:
1. Drop Tables (removes everything)
2. Create Tables (recreates schema)
3. Populate Tables (adds fresh data)

---

## Features Overview

### Core Features

#### 1. Complete CRUD Operations ✅

**Create**: Add new records
- Create new customers
- Create new products
- Create new orders
- Create new payments

**Read**: View records
- List all records
- View individual record details
- Display in organized tables

**Update**: Modify records
- Edit customer information
- Update product details
- Modify order information
- Change payment status

**Delete**: Remove records
- Delete customers (with constraints)
- Delete products (with constraints)
- Delete orders (removes items too)
- Delete payments (updates order status)

#### 2. Search Functionality ✅

- Search customers by name, email, phone
- Search products by name, brand, color, category
- Search orders by ID, customer, employee, status
- Search payments by ID, order, method, status, amount
- Case-insensitive partial matching
- Clear search option

#### 3. Schema Management Menu ✅

**Drop Tables**:
- Removes all tables
- Removes all views
- Removes all sequences
- With confirmation dialog

**Create Tables**:
- Creates complete database schema
- Creates all tables with constraints
- Creates sequences for auto-increment
- Creates triggers for ID generation
- Creates views for complex queries

**Populate Tables**:
- Inserts sample data
- Populates all tables
- Synchronizes sequences
- Ready for queries and operations

**Query Tables**:
- Shows table summaries
- Displays row counts
- Verifies data existence

#### 4. Business Logic ✅

**Automatic Order Status Updates**:
- When payment is marked "Paid" and order is fully paid → Status becomes "Completed"
- When payment is deleted and order is no longer fully paid → Status reverts to "Pending"
- Happens automatically when payments are created, updated, or deleted

**Automatic Order Total Calculations**:
- Order total recalculates when items are added
- Order total recalculates when items are removed
- Formula: SUM(item_qty × unit_price) for all items

#### 5. User Interface Features

- **Responsive Design**: Works on desktop and mobile
- **Bootstrap Styling**: Modern, professional appearance
- **Navigation Menu**: Easy access to all sections
- **Success/Error Messages**: Clear feedback for operations
- **Color-coded Status Badges**: Visual indicators for order and payment status
- **Confirmation Dialogs**: Prevents accidental deletions

---

## Assignment Requirements Coverage

This application fulfills all Assignment 9 requirements:

### 1. Menu with UI (1.0 mark) ✅

- ✅ **Drop Tables** option - Implemented in Admin menu
- ✅ **Create Tables** option - Implemented in Admin menu
- ✅ **Populate Tables** option - Implemented in Admin menu
- ✅ **Query Tables** option - Implemented in Admin menu
- ✅ **Exit** option - "Back to Home" serves as exit
- ✅ **UI connected to database** - Connected to Ryerson Oracle database

**How to Demonstrate**:
1. Navigate to `/admin`
2. Show all 4 menu options
3. Demonstrate each operation
4. Show that UI is connected to database

### 2. Normalization, Database Schema & Content (0.5 marks) ✅

- ✅ **Database in 3NF & BCNF** - All tables normalized
- ✅ **Sample dummy data** - Provided via Populate Tables
- ✅ **Code properly formatted & commented** - All classes have JavaDoc comments

**How to Demonstrate**:
1. Show that schema can be created via Admin menu
2. Show sample data can be populated
3. Explain database normalization if asked

### 3. Functionality: SQL Queries & Code Structure (0.5 marks) ✅

- ✅ **Read records** - All entities have list/view pages
- ✅ **Update records** - All entities have edit functionality
- ✅ **Delete records** - All entities have delete functionality
- ✅ **Search for specific records** - Search implemented on all pages
- ✅ **Code properly formatted & commented** - Comprehensive JavaDoc

**How to Demonstrate**:
1. Show CRUD operations on each entity
2. Demonstrate search functionality
3. Explain code structure if asked

### 4. Individual Evaluation (1.0 mark) ⚠️

**Be Prepared to Explain**:
- Functionality of queries
- How the UI/GUI works
- Database schema and design
- Business logic (order status updates, totals)

---

## Troubleshooting

### Problem: Application Won't Start

**Possible Causes & Solutions**:

1. **Port 8080 Already in Use**
   ```
   Error: Port 8080 was already in use
   ```
   **Solution**: Kill process on port 8080
   ```bash
   lsof -ti:8080 | xargs kill -9
   ```
   Or change port in `application.properties`:
   ```properties
   server.port=8081
   ```

2. **Database Connection Failed**
   ```
   Error: ORA-01017: invalid username/password
   ```
   **Solution**:
   - Verify credentials in environment variables or application.properties
   - Check if VPN is connected (if required)
   - Verify database URL is correct

3. **Maven Build Fails**
   ```
   Error: BUILD FAILURE
   ```
   **Solution**:
   - Check Java version: `java -version` (need 11+)
   - Check Maven version: `mvn --version` (need 3.6+)
   - Check internet connection (for downloading dependencies)
   - Clean and rebuild: `mvn clean package`

### Problem: Database Errors When Using Application

**Possible Causes & Solutions**:

1. **Tables Don't Exist**
   ```
   Error: table or view does not exist
   ```
   **Solution**:
   - Navigate to `/admin`
   - Click "Create Tables"
   - Wait for success message

2. **No Data Showing**
   - Solution: Click "Populate Tables" in Admin menu

3. **Foreign Key Constraint Violations**
   ```
   Error: integrity constraint violated
   ```
   **Solution**:
   - Cannot delete customer with existing orders
   - Cannot delete product in existing orders
   - Delete dependent records first

### Problem: Search Not Working

**Solution**:
- Ensure search term is entered
- Click "Search" button
- Check if any records match your search term
- Use "Clear Search" to see all records

### Problem: Order Total Not Updating

**Solution**:
- Order totals calculate automatically when items added/removed
- If total is $0.00, add items to the order
- Total updates when you add or remove items

### Problem: Order Status Not Updating

**Solution**:
- Order status updates automatically based on payments
- Mark payment as "Paid" to update order status
- Order becomes "Completed" when fully paid
- Check payment amounts match order total

---

## Quick Reference Guide

### Launch Sequence

1. **Configure credentials** (environment variables or application.properties)
2. **Build**: `mvn clean package`
3. **Run**: `mvn spring-boot:run`
4. **Open**: `http://localhost:8080`
5. **Setup Database**: Go to `/admin` → Create Tables → Populate Tables

### Essential URLs

- **Dashboard**: `http://localhost:8080/`
- **Customers**: `http://localhost:8080/customers`
- **Products**: `http://localhost:8080/products`
- **Orders**: `http://localhost:8080/orders`
- **Payments**: `http://localhost:8080/payments`
- **Admin**: `http://localhost:8080/admin`

### Keyboard Shortcuts

- **Ctrl+C** (Cmd+C on Mac): Stop the application in terminal

### Common Tasks

**Add Sample Data**:
1. Go to `/admin`
2. Click "Populate Tables"

**Start Fresh**:
1. Go to `/admin`
2. Click "Drop Tables" (confirm)
3. Click "Create Tables"
4. Click "Populate Tables"

**Find a Customer**:
1. Go to `/customers`
2. Type name in search box
3. Click "Search"

**Create Order with Items**:
1. Create order (will have $0 total)
2. Click "Items" button
3. Add products with quantities
4. Order total updates automatically

**Mark Order as Completed**:
1. Create payment for the order
2. Set payment status to "Paid"
3. Ensure payment amount covers order total
4. Order status automatically becomes "Completed"

---

## Assignment Requirements Checklist

### Core Requirements (3 marks)

- [x] **Menu with UI** - Admin menu with Drop/Create/Populate/Query Tables ✅
- [x] **Normalization & Schema** - 3NF/BCNF, sample data, code comments ✅
- [x] **SQL Queries & Code** - CRUD, search, code comments ✅
- [ ] **Individual Evaluation** - Prepare to explain and demonstrate ⚠️

### Bonus Requirements (3 marks)

- [x] **Front End Access** - Web-based GUI with all menu options ✅
- [x] **Separate Forms/Tables** - Individual pages for each entity ✅

---

## Support & Additional Resources

### Project Files

- **README.md**: Setup and configuration instructions
- **ASSIGNMENT-9-REQUIREMENTS.md**: Complete requirements checklist
- **DEPLOYMENT-INSTRUCTIONS.md**: Cloud deployment guide

### Database Schema

- SQL files in `if_needed/` directory
- `a5.sql`: Complete schema with views and triggers
- Schema can be created through Admin menu (no manual SQL needed)

### Technical Details

- **Framework**: Spring Boot 2.7.14
- **Database**: Oracle 11g
- **Frontend**: Thymeleaf + Bootstrap 5.3.0
- **Build Tool**: Maven
- **Java Version**: 11+

---

## Conclusion

This user guide covers all aspects of launching and using the CPS510 Database Management System. The application provides a complete interface for managing a clothing retail store database, with all features accessible through the web interface.

**Key Takeaways**:
1. ✅ Application can be launched locally following these instructions
2. ✅ Database setup is done through Admin menu (no manual SQL)
3. ✅ All CRUD operations available for all entities
4. ✅ Search functionality on all list pages
5. ✅ Business logic handles order status and totals automatically

**For Assignment Submission**:
- This guide (a9.pdf) demonstrates how to launch and use the application
- Follow the instructions to set up and run the application
- All features can be demonstrated through the web interface

---

**End of User Guide**

*Last Updated: 2025-01-XX*  
*Version: 1.0*

