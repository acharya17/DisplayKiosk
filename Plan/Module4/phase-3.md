# Module 4 — Customer Self-Order Kiosk

## Phase 3 — Combo Selection

### 1. Phase Purpose

Phase 3 handles **combo-based ordering**.

When a customer selects a combo, the kiosk should display only the **items and choices configured for that combo** and allow the customer to complete the required selections before adding the combo to the cart.

### Core Flow

```text
Phase 1 — Menu
      ↓
Select Combo
      ↓
Combo Details
      ↓
Select Required Items
      ↓
Select Optional Items / Add-ons
      ↓
Validate Selections
      ↓
Calculate Combo Price
      ↓
Set Quantity
      ↓
Add Combo to Cart
      ↓
Continue Shopping / View Cart
```

---

# 2. Phase Scope

### Included

* Combo listing
* Combo details
* Combo image/name/price
* Included item groups
* Required selections
* Optional selections
* Variants / sizes where configured
* Add-ons where configured
* Quantity
* Combo price calculation
* Selection validation
* Add Combo to Cart
* Edit selections before adding
* Back navigation

### Not Included

Do not implement:

* New login
* Product creation
* Combo creation/editing
* Cart management
* Final tax calculation
* Final discount calculation
* Payment
* Order confirmation

---

# 3. Combo Data Dependency

Combo information must come from the existing Admin configuration.

```text
Admin
  ↓
Combo
  ↓
Included Products
  ↓
Selection Rules
  ↓
Variants / Add-ons
  ↓
Kiosk Availability
  ↓
Customer Kiosk
```

The kiosk must **not create or modify combo configuration**.

---

# 4. Combo Listing

Combos should appear in the appropriate category/menu section.

Example:

```text
Combos

┌─────────────────┐
│     Image       │
│ Chicken Meal    │
│ ₹249            │
│ [View Combo]    │
└─────────────────┘
```

Only active and kiosk-available combos should be displayed.

---

# 5. Combo Details

When the customer selects a combo:

```text
Chicken Meal
₹249

Choose Burger *
[Chicken Burger]
[Veg Burger]

Choose Drink *
[Coke]
[Sprite]

Choose Side
[Fries]
[Salad]

[Add to Cart — ₹249]
```

Only configured choices should appear.

---

# 6. Included Item Groups

A combo may contain different selection groups.

Example:

```text
Chicken Meal

Burger *
→ Select 1

Drink *
→ Select 1

Side
→ Select 1
```

The kiosk must clearly communicate what the customer needs to select.

---

# 7. Required Selection

If a group is required:

```text
Choose Drink *

[ Coke ]
[ Sprite ]
[ Fanta ]
```

The customer cannot add the combo until the required selection is completed.

Example validation:

> Please select a drink.

---

# 8. Optional Selection

If a group is optional:

```text
Extra Add-ons

☐ Extra Cheese +₹30
☐ Extra Sauce +₹15
```

The customer can skip the section.

Do not force an unnecessary selection.

---

# 9. Multiple Selection

If the combo configuration allows multiple selections:

```text
Choose Add-ons

☐ Cheese
☐ Mayo
☐ Sauce
```

Follow the configured selection limit.

For example, if maximum selection is 2:

```text
Maximum 2 selections allowed.
```

Do not allow the customer to exceed the configured limit.

---

# 10. Variant / Size Selection Inside Combo

If an included product has variants:

```text
Choose Burger

Chicken Burger

Size
[Regular]
[Large +₹40]
```

Only show variants configured for that product/combo.

The additional amount, if applicable, must be reflected in the combo total.

---

# 11. Add-ons Inside Combo

If add-ons are available:

```text
Add-ons

☐ Extra Cheese +₹30
☐ Extra Mayo +₹20
```

Only assigned add-ons should appear.

Do not show unrelated product add-ons.

---

# 12. Combo Price Calculation

Example:

```text
Base Combo                 ₹249
Large Variant               +₹40
Extra Cheese                +₹30
--------------------------------
Combo Item Total            ₹319
```

If quantity is 2:

```text
₹319 × 2 = ₹638
```

### Important

Phase 3 calculates the **combo/item amount**.

Final:

* Tax
* Offer
* Discount

will be handled later.

Do not duplicate those rules here.

---

# 13. Quantity

Allow the customer to select combo quantity.

```text
Quantity

[-]  1  [+]
```

The total should update immediately.

Example:

```text
Combo Total
₹319

Quantity
2

Total
₹638
```

---

# 14. Add Combo to Cart

The primary action should be clear:

```text
[ Add Combo to Cart — ₹319 ]
```

When selected:

```text
Validate
   ↓
Calculate
   ↓
Add Combo
   ↓
Cart Updated
```

After successful addition:

```text
Combo added ✓

[Continue Shopping]
[View Cart]
```

---

# 15. Validation

Before adding the combo:

### Missing required selection

```text
Please select a burger.
```

### Missing multiple required selections

Show the required sections clearly.

### Invalid selection

```text
Please review your selections.
```

Do not add an incomplete combo to the cart.

---

# 16. Combo Without Customisation

If a combo has no choices:

```text
Combo
  ↓
Quantity
  ↓
Add to Cart
```

Do not show unnecessary empty sections.

---

# 17. Combo With Product Customisation

If included products have options:

```text
Combo
 ↓
Select Included Product
 ↓
Variant / Size
 ↓
Add-ons
 ↓
Next Included Product
 ↓
Validate
 ↓
Add to Cart
```

Keep the flow simple rather than opening many unnecessary pages.

---

# 18. Selection Progress

For larger combos, a compact progress indicator can help:

```text
Combo Selection

✓ Burger
● Drink
○ Side
```

Use this only when the combo contains enough selections to justify it.

For simple combos, keep everything on one page.

---

# 19. Back Navigation

Customer should be able to return to the menu.

```text
Combo Details
      ↓ Back
Menu
```

If selections have been made but the combo has not been added:

```text
Back
 ↓
Confirm only if selections will be lost
```

Avoid unnecessary confirmation dialogs.

---

# 20. Continue Shopping

After adding a combo:

```text
Combo Added ✓

[Continue Shopping]
[View Cart]
```

Continue Shopping should preserve the existing cart.

---

# 21. Cart Representation

The combo must be stored as one meaningful cart item while retaining its selections.

Example:

```text
Chicken Meal ×1
Chicken Burger
Coke
Fries
Extra Cheese

₹319
```

This information will be required in the Cart and Order Review phase.

---

# 22. Availability

If a combo becomes unavailable:

```text
Combo currently unavailable.
```

The customer must not be able to add it.

Also validate availability again when adding to cart.

---

# 23. Combo Item Availability

If one included item becomes unavailable:

```text
Chicken Meal
 ↓
Chicken Burger ✓
Coke ✕
```

The kiosk should follow the configured business rule.

Do not automatically substitute another item unless the combo configuration explicitly supports substitutions.

---

# 24. Price Validation

The frontend may display the calculated amount, but the backend remains the source of truth.

```text
Customer Selection
      ↓
Frontend Calculation
      ↓
Add to Cart
      ↓
Backend Validation
      ↓
Confirmed Price
```

Do not rely solely on frontend calculations for the final transaction.

---

# 25. UI/UX Structure

Recommended compact layout:

```text
┌─────────────────────────────────────────────┐
│ ← Back                       Cart (2)       │
├─────────────────────────────────────────────┤
│                                             │
│ [ Combo Image ]     Chicken Meal            │
│                     ₹249                    │
│                                             │
│ Burger *                                    │
│ [Chicken] [Veg]                             │
│                                             │
│ Drink *                                     │
│ [Coke] [Sprite]                             │
│                                             │
│ Side                                        │
│ [Fries] [Salad]                             │
│                                             │
│ Add-ons                                     │
│ ☐ Cheese +₹30                               │
│                                             │
│ Quantity [-] 1 [+]                          │
│                                             │
│ [ Add to Cart — ₹319 ]                      │
└─────────────────────────────────────────────┘
```

Keep the page compact and avoid excessive whitespace.

---

# 26. Touch UX

Since this is a kiosk:

* Large selection controls
* Large CTA
* Clear selected state
* Easy quantity controls
* Minimal typing
* No tiny checkboxes
* No unnecessary popups
* Avoid excessive scrolling
* Keep important selections visible

---

# 27. Loading State

When combo configuration is loading:

```text
Loading combo...
```

Use a simple skeleton/loader.

Do not show technical information.

---

# 28. Error State

If combo data cannot be loaded:

```text
Unable to load this combo.

[Try Again]
[Back to Menu]
```

Do not force the customer to log in again.

---

# 29. Add-to-Cart Failure

If the combo cannot be added:

```text
Unable to add this combo.

Please try again.
```

Keep the customer's selections where possible.

---

# 30. Phase 3 Data Flow

```text
PHASE 1
Menu
   ↓
Select Combo
   ↓
Load Combo Configuration
   ↓
Included Products
   ↓
Selection Groups
   ↓
Variants / Sizes
   ↓
Add-ons
   ↓
Customer Selections
   ↓
Quantity
   ↓
Calculate Combo Amount
   ↓
Validate
   ↓
Add to Cart
   ↓
Continue Shopping / View Cart
```

---

# 31. Phase 3 Acceptance Criteria

### Combo

* Active combos are displayed.
* Kiosk availability is respected.
* Combo details load correctly.
* Included products are displayed correctly.
* Selection groups are clear.

### Selection

* Required selections are validated.
* Optional selections can be skipped.
* Multiple selection rules work.
* Variant/size selection works where configured.
* Add-ons work where configured.
* Selection limits are respected.

### Pricing

* Base combo price is correct.
* Variant price changes are reflected.
* Add-on price changes are reflected.
* Quantity updates total correctly.
* Final tax/discount is not duplicated.

### Cart

* Combo can be added.
* Selections are retained.
* Cart count updates.
* Continue Shopping works.
* View Cart works.

### UI/UX

* Compact layout.
* Touch-friendly controls.
* Clear selected state.
* No unnecessary fields.
* No empty sections.
* No unnecessary dialogs.
* Clear Add to Cart CTA.

---

# 32. Phase 3 Implementation Rules

1. Reuse the existing authenticated kiosk session.
2. Use combo configuration from the Admin side.
3. Do not create or edit combos from the kiosk.
4. Show only active and kiosk-available combos.
5. Show only configured included products.
6. Respect required/optional selection rules.
7. Respect configured selection limits.
8. Support variants/sizes where configured.
9. Support add-ons where configured.
10. Calculate the combo item amount correctly.
11. Do not duplicate tax or discount logic.
12. Validate availability before adding.
13. Preserve selections during navigation.
14. Do not clear the existing cart.
15. Hide non-applicable sections.
16. Keep the interface compact and touch-friendly.
17. Avoid unnecessary multi-page selection flows.
18. Use a single-page combo configuration where practical.
19. Handle loading, empty and error states.
20. After adding, provide Continue Shopping or View Cart.
21. Do not implement payment or final order confirmation.
22. Keep the combo data structured correctly for the Cart phase.

---

# 33. Final Phase 3 Flow

```text
COMBO
  ↓
COMBO DETAILS
  ↓
INCLUDED ITEM SELECTION
  ↓
VARIANT / SIZE
  ↓
ADD-ONS
  ↓
QUANTITY
  ↓
ITEM TOTAL
  ↓
VALIDATE
  ↓
ADD TO CART
  ↓
┌──────────────────┐
│ Continue Shopping│
│        OR        │
│    View Cart     │
└──────────────────┘
```

### Phase 3 Goal

**Select Combo → Configure Included Items → Validate → Calculate Combo Amount → Add to Cart**

The phase should connect cleanly with **Phase 2 product selection** and prepare the customer for **Phase 4 — Cart & Order Review**, without mixing payment, final tax, discount, or order-confirmation logic.
