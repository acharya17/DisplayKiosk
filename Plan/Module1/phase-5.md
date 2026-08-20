# Phase 05 — Automated TV Playback

## Objective

Implement the actual **TV display experience** where assigned content is automatically loaded, displayed, and continuously played without any manual interaction.

This phase turns the configured TV into a working digital signage display.

---

## 1. TV Player

### Includes

* TV Player Screen
* TV Identification
* Assigned Playlist Loading
* Eligible Content Loading
* Full-Screen Display
* Automatic Playback
* Continuous Loop

The TV should operate without requiring customer or staff interaction.

---

## 2. TV Identification

When the TV player starts, it should identify the registered TV.

```text id="o1l2dk"
TV Starts
   ↓
Identify TV
   ↓
Get TV Configuration
   ↓
Get Assigned Playlist
   ↓
Load Content
```

### Rules

* TV must have a valid unique identity.
* TV must be active.
* TV configuration must be available.
* Unregistered TVs should not start normal playback.

---

## 3. Playlist Loading

The player should retrieve the playlist assigned to the TV.

### Flow

```text id="b2o3v1"
TV
 ↓
Assigned Playlist
 ↓
Playlist Content
 ↓
Check Eligible Banners
 ↓
Create Playback Queue
```

The player should use the playlist configuration created in Phase 03.

---

## 4. Eligible Content

Only currently eligible banners should be played.

A banner is eligible when:

```text id="f0i5el"
Banner = Active
AND
Playlist = Active
AND
Start Time Reached
AND
End Time Not Passed
```

Future and expired banners should not be played.

---

## 5. Playback Queue

The system should create a playback queue based on:

1. Assigned playlist
2. Banner eligibility
3. Display order

Example:

```text id="5ey5xr"
Playlist

1. Lunch Combo      → Eligible
2. Diwali Offer     → Eligible
3. New Branch       → Inactive
4. Weekend Offer    → Upcoming
```

Playback queue:

```text id="k2yxac"
Lunch Combo
      ↓
Diwali Offer
```

---

## 6. Image Playback

For image banners:

* Load image
* Display image
* Maintain configured duration
* Move to next banner

Example:

```text id="x9m7kz"
Lunch Combo
   ↓
10 Seconds
   ↓
Next Banner
```

---

## 7. Video Playback

For video banners:

* Load video
* Start automatically
* Play until completion
* Move to next banner

Example:

```text id="c8f5gr"
Video Start
    ↓
Video Playing
    ↓
Video Complete
    ↓
Next Banner
```

---

## 8. Automatic Loop

When the final eligible banner finishes, playback should automatically return to the first banner.

Example:

```text id="5c8l1n"
Banner 1
   ↓
Banner 2
   ↓
Banner 3
   ↓
Banner 1
   ↓
Banner 2
   ↓
...
```

No manual restart should be required.

---

## 9. Continuous Playback

The TV should continuously display content.

### Rules

* No manual play button
* No manual next button
* No user interaction required
* Playback continues automatically
* Playlist automatically loops

The TV should behave like a dedicated digital signage screen.

---

## 10. Full-Screen Display

The TV player should display only the content.

### Requirements

* Full-screen mode
* No browser address bar
* No browser controls
* No unnecessary UI
* No navigation elements
* No admin controls
* No customer interaction

The TV should behave as a dedicated display.

---

## 11. Aspect Ratio

Media should be displayed according to the TV screen dimensions.

### Requirements

* Maintain original aspect ratio
* Do not stretch images
* Do not squeeze videos
* Prevent unnatural distortion
* Support standard TV resolutions

The display should use an appropriate fitting strategy such as:

```text id="t4v2u1"
Contain / Cover
```

according to the configured display behavior.

---

## 12. Display Duration

For image banners:

```text id="p0k8dv"
Image Loaded
    ↓
Configured Duration
    ↓
Duration Complete
    ↓
Next Banner
```

The player must use the duration configured in Phase 02.

For videos:

```text id="1l6u9e"
Video Loaded
    ↓
Play
    ↓
Video Ends
    ↓
Next Banner
```

---

## 13. Transition

The system may support optional transitions between banners.

Possible transitions:

* Fade
* Fade Out / Fade In
* None

Transition behavior should not interrupt or delay the playback sequence unnecessarily.

---

## 14. Media Loading

Before displaying content, the player should verify that the media can be loaded.

### Flow

```text id="6x4j2b"
Get Banner
   ↓
Load Media
   ↓
Media Available?
   ├── YES → Play
   └── NO  → Skip
```

---

## 15. Failed Media Handling

If an image or video fails to load:

```text id="qf1z9o"
Banner 1
  ↓
Load Failed
  ↓
Skip Banner
  ↓
Banner 2
  ↓
Continue Playback
```

### Rules

* Do not stop playback.
* Do not remain stuck on the failed banner.
* Do not show a broken media element.
* Continue to the next eligible banner.

---

## 16. No Eligible Content

If the playlist contains no currently eligible banners:

```text id="w9pjbr"
Assigned Playlist
      ↓
No Eligible Banners
      ↓
Default Content
```

The default content configured in Phase 02 should be displayed.

This prevents the TV from becoming blank.

---

## 17. Default Content Failure

If the default content also fails to load, the player should show a safe fallback state rather than remaining stuck.

Example:

```text id="a4zqmp"
Default Content
     ↓
Load Failed
     ↓
Fallback Display State
```

The exact fallback behavior should follow the global application/error-handling standard.

---

## 18. Schedule Re-evaluation

The player should periodically re-check the current playlist configuration.

Example:

```text id="kpf3fd"
10:00 AM
Lunch Combo → Active

11:59 PM
Diwali Offer → Active

12:00 AM
Diwali Offer → Expired

        ↓

Re-evaluate Playlist

        ↓

Diwali Offer Removed
```

The TV should not require manual refresh to recognize scheduled content changes.

---

## 19. Content Update

When Admin changes the assigned playlist or content configuration:

```text id="l8f4si"
Admin
  ↓
Update Playlist
  ↓
System Configuration Updated
  ↓
TV Detects Update
  ↓
Refresh Playback Queue
  ↓
Continue Playback
```

The exact synchronization/realtime mechanism can be implemented according to the technical architecture.

---

## 20. Playback State

The player should maintain basic playback state such as:

* Current TV
* Current playlist
* Current banner
* Playback position/state
* Current queue
* Last successful content

This information will also support recovery features in Phase 06.

---

## 21. TV Screen Behaviour

The TV should:

* Start playback automatically
* Remain in display mode
* Hide unnecessary controls
* Prevent accidental interaction
* Continue playing indefinitely
* Avoid unnecessary screen changes
* Maintain the configured display layout

---

## 22. Customer Interaction

There should be no customer interaction with the display.

Customers cannot:

* Click banners
* Change banners
* Pause playback
* Skip content
* Open navigation
* Access admin controls

The TV is a **display-only interface**.

---

## 23. Playback Flow

```text id="4q4lga"
TV Starts
   ↓
Identify TV
   ↓
Load Configuration
   ↓
Get Assigned Playlist
   ↓
Get Eligible Content
   ↓
Create Playback Queue
   ↓
Play First Banner
   ↓
Wait for Duration / Video Completion
   ↓
Play Next Banner
   ↓
Last Banner?
   ├── NO → Next Banner
   └── YES
        ↓
     Restart Queue
        ↓
     Continue Playback
```

---

## 24. Playback Example

Spice Junction has:

```text id="z5o6mx"
Playlist:
Main Entrance

1. Lunch Combo
   Active

2. Diwali Special
   Active

3. New Branch Launch
   Inactive
```

TV playback:

```text id="1m4x1t"
Lunch Combo
    ↓
10 Seconds
    ↓
Diwali Special
    ↓
Video Ends
    ↓
Lunch Combo
    ↓
Diwali Special
    ↓
...
```

---

## 25. Schedule Change Example

At 11:59 PM:

```text id="o2r8jj"
Lunch Combo
Diwali Special
```

At 12:00 AM, Diwali Special expires.

The player re-evaluates:

```text id="8zhz2f"
Eligible Content

Lunch Combo
```

Playback continues with the updated queue.

---

## 26. Basic UI / Player States

The player should support:

* Initializing
* Loading
* Playing
* Waiting
* Media Failed
* No Eligible Content
* Default Content
* Configuration Error
* Connection Error

The TV should avoid exposing technical error details to customers.

---

## 27. Performance Requirements

The player should:

* Start playback quickly
* Avoid unnecessary reloads
* Avoid visible flickering
* Avoid unnecessary blank screens
* Release media resources correctly
* Prevent memory buildup during continuous playback
* Continue operating for long periods

---

## 28. Business Rules

### Rule 01

Only active TVs should participate in playback.

### Rule 02

Only the assigned playlist should be used for the TV.

### Rule 03

Only eligible banners should enter the playback queue.

### Rule 04

Banner display order determines playback sequence.

### Rule 05

Image duration determines how long an image is displayed.

### Rule 06

Videos should normally play until completion.

### Rule 07

The last banner must automatically loop back to the first eligible banner.

### Rule 08

Failed media must be skipped.

### Rule 09

If no eligible content exists, default content must be displayed.

### Rule 10

The player should periodically re-evaluate content eligibility.

### Rule 11

Customers should not be required to interact with the TV.

### Rule 12

Playback should not depend on manual controls.

---

## 29. Phase 05 Business Flow

```text id="6e4a1m"
TV
  ↓
Identify TV
  ↓
Load Assigned Playlist
  ↓
Check Eligible Content
  ↓
Create Playback Queue
  ↓
Play Content
  ↓
Next Content
  ↓
Last Content?
  ↓
Loop From First
  ↓
Continue Automatically
```

---

## 30. Spice Junction End-to-End Example

```text id="i4q5yp"
Spice Junction
      ↓
Udupi Branch
      ↓
TV-UDUPI-01
      ↓
Main Entrance Playlist
      ↓
Eligible Banners
      ↓
Lunch Combo
      ↓
Diwali Special
      ↓
Loop
```

No staff member needs to operate the TV.

---

## 31. Phase 05 Output

At the end of this phase:

* TV can identify itself
* TV can load its assigned playlist
* Eligible banners can be determined
* Images can play automatically
* Videos can play automatically
* Image duration works
* Video completion advances playback
* Content follows playlist order
* Playlist loops continuously
* TV operates in full-screen display mode
* Media maintains aspect ratio
* Failed media is skipped
* Default content is shown when no eligible content exists
* Playlist changes can be detected
* Scheduled content can be re-evaluated
* TV operates without customer interaction

---

## 32. Out of Scope

The following are NOT part of Phase 05:

* Offline Content Cache
* Offline Playback
* Network Recovery
* TV Power Recovery
* Browser Restart Recovery
* Application Restart Recovery
* Playback State Restoration
* Advanced Device Monitoring
* Detailed Device Health
* Playback Analytics
* Playback Reports

These will be handled in:

**Phase 06 — Reliability & Recovery**

---

## 33. Phase 05 Completion

Phase 05 is complete when a registered and configured TV can automatically perform the complete display cycle:

```text id="g3q8hy"
TV Starts
   ↓
Identify TV
   ↓
Load Playlist
   ↓
Find Eligible Banners
   ↓
Play Banner
   ↓
Wait / Complete
   ↓
Next Banner
   ↓
Last Banner
   ↓
Loop
   ↓
Continue 24/7
```

The system is then ready for:

**Phase 06 — Reliability & Recovery**
