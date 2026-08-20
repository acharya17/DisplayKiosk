# Phase 01 — Business & Branch Setup

## Objective

Set up the basic business and branch structure required for the TV Banner / Digital Display module.

This phase creates the foundation that all upcoming phases will use.

---

## 1. Admin Access

### Includes

- Admin Login
- Admin Logout
- Basic Authentication
- Protected Admin Access

---

## 2. Business Setup

### Includes

- Business Name
- Business Logo
- Business Contact Number
- Business Email
- Business Address
- City
- State
- Country
- Time Zone
- Business Status

### Actions

- View Business
- Edit Business
- Save Changes
- Cancel Changes

---

## 3. Branch Management

### Branch List

Display all branches with:

- Branch Name
- Branch Code
- City
- Contact
- Status
- Actions

### Actions

- Add Branch
- View Branch
- Edit Branch
- Activate Branch
- Deactivate Branch

---

## 4. Add / Edit Branch

### Branch Information

- Branch Name
- Branch Code
- Address
- City
- State
- Country
- Contact Number
- Email
- Status

### Actions

- Save
- Cancel

---

## 5. Branch Status

Each branch should support:

- Active
- Inactive

### Rules

- Active branch = operational
- Inactive branch = not operational
- Deactivation requires confirmation
- Deactivated branches should remain in the system

---

## 6. Business & Branch Relationship

The system should maintain:

Business
│
├── Branch 01
├── Branch 02
└── Branch 03

### Rules

- One business can have multiple branches
- Every branch belongs to one business
- Branch Code must be unique
- Branch information must be linked to the business

---

## 7. Admin Navigation

Create the basic navigation required for the module.

### Business

- Business Settings
- Branches

### TV Display

- Overview
- Banners
- Playlists
- Schedules
- TVs / Devices
- Display Groups
- Settings

Only the features included in Phase 01 should be functional.

Future-phase sections can remain unavailable or marked as upcoming.

---

## 8. Basic UI States

The phase should support standard system states:

- Loading
- Empty
- Error
- Success
- Active
- Inactive

---

## 9. Basic Validation

### Business

- Business Name — Required
- Email — Valid format
- Contact Number — Valid format

### Branch

- Branch Name — Required
- Branch Code — Required
- Branch Code — Unique
- City — Required
- Contact Number — Valid format
- Email — Valid format

---

## 10. Phase 01 Business Flow

Admin
  ↓
Login
  ↓
Admin Panel
  ↓
Business Setup
  ↓
Branch Management
  ↓
Add / Edit / Manage Branch
  ↓
Business & Branch Structure Ready

---

## 11. Phase 01 Output

At the end of this phase:

- Admin can access the system
- Business information is configured
- Branches can be managed
- Business → Branch relationship is established
- Basic admin navigation is available
- Foundation is ready for banner management

---

## 12. Out of Scope

The following are NOT part of Phase 01:

- Banner Management
- Image Upload
- Video Upload
- Playlist Management
- Scheduling
- TV Registration
- TV Assignment
- TV Groups
- TV Playback
- Full-screen Display
- Offline Cache
- Network Recovery
- Playback Recovery
- Display Analytics

These will be handled in subsequent phases.

---

## 13. Phase 01 Completion

Phase 01 is complete when the business and branch foundation is fully functional and ready to support:

**Phase 02 — Banner Management**