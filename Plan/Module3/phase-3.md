# Module 3 — Customer TV Display

# Phase 3 — Loading & Playlist Playback

## 1. Phase Purpose

Phase 3 is where the paired and configured TV actually becomes a **customer-facing display**.

Phase 1 established the TV connection.
Phase 2 loaded the TV configuration.
Phase 3 uses that configuration to:

* Prepare the display.
* Select the correct playlist.
* Load the configured content.
* Play banners/videos in the configured order.
* Respect each content item's duration.
* Loop the playlist continuously.
* Switch playlists when the configured schedule changes.
* Maintain a clean, full-screen customer experience.

### Core Flow

```text id="t9o5mb"
Phase 2
Configuration Ready
        ↓
Prepare Display
        ↓
Check Current Time
        ↓
Select Active Playlist
        ↓
Load Playlist Content
        ↓
Validate Content
        ↓
Start Playback
        ↓
Banner / Video
        ↓
Next Content
        ↓
Continue
        ↓
Loop
```

---

# 2. Phase Scope

### Included

* Display loading
* Active playlist selection
* Time-based playlist selection
* Playlist playback
* Image/banner playback
* Video playback
* Content duration
* Content ordering
* Playlist looping
* Smooth transitions
* Schedule-based playlist switching
* Content preloading
* Playback error handling
* Missing-content handling
* Playback recovery
* Full-screen display

### Not Included

Do not implement in this phase:

* TV pairing
* TV authentication
* Banner creation
* Playlist creation
* Schedule creation
* Admin configuration
* Kiosk ordering
* Payment
* Hardware management

Those are handled elsewhere.

---

# 3. Phase 2 → Phase 3 Dependency

Phase 3 must not start until Phase 2 has successfully provided:

```text id="8x0e6t"
TV Identity
      ✓
Authentication
      ✓
TV Configuration
      ✓
Playlist
      ✓
Schedule
      ✓
Media
      ✓
```

Then:

```text id="h6y1ts"
Configuration Ready
        ↓
Phase 3 Playback
```

---

# 4. Display Loading

After configuration is ready, show a short branded loading state.

Example:

```text id="0q2c5j"
┌──────────────────────────────────────┐
│                                      │
│             BRAND LOGO               │
│                                      │
│          Preparing display...        │
│                                      │
└──────────────────────────────────────┘
```

### Requirements

* Full-screen
* Minimal
* Branded
* Short duration
* No technical information

Do not show:

* Playlist name
* TV ID
* Device ID
* API status
* Download percentage
* Admin information

Once content is ready, transition directly into playback.

---

# 5. Determine Active Playlist

If only one playlist is assigned:

```text id="p3qf72"
TV
 ↓
Assigned Playlist
 ↓
Play
```

If multiple playlists are configured:

```text id="lq0h8u"
TV
 ↓
Check Current Time
 ↓
Check Schedule
 ↓
Find Matching Playlist
 ↓
Play Selected Playlist
```

---

# 6. Time-Based Playlist Selection

One TV can have multiple playlist schedules.

Example:

```text id="j8t5uw"
Main Hall TV

09:00 – 12:00
Breakfast Playlist

12:00 – 04:00
Lunch Playlist

04:00 – 07:00
Evening Playlist

07:00 – 10:00
Dinner Playlist
```

At 1:30 PM:

```text id="t1jv9h"
Current Time
01:30 PM
      ↓
Matching Schedule
      ↓
Lunch Playlist
      ↓
Start Lunch Playlist
```

The customer does not need to interact with anything.

---

# 7. Schedule Priority

The TV must have one clear active playlist at any given time.

If multiple schedules overlap:

```text id="8o9lq3"
Schedule A
09:00 – 14:00

Schedule B
12:00 – 16:00
```

The system must follow the backend-defined priority/validation rule.

Do not invent frontend logic such as:

* First created wins
* Last created wins
* Highest priority wins

unless that rule is explicitly defined.

Ideally, overlapping schedules should already be prevented during Admin configuration.

---

# 8. Playlist Structure

A playlist contains ordered content.

Example:

```text id="8e2s6u"
Lunch Playlist

01  Lunch Offer
02  Combo Promotion
03  Beverage Promotion
04  Dessert Promotion
```

The TV must preserve the configured order.

---

# 9. Content Types

The playback engine should support the content types configured by the system.

### Image / Banner

```text id="4e9g2c"
Banner
 ↓
Display
 ↓
Configured Duration
 ↓
Next Banner
```

### Video

```text id="6j5j3v"
Video
 ↓
Play
 ↓
Video Completion
 ↓
Next Content
```

Do not assume every content type has the same playback behavior.

---

# 10. Content Duration

For image/banner content, use the configured duration.

Example:

```text id="g8qg7k"
Banner 01
10 sec

Banner 02
15 sec

Banner 03
10 sec
```

Playback:

```text id="f0tq5h"
Banner 01 → 10 sec
     ↓
Banner 02 → 15 sec
     ↓
Banner 03 → 10 sec
```

Do not hardcode durations if they are already configured in Admin.

---

# 11. Video Duration

For video content:

* Start playback.
* Allow the video to play.
* Move to the next item when the configured video playback rule is satisfied.

If the business rule is simply **play until video completion**, use video duration.

If Admin supports an explicit duration override, follow that configured rule.

Do not invent a new video timing mechanism.

---

# 12. Playback Order

The TV should follow the exact order received from the playlist.

Example:

```text id="8khz7v"
Admin Playlist Order

1. Banner A
2. Banner B
3. Video A
4. Banner C
```

TV:

```text id="xewf4o"
Banner A
 ↓
Banner B
 ↓
Video A
 ↓
Banner C
```

Never randomly reorder content.

---

# 13. Playlist Loop

After the final content:

```text id="q8m15b"
Banner A
 ↓
Banner B
 ↓
Banner C
 ↓
End
 ↓
Banner A
 ↓
Banner B
 ↓
...
```

The playlist should continuously loop while it remains the active schedule.

---

# 14. Multiple Playlist Schedule

When the current time changes into another schedule:

```text id="5i9a8u"
Lunch Playlist
       ↓
Schedule Ends
       ↓
Check Current Time
       ↓
Evening Playlist
       ↓
Load Evening Content
       ↓
Start Playback
```

The TV should switch automatically.

No user interaction is required.

---

# 15. Schedule Boundary Handling

Example:

```text id="p2d3xx"
Lunch
12:00 – 04:00

Evening
04:00 – 07:00
```

At exactly 4:00 PM, the system should use the backend-defined schedule boundary rule.

Do not leave the TV stuck on the previous playlist.

---

# 16. Smooth Playlist Switching

When the active playlist changes:

```text id="c8j4q7"
Current Playlist
      ↓
Detect Schedule Change
      ↓
Prepare New Playlist
      ↓
Smooth Transition
      ↓
New Playlist
```

Avoid:

* Blank screen
* Abrupt flashing
* Admin UI
* Loading page visible to customers

---

# 17. Full-Screen Playback

The playback screen must occupy the entire TV.

### No visible UI

Do not show:

* Header
* Footer
* Sidebar
* Breadcrumb
* Playlist name
* TV name
* Progress bar
* Controls
* Play/pause button
* Connection indicator
* Technical status

The customer should see only the configured content.

---

# 18. Image Display

Images should:

* Fill the display appropriately.
* Preserve the intended design.
* Follow the configured fit/crop behavior.
* Avoid unexpected distortion.

Use the project's defined media presentation rule.

Do not arbitrarily stretch banners.

---

# 19. Video Playback

Video should:

* Start automatically where supported.
* Play without customer interaction.
* Use the configured playback behavior.
* Continue to the next playlist item.
* Handle loading failures gracefully.

If browser/device restrictions affect autoplay, use the approved TV playback implementation.

---

# 20. Content Preloading

To avoid blank screens:

```text id="91jzq2"
Current Banner
      ↓
Preload Next Content
      ↓
Current Completes
      ↓
Next Content Ready
      ↓
Smooth Transition
```

For videos, preload according to device/network capabilities.

Do not preload unlimited media.

---

# 21. Smooth Transition

Use a simple transition such as:

* Fade
* Crossfade

Avoid excessive animation.

The content itself should remain the visual focus.

### Recommended

```text id="5s4kq6"
Banner A
   ↓
Soft Fade
   ↓
Banner B
```

Avoid:

* Bounce
* Zoom
* Spin
* Flash
* Excessive movement

unless specifically required by the content design.

---

# 22. Missing Content

If a playlist references missing media:

```text id="5wy0wq"
Playlist
 ↓
Banner A ✓
Banner B ✕
Banner C ✓
```

Do not show a broken image or blank screen.

Recommended:

```text id="m1h5ag"
Skip Invalid Content
       ↓
Continue With Next Valid Content
```

If all content is invalid:

```text id="l0iw3m"
No Valid Content
       ↓
Fallback Content
```

---

# 23. Playback Error

If one banner fails:

```text id="j1q2qv"
Banner Failed
    ↓
Skip Banner
    ↓
Next Banner
```

Do not stop the entire playlist because one item failed.

---

# 24. Video Error

If a video fails to load:

```text id="1v5b6x"
Video Failed
     ↓
Skip Video
     ↓
Next Content
```

If retry is supported:

```text id="8c7k0g"
Retry
 ↓
If Success → Play
If Failure → Skip
```

Do not leave the TV on a permanent spinner.

---

# 25. No Content Available

If there is no valid playlist content:

```text id="kz0gsh"
No display content available
```

If a fallback asset exists:

```text id="2b4t5m"
No Active Content
       ↓
Fallback Banner
```

The fallback should be branded.

---

# 26. Fallback Content

Fallback should be used when:

* No valid playlist is available.
* Playlist content cannot be loaded.
* Configuration temporarily fails.
* Network is unavailable and no valid cached playlist exists.

Example:

```text id="v7j2u0"
SPICE JUNCTION

Welcome
```

Do not show a technical error page.

---

# 27. Offline Playback

If the TV already has valid cached content:

```text id="j72r4f"
Online Playlist
      ↓
Network Lost
      ↓
Use Cached Playlist
      ↓
Continue Playback
```

The customer should not notice the network failure.

---

# 28. Offline Schedule

If schedule information is already available locally:

```text id="m98n9x"
Cached Schedule
      ↓
Current Time
      ↓
Select Cached Playlist
      ↓
Continue Playback
```

If the schedule is unavailable, use the project's fallback behavior.

Do not invent a new offline scheduling policy.

---

# 29. Reconnection

When the network returns:

```text id="x0x1b4"
Offline
 ↓
Connection Restored
 ↓
Check Configuration
 ↓
Check Playlist
 ↓
Download Updates
 ↓
Validate
 ↓
Apply Updated Configuration
```

Do not abruptly reload the entire application unless required.

---

# 30. Configuration Update During Playback

Example:

Current:

```text id="n0m6e1"
Banner A
Banner B
Banner C
```

Admin changes:

```text id="u9e3p5"
Banner A
Banner D
Banner C
```

The TV should:

```text id="t0i4lc"
Current Playback
      ↓
Detect Update
      ↓
Prepare Banner D
      ↓
Apply New Playlist
      ↓
Continue Smoothly
```

Do not interrupt playback unnecessarily.

---

# 31. Playlist Update Safety

If the new configuration is incomplete:

```text id="k4c3o8"
New Playlist
   ↓
Validation Failed
   ↓
Keep Existing Valid Playlist
```

This is preferable to displaying a blank screen.

Only switch when the new configuration is valid.

---

# 32. Current Playlist Persistence

If the TV restarts during playback:

```text id="k5v7xy"
TV Restart
   ↓
Phase 1 Session Check
   ↓
Phase 2 Configuration
   ↓
Phase 3 Playback
   ↓
Check Current Time
   ↓
Start Correct Playlist
```

The TV should not blindly resume an outdated playlist if the current schedule has changed.

---

# 33. Customer Experience Rules

The TV must feel like a dedicated digital signage display.

Customer should see:

```text id="r9u5h5"
CONTENT
CONTENT
CONTENT
CONTENT
```

Not:

```text id="6ypr0r"
Loading...
Connection...
Playlist:
TV:
Device:
Status:
```

All technical handling should happen silently in the background.

---

# 34. Playback State Management

The implementation should maintain clear internal states.

Example:

```text id="w5x5xw"
INITIALIZING
     ↓
LOADING
     ↓
READY
     ↓
PLAYING
     ↓
SWITCHING
     ↓
PLAYING
```

Error:

```text id="c7v8x4"
PLAYING
   ↓
CONTENT_ERROR
   ↓
SKIP
   ↓
PLAYING
```

Network:

```text id="8v2h7w"
PLAYING
   ↓
OFFLINE
   ↓
CACHED_PLAYBACK
   ↓
ONLINE
   ↓
SYNC
   ↓
PLAYING
```

These are implementation states and do not need to be visible to customers.

---

# 35. Schedule Change Detection

The TV should periodically or event-driven check for configuration changes according to the backend architecture.

Possible mechanisms:

* Push update
* WebSocket
* Polling
* Configuration versioning

Use the project's existing architecture.

Do not introduce a new synchronization mechanism unnecessarily.

---

# 36. Content Versioning

If supported by the backend, use configuration/content versioning.

Example:

```text id="v34qka"
Version 12
   ↓
TV has Version 12

Admin publishes Version 13
   ↓
TV detects Version 13
   ↓
Download
   ↓
Validate
   ↓
Apply
```

This prevents unnecessary full configuration downloads.

---

# 37. Playback Performance

The TV should:

* Avoid unnecessary network requests.
* Preload the next media where practical.
* Reuse cached media.
* Avoid memory leaks.
* Avoid continuously recreating video elements unnecessarily.
* Release media resources when no longer required.

This is especially important for long-running TV displays.

---

# 38. Long-Running Stability

The TV may run continuously for many hours or days.

Implementation must avoid:

* Memory growth
* Repeated timers
* Duplicate event listeners
* Multiple playback loops
* Multiple schedule timers
* Repeated API requests
* Video element accumulation

Playback should remain stable over long periods.

---

# 39. Screen Wake / Full-Screen

The application should remain in full-screen display mode according to the TV/browser/device setup.

Avoid:

* Browser controls
* Cursor visibility where possible
* Screen navigation
* Accidental exit from playback

Hardware/browser restrictions should be handled according to the deployment environment.

---

# 40. Phase 3 UI/UX

Unlike Admin pages, this phase has almost **no visible UI**.

### Visible states

#### Loading

```text id="1a4xv8"
Brand Logo
Preparing display...
```

#### Normal

```text id="5o5jbt"
Full-screen banner/video
```

#### Fallback

```text id="d9j8gt"
Branded fallback content
```

That is intentionally all.

---

# 41. Phase 3 Acceptance Criteria

Phase 3 is complete only when:

### Playback

* Correct playlist is selected.
* Playlist order is respected.
* Image/banner content plays correctly.
* Video content plays correctly.
* Configured durations are respected.
* Playlist loops continuously.
* Multiple playlists are supported.
* Time-based playlist selection works.
* Playlist switches automatically when the schedule changes.

### Content

* Media loads correctly.
* Invalid media is skipped.
* Missing content does not break playback.
* Video failures do not stop the playlist.
* Content is preloaded where appropriate.
* No unnecessary blank screen occurs.

### Synchronization

* Admin configuration changes can reach the TV.
* New content is validated before switching.
* Existing valid content continues during updates.
* Configuration does not require re-pairing.
* Cached content can continue when appropriate.

### Recovery

* Network loss is handled.
* Cached content continues where available.
* Reconnection synchronizes content.
* TV restart recovers automatically.
* Invalid configuration does not crash the application.
* Fallback content works where configured.

### Customer Experience

* Full-screen playback.
* No Admin UI.
* No technical information.
* No visible connection errors.
* No unnecessary loading screens.
* Smooth transitions.
* No excessive animations.

### Performance

* Stable long-running playback.
* No memory leaks.
* No duplicate timers/listeners.
* No unnecessary API calls.
* Efficient media handling.

---

# 42. Phase 3 Implementation Rules for AI

1. Read Phases 1 and 2 before implementing Phase 3.
2. Use the authenticated TV configuration from Phase 2.
3. Do not create playlists on the TV.
4. Do not edit playlists on the TV.
5. Do not create banners on the TV.
6. Do not edit schedules on the TV.
7. Select the active playlist using the configured schedule.
8. Support multiple playlists per TV.
9. Respect the configured playlist order.
10. Respect configured banner durations.
11. Support configured image/video content.
12. Loop the playlist continuously.
13. Preload upcoming content where practical.
14. Skip invalid content safely.
15. Do not allow one failed media item to stop the playlist.
16. Use fallback content where configured.
17. Continue cached content during temporary network failure where supported.
18. Synchronize updated configuration without unnecessary interruption.
19. Validate new configuration before applying it.
20. Do not switch to an invalid or incomplete playlist.
21. Keep the TV full-screen during normal playback.
22. Do not display technical information to customers.
23. Use smooth, minimal transitions.
24. Keep playback stable for long-running sessions.
25. Avoid memory leaks and duplicate timers/listeners.
26. Do not implement Phase 4+ functionality prematurely.
27. Follow the existing project's backend synchronization architecture.
28. Do not invent schedule priority, pricing, or business rules.
29. Automatically recover after TV/application restart.
30. Keep the implementation clean and production-ready.

---

# 43. Final Phase 3 Flow

```text id="i3v94k"
          PHASE 2
     Configuration Ready
             ↓
      Prepare Display
             ↓
       Check Current Time
             ↓
      Select Active Playlist
             ↓
       Load Playlist Items
             ↓
       Validate Media
             ↓
        Preload Content
             ↓
        Start Playback
             ↓
      ┌─────────────────┐
      │   Banner / Video │
      └────────┬────────┘
               ↓
          Duration Ends
               ↓
        Next Playlist Item
               ↓
             Loop
               ↺
```

### Schedule Change

```text id="e9h4ko"
Current Playlist
       ↓
Schedule Boundary
       ↓
Check Current Time
       ↓
New Playlist
       ↓
Prepare Content
       ↓
Smooth Switch
       ↓
Continue Playback
```

### Failure Recovery

```text id="kw5p9j"
Playback
   ↓
Network / Content Failure
   ↓
Use Cached Content
   ↓
Reconnect
   ↓
Sync Configuration
   ↓
Validate
   ↓
Resume Updated Playback
```

### Phase 3 Goal

**Phase 3 turns the authenticated TV into a reliable, full-screen digital signage player: select the correct scheduled playlist, play its content in order, loop continuously, synchronize changes, and recover silently from failures.**
