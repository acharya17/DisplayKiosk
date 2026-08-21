# Module 2 — Self-Order Kiosk Admin

## Phase 6 — Order & Online Payment Monitoring

### 1. Phase Purpose

Phase 6 is the **transaction monitoring layer** of the Self-Order Kiosk Admin.

It connects the kiosk configuration from Phase 5 with the actual customer transactions generated through the kiosks.

Admin should be able to:

* Monitor customer orders.
* View complete order details.
* Identify the kiosk that created each order.
* View products and combos ordered.
* View selected customisations.
* View applied tax.
* View applied offers/discounts.
* View final order amount.
* Monitor online payments.
* View payment status.
* View transaction/reference ID.
* Connect every payment to its related order.
* Connect every order to its related kiosk.
* Monitor successful, pending, failed, and cancelled transactions.

The key principle is:

> **Orders and payments are transaction records. They must use the configuration created in Phases 1–5 and must preserve the actual values at the time of the transaction.**

---

# 2. Phase Dependency

Phase 6 depends on all previous phases.

### Phase 1

* Categories
* Products
* Product prices
* Product availability

### Phase 2

* Variants
* Sizes
* Add-ons
* Modifiers
* Customisations

### Phase 3

* Combos
* Combo items
* Combo price
* Combo availability

### Phase 4

* Taxes
* Offers
* Discounts
* Applicability
* Validity

### Phase 5

* Kiosks
* Kiosk ID
* Kiosk availability
* Kiosk product/category configuration
* Kiosk combo configuration
* Online payment assignment

Phase 6 consumes all of this information to represent the actual transaction.

---

# 3. Complete Transaction Relationship

```text
CATEGORY
    ↓
PRODUCT
    ↓
CUSTOMISATION
    ↓
COMBO
    ↓
TAX / OFFER
    ↓
KIOSK
    ↓
CUSTOMER ORDER
    ↓
FINAL ORDER AMOUNT
    ↓
ONLINE PAYMENT
    ↓
PAYMENT TRANSACTION
```

---

# 4. Phase Scope

## Included

### Order Monitoring

* Order List
* Order Details
* Order status
* Order items
* Product information
* Combo information
* Customisations
* Quantity
* Pricing
* Tax
* Discount
* Final amount
* Kiosk information
* Customer information where collected

### Payment Monitoring

* Payment List
* Payment Details
* Payment method
* Payment status
* Transaction ID
* Reference ID
* Amount
* Date/time
* Related order
* Related kiosk

### Common Features

* Search
* Filters
* Pagination
* Sorting where supported
* Loading states
* Empty states
* Error states
* Refresh/status update where supported

---

# 5. Not Included

Do not implement in Phase 6:

* Product creation
* Category creation
* Customisation creation
* Combo creation
* Tax creation
* Offer creation
* Kiosk creation
* Hardware configuration
* Session/inactivity configuration

Those belong to other phases.

Phase 6 is primarily a **monitoring and transaction-details phase**.

---

# 6. Order List

## Purpose

Provide Admin with a compact overview of all orders generated through Self-Order Kiosks.

### Table Fields

* Order ID
* Order Number / Token
* Kiosk
* Date & Time
* Customer, where collected
* Items / Item Count
* Amount
* Payment Status
* Order Status
* Actions

Example:

```text
ORD-10025
Token: 125
Counter 01
21 Aug, 10:25 AM
3 Items
₹472.50
Paid
Completed
```

Keep the table compact.

Do not display every item in a large table cell.

---

# 7. Order Search

Search by meaningful identifiers.

### Search Fields

* Order ID
* Order Number / Token
* Kiosk Name
* Kiosk ID

Where customer information is collected and searchable:

* Customer identifier

Example:

```text
Search orders...
```

Provide a clear search action/clear icon consistent with the global UI.

---

# 8. Order Filters

Use the project's standard **popup filter dialog**.

### Filters

* Order Status
* Payment Status
* Kiosk
* Date Range
* Payment Method, where applicable

Example:

```text
Filter Orders

Order Status
[ All ▼ ]

Payment Status
[ All ▼ ]

Kiosk
[ All ▼ ]

Date Range
[ From ] [ To ]

Payment Method
[ All ▼ ]

[Cancel] [Apply]
```

Do not use a permanent large filter panel.

---

# 9. Order Pagination

Use the global compact pagination.

Pagination must work correctly with:

* Search
* Filters
* Sorting

Changing pages should not unexpectedly reset the current search/filter state.

---

# 10. Order Status

Order Status and Payment Status must remain **separate**.

Possible order states may include:

* Created
* Payment Pending
* Confirmed
* Completed
* Cancelled

Use actual backend-defined statuses where available.

Do not invent additional business states.

---

# 11. Payment Status

Possible states:

* Pending
* Successful
* Failed
* Cancelled

Use backend-defined values where available.

Example:

```text
Order Status: Completed
Payment Status: Successful
```

Do not combine both into a single status.

---

# 12. Order Details

## Purpose

Show the complete information for one customer order in a compact, readable layout.

Recommended sections:

```text
Order Information
Customer
Items
Pricing Summary
Tax
Discount
Payment
Status
```

Avoid creating a separate oversized card for every field.

---

# 13. Order Details — Order Information

Show:

* Order ID
* Order Number / Token
* Date & Time
* Kiosk Name
* Kiosk ID
* Order Status

Where supported:

* Store/Location

Example:

```text
Order
ORD-10025

Token
125

Kiosk
Counter 01
KSK-001

Status
Completed
```

---

# 14. Order Details — Customer

Show customer information only when the kiosk/order flow collects it.

Possible fields:

* Customer Name
* Mobile Number
* Other configured customer information

If no customer information was collected:

Do not display a large empty section.

---

# 15. Order Items

Every ordered item must be clearly displayed.

### Product Order

Show:

* Product
* Quantity
* Unit Price
* Customisations
* Customisation charges
* Item Total

Example:

```text
Chicken Biryani       ×2
Unit Price             ₹220
Extra Raita ×2          ₹40
Item Total             ₹480
```

---

# 16. Combo Order

Combos must be displayed separately from normal products where appropriate.

Example:

```text
Burger Meal            ×1
Combo Price            ₹249

Included:
Burger ×1
Fries ×1
Coke ×1
```

If the customer selected customisations:

```text
Burger
Chicken

Drink
Coke
```

The order must preserve the actual selections made by the customer.

---

# 17. Order Pricing

Show a clear pricing summary.

Example:

```text
Subtotal                  ₹500
Discount                  -₹50
Tax                        ₹22.50
--------------------------------
Final Amount               ₹472.50
```

The actual calculation must come from the approved backend/business rules.

Do not create a new frontend pricing formula.

---

# 18. Historical Pricing Rule

This is critical.

If a product price changes after an order:

```text
Before:
Chicken Biryani = ₹220
```

Old order:

```text
₹220
```

Later:

```text
Chicken Biryani = ₹250
```

The old order must still display:

```text
₹220
```

The same applies to:

* Combo price
* Customisation price
* Tax
* Discount

Historical transactions must preserve their transaction-time values.

---

# 19. Tax Information

Show the tax actually applied to the order.

Possible fields:

* Tax Name
* Tax Rate
* Tax Amount

Example:

```text
GST
5%
₹22.50
```

Do not simply fetch the current Tax Master and display it as the historical tax.

Use the transaction's recorded values.

---

# 20. Discount / Offer Information

If a discount was applied:

Show:

* Offer Name
* Discount Type
* Discount Value
* Discount Amount

Example:

```text
Lunch Offer
10%
Discount: ₹50
```

If no discount was applied:

Use a compact state such as:

```text
No discount applied
```

Do not create a large empty section.

---

# 21. Payment Information in Order Details

Show:

* Payment Method
* Payment Status
* Transaction ID
* Reference ID where available
* Payment Amount
* Payment Date/Time

Example:

```text
Payment

Method
UPI

Status
Successful

Transaction ID
TXN-87452

Amount
₹472.50
```

Provide a clear relationship to Payment Details.

---

# 22. Order Status Timeline

Where backend data supports status history, show a compact timeline.

Successful example:

```text
Order Created
      ↓
Payment Pending
      ↓
Payment Successful
      ↓
Order Completed
```

Failed example:

```text
Order Created
      ↓
Payment Pending
      ↓
Payment Failed
```

Only display statuses actually supplied by the backend.

---

# 23. Order Actions

Only include actions supported by the requirements/backend.

Possible actions:

* View
* Refresh Status

Do not automatically add:

* Edit Order
* Refund
* Cancel
* Reorder

unless those functions are explicitly required.

Phase 6 is primarily for monitoring.

---

# 24. Payment Transaction List

## Purpose

Provide a dedicated view for monitoring online payment transactions.

This is different from Payment Configuration.

### Payment Configuration

Defines:

> Which online payment methods are available?

### Payment Monitoring

Shows:

> What happened to each customer's payment?

---

# 25. Payment Table Fields

Use a compact table.

Fields:

* Transaction ID
* Order ID
* Kiosk
* Payment Method
* Amount
* Date & Time
* Payment Status
* Actions

Example:

```text
TXN-87452
ORD-10025
Counter 01
UPI
₹472.50
10:25 AM
Successful
```

---

# 26. Payment Search

Search by:

* Transaction ID
* Order ID
* Kiosk ID

Where supported:

* Payment Reference ID

Keep the search simple.

---

# 27. Payment Filters

Use the global popup filter.

### Filters

* Payment Status
* Payment Method
* Kiosk
* Date Range

Example:

```text
Filter Payments

Payment Status
[ All ▼ ]

Payment Method
[ All ▼ ]

Kiosk
[ All ▼ ]

Date Range
[ From ] [ To ]

[Cancel] [Apply]
```

---

# 28. Payment Details

Show:

### Transaction

* Transaction ID
* Order ID
* Amount
* Payment Method
* Payment Status
* Date/Time

### Kiosk

* Kiosk Name
* Kiosk ID

### Provider

Where available:

* Payment Provider
* Provider Reference
* Gateway Reference

### Related Order

Provide:

```text
[View Order]
```

Do not duplicate the entire Order Details page.

---

# 29. Order ↔ Payment Synchronization

This is one of the most important Phase 6 requirements.

Every payment must be associated with the correct order.

```text
Order
  ↓
Order ID
  ↓
Payment
  ↓
Transaction ID
```

Example:

```text
Order ID
ORD-10025

Payment ID
TXN-87452

Amount
₹472.50
```

Admin should be able to navigate:

```text
Order → Payment
```

and:

```text
Payment → Order
```

---

# 30. Order ↔ Kiosk Synchronization

Every order must retain its kiosk relationship.

```text
Kiosk
  ↓
Kiosk ID
  ↓
Order
  ↓
Payment
```

Example:

```text
KSK-001
   ↓
ORD-10025
   ↓
TXN-87452
```

Use stable IDs rather than only display names.

---

# 31. Payment Amount Validation

The payment amount must correspond to the final order amount.

Example:

```text
Order Final Amount
₹472.50

Payment Amount
₹472.50
```

If there is a mismatch:

* Do not silently mark it successful.
* Reflect the backend/payment verification state.
* Do not invent a corrected amount.

Payment validation belongs to the backend/payment integration.

---

# 32. Pending Payment

When payment is pending:

Show:

```text
Payment Status
Pending
```

Include:

* Order ID
* Amount
* Payment method
* Transaction/reference ID where available
* Date/time

Do not show:

```text
Successful
```

until payment confirmation exists.

---

# 33. Successful Payment

Show:

* Successful status
* Order ID
* Transaction ID
* Amount
* Payment Method
* Date/Time

The related order must show the correct payment state.

---

# 34. Failed Payment

Show:

* Failed status
* Order ID
* Amount
* Payment Method
* Transaction/reference ID where available
* Failure information where available

Do not mark the related order as successfully paid.

---

# 35. Cancelled Payment

Show:

* Cancelled status
* Order ID
* Amount
* Payment Method
* Date/Time

Use the actual backend state.

---

# 36. Duplicate Payment Protection

The system must protect against duplicate transactions.

Example:

```text
Customer
   ↓
Clicks Pay
   ↓
Payment succeeds
   ↓
Network response is lost
   ↓
Kiosk does not receive response
```

The correct behavior is:

```text
Verify Existing Transaction
        ↓
Determine Actual Status
        ↓
Update Existing Order/Payment
```

Do not create a second successful payment because the first response was lost.

The UI should display the backend's final verified state.

---

# 37. Payment Retry

If payment retry is supported:

A retry must not overwrite the original transaction.

Example:

```text
Payment Attempt 1
Failed

Payment Attempt 2
Successful
```

The system must preserve the transaction history according to backend rules.

Do not simply change:

```text
Failed → Successful
```

on the same transaction unless that is how the payment provider actually reports status updates.

---

# 38. Online Payment Only

Phase 6 monitors online payments only.

Do not introduce:

* Cash payment
* Cash drawer
* Cash reconciliation
* Cash collection

unless the project requirement changes.

Online payment methods should come from the configured payment methods in the earlier phase.

---

# 39. Kiosk Filter

Both Order and Payment pages must support kiosk filtering.

Example:

```text
Kiosk
Counter 01
```

This allows Admin to monitor transactions generated by one specific kiosk.

Do not create free-text kiosk records.

Use the existing Kiosk Master.

---

# 40. Date/Time Filtering

Orders and payments should support date-range filtering.

Fields:

```text
From Date
To Date
```

Where supported, include time.

This is a monitoring filter and must not be confused with kiosk scheduling.

---

# 41. Order and Payment Data Consistency

If Order List shows:

```text
ORD-10025
₹472.50
Successful
Completed
```

Order Details must show:

```text
ORD-10025
Final Amount: ₹472.50
Payment: Successful
Order Status: Completed
```

Payment Details must show:

```text
Related Order: ORD-10025
Amount: ₹472.50
Status: Successful
```

All three views must represent the same transaction.

---

# 42. Order and Product Synchronization

An order should preserve:

* Product name at transaction time
* Product price at transaction time
* Quantity
* Customisations
* Customisation price

Changing the Product Master later must not modify the historical order.

---

# 43. Order and Combo Synchronization

For a combo order, preserve:

* Combo name
* Combo price
* Included products
* Quantities
* Selected customisations
* Applicable transaction-time pricing

Changing the Combo Master later must not change historical orders.

---

# 44. Tax and Discount Synchronization

The order must preserve:

* Applied tax
* Tax rate
* Tax amount
* Applied offer
* Discount type
* Discount value
* Discount amount

Changes made later in Phase 4 must not rewrite existing transactions.

---

# 45. Kiosk Synchronization

If a kiosk is renamed:

```text
Counter 01
```

to:

```text
Entrance Kiosk
```

historical orders should still retain:

```text
Kiosk ID: KSK-001
```

The displayed name can follow the approved historical-data rule, but the stable relationship must remain intact.

---

# 46. Refresh / Status Update

Where backend support exists:

Provide a compact Refresh action.

Refresh should update:

* Order status
* Payment status
* Transaction status

Do not reset active filters unnecessarily.

If the application supports real-time updates:

* Reflect them automatically.

Do not claim real-time behavior when the backend does not provide it.

---

# 47. Empty States

### Orders

```text
No orders found.
```

If there are no orders:

```text
No orders have been created yet.
```

### Payments

```text
No payment transactions found.
```

### Filtered Results

```text
No transactions match the selected filters.
[Clear Filters]
```

Keep empty states compact.

---

# 48. Loading States

Use the global compact loading pattern.

### Tables

Use skeleton rows.

### Details

Use compact grouped skeletons.

### Refresh

Use a small loading state on the refresh control.

Do not use oversized full-screen loaders for normal data loading.

---

# 49. Error States

### Order List

```text
Unable to load orders.
[Retry]
```

### Order Details

```text
Unable to load order details.
[Retry] [Back]
```

### Payment List

```text
Unable to load payments.
[Retry]
```

### Payment Details

```text
Unable to load payment details.
[Retry] [Back]
```

Do not clear already-entered filters when a request fails.

---

# 50. Recommended Order List Layout

```text
Orders

[ Search orders... ]       [Filter]

---------------------------------------------------------
Order       Kiosk       Items    Amount    Payment Status
---------------------------------------------------------
ORD-10025   Counter 01  3        ₹472.50   Successful
ORD-10024   Counter 02  2        ₹320      Pending
ORD-10023   Counter 01  4        ₹650      Failed
---------------------------------------------------------

Pagination
```

Keep it compact.

---

# 51. Recommended Order Details Layout

```text
Order Details

ORD-10025                         Completed
Counter 01                        Payment Successful

------------------------------------------------

Order Information
Token: 125
Date: 21 Aug 2026, 10:25 AM
Kiosk: Counter 01

------------------------------------------------

Items

Chicken Biryani ×2              ₹440
Extra Raita ×2                   ₹40

Burger Meal ×1                  ₹249

------------------------------------------------

Summary

Subtotal                         ₹729
Discount                         -₹50
Tax                               ₹22.50
-----------------------------------------------
Total                             ₹701.50

------------------------------------------------

Payment

UPI
Successful
TXN-87452

------------------------------------------------

[Back]
```

Values are illustrative only.

---

# 52. Recommended Payment List Layout

```text
Payments

[ Search transactions... ]      [Filter]

----------------------------------------------------------------
Transaction     Order       Kiosk       Method    Amount  Status
----------------------------------------------------------------
TXN-87452       ORD-10025   Counter 01  UPI       ₹472    Success
TXN-87451       ORD-10024   Counter 02  UPI       ₹320    Pending
TXN-87450       ORD-10023   Counter 01  UPI       ₹650    Failed
----------------------------------------------------------------

Pagination
```

---

# 53. Recommended Payment Details

```text
Payment Details

TXN-87452                         Successful

------------------------------------------------

Transaction

Transaction ID
TXN-87452

Order ID
ORD-10025

Payment Method
UPI

Amount
₹472.50

Date & Time
21 Aug 2026, 10:25 AM

------------------------------------------------

Kiosk

Counter 01
KSK-001

------------------------------------------------

Provider Reference
XXXXXX

------------------------------------------------

[Back]                     [View Order]
```

---

# 54. UI/UX Requirements

Phase 6 must follow the global compact UI system.

### Tables

* Compact row height
* Clear alignment
* No excessive columns
* Consistent status badges
* Compact action menu

### Details

* Group related information.
* Avoid excessive cards.
* Use compact sections.
* Keep important transaction information visually prominent.

### Spacing

* Consistent page padding.
* Consistent section spacing.
* Compact field spacing.
* No large empty areas.

### Navigation

* Inner pages must have Back.
* List → Details must work.
* Details → Payment must work.
* Payment → Order must work.

---

# 55. Status Display

Use the same global status component.

Example:

```text
Payment
● Successful

Order
● Completed
```

Do not create different badge styles for different pages.

---

# 56. Responsive Behavior

### Desktop

Use compact tables and grouped details.

### Smaller Screens

Stack detail sections.

Tables should remain usable without breaking the layout.

Do not create unnecessary horizontal scrolling.

---

# 57. Data Integrity Rules

## Historical Product

Never recalculate historical product pricing from the current Product Master.

## Historical Combo

Never recalculate historical combo pricing from the current Combo Master.

## Historical Tax

Do not replace historical tax values with current Tax Master values.

## Historical Discount

Do not replace historical discount values with current Offer configuration.

## Payment

Do not change historical payment amount based on current product/combo configuration.

---

# 58. Order Deletion

Orders should not be casually deleted.

If an order has:

* Payment
* Transaction reference
* Historical financial information

the record should remain available according to the project's retention rules.

Do not add Delete unless explicitly required.

---

# 59. Payment Deletion

Payment transactions should not have a Delete action unless explicitly required.

Historical payment records must remain traceable.

---

# 60. Phase 6 Acceptance Criteria

Phase 6 is complete only when:

## Orders

* Admin can view all kiosk orders.
* Admin can search orders.
* Admin can filter orders.
* Admin can paginate orders.
* Admin can view complete order details.
* Order status is shown.
* Payment status is shown separately.
* Kiosk is identified.
* Products are displayed.
* Combos are displayed.
* Customisations are displayed.
* Quantity is displayed.
* Tax is displayed.
* Discount is displayed.
* Final amount is displayed.
* Customer information is displayed only when collected.

## Payments

* Admin can view online payment transactions.
* Admin can search transactions.
* Admin can filter transactions.
* Admin can paginate transactions.
* Admin can view payment details.
* Payment method is displayed.
* Payment status is displayed.
* Transaction ID is displayed where available.
* Reference ID is displayed where available.
* Amount is displayed.
* Date/time is displayed.
* Kiosk is identified.
* Related order is accessible.

## Synchronization

* Order links to payment.
* Payment links to order.
* Order links to kiosk.
* Kiosk relationship uses stable ID.
* Product information is preserved.
* Combo information is preserved.
* Tax information is preserved.
* Discount information is preserved.
* Historical pricing is preserved.

## Payment Safety

* Pending payments remain pending until verified.
* Failed payments are not marked successful.
* Cancelled payments are not marked successful.
* Duplicate payments are prevented.
* Payment amount is validated against the final order amount.
* Lost payment responses can be resolved through backend verification.

## UI/UX

* Compact UI.
* Compact tables.
* Compact details.
* Proper padding.
* Proper spacing.
* Search.
* Popup filters.
* Pagination.
* Status indicators.
* Back navigation.
* Loading states.
* Empty states.
* Error states.
* Responsive layout.
* No unnecessary actions.
* No excessive white space.

---

# 61. Phase 6 Implementation Rules for AI

1. Read Phases 1–5 before implementing Phase 6.
2. Reuse Product Master.
3. Reuse Customisation Master.
4. Reuse Combo Master.
5. Reuse Tax configuration.
6. Reuse Offer/Discount configuration.
7. Reuse Kiosk Master.
8. Do not duplicate master data inside Orders.
9. Treat Orders as transaction records.
10. Treat Payments as transaction records.
11. Keep Order Status and Payment Status separate.
12. Preserve historical transaction-time values.
13. Do not recalculate historical orders from current master data.
14. Link every Order to its Kiosk.
15. Link every Payment to its Order.
16. Use stable IDs for relationships.
17. Do not invent tax or discount calculations.
18. Do not invent payment-provider behavior.
19. Use backend-defined statuses where available.
20. Do not add unsupported refund/cancel/edit actions.
21. Do not add cash payment functionality.
22. Prevent duplicate payment records.
23. Keep List and Details data synchronized.
24. Reuse global search, filter, table, dialog, status, and pagination components.
25. Follow the compact UI guideline.
26. Keep inner pages clean and consistent.
27. Do not break Phases 1–5.
28. Fix spacing, alignment, loading, empty, error, and responsive issues within Phase 6.
29. Do not implement Phase 7 functionality inside Phase 6.

---

# 62. Final Phase 6 Flow

```text
PHASE 1
Category + Product
        ↓
PHASE 2
Customisation
        ↓
PHASE 3
Combo
        ↓
PHASE 4
Tax + Offers / Discounts
        ↓
PHASE 5
Kiosk Management
        ↓
CUSTOMER USES KIOSK
        ↓
CREATES ORDER
        ↓
FINAL AMOUNT
        ↓
ONLINE PAYMENT
        ↓
PAYMENT VERIFICATION
        ↓
PHASE 6
ORDER MONITORING
        +
PAYMENT MONITORING
```

---

# 63. Complete Module 2 Flow

```text
CATEGORY
    ↓
PRODUCT
    ↓
CUSTOMISATION
    ↓
COMBO
    ↓
TAX + OFFER
    ↓
KIOSK
    ↓
CUSTOMER
    ↓
ORDER
    ↓
ONLINE PAYMENT
    ↓
ORDER + PAYMENT MONITORING
    ↓
PHASE 7
SETTINGS + SESSION + HARDWARE
```

---

# 64. Phase 6 Final Goal

At the end of Phase 6, Admin should be able to answer:

* What orders have been created?
* Which kiosk created each order?
* What products were ordered?
* What combos were ordered?
* What customisations were selected?
* What was the price at the time of purchase?
* What tax was applied?
* What discount was applied?
* What is the final amount?
* Was the payment successful?
* Which online payment method was used?
* What is the transaction ID?
* What is the payment status?
* What is the order status?
* Can the payment be traced back to the order?
* Can the order be traced back to the kiosk?

The final transaction relationship must be:

```text
KIOSK
   ↓
ORDER
   ↓
ORDER ITEMS
   ├── PRODUCT
   ├── CUSTOMISATION
   └── COMBO
   ↓
PRICING
   ├── TAX
   └── DISCOUNT
   ↓
FINAL AMOUNT
   ↓
ONLINE PAYMENT
   ↓
TRANSACTION
```

**Phase 6 is therefore the transaction-monitoring layer that proves all the configuration from Phases 1–5 is actually connected and working together.**
