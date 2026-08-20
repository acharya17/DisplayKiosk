# Phase 06 — Reliability & Recovery

## Objective

Make the TV Banner / Digital Display system **reliable, self-healing, and capable of continuous operation** even when there are network interruptions, application restarts, page refreshes, or TV/power restarts.

This phase ensures the display does not require regular human intervention.

---

## 1. Offline Playback

The TV should continue displaying content when the internet connection is temporarily unavailable.

### Includes

* Media caching
* Playlist caching
* Configuration caching
* Cached playback
* Offline detection
* Online detection
* Automatic reconnection

### Flow

```text
TV Playing
   ↓
Internet Disconnects
   ↓
Use Cached Content
   ↓
Continue Playback
   ↓
Internet Returns
   ↓
Synchronize Latest Content
```

---

## 2. Content Caching

The TV should locally cache the content required for playback.

### Cache Should Include

* Assigned playlist
* Banner information
* Media files
* Display duration
* Display order
* Relevant configuration
* Last known valid state

### Rules

* Previously downloaded valid content should remain available offline.
* Cache should be updated when new content is available.
* Invalid or incomplete downloads should not replace valid cached content.
* Cache should not cause playback interruption during updates.

---

## 3. Network Failure Handling

The player should detect temporary network interruptions.

### Online

```text id="t3r1d2"
Online
  ↓
Normal Playback
```

### Offline

```text id="6t1l1j"
Offline
  ↓
Use Cached Content
  ↓
Continue Playback
```

The TV should not display a blank screen simply because the internet is unavailable.

---

## 4. Automatic Reconnection

When the network becomes available again:

```text id="t4y5gk"
Internet Restored
      ↓
Reconnect
      ↓
Check Configuration
      ↓
Check Content Updates
      ↓
Download Required Media
      ↓
Update Cache
      ↓
Continue Playback
```

The Admin should not need to restart the TV.

---

## 5. Content Synchronization

The TV should synchronize its configuration with the latest server state.

### Synchronize

* Playlist changes
* Banner changes
* Banner status
* Schedule changes
* TV assignment changes
* Group assignment changes
* Media updates

### Example

Admin changes:

```text id="u1w2e3"
TV-UDUPI-01
Old Playlist
     ↓
New Playlist
```

TV should detect the change and update its local configuration.

---

## 6. Cache Update Strategy

New content should be downloaded without unnecessarily interrupting current playback.

### Recommended Flow

```text id="x7v8b9"
Current Playback
      ↓
New Configuration Detected
      ↓
Download / Validate New Content
      ↓
Cache Updated
      ↓
Switch Playback Queue
```

The TV should continue showing valid existing content while new content is being prepared.

---

## 7. Page Refresh Recovery

If the TV page is refreshed:

```text id="r4t5y6"
Page Refresh
    ↓
Application Loads
    ↓
Identify TV
    ↓
Load Cached Configuration
    ↓
Load Cached Content
    ↓
Resume Playback
```

The TV should automatically return to the display experience.

---

## 8. Application Restart Recovery

If the application restarts:

```text id="z1x2c3"
Application Restart
      ↓
Initialize Player
      ↓
Identify TV
      ↓
Load Local State
      ↓
Load Cached Content
      ↓
Start Playback
```

No manual interaction should be required.

---

## 9. TV / Browser Restart Recovery

If the TV or browser restarts:

```text id="a1b2c3"
TV Restart
    ↓
Browser / Player Starts
    ↓
Identify Registered TV
    ↓
Load Configuration
    ↓
Load Cached Content
    ↓
Start Playback
```

The system should automatically recover.

---

## 10. Power Failure Recovery

The TV should recover after a temporary power interruption.

### Example

```text id="d4e5f6"
Power OFF
    ↓
Power ON
    ↓
TV Starts
    ↓
Player Starts
    ↓
TV Identified
    ↓
Cached Configuration Loaded
    ↓
Playback Starts
```

No employee should need to configure the TV again.

---

## 11. Playback State

Maintain enough state to support recovery.

### State Information

* TV ID
* Playlist ID
* Current banner
* Current playback position where practical
* Last successful banner
* Current playback queue
* Last synchronization time
* Last successful configuration

The system does not necessarily need to restore the exact second of a video, but it should resume the correct playback flow without becoming blank or stuck.

---

## 12. Playback Error Recovery

If playback encounters an error:

```text id="g7h8i9"
Playback Error
      ↓
Identify Failed Content
      ↓
Skip Failed Content
      ↓
Load Next Valid Content
      ↓
Continue Playback
```

The player should not remain permanently stuck on one failed banner.

---

## 13. Media Failure Recovery

If a cached media file becomes unavailable or corrupted:

```text id="j1k2l3"
Media Failed
    ↓
Mark Content Invalid
    ↓
Skip Content
    ↓
Try Next Content
```

If no valid promotional content remains:

```text id="m4n5o6"
No Valid Content
      ↓
Default Content
```

---

## 14. Empty Playlist Recovery

If an assigned playlist contains no valid content:

```text id="p7q8r9"
Playlist
   ↓
No Eligible Content
   ↓
Default Content
```

The display should never remain blank because of an empty playlist.

---

## 15. Configuration Failure

If the TV cannot retrieve the latest configuration:

```text id="s1t2u3"
Configuration Request Failed
       ↓
Use Last Known Valid Configuration
       ↓
Use Cached Content
       ↓
Continue Playback
```

When connectivity is restored, the latest configuration should be synchronized.

---

## 16. Last Known Good Configuration

The TV should maintain the last successfully synchronized configuration.

This allows the player to continue operating when the latest configuration cannot be retrieved.

### Example

```text id="v4w5x6"
Last Known Configuration
        ↓
Main Entrance Playlist
        ↓
Cached Banners
        ↓
Continue Playback
```

---

## 17. Automatic Retry

Temporary failures should be retried automatically.

Examples:

* Configuration request
* Media download
* Synchronization
* Network connection

Retry behavior should use controlled intervals to avoid excessive requests.

---

## 18. Error Handling

The system should handle:

* Network failure
* API failure
* Media download failure
* Corrupted media
* Missing media
* Configuration failure
* Playlist failure
* Application failure
* Browser restart
* TV restart
* Power interruption

The customer should not see technical error messages.

---

## 19. TV Connection Status

The system should maintain basic device status.

### Status

* Online
* Offline
* Unknown

### Last Seen

Track the last successful communication from the TV.

Example:

```text id="y7z8a9"
TV-UDUPI-01

Status: Online
Last Seen: 10:42 AM
```

---

## 20. Admin Monitoring

Admin should be able to identify display health.

### TV List

Display:

* TV Name
* TV ID
* Branch
* Playlist
* Status
* Connection Status
* Last Seen

This provides basic operational visibility.

---

## 21. Synchronization Status

The system may show:

* Synced
* Syncing
* Update Available
* Offline
* Sync Failed

Example:

```text id="b1c2d3"
TV-UDUPI-01

Status:
Online

Sync:
Synced
```

---

## 22. Recovery Priority

When the TV starts or recovers, use the following priority:

```text id="e4f5g6"
1. Identify TV
        ↓
2. Load Latest Configuration
        ↓
3. If unavailable → Last Known Configuration
        ↓
4. Load Cached Content
        ↓
5. Find Valid Content
        ↓
6. Play Content
        ↓
7. If no valid content → Default Content
```

---

## 23. Offline Content Rules

### Rule 01

Cached valid content should continue playing during temporary network loss.

### Rule 02

Network failure must not automatically stop playback.

### Rule 03

The latest valid cache should be preserved until a newer valid version is available.

### Rule 04

Incomplete media downloads must not replace valid cached media.

### Rule 05

The TV should synchronize automatically when connectivity returns.

---

## 24. Recovery Rules

### Rule 06

Page refresh should automatically restore playback.

### Rule 07

Application restart should automatically restore playback.

### Rule 08

Browser restart should automatically restore playback.

### Rule 09

TV restart should automatically restore playback.

### Rule 10

Temporary power interruption should not require manual configuration.

### Rule 11

Playback errors should not permanently stop the player.

### Rule 12

Failed content should be skipped.

### Rule 13

The last known valid configuration should be used when the latest configuration is unavailable.

---

## 25. No Blank Screen Rule

The system must follow this priority:

```text id="h7i8j9"
Valid Promotional Content
        ↓
If unavailable
        ↓
Cached Valid Content
        ↓
If unavailable
        ↓
Default Content
        ↓
If unavailable
        ↓
Safe Fallback State
```

The objective is:

**The TV should never intentionally remain blank.**

---

## 26. Basic UI / System States

The system should support:

* Online
* Offline
* Syncing
* Synced
* Sync Failed
* Loading
* Recovering
* Playing
* Cached Playback
* Error
* Default Content

---

## 27. Phase 06 Business Flow

```text id="k1l2m3"
TV
  ↓
Normal Playback
  ↓
Failure / Network Interruption
  ↓
Detect Problem
  ↓
Use Cached / Last Known Configuration
  ↓
Continue Playback
  ↓
Connection Restored
  ↓
Synchronize
  ↓
Update Cache
  ↓
Resume Normal Operation
```

---

## 28. Complete Recovery Example

### Scenario

Spice Junction Udupi TV is playing:

```text id="n4o5p6"
Lunch Combo
    ↓
Diwali Special
```

Internet disconnects.

```text id="q7r8s9"
Internet OFF
    ↓
Cached Content
    ↓
Playback Continues
```

TV is restarted.

```text id="t1u2v3"
TV Restart
    ↓
Player Starts
    ↓
TV Identified
    ↓
Cached Playlist Loaded
    ↓
Playback Starts
```

Internet returns.

```text id="w4x5y6"
Internet ON
    ↓
Sync
    ↓
Check Schedule
    ↓
Download Updates
    ↓
Update Cache
    ↓
Normal Playback
```

No staff intervention is required.

---

## 29. Phase 06 Output

At the end of this phase:

* TV can continue playback during temporary internet loss
* Required content is cached locally
* Latest configuration can synchronize automatically
* Page refresh recovery works
* Application restart recovery works
* Browser restart recovery works
* TV restart recovery works
* Power interruption recovery works
* Failed media is skipped
* Configuration failures use the last known valid configuration
* Default content is used when required
* Basic TV connection status is available
* Basic synchronization status is available
* Playback can recover automatically
* The display can operate continuously with minimal human intervention

---

## 30. Out of Scope

The following are NOT part of Phase 06:

* Advanced Analytics
* Detailed Playback Reports
* Customer Analytics
* Advertisement Performance Analytics
* Business Intelligence
* Advanced Device Management
* Remote TV Control
* Remote TV Power Management
* Advanced Alerting / Notifications

These can be considered as future enhancements.

---

## 31. Phase 06 Completion

Phase 06 is complete when the TV can recover automatically from the major expected operational failures:

```text id="z7a8b9"
Network Failure
      ↓
Cached Playback

Page Refresh
      ↓
Playback Recovery

Application Restart
      ↓
Playback Recovery

TV / Browser Restart
      ↓
Playback Recovery

Power Interruption
      ↓
Playback Recovery

Media Failure
      ↓
Skip + Continue

No Valid Content
      ↓
Default Content
```

The system is then ready for:

**Phase 07 — Testing & Production Readiness**
