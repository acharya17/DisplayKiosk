# Module 2 — Self-Order Kiosk Admin

## Phase 1 — Categories & Products

* Category List
* Add Category
* Edit Category
* Product List
* Add Product
* Edit Product
* Product Details

## Phase 2 — Product Customisation

* Add-ons / Modifiers
* Product Customisation
* Variants / Sizes
* Customisation Details / Edit

## Phase 3 — Combo Management

* Combo List
* Add Combo
* Edit Combo
* Combo Details
* Combo Items / Product Selection
* Combo Pricing
* Combo Availability

## Phase 4 — Tax & Offers / Discounts

* Tax List
* Add Tax
* Edit Tax
* Tax Details
* Offers / Discount List
* Add Offer
* Edit Offer
* Offer Details

## Phase 5 — Kiosk Management

* Kiosk List
* Add Kiosk
* Edit Kiosk
* Kiosk Details
* Kiosk Configuration
* Kiosk Monitoring / Status
* Category Availability
* Product Availability
* Combo Availability
* Online Payment Method Assignment

## Phase 6 — Order & Online Payment Monitoring

* Order List
* Order Details
* Payment Configuration
* Payment Transactions
* Payment Details
* Order ↔ Payment Monitoring
* Kiosk-wise Order / Payment Monitoring

## Phase 7 — Kiosk Settings & Hardware

* Kiosk Settings
* Inactivity / Session Settings
* Hardware Configuration
* Hardware Status
* Kiosk Connection Status
* Operational Readiness

---

# Overall Dependency

### Phase 1

**Categories → Products**

```text
Categories
    ↓
Products
```

### Phase 2

**Products → Customisation**

```text
Products
    ↓
Variants / Sizes
    ↓
Add-ons / Modifiers
    ↓
Product Customisation
```

### Phase 3

**Products → Combos**

```text
Existing Products
    ↓
Combo
    ↓
Combo Items
    ↓
Combo Price
```

### Phase 4

**Products / Categories / Combos → Tax & Offers**

```text
Products
Categories
Combos
    ↓
Tax
    ↓
Offers / Discounts
```

### Phase 5

**All configured data → Kiosk**

```text
Products
Customisation
Combos
Tax
Offers
Payment Methods
    ↓
Kiosk
    ↓
Kiosk-specific Availability
```

### Phase 6

**Kiosk → Customer → Order → Online Payment → Monitoring**

```text
Kiosk
    ↓
Customer
    ↓
Order
    ↓
Final Amount
    ↓
Online Payment
    ↓
Payment Transaction
    ↓
Admin Monitoring
```

### Phase 7

**Kiosk → Settings → Session → Hardware → Operational Management**

```text
Kiosk
    ↓
Kiosk Settings
    ↓
Inactivity / Session
    ↓
Hardware
    ↓
Connection
    ↓
Operational Readiness
```

## Complete Module 2 Flow

```text
PHASE 1
Categories + Products
        ↓
PHASE 2
Product Customisation
        ↓
PHASE 3
Combo Management
        ↓
PHASE 4
Tax + Offers / Discounts
        ↓
PHASE 5
Kiosk Management
        ↓
PHASE 6
Orders + Online Payments
        ↓
PHASE 7
Kiosk Settings + Hardware
```

This gives **7 phases** and keeps the dependency meaningful: **create → customise → combine → price → configure kiosk → transact → operate/monitor**.
