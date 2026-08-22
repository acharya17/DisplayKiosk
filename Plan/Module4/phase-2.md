# Module 4 — Customer Self-Order Kiosk

## Phase 2 — Product Selection & Customisation

### 1. Phase Purpose

Phase 2 starts when the customer selects a product from the **Phase 1 Product List**.

The purpose is to allow the customer to configure the product **only with the options defined for that product in the Admin/Kiosk configuration**.

### Core Flow

```text
Phase 1
Product List
      ↓
Select Product
      ↓
Product Details
      ↓
Select Variant / Size
      ↓
Select Add-ons / Modifiers
      ↓
Set Quantity
      ↓
Calculate Item Total
      ↓
Add to Cart
      ↓
Continue Shopping / View Cart
```

---

# 2. Phase Scope

### Included

* Product Details
* Product image
* Product name
* Product description
* Base price
* Variants / Sizes
* Add-ons / Modifiers
* Required / optional selections
* Single / multiple selection rules
* Quantity
* Item-level price calculation
* Add to Cart
* Edit selections before adding
* Validation
* Back navigation

### Not Included

Do not implement:

* New login
* Category management
* Product creation
* Combo management
* Cart management
* Order summary
* Tax calculation
* Discount calculation
* Payment
* Order confirmation

These belong to other phases.

---

# 3. Product Data Dependency

Phase 2 must use the product configuration already created in Module 2.

```text
Admin
  ↓
Product
  ↓
Variants / Sizes
  ↓
Add-ons / Modifiers
  ↓
Kiosk Availability
  ↓
Customer Kiosk
```

Do **not** create separate variant or add-on data inside the kiosk.

---

# 4. Product Details

When the customer selects a product:

```text
Product List
     ↓
Product Details
```

Example:

```text
┌──────────────────────────────────────┐
│                                      │
│          [ Product Image ]           │
│                                      │
│  Chicken Burger                      │
│  ₹180                                │
│                                      │
│  Grilled chicken burger with...      │
│                                      │
│  Size                                │
│  [ Regular ] [ Large +₹40 ]          │
│                                      │
│  Add-ons                             │
│  [ ] Extra Cheese +₹30               │
│  [ ] Extra Mayo   +₹20               │
│                                      │
│  Quantity       [-] 1 [+]            │
│                                      │
│       [ Add to Cart — ₹210 ]         │
└──────────────────────────────────────┘
```

Keep the page **compact and touch-friendly**.

---

# 5. Variants / Sizes

If the product has variants:

```text
Size

[ Regular ]
[ Large +₹40 ]
```

The customer selects the required variant.

### Rules

* Show only configured variants.
* Show the price difference clearly.
* Do not show inactive variants.
* Follow the configured selection rule.
* Default selection should only be applied if defined by the product configuration.

---

# 6. Add-ons / Modifiers

If the product has add-ons:

```text
Add-ons

☐ Extra Cheese     +₹30
☐ Extra Mayo       +₹20
☐ Extra Sauce      +₹15
```

Only add-ons assigned to that product should appear.

Do not show unrelated add-ons.

---

# 7. Required vs Optional Selection

The kiosk must respect the configuration.

### Required

Example:

```text
Choose Size *
[ Regular ] [ Large ]
```

Customer cannot add the product until a valid selection is made.

### Optional

Example:

```text
Add-ons
☐ Extra Cheese
☐ Extra Mayo
```

Customer can continue without selecting anything.

---

# 8. Selection Rules

Where configured, support:

### Single Selection

```text
Choose Size

○ Regular
○ Large
○ Jumbo
```

Only one can be selected.

### Multiple Selection

```text
Add-ons

☐ Cheese
☐ Mayo
☐ Sauce
```

Multiple options can be selected according to the configured rules.

Do not invent selection limits if they are not configured.

---

# 9. Quantity

Allow the customer to select quantity.

```text
Quantity

[-]   1   [+]
```

Rules:

* Minimum quantity should follow the configured business rule.
* Prevent quantity below the allowed minimum.
* Apply any configured maximum quantity.
* Update the item total immediately.

---

# 10. Item Price Calculation

The kiosk should calculate the current item amount using the configured pricing logic.

Example:

```text
Base Product       ₹180
Large Variant       +₹40
Extra Cheese        +₹30
------------------------
Item Price          ₹250
```

If quantity is 2:

```text
₹250 × 2 = ₹500
```

### Important

Phase 2 calculates the **item/cart-facing amount**, but final order-level:

* Tax
* Offers
* Discounts

are handled in later phases.

Do not duplicate tax/discount logic here.

---

# 11. Add to Cart

The primary CTA should clearly show the current amount.

Example:

```text
[ Add to Cart — ₹250 ]
```

When selected:

```text
Product
   ↓
Validate Selections
   ↓
Calculate Item Amount
   ↓
Add Item to Cart
```

Then allow:

```text
Continue Shopping
      OR
View Cart
```

---

# 12. Validation Before Add

Before adding:

### Required variant missing

```text
Please select a size.
```

### Required modifier missing

```text
Please select an option.
```

### Invalid selection

```text
Please review your selections.
```

Do not add an incomplete item to the cart.

---

# 13. Product Without Customisation

If the product has no variants or add-ons:

```text
Product Details
      ↓
Quantity
      ↓
Add to Cart
```

Do not show empty sections such as:

```text
Variants
No variants available

Add-ons
No add-ons available
```

Simply hide sections that are not applicable.

---

# 14. Product With Only Variants

```text
Product
 ↓
Select Size
 ↓
Quantity
 ↓
Add to Cart
```

---

# 15. Product With Only Add-ons

```text
Product
 ↓
Select Add-ons
 ↓
Quantity
 ↓
Add to Cart
```

---

# 16. Product With Both

```text
Product
 ↓
Variant / Size
 ↓
Add-ons
 ↓
Quantity
 ↓
Price
 ↓
Add to Cart
```

---

# 17. Back Navigation

Customer can go back to the product list.

```text
Product Details
      ↓ Back
Product List
```

If the customer has made selections but has not added the product:

```text
Back
 ↓
Ask only if necessary
 ↓
Discard selections / Continue
```

Do not unexpectedly lose selections without a clear action.

If the product has already been added to the cart, later editing should preserve its configured selections.

---

# 18. Continue Shopping

After adding:

```text
Added to Cart ✓

[Continue Shopping]
[View Cart]
```

The customer can return to the menu without losing the cart.

```text
Product
 ↓
Add to Cart
 ↓
Continue Shopping
 ↓
Category / Product List
```

---

# 19. Cart Indicator

The kiosk can show a compact cart indicator.

Example:

```text
Cart (3)
```

It should represent the current number of cart items according to the approved cart logic.

Do not expose unnecessary order information during browsing.

---

# 20. Product Image

Product image should:

* Use the configured product image.
* Maintain correct aspect ratio.
* Avoid distortion.
* Have consistent sizing.
* Work well on the kiosk screen.

Do not use oversized image areas that create unnecessary whitespace.

---

# 21. Description

Product descriptions should be concise.

Example:

> Crispy chicken burger with lettuce and special sauce.

Avoid displaying long technical/product-master descriptions that make the kiosk page unnecessarily large.

---

# 22. Availability

If a product becomes unavailable:

```text
Product Unavailable
```

The customer must not be able to add it.

If availability changes while the customer is viewing the page, validate again when adding to cart.

---

# 23. Price Update Validation

The backend should remain the source of truth.

Example:

```text
Customer Opens Product
      ↓
Price ₹180
      ↓
Admin Changes Price
      ↓
Customer Adds Product
      ↓
Backend Validates Latest Price
```

Do not rely only on frontend-calculated values for the final transaction.

---

# 24. Kiosk Configuration Dependency

Only options enabled for that kiosk should be displayed.

```text
Product
   ↓
Available Variants
   ↓
Available Add-ons
   ↓
Kiosk Configuration
   ↓
Customer
```

Example:

If Cheese is disabled for Kiosk 02:

```text
Kiosk 02
Extra Cheese → Do not display
```

---

# 25. Clean UI Structure

Recommended layout:

```text
┌──────────────────────────────────────────────┐
│ ← Back                 Product       Cart(2) │
├──────────────────────────────────────────────┤
│                                              │
│       Product Image       Product Name       │
│                           ₹180               │
│                           Description        │
│                                              │
│                           Size               │
│                           [Regular] [Large]  │
│                                              │
│                           Add-ons            │
│                           ☐ Cheese +₹30      │
│                           ☐ Mayo +₹20        │
│                                              │
│                           Qty [-] 1 [+]      │
│                                              │
│                    [ Add to Cart — ₹250 ]    │
└──────────────────────────────────────────────┘
```

Keep the important selection area visible and easy to operate.

---

# 26. Touch UX Rules

Because this is a self-order kiosk:

* Use large touch targets.
* Avoid tiny checkboxes/buttons.
* Keep important CTAs fixed and easy to reach.
* Use clear selected/unselected states.
* Avoid excessive scrolling.
* Avoid unnecessary dialogs.
* Keep the number of interactions low.

---

# 27. Loading State

If product details/options are loading:

```text
Loading product...
```

Use a compact skeleton or loader.

Do not show technical information.

---

# 28. Error State

If product configuration cannot be loaded:

```text
Unable to load this product.

[Try Again]
[Back to Menu]
```

Do not force logout.

---

# 29. Add-to-Cart Failure

If adding fails:

```text
Unable to add this item.

Please try again.
```

Keep the customer on the product page so selections are not unnecessarily lost.

---

# 30. Phase 2 Data Flow

```text
Phase 1
Product List
      ↓
Select Product
      ↓
Fetch Product Configuration
      ↓
Product Details
      ↓
Load Variants
      ↓
Load Add-ons / Modifiers
      ↓
Customer Selections
      ↓
Quantity
      ↓
Calculate Item Amount
      ↓
Validate
      ↓
Add to Cart
      ↓
Continue Shopping / View Cart
      ↓
Phase 3 / Phase 4
```

---

# 31. Phase 2 Acceptance Criteria

### Product

* Product details load correctly.
* Product image is displayed correctly.
* Product name and price are correct.
* Description is displayed where applicable.
* Product availability is respected.

### Variants

* Configured variants are displayed.
* Required selections are validated.
* Single/multiple selection rules are respected.
* Variant price changes are reflected.

### Add-ons

* Only assigned add-ons are shown.
* Required/optional rules work.
* Selection limits are respected where configured.
* Add-on prices are reflected.

### Quantity

* Quantity can be increased/decreased.
* Minimum/maximum rules are respected.
* Total updates immediately.

### Cart

* Product can be added successfully.
* Selected options are retained.
* Cart count updates.
* Continue Shopping works.
* View Cart works.
* Existing cart is not cleared.

### UI/UX

* Touch-friendly.
* Compact.
* Clean.
* Consistent spacing.
* No unnecessary fields.
* No empty customisation sections.
* Clear selected states.
* Clear final CTA.

---

# 32. Phase 2 Implementation Rules

1. Reuse the existing authenticated kiosk session from Phase 1.
2. Use product data from the Admin/Kiosk configuration.
3. Do not create product data locally.
4. Show only applicable variants.
5. Show only applicable add-ons/modifiers.
6. Respect required/optional selection rules.
7. Respect configured selection limits.
8. Respect kiosk-specific availability.
9. Calculate the item amount correctly.
10. Do not duplicate final tax/discount logic.
11. Validate product availability before adding.
12. Validate pricing with the backend where required.
13. Preserve customer selections while navigating.
14. Do not clear the existing cart when going back.
15. Hide sections that are not applicable.
16. Do not create unnecessary confirmation dialogs.
17. Keep the interface compact and touch-friendly.
18. Keep the Add to Cart CTA clear and prominent.
19. Handle loading and error states properly.
20. After successful Add to Cart, allow **Continue Shopping or View Cart**.
21. Do not implement payment in this phase.
22. Do not implement order confirmation in this phase.
23. Keep the flow ready for the next phase.

---

# 33. Final Phase 2 Flow

```text
PRODUCT LIST
     ↓
SELECT PRODUCT
     ↓
PRODUCT DETAILS
     ↓
┌──────────────────────┐
│ VARIANT / SIZE       │
│        ↓             │
│ ADD-ONS / MODIFIERS  │
│        ↓             │
│ QUANTITY             │
│        ↓             │
│ ITEM TOTAL           │
└──────────┬───────────┘
           ↓
      VALIDATE
           ↓
      ADD TO CART
           ↓
   ┌───────┴────────┐
   ↓                ↓
Continue          View Cart
Shopping
```

### Phase 2 Goal

**Select → Customise → Calculate Item Amount → Validate → Add to Cart**

The phase should provide a clean bridge from **Product Browsing (Phase 1)** to **Cart & Order Review (later phase)** without mixing in payment, tax, discount, or order-confirmation functionality.
