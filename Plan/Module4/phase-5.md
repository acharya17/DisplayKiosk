# Module 4 — Customer Self-Order Kiosk

## Phase 5 — Tax, Discount & Order Summary

### 1. Phase Purpose

Phase 5 is where the kiosk takes the validated cart subtotal from **Phase 4 — Cart & Order Review**, applies any eligible discounts/offers, computes taxes as configured in the Admin panel, and presents the final Net Payable Amount to the customer in a clean, comprehensive Order Summary page before proceeding to **Phase 6 — Online Payment**.

### Core Flow

```text
Phase 4
Validated Cart Subtotal
      ↓
Apply Active Offers / Promos
      ↓
Calculate Item & Order Taxes
      ↓
Compute Net Payable Amount
      ↓
Display Order Summary Page
      ↓
Proceed to Phase 6 Payment
```

---

# 2. Phase Scope

### Included

* Active offers and promo codes retrieval
* Automated discount calculation (percentage or flat discount)
* Active taxes (CGST, SGST, VAT) retrieval
* Detailed tax calculation (exclusive/inclusive tax rules)
* Calculation of final Net Payable Amount (`Net = Subtotal - Discount + Taxes`)
* Detailed Order Summary view (item list with sub-details, discount savings, tax breakdown, final payable amount)
* Error handling for pricing/calculation mismatches
* Back navigation support (re-evaluates cart changes)

### Not Included

Do not implement:

* Card/UPI Payment gateway integration (Phase 6)
* Done/Token order registration (Phase 7)
* Add/edit items in cart directly from summary (must return to Phase 4 Cart)

---

# 3. Discount & Tax Data Dependency

Tax rules and discount structures are entirely configured in Admin (Module 2).

```text
Admin Portal
  ↓
Taxes & Offers Configuration
  ↓
Kiosk Session
  ↓
Subtotal Check
  ↓
Calculate Net Taxes & Savings
```

---

# 4. Calculation Formulas

### 1. Discount Application
If a promo/discount applies to the order:
* **Percentage-based**: `Savings = Subtotal * (DiscountRate / 100)`
* **Flat amount**: `Savings = FlatAmount`

### 2. Tax Application (Exclusive Mode)
* `Taxable Value = Subtotal - Savings`
* For each configured active tax rule (e.g. CGST 2.5%, SGST 2.5%):
  * `Tax Amount = Taxable Value * (TaxRate / 100)`

### 3. Net Payable Amount
* `Net Payable = Taxable Value + Total Taxes`

---

# 5. Order Summary UI Structure

Recommended layout:

```text
┌─────────────────────────────────────────────┐
│ ← Back                 Order Summary        │
├─────────────────────────────────────────────┤
│                                             │
│ Chicken Burger × 2                   ₹500.00│
│ Chicken Meal × 1                     ₹319.00│
│                                             │
│ Subtotal                             ₹819.00│
│ Discount (WELCOME10)                -₹81.90 │
│ CGST (2.5%)                          ₹18.43 │
│ SGST (2.5%)                          ₹18.43 │
│ ─────────────────────────────────────────── │
│ Total Payable                        ₹773.96│
│                                             │
│ [ Cancel Order ]           [ Pay Now ]      │
└─────────────────────────────────────────────┘
```

---

# 6. Phase 5 Acceptance Criteria

### Calculations
* Applicable discounts apply correctly.
* CGST and SGST calculate accurately based on Admin tax rules.
* Final payable amount math matches item values.

### UI/UX
* Clean breakdown showing subtotal, savings, individual taxes, and final payable amount.
* Clear CTA pointing to Phase 6 payment.
* Proper touch target sizes.
