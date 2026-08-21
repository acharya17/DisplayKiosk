Module 2 — Self-Order Kiosk Admin

Phase 2 — Product Customisation Management

1. Phase Purpose

Phase 2 extends the Product Master created in Phase 1 by allowing Admin to configure how customers can customise products in the Self-Order Kiosk.

The phase covers:

Add-ons

Variants

Sizes

Modifiers

Mandatory/optional choices

Product-specific customisation

Customisation pricing

Quantity selection

Special instructions where applicable

The client requirements state that products may support add-ons, variants, size selection, customisation, optional/mandatory modifiers, quantity selection, and special instructions. The final product price must update immediately when the customer changes applicable options.

2. Phase Dependency

Phase 2 depends directly on Phase 1.

Phase 1:
Category
↓
Product
↓
Base Price

Phase 2:
Product
↓
Customisation
↓
Option Price
↓
Final Product Price

Do not recreate Product or Category management in Phase 2.

Use the existing Product and Category Master created in Phase 1.

3. Phase Scope

Included

Customisation Management

Add-on / Modifier List

Add Add-on / Modifier

Edit Add-on / Modifier

Product Customisation Configuration

Product-specific options

Variants

Sizes

Mandatory/optional modifiers

Option pricing

Quantity configuration

Special instructions configuration where required

Not Included in Phase 2

Do not implement:

Tax configuration

Discount/offer configuration

Kiosk management

Payment configuration

Order management

Payment monitoring

Hardware configuration

Inactivity settings

These belong to later phases.

4. Core Data Relationship

The main relationship is:

Product
↓
Customisation Group
↓
Customisation Option
↓
Option Price

Example:

Product:
Chicken Biryani — ₹220

Customisation Group:
Size

Options:

Half — ₹150

Full — ₹220

Customisation Group:
Add-ons

Options:

Extra Raita — +₹20

Boiled Egg — +₹15

Customisation Group:
Spice Level

Options:

Mild

Medium

Spicy

The product remains the source product record. Customisation options are associated with the product instead of creating duplicate products.

5. Page Structure

5.1 Add-ons / Modifiers List

Purpose

Provide Admin with a reusable list of customisation options that can be assigned to products.

Table Fields

Name

Type

Price

Required / Optional

Status

Actions

Type

Use meaningful types such as:

Add-on

Modifier

Variant

Size

Only display types that are supported by the implemented business configuration.

Actions

Add

Edit

Activate/Deactivate

Delete, only where safe and permitted

Search

Search by:

Name

Filters

Use the global filter dialog pattern.

Possible filters:

Type

Required / Optional

Status

Filter actions:

Apply

Cancel

Do not use a permanent large filter panel.

Pagination

Use compact pagination where required.

Empty State

Show:

Meaningful message

Add action

Loading State

Use compact loader/skeleton.

Error State

Show:

Clear error

Retry

6. Add Add-on / Modifier

Purpose

Create a reusable customisation option that can later be assigned to one or more products.

Fields

Name

Required

Meaningful name

Example:

Extra Raita

Boiled Egg

Mild

Medium

Spicy

Type

Add-on

Modifier

Variant

Size

Price

Required where the option changes the price

Numeric

Non-negative

For options with no additional cost, allow zero price.

Required / Optional

Define whether the option is mandatory or optional when used in a product customisation group.

If the business rule requires this setting at the group level rather than the option level, keep the source of truth at the group level. Do not duplicate controls.

Status

Use the existing project status pattern.

Actions

Back

Save

Do not add unnecessary Cancel.

Unsaved Changes

Use the standard:

Unsaved Changes

Save & Go Back

Go Back Without Saving

Continue Editing

7. Edit Add-on / Modifier

Purpose

Modify an existing customisation option.

Fields

Name

Type

Price

Required/Optional configuration where applicable

Status

Behavior

Existing values must be loaded.

Admin can:

Update name

Update type where safe

Update price

Update configuration

Change status

Save

Do not create a duplicate option during editing.

Relationship Integrity

If an option is already used by products, changes must not silently break existing product configurations.

If a change could affect existing configurations, provide a meaningful warning or restrict the unsafe action according to project rules.

8. Product Customisation Configuration

Purpose

This is the main Phase 2 page/section where Admin connects customisation options to a specific product.

Example:

Product:
Chicken Biryani

Base Price:
₹220

Customisation Groups

Group 1 — Size

Options:

Half — ₹150

Full — ₹220

Selection:

Single selection

Group 2 — Spice Level

Options:

Mild

Medium

Spicy

Selection:

Single selection

Required

Group 3 — Add-ons

Options:

Extra Raita — +₹20

Boiled Egg — +₹15

Selection:

Multiple selection

Optional

The exact selection behavior should only be implemented where required by the business rules.

9. Product Customisation Fields

When configuring a product, show:

Product

Product Name

Category

Base Price

These should be read from the Phase 1 Product Master.

Do not allow duplicate editing of:

Product Name

Category

Base Price

unless the global Product Edit flow is being used.

Customisation Group

Fields may include:

Group Name

Group Type

Required / Optional

Selection Type

Options

Selection Type

Where applicable:

Single selection

Multiple selection

Options

Each option should show:

Option Name

Price

Status

Selection state

10. Variant Configuration

Variants allow different product choices.

Example:

Product:
Cold Coffee

Variant:
Size

Options:

Small — ₹80

Medium — ₹100

Large — ₹120

Fields

Variant Name

Options

Option Price

Required/Optional

Selection Type

Do not create separate products for every variant unless explicitly required.

Use:

Product
↓
Variant
↓
Option

11. Size Configuration

Sizes follow the same connected structure.

Example:

Product:
Chicken Biryani

Size:

Half — ₹150

Full — ₹220

Fields

Size Name

Price

Status

Selection Requirement

The product's base price and size pricing must have a clear business rule.

Do not create confusing duplicate price fields without defining what each price represents.

12. Add-on Configuration

Example:

Product:
Chicken Biryani

Add-ons:

Extra Raita — ₹20

Boiled Egg — ₹15

Extra Gravy — ₹10

Fields

Add-on

Price

Required/Optional

Status

Selection Type where applicable

Admin should be able to:

Add option

Remove option

Change order/sequence where required

Edit option configuration

13. Modifier Configuration

Modifiers may be used for choices that affect the product without necessarily changing price.

Example:

Spice Level:

Mild

Medium

Spicy

Fields

Modifier Name

Options

Price, if applicable

Required/Optional

Selection Type

Status

The configuration must remain meaningful and not duplicate Add-on functionality unnecessarily.

14. Quantity Configuration

The requirements explicitly include quantity selection.

Admin should define whether the product supports quantity selection.

Where applicable:

Quantity allowed

Minimum quantity

Maximum quantity

Do not add minimum/maximum fields unless the business requires them.

At minimum, the kiosk must allow the customer to change quantity where quantity selection is enabled.

15. Special Instructions

The requirements mention special instructions.

If enabled for the product:

Show Special Instructions option on the kiosk.

Allow customer text input.

Apply reasonable input validation/length limits.

Store the instruction with the order item.

Admin should only configure whether this functionality is available where the business requires it.

Do not make it a mandatory field unless explicitly configured.

16. Customisation Pricing

The final product price must reflect selected options.

Example:

Base Product:
Chicken Biryani = ₹220

Customer selects:

Full = ₹220

Extra Raita = +₹20

Boiled Egg = +₹15

Final Item Price:
₹255

The price should update immediately when the customer changes options.

This behavior is explicitly required by the client requirements.

17. Price Calculation Relationship

The basic relationship should be:

Final Item Price

Example:

Product
₹220
   +
Extra Raita
₹20
   +
Boiled Egg
₹15
   =
₹255

Do not apply tax or discount calculation in Phase 2.

Tax and discount are Phase 3 responsibilities.

18. Product Details Extension

The Product Details page from Phase 1 should be extended to show the configured customisation.

Product Information

Product Name

Category

Image

Description

Base Price

Availability

Customisation

Customisation Groups

Options

Prices

Required/Optional

Selection Type

This provides Admin with one meaningful view of the product configuration.

19. Product Edit Extension

The Product Edit flow should provide access to:

Basic product information from Phase 1

Customisation configuration from Phase 2

Do not duplicate the Product Master.

Recommended structure:

Product Edit
↓
Basic Information
↓
Customisation
↓
Save

Keep both sections compact.

20. Validation

Customisation Name

Required

Cannot be blank

Type

Required

Price

Numeric

Non-negative

Product Association

Must reference an existing product

Option Association

Must reference valid option data

Required Group

If a group is marked required:

The kiosk must require the customer to make the necessary selection before adding the product to cart.

Selection Type

For single selection:

Customer selects only one option.

For multiple selection:

Customer can select multiple allowed options.

Do not allow conflicting configuration such as a group that is configured as single-select but expects multiple selections.

21. Deletion & Dependency Rules

Before deleting a customisation option:

Check whether it is assigned to products.

If it is being used:

Prevent unsafe deletion, or

Require removal from products first.

Do not leave broken product configurations.

If a customisation is deactivated:

It should not be available for new customer selections.

Existing product data should remain intact unless business rules require otherwise.

22. Data Synchronization

This phase must extend Phase 1 without duplicating its data.

Correct relationship

Category
   ↓
Product
   ↓
Customisation Group
   ↓
Customisation Option
   ↓
Option Price

Example:

Biryani
   ↓
Chicken Biryani
   ↓
Size
   ├── Half ₹150
   └── Full ₹220

Chicken Biryani
   ↓
Add-ons
   ├── Extra Raita +₹20
   └── Boiled Egg +₹15

23. Phase 1 → Phase 2 Synchronization

Phase 2 must consume Phase 1 data.

Product Selection

Product Customisation must select from existing Product Master records.

Do not manually type product names.

Category

Category is inherited from the Product Master.

Do not create a second category selector inside customisation configuration unless it is purely a filter.

Product Price

Base Price comes from Product Master.

Customisation pricing is additional configuration.

Availability

If a product is unavailable, its customisation does not become an independent orderable item.

24. Kiosk Synchronization

The future kiosk should consume:

Product
   ↓
Base Price
   ↓
Customisation
   ↓
Options
   ↓
Option Prices

The kiosk should display only valid and available configuration.

Example:

Admin configures:

Chicken Biryani
↓
Size: Half / Full
↓
Add-on: Extra Raita

Kiosk shows exactly that configuration.

Do not create separate kiosk-side product/customisation records.

25. UI/UX Requirements

Follow the same global UI guidelines established in Phase 1.

Compact UI

Compact forms

Compact tables

Compact cards

Controlled spacing

No excessive white space

Consistent padding

Consistent field heights

Proper alignment

Layout

Use the global:

Sidebar

Header

Content area

Page header

Action placement

Do not create a different design language for Phase 2.

Add/Edit

Add and Edit pages must use the same structure.

Edit must display existing configuration.

Media

If product media is shown:

Keep it in the same upload/preview location.

Preserve aspect ratio.

Avoid oversized preview containers.

Filters

Use popup/dialog filters.

Do not create permanent large filter sections.

26. Navigation

Add Option

Modifier List
↓
Add Modifier
↓
Save
↓
Modifier List

Product Configuration

Product List
↓
Product Details/Edit
↓
Customisation
↓
Add Group/Option
↓
Save
↓
Product Details

Back

All inner pages must have a Back button.

If there are unsaved changes:

Unsaved Changes

Save & Go Back

Go Back Without Saving

Continue Editing

Do not add unnecessary Cancel buttons.

27. Empty States

No Customisations

Show:

“No customisations configured for this product.”

Action:

Add Customisation

No Add-ons

Show:

“No add-ons configured.”

Action:

Add Add-on

No Modifiers

Show:

“No modifiers configured.”

Action:

Add Modifier

No Products

Use the Phase 1 Product empty state and direct Admin to Product Management.

28. Loading & Error States

Every relevant page must support:

Loading

Compact skeleton/loader

Error

Clear message

Retry

Save Error

Keep entered data

Show meaningful error

Allow retry

Save Success

Show compact success feedback

Return to relevant page or update the current configuration

29. Phase 2 Acceptance Criteria

Phase 2 is complete only when:

Customisation Management

Admin can create add-ons/modifiers.

Admin can edit them.

Admin can activate/deactivate where applicable.

Admin can search/filter.

Admin can safely remove unused options.

Product Configuration

Admin can select an existing product.

Admin can configure customisation groups.

Admin can add options.

Admin can define option prices.

Admin can configure required/optional behavior.

Admin can configure single/multiple selection where required.

Admin can configure variants.

Admin can configure sizes.

Admin can configure add-ons.

Admin can configure modifiers.

Quantity behavior is supported.

Special instructions can be configured where required.

Pricing

Base product price comes from Phase 1.

Customisation prices are applied correctly.

Final item price updates based on selections.

Tax/discount are not incorrectly calculated in Phase 2.

Synchronization

Product data comes from Phase 1.

Category data remains connected.

Product edits do not create duplicate customisation products.

Product availability remains authoritative.

Kiosk will later consume the same customisation configuration.

UI/UX

Compact UI everywhere.

Consistent spacing/padding.

Clean Add/Edit flow.

Existing configuration is visible in Edit.

No unnecessary Cancel buttons.

Back works.

Unsaved-change warning works.

Search/filter/pagination work where required.

Loading/empty/error states exist.

No broken relationships.

30. Phase 2 Implementation Rules for AI

Read Phase 1 before implementing Phase 2.

Reuse Phase 1 Product and Category data.

Do not recreate Category or Product Master functionality.

Extend the existing Product model with customisation relationships.

Reuse existing global components and styles.

Follow the compact UI standard.

Keep Add and Edit structures consistent.

Existing configuration must be loaded on Edit.

Do not invent tax or discount behavior in this phase.

Do not implement kiosk management in this phase.

Do not implement payment/order functionality in this phase.

Do not create duplicate product records for variants/sizes.

Keep customisation options connected to products.

Prevent broken relationships when deleting/deactivating options.

Make the data structure ready for Phase 3 tax and offer configuration.

Fix spacing/alignment issues found within the implemented Phase 2 screens without changing unrelated modules.

31. Final Phase 2 Flow

PHASE 1 PRODUCT MASTER
        ↓
Select Existing Product
        ↓
Product Customisation
        ↓
Create Customisation Group
        ↓
Add Options
        ↓
Set Option Prices
        ↓
Set Required / Optional
        ↓
Set Selection Type
        ↓
Save Configuration
        ↓
Product Details Shows Configuration
        ↓
Kiosk Can Consume Same Configuration
        ↓
Ready for Phase 3

32. Phase 2 Final Goal

At the end of Phase 2, every product that supports customisation should have a clear, reusable and synchronized configuration.

The Admin should be able to understand:

Which product → has which customisation → which options → what price → whether selection is required → how the kiosk should present it.

Phase 2 must leave the Product Master ready for Phase 3, where tax and offers/discounts will be connected to the same products and categories.