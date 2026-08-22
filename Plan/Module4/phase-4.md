# Module 4 — Customer Self-Order Kiosk

## Phase 4 — Cart & Order Review

### 1. Phase Purpose

Phase 4 is where the customer reviews everything selected so far **before proceeding to the final amount and payment**.

The cart must combine:

* Normal products from Phase 2
* Combos from Phase 3
* Variants / sizes
* Add-ons / modifiers
* Quantities
* Item-level prices

The customer should be able to **edit, remove, or continue shopping** without losing the existing order.

### Core Flow

```text
Phase 2 / Phase 3
      ↓
Add Product / Combo
      ↓
Cart
      ↓
Review Items
      ↓
Edit Quantity / Selection
      ↓
Remove Item
      ↓
Continue Shopping
       OR
      ↓
Proceed to Order Summary
      ↓
Phase 5 — Tax & Discount
```

---

# 2. Phase Scope

### Included

* Cart page
* Product cart items
* Combo cart items
* Quantity adjustment
* Remove item
* Edit product selections
* Edit combo selections
* Item-level total
* Cart subtotal
* Empty cart state
* Continue Shopping
* Proceed to Order Summary
* Cart persistence during navigation
* Cart validation before proceeding

### Not Included

Do not implement:

* New login
* Product creation
* Combo creation
* Tax calculation
* Final discount calculation
* Payment
* Order creation
* Payment confirmation

These belong to later phases.

---

# 3. Cart Data Flow

```text
Product
   ↓
Product Configuration
   ↓
Add to Cart
   ↓
Cart

Combo
   ↓
Combo Configuration
   ↓
Add to Cart
   ↓
Cart
```

The cart should preserve the complete customer selection.

---

# 4. Cart Page

Recommended structure:

```text id="r8f2k3"
┌─────────────────────────────────────────────┐
│ ← Back                 Your Order           │
├─────────────────────────────────────────────┤
│                                             │
│ Chicken Burger × 2                          │
│ Regular • Extra Cheese                      │
│ ₹250 each                         ₹500      │
│ [-] 2 [+]                     [Remove]      │
│                                             │
│ Chicken Meal × 1                            │
│ Chicken Burger • Coke • Fries               │
│ ₹249                              ₹249      │
│ [-] 1 [+]                     [Remove]      │
│                                             │
├─────────────────────────────────────────────┤
│ Subtotal                          ₹749      │
│                                             │
│ [Continue Shopping]      [Proceed]          │
└─────────────────────────────────────────────┘
```

Keep the page **compact, clean and touch-friendly**.

---

# 5. Product Cart Item

For a normal product, show:

* Product image
* Product name
* Selected variant
* Selected add-ons
* Quantity
* Unit price
* Item total
* Edit
* Remove

Example:

```text id="ps6q3d"
Chicken Burger × 2
Large
Extra Cheese

₹250 × 2
₹500

[-] 2 [+]
[Edit] [Remove]
```

Do not display unnecessary product-master information.

---

# 6. Combo Cart Item

A combo should remain identifiable as a combo.

Example:

```text id="r9x4nm"
Chicken Meal × 1

Chicken Burger
Coke
Fries
Extra Cheese

₹319

[-] 1 [+]
[Edit] [Remove]
```

The selected combo components must remain attached to that cart item.

---

# 7. Quantity Adjustment

Customer can update quantity directly.

```text id="4mxv7z"
[-] 1 [+]
```

When quantity changes:

```text id="m0i4v2"
Quantity
   ↓
Recalculate Item Total
   ↓
Recalculate Cart Subtotal
```

Example:

```text id="g2v1ar"
₹250 × 2 = ₹500
```

Do not apply tax/discount here.

---

# 8. Quantity Validation

Respect configured quantity rules.

Prevent:

* Quantity below minimum
* Quantity above maximum
* Invalid quantity
* Zero quantity where removal is required

If quantity reaches the minimum allowed value, the customer can use **Remove** to remove the item.

---

# 9. Edit Product

If the customer selects **Edit**:

```text id="4h5p3c"
Cart
 ↓
Edit Product
 ↓
Product Details
 ↓
Modify Variant / Add-ons / Quantity
 ↓
Save Changes
 ↓
Return to Cart
```

The existing cart item should be updated, not duplicated.

---

# 10. Edit Combo

For a combo:

```text id="5b8z8x"
Cart
 ↓
Edit Combo
 ↓
Combo Configuration
 ↓
Modify Selections
 ↓
Save Changes
 ↓
Return to Cart
```

Example:

```text id="t5p8m0"
Chicken Meal

Burger
Chicken → Veg

Drink
Coke → Sprite

[Save Changes]
```

The original cart item should be updated.

---

# 11. Remove Item

When customer removes an item:

```text id="k7p2v8"
Remove
 ↓
Remove Cart Item
 ↓
Update Cart
```

A confirmation dialog should only be used if required by the project's UX guideline.

For a simple kiosk flow, immediate removal with an optional undo is preferable.

---

# 12. Cart Subtotal

The cart should show the sum of all item totals.

Example:

```text id="g4k3z8"
Chicken Burger × 2     ₹500
Chicken Meal × 1       ₹319
---------------------------
Subtotal                ₹819
```

### Important

This is only the **cart subtotal**.

Do not calculate:

* Tax
* Final discount
* Final payable amount

until Phase 5.

---

# 13. Tax & Discount Boundary

Phase 4:

```text id="91v9g1"
Items
 ↓
Item Totals
 ↓
Subtotal
```

Phase 5:

```text id="q8x1oa"
Subtotal
 ↓
Discount
 ↓
Tax
 ↓
Final Amount
```

This keeps pricing responsibilities clear.

---

# 14. Continue Shopping

Customer can return to the menu.

```text id="f3z1yl"
Cart
 ↓
Continue Shopping
 ↓
Categories
 ↓
Products / Combos
```

The cart must remain intact.

Example:

```text id="j0t4r5"
Cart
Chicken Burger × 2

Continue Shopping
     ↓
Add Fries
     ↓
Cart

Chicken Burger × 2
Fries × 1
```

---

# 15. Proceed to Order Summary

When the customer selects:

**Proceed**

validate the cart first.

```text id="x2y7c5"
Proceed
   ↓
Validate Cart
   ↓
Check Product Availability
   ↓
Check Combo Availability
   ↓
Check Latest Prices
   ↓
Cart Valid?
```

### Valid

```text id="5o0w7n"
Cart Valid
   ↓
Phase 5
```

### Invalid

```text id="2o1j8k"
Cart Changed / Item Unavailable
   ↓
Update Cart
   ↓
Customer Reviews Again
```

---

# 16. Cart Validation

Before proceeding, validate:

* Product still active
* Combo still active
* Product available for kiosk
* Combo available for kiosk
* Selected variant still available
* Selected add-on still available
* Quantity valid
* Latest applicable item price

The backend should remain the final source of truth.

---

# 17. Product Became Unavailable

Example:

```text id="q0j1x7"
Chicken Burger
Unavailable
```

The customer should be clearly informed.

```text id="k4z7p8"
Chicken Burger is no longer available.

[Remove Item]
```

Do not silently change the customer's order.

---

# 18. Combo Became Unavailable

If a combo becomes unavailable:

```text id="m7s2j0"
Chicken Meal
Currently unavailable
```

The customer must review/remove it before proceeding.

Do not automatically substitute another combo.

---

# 19. Price Changed

If the current backend price differs from the cart price:

```text id="6k5n2q"
Price Updated

Chicken Burger
Previous: ₹180
Current: ₹190
```

The customer should be informed according to the project's pricing policy before proceeding.

Do not silently charge a different amount.

---

# 20. Empty Cart

If all items are removed:

```text id="1w6x9v"
Your cart is empty.

Add items to continue your order.

[Browse Menu]
```

The customer should return directly to the menu.

---

# 21. Cart Persistence

Cart should remain available when customer navigates:

```text id="f7x1ka"
Product
 ↓
Cart
 ↓
Continue Shopping
 ↓
Product
 ↓
Cart
```

Do not clear the cart unless:

* Customer completes the order
* Customer explicitly resets/cancels the session
* Session expires according to the configured rule

---

# 22. Session Protection

The cart belongs to the current kiosk/customer session.

```text id="9w2f8h"
Customer A
   ↓
Cart A
   ↓
Order Complete
   ↓
Reset
   ↓
Customer B
   ↓
Empty Cart
```

Previous customer data must never appear for the next customer.

---

# 23. Back Navigation

From Cart:

```text id="g3v5q2"
Cart
 ↓ Back
Previous Menu / Product
```

But **Proceed** should be the clear primary action.

Do not use multiple competing CTAs.

---

# 24. Order Item Grouping

If the same product is added with exactly the same configuration:

```text id="r2v8z1"
Chicken Burger
Regular
Extra Cheese

Chicken Burger
Regular
Extra Cheese
```

It can be grouped:

```text id="f1q7w4"
Chicken Burger × 2
Regular
Extra Cheese
```

If configurations differ, keep them as separate cart lines.

Example:

```text id="2v4m9x"
Chicken Burger × 1
Regular
Extra Cheese

Chicken Burger × 1
Large
No Add-ons
```

Do not incorrectly merge differently configured items.

---

# 25. Cart Pricing Structure

Each cart line should maintain:

```text id="n4g7u1"
Product / Combo
+
Selected Configuration
+
Quantity
=
Item Total
```

Then:

```text id="0v4x3s"
Item Total 1
+
Item Total 2
+
Item Total 3
=
Subtotal
```

Tax and discounts come later.

---

# 26. UI/UX Guidelines

The cart should follow the kiosk design principles:

* Compact
* Clean
* Touch-friendly
* Clear hierarchy
* Minimal whitespace
* Large quantity controls
* Clear price
* Clear primary CTA
* Easy editing
* Easy removal
* No unnecessary dialogs

Avoid turning the cart into a large checkout form.

---

# 27. Recommended Bottom Action Area

Use a fixed bottom action area where appropriate:

```text id="z0j5h7"
┌─────────────────────────────────────────────┐
│ Subtotal                           ₹819     │
│                                             │
│ [ Continue Shopping ]      [ Proceed ]      │
└─────────────────────────────────────────────┘
```

This makes the primary action easy to reach on a kiosk.

---

# 28. Loading State

When validating the cart:

```text id="c8h6x1"
Checking your order...
```

Keep this short and prevent duplicate actions.

---

# 29. Validation Error

Example:

```text id="z7v3m5"
Some items in your order have changed.

Please review your cart.
```

Highlight the affected items.

Do not send the customer back to the Welcome screen.

---

# 30. Phase 4 Data Flow

```text id="f4c1b7"
PRODUCT / COMBO
      ↓
ADD TO CART
      ↓
CART
      ↓
Review Items
      ↓
Edit / Quantity / Remove
      ↓
Calculate Item Totals
      ↓
Calculate Subtotal
      ↓
Validate Availability & Pricing
      ↓
┌───────────────┐
│ Cart Valid?   │
└───────┬───────┘
        ↓
      YES
        ↓
Phase 5
Tax + Discount + Final Amount
```

---

# 31. Phase 4 Acceptance Criteria

### Cart

* Products can be displayed correctly.
* Combos can be displayed correctly.
* Configurations are retained.
* Quantities can be changed.
* Items can be removed.
* Products can be edited.
* Combos can be edited.
* Subtotal is calculated correctly.

### Validation

* Product availability is checked.
* Combo availability is checked.
* Variant availability is checked.
* Add-on availability is checked.
* Latest price is validated.
* Invalid cart cannot proceed.

### Navigation

* Continue Shopping works.
* Back navigation works.
* Cart is preserved.
* Proceed moves to Phase 5.
* Empty cart returns to menu.

### UI/UX

* Compact layout.
* Touch-friendly controls.
* Clear subtotal.
* Clear primary CTA.
* No unnecessary popups.
* No excessive whitespace.
* No confusing information.

---

# 32. Phase 4 Implementation Rules

1. Reuse the existing authenticated kiosk session.
2. Use cart data created from Phases 2 and 3.
3. Support both products and combos.
4. Preserve all selected variants and add-ons.
5. Support quantity changes.
6. Support edit functionality.
7. Support remove functionality.
8. Recalculate item totals when quantity/configuration changes.
9. Calculate subtotal correctly.
10. Do not calculate final tax in Phase 4.
11. Do not calculate final discount in Phase 4.
12. Validate availability before proceeding.
13. Validate latest pricing before proceeding.
14. Do not silently modify customer selections.
15. Preserve cart when continuing shopping.
16. Do not duplicate identical configured items unnecessarily.
17. Keep differently configured items separate.
18. Do not clear cart during normal navigation.
19. Handle empty cart properly.
20. Prevent duplicate Proceed actions during validation.
21. Keep the cart compact and touch-friendly.
22. Do not implement payment yet.
23. Do not create the final order yet.
24. Proceed only when the cart is valid.

---

# 33. Final Phase 4 Flow

```text id="2n3g6f"
PRODUCT / COMBO
      ↓
ADD TO CART
      ↓
CART
      ↓
REVIEW
      ↓
EDIT / QUANTITY / REMOVE
      ↓
SUBTOTAL
      ↓
VALIDATE
      ↓
┌──────────────┴──────────────┐
↓                             ↓
INVALID                       VALID
↓                             ↓
Update Cart              PHASE 5
                              ↓
                    TAX + DISCOUNT
                    + FINAL AMOUNT
```

### Phase 4 Goal

**Collect all selected products and combos into one accurate cart, allow the customer to review and modify the order, validate the cart, calculate the subtotal, and then hand it cleanly to Phase 5 for tax, discount, and final amount calculation.**
