# Module 3 — Customer TV Display

# Phase 2 — Authentication & Configuration

## 1. Phase Purpose

Phase 2 starts **after Phase 1 pairing is successfully completed**.

The purpose is to:

* Verify the paired TV/device session.
* Identify the correct TV Display.
* Load its assigned configuration.
* Load the configured playlist/schedule information.
* Prepare the required media for playback.
* Validate that the TV is ready for Phase 3 Loading/Playback.

### Core Flow

```text
TV Successfully Paired
        ↓
Verify TV Session
        ↓
Identify TV Display
        ↓
Fetch TV Configuration
        ↓
Fetch Assigned Playlist(s)
        ↓
Fetch Schedule
        ↓
Fetch Required Media
        ↓
Validate Configuration
        ↓
Ready
        ↓
Phase 3 — Loading / Playback
```

---

# 2. Phase Scope

### Included

* TV authentication/session verification
* TV identity verification
* TV configuration retrieval
* Assigned playlist retrieval
* Schedule retrieval
* Banner/media metadata retrieval
* Media availability validation
* Configuration validation
* Configuration loading states
* Authentication failure handling
* Configuration failure handling
* Retry
* Session recovery
* Transition to Phase 3

### Not Included

Do not implement in Phase 2:

* Banner creation
* Playlist creation
* Playlist editing
* Schedule creation/editing
* Admin TV management
* Customer interaction
* Order functionality
* Kiosk functionality
* Hardware configuration
* Full playback controls

Those belong to other modules/phases.

---

# 3. Phase 1 → Phase 2 Dependency

Phase 1 creates the authenticated TV identity.

```text
Phase 1
TV Pairing
    ↓
TV ID
    ↓
Device Identity
    ↓
Authenticated Session
    ↓
Phase 2
```

Phase 2 uses this information to determine:

> **Which TV configuration should this physical TV load?**

---

# 4. TV Identity Verification

After pairing, the application must verify the current TV identity.

Example:

```text id="wz5m1f"
TV Display
Main Hall TV

TV ID
TV-0001

Device ID
DEVICE-8F42A1
```

The TV must not accidentally load another TV's configuration.

---

# 5. Authentication Check

At startup after pairing:

```text id="ikf7i9"
Existing TV Session
        ↓
Verify Session
        ↓
Is Session Valid?
```

### Valid

```text id="5w4bka"
Session Valid
     ↓
Load Configuration
```

### Invalid

```text id="7d7y82"
Session Invalid
     ↓
Clear Invalid Session
     ↓
Return to Phase 1 Pairing
```

Do not allow an unauthenticated TV to request protected TV configuration.

---

# 6. Configuration Retrieval

Once authentication is valid:

```text id="b0q7zw"
Authenticated TV
       ↓
Request TV Configuration
       ↓
Backend
       ↓
Return Assigned Configuration
```

The configuration should be associated with the paired TV.

Possible configuration information:

* TV Display Name
* TV Display ID
* Assigned playlist(s)
* Schedule
* Banner/media references
* Display settings where supported
* Fallback content reference where configured

Only load fields required by the TV application.

---

# 7. TV Display Configuration

Example:

```text id="o9b2td"
TV Display
Main Hall TV

TV ID
TV-0001

Assigned Playlists
Breakfast
Lunch
Evening
Dinner
```

The TV should not allow editing these values.

The Admin side remains the source of truth.

---

# 8. Playlist Retrieval

The TV retrieves playlists assigned to that TV.

Example:

```text id="k9b1bi"
Main Hall TV
       ↓
Assigned Playlists
       ├── Breakfast
       ├── Lunch
       ├── Evening
       └── Dinner
```

The TV does not create or modify playlists.

---

# 9. Playlist Data

For each playlist, retrieve only the information required for playback.

Possible information:

* Playlist ID
* Playlist name
* Content items
* Item order
* Media type
* Media URL/reference
* Duration
* Active state
* Scheduling information

Example:

```text id="v6o7aj"
Lunch Playlist

01  Chicken Offer     10 sec
02  Combo Banner      10 sec
03  Drinks Promotion 15 sec
```

---

# 10. Schedule Retrieval

If the TV has time-based playlists, retrieve the configured schedule.

Example:

```text id="r5j7b0"
Main Hall TV

09:00 – 12:00
Breakfast Playlist

12:00 – 16:00
Lunch Playlist

16:00 – 19:00
Evening Playlist

19:00 – 22:00
Dinner Playlist
```

The TV should use the schedule to determine what should be played later.

Phase 2 only **loads the schedule**.

The actual playback selection happens in the appropriate playback phase.

---

# 11. Multiple Playlist Support

One TV can have multiple playlists.

Example:

```text id="r5r1c7"
TV
 ↓
Playlist Schedule
 ├── Morning → Playlist A
 ├── Afternoon → Playlist B
 └── Night → Playlist C
```

The TV must not assume there is only one playlist.

Configuration should support multiple valid assignments.

---

# 12. Media Retrieval

After playlist metadata is received, identify the media required for playback.

Possible content:

* Images
* Videos
* Promotional banners

Example:

```text id="qj74e8"
Playlist
   ↓
Content Items
   ↓
Media References
   ↓
Download / Validate
```

Do not show media loading details to customers.

---

# 13. Media Validation

Before moving to the next phase, verify that required media is available.

Check:

* Valid media reference
* Supported media type
* Accessible media
* Required metadata
* Valid duration where applicable

If content is invalid, handle it gracefully.

Do not show raw technical errors.

---

# 14. Configuration Validation

Before playback begins, validate:

### TV

* Valid TV identity
* Valid authenticated session

### Playlist

* Playlist exists
* Playlist is available
* Playlist contains valid content

### Schedule

* Valid schedule
* Valid time range
* Valid playlist reference

### Media

* Required media available
* Supported media type

---

# 15. Invalid Configuration

If configuration is incomplete:

```text id="h1tbvl"
Configuration unavailable
```

The TV should not crash or display a broken interface.

If fallback content exists:

```text id="gjrr4w"
Invalid Playlist
      ↓
Fallback Content
```

If no fallback is available, use the project's approved recovery behavior.

Do not invent an error screen containing technical details.

---

# 16. No Playlist Assigned

If the TV is authenticated but has no playlist:

```text id="1k90zj"
TV Connected

No display content is currently configured.
```

If fallback content is configured, use it instead.

The TV should remain stable and wait for configuration changes.

---

# 17. Configuration Loading State

During configuration retrieval:

```text id="7j5e2q"
Main Hall TV

Preparing display...
```

Keep the screen branded and minimal.

Do not show:

* API requests
* Configuration JSON
* Playlist IDs
* Device IDs
* Server status
* Technical logs

---

# 18. Configuration Refresh

The TV should be capable of retrieving updated configuration.

Example:

```text id="dh6dqa"
Current Configuration
       ↓
Configuration Updated
       ↓
Fetch New Configuration
       ↓
Validate
       ↓
Apply
```

Do not force the TV to return to the pairing screen for a normal configuration update.

---

# 19. Authentication vs Configuration

These must remain separate.

### Authentication

Answers:

> **Is this TV allowed to access the display system?**

### Configuration

Answers:

> **What should this TV display?**

```text id="0t6t7u"
Authentication
      ↓
Who is this TV?
      ↓
Configuration
      ↓
What should this TV display?
```

---

# 20. Configuration Source of Truth

The Admin system remains the source of truth.

```text id="q8uvx4"
ADMIN
 ↓
TV Display Configuration
 ↓
Backend
 ↓
TV
```

The TV should never become an independent configuration system.

---

# 21. TV Cannot Edit Configuration

The TV should not have controls for:

* Playlist selection
* Banner selection
* Schedule changes
* TV name changes
* Content ordering
* Banner duration
* Active/inactive configuration

All such changes happen from the Admin side.

---

# 22. Configuration Change Example

Admin currently configures:

```text id="28gxpa"
Main Hall TV

Lunch
→ Lunch Playlist
```

Later Admin changes it to:

```text id="j9n6c4"
Main Hall TV

Lunch
→ Special Lunch Playlist
```

The TV should:

```text id="akj9rt"
Detect Configuration Change
       ↓
Fetch New Configuration
       ↓
Validate
       ↓
Prepare New Playlist
       ↓
Apply
```

No re-pairing should be required.

---

# 23. Session Recovery

If the TV restarts:

```text id="2qv0vo"
TV Restart
   ↓
Check Saved Authentication
   ↓
Valid
   ↓
Fetch Configuration
   ↓
Phase 3
```

If invalid:

```text id="3s1y2p"
Invalid Session
   ↓
Clear Session
   ↓
Phase 1 Pairing
```

---

# 24. Network Failure

If configuration cannot be retrieved because of a temporary network problem:

```text id="0p1e7w"
Configuration Request
       ↓
Network Failure
       ↓
Retry
```

Use controlled retry behavior.

Do not continuously create requests without limits.

If previously valid configuration/cache exists, preserve it according to the approved offline strategy.

---

# 25. Retry

A retry should:

1. Check connectivity.
2. Re-authenticate if necessary.
3. Request configuration.
4. Validate response.
5. Continue to Phase 3 if successful.

Example:

```text id="1z4t66"
Unable to load display configuration.

[Retry]
```

Keep the message customer-friendly.

---

# 26. Security

Phase 2 must ensure:

* Only authenticated TV devices access configuration.
* TV cannot access Admin functionality.
* TV only receives data required for display.
* Session credentials are not displayed.
* Device identity is validated.
* Invalid sessions are rejected.
* Configuration is associated with the correct TV.

---

# 27. Performance

The TV should avoid unnecessary requests.

Prefer:

```text id="0h1uyc"
Authenticate
     ↓
Fetch Configuration
     ↓
Fetch Required Media
     ↓
Ready
```

Avoid:

```text id="b8zqv0"
Fetch TV
Fetch Playlist
Fetch TV again
Fetch Playlist again
Fetch Banner 1
Fetch Banner 1 again
...
```

Use appropriate caching and synchronization according to the backend architecture.

---

# 28. Transition to Phase 3

Phase 2 is complete when:

```text id="8v3gxi"
TV Authentication
      ✓
TV Identity
      ✓
Configuration
      ✓
Playlist
      ✓
Schedule
      ✓
Required Media
      ✓
Validation
      ✓
```

Then:

```text id="8x2p6x"
→ Phase 3 — Loading / Playback
```

The transition should be automatic.

---

# 29. Phase 2 UI/UX

The TV is not an Admin interface.

Use:

* Full-screen
* Brand logo
* Minimal text
* Large readable status
* Simple loading indicator
* Smooth transitions

Avoid:

* Sidebar
* Header
* Tables
* Forms
* Admin buttons
* Technical information
* Debug information

---

# 30. Phase 2 Screens / States

Phase 2 does not require many separate pages.

### Screen 1 — Preparing Display

```text id="o5k1gk"
SPICE JUNCTION

Preparing your display...
```

### Screen 2 — Configuration Error

```text id="x5g3t7"
Unable to prepare display.

[Retry]
```

### Screen 3 — No Content

```text id="drm8gk"
No display content is currently configured.
```

### Screen 4 — Ready

This should normally transition immediately to Phase 3.

```text id="k0wj2g"
Display Ready
```

Avoid keeping this screen visible unnecessarily.

---

# 31. Phase 2 Data Flow

```text id="v3bqkh"
PHASE 1
TV Paired
      ↓
Authenticated Session
      ↓
Verify TV Identity
      ↓
Request Configuration
      ↓
Receive TV Configuration
      ↓
Retrieve Playlists
      ↓
Retrieve Schedule
      ↓
Retrieve Media
      ↓
Validate
      ↓
Configuration Ready
      ↓
PHASE 3
```

---

# 32. Phase 2 Acceptance Criteria

Phase 2 is complete only when:

### Authentication

* Paired TV session is verified.
* Invalid session is rejected.
* Expired session returns to Phase 1.
* TV identity is validated.
* TV cannot access another TV's configuration.

### Configuration

* Correct TV configuration is loaded.
* TV Display ID is identified.
* Assigned playlists are loaded.
* Multiple playlists are supported.
* Schedule is loaded where configured.
* Required media references are loaded.
* Configuration is validated.

### Recovery

* Retry works.
* Network failure is handled.
* Invalid configuration does not crash the application.
* No playlist state is handled correctly.
* Existing valid session survives normal restart.
* Configuration can be refreshed without re-pairing.

### Security

* TV cannot edit configuration.
* TV cannot access Admin functionality.
* Sensitive credentials are not displayed.
* Configuration is tied to the correct device.

### UI/UX

* Full-screen TV experience.
* Minimal branded loading state.
* No Admin UI.
* No technical information.
* Clear error state.
* Smooth transition to Phase 3.

---

# 33. Phase 2 Implementation Rules for AI

1. Read Phase 1 before implementing Phase 2.
2. Do not recreate TV pairing.
3. Use the authenticated TV/device identity from Phase 1.
4. Validate the existing session before requesting configuration.
5. Load only the configuration belonging to that TV.
6. Support multiple assigned playlists.
7. Load the configured schedule.
8. Load required media metadata.
9. Validate configuration before playback.
10. Do not create or edit playlists on the TV.
11. Do not create or edit banners on the TV.
12. Do not create or edit schedules on the TV.
13. Do not expose Admin functionality.
14. Do not expose technical errors.
15. Handle expired authentication.
16. Handle network failures.
17. Provide retry where required.
18. Do not repeatedly request the same data unnecessarily.
19. Preserve valid configuration/session during normal TV restart.
20. Do not proceed to playback with an invalid configuration.
21. Follow the project's approved caching/synchronization architecture.
22. Keep the TV UI full-screen, minimal, and branded.
23. Automatically proceed to Phase 3 when configuration is ready.
24. Do not implement later-phase functionality prematurely.

---

# 34. Final Phase 2 Flow

```text id="p8x6oz"
          PHASE 1
       TV Successfully Paired
                ↓
       Verify TV Session
                ↓
        Verify TV Identity
                ↓
       Fetch Configuration
                ↓
      ┌─────────┼─────────┐
      ↓         ↓         ↓
   Playlist  Schedule   Media
      └─────────┼─────────┘
                ↓
       Validate Everything
                ↓
       Configuration Ready
                ↓
          PHASE 3
       Loading / Playback
```

### Phase 2 Goal

**Phase 2 should make the paired TV fully aware of what it is supposed to display, without displaying or editing that configuration itself.**

In short:

**Phase 1 = Connect the TV**
**Phase 2 = Load what the TV should display**
**Phase 3 = Display it**
