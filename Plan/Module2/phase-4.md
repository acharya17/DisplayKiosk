# Module 2 — Self-Order Kiosk Admin

## Phase 4 — Tax & Offers / Discount Management

### 1. Phase Purpose

Phase 4 adds the **pricing-rule layer** to the Category, Product, Customisation, and Combo configuration created in Phases 1–3.

Admin should be able to configure:

* Taxes
* Offers
* Discounts
* Applicability
* Validity
* Product/category/combo relationships
* Active/inactive state
* Pricing impact

The important principle is:

> **Tax and discount configuration must use existing Products, Categories, and Combos. They must not create duplicate data.**

The flow becomes:

```text
CATEGORY
   ↓
PRODUCT
   ↓
CUSTOMISATION
   ↓
COMBO
   ↓
TAX
   ↓
OFFER / DISCOUNT
   ↓
READY FOR KIOSK
```

---

# 2. Phase Dependency

Phase 4 depends on:

### Phase 1

* Categories
* Products
* Base prices
* Product availability

### Phase 2

* Variants
* Sizes
* Add-ons
* Modifiers
* Customisation pricing

### Phase 3

* Combos
* Combo items
* Combo price
* Combo availability

Phase 4 must consume these existing records.

Do not recreate:

* Products
* Categories
* Customisations
* Combos

---

# 3. Phase Scope

## Included

### Tax Management

* Tax List
* Add Tax
* Edit Tax
* Tax Details
* Tax applicability
* Tax status

### Offer / Discount Management

* Offer List
* Add Offer
* Edit Offer
* Offer Details
* Percentage discount
* Fixed amount discount
* Applicability
* Validity
* Status

### Pricing Relationship

* Product applicability
* Category applicability
* Combo applicability
* Pricing impact preview where supported

---

# 4. Important Business Rule

The source requirements establish that Admin needs tax and discount configuration, but the exact business rules for:

* Tax inclusive/exclusive pricing
* Tax calculation order
* Multiple tax stacking
* Multiple discount stacking
* Discount priority
* Minimum order amount
* Maximum discount
* Combo-specific discount behavior

are not fully defined.

Therefore:

> **Do not invent these rules in the UI or frontend logic.**

The implementation should support the approved backend/business rules once provided.

---

# 5. Tax List

## Purpose

Provide a compact overview of all configured taxes.

### Table Fields

* Tax Name
* Tax Rate
* Applicable To
* Status
* Actions

Example:

```text
GST 5%
5%
Biryani + 4 Products
Active
```

Do not display a long product/category list inside the table.

---

# 6. Tax Search

Search by:

* Tax Name

Example:

```text
Search taxes...
```

Provide a clear action after typing.

---

# 7. Tax Filters

Use the standard popup filter dialog.

### Filters

* Status
* Applicability

Example:

```text
Filter

Status
[ All ▼ ]

Applicable To
[ All Products ▼ ]

[Cancel] [Apply]
```

Do not create a permanent filter sidebar.

---

# 8. Add Tax

## Basic Information

### Tax Name

Required.

Examples:

* GST
* Service Tax

Use the actual business terminology provided by the project.

### Tax Rate

Required.

Example:

```text
Tax Rate
[ 5 ] %
```

Validate numeric input.

---

# 9. Tax Applicability

Tax must be connected to existing data.

Possible options:

* All Products
* Selected Categories
* Selected Products
* Selected Combos

Only include applicability levels supported by the approved business model.

---

# 10. Selected Categories

If Admin selects:

```text
Selected Categories
```

show:

```text
Category
[ Select Categories ▼ ]
```

Allow multiple selection where required.

Use existing Category Master records.

Do not create categories here.

---

# 11. Selected Products

If Admin selects:

```text
Selected Products
```

show:

```text
Product
[ Search and Select Products ▼ ]
```

Use existing Product Master records.

Do not create products here.

---

# 12. Selected Combos

If combo-level tax applicability is required:

```text
Combo
[ Search and Select Combos ▼ ]
```

Use existing Combo Master records from Phase 3.

Do not recreate combo information.

If the approved business rule applies tax automatically through the underlying products instead, follow that rule instead of creating duplicate combo tax logic.

---

# 13. Tax Status

Use the project's standard status pattern.

Possible state:

```text
Active
Inactive
```

Do not create multiple controls that represent the same state.

---

# 14. Add Tax Actions

Use:

* Back
* Save Tax

Do not add an unnecessary Cancel button.

---

# 15. Tax Unsaved Changes

If Admin has changed the form and presses Back:

```text
Unsaved Changes

Save & Go Back
Go Back Without Saving
Continue Editing
```

If no changes exist:

* Go back directly.

Use the same pattern throughout the project.

---

# 16. Edit Tax

Existing configuration must load correctly.

### Fields

* Tax Name
* Tax Rate
* Applicability
* Categories
* Products
* Combos where supported
* Status

Admin should be able to modify the existing configuration without creating a duplicate tax record.

---

# 17. Tax Details

Show a compact complete view.

### Basic

* Tax Name
* Tax Rate
* Status

### Applicability

* Scope
* Categories
* Products
* Combos where applicable

### Usage

Where available:

* Number of affected products
* Number of affected categories
* Number of affected combos

### Actions

* Back
* Edit

---

# 18. Offer / Discount List

## Purpose

Provide Admin with one place to manage promotional pricing rules.

### Table Fields

* Offer Name
* Discount Type
* Discount Value
* Applicable To
* Validity
* Status
* Actions

Example:

```text
Lunch Offer
10%
Biryani
20 Aug – 30 Aug
Active
```

---

# 19. Offer Search

Search by:

* Offer Name

Where supported:

* Product
* Combo

Keep the primary search simple.

---

# 20. Offer Filters

Use the global popup filter.

### Filters

* Discount Type
* Status
* Applicability
* Validity

Example:

```text
Filter Offers

Discount Type
[ Percentage ▼ ]

Status
[ Active ▼ ]

Applicability
[ Products ▼ ]

Validity
[ Current ▼ ]

[Cancel] [Apply]
```

---

# 21. Add Offer

## Basic Information

### Offer Name

Required.

Examples:

* Lunch Offer
* Weekend Combo Offer
* Beverage Offer

### Discount Type

Supported types:

* Percentage
* Fixed Amount

Do not add additional discount types unless required.

---

# 22. Discount Value

The field changes according to the selected type.

### Percentage

```text
Discount
[ 10 ] %
```

### Fixed Amount

```text
Discount
₹ [ 50 ]
```

Validation must match the selected discount type.

---

# 23. Offer Applicability

Possible options:

* All Products
* Selected Categories
* Selected Products
* Selected Combos

Only include the scopes supported by the business rules.

Example:

```text
Applicability
( ) All Products
( ) Categories
( ) Products
( ) Combos
```

---

# 24. Category Applicability

If category-based:

```text
Categories
[ Biryani ▼ ]
[ Beverages ▼ ]
```

Multiple categories can be selected where supported.

The category records must come from Phase 1.

---

# 25. Product Applicability

If product-based:

```text
Products
[ Chicken Biryani ▼ ]
[ Veg Biryani ▼ ]
```

Products must come from Phase 1.

---

# 26. Combo Applicability

If combo-based:

```text
Combos
[ Burger Meal ▼ ]
[ Family Combo ▼ ]
```

Combos must come from Phase 3.

Do not create a separate combo record inside the Offer.

---

# 27. Offer Validity

Where date-based validity is required:

### Fields

* Start Date
* End Date

Example:

```text
Start Date
20 Aug 2026

End Date
30 Aug 2026
```

Validation:

* Start Date cannot be after End Date.
* Invalid ranges must be rejected.

If an offer does not require date-based validity, do not force unnecessary date entry.

---

# 28. Offer Status

Use the standard project status.

Example:

```text
Active
Inactive
```

An offer should only be considered applicable when it is:

* Active
* Within its configured validity period

according to the backend rules.

---

# 29. Add Offer Actions

Use:

* Back
* Save Offer

No unnecessary Cancel button.

---

# 30. Edit Offer

Existing configuration must be loaded.

### Fields

* Offer Name
* Discount Type
* Discount Value
* Applicability
* Categories
* Products
* Combos
* Start Date
* End Date
* Status

Conditional fields should remain conditional.

Example:

If:

```text
Applicability = Products
```

show only:

```text
Product Selection
```

Do not leave unused category/combo selectors taking up space.

---

# 31. Offer Details

Show:

### Basic

* Offer Name
* Discount Type
* Discount Value
* Status

### Applicability

* Scope
* Categories
* Products
* Combos

### Validity

* Start Date
* End Date
* Current state

### Impact

Where available:

* Number of affected products
* Number of affected categories
* Number of affected combos

---

# 32. Product Integration

Product Details should show applicable pricing rules.

Example:

```text
Chicken Biryani

Price
₹220

Tax
GST 5%

Offers
Lunch Offer
10%
```

This is a reference to Phase 4 configuration.

Do not create another tax/offer configuration inside Product Details.

---

# 33. Combo Integration

Combo Details should also show applicable pricing rules where supported.

Example:

```text
Burger Meal

Combo Price
₹249

Tax
GST 5%

Offer
Weekend Combo
10%
```

Again, these are references to Phase 4.

---

# 34. Pricing Relationship

The conceptual pricing flow is:

```text
Product / Combo
      ↓
Base / Combo Price
      ↓
Applicable Discount
      ↓
Tax
      ↓
Final Payable Amount
```

However:

> The exact order and calculation of tax and discount must follow the approved backend/business rule.

Do not hardcode the formula without confirmation.

---

# 35. Example

Product:

```text
Chicken Biryani
₹220
```

Customisation:

```text
Extra Raita
+₹20
```

Subtotal:

```text
₹240
```

Offer:

```text
10%
```

Discount:

```text
₹24
```

Tax:

```text
Configured tax
```

Final amount:

```text
Backend-calculated amount
```

The UI should display the actual calculated values returned by the system.

---

# 36. Combo Example

Products:

```text
Burger     ₹150
Fries       ₹80
Coke        ₹50
```

Combo:

```text
Burger Meal
₹249
```

Offer:

```text
Weekend Offer
10%
```

Tax:

```text
Configured tax
```

Final amount:

```text
Backend-calculated
```

Do not automatically assume how the discount/tax interacts with the combo unless the business rule defines it.

---

# 37. Multiple Tax / Discount Conflicts

Potential issue:

```text
Product:
Chicken Biryani

Tax:
GST 5% through Category

Another Tax:
GST 5% directly on Product
```

Or:

```text
Product:
Chicken Biryani

Offer A:
10%

Offer B:
20%
```

The current requirements do not define:

* Priority
* Stacking
* Highest discount
* First matching rule
* Exclusive offers

Therefore:

> Do not silently apply multiple rules.

The system should either:

* Prevent ambiguous configurations, or
* Follow the explicit backend/business rule.

---

# 38. Combo/Product Availability Dependency

A tax or offer may be configured for a product that later becomes inactive.

The configuration should remain safely stored.

However:

* Inactive products should not become orderable because an offer exists.
* An inactive combo should not become orderable because a discount exists.

Master availability remains authoritative.

---

# 39. Tax/Offer Dependency Rules

Before deleting a Category:

Check:

```text
Is category referenced by tax?
Is category referenced by offer?
```

Before deleting a Product:

Check:

```text
Is product referenced by tax?
Is product referenced by offer?
Is product used by combo?
```

Before deleting a Combo:

Check:

```text
Is combo referenced by offer?
Is combo used by kiosk?
Is combo referenced by historical orders?
```

Prefer deactivation where historical references must remain.

---

# 40. Historical Transaction Protection

Once a product/combo is used in an order:

Changes to:

* Product price
* Combo price
* Tax rate
* Offer value
* Offer validity

must not rewrite the historical transaction.

Example:

Old order:

```text
Burger Meal
₹249
10% Offer
```

Later:

```text
Burger Meal
₹279
20% Offer
```

The old order must continue showing its original transaction values.

---

# 41. Kiosk Preparation

Phase 4 should consume these pricing configurations.

The relationship becomes:

```text
Product
   ↓
Combo
   ↓
Tax / Offer
   ↓
Kiosk
```

Admin should not have to recreate tax or discount configuration while setting up a kiosk.

---

# 42. Kiosk Applicability

Where supported, Admin should be able to understand whether a pricing rule is globally applicable or kiosk-specific.

However, if the business model defines tax/discount globally:

> Do not add unnecessary kiosk-specific tax/discount configuration.

The kiosk should simply consume the valid global pricing rules.

---

# 43. Search, Filter & Pagination Summary

## Tax

### Search

* Tax Name

### Filters

* Status
* Applicability

## Offers

### Search

* Offer Name

### Filters

* Discount Type
* Status
* Applicability
* Validity

Use:

```text
Search → Filter → Results → Pagination
```

with the same global UI components.

---

# 44. UI/UX Requirements

Phase 4 must follow the compact UI standard established in Phases 1–3.

### Forms

* Compact inputs
* Consistent labels
* Minimal vertical gaps
* Conditional fields
* Clear required indicators

### Tables

* Compact row height
* Proper column alignment
* Consistent status badges
* Compact action menu

### Dialogs

Use dialogs for:

* Filters
* Confirmation
* Unsaved changes
* Delete/deactivate warnings where applicable

### No Excessive White Space

Avoid:

* Large empty areas
* Oversized cards
* Huge form sections
* Unnecessary headings
* Duplicate information

---

# 45. Recommended Tax Add Layout

```text
Add Tax

Tax Information
Tax Name       [ GST ]
Tax Rate       [ 5 ] %

Applicability
( ) All Products
( ) Categories
( ) Products
( ) Combos

Selected Items
[ Conditional selector ]

--------------------------------

[Back]                 [Save Tax]
```

---

# 46. Recommended Offer Add Layout

```text
Add Offer

Basic Information
Offer Name       [ Lunch Offer ]

Discount
Type             [ Percentage ▼ ]
Value            [ 10 ] %

Applicability
( ) All Products
( ) Categories
( ) Products
( ) Combos

Validity
Start Date       [ DD/MM/YYYY ]
End Date         [ DD/MM/YYYY ]

--------------------------------

[Back]               [Save Offer]
```

Only show relevant fields.

---

# 47. List-to-Edit Synchronization

If Admin creates:

```text
Lunch Offer
10%
Biryani Category
20 Aug – 30 Aug
Active
```

The List must show:

```text
Lunch Offer | 10% | Biryani | 20–30 Aug | Active
```

Edit must load exactly:

```text
Offer Name: Lunch Offer
Discount: 10%
Category: Biryani
Start: 20 Aug
End: 30 Aug
Status: Active
```

There must be no hardcoded or duplicated display values.

---

# 48. Loading State

Use the global compact skeleton.

### List

Show compact table skeleton rows.

### Add/Edit

Show compact form skeleton.

### Details

Show grouped skeleton sections.

Do not use oversized loaders.

---

# 49. Empty State

### Tax

```text
No taxes configured yet.
[Add Tax]
```

### Offer

```text
No offers configured yet.
[Add Offer]
```

### Search

```text
No matching records found.
[Clear Search]
```

Keep the empty state compact.

---

# 50. Error State

If data fails to load:

```text
Unable to load taxes.
[Retry]
```

or:

```text
Unable to load offers.
[Retry]
```

For Save errors:

* Keep entered values.
* Display clear error.
* Allow retry.

Do not reset the entire form after a failed save.

---

# 51. Responsive Behavior

The Phase 4 UI must work across supported screen sizes.

### Desktop

Use compact two-column layouts where useful.

### Smaller Screens

Stack fields.

Example:

```text
Tax Name
[ Input ]

Tax Rate
[ Input ]

Applicability
[ Select ]
```

Do not create unnecessary horizontal scrolling.

---

# 52. Phase 4 Acceptance Criteria

Phase 4 is complete only when:

## Tax

* Admin can list taxes.
* Admin can search taxes.
* Admin can filter taxes.
* Admin can add tax.
* Admin can edit tax.
* Admin can view tax details.
* Admin can configure tax rate.
* Admin can configure applicability.
* Admin can activate/deactivate tax.
* Existing categories/products/combos can be referenced.
* Duplicate master data is not created.

## Offers

* Admin can list offers.
* Admin can search offers.
* Admin can filter offers.
* Admin can add offers.
* Admin can edit offers.
* Admin can view offer details.
* Admin can configure percentage discounts.
* Admin can configure fixed discounts.
* Admin can configure applicability.
* Admin can configure validity where supported.
* Admin can activate/deactivate offers.

## Integration

* Product references come from Phase 1.
* Customisation remains from Phase 2.
* Combo references come from Phase 3.
* Tax/offer configuration is available for later Kiosk configuration.
* Historical transactions are not modified.
* List and Edit data remain synchronized.

## Validation

* Invalid tax rate prevented.
* Invalid discount value prevented.
* Invalid date range prevented.
* Empty applicability prevented.
* Invalid product/category/combo references prevented.
* Unsafe deletion prevented.

## UI/UX

* Compact UI.
* Compact forms.
* Compact tables.
* Proper spacing.
* Proper padding.
* Consistent components.
* Popup filters.
* Search.
* Pagination.
* Loading state.
* Empty state.
* Error state.
* Unsaved-change warning.
* No unnecessary Cancel button.
* Responsive layout.
* No excessive white space.

---

# 53. Phase 4 Implementation Rules for AI

1. Read Phases 1–3 before implementing Phase 4.
2. Reuse Category Master.
3. Reuse Product Master.
4. Reuse Product Customisation from Phase 2.
5. Reuse Combo Master from Phase 3.
6. Do not create duplicate products/categories/combos.
7. Tax must reference existing records.
8. Offers must reference existing records.
9. Keep tax and discount rules separate.
10. Do not invent tax calculation rules.
11. Do not invent discount stacking rules.
12. Do not invent offer priority.
13. Do not invent combo tax/discount behavior.
14. Follow backend/business calculation rules.
15. Preserve historical transaction values.
16. Prevent unsafe deletion of referenced configurations.
17. Prefer deactivation where historical references exist.
18. Use conditional fields.
19. Keep Add and Edit layouts consistent.
20. Keep List, Details, Add, and Edit synchronized.
21. Reuse global search/filter/table/dialog components.
22. Follow the compact UI guideline.
23. Do not break Phases 1–3.
24. Prepare the data model for Phase 5 Kiosk Management.
25. Fix spacing, alignment, validation, and responsive issues within Phase 4.

---

# 54. Final Phase 4 Flow

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
Select Applicability
        ↓
Configure Validity
        ↓
Activate Configuration
        ↓
Ready for Kiosk
```

---

# 55. Complete Module 2 Flow After Phase 4

```text
CATEGORY
    ↓
PRODUCT
    ↓
CUSTOMISATION
    ↓
COMBO
    ↓
TAX
    ↓
OFFER / DISCOUNT
    ↓
KIOSK
    ↓
ORDER
    ↓
ONLINE PAYMENT
    ↓
SETTINGS / SESSION / HARDWARE
```

---

# 56. Phase 4 Final Goal

At the end of Phase 4, Admin should be able to answer:

* What taxes are configured?
* What rate does each tax use?
* Where does each tax apply?
* What offers exist?
* What type of discount does each offer provide?
* Which products/categories/combos are affected?
* When is the offer valid?
* Is the tax or offer active?
* What pricing configuration will the kiosk consume?
* Are the configurations connected to the existing Product and Combo masters?
* Can these rules safely flow into Kiosk → Order → Payment?

The key principle is:

```text
PHASE 1
Products
      ↓
PHASE 2
Customisation
      ↓
PHASE 3
Combos
      ↓
PHASE 4
Tax + Offers
      ↓
PHASE 5
Kiosk
      ↓
PHASE 6
Orders + Payments
      ↓
PHASE 7
Settings + Hardware
```

**Phase 4 is therefore the pricing-rule layer of Module 2. It should connect existing products and combos to tax and promotional pricing without duplicating any master data or inventing unsupported business rules.**
