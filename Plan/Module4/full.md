# Module 4 — Customer Self-Order Kiosk

## Phase 1 — Kiosk Entry & Menu

### 1. Phase Purpose

Phase 1 is the **starting point of the customer ordering journey**.

The kiosk already has an existing login/authentication flow, so this phase must **reuse the existing login and session**. No new login page should be created.

After login, the kiosk loads its assigned configuration and displays the available menu.

### Core Flow

```text
Existing Login
      ↓
Authenticated Kiosk Session
      ↓
Load Kiosk Configuration
      ↓
Load Available Categories
      ↓
Load Available Products
      ↓
Welcome / Menu
      ↓
Customer Selects Category
      ↓
Product List
      ↓
Product Selection
      ↓
Phase 2 — Product Customisation
```

---

# 2. Phase Scope

### Included

* Existing login integration
* Existing authentication/session reuse
* Kiosk identification
* Kiosk configuration loading
* Available category loading
* Available product loading
* Welcome / Start Order
* Category selection
* Product listing
* Product availability
* Product search
* Product details entry point
* Loading states
* Empty states
* Error states

### Not Included

Do not implement in Phase 1:

* New login
* Registration
* Product customisation
* Variants / Sizes selection
* Add-ons / Modifiers selection
* Combo selection
* Cart
* Tax calculation
* Discount calculation
* Payment
* Order confirmation

These belong to later phases.

---

# 3. Existing Login Integration

The existing login should remain the **single authentication source**.

```text
Existing Login
      ↓
Successful Authentication
      ↓
Existing Session
      ↓
Kiosk Application
```

Do not create:

* Another login page
* Another username/password system
* Duplicate authentication
* Separate customer registration

After successful login, continue directly to the kiosk flow.

---

# 4. Kiosk Session

After authentication, identify the kiosk that is being used.

The kiosk session should determine:

* Kiosk ID
* Kiosk configuration
* Available categories
* Available products
* Available combos where applicable
* Enabled payment configuration for later phases

For Phase 1, only the information required to display the menu needs to be loaded.

---

# 5. Kiosk Configuration Loading

After login:

```text
Authentication
      ↓
Kiosk Session
      ↓
Load Kiosk Configuration
      ↓
Load Categories
      ↓
Load Products
      ↓
Display Menu
```

If the configuration is successfully loaded, continue automatically.

If it fails, show a meaningful error and retry option.

---

# 6. Welcome / Start Order

The customer should first see a simple welcome experience.

Example:

```text
┌─────────────────────────────────────┐
│                                     │
│          SPICE JUNCTION              │
│                                     │
│          Welcome!                    │
│                                     │
│      Start your order               │
│                                     │
│        [ Start Order ]              │
│                                     │
└─────────────────────────────────────┘
```

Keep this screen:

* Clean
* Touch-friendly
* Large
* Simple
* Brand-focused

Do not overload it with menu information.

---

# 7. Start Order

When the customer selects:

**Start Order**

the kiosk opens the menu.

```text
Welcome
   ↓
Start Order
   ↓
Categories + Products
```

If the business requirement allows direct menu access, the Welcome screen can transition automatically after the configured behavior.

---

# 8. Category List

Display only categories configured and enabled for the current kiosk.

Example:

```text
Categories

[All] [Burgers] [Meals] [Drinks] [Desserts]
```

### Category Rules

* Use categories from Admin.
* Respect kiosk-specific category availability.
* Do not show inactive/unavailable categories.
* Keep category names short and meaningful.
* Maintain the configured order.

---

# 9. All Category

The **All** option can be used to show all available products.

```text
[All]
```

It should display only products available for the current kiosk.

If the project requirement does not require an All option, do not add it unnecessarily.

---

# 10. Product List

When a category is selected:

```text
Category
   ↓
Products
```

Example:

```text
Burgers

┌──────────────┐
│ Image        │
│ Chicken      │
│ Burger       │
│ ₹180         │
│ [Add]        │
└──────────────┘

┌──────────────┐
│ Image        │
│ Veg Burger   │
│ ₹150         │
│ [Add]        │
└──────────────┘
```

---

# 11. Product Card

Each product card should contain only meaningful information.

### Required

* Product Image
* Product Name
* Price
* Availability
* Action

Example:

```text
Chicken Burger
₹180

[Add]
```

### Optional

* Short description
* Bestseller label
* Offer indicator

Only include these if they are part of the approved requirement.

---

# 12. Product Availability

The kiosk must respect the product availability configured in Admin.

### Available

```text
Chicken Burger
₹180
[Add]
```

### Unavailable

```text
Chicken Burger
Currently unavailable
```

Do not allow customers to add unavailable products.

Prefer hiding unavailable products if that is the defined business behavior; otherwise show them clearly as unavailable.

Use one consistent rule throughout the kiosk.

---

# 13. Product Search

If search is required, provide a simple touch-friendly search.

```text
[ Search products... ]
```

Search should work with meaningful product information such as:

* Product name
* Supported searchable keywords where configured

### Clear Search

After entering text:

```text
Chicken Burger        [×]
```

The clear action should reset the product list.

---

# 14. Category + Search Relationship

Search should respect the current category where applicable.

Example:

```text
Category: Burgers
Search: Chicken
```

Results should show relevant products within that category.

When category changes:

```text
Burgers
   ↓
Meals
```

the product list should update accordingly.

---

# 15. Product Details Entry

If the customer selects a product:

```text
Product Card
      ↓
Product Details
      ↓
Phase 2
```

Phase 1 only needs to establish this navigation.

Phase 2 will handle:

* Variants
* Sizes
* Add-ons
* Modifiers
* Quantity
* Add to Cart

---

# 16. Direct Add vs Product Details

Not every product necessarily requires customisation.

### Product without customisation

```text
Product
   ↓
Add
   ↓
Cart
```

This can be handled in a later phase.

### Product with customisation

```text
Product
   ↓
Product Details
   ↓
Customisation
```

The kiosk should determine this from the configured product data.

Do not show an unnecessary customisation page for products that have no options.

---

# 17. Menu Navigation

Recommended structure:

```text
Menu
 ├── Category
 │     └── Product List
 │             └── Product Details
 │
 └── Cart
```

Cart functionality belongs to Phase 4, but the UI should be designed so that it can be introduced without restructuring the menu.

---

# 18. Back Navigation

The customer should be able to move backward without losing the current browsing state.

Example:

```text
Product Details
      ↓ Back
Product List
      ↓ Back
Category / Menu
```

Back navigation must not unexpectedly:

* Logout the customer
* Reset the kiosk
* Clear existing cart data
* Reload the entire application

---

# 19. Loading States

When loading menu data:

```text
Loading Menu...
```

Use compact skeletons or a simple loading state.

Do not show:

* API details
* Technical errors
* JSON
* Database information
* Kiosk configuration details

---

# 20. Empty Category

If a category contains no available products:

```text
No products available
```

Provide a simple option to return to categories.

Example:

```text
No products available in this category.

[View Other Categories]
```

---

# 21. No Menu Data

If the kiosk has no available products:

```text
Menu currently unavailable.

Please try again.
```

Provide:

```text
[Retry]
```

Do not show an empty broken screen.

---

# 22. Error State

If menu loading fails:

```text
Unable to load menu.

Please try again.

[Retry]
```

The existing authenticated session should remain intact.

Do not send the customer back to login for a normal menu-loading failure.

---

# 23. Kiosk-Specific Data

The menu must be based on the current kiosk configuration.

Example:

```text
Admin
 ↓
Kiosk 01
 ↓
Enabled Categories
 ↓
Enabled Products
 ↓
Customer Kiosk
```

If Product A is disabled for Kiosk 01:

```text
Kiosk 01
Product A → Not Available
```

It must not appear as an orderable product on that kiosk.

---

# 24. Product Data Dependency

Phase 1 uses the Product Master configured in Module 2.

```text
Category
   ↓
Product
   ↓
Kiosk Availability
   ↓
Customer Kiosk
```

Do not create a separate product database or duplicate product information in the kiosk frontend.

---

# 25. Price Display

Display the currently configured selling price.

Example:

```text
Chicken Burger
₹180
```

If the product has variants with different prices, the customer should proceed to the appropriate selection screen rather than showing an incorrect fixed price.

Example:

```text
Burger

Starting from ₹150
```

Only use this pattern if the backend/product configuration supports it.

---

# 26. Offers / Discounts

Phase 1 should **not calculate discounts**.

If an offer indicator is required on the menu, it can display a simple indication such as:

```text
10% OFF
```

But actual discount calculation happens later using the approved pricing logic.

```text
Product
   ↓
Phase 5
Tax + Discount
```

Do not hardcode discount calculations into Phase 1.

---

# 27. Tax

Do not calculate or display final tax in Phase 1.

Tax belongs to the final order calculation phase.

```text
Product
   ↓
Cart
   ↓
Order Summary
   ↓
Tax
```

---

# 28. Touch-Friendly UI

Since this is a kiosk:

* Large touch targets
* Clear buttons
* Large readable product names
* Clear prices
* Simple navigation
* Minimal typing
* Easy category switching
* No tiny icons for important actions

Avoid designing it like a desktop admin panel.

---

# 29. Compact UI

The kiosk should be visually clean without excessive empty space.

Use:

* Compact product cards
* Consistent card dimensions
* Clear category chips
* Consistent spacing
* Proper image ratios
* Fixed menu structure

Do not overcrowd the screen with unnecessary metadata.

---

# 30. Recommended Menu Layout

```text
┌─────────────────────────────────────────────┐
│ SPICE JUNCTION                    Cart (0) │
├─────────────────────────────────────────────┤
│                                             │
│ [All] [Burgers] [Meals] [Drinks] [Desserts]│
│                                             │
│ [ Search products... ]                      │
│                                             │
│ ┌────────────┐ ┌────────────┐ ┌──────────┐ │
│ │   Image    │ │   Image    │ │  Image   │ │
│ │ Chicken    │ │ Veg Burger │ │  Fries   │ │
│ │ Burger     │ │ ₹150       │ │ ₹100     │ │
│ │ ₹180       │ │ [Add]      │ │ [Add]    │ │
│ │ [Add]      │ │            │ │          │ │
│ └────────────┘ └────────────┘ └──────────┘ │
│                                             │
└─────────────────────────────────────────────┘
```

The exact layout should follow the project's established kiosk design guideline.

---

# 31. Phase 1 Flow — Final

```text
┌───────────────────┐
│  Existing Login   │
└─────────┬─────────┘
          ↓
┌───────────────────┐
│ Authenticated     │
│ Kiosk Session      │
└─────────┬─────────┘
          ↓
┌───────────────────┐
│ Load Kiosk Config │
└─────────┬─────────┘
          ↓
┌───────────────────┐
│ Welcome / Start   │
│ Order             │
└─────────┬─────────┘
          ↓
┌───────────────────┐
│ Categories        │
└─────────┬─────────┘
          ↓
┌───────────────────┐
│ Product List      │
└─────────┬─────────┘
          ↓
┌───────────────────┐
│ Select Product    │
└─────────┬─────────┘
          ↓
     Has Options?
       /       \
     Yes       No
      ↓         ↓
 Product       Add
 Details       Flow
      ↓
   PHASE 2
```

---

# 32. Phase 1 Acceptance Criteria

Phase 1 is complete when:

### Authentication

* Existing login is reused.
* No new login page is created.
* Existing session is preserved.
* Kiosk is correctly identified after login.

### Menu

* Kiosk configuration loads successfully.
* Categories load correctly.
* Only available categories are shown.
* Products load correctly.
* Only kiosk-available products are shown.
* Product order follows configured order.
* Product price is displayed correctly.
* Product images display correctly.

### Navigation

* Welcome → Menu works.
* Category → Products works.
* Product → Details works.
* Back navigation works.
* Customer does not lose browsing state unnecessarily.

### Search

* Product search works if enabled.
* Clear search works.
* Category and search work together correctly.

### Error Handling

* Loading state works.
* Empty category state works.
* No-menu state works.
* Retry works.
* Menu failure does not force logout.

### UI/UX

* Touch-friendly.
* Clean.
* Compact.
* Proper spacing.
* Clear product cards.
* Clear category navigation.
* No unnecessary information.
* No Admin functionality exposed.

---

# 33. Phase 1 Implementation Rules

1. **Reuse the existing Login/Auth.**
2. Do not create a new authentication flow.
3. Load the current kiosk configuration after authentication.
4. Use the existing Category and Product data from Module 2.
5. Respect kiosk-specific availability.
6. Do not duplicate Product or Category masters.
7. Do not calculate tax in this phase.
8. Do not calculate discounts in this phase.
9. Do not implement payment.
10. Do not implement order creation.
11. Do not implement the cart yet.
12. Do not implement customisation logic yet.
13. Product Details should be ready to connect to Phase 2.
14. Hide unavailable products according to the approved kiosk availability rule.
15. Keep navigation touch-friendly.
16. Keep the UI clean and compact.
17. Use meaningful customer-facing names.
18. Do not expose Admin or technical information.
19. Handle loading, empty and error states properly.
20. Do not break the existing login/session implementation.

## Phase 1 Goal

**Existing Login → Identify Kiosk → Load Kiosk Menu → Browse Categories → Browse Products → Select Product → Continue to Phase 2 Customisation.**
