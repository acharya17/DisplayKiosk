# Phase 02 — Banner & Media Management

## Objective

Create the content management foundation required for the TV Banner / Digital Display module.

This phase allows the Admin to create, upload, view, edit, activate/deactivate, and delete the images and videos that will be used for display.

---

## 1. Banner Management

### Includes

* Banner List
* Add Banner
* View Banner
* Edit Banner
* Delete Banner
* Activate Banner
* Deactivate Banner

### Banner Information

* Banner Name
* Media File
* Media Type
* Display Duration
* Status

---

## 2. Media Management

The system should support:

* Image Media
* Video Media

### Media Type

The system should automatically identify whether the uploaded file is an image or video.

Admin should not need to manually select the media type.

### Supported Media

* Standard image formats
* Standard video formats

The exact supported formats and file-size limits should follow the global development configuration.

---

## 3. Add Banner

### Banner Information

* Banner Name
* Media File
* Display Duration
* Status

### Actions

* Upload Media
* Preview Media
* Save
* Cancel

### Flow

```text
Add Banner
  ↓
Enter Banner Name
  ↓
Upload Media
  ↓
Media Type Identified
  ↓
Preview Media
  ↓
Set Display Duration
  ↓
Set Status
  ↓
Save
```

---

## 4. Media Upload

The Admin should be able to upload the required image or video.

### Includes

* File Selection
* File Validation
* Upload
* Upload Progress
* Upload Success
* Upload Failure
* Replace Media
* Remove Media

### Rules

* Invalid file types should not be accepted
* Files exceeding the configured size limit should not be accepted
* Failed uploads should not create incomplete banners
* Uploaded media should be previewable before saving

---

## 5. Media Preview

The Admin should be able to preview the uploaded content.

### Image

Display the uploaded image.

### Video

Display the uploaded video with basic preview controls.

### Preview Requirements

* Preview before saving
* Preview after uploading
* Preview while viewing an existing banner
* Preview after replacing media

---

## 6. Display Duration

Display duration defines how long an image should remain on the TV during future playback.

### Rules

* Required for image banners
* Must be a valid positive duration
* Should be stored with the banner
* Video duration can be determined automatically from the uploaded video

Example:

```text
Banner:
Weekday Lunch Combo

Display Duration:
10 Seconds
```

Actual playback behavior will be implemented in a later phase.

---

## 7. Banner Status

Each banner should support:

* Active
* Inactive

### Rules

* Active banner = available for future display configuration
* Inactive banner = stored but unavailable for future display
* Deactivation does not delete the banner
* Status can be changed without editing the banner content

---

## 8. Banner List

Display all created banners in a common list/table.

### Display Fields

* Preview
* Banner Name
* Media Type
* Display Duration
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

## 9. Search

Admin should be able to search banners.

### Search By

* Banner Name
* Media Type

### Includes

* Search
* Clear Search
* No Search Results

---

## 10. Filter

Filters should be opened through a Filter button.

### Filter Dialog

Fields:

* Media Type
* Status

### Actions

* Apply
* Cancel
* Clear / Reset

### Flow

```text
Banner List
  ↓
Filter
  ↓
Filter Dialog
  ↓
Select Filter Values
  ↓
Apply
  ↓
Filtered Banner List
```

---

## 11. View Banner

Admin should be able to view the complete banner information.

### Information

* Banner Preview
* Banner Name
* Media Type
* Display Duration
* Status
* Created Date
* Updated Date

### Actions

* Edit
* Activate / Deactivate
* Delete

---

## 12. Edit Banner

Admin should be able to update an existing banner.

### Editable Information

* Banner Name
* Media File
* Display Duration
* Status

### Actions

* Replace Media
* Preview
* Save
* Cancel

### Flow

```text
Banner List
  ↓
View / Edit
  ↓
Update Information
  ↓
Preview
  ↓
Save
  ↓
Banner Updated
```

---

## 13. Delete Banner

Admin should be able to permanently remove a banner.

### Flow

```text
Banner List
  ↓
Delete
  ↓
Confirmation
  ↓
Confirm
  ↓
Banner Deleted
```

### Rule

Delete must require confirmation to prevent accidental deletion.

---

## 14. Default / Fallback Content

The system should allow the Admin to configure default content that can later be displayed when there is no valid promotional content.

### Example

```text
Welcome to Spice Junction
```

### Includes

* Configure Default Content
* Upload / Select Media
* Preview
* Replace Content
* Save

### Rules

* Only the configured default content should be used as the fallback
* Default content should remain available even when promotional banners are inactive or unavailable

Actual fallback playback behavior will be implemented in a later phase.

---

## 15. Basic UI States

The phase should support standard states:

* Loading
* Empty
* Error
* Success
* Uploading
* Upload Failed
* Preview
* Active
* Inactive
* No Search Results
* No Filter Results

---

## 16. Basic Validation

### Banner

* Banner Name — Required
* Media File — Required
* Media File — Valid Format
* Display Duration — Required for Images
* Display Duration — Must be greater than zero
* Status — Active / Inactive

### Media

* Supported File Type
* Valid File
* File Size Within Limit

---

## 17. Business Rules

### Rule 01

Every banner must have a valid media file.

### Rule 02

Media type is determined automatically from the uploaded file.

### Rule 03

An active banner can be used in future display configuration.

### Rule 04

An inactive banner must not be considered for future display.

### Rule 05

Deactivating a banner does not delete it.

### Rule 06

Deleting a banner permanently removes it from the banner library.

### Rule 07

Image banners require a display duration.

### Rule 08

Video duration can be determined from the uploaded video.

### Rule 09

Only one configured default/fallback content should be maintained for the display system.

---

## 18. Success / Error Messages

### Success

* Banner created successfully
* Banner updated successfully
* Banner deleted successfully
* Banner activated successfully
* Banner deactivated successfully
* Default content updated successfully

### Error

* Unable to create banner
* Unable to update banner
* Unable to delete banner
* Unable to update banner status
* Unable to upload media
* Invalid media file

---

## 19. Phase 02 Business Flow

```text
Admin
  ↓
Banner Management
  ↓
Add Banner
  ↓
Upload Image / Video
  ↓
Media Validation
  ↓
Preview
  ↓
Enter Banner Information
  ↓
Save
  ↓
Banner List
  ↓
View / Edit / Activate / Deactivate / Delete
```

---

## 20. Phase 02 Output

At the end of this phase:

* Admin can manage banners
* Images can be uploaded
* Videos can be uploaded
* Media type is automatically identified
* Media can be previewed
* Display duration can be configured
* Banner status can be managed
* Banners can be searched
* Banners can be filtered
* Banners can be viewed
* Banners can be edited
* Banners can be deleted
* Default/fallback content can be configured
* Content is ready for playlist and scheduling

---

## 21. Out of Scope

The following are NOT part of Phase 02:

* Start Date / Time
* End Date / Time
* Playlist Creation
* Playlist Ordering
* Banner Scheduling
* TV Registration
* TV Device Management
* TV Assignment
* TV Groups
* Automatic Playback
* Full-screen TV Display
* Continuous Loop
* Offline Cache
* Network Recovery
* TV Restart Recovery
* Playback Monitoring
* Display Analytics

These will be handled in subsequent phases.

---

## 22. Phase 02 Completion

Phase 02 is complete when the Admin can fully manage the content library required for the TV Display system.

The complete flow should work:

```text
Create Banner
  ↓
Upload Media
  ↓
Validate Media
  ↓
Preview
  ↓
Configure Banner
  ↓
Save
  ↓
Manage Banner
  ↓
Activate / Deactivate / Edit / Delete
```

The system is then ready to support:

**Phase 03 — Playlist & Scheduling**
