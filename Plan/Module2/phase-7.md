# Module 2 — Self-Order Kiosk Admin

## Phase 7 — Kiosk Settings, Session Management & Hardware

### 1. Phase Purpose

Phase 7 is the **final operational layer** of the Self-Order Kiosk Admin.

It controls how the configured kiosk operates without creating duplicate business data.

```text
Category
   ↓
Product
   ↓
Customisation
   ↓
Combo
   ↓
Tax + Offers
   ↓
Kiosk
   ↓
Order
   ↓
Online Payment
   ↓
Kiosk Settings + Session + Hardware
```

---

## 2. Phase Scope

### Kiosk Settings

* Kiosk availability
* Operational status
* Connection status
* Inactivity/session timeout

### Session Management

* Inactivity detection
* Session timeout
* Temporary cart/session clearing
* Return to home
* Customer-data protection

### Hardware

* Hardware list
* Device ID
* Hardware type
* Connection status
* Configuration status
* Supported hardware configuration
* Test/retry actions where supported

### Operational Monitoring

* Kiosk connection
* Hardware readiness
* Configuration readiness
* Overall operational readiness where supported

---

## 3. Kiosk Settings

Show:

* Kiosk Name
* Kiosk ID
* Status
* Availability
* Connection

Keep **Status, Availability and Connection separate**.

```text
Status       Active
Availability Available
Connection   Online
```

Do not invent additional backend states.

---

## 4. Session / Inactivity Settings

### Main Field

**Inactivity Timeout**

```text
Inactivity Timeout
[ 60 seconds ]
```

The actual default/minimum/maximum must come from the approved project configuration.

### Session Flow

```text
Customer Starts Session
        ↓
Adds Products
        ↓
No Interaction
        ↓
Configured Timeout
        ↓
Clear Temporary Session
        ↓
Clear Cart
        ↓
Return to Home
```

The next customer must never see the previous customer's temporary data.

Clear only:

* Cart
* Selected customisations
* Selected combo options
* Temporary customer information
* Temporary selections

Do **not** delete:

* Completed orders
* Payment transactions
* Historical records

---

## 5. Payment/Session Safety

If payment is already successful:

```text
Payment Successful
        ↓
Session Timeout
        ↓
Transaction Preserved
```

If payment is pending, follow the approved backend/payment lifecycle. Do not automatically assume timeout means payment failure.

---

## 6. Optional Timeout Warning

Only implement if required:

```text
Show Timeout Warning
[ ON ]

Warning Duration
[ 10 seconds ]
```

If enabled:

```text
Warning Duration < Inactivity Timeout
```

Do not add this configuration if it is not required.

---

# 7. Hardware Management

Use only hardware actually supported by the project.

Possible supported devices:

* Receipt Printer
* Online Payment Terminal
* Customer Display

### Hardware Table

| Device  | Type             | Device ID | Connection | Configuration |
| ------- | ---------------- | --------- | ---------- | ------------- |
| PRN-001 | Printer          | PRN-001   | Connected  | Configured    |
| POS-001 | Payment Terminal | POS-001   | Connected  | Configured    |

Possible states:

* Connected
* Disconnected
* Not Configured
* Error

Use backend-defined states where available.

---

## 8. Receipt Printer

If supported, show:

* Printer Name
* Device ID
* Connection
* Configuration

Optional:

```text
[Test Print]
```

Only provide Test Print if supported.

Success/failure must come from actual system confirmation.

---

## 9. Payment Hardware

If dedicated payment hardware exists, show:

* Device Name
* Device ID
* Connection Status
* Configuration Status

Payment methods themselves remain managed through the earlier payment configuration.

```text
Payment Method
      ↓
Kiosk Assignment
      ↓
Payment Hardware
      ↓
Order
      ↓
Payment Transaction
```

Do not create duplicate payment methods for each kiosk.

---

# 10. Hardware Failure

Example:

```text
Receipt Printer
Disconnected
```

The system should:

* Clearly show the issue.
* Prevent only affected functionality when necessary.
* Keep Admin informed.
* Never falsely show the device as connected.

If hardware is optional, its failure should not automatically make the entire kiosk unavailable.

---

# 11. Kiosk Readiness

Where supported, show:

```text
Kiosk Readiness

Configuration     Ready
Menu              Ready
Payments          Ready
Connection        Online
Hardware          Ready

Overall            Ready
```

Conceptually:

```text
Kiosk Active
   +
Kiosk Available
   +
Connection
   +
Required Configuration
   +
Required Hardware
   =
Operationally Ready
```

If the backend provides readiness, use the backend value instead of duplicating the calculation.

---

# 12. Kiosk Details Integration

Phase 5 Kiosk Details can now show:

```text
Counter 01
KSK-001

Status        Active
Availability  Available
Connection    Online
Session       60 sec
Hardware      2 Connected
Readiness     Ready
```

Provide:

```text
[Configure Settings]
```

Keep **Details**, **Settings**, and **Hardware** logically separate.

---

# 13. Recommended Settings UI

```text
Kiosk Settings

Counter 01
KSK-001
Active · Online

--------------------------------

Availability
Available                  ON

--------------------------------

Session

Inactivity Timeout
[ 60 seconds ]

--------------------------------

Hardware

Receipt Printer
Connected

Payment Terminal
Connected

--------------------------------

Operational Readiness
Ready

--------------------------------

[Back]                  [Save]
```

Keep the page compact with no unnecessary fields.

---

# 14. Hardware Details

```text
Hardware Details

Receipt Printer

Device ID
PRN-001

Kiosk
Counter 01

Connection
Connected

Configuration
Configured

Last Connected
10:20 AM

[Back] [Test]
```

Only show fields/actions supported by the project.

---

# 15. Unsaved Changes

When leaving a modified settings/configuration page:

```text
Unsaved Changes

Save & Go Back
Go Back Without Saving
Continue Editing
```

If nothing changed, go back directly.

Use the same pattern across the Admin panel.

---

# 16. Save Behavior

On Save:

1. Validate settings.
2. Send configuration.
3. Wait for backend confirmation.
4. Update the UI with saved values.
5. Show success feedback.

If save fails:

```text
Unable to save kiosk settings.
Please try again.
```

Keep entered values; do not reset the form.

---

# 17. Kiosk Availability

If Admin turns availability OFF:

```text
Status       Active
Availability Unavailable
```

The kiosk should prevent new customer sessions according to the approved business rule.

Do not arbitrarily cancel an active payment or corrupt an active order.

---

# 18. Connection Loss

If the kiosk becomes offline:

```text
Connection
Offline
```

The system should:

* Update connection state.
* Preserve transaction data.
* Avoid falsely confirming payments.
* Recover safely when connection returns.

Offline behavior and synchronization must follow the backend implementation; do not invent unsupported behavior.

---

# 19. Historical Data Protection

Changing Phase 7 settings must never modify historical:

* Orders
* Payments
* Product prices
* Combo prices
* Taxes
* Discounts

Kiosk ID must remain stable.

Example:

```text
Display Name:
Counter 01 → Entrance Kiosk

Kiosk ID:
KSK-001 → KSK-001
```

This preserves Phase 6 transaction relationships.

---

# 20. Delete Rules

Do not delete:

* Completed orders
* Payment transactions
* Historical kiosk records

Prefer deactivation/archiving when historical relationships exist.

Hardware deletion should only be available when supported and safe.

---

# 21. Search & Filters

### Hardware Search

* Device Name
* Device ID

### Hardware Filters

* Hardware Type
* Connection Status
* Configuration Status

Use the standard popup filter:

```text
Filter Hardware

Type
[ All ▼ ]

Connection
[ All ▼ ]

Configuration
[ All ▼ ]

[Cancel] [Apply]
```

---

# 22. Loading / Empty / Error States

### Loading

Use compact skeletons.

### Empty

```text
No supported hardware configured.
```

### Error

```text
Unable to load hardware status.
[Retry]
```

Do not use oversized full-screen loaders for normal operations.

---

# 23. UI/UX Requirements

Follow the same global compact design system used in Phases 1–6.

* Compact forms
* Compact tables
* Proper page padding
* Consistent section spacing
* Consistent status components
* Clear Back button
* Unsaved-change warning
* No unnecessary Cancel buttons
* No excessive white space
* Responsive layout
* Reuse global components

Do not expose unnecessary technical/network settings.

---

# 24. Phase 7 Acceptance Criteria

### Kiosk Settings

* View settings.
* Configure availability.
* Configure inactivity timeout.
* Edit existing settings.
* Save successfully.
* Handle unsaved changes.

### Session

* Detect inactivity.
* Apply configured timeout.
* Clear temporary session/cart data.
* Protect customer data.
* Preserve completed orders.
* Preserve successful payments.
* Do not corrupt active transactions.

### Hardware

* View supported hardware.
* Show device ID.
* Show connection status.
* Show configuration status.
* Configure supported hardware.
* Support test/retry where applicable.
* Clearly show hardware failures.

### Readiness

* Show status.
* Show availability.
* Show connection.
* Show hardware readiness where supported.
* Show overall readiness where supported.

### Integration

* Do not duplicate Phase 1–6 data.
* Keep Kiosk ID stable.
* Preserve Order/Kiosk relationships.
* Preserve Payment/Order relationships.
* Do not modify historical transaction data.

### UI/UX

* Compact UI.
* Proper padding and spacing.
* Clean settings page.
* Clean hardware table.
* Search/filter where needed.
* Loading/empty/error states.
* Responsive layout.
* Back navigation.
* Unsaved-change handling.

---

# 25. Phase 7 Implementation Rules for AI

1. Read Phases 1–6 before implementation.
2. Reuse the existing Kiosk Master.
3. Do not create duplicate business data.
4. Keep Kiosk ID stable.
5. Preserve Order/Kiosk and Payment/Order relationships.
6. Treat session data as temporary.
7. Never delete completed transaction data during session reset.
8. Do not invent timeout values.
9. Do not invent unsupported hardware types/settings.
10. Use backend-defined statuses and readiness values.
11. Never falsely show hardware or payment as successful/connected.
12. Keep Kiosk Settings and Hardware logically separate.
13. Keep Details and Edit synchronized.
14. Reuse global UI components.
15. Follow the compact UI guideline.
16. Keep Back and unsaved-change behavior consistent.
17. Do not add unnecessary fields or Cancel buttons.
18. Do not break Phases 1–6.
19. Fix spacing, alignment, responsive and validation issues.
20. Do not introduce unsupported business functionality.

---

# 26. Final Module 2 Flow

```text
PHASE 1
Category + Product
        ↓
PHASE 2
Customisation
        ↓
PHASE 3
Combo
        ↓
PHASE 4
Tax + Offers / Discounts
        ↓
PHASE 5
Kiosk Management
        ↓
PHASE 6
Orders + Online Payments
        ↓
PHASE 7
Kiosk Settings
        ↓
Session / Inactivity
        ↓
Hardware
        ↓
Connection
        ↓
Operational Readiness
        ↓
READY SELF-ORDER KIOSK
```

**Phase 7 is the final operational layer: it makes the configured kiosk safe, usable, connected, and ready without introducing another business-data layer.**
