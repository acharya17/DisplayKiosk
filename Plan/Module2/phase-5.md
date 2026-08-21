# Module 2 — Self-Order Kiosk Admin

## Phase 5 — Kiosk Management, Configuration & Monitoring

### 1. Phase Purpose

Phase 5 connects all the master and pricing configuration created in Phases 1–4 to the actual **Self-Order Kiosks**.

Admin should be able to:

* Create and manage kiosks.
* Identify each kiosk uniquely.
* Assign a location/store.
* Configure which categories are available.
* Configure which products are available.
* Configure which combos are available.
* Configure supported online payment methods for each kiosk.
* Monitor kiosk status.
* Monitor kiosk availability.
* Monitor kiosk connection state.
* View the complete configuration of a kiosk.

The core principle is:

> **Kiosk Management is a configuration layer over the existing master data. It must not create duplicate products, combos, taxes, discounts, or payment methods.**

---

# 2. Phase Dependency

Phase 5 depends on:

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

Phase 5 connects all of this to a physical kiosk.

---

# 3. Complete Relationship

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
KIOSK-SPECIFIC AVAILABILITY
    ↓
CUSTOMER
```

The kiosk does not own a separate copy of the master data.

---

# 4. Phase Scope

## Included

### Kiosk Management

* Kiosk List
* Add Kiosk
* Edit Kiosk
* Kiosk Details

### Kiosk Configuration

* Category availability
* Product availability
* Combo availability
* Online payment method assignment
* Kiosk availability
* Kiosk status

### Kiosk Monitoring

* Online/offline state
* Active/inactive state
* Availability
* Last active/communication
* Basic operational status

### Supporting UI

* Search
* Filters
* Pagination
* Loading state
* Empty state
* Error state
* Validation
* Unsaved-change warning

---

# 5. Not Included

Do not implement in Phase 5:

* Product creation
* Category creation
* Customisation creation
* Combo creation
* Tax creation
* Offer creation
* Order monitoring
* Payment transaction monitoring
* Hardware configuration
* Session/inactivity configuration

Those belong to other phases.

---

# 6. Kiosk List

## Purpose

Provide Admin with a compact overview of all configured kiosks.

### Table Fields

* Kiosk Name
* Kiosk ID
* Location
* Status
* Availability
* Connection
* Last Active
* Actions

Example:

```text
Counter 01
KSK-001
Main Store
Active
Available
Online
2 min ago
```

Keep the table compact.

Do not add unnecessary technical columns.

---

# 7. Kiosk Search

Search by:

* Kiosk Name
* Kiosk ID
* Location

Example:

```text
Search kiosk...
```

After typing:

* Results update.
* Clear search is available.
* Pagination remains functional.

---

# 8. Kiosk Filters

Use the standard popup filter dialog.

### Filters

* Status
* Availability
* Connection
* Location

Example:

```text
Filter Kiosks

Status
[ All ▼ ]

Availability
[ All ▼ ]

Connection
[ All ▼ ]

Location
[ All ▼ ]

[Cancel] [Apply]
```

Do not create a permanent filter sidebar.

---

# 9. Kiosk Pagination

Use the global compact pagination.

Pagination must work correctly with:

* Search
* Filters
* Sorting, if supported

Do not reset the current search/filter state unnecessarily.

---

# 10. Kiosk Status

Status represents the administrative state of the kiosk.

Possible states:

* Active
* Inactive
* Maintenance

Use the backend/project-defined values where available.

Do not invent additional status types without requirement support.

---

# 11. Kiosk Availability

Availability represents whether customers can use the kiosk.

Example:

```text
Status: Active
Availability: Available
```

Another valid state:

```text
Status: Active
Availability: Unavailable
```

Do not treat availability and status as the same thing.

---

# 12. Kiosk Connection

Connection represents whether the kiosk is communicating with the system.

Possible values:

* Online
* Offline

Example:

```text
Status: Active
Availability: Available
Connection: Offline
```

This is possible and should remain clearly distinguishable.

---

# 13. Add Kiosk

## Purpose

Register a new physical Self-Order Kiosk.

### Basic Fields

#### Kiosk Name

Required.

Examples:

* Counter 01
* Entrance Kiosk
* Floor 1 Kiosk

#### Kiosk ID

Required or system-generated according to the implementation.

Must be unique.

Example:

```text
KSK-001
```

#### Location / Store

Required when the system supports multiple locations.

Use existing location/store data.

Do not create a separate location master inside Kiosk Management.

---

# 14. Kiosk ID

Kiosk ID must uniquely identify the physical kiosk.

Rules:

* No duplicates.
* Stable after creation.
* Used by orders and monitoring.
* Used for kiosk-specific configuration.

If system-generated:

* Generate automatically.
* Show after creation.
* Keep it read-only during Edit.

---

# 15. Add Kiosk Actions

Use:

```text
[Back] [Save Kiosk]
```

Do not add an unnecessary Cancel button.

After successful creation, Admin can continue to Kiosk Details/Configuration.

---

# 16. Add Kiosk Unsaved Changes

If Admin enters information and presses Back:

```text
Unsaved Changes

Save & Go Back
Go Back Without Saving
Continue Editing
```

If there are no changes:

* Go back directly.

Use the same project-wide behavior.

---

# 17. Edit Kiosk

Edit must load the existing configuration.

### Fields

* Kiosk Name
* Kiosk ID
* Location
* Status
* Availability

### Kiosk ID

Normally read-only after creation.

Do not change the identity of a physical kiosk through normal Edit.

---

# 18. Kiosk Details

## Purpose

Show a complete but compact overview.

### Kiosk Information

* Kiosk Name
* Kiosk ID
* Location

### Operational State

* Status
* Availability
* Connection
* Last Active

### Configuration Summary

* Categories enabled
* Products enabled
* Combos enabled
* Online payment methods

### Actions

* Back
* Edit
* Configure
* Monitor

Do not duplicate the entire product/category master inside the details page.

---

# 19. Kiosk Configuration

## Purpose

Configure what a particular kiosk can display and sell.

The configuration should use existing master records.

Recommended structure:

```text
Configure Kiosk

Kiosk Information

Menu
 ├── Categories
 ├── Products
 └── Combos

Payments
 └── Online Payment Methods

Availability
 └── Kiosk Availability

[Save]
```

Keep this page compact.

---

# 20. Category Availability

Admin can decide which existing categories are available on a specific kiosk.

Example:

```text
Category          Available

Biryani           ON
Beverages         ON
Desserts          OFF
```

The category itself remains globally unchanged.

This is only kiosk-specific availability.

---

# 21. Product Availability

Admin can configure which existing products are available on the selected kiosk.

Example:

```text
Product              Category       Available

Chicken Biryani      Biryani        ON
Veg Biryani          Biryani        ON
Cold Coffee          Beverages      OFF
```

Product information comes from Phase 1.

---

# 22. Global vs Kiosk Product Availability

There are two levels:

### Global Product

```text
Chicken Biryani
Global Availability: Available
```

### Kiosk

```text
Counter 01
Kiosk Availability: Available
```

Effective availability:

```text
Global Available
        AND
Kiosk Available
        =
Orderable
```

If a product is globally unavailable:

```text
Global: Unavailable
Kiosk: Available
```

The product must still not be orderable.

The kiosk cannot override a global product disable.

---

# 23. Combo Availability

Combos created in Phase 3 must be configurable per kiosk.

Example:

```text
Combo              Available

Burger Meal        ON
Family Combo       OFF
Breakfast Combo    ON
```

The kiosk references the existing Combo Master.

Do not create another combo.

---

# 24. Combo Availability Dependency

A combo may contain multiple products.

Example:

```text
Burger Meal
 ├── Burger
 ├── Fries
 └── Coke
```

The combo should only be orderable if the required underlying products are available according to the approved business rules.

Conceptually:

```text
Combo Available
       AND
Required Products Available
       =
Combo Orderable
```

Do not automatically create substitutions unless explicitly supported.

---

# 25. Product Customisation in Kiosk

The kiosk should consume the existing customisation configuration from Phase 2.

Example:

```text
Chicken Biryani
   ↓
Size
   ↓
Add-ons
   ↓
Modifiers
```

Admin should not recreate customisation options inside Kiosk Configuration.

Kiosk configuration should only determine whether the related product is available.

---

# 26. Tax and Offer Integration

Tax and offers configured in Phase 4 should automatically flow to the kiosk where applicable.

Example:

```text
Product
Chicken Biryani

Tax
GST 5%

Offer
Lunch Offer 10%
```

Kiosk configuration should not ask Admin to enter:

* Tax rate
* Offer value
* Discount percentage

Those already belong to Phase 4.

---

# 27. Online Payment Configuration

The project requires **online payment only**.

Kiosk configuration should allow Admin to enable the online payment methods already configured in the system.

Possible methods may include:

* UPI
* QR-based payment
* Card
* Other approved online methods

Only actual configured payment methods should appear.

---

# 28. Payment Method Assignment

Example:

```text
Counter 01

UPI
[ ON ]

Card
[ ON ]
```

Another kiosk:

```text
Counter 02

UPI
[ ON ]

Card
[ OFF ]
```

The payment method configuration itself remains a separate source of truth.

Kiosk only controls whether an already-configured method is available on that kiosk.

---

# 29. Payment Configuration Rule

Do not create:

```text
Counter 01 UPI
Counter 02 UPI
```

as separate payment masters.

Correct relationship:

```text
Payment Method Master
        ↓
UPI
        ↓
Kiosk Assignment
        ↓
Counter 01
```

---

# 30. Kiosk Menu Structure

The kiosk should ultimately consume:

```text
Categories
   ↓
Products
   ↓
Customisations

Combos
   ↓
Combo Items
   ↓
Customisations
```

Example:

```text
Biryani
 ├── Chicken Biryani
 └── Veg Biryani

Combos
 ├── Burger Meal
 └── Family Combo
```

The Admin panel only configures availability.

---

# 31. Kiosk Configuration Layout

Recommended compact layout:

```text
Configure Kiosk

Counter 01
KSK-001

--------------------------------

Categories

Biryani             ON
Beverages           ON
Desserts            OFF

--------------------------------

Products

Chicken Biryani     ON
Veg Biryani         ON
Cold Coffee         OFF

--------------------------------

Combos

Burger Meal         ON
Family Combo        OFF

--------------------------------

Online Payments

UPI                 ON
Card                ON

--------------------------------

Kiosk Availability

Available            ON

                         [Save]
```

Do not create oversized cards for every item.

---

# 32. Kiosk Monitoring

## Purpose

Monitor the current operational state of each kiosk.

Monitoring is different from configuration.

### Monitoring Fields

* Kiosk Name
* Kiosk ID
* Location
* Status
* Availability
* Connection
* Last Active
* Current State

Example:

```text
Counter 01
KSK-001
Main Store
Active
Available
Online
2 min ago
Ready
```

---

# 33. Monitoring Details

Opening a kiosk from Monitor should show:

### Identity

* Kiosk Name
* Kiosk ID
* Location

### State

* Status
* Availability
* Connection
* Last Active

### Configuration Summary

* Categories enabled
* Products enabled
* Combos enabled
* Payment methods enabled

Do not put editable configuration controls throughout the monitoring page.

Provide a clear **Configure** action instead.

---

# 34. Operational State

If the backend provides a current operational state, display it.

Possible examples:

* Ready
* In Use
* Unavailable
* Maintenance

Do not invent operational states if the backend already defines them.

---

# 35. Status vs Availability vs Connection

This distinction must remain consistent everywhere.

```text
Status
Active / Inactive

Availability
Available / Unavailable

Connection
Online / Offline
```

Example:

```text
Active
Available
Online
```

means:

> Kiosk is administratively active, available to customers, and connected.

---

# 36. Kiosk Readiness

Where supported, show a compact readiness state.

Example:

```text
Kiosk Readiness

Menu          Ready
Payments      Ready
Configuration Ready
Connection    Online

Overall       Ready
```

Do not invent a readiness calculation if the backend already provides it.

---

# 37. Kiosk Orders Relationship

Phase 5 will consume the kiosk configuration.

Every order must identify the kiosk.

Example:

```text
Kiosk
Counter 01
KSK-001

Order
ORD-10025
```

Kiosk ID should be the stable relationship.

Do not store only the kiosk name.

---

# 38. Kiosk Payment Relationship

Payments should also be traceable through:

```text
Kiosk
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

This allows Admin to understand which kiosk generated the transaction.

---

# 39. Historical Data Rule

If a kiosk is renamed:

```text
Counter 01
```

to:

```text
Entrance Kiosk
```

old transactions must remain linked to the same kiosk ID.

Example:

```text
Kiosk ID:
KSK-001
```

remains unchanged.

Historical orders should not break because the display name changed.

---

# 40. Kiosk Deactivation

If a kiosk is deactivated:

* It should not accept new customer sessions according to the approved business rule.
* Existing historical orders remain unchanged.
* Existing payment transactions remain unchanged.
* The kiosk record remains available for monitoring/history.

Do not delete the kiosk simply because it is inactive.

---

# 41. Product Deactivation Dependency

If a product is globally inactive:

```text
Product:
Chicken Biryani
Global: Inactive
Kiosk: ON
```

Effective state:

```text
Not Orderable
```

The kiosk cannot override the global state.

---

# 42. Combo Deactivation Dependency

If a combo is globally inactive:

```text
Combo:
Burger Meal
Global: Inactive
Kiosk: ON
```

Effective state:

```text
Not Orderable
```

The kiosk cannot override the global state.

---

# 43. Category Deactivation Dependency

If a category is unavailable globally:

* The kiosk must not make the category customer-selectable.
* Related product visibility must follow the approved product/category rules.

Do not create conflicting local states.

---

# 44. Configuration Save

When Admin saves:

1. Validate kiosk.
2. Validate categories.
3. Validate products.
4. Validate combos.
5. Validate payment methods.
6. Save configuration.
7. Return updated configuration.
8. Update Details/List state.

Do not show success before the backend confirms the save.

---

# 45. Save Error

If save fails:

* Keep the Admin's entered selections.
* Show a meaningful error.
* Allow retry.
* Do not reset the form.

Example:

```text
Unable to save kiosk configuration.
Please try again.
```

---

# 46. Unsaved Changes

When leaving a changed configuration:

```text
Unsaved Changes

Save & Go Back
Go Back Without Saving
Continue Editing
```

If nothing changed:

* Back directly.

---

# 47. Delete Rules

Do not allow unsafe kiosk deletion.

Before deleting a kiosk, check whether it is referenced by:

* Orders
* Payments
* Historical transactions

If referenced:

* Prefer deactivation/archival.
* Preserve historical relationships.

Do not destroy transaction history.

---

# 48. Search / Filter Summary

## Kiosk List

### Search

* Kiosk Name
* Kiosk ID
* Location

### Filters

* Status
* Availability
* Connection
* Location

## Monitoring

### Search

* Kiosk Name
* Kiosk ID

### Filters

* Status
* Availability
* Connection

Use the standard popup filter dialog.

---

# 49. Loading States

Use compact skeletons.

### Kiosk List

Compact table skeleton.

### Details

Compact grouped skeleton.

### Configuration

Compact rows and selectors.

### Monitoring

Compact status/data skeleton.

Do not use oversized loaders.

---

# 50. Empty States

### No Kiosks

```text
No kiosks configured yet.
[Add Kiosk]
```

### No Search Results

```text
No kiosks match your search.
[Clear Search]
```

### No Configuration

```text
No kiosk configuration has been set.
[Configure Kiosk]
```

---

# 51. Error States

### List

```text
Unable to load kiosks.
[Retry]
```

### Details

```text
Unable to load kiosk details.
[Retry] [Back]
```

### Configuration

```text
Unable to load kiosk configuration.
[Retry]
```

Keep all errors compact and actionable.

---

# 52. UI/UX Requirements

Phase 5 must follow the global UI standards from Phases 1–4.

### Compact UI

* Compact tables
* Compact forms
* Compact selectors
* Compact toggles
* Controlled section spacing
* Proper padding
* No excessive white space

### Consistency

Reuse:

* Sidebar
* Header
* Page title
* Search
* Filter dialog
* Table
* Status badge
* Toggle
* Button
* Confirmation dialog

---

# 53. Add/Edit Consistency

Add and Edit must use the same structure.

### Add

```text
Basic Information
   ↓
Save
   ↓
Configure
```

### Edit

```text
Existing Information
   ↓
Modify
   ↓
Save
```

Do not move fields to different locations between Add and Edit.

---

# 54. Recommended Kiosk Details Layout

```text
Kiosk Details

Counter 01                         Active
KSK-001                            Online

Location
Main Store

--------------------------------

Configuration

Categories              5
Products                42
Combos                   6
Payments                 2

--------------------------------

Availability

Available

--------------------------------

Last Active

2 minutes ago

--------------------------------

[Back] [Edit] [Configure] [Monitor]
```

Keep it compact.

---

# 55. Recommended Monitoring Layout

```text
Kiosk Monitoring

Counter 01
KSK-001

Status          Active
Availability    Available
Connection      Online
Last Active     2 min ago

Configuration
Menu            Ready
Payments        Ready

Overall         Ready

[Back] [Configure]
```

---

# 56. Phase 5 Acceptance Criteria

Phase 5 is complete only when:

## Kiosk Management

* Admin can list kiosks.
* Admin can search kiosks.
* Admin can filter kiosks.
* Admin can add kiosk.
* Kiosk ID is unique.
* Admin can edit kiosk.
* Admin can view kiosk details.
* Admin can activate/deactivate where supported.
* Multiple kiosks can exist independently.

## Menu Configuration

* Admin can configure category availability.
* Admin can configure product availability.
* Admin can configure combo availability.
* Existing master data is reused.
* Global availability rules are respected.
* No duplicate products/categories/combos are created.

## Payment

* Admin can see configured online payment methods.
* Admin can assign supported payment methods to a kiosk.
* No duplicate payment provider records are created.
* Only configured payment methods can be enabled.

## Monitoring

* Admin can see kiosk status.
* Admin can see availability.
* Admin can see connection.
* Admin can see last active/communication where available.
* Admin can view configuration summary.
* Kiosk monitoring and configuration remain separate.

## Synchronization

```text
Phase 1
Category + Product
        ↓
Phase 2
Customisation
        ↓
Phase 3
Combo
        ↓
Phase 4
Tax + Offers
        ↓
Phase 5
Kiosk
```

All relationships must remain synchronized.

## UI/UX

* Compact UI.
* Proper padding.
* Proper spacing.
* Clean table.
* Clean Add/Edit.
* Compact configuration.
* Popup filters.
* Search.
* Pagination.
* Loading state.
* Empty state.
* Error state.
* Unsaved-change warning.
* Back button.
* No unnecessary Cancel button.
* Responsive layout.
* No excessive white space.

---

# 57. Phase 5 Implementation Rules for AI

1. Read Phases 1–4 before implementing Phase 5.
2. Reuse Category Master.
3. Reuse Product Master.
4. Reuse Product Customisation from Phase 2.
5. Reuse Combo Master from Phase 3.
6. Reuse Tax and Offer configuration from Phase 4.
7. Do not duplicate any master data.
8. Kiosk should only control kiosk-specific availability/configuration.
9. Global product/category/combo availability must remain authoritative.
10. Do not create separate kiosk product prices.
11. Do not create separate kiosk tax rules.
12. Do not create separate kiosk offer records.
13. Payment assignment must reference existing configured online payment methods.
14. Keep Kiosk ID stable.
15. Preserve kiosk references in historical transactions.
16. Do not delete kiosks that are required for historical transactions.
17. Keep Monitoring and Configuration separate.
18. Use backend-provided status values where available.
19. Do not invent operational states.
20. Reuse global search/filter/table/dialog components.
21. Keep Add and Edit layouts consistent.
22. Ensure Details reflects saved configuration exactly.
23. Follow the compact UI guideline.
24. Fix spacing, alignment, validation, and responsive issues within Phase 5.
25. Do not break Phases 1–4.
26. Prepare the kiosk structure for Phase 6 Order and Online Payment Monitoring.
27. Do not implement Phase 6 functionality inside Phase 5.

---

# 58. Final Phase 5 Flow

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
Add Kiosk
        ↓
Configure Categories
        ↓
Configure Products
        ↓
Configure Combos
        ↓
Configure Online Payments
        ↓
Set Kiosk Availability
        ↓
Monitor Kiosk
        ↓
Ready for Phase 6
```

---

# 59. Complete Module 2 Flow

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
TAX + OFFERS
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

# 60. Phase 5 Final Goal

At the end of Phase 5, Admin should be able to answer:

* Which kiosks exist?
* What is each kiosk's unique ID?
* Where is each kiosk located?
* Is the kiosk active?
* Is it available for customers?
* Is it online?
* Which categories are available?
* Which products are available?
* Which combos are available?
* Which online payment methods are enabled?
* Is the kiosk configuration complete?
* Is the kiosk ready to receive customers?
* Which kiosk will be associated with future orders and payments?

The key relationship is:

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
```

**Phase 5 is therefore the bridge between the Admin configuration layer and the actual customer-facing Self-Order Kiosk.**
