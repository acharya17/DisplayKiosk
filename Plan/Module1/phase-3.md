# Phase 03 — Playlist & Scheduling

## Objective

Manage the **order and timing of banner content** that will be displayed on the TV.

This phase connects the banners created in Phase 02 into playlists and defines when each banner is eligible to be displayed.

---

## 1. Playlist Management

### Includes

* Playlist List
* Add Playlist
* View Playlist
* Edit Playlist
* Delete Playlist
* Activate Playlist
* Deactivate Playlist

### Playlist Information

* Playlist Name
* Description
* Status
* Number of Banners
* Created Date
* Updated Date

---

## 2. Create Playlist

### Playlist Information

* Playlist Name
* Description
* Status

### Playlist Content

Admin should be able to:

* Select banners
* Add banners to playlist
* Remove banners from playlist
* Arrange banners
* Save playlist

### Flow

```text
Create Playlist
  ↓
Enter Playlist Information
  ↓
Select Banners
  ↓
Arrange Banner Order
  ↓
Save Playlist
```

---

## 3. Playlist Banner Management

A playlist can contain multiple banners.

Example:

```text
Main Entrance Playlist

1. Weekday Lunch Combo
2. Diwali Special
3. Weekend Offer
```

### Actions

* Add Banner
* Remove Banner
* Reorder Banner
* View Banner

---

## 4. Display Order

Each banner inside a playlist must have a display order.

Example:

```text
Order 1 → Lunch Combo
Order 2 → Diwali Special
Order 3 → Weekend Offer
```

### Rules

* Lower order plays first
* Every banner must have a valid position
* Order can be changed by Admin
* Updated order must be saved
* Playback will later follow this order

---

## 5. Banner Scheduling

Admin should be able to define when a banner is eligible for display.

### Schedule Fields

* Start Date
* Start Time
* End Date
* End Time

Example:

```text
Diwali Special

Start:
01 Nov 2026 — 12:00 AM

End:
15 Nov 2026 — 11:59 PM
```

---

## 6. Schedule Types

The system should support:

### Scheduled Content

Content has:

* Start Date/Time
* End Date/Time

### Continuous Content

Content has:

* Start Date/Time
* No End Date

Example:

```text
Weekday Lunch Combo
Start: 01 Aug 2026
End: No End Date
```

---

## 7. Schedule Status

Each banner should have a schedule state.

### Upcoming

Start time has not been reached.

### Active / Running

Current date/time is within the configured schedule.

### Expired

End date/time has passed.

### No End Date

Content remains active until manually deactivated.

Example:

```text
Current Time
    ↓
Check Start Time
    ↓
Check End Time
    ↓
Determine Schedule Status
```

---

## 8. Eligibility Rules

A banner is eligible for display only when:

```text
Banner Status = Active
AND
Playlist Status = Active
AND
Current Date/Time >= Start Date/Time
AND
Current Date/Time <= End Date/Time
```

If an end date is not configured:

```text
Banner Status = Active
AND
Playlist Status = Active
AND
Current Date/Time >= Start Date/Time
```

---

## 9. Future Content

If the banner's start date/time has not arrived:

```text
Current Time
    ↓
Start Time Not Reached
    ↓
Upcoming
    ↓
Not Eligible For Display
```

The banner remains configured but will not be included in future playback until its schedule becomes valid.

---

## 10. Expired Content

If the end date/time has passed:

```text
Current Time
    ↓
End Time Passed
    ↓
Expired
    ↓
Not Eligible For Display
```

### Rule

Expired content should automatically stop being eligible.

Admin does not need to manually deactivate the banner.

---

## 11. Active / Inactive

### Playlist

* Active
* Inactive

### Banner

* Active
* Inactive

A banner should only be eligible when the required parent playlist and banner statuses allow it.

---

## 12. Eligible Content Calculation

The system should determine which banners are currently valid.

### Flow

```text
Active Playlist
      ↓
Get Playlist Banners
      ↓
Check Banner Status
      ↓
Check Start Date/Time
      ↓
Check End Date/Time
      ↓
Remove Invalid Content
      ↓
Sort By Display Order
      ↓
Eligible Content
```

---

## 13. Example — Eligible Content

Configured:

```text
1. Lunch Combo
   Active
   No End Date

2. Diwali Offer
   Active
   01 Nov → 15 Nov

3. New Branch Launch
   Inactive
```

On 05 Nov:

```text
Eligible:

1. Lunch Combo
2. Diwali Offer
```

On 16 Nov:

```text
Eligible:

1. Lunch Combo
```

The expired Diwali banner remains stored but is automatically excluded.

---

## 14. Default / Fallback Content

If there are no eligible banners in an active playlist, the system should identify the default content configured in Phase 02.

Example:

```text
Active Playlist
      ↓
No Eligible Banners
      ↓
Default Content
```

The actual TV fallback display will be implemented in the Playback phase.

---

## 15. Playlist List

Display all playlists.

### Fields

* Playlist Name
* Number of Banners
* Status
* Created Date
* Updated Date
* Actions

### Actions

* View
* Edit
* Activate / Deactivate
* Delete

---

## 16. Playlist Details

Display:

### Playlist Information

* Playlist Name
* Description
* Status
* Number of Banners

### Banner Information

* Preview
* Banner Name
* Media Type
* Display Duration
* Start Date
* End Date
* Schedule Status
* Display Order
* Status

### Actions

* Add Banner
* Remove Banner
* Reorder Banner
* Edit Schedule

---

## 17. Edit Playlist

Admin should be able to update:

* Playlist Name
* Description
* Status
* Playlist Banners
* Banner Order
* Banner Schedule

### Flow

```text
Playlist List
    ↓
Edit Playlist
    ↓
Update Information
    ↓
Update Banners
    ↓
Update Order
    ↓
Update Schedule
    ↓
Save
```

---

## 18. Delete Playlist

Admin can permanently delete a playlist.

### Flow

```text
Playlist List
    ↓
Delete
    ↓
Confirmation
    ↓
Confirm
    ↓
Playlist Deleted
```

### Rule

Deletion requires confirmation.

Deleting a playlist should not delete the banners contained within it.

---

## 19. Activate / Deactivate Playlist

### Activate

```text
Inactive
   ↓
Activate
   ↓
Active
```

### Deactivate

```text
Active
   ↓
Deactivate
   ↓
Inactive
```

An inactive playlist should not be considered for future TV playback.

---

## 20. Search

Admin should be able to search playlists.

### Search By

* Playlist Name

### Includes

* Search
* Clear Search
* No Search Results

---

## 21. Filter

Filters should be opened through a Filter button.

### Filter Fields

* Status
* Schedule Status

### Schedule Status

* Upcoming
* Running
* Expired
* No End Date

### Actions

* Apply
* Cancel
* Clear / Reset

---

## 22. Reordering

Admin should be able to change the order of banners inside a playlist.

### Before

```text
1. Lunch Combo
2. Diwali Offer
3. Dessert Offer
```

### After

```text
1. Diwali Offer
2. Lunch Combo
3. Dessert Offer
```

The new order must be saved.

---

## 23. Validation

### Playlist

* Playlist Name — Required
* Playlist Name — Valid
* At least one banner required before activation

### Schedule

* Start Date/Time — Required for scheduled content
* End Date/Time — Optional
* End Date/Time must be later than Start Date/Time
* Invalid date/time ranges must not be accepted

### Banner Order

* Valid order required
* No duplicate positions
* Order must be sequential or consistently maintained

---

## 24. Business Rules

### Rule 01

A playlist can contain multiple banners.

### Rule 02

A banner can belong to multiple playlists if required by the business.

### Rule 03

Banner order determines the future playback sequence.

### Rule 04

Inactive banners are not eligible for playback.

### Rule 05

Inactive playlists are not eligible for playback.

### Rule 06

Future banners are not eligible before their start time.

### Rule 07

Expired banners are automatically excluded.

### Rule 08

Expired banners do not need to be manually deactivated.

### Rule 09

A banner without an end date remains eligible until manually deactivated or otherwise made invalid.

### Rule 10

If no eligible content exists, the system should use the configured default content during playback.

### Rule 11

Deleting a playlist must not delete its banners.

---

## 25. Basic UI States

The phase should support:

* Loading
* Empty
* Error
* Success
* Active
* Inactive
* Upcoming
* Running
* Expired
* No End Date
* No Eligible Content
* No Search Results
* No Filter Results

---

## 26. Empty States

### No Playlists

```text
No playlists have been created yet.
```

Primary action:

**Add Playlist**

### Empty Playlist

```text
No banners have been added to this playlist.
```

Primary action:

**Add Banner**

### No Eligible Content

```text
No banners are currently eligible for display.
```

---

## 27. Phase 03 Business Flow

```text
Admin
  ↓
Playlist Management
  ↓
Create Playlist
  ↓
Select Banners
  ↓
Arrange Banner Order
  ↓
Configure Schedule
  ↓
Activate Playlist
  ↓
Eligible Content Generated
  ↓
Ready For TV Assignment
```

---

## 28. Spice Junction Example

### Main Entrance Playlist

```text
1. Weekday Lunch Combo
   Active
   No End Date

2. Diwali Special
   Active
   01 Nov → 15 Nov

3. New Branch Launch
   Inactive
```

### 05 November

```text
Lunch Combo
     ↓
Diwali Special
```

### 16 November

```text
Lunch Combo
```

The system automatically removes the expired Diwali Special from the eligible content.

---

## 29. Phase 03 Output

At the end of this phase:

* Admin can create playlists
* Admin can manage playlists
* Banners can be added to playlists
* Banners can be removed from playlists
* Banner order can be managed
* Start date/time can be configured
* End date/time can be configured
* Content can run indefinitely when required
* Upcoming content is identified
* Running content is identified
* Expired content is identified
* Inactive content is excluded
* Eligible content can be determined
* Default content can be identified when no valid content exists
* Playlists are ready for TV assignment

---

## 30. Out of Scope

The following are NOT part of Phase 03:

* TV Registration
* TV Device Management
* TV Pairing
* TV Groups
* Playlist-to-TV Assignment
* TV Playback
* Full-screen Display
* Automatic Loop Playback
* Media Caching
* Offline Playback
* Network Recovery
* TV Restart Recovery
* Playback Error Recovery
* TV Monitoring
* Display Analytics

These will be handled in subsequent phases.

---

## 31. Phase 03 Completion

Phase 03 is complete when the Admin can create and manage a complete display plan:

```text
Playlist
   ↓
Banners
   ↓
Display Order
   ↓
Schedule
   ↓
Active / Inactive
   ↓
Eligible Content
```

The system is then ready for:

**Phase 04 — TV & Display Management**
