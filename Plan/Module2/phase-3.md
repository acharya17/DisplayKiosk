# Module 2 — Self-Order Kiosk Admin

## Phase 3 — Combo Management

### 1. Phase Purpose

Phase 3 introduces **Combo Management** on top of the Category, Product, and Product Customisation masters created in Phases 1 and 2.

A Combo is a **sellable combination of existing products** offered together as one customer-facing item, usually with a specific combo price.

Example:

```text
Products

Burger       ₹150
Fries         ₹80
Coke          ₹50
----------------
Individual   ₹280

Combo:
Burger Meal
Burger + Fries + Coke
Combo Price: ₹249
```

The important principle is:

> **A Combo must use existing Product Master data. It must not create duplicate products.**

The combo becomes a new sellable configuration that can later be connected to tax, offers, kiosks, orders, and payments.

---

# 2. Phase Dependency

Phase 3 depends on:

### Phase 1 — Category & Products

Uses:

* Product
* Category
* Product image
* Product description
* Base price
* Product availability

### Phase 2 — Product Customisation

Uses where applicable:

* Variants
* Sizes
* Add-ons
* Modifiers
* Customisation pricing

### Phase 3 — Combo

Creates:

```text
Existing Products
       ↓
Combo
       ↓
Combo Items
       ↓
Combo Price
       ↓
Combo Availability
```

### Future Phase 4

Tax and offers/discounts can then be applied according to the approved business rules.

---

# 3. Phase Scope

## Included

### Combo Management

* Combo List
* Add Combo
* Edit Combo
* Combo Details
* Combo availability
* Combo status
* Combo image
* Combo description
* Combo pricing
* Product selection
* Product quantity
* Combo item management
* Combo customisation where required
* Search
* Filters
* Pagination

---

# 4. Not Included

Do not implement in Phase 3:

* Tax configuration
* Discount/offer configuration
* Kiosk configuration
* Payment configuration
* Order monitoring
* Payment monitoring
* Hardware configuration
* Session settings

These belong to later phases.

---

# 5. Core Combo Relationship

The correct data relationship is:

```text
CATEGORY
   ↓
PRODUCT
   ↓
CUSTOMISATION
   ↓
COMBO
   ↓
COMBO ITEMS
```

Example:

```text
Combo:
Burger Meal

Items:
 ├── Burger ×1
 ├── Fries ×1
 └── Coke ×1
```

Each combo item references an existing product.

Do not create:

```text
Burger Meal Burger
Burger Meal Fries
Burger Meal Coke
```

as separate Product Master records.

---

# 6. Combo List

## Purpose

Provide Admin with a compact overview of all configured combos.

### Table Fields

* Combo Name
* Image
* Included Items
* Item Count
* Combo Price
* Availability
* Status
* Actions

### Included Items

Do not display a long list in the table.

Example:

```text
Burger, Fries +1
```

or:

```text
3 Items
```

Use Combo Details to see the complete list.

---

# 7. Combo List Actions

Actions:

* Add Combo
* View
* Edit
* Activate/Deactivate
* Delete, only when safe and permitted

Use a compact action menu if multiple actions make the table crowded.

---

# 8. Combo Search

Search by:

* Combo Name

Where useful and supported:

* Included Product Name

Example:

Search:

`Burger`

Results:

```text
Burger Meal
Chicken Burger Combo
```

Do not add unnecessary search fields.

---

# 9. Combo Filters

Use the global popup filter pattern.

Possible filters:

* Status
* Availability
* Product
* Category

Example:

```text
Filter Combos

Status
[ All ▼ ]

Availability
[ All ▼ ]

Product
[ Select Product ▼ ]

Category
[ Select Category ▼ ]

[Cancel] [Apply]
```

Do not create a permanent filter panel.

---

# 10. Pagination

Use the same compact pagination pattern used in Phases 1 and 2.

Pagination must work correctly with:

* Search
* Filters
* Sorting, if supported

Changing pages should not unnecessarily clear the current search/filter state.

---

# 11. Add Combo

## Purpose

Create a new sellable combination using existing products.

The Add Combo page should be compact but contain everything required to define a valid combo.

---

# 12. Add Combo — Basic Information

### Combo Name

Required.

Examples:

* Burger Meal
* Family Combo
* Breakfast Combo
* Lunch Combo

### Combo Image

Optional/required according to the project's product presentation requirements.

Functions:

* Upload
* Preview
* Replace
* Remove

The image should remain in the same position when editing.

Do not create an oversized image area.

---

# 13. Combo Description

Provide a short customer-facing description.

Example:

> Burger served with fries and a soft drink.

Keep the field compact.

Do not make it unnecessarily large.

---

# 14. Combo Items

This is the most important part of Combo creation.

Admin must select products from the existing Product Master.

### Fields

* Product
* Category
* Quantity
* Price Reference
* Availability
* Remove

Example:

```text
Combo Items

Product             Qty

Chicken Burger       1
French Fries         1
Coke                 1
```

---

# 15. Product Selection

The Product field must use the existing Product Master.

Do not allow free-text product entry.

Admin selects:

```text
Product
[ Chicken Burger ▼ ]
```

The system can then display:

```text
Category: Burgers
Base Price: ₹150
Availability: Available
```

This makes the relationship clear.

---

# 16. Quantity

Each combo item can have a quantity.

Example:

```text
Burger ×1
Fries ×2
Coke ×1
```

Quantity should be:

* Numeric
* Positive
* Valid according to business rules

Do not allow zero/negative quantities.

---

# 17. Duplicate Product Handling

If the same product is added twice:

Do not automatically create two unrelated combo item records.

Prefer:

```text
Fries ×2
```

instead of:

```text
Fries ×1
Fries ×1
```

unless the business specifically requires separate entries.

---

# 18. Combo Price

The combo should have a clearly defined selling price.

### Field

**Combo Price**

Example:

```text
Combo Price
₹249
```

This is the customer-facing price for the combo unless the approved business rule defines another pricing method.

---

# 19. Individual Price Reference

The system should be able to show the value of included products for Admin understanding.

Example:

```text
Burger        ₹150
Fries          ₹80
Coke           ₹50
-------------------
Individual    ₹280

Combo Price   ₹249
```

This helps Admin understand the combo pricing.

Do not treat this calculation as a discount unless the business explicitly defines it as one.

---

# 20. Combo Savings

If the business wants the UI to show savings:

```text
Individual Total: ₹280
Combo Price: ₹249
Savings: ₹31
```

This should be a derived display value.

Do not create a separate manually editable "Savings" field.

The system should calculate:

```text
Individual Total - Combo Price = Savings
```

If the combo price is higher than the individual total, do not show negative savings as a discount.

---

# 21. Combo Availability

Availability controls whether the combo can be ordered.

Example:

```text
Burger Meal
Availability: Available
```

If unavailable:

```text
Burger Meal
Availability: Unavailable
```

An unavailable combo must not be orderable through the kiosk.

---

# 22. Combo Status

Use the global project status pattern.

Do not create duplicate switches.

If the project uses both:

### Status

Whether the combo configuration is active.

### Availability

Whether the combo can currently be ordered.

Keep the meanings clear.

If only one state is required by the project, use one control instead of creating unnecessary duplicate fields.

---

# 23. Add Combo Creation Rule

As established in the previous phases:

**Do not unnecessarily ask for Active/Inactive during Add** if the project's creation standard automatically assigns the initial state.

The Admin should primarily configure:

* Combo Name
* Image
* Description
* Products
* Quantities
* Combo Price
* Availability where required

---

# 24. Add Combo Actions

Use:

* Back
* Save Combo

Do not add an unnecessary Cancel button.

---

# 25. Unsaved Changes

If the Admin has entered/changed information and presses Back:

Show:

**Unsaved Changes**

* Save & Go Back
* Go Back Without Saving
* Continue Editing

If there are no changes:

Back directly.

Use the same behavior as Phases 1 and 2.

---

# 26. Add Combo Validation

### Combo Name

* Required
* Cannot be blank

### Combo Items

* At least one valid product should be selected.
* Product must exist.
* Product must not be deleted.

### Quantity

* Must be valid.
* Must be greater than zero.

### Combo Price

* Required where combo pricing is used.
* Numeric.
* Non-negative.

### Image

Validate upload format/size if image upload is implemented.

### Description

Validate only according to the project's content rules.

---

# 27. Edit Combo

## Purpose

Update an existing combo without creating a duplicate.

### Fields

* Combo Name
* Image
* Description
* Combo Items
* Quantity
* Combo Price
* Availability
* Status where applicable

Existing values must be loaded automatically.

---

# 28. Edit Combo — Product Items

Example:

Existing:

```text
Burger Meal

Burger ×1
Fries ×1
Coke ×1
```

Admin can change to:

```text
Burger ×1
Fries ×2
Coke ×1
```

The system should update the existing combo configuration.

Do not create a new combo automatically.

---

# 29. Edit Combo — Image

If an image already exists:

* Show current image.
* Replace.
* Remove.
* Upload.

The image preview must remain in the same location as the Add page.

Do not move the image to a different section during Edit.

---

# 30. Combo Details

## Purpose

Provide a complete but compact view of one combo.

### Basic Information

* Combo Name
* Image
* Description
* Combo Price
* Availability
* Status

### Included Products

Show:

| Product | Category  | Qty | Base Price |
| ------- | --------- | --: | ---------: |
| Burger  | Burgers   |   1 |       ₹150 |
| Fries   | Sides     |   1 |        ₹80 |
| Coke    | Beverages |   1 |        ₹50 |

### Pricing Summary

```text
Individual Total     ₹280
Combo Price           ₹249
Savings               ₹31
```

Savings should be derived, not manually stored.

---

# 31. Combo Details — Customisation

If the included products have valid customisation configurations from Phase 2, show the applicable configuration.

Example:

```text
Burger
Customisation Available

Size:
Regular / Large

Add-ons:
Extra Cheese
```

Do not duplicate the customisation master.

The combo should reference the existing product customisation configuration.

---

# 32. Combo Customisation

Some combos may need customer choices.

Example:

### Burger Combo

Burger:

* Chicken
* Veg

Drink:

* Coke
* Sprite

Fries:

* Regular
* Peri Peri

The combo should use existing product/customisation configuration where possible.

Do not create completely separate customisation masters only for the combo unless the business explicitly requires combo-specific choices.

---

# 33. Combo Customisation Rule

The relationship should be:

```text
Combo
   ↓
Combo Item
   ↓
Existing Product
   ↓
Existing Product Customisation
```

This avoids duplication.

Example:

```text
Burger Meal
   ↓
Burger
   ↓
Size / Add-ons
```

---

# 34. Product Availability Dependency

A combo contains existing products.

Therefore, Admin must understand when a combo becomes unavailable because an included product is unavailable.

Example:

```text
Burger Meal
 ├── Burger     Available
 ├── Fries      Available
 └── Coke       Unavailable
```

If all combo items are required:

The combo should not be orderable if a required included product is unavailable.

The exact behavior for partial substitutions must follow the business rule.

Do not automatically substitute products unless the requirement supports it.

---

# 35. Combo Availability Logic

Conceptually:

```text
Combo Status
      AND
Combo Availability
      AND
Required Product Availability
      AND
Valid Configuration
      =
Combo Orderable
```

If the backend provides an effective availability state, use that rather than duplicating calculation logic in the frontend.

---

# 36. Category Relationship

A combo may contain products from different categories.

Example:

```text
Burger Meal
 ├── Burger → Burgers
 ├── Fries → Sides
 └── Coke → Beverages
```

Do not force the combo into a single product category unless the business requires it.

If a Combo Category is needed for kiosk browsing, use an appropriate existing category relationship or a specifically defined Combo Category model.

Do not invent a second category system.

---

# 37. Combo Category

If the kiosk UI requires combos to appear under a category, provide:

### Combo Category

* Select existing category, if the business model supports it.

Example:

```text
Combo
 ↓
Meal Combos
```

This should be separate from the categories of the products inside the combo.

Example:

```text
Combo Category:
Meal Combos

Included Product Categories:
Burgers
Sides
Beverages
```

Only implement this if the product/kiosk navigation requires it.

---

# 38. Combo List Status

The list should clearly show:

```text
Burger Meal
₹249
3 Items
Available
Active
```

Use the existing compact status components.

Do not create a different badge design for Combo.

---

# 39. Combo Search and Filter States

### Loading

Use compact skeleton rows.

### Empty

```text
No combos configured yet.
[Add Combo]
```

### No Search Result

```text
No combos match your search.
[Clear Search]
```

### Error

```text
Unable to load combos.
[Retry]
```

---

# 40. Combo Dependency Rules

Before deleting a product:

Check whether it is included in any combo.

Example:

```text
Product:
Chicken Burger

Used in:
Burger Meal
Family Combo
```

Do not allow unsafe product deletion that leaves broken combos.

Possible behavior:

* Prevent deletion.
* Ask Admin to remove the product from affected combos first.
* Deactivate product according to existing Product Master rules.

Do not silently break combo configurations.

---

# 41. Combo Deletion

Combos should not be deleted blindly if:

* They are referenced by active kiosks.
* They have existing orders.
* Historical transaction records reference them.

If historical orders use the combo:

* Preserve the historical transaction.
* Prefer deactivation/archival rather than destructive deletion.

The exact retention behavior must follow the backend/business rules.

---

# 42. Historical Combo Pricing

This is critical.

Example:

Today:

```text
Burger Meal
₹249
```

Tomorrow Admin changes:

```text
Burger Meal
₹279
```

Old orders must continue showing:

```text
₹249
```

New orders use:

```text
₹279
```

Historical orders must use transaction-time pricing.

Do not recalculate old orders from the current Combo Master.

---

# 43. Combo Price and Product Price Synchronization

The individual product prices come from Phase 1.

Example:

```text
Burger     ₹150
Fries       ₹80
Coke        ₹50
```

If Burger changes to ₹170:

The Combo Details can show the updated individual reference value.

However:

**The Combo Price must remain its own configured selling price.**

Example:

```text
New Individual Total
₹300

Existing Combo Price
₹249
```

Do not automatically change the combo price unless the business explicitly requires automatic repricing.

This gives Admin control over the combo selling price.

---

# 44. Combo Price Dependency

Use:

```text
Product Master
     ↓
Reference Price
     ↓
Combo
     ↓
Configured Combo Price
```

The combo does not own independent copies of product prices.

---

# 45. Combo and Customisation Price

If a product inside the combo has customisation:

Example:

```text
Burger Meal
₹249

Burger
Extra Cheese +₹20
```

The system must follow the approved business rule for whether the customisation charge is:

* Added to the combo price
* Included within the combo price
* Restricted for that combo

The source requirements do not define this rule.

Therefore, do not invent the behavior.

If combo-level customisation pricing is required, make the rule explicit in the implementation/business configuration.

---

# 46. Combo and Tax / Discount Dependency

Tax and discounts belong to Phase 4 after this phase.

Phase 3 should only prepare the Combo correctly.

Later relationship:

```text
Combo
   ↓
Tax / Discount
   ↓
Final Price
```

Do not duplicate tax/discount fields inside Combo Management unless the approved business rule explicitly requires combo-specific configuration.

---

# 47. Combo and Kiosk Dependency

Phase 4 will decide whether a Combo is available on a specific kiosk.

Example:

```text
Global Combo:
Burger Meal
Available

Kiosk 01:
Available

Kiosk 02:
Unavailable
```

Do not create separate combos for each kiosk.

The Combo remains one master record.

---

# 48. Combo and Order Dependency

Phase 5 will consume the Combo.

Order item should identify:

* Combo
* Combo name
* Quantity
* Included items
* Selected customisations
* Combo price at order time

Example:

```text
Order #10025

Burger Meal ×1
Combo Price: ₹249

Burger:
Chicken

Fries:
Regular

Drink:
Coke
```

The order should preserve the transaction-time configuration.

---

# 49. Combo and Payment Dependency

Payment should use the final order amount.

The payment layer must not calculate the Combo price independently.

Relationship:

```text
Combo
   ↓
Order
   ↓
Final Order Amount
   ↓
Online Payment
```

Payment uses the validated order amount.

---

# 50. Combo Data Synchronization

The complete relationship should be:

```text
CATEGORY
   ↓
PRODUCT
   ↓
PRODUCT CUSTOMISATION
   ↓
COMBO
   ↓
COMBO ITEMS
   ↓
COMBO PRICE
   ↓
TAX / DISCOUNT
   ↓
KIOSK
   ↓
ORDER
   ↓
PAYMENT
```

Every phase uses the existing source of truth.

---

# 51. Combo UI/UX Requirements

Follow the same global compact UI standard from Phases 1 and 2.

## Compact

* Compact table
* Compact form
* Compact product selector
* Compact item rows
* Controlled section spacing
* No excessive white space

## Add Page

Recommended structure:

```text
Add Combo

Basic Information
Name
Image
Description

Combo Items
Product      Qty      Price
Product      Qty      Price
Product      Qty      Price

Pricing
Individual Total
Combo Price
Savings

Availability

[Back] [Save]
```

Keep everything visually connected.

---

# 52. Combo Item Selector

The product selector should be compact.

Recommended:

```text
Add Product
[ Search Product... ]

Product
[ Chicken Burger ▼ ]

Qty
[ 1 ]

[Add]
```

After adding:

```text
Chicken Burger    ₹150    Qty 1    Remove
Fries              ₹80    Qty 1    Remove
Coke               ₹50    Qty 1    Remove
```

Do not create large cards for each product.

---

# 53. Combo Edit UI

Edit should use the same structure as Add.

Existing data must be populated.

Example:

```text
Combo Name
[ Burger Meal ]

Description
[ Burger with fries and coke ]

Combo Items
Burger       Qty 1
Fries        Qty 1
Coke         Qty 1

Combo Price
[ ₹249 ]

Availability
[ ON ]

[Back] [Save]
```

Do not move fields to completely different locations between Add and Edit.

---

# 54. Combo Details UI

Use compact sections:

```text
Combo Details

Burger Meal
₹249
Available

--------------------------------

Description
Burger with fries and coke.

--------------------------------

Items
Burger ×1
Fries ×1
Coke ×1

--------------------------------

Pricing
Individual Total ₹280
Combo Price ₹249
Savings ₹31

--------------------------------

[Back] [Edit]
```

---

# 55. Responsive Behavior

The Combo UI must remain usable across supported screen sizes.

### Desktop

Use:

* Compact two-column sections where useful.
* Full table.

### Smaller Screens

Stack sections.

Do not create horizontal overflow unnecessarily.

Product item rows should remain readable.

---

# 56. Validation Summary

Before saving:

### Combo

* Name valid.
* At least one product.
* All products valid.
* Quantities valid.
* Combo price valid.

### Product

* Product exists.
* Product is not deleted.
* Product reference is valid.

### Customisation

* Existing customisation references must remain valid.
* Do not allow broken references.

### Availability

* Invalid product state must not result in a broken combo.

---

# 57. Phase 3 Acceptance Criteria

Phase 3 is complete only when:

## Combo Management

* Admin can view combos.
* Admin can search combos.
* Admin can filter combos.
* Admin can add combo.
* Admin can edit combo.
* Admin can view combo details.
* Admin can configure combo price.
* Admin can add existing products to a combo.
* Admin can set product quantity.
* Admin can remove combo items.
* Admin can configure availability.
* Admin can change status where applicable.

## Product Relationship

* Combo uses existing Product Master data.
* No duplicate products are created.
* Product name/category/price references remain synchronized.
* Product deletion is prevented when it would break an active combo.
* Product availability affects combo orderability according to the approved business rule.

## Customisation

* Existing product customisations can be referenced where supported.
* No duplicate customisation masters are created.
* Combo-specific customisation behavior is not invented without business confirmation.

## Pricing

* Combo price is configurable.
* Individual product total can be displayed as reference.
* Savings can be derived.
* Product price changes do not automatically overwrite configured combo price unless explicitly required.
* Historical combo prices remain unchanged in existing orders.

## Future Integration

* Combo can be consumed by Tax/Discount configuration in Phase 4.
* Combo can be assigned to kiosks in Phase 5.
* Combo can appear in orders in Phase 6.
* Combo can be included in payment calculation through the order.

## UI/UX

* Compact UI.
* Consistent padding.
* Consistent spacing.
* Clean Add/Edit.
* Existing data loads correctly.
* Image stays in the same location.
* Back button works.
* Unsaved-change warning works.
* No unnecessary Cancel button.
* Search works.
* Filters use popup dialog.
* Pagination works.
* Loading state exists.
* Empty state exists.
* Error state exists.
* Responsive layout works.
* No excessive white space.

---

# 58. Phase 3 Implementation Rules for AI

1. Read Phase 1 and Phase 2 before implementing Combo Management.
2. Reuse existing Product and Category data.
3. Reuse existing Product Customisation data.
4. Do not create duplicate products for combo items.
5. Do not create duplicate categories.
6. Do not create duplicate customisation masters.
7. Combo must reference existing product records.
8. Keep combo price separate from product base prices.
9. Do not automatically change combo price when product price changes unless explicitly required.
10. Do not invent combo discount, tax, or customisation pricing rules.
11. Prepare the combo model for Phase 4 Tax/Offer configuration.
12. Prepare the combo model for Phase 5 Kiosk configuration.
13. Prepare the combo model for Phase 6 Order/Payment monitoring.
14. Preserve historical combo pricing in completed orders.
15. Prevent deletion that would break active combos.
16. Use deactivation where historical references must remain.
17. Reuse global UI components.
18. Follow the compact UI guideline.
19. Keep Add/Edit layouts consistent.
20. Keep List/Details/Edit data synchronized.
21. Do not break Phase 1 or Phase 2.
22. Fix spacing, alignment, validation, and responsive issues within Combo Management.
23. Do not introduce unsupported business rules.

---

# 59. Final Phase 3 Flow

```text
PHASE 1
Category + Product
        ↓
PHASE 2
Product Customisation
        ↓
PHASE 3
COMBO MANAGEMENT
        ↓
Select Existing Products
        ↓
Set Product Quantities
        ↓
Set Combo Price
        ↓
Set Availability
        ↓
Save Combo
        ↓
Combo Details
        ↓
Ready for Phase 4
```

---

# 60. Final Module Relationship After Phase 3

```text
PHASE 1
CATEGORY + PRODUCT
        ↓
PHASE 2
CUSTOMISATION
        ↓
PHASE 3
COMBO
        ↓
PHASE 4
TAX + OFFERS / DISCOUNTS
        ↓
PHASE 5
KIOSK MANAGEMENT
        ↓
PHASE 6
ORDERS + ONLINE PAYMENTS
        ↓
PHASE 7
SETTINGS + SESSION + HARDWARE
```

---

# 61. Phase 3 Final Goal

At the end of Phase 3, Admin should be able to answer:

* What combos are available?
* Which products are included in each combo?
* How many of each product are included?
* What is the combo selling price?
* What is the individual product value?
* What is the derived savings, if applicable?
* Which customisations are available?
* Is the combo available?
* Is the combo active?
* Which existing products does it depend on?
* Can the combo safely move into Tax/Offer configuration?
* Can the combo later be assigned to a kiosk?
* Can the combo be correctly represented in an order?

The key architecture is:

```text
EXISTING PRODUCT MASTER
        ↓
EXISTING CUSTOMISATION
        ↓
COMBO
        ↓
COMBO PRICE
        ↓
TAX / OFFER
        ↓
KIOSK
        ↓
ORDER
        ↓
ONLINE PAYMENT
```

**Phase 3 should therefore be implemented as a connected Combo Master layer, not as an independent product system.**
