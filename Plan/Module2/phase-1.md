# Module 2 — Self-Order Kiosk Admin
## Phase 1 — Category & Product Management

### 1. Phase Purpose

Phase 1 establishes the master data required by the Self-Order Kiosk.

The Admin must be able to create and manage:
- Product categories
- Products
- Product availability
- Product pricing
- Product media and descriptions

This phase is the foundation for the later phases. Tax, offers/discounts, kiosk configuration, ordering, and payment flows depend on the category and product data created here.

The client requirement states that Admin must configure categories/products, product availability, and prices, and that the kiosk uses this configuration for product browsing. Product browsing requires product name, image, description, price, and availability.

---

# 2. Phase Scope

## Included

### Category Management
- Category List
- Add Category
- Edit Category
- Category status/availability
- Category search
- Category actions

### Product Management
- Product List
- Add Product
- Edit Product
- Product Details
- Product availability
- Product pricing
- Product image
- Product description
- Category assignment
- Product search
- Product filtering
- Pagination
- Product status/actions

## Not Included in Phase 1

Do not implement these as part of Phase 1 unless they are required for the basic product structure:

- Tax configuration
- Discount/offer configuration
- Add-ons/modifiers management
- Product variants/customisation rules
- Kiosk management
- Payment configuration
- Order management
- Payment monitoring
- Hardware configuration
- Inactivity configuration

These belong to later phases.

---

# 3. Data Relationship

The core relationship for Phase 1 is:

Category
↓
Product

Every product must be associated with an existing category.

Example:

Category: Biryani
- Chicken Biryani
- Mutton Biryani
- Veg Biryani

Category: Beverages
- Cold Coffee
- Lemon Soda

Do not create duplicate category information inside every product.

The Category Master is the source of truth for product categorisation.

---

# 4. Page Structure

## 4.1 Category List

### Purpose

Provide Admin with a compact overview of all product categories and allow category management.

### Table Fields

- Category Name
- Product Count
- Status/Availability
- Actions

### Actions

- Add Category
- Edit
- Activate/Deactivate
- Delete, only if allowed by the existing project rules

### Search

Provide a compact search field.

Search should support category name.

After entering search text:
- Show clear action where applicable.
- Update results correctly.
- Preserve compact table layout.

### Empty State

If no categories exist:

Show a meaningful empty state with:
- Short message
- Add Category action

### Loading State

Show a compact loader/skeleton while category data is loading.

### Error State

If categories cannot be loaded:
- Show a clear error message.
- Provide Retry.

### Pagination

Use pagination when the number of categories exceeds the configured page size.

---

# 5. Add Category

## Purpose

Create a new category that can later be assigned to products.

### Fields

#### Category Name
- Required
- Must be meaningful and unique where required
- Example: Biryani, Beverages, Starters

#### Category Image
Include only if category imagery is required by the existing product/kiosk UI.

If implemented:
- Upload
- Preview
- Replace
- Remove

#### Status / Availability

For Add Category, follow the project's established creation-state rule.

If the project standard is to avoid asking for Active/Inactive during creation, do not expose the status field on the Add page. Apply the default creation state automatically.

### Actions

- Back
- Save Category

Do not add an unnecessary Cancel button.

### Unsaved Changes

If the Admin enters data and attempts to leave:

Show:

**Unsaved Changes**

- Save & Go Back
- Go Back Without Saving
- Continue Editing

If there are no changes, Back should navigate directly.

### Validation

- Category Name is required.
- Prevent invalid/blank category names.
- Prevent duplicate category names where uniqueness is required.
- Show inline validation.
- Do not allow Save until required fields are valid.

---

# 6. Edit Category

## Purpose

Update an existing category.

### Fields

- Category Name
- Category Image, if used
- Status/Availability

### Behavior

Existing data must be loaded into the form.

Admin can:
- Update category name
- Replace/remove image if applicable
- Change status where permitted
- Save changes

### Important

Editing a category must not create a new category record.

Existing products assigned to that category must continue referencing the same category.

---

# 7. Product List

## Purpose

Provide Admin with a complete but compact overview of products.

### Table Fields

- Product Name
- Category
- Image/Thumbnail
- Price
- Availability
- Status
- Actions

The client requirements explicitly identify product name, image, description, price, and availability as product information.

### Actions

- Add Product
- View
- Edit
- Activate/Deactivate
- Delete, only if permitted

### Search

Search by:
- Product Name

### Filters

Use the project's standard filter behavior.

Filters may include:
- Category
- Availability
- Status

Important:
The project-wide guideline states that filters should open in a popup/dialog rather than occupying permanent page space.

Filter dialog:
- Category
- Availability
- Status
- Apply
- Cancel

Do not show a large permanent filter panel.

### Pagination

Use compact pagination.

### Table Behavior

Maintain:
- Consistent row height
- Proper column alignment
- Compact spacing
- Clear action placement
- No unnecessary white space

### Empty State

If no products exist:
- Show meaningful empty state.
- Provide Add Product action.

If filters/search return no results:
- Clearly state that no matching products were found.
- Provide clear/reset action where appropriate.

---

# 8. Add Product

## Purpose

Create a product that customers can later browse and order through the kiosk.

### Required Product Fields

#### Product Name
- Required
- Internal/customer-facing product name depending on the existing product design

#### Category
- Required
- Select from existing Category Master
- Do not allow free-text category entry
- Only valid existing categories should be selectable

#### Product Image
- Upload image
- Preview after upload
- Replace
- Remove
- Preserve aspect ratio
- Do not stretch the image

#### Description
- Product description
- Keep concise and meaningful

#### Base Price
- Required
- Numeric currency value
- Must be valid
- No negative value

#### Availability
- Controls whether the product can be ordered.

The kiosk must not allow customers to order products marked unavailable.

### Creation Status

Do not unnecessarily ask for Active/Inactive during Add if the project-wide creation guideline says the initial state should be automatic.

Use the project's standard default creation state.

### Actions

- Back
- Save Product

No unnecessary Cancel button.

### Unsaved Changes

Use the common:
- Save & Go Back
- Go Back Without Saving
- Continue Editing

dialog when leaving with unsaved changes.

---

# 9. Product Validation

Before saving a product:

### Product Name
- Required
- Cannot be blank

### Category
- Required
- Must reference an existing category

### Price
- Required
- Must be numeric
- Must be valid/non-negative

### Image
- Validate supported format and upload result if image upload is implemented.

### Availability
- Must have a valid state.

### Data Integrity

Do not allow a product to reference:
- Deleted category
- Invalid category
- Missing category

---

# 10. Edit Product

## Purpose

Update an existing product without breaking its relationships.

### Existing Data Must Display

- Product Name
- Category
- Image
- Description
- Price
- Availability
- Existing configuration references where applicable

### Editable Fields

- Product Name
- Category
- Image
- Description
- Price
- Availability

### Important

If the category is changed:

Product
↓
New Category

The product should remain one product record with its category relationship updated.

Do not duplicate the product.

### Media

If an image already exists:
- Show the existing image
- Replace
- Remove
- Upload new image

The preview must remain in the same location as the upload area.

---

# 11. Product Details

## Purpose

Give Admin a complete view of the product.

### Basic Information

- Product Name
- Category
- Image
- Description
- Price
- Availability
- Status

### Relationship Information

Show relevant configured relationships when available:

- Customisation configuration
- Tax association
- Offer/discount association

However, Phase 1 does not configure tax, discounts, or customisation. These should only appear as references/status when those later phases exist.

Do not create fake or duplicate configuration in Phase 1.

### Actions

- Back
- Edit Product

---

# 12. Product Availability

Availability is different from deleting a product.

Example:

Chicken Biryani
- Product exists
- Price exists
- Category exists
- Availability = Unavailable

The kiosk must prevent the customer from ordering it.

When availability becomes active again, the kiosk can make it available without recreating the product.

This follows the client requirement that out-of-stock/unavailable products should not be orderable.

---

# 13. Product Status vs Availability

Do not create unnecessary duplicate controls.

Use clear terminology.

If the project needs both:
- Status
- Availability

then define their purposes clearly.

Recommended interpretation:

### Status
Whether the product record is enabled/disabled in the system.

### Availability
Whether the product can currently be ordered.

If the project does not need both concepts, use only the required one to avoid confusing Admin users.

Do not add duplicate switches just because both words appear in the requirements.

---

# 14. Global UI/UX Requirements

All Phase 1 pages must follow the project's existing global UI guideline.

## Compact UI

Every page must be compact.

- Reduce unnecessary white space.
- Use compact cards.
- Use compact tables.
- Use compact forms.
- Keep labels close to fields.
- Use consistent field heights.
- Keep section gaps controlled.
- Avoid oversized containers.
- Avoid unnecessary large empty areas.

## Layout

Use the global application layout:

- Fixed/compact sidebar
- Compact header
- Main content area
- Consistent page title/header
- Responsive content

Do not create a unique layout for Category or Product pages.

## Forms

Use consistent:
- Label
- Input
- Helper text
- Validation
- Spacing
- Button placement

## Tables

Use:
- Compact row height
- Proper alignment
- Consistent column widths
- Search
- Pagination
- Actions
- Empty state
- Loading state

## Filters

Filters must open in a popup/dialog.

Do not permanently occupy page space with large filter sections.

Filter dialog should contain:
- Required filter fields
- Apply
- Cancel

## Buttons

Follow a consistent hierarchy.

Primary:
- Save
- Add Product
- Add Category

Secondary:
- Back
- View
- Edit

Danger:
- Delete

Do not add unnecessary duplicate actions.

---

# 15. Navigation Flow

## Category Flow

Category List
↓
Add Category
↓
Save
↓
Category List

or

Category List
↓
Edit Category
↓
Save
↓
Category List

---

## Product Flow

Product List
↓
Add Product
↓
Select Category
↓
Enter Product Details
↓
Upload Image
↓
Set Price
↓
Set Availability
↓
Save Product
↓
Product List

---

## Product View/Edit Flow

Product List
↓
Product Details
↓
Edit Product
↓
Save
↓
Product Details/Product List

---

# 16. Data Synchronization Rules

This is critical.

## Category → Product

When adding a product:

Category must come from Category Master.

Example:

Category Master:
`Biryani`

Product:
`Chicken Biryani`

Relationship:

`Chicken Biryani.categoryId = Biryani.id`

Do not store only the category name as unrelated text if the application has a real data relationship.

---

## Category Update

If category name changes:

`Biryani → Rice & Biryani`

All products assigned to that category should automatically reflect the updated category name.

Do not manually update every product.

---

## Category Deletion

Before deleting a category:

Check whether products are assigned to it.

If products exist:

- Prevent unsafe deletion, or
- Require reassignment of those products first.

Do not leave products pointing to a missing category.

---

## Product Update

If product price changes:

The updated price becomes the latest product master price.

Later kiosk/order phases must consume the latest valid price.

The requirements explicitly state that kiosk prices should come from the latest configured pricing data and final pricing must be validated by the backend.

---

# 17. Phase 1 Dependency

Phase 1 creates the master data required by later phases.

### Phase 1 creates

```text
Category
   ↓
Product
   ├── Image
   ├── Description
   ├── Price
   └── Availability
```

### Phase 2 will extend

```text
Product
   ↓
Customisation
```

### Phase 3 will extend

```text
Product / Category
   ↓
Tax
   ↓
Offers / Discounts
```

### Phase 4 will consume

```text
Product + Category
   ↓
Kiosk
```

### Phase 5 will consume

```text
Product + Price + Tax + Discount + Kiosk
   ↓
Order + Online Payment
```

Therefore, Phase 1 must not create duplicate implementations of later-phase functionality.

---

# 18. Phase 1 Acceptance Criteria

Phase 1 is complete only when all of the following work correctly.

## Category

- Admin can create a category.
- Admin can edit a category.
- Admin can view categories.
- Admin can search categories.
- Admin can change category availability/status where required.
- Category validation works.
- Duplicate/invalid category handling works.
- Category data persists correctly.

## Product

- Admin can create a product.
- Admin can assign a valid category.
- Admin can upload product image.
- Admin can preview the image.
- Admin can replace/remove image.
- Admin can add description.
- Admin can set price.
- Admin can set availability.
- Admin can edit the product.
- Admin can view product details.
- Admin can search products.
- Admin can filter products.
- Pagination works.
- Product data persists correctly.

## Relationship

- Every product references a valid category.
- Category changes are reflected correctly.
- Unsafe category deletion is prevented.
- Product availability can be changed without deleting the product.
- No duplicate category/product data is created.

## UI/UX

- All pages follow the global compact UI.
- Padding and spacing are consistent.
- Tables are compact and aligned.
- Forms are compact and aligned.
- Filters use dialogs.
- Search and pagination are consistent.
- Loading states exist.
- Empty states exist.
- Error states exist.
- Validation is clear.
- Back navigation works.
- Unsaved-change warning works.
- No unnecessary Cancel buttons on inner Add pages.
- No excessive white space.
- Responsive behavior is correct.

---

# 19. Implementation Rules for AI

When implementing Phase 1:

1. Read and follow the existing global UI guidelines before changing any page.
2. Reuse existing components and styles wherever available.
3. Do not create duplicate components for the same UI pattern.
4. Do not invent unsupported business rules.
5. Do not implement future-phase functionality inside Phase 1.
6. Keep Category and Product data connected.
7. Keep Add and Edit pages visually consistent.
8. Ensure Edit pages load existing data.
9. Ensure list pages reflect saved data immediately.
10. Ensure all states and validations are implemented.
11. Keep every page compact and clean.
12. Fix existing spacing/alignment issues encountered within Phase 1.
13. Do not break existing modules while implementing Phase 1.
14. Keep the implementation ready for Phase 2 to extend the Product model with customisation.

---

# 20. Final Phase 1 Flow

```text
CATEGORY MANAGEMENT
        ↓
Create Category
        ↓
Category Master
        ↓
PRODUCT MANAGEMENT
        ↓
Create Product
        ↓
Select Existing Category
        ↓
Add Image
        ↓
Add Description
        ↓
Set Price
        ↓
Set Availability
        ↓
Save Product
        ↓
Product Master
        ↓
Product List / Details / Edit
        ↓
Ready for Phase 2
```

## Phase 1 Final Goal

At the end of Phase 1, the Admin should have a reliable **Category + Product Master** that becomes the single source of truth for the later Self-Order Kiosk configuration.

The phase should not only look complete visually; the underlying flow must also be logically connected so that later phases can safely extend the same product data with customisation, tax, discounts, kiosk availability, orders, and payments.
