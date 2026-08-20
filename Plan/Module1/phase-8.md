# Phase 08 — Monitoring, Analytics & Optimization

## Objective

Provide the business with visibility into the **health, usage, and performance** of the TV Display system after the core display functionality is complete.

This phase helps Admin understand whether TVs are working correctly, whether content is being delivered successfully, and where operational issues need attention.

---

## 1. TV Monitoring

### Includes

* TV List
* Online / Offline Status
* Last Seen
* Current Playlist
* Current Banner
* Sync Status
* Device Status

### Example

```text
TV-UDUPI-01
Online
Main Entrance Playlist
Last Seen: 10:42 AM
```

---

## 2. Display Health

Admin should be able to identify the current health of each TV.

### Status

* Online
* Offline
* Syncing
* Sync Failed
* Inactive
* Error

### Purpose

Quickly identify TVs that require attention.

---

## 3. Playback Monitoring

Track basic playback information.

### Includes

* Current Banner
* Current Playlist
* Playback Start
* Last Playback Update
* Playback Status
* Playback Error

Example:

```text
TV-UDUPI-01

Playlist:
Main Entrance

Current Banner:
Lunch Combo

Status:
Playing
```

---

## 4. Synchronization Monitoring

Admin should be able to see whether the TV has received the latest configuration.

### Sync States

* Synced
* Syncing
* Update Available
* Sync Failed
* Offline

### Example

```text
TV-UDUPI-01
Sync Status: Synced
Last Sync: 10:40 AM
```

---

## 5. Device Error Monitoring

Track important operational errors.

### Possible Errors

* Media Load Failure
* Configuration Failure
* Network Failure
* Synchronization Failure
* Playback Failure
* Device Offline

Admin should be able to identify the affected TV and the general issue.

---

## 6. Error History

Maintain a basic history of display-related errors.

### Information

* TV
* Branch
* Error Type
* Error Message
* Date / Time
* Status

### Example

```text
TV             Error              Time
------------------------------------------------
TV-UDUPI-01    Network Failure    10:15 AM
TV-MANIPAL-01  Media Failure      11:20 AM
```

---

## 7. Playback Summary

Provide a basic summary of display activity.

### Possible Metrics

* Total TVs
* Online TVs
* Offline TVs
* Active Playlists
* Active Banners
* Playback Errors
* Sync Failures

Example:

```text
Total TVs        12
Online           10
Offline           2
Active Playlists  6
Active Banners   24
Errors            3
```

---

## 8. Content Performance

Provide basic information about content usage.

### Includes

* Banner playback count
* Playlist usage
* Most frequently displayed banners
* Content with playback errors

This should remain operational/basic unless detailed analytics are specifically required.

---

## 9. Branch-Level Monitoring

Admin should be able to understand TV status by branch.

Example:

```text
Udupi
 ├── TV-UDUPI-01     Online
 └── TV-UDUPI-02     Offline

Mangalore
 └── TV-MANGALORE-01 Online

Manipal
 └── TV-MANIPAL-01   Online
```

---

## 10. Filters

Monitoring data should support filters.

### Filters

* Branch
* TV
* Status
* Playlist
* Error Type
* Date Range

Filters should open through the standard Filter dialog.

---

## 11. Search

Search should support:

* TV Name
* TV ID
* Branch
* Playlist

---

## 12. Date Range

For monitoring and error history, Admin should be able to select:

* Today
* Yesterday
* Last 7 Days
* Last 30 Days
* Custom Date Range

---

## 13. Monitoring Dashboard

A simple monitoring overview can display:

```text
------------------------------------------------
TV DISPLAY MONITORING
------------------------------------------------

Total TVs       Online       Offline       Errors

   12              10           2            3
------------------------------------------------

TV STATUS

Udupi
  TV-UDUPI-01       Online
  TV-UDUPI-02       Offline

Mangalore
  TV-MANGALORE-01   Online

Manipal
  TV-MANIPAL-01     Online
------------------------------------------------
```

---

## 14. Alerts / Attention States

The system should highlight conditions that require Admin attention.

Examples:

* TV Offline
* Sync Failed
* Playback Error
* Media Failure
* Configuration Error

The system should clearly indicate the affected TV.

---

## 15. Reports

Provide basic reports where required.

### Possible Reports

* TV Status Report
* Playback Report
* Error Report
* Synchronization Report
* Content Usage Report

Reports may support:

* View
* Filter
* Export

---

## 16. Export

Monitoring tables may support export.

Possible formats:

* CSV
* Excel

Export should respect the currently applied filters.

---

## 17. Audit Information

Track important display configuration changes.

### Examples

* Banner created
* Banner updated
* Playlist changed
* TV registered
* Playlist assigned
* TV deactivated
* Group updated

### Information

* User
* Action
* Entity
* Date / Time

---

## 18. Business Rules

### Rule 01

Every registered TV should have a measurable connection state.

### Rule 02

Offline TVs should be clearly identifiable.

### Rule 03

The system should record the last successful communication time.

### Rule 04

Important playback and synchronization failures should be recorded.

### Rule 05

Monitoring information should not interrupt normal TV playback.

### Rule 06

Monitoring should reflect the latest available device information.

### Rule 07

Historical error information should remain available according to the configured retention policy.

---

## 19. Basic UI States

The phase should support:

* Loading
* Empty
* Error
* Online
* Offline
* Syncing
* Synced
* Sync Failed
* Playing
* Playback Error
* No Data
* No Search Results
* No Filter Results

---

## 20. Phase 08 Business Flow

```text
Admin
  ↓
TV Monitoring
  ↓
View Overall Status
  ↓
Select Branch / TV
  ↓
View Device Health
  ↓
View Playback Status
  ↓
View Sync Status
  ↓
View Errors / History
  ↓
Take Required Action
```

---

## 21. Spice Junction Example

Admin opens monitoring:

```text
Total TVs: 6
Online: 5
Offline: 1
Playback Errors: 2
Sync Failures: 1
```

Admin sees:

```text
TV-MANIPAL-02
Status: Offline
Last Seen: 25 minutes ago
```

Admin can then investigate the device without manually checking every branch.

---

## 22. Phase 08 Output

At the end of this phase:

* Admin can monitor all TVs
* Online/offline status is visible
* Last Seen information is available
* Current playlist can be viewed
* Current playback state can be viewed
* Synchronization status can be monitored
* Display errors can be identified
* Error history can be viewed
* Branch-level monitoring is available
* Basic playback/content metrics are available
* Monitoring data can be filtered and searched
* Reports can be generated where required
* Operational issues can be identified quickly

---

## 23. Out of Scope

The following are NOT part of Phase 08:

* Customer behavior analytics
* Sales analytics
* Kiosk order analytics
* Customer tracking
* Advanced AI analytics
* Predictive analytics
* Automatic content optimization
* Marketing campaign optimization

These can be considered as future enhancements.

---

## 24. Phase 08 Completion

Phase 08 is complete when Admin can answer:

```text
Which TVs are working?
        ↓
Which TVs are offline?
        ↓
What is each TV displaying?
        ↓
Is the latest configuration synchronized?
        ↓
Are there playback errors?
        ↓
Which branch has an issue?
        ↓
What happened and when?
```

The TV Display module is then **fully operational, monitorable, and ready for ongoing business use**.
