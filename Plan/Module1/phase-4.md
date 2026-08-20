# Phase 04 — TV & Display Management

## Objective

Connect the configured playlists to the **physical TV displays** used across different branches.

This phase establishes the relationship between **Business → Branch → TV → Playlist**, allowing the Admin to centrally manage which content is assigned to which TV.

---

## 1. TV / Device Management

### Includes

* TV List
* Add TV
* View TV
* Edit TV
* Activate TV
* Deactivate TV
* TV Identification
* TV Status

### TV Information

* TV Name
* TV ID
* Branch
* Display Group
* Assigned Playlist
* Status
* Last Seen / Connection Status

---

## 2. TV Registration

Each physical TV should have a unique identity.

Example:

```text
TV-UDUPI-01
TV-MANGALORE-01
TV-MANIPAL-01
```

### TV Registration Flow

```text
Admin
  ↓
Add TV
  ↓
Enter TV Information
  ↓
Assign Branch
  ↓
Save
  ↓
TV Registered
```

---

## 3. TV Information

### Required Information

* TV Name
* TV ID
* Branch
* Status

### Optional Information

* Display Group
* Assigned Playlist
* Description

TV ID must uniquely identify the physical display.

---

## 4. Branch Assignment

Every TV must belong to a branch.

Example:

```text
Spice Junction
│
├── Udupi
│   ├── TV-UDUPI-01
│   └── TV-UDUPI-02
│
├── Mangalore
│   └── TV-MANGALORE-01
│
└── Manipal
    └── TV-MANIPAL-01
```

### Rules

* One TV belongs to one branch.
* A branch can have multiple TVs.
* TV cannot be assigned to a non-existing branch.
* Inactive branches should not receive new TV assignments.

---

## 5. TV Status

Each TV should support:

* Active
* Inactive

### Active

The TV is available for display configuration.

### Inactive

The TV remains registered but should not be used for active display operations.

---

## 6. Display Group Management

Allow Admin to group multiple TVs together.

### Includes

* Display Group List
* Add Group
* View Group
* Edit Group
* Delete Group
* Activate / Deactivate Group

### Example

```text
Entrance TVs

├── TV-UDUPI-01
├── TV-MANGALORE-01
└── TV-MANIPAL-01
```

---

## 7. Display Group Information

### Fields

* Group Name
* Description
* Branch / Scope
* Number of TVs
* Status

### Actions

* Add TV
* Remove TV
* Edit Group
* Activate / Deactivate
* Delete Group

---

## 8. TV Assignment

Admin should be able to assign a playlist to a TV.

### Example

```text
TV-UDUPI-01
      ↓
Main Entrance Playlist
```

Another TV can have a different playlist:

```text
TV-MANIPAL-01
      ↓
Manipal Promotion Playlist
```

---

## 9. Group Assignment

A playlist can also be assigned to a display group.

Example:

```text
Entrance TV Group
       ↓
Main Entrance Playlist
       ↓
All TVs in Group
```

This allows Admin to update multiple displays centrally.

---

## 10. Assignment Rules

### Individual TV

```text
TV
 ↓
Playlist
```

### Display Group

```text
Display Group
 ↓
Playlist
 ↓
Multiple TVs
```

### Rules

* TV must be active before assignment.
* Playlist must be active before assignment.
* Display group must be active before assignment.
* Assignment must reference an existing playlist.
* Assignment changes should apply to the TV during the next synchronization cycle.

---

## 11. Assignment Priority

If both individual TV and group assignment are supported, define a clear priority.

Recommended:

```text
Individual TV Assignment
        ↓
Highest Priority
        ↓
Group Assignment
        ↓
Fallback / Default Configuration
```

Example:

```text
Entrance Group
   ↓
Main Entrance Playlist

TV-UDUPI-01
   ↓
Special Udupi Playlist
```

Result:

```text
TV-UDUPI-01
→ Special Udupi Playlist

Other Entrance TVs
→ Main Entrance Playlist
```

---

## 12. TV List

Display all registered TVs.

### Fields

* TV Name
* TV ID
* Branch
* Display Group
* Assigned Playlist
* Status
* Connection / Last Seen
* Actions

### Actions

* View
* Edit
* Assign Playlist
* Activate / Deactivate

---

## 13. TV Details

Display:

### Basic Information

* TV Name
* TV ID
* Branch
* Status

### Assignment Information

* Assigned Playlist
* Display Group
* Assignment Type
* Assignment Status

### Device Information

* Connection Status
* Last Seen
* Registration Date
* Last Updated

---

## 14. TV Edit

Admin should be able to update:

* TV Name
* Branch
* Display Group
* Status
* Playlist Assignment

TV ID should remain the unique identity of the device.

---

## 15. Playlist Assignment Flow

```text id="0zq9q8"
TV List
  ↓
Select TV
  ↓
Assign Playlist
  ↓
Select Playlist
  ↓
Confirm
  ↓
Assignment Saved
```

---

## 16. Group Assignment Flow

```text id="ynm2ir"
Display Groups
  ↓
Select Group
  ↓
Assign Playlist
  ↓
Select Playlist
  ↓
Confirm
  ↓
Playlist Assigned
```

---

## 17. Reassignment

Admin should be able to change the playlist assigned to a TV.

Example:

```text id="o2n7f8"
Current:

TV-UDUPI-01
→ Main Entrance Playlist

Change To:

TV-UDUPI-01
→ Lunch Promotion Playlist
```

The previous assignment should be replaced by the new assignment.

---

## 18. Search

Admin should be able to search TVs.

### Search By

* TV Name
* TV ID
* Branch

### Display Groups

Groups should also support search by:

* Group Name

---

## 19. Filter

Filters should open through a Filter button.

### TV Filters

* Branch
* Status
* Display Group
* Assignment Status

### Assignment Status

* Assigned
* Unassigned

### Group Filters

* Status
* Branch / Scope

### Actions

* Apply
* Cancel
* Clear / Reset

---

## 20. Unassigned TVs

The system should identify TVs that do not have a playlist assignment.

Example:

```text
TV-MANIPAL-02

Status:
Active

Playlist:
Not Assigned
```

This allows Admin to identify incomplete configuration.

---

## 21. Connection Status

The system should provide basic device connection information.

### Status

* Online
* Offline
* Unknown

### Last Seen

Display the last known communication time of the TV.

Example:

```text
TV-UDUPI-01

Status: Online
Last Seen: Today, 10:42 AM
```

Detailed heartbeat and real-time monitoring behavior will be implemented in a later phase.

---

## 22. TV Registration Status

A TV can have:

* Registered
* Active
* Inactive
* Unassigned

These states help Admin understand the current configuration.

---

## 23. Display Group Management

### Add Group

Fields:

* Group Name
* Description
* Status

### Add TVs

Admin can select registered TVs to add to the group.

### Actions

* Save
* Cancel

---

## 24. Edit Display Group

Admin can update:

* Group Name
* Description
* Status
* Assigned TVs

### Actions

* Add TV
* Remove TV
* Save
* Cancel

---

## 25. Delete Display Group

Admin can delete a display group after confirmation.

Deleting a group should not delete the TVs belonging to that group.

Example:

```text
Delete Group
      ↓
TVs remain registered
      ↓
Only group relationship is removed
```

---

## 26. Basic Validation

### TV

* TV Name — Required
* TV ID — Required
* TV ID — Unique
* Branch — Required
* Status — Required

### Display Group

* Group Name — Required
* Group Name — Valid
* Status — Required

### Playlist Assignment

* TV must exist
* Playlist must exist
* TV must be active
* Playlist must be active

---

## 27. Business Rules

### Rule 01

Every TV must have a unique TV ID.

### Rule 02

Every TV belongs to one branch.

### Rule 03

A branch can contain multiple TVs.

### Rule 04

A TV can be assigned to a display group.

### Rule 05

A display group can contain multiple TVs.

### Rule 06

An active TV can be assigned an active playlist.

### Rule 07

An inactive TV should not participate in active display configuration.

### Rule 08

An inactive playlist should not be assigned as an active display configuration.

### Rule 09

A TV can have an individual playlist assignment.

### Rule 10

A group can have a playlist assignment.

### Rule 11

Individual TV assignment takes priority over group assignment.

### Rule 12

Changing an assignment should update the configuration used by the TV during synchronization.

### Rule 13

Deleting a display group must not delete the TVs inside that group.

### Rule 14

Deleting a playlist should remove or invalidate its TV assignments.

---

## 28. Basic UI States

The phase should support:

* Loading
* Empty
* Error
* Success
* Active
* Inactive
* Online
* Offline
* Unknown
* Assigned
* Unassigned
* No Search Results
* No Filter Results

---

## 29. Empty States

### No TVs

```text
No TVs have been registered yet.
```

Primary action:

**Add TV**

### No Groups

```text
No display groups have been created yet.
```

Primary action:

**Add Display Group**

### No Assignment

```text
No playlist has been assigned to this TV.
```

Primary action:

**Assign Playlist**

---

## 30. Phase 04 Business Flow

```text
Admin
  ↓
TV / Display Management
  ↓
Register TV
  ↓
Assign Branch
  ↓
Create / Select Display Group
  ↓
Assign Playlist
  ↓
TV Configuration Ready
```

---

## 31. Spice Junction Example

### Business

```text
Spice Junction
```

### Branches

```text
Udupi
Mangalore
Manipal
```

### TVs

```text
TV-UDUPI-01
TV-MANGALORE-01
TV-MANIPAL-01
```

### Display Group

```text
Entrance TVs
│
├── TV-UDUPI-01
├── TV-MANGALORE-01
└── TV-MANIPAL-01
```

### Playlist Assignment

```text
Entrance TVs
      ↓
Main Entrance Playlist
```

Now all three TVs are configured to use the same playlist.

---

## 32. Individual TV Example

Suppose Udupi needs a special promotion.

```text
Entrance TVs
      ↓
Main Entrance Playlist
```

But:

```text
TV-UDUPI-01
      ↓
Udupi Special Playlist
```

Because individual TV assignment has higher priority:

```text
TV-UDUPI-01
→ Udupi Special Playlist

TV-MANGALORE-01
→ Main Entrance Playlist

TV-MANIPAL-01
→ Main Entrance Playlist
```

---

## 33. Phase 04 Output

At the end of this phase:

* TVs can be registered
* Each TV has a unique identity
* TVs can be assigned to branches
* TVs can be activated/deactivated
* Display groups can be created
* TVs can be added to groups
* TVs can be removed from groups
* Playlists can be assigned to TVs
* Playlists can be assigned to display groups
* Individual TV assignments can override group assignments
* Unassigned TVs can be identified
* Basic connection status can be displayed
* TV configuration is ready for playback

---

## 34. Out of Scope

The following are NOT part of Phase 04:

* Full-screen TV Player
* Automatic Banner Playback
* Continuous Loop
* Image Playback
* Video Playback
* Display Duration Execution
* Transition Effects
* Offline Cache
* Offline Playback
* Network Recovery
* Automatic Application Restart
* TV Power Recovery
* Playback State Recovery
* Detailed Device Monitoring
* Playback Analytics

These will be handled in subsequent phases.

---

## 35. Phase 04 Completion

Phase 04 is complete when the Admin can configure the complete relationship:

```text
Business
   ↓
Branch
   ↓
TV
   ↓
Display Group
   ↓
Playlist
   ↓
Eligible Content
```

The system is then ready for:

**Phase 05 — Automated TV Playback**
