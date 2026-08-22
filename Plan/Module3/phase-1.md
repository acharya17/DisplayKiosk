# Module 3 — Customer TV Display

## Single-Page Display Flow

The TV Display should be a **single full-screen playback page** with a simple sliding/transition experience. No separate customer-facing pages are needed after pairing.

### TV Display Flow

```text
TV Starts
   ↓
TV Pairing / Login
   ↓
TV Authenticated
   ↓
Load Configuration
   ↓
Select Active Playlist
   ↓
Full-Screen Display
   ↓
Banner / Video
   ↓
Smooth Slide / Fade
   ↓
Next Banner / Video
   ↓
Continue Loop
```

### Single Display Page

The playback page should contain **only the content**:

* Image Banner
* Video
* Promotional Content
* Announcement

No:

* Header
* Sidebar
* Footer
* Playlist name
* TV name
* TV code
* Connection status
* Admin information
* Playback controls
* Progress bar

### Sliding Behaviour

```text
Banner 01
    ↓
Smooth Slide / Fade
    ↓
Banner 02
    ↓
Smooth Slide / Fade
    ↓
Banner 03
    ↓
Video
    ↓
Banner 01
    ↺
```

* Follow the **configured playlist order**.
* Use the **configured duration** for each banner.
* Videos play according to their configured playback behaviour.
* Automatically loop the playlist.
* Keep transitions smooth and minimal.
* No unnecessary animation.

### Time-Based Playlist

The same single display page can automatically change its content based on the configured schedule:

```text
09:00–12:00 → Morning Playlist
12:00–16:00 → Afternoon Playlist
16:00–19:00 → Evening Playlist
19:00–22:00 → Night Playlist
```

The TV checks the current schedule in the background and switches to the appropriate playlist **without leaving the display page**.

### Failure Handling

If content fails:

```text
Current Content
      ↓
Try Cached / Valid Content
      ↓
If Available → Continue
      ↓
If Not Available → Fallback Content
```

No technical error screen should be visible to customers.

### UI Guideline

**Full-screen + clean + minimal + smooth + content-focused.**

The only separate screen required is the **initial TV Login/Pairing screen**. Once paired, everything—loading, playlist selection, scheduling, syncing and playback—should happen within the **single TV display page**.
