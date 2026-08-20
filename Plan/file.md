# React Admin Panel

## Complete UI/UX Design System & Prototype Implementation Guide

---

# 1. Project Objective

Build a **modern, professional, compact React Admin Panel prototype**.

The application is a **UI/UX prototype only**.

The primary objective is to create a consistent and reusable admin interface where every page follows the same:

* Layout
* Typography
* Spacing
* Components
* Tables
* Forms
* Filters
* Dialogs
* Navigation
* Header
* Sidebar
* Interaction patterns
* Loading states
* Empty states
* Error states
* Responsive behavior

The AI must treat this document as the **global source of truth** for the entire project.

---

# 2. Most Important Rule

> **Every new page must look like it belongs to the same application.**

Do not redesign the UI from scratch for every page.

Before creating a new component, page, modal, table, filter, form, or interaction:

1. Check whether an existing component can be reused.
2. Follow the existing design tokens.
3. Follow the existing layout.
4. Follow the existing interaction pattern.
5. Only create a new component when the requirement genuinely needs one.

---

# 3. Project Scope

## 3.1 Included

The project should include:

* Admin layout
* Sidebar
* Header
* Navigation
* Dashboard UI
* Listing pages
* Detail pages
* Add pages
* Edit pages
* Forms
* Tables
* Search
* Filter dialogs
* Pagination
* Sorting UI
* Modals
* Drawers
* Dropdowns
* Tabs
* Cards
* KPI cards
* Status badges
* Toasts
* Loaders
* Skeletons
* Empty states
* Error states
* Confirmation dialogs
* Responsive UI
* Mock data
* Prototype interactions

---

# 4. Explicitly Excluded

This is a prototype.

Do NOT implement:

* Backend
* Database
* Real API integration
* Real authentication
* Real authorization logic
* Real payment processing
* Real file storage
* Real email
* Real SMS
* Real push notifications
* Production security
* Production deployment logic
* Complex business rules
* Real-time synchronization
* Actual data persistence

Use mock/static data wherever necessary.

---

# 5. Design Philosophy

The overall design should be:

* Compact
* Clean
* Professional
* Modern
* Minimal
* Information-dense
* Easy to scan
* Consistent
* Functional
* Responsive

Avoid:

* Excessive whitespace
* Oversized components
* Excessive cards
* Excessive rounded corners
* Large decorative sections
* Heavy gradients
* Excessive animations
* Unnecessary visual effects
* Random colors
* Random component styles

The interface should feel like a **professional enterprise/admin product**, not a marketing website.

---

# 6. Global Application Layout

Use one standard layout across the application.

```text
┌──────────────────────────────────────────────────────────────┐
│                         HEADER                               │
├───────────────┬──────────────────────────────────────────────┤
│               │                                              │
│               │ Breadcrumb                                   │
│   SIDEBAR     │ Page Header                                  │
│               │                                              │
│               │ Toolbar                                      │
│               │                                              │
│               │ Main Content                                 │
│               │                                              │
│               │                                              │
└───────────────┴──────────────────────────────────────────────┘
```

Structure:

```text
App
├── AdminLayout
│   ├── Sidebar
│   ├── Header
│   └── MainContent
│       ├── Breadcrumb
│       ├── PageHeader
│       ├── Toolbar
│       └── PageContent
```

---

# 7. Sidebar

The sidebar must be **compact and fixed**.

## Width

Expanded:

**220–240px**

Collapsed:

**64–72px**

## Behavior

* Fixed position
* Full viewport height
* Collapsible
* Active menu state
* Nested menus
* Tooltip for collapsed icons
* Compact spacing
* Independent scrolling only if required

## Structure

```text
Logo

Dashboard

Management
    Users
    Products
    Orders

Operations
    Transactions
    Payments
    Reports

Configuration
    Settings
```

## Navigation Item

```text
[Icon]  Menu Name
```

Collapsed:

```text
[Icon]
```

## Active State

Active item should use:

* Background highlight
* Primary/accent color
* Icon emphasis
* Optional left indicator

The active state must be clearly visible but not visually heavy.

---

# 8. Header

The header must be **compact and fixed**.

## Height

Recommended:

**56–64px**

## Structure

```text
[Menu Toggle]     Page/System Area

                         [Search]
                         [Notification]
                         [Help]
                         [Profile]
```

Possible elements:

* Sidebar toggle
* Global search
* Notification
* Help
* Theme switch
* User avatar
* User name
* Profile dropdown

Do not overcrowd the header.

---

# 9. Main Content

Main content should be:

* Scrollable
* Responsive
* Consistently padded
* Compact

Recommended content padding:

**16–24px**

Avoid excessive page margins.

---

# 10. Page Structure

Every page should follow the same structure.

```text
Breadcrumb

Page Title
Description                         Primary Action

Toolbar

Main Content
```

Example:

```text
Dashboard / Products

Products
Manage all products

                              + Add Product

[Search...] [Filter] [Export]

────────────────────────────────────────────

Data Table
```

---

# 11. Breadcrumb

Use breadcrumbs for hierarchical pages.

Example:

```text
Dashboard / Products
```

Detail:

```text
Dashboard / Products / Product Details
```

Keep breadcrumbs:

* Small
* Subtle
* Compact

Recommended:

**12px**

---

# 12. Page Header

Standard page header:

```text
Title
Description

                              Primary Action
```

Recommended:

* Title: 20–24px
* Description: 12–14px
* Action aligned right

Do not use large hero headers.

---

# 13. Toolbar

The toolbar should be compact.

Standard structure:

```text
[ Search... ]     [ Filter ] [ Export ] [ Other ] [ + Add ]
```

Important:

### Search stays outside the filter dialog.

### Filter opens a popup dialog.

### Export stays outside the filter dialog.

### Primary actions stay outside the filter dialog.

---

# 14. Search

Search should be available where useful.

Structure:

```text
[ 🔍 Search... ]
```

When text exists:

```text
[ 🔍 Search text...             × ]
```

Search should have:

* Icon
* Placeholder
* Clear action
* Focus state

Search must be compact.

---

# 15. Filter System

## IMPORTANT GLOBAL RULE

> **Filters must always be displayed inside a popup Filter Dialog.**

Never display multiple filter fields directly above the table by default.

The toolbar should contain only:

```text
[ Search... ] [ Filter ] [ Export ] [ + Add ]
```

Clicking Filter opens the dialog.

---

# 16. Filter Dialog

Standard structure:

```text
┌────────────────────────────────────┐
│ Filters                         ×  │
├────────────────────────────────────┤
│                                    │
│ Status                             │
│ [ Select Status                ▼ ] │
│                                    │
│ Category                           │
│ [ Select Category              ▼ ] │
│                                    │
│ Type                               │
│ [ Select Type                  ▼ ] │
│                                    │
│ Date Range                         │
│ [ From ]             [ To ]        │
│                                    │
├────────────────────────────────────┤
│                  Cancel    Apply    │
└────────────────────────────────────┘
```

## Dialog Rules

* Medium width
* Compact
* Centered
* Clear title
* Close icon
* Scrollable body if required
* Fixed footer
* Cancel button
* Apply button

Recommended width:

**480–600px**

---

# 17. Filter Fields

Filter dialog can contain:

* Status
* Category
* Type
* Date
* Date range
* User
* Location
* Amount range
* Multi-select
* Boolean options
* Page-specific filters

Only display filters relevant to the current page.

Do not add unnecessary filters.

---

# 18. Filter Actions

Footer must always contain:

```text
Cancel        Apply
```

## Cancel

* Close dialog
* Do not apply changes

## Apply

* Apply selected filters to mock data
* Close dialog
* Update visible filter indicator

Example:

```text
[ Filter • 3 ]
```

If no filters:

```text
[ Filter ]
```

---

# 19. Data Tables

Tables should be one of the primary components of the application.

Use a **compact reusable DataTable**.

Standard structure:

```text
┌──────────────────────────────────────────────────────────────┐
│ □ │ Name │ Category │ Status │ Date │ Amount │ Actions     │
├──────────────────────────────────────────────────────────────┤
│ □ │ ...  │ ...      │ Active │ ...  │ ...    │ ⋮           │
│ □ │ ...  │ ...      │ Active │ ...  │ ...    │ ⋮           │
└──────────────────────────────────────────────────────────────┘
```

---

# 20. Table Density

Use compact rows.

Recommended:

* Header: 40–44px
* Row: 44–52px

Typography:

**13–14px**

Do not create large table rows.

---

# 21. Table Features

Reusable table should visually support:

* Search
* Filter
* Sorting
* Select all
* Row selection
* Status
* Actions
* Pagination
* Empty state
* Loading state
* Skeleton state
* Horizontal scrolling

---

# 22. Table Actions

For multiple actions:

```text
⋮
────────────
View
Edit
Duplicate
Delete
```

For limited actions:

```text
[ View ] [ Edit ] [ Delete ]
```

Prefer compact icon actions where appropriate.

Use tooltips for icon-only actions.

---

# 23. Table Sorting

Column headers may support:

```text
Name ↑
Name ↓
Name ↕
```

Sorting is prototype interaction only.

No backend sorting required.

---

# 24. Pagination

Standard pagination:

```text
Showing 1–10 of 125

[10 / page ▼]

[‹] [1] [2] [3] ... [13] [›]
```

Pagination should be compact.

---

# 25. Status Badges

Use consistent status badges.

Examples:

```text
Active
Inactive
Pending
Approved
Rejected
Completed
Cancelled
Processing
```

Status badges should be compact.

Do not use huge pill components.

---

# 26. Forms

Forms should be compact and organized.

Standard field:

```text
Label *
[ Input                              ]

Helper text
```

Use 2-column layouts when appropriate.

```text
First Name                  Last Name
[................]          [................]

Email                       Phone
[................]          [................]

Category                    Status
[................]          [................]
```

Use one column for:

* Long text
* Description
* Address
* Large upload areas
* Complex sections

---

# 27. Standard Form Components

Support:

* Text input
* Number
* Email
* Password
* Select
* Multi-select
* Date
* Date range
* Time
* Checkbox
* Radio
* Switch
* Textarea
* File upload
* Image upload
* Tags
* Searchable select

Every field must support appropriate:

* Default
* Hover
* Focus
* Disabled
* Error
* Helper text

---

# 28. Form Actions

Standard:

```text
Cancel                     Save
```

For destructive actions:

```text
Cancel                  Delete
```

For multi-step forms:

```text
Back                  Next
```

Actions should remain consistent across pages.

---

# 29. Cards

Cards should be used only where they improve information grouping.

Good:

* KPI
* Summary
* Settings
* Dashboard widgets
* Detail information

Bad:

* Putting every section into a card
* Card inside card
* Excessive shadows

Keep cards compact.

---

# 30. KPI Cards

Example:

```text
┌─────────────────────────┐
│ Total Orders            │
│                         │
│ 2,450                   │
│ ↑ 8.4% from last month  │
└─────────────────────────┘
```

Keep KPI cards consistent in height.

---

# 31. Dashboard

Dashboard structure:

```text
Page Header

KPI Cards

Charts / Analytics

Recent Activity

Recent Transactions
```

Do not overcrowd the dashboard.

---

# 32. Modal Dialog

Use modals for short actions.

Examples:

* Add
* Edit
* Delete confirmation
* Quick view
* Confirmation

Standard:

```text
┌────────────────────────────────────┐
│ Add Product                    ×  │
├────────────────────────────────────┤
│                                    │
│ Form                               │
│                                    │
├────────────────────────────────────┤
│                 Cancel      Save   │
└────────────────────────────────────┘
```

---

# 33. Modal Sizes

Small:

**400–480px**

Medium:

**500–650px**

Large:

**700–900px**

Use large dialogs only when required.

---

# 34. Drawer

Use drawers for:

* Quick view
* Details
* Filters if specifically required
* Quick edit

However:

> **Standard page filters must use the Filter Dialog, not a drawer.**

---

# 35. Confirmation Dialog

For destructive actions:

```text
Delete Product?

Are you sure you want to delete this product?

Cancel                  Delete
```

The destructive button should be visually distinct.

---

# 36. Dropdown

Use compact dropdown menus.

```text
⋮
────────────
View
Edit
Duplicate
Delete
```

Do not create oversized dropdown menus.

---

# 37. Tabs

Use tabs only when sections belong to the same page/entity.

Example:

```text
Overview | Details | Transactions | Activity
```

Active tab should be clearly visible.

---

# 38. Loading System

Loading states are mandatory.

## Page Loader

Use a compact centered loader.

```text
       ⟳
    Loading...
```

Do not use huge loaders.

---

# 39. Table Loading

Use skeleton rows.

```text
████████     ███████     ██████
████████     ███████     ██████
████████     ███████     ██████
████████     ███████     ██████
```

Skeleton should resemble actual table content.

---

# 40. Button Loading

Example:

```text
[ ⟳ Saving... ]
```

Button should remain the same size while loading.

---

# 41. Skeleton Loading

Use skeletons for:

* Tables
* Dashboard cards
* Detail pages
* Lists
* Forms where appropriate

Skeleton should be subtle and compact.

---

# 42. Empty State

Every major list/table should have an empty state.

```text
          [Icon]

      No Products Found

No products match your current search or filters.

             + Add Product
```

Keep it simple.

---

# 43. Error State

Example:

```text
Unable to load data

Something went wrong.

          Try Again
```

Prototype only.

No actual error handling logic is required.

---

# 44. Toast

Use compact top-right toast notifications.

Success:

```text
✓ Product added successfully
```

Warning:

```text
⚠ Please check the information
```

Error:

```text
✕ Something went wrong
```

---

# 45. Tooltips

Tooltips are mandatory for unclear icon-only buttons.

Examples:

```text
[👁] → View
[✎] → Edit
[🗑] → Delete
[↓] → Download
```

Especially important for collapsed sidebar.

---

# 46. Buttons

Use consistent button hierarchy.

## Primary

For:

* Add
* Save
* Create
* Submit
* Apply

## Secondary

For:

* Cancel
* Back

## Outline

For:

* Filter
* Export
* Secondary actions

## Danger

For:

* Delete
* Remove
* Deactivate

Recommended height:

**32–38px**

---

# 47. Icons

Use one icon library consistently.

Recommended:

**Lucide React**

Typical sizes:

* Sidebar: 18–20px
* Header: 18–20px
* Table actions: 16–18px
* Buttons: 16–18px

Do not mix icon libraries unnecessarily.

---

# 48. Typography

Recommended font:

**Inter**

Scale:

```text
Page Title       20–24px
Section Title    16–18px
Card Title       14–16px
Body             14px
Table            13–14px
Label            12–13px
Helper Text      12px
Breadcrumb       12px
```

Use font weight to establish hierarchy.

---

# 49. Spacing

Use a consistent spacing system:

```text
4px
8px
12px
16px
20px
24px
32px
```

For compact admin interfaces, primarily use:

**8px / 12px / 16px**

Do not randomly use spacing values.

---

# 50. Border Radius

Recommended:

```text
Input       6px
Button      6px
Card        8px
Dropdown    8px
Modal       10px
```

Avoid excessive pill-shaped UI.

---

# 51. Shadows

Use subtle shadows only where required.

Good:

* Modal
* Dropdown
* Drawer
* Floating elements

Avoid heavy shadows on every card.

---

# 52. Color System

Define global design tokens.

```text
Primary
Secondary
Background
Surface
Border
Text Primary
Text Secondary
Success
Warning
Error
Info
```

Example:

```css
--color-primary
--color-secondary
--color-background
--color-surface
--color-border
--color-text-primary
--color-text-secondary
--color-success
--color-warning
--color-error
--color-info
```

Never create random page-specific colors.

---

# 53. Component States

Every reusable interactive component should consider:

```text
Default
Hover
Focus
Active
Selected
Disabled
Loading
Error
```

This applies to:

* Buttons
* Inputs
* Selects
* Tabs
* Sidebar items
* Table rows
* Checkboxes
* Switches
* Dropdowns

---

# 54. Responsive Design

## Desktop

Primary design target.

## Tablet

* Sidebar collapses
* Forms may switch to one column
* Tables can horizontally scroll
* Filters remain in dialog

## Mobile

* Sidebar becomes drawer
* Header becomes compact
* Tables become horizontally scrollable
* Forms become single-column
* Filter remains a modal/dialog
* Toolbar actions may wrap

Never destroy the desktop design just to make mobile responsive.

---

# 55. Scroll Behavior

Recommended:

```text
Sidebar → Fixed
Header → Fixed
Main Content → Scrollable
```

Long tables:

* Horizontal scroll
* Sticky table header when useful

Long dialogs:

* Scrollable body
* Fixed header/footer

---

# 56. Animation

Animations should be subtle.

Recommended:

**150–250ms**

Use:

* Sidebar transition
* Modal fade
* Drawer slide
* Dropdown transition
* Hover transition
* Skeleton animation

Avoid:

* Excessive bounce
* Long transitions
* Decorative animations
* Large page animations

---

# 57. Page Types

Every page should fall into one of these standard types.

## 57.1 Dashboard

```text
Header
KPI
Charts
Activity
```

## 57.2 Listing

```text
Header
Search
Filter
Actions
Table
Pagination
```

## 57.3 Detail

```text
Breadcrumb
Header
Summary
Information
Tabs/Sections
Actions
```

## 57.4 Add

```text
Breadcrumb
Header
Form
Actions
```

## 57.5 Edit

```text
Breadcrumb
Header
Form
Actions
```

## 57.6 Settings

```text
Settings Navigation
Settings Sections
Save
```

---

# 58. Standard CRUD Flow

For management pages:

```text
Listing
   │
   ├── Add
   │     └── Add Form
   │
   ├── View
   │     └── Detail
   │
   ├── Edit
   │     └── Edit Form
   │
   └── Delete
         └── Confirmation Dialog
```

Prototype interactions should visually support this flow.

---

# 59. Standard Listing Page

Every listing page should generally contain:

```text
Breadcrumb

Title
Description                         + Add

[Search...] [Filter] [Export]

Data Table

Pagination
```

Do not put filter fields directly into the toolbar.

---

# 60. Standard Detail Page

```text
Breadcrumb

← Back

Title                              Actions

Summary

Information Sections

Tabs if necessary

Activity
```

---

# 61. Standard Add/Edit Page

```text
Breadcrumb

Add/Edit [Entity]

Basic Information
────────────────────────

Field          Field

Field          Field

Additional Information
────────────────────────

Field          Field

Description

────────────────────────

Cancel                     Save
```

---

# 62. Standard Settings Page

```text
Settings

General
Notifications
Security
Preferences
System
```

Use grouped sections.

---

# 63. Mock Data

Use realistic data.

Avoid:

```text
Test
ABC
XYZ
Lorem ipsum
Item 1
Item 2
```

Prefer realistic:

```text
Product Name
Customer Name
Order ID
Transaction ID
Status
Created Date
Amount
Category
```

Mock data should make the prototype look realistic.

---

# 64. React Component Architecture

Recommended structure:

```text
src/
│
├── components/
│   ├── layout/
│   │   ├── AdminLayout
│   │   ├── Sidebar
│   │   └── Header
│   │
│   ├── ui/
│   │   ├── Button
│   │   ├── Input
│   │   ├── Select
│   │   ├── Modal
│   │   ├── Dialog
│   │   ├── Drawer
│   │   ├── Dropdown
│   │   ├── Badge
│   │   ├── Tooltip
│   │   ├── Loader
│   │   ├── Skeleton
│   │   └── Toast
│   │
│   ├── table/
│   │   ├── DataTable
│   │   ├── TableHeader
│   │   ├── TableRow
│   │   ├── TableActions
│   │   └── Pagination
│   │
│   ├── filters/
│   │   └── FilterDialog
│   │
│   └── forms/
│       ├── FormField
│       ├── FormSection
│       └── FileUpload
│
├── pages/
│   ├── Dashboard
│   ├── Users
│   ├── Products
│   ├── Orders
│   └── Settings
│
├── data/
├── routes/
├── assets/
├── hooks/
├── utils/
└── styles/
```

---

# 65. Critical Reusability Rule

There must be **one standard implementation** for common UI patterns.

For example:

Do not create:

```text
UserFilter
ProductFilter
OrderFilter
```

as three unrelated filter systems.

Create:

```text
FilterDialog
```

and configure it per page.

Similarly:

```text
DataTable
PageHeader
Modal
Button
Input
Select
Badge
Pagination
Loader
```

should be reusable.

---

# 66. Filter Component Architecture

The FilterDialog should be reusable.

Conceptually:

```text
FilterDialog
├── Header
├── Filter Fields
│   ├── Select
│   ├── MultiSelect
│   ├── DateRange
│   └── Other fields
└── Footer
    ├── Cancel
    └── Apply
```

Each page provides only the fields it requires.

---

# 67. Design Tokens

Centralize:

```text
Colors
Typography
Spacing
Radius
Shadows
Header Height
Sidebar Width
Input Height
Button Height
Table Row Height
```

Components should use tokens rather than hardcoded random values.

---

# 68. Accessibility

Even though this is a prototype:

* Use semantic HTML
* Use real buttons
* Use real inputs
* Use labels
* Provide accessible names
* Maintain visible focus
* Use readable contrast
* Do not communicate status only through color
* Provide tooltips for icon-only actions

---

# 69. Prototype Interaction Rules

The prototype should demonstrate the UI behavior.

Implement visually:

### Sidebar

* Expand
* Collapse
* Active state

### Search

* Type
* Clear
* Filter mock records

### Filter

* Open dialog
* Select fields
* Cancel
* Apply
* Show active filter count

### Table

* Sort
* Select
* Pagination
* Action menu

### Add

* Open form/modal
* Fill mock form
* Save
* Show toast
* Add mock record visually

### Edit

* Open edit
* Update mock record
* Show toast

### Delete

* Confirmation dialog
* Delete mock record
* Show toast

### Tabs

* Switch tabs

### Dropdown

* Open
* Select

### Loading

* Display loader/skeleton where appropriate

---

# 70. No Business Logic

Prototype interactions should be lightweight.

Example:

If the user clicks Delete:

```text
Open confirmation
        ↓
Click Delete
        ↓
Remove mock row
        ↓
Show success toast
```

No backend request is needed.

---

# 71. No API Logic

Do not create:

```text
axios
fetch
API services
backend endpoints
database calls
```

unless explicitly requested later.

Use:

```text
mockData.js
```

or equivalent local data.

---

# 72. No Authentication Logic

If login is required for the prototype:

Create only:

```text
Login Screen
Username field
Password field
Remember me
Login button
Forgot password UI
```

The login button can navigate to the dashboard.

No actual authentication system.

---

# 73. Standard File/Component Naming

Use consistent naming.

Components:

```text
PascalCase
```

Examples:

```text
AdminLayout.jsx
Sidebar.jsx
Header.jsx
DataTable.jsx
FilterDialog.jsx
PageHeader.jsx
```

Variables:

```text
camelCase
```

---

# 74. Code Quality

The implementation should:

* Use reusable React components
* Avoid unnecessary duplication
* Keep components manageable
* Keep styles centralized
* Avoid unnecessary dependencies
* Maintain consistent naming
* Keep mock data separate
* Keep UI components separate from pages

---

# 75. New Page Implementation Process

Whenever a new page is requested, AI must follow this process.

## Step 1

Identify the page type:

```text
Dashboard
Listing
Detail
Add
Edit
Settings
Report
```

## Step 2

Identify required sections.

## Step 3

Check reusable components.

## Step 4

Reuse:

```text
AdminLayout
Sidebar
Header
PageHeader
Toolbar
DataTable
FilterDialog
Modal
Drawer
Forms
Pagination
```

## Step 5

Apply design tokens.

## Step 6

Add realistic mock data.

## Step 7

Add prototype interactions.

## Step 8

Add states:

```text
Loading
Empty
Error
Success
Disabled
```

## Step 9

Check responsive behavior.

## Step 10

Compare visually with existing pages.

---

# 76. AI Must Ask Before Breaking the System

If a new requirement appears to conflict with the existing design system, do not silently redesign the application.

First determine whether the requirement can be implemented using existing patterns.

Only introduce a new pattern when necessary.

---

# 77. Golden Rules for Every Page

Every page must follow these rules:

1. Use the same sidebar.
2. Use the same header.
3. Use the same page layout.
4. Use the same typography.
5. Use the same spacing.
6. Use the same buttons.
7. Use the same inputs.
8. Use the same tables.
9. Use the same status badges.
10. Use the same modal/dialog style.
11. Use the same Filter Dialog.
12. Keep filters inside popup dialog.
13. Keep search outside the dialog.
14. Keep export outside the dialog.
15. Keep primary actions outside the dialog.
16. Use compact UI.
17. Use realistic mock data.
18. Include appropriate states.
19. Reuse components.
20. Do not introduce backend logic.

---

# 78. Final Visual Standard

The final application should feel like:

```text
┌─────────────────────────────────────────────────────┐
│ Compact Header                                      │
├──────────────┬──────────────────────────────────────┤
│ Compact      │ Breadcrumb                           │
│ Sidebar      │                                      │
│              │ Page Title               + Action    │
│              │                                      │
│              │ [Search] [Filter] [Export]           │
│              │                                      │
│              │ ┌────────────────────────────────┐   │
│              │ │ Compact Data Table              │   │
│              │ │                                │   │
│              │ │                                │   │
│              │ └────────────────────────────────┘   │
│              │                                      │
│              │ Pagination                           │
└──────────────┴──────────────────────────────────────┘
```

The design should be:

**Compact + Clean + Consistent + Professional + Responsive**

---

# 79. Final AI Instruction

Use the following rule as the highest-level instruction when implementing this project:

> **Build this React Admin Panel as a consistent UI/UX prototype, not as separate individually designed pages. Always reuse the established layout, components, design tokens, spacing, typography, sidebar, header, tables, forms, dialogs, and interaction patterns. The UI must remain compact, professional, responsive, and information-dense. All filters must open in a reusable popup Filter Dialog containing the applicable filter fields with Cancel and Apply buttons. Search, Export, and primary actions remain outside the Filter Dialog. Implement only prototype interactions and mock data. Do not implement backend, API, database, authentication, payment, or business logic unless explicitly requested. Before creating anything new, check whether an existing component can be reused. Every new page must visually belong to the same application.**
