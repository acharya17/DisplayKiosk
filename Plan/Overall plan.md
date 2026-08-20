# Understanding This Requirement Document — Simple English Walkthrough

Before we start, let's fix one **realistic business example** that we'll use for both modules, so everything connects together.

**Our example business:** *"Spice Junction"* — a fast-casual Indian restaurant chain with 3 branches (say, Udupi, Mangalore, Manipal). Each branch has:
- 1 TV screen near the entrance/waiting area (showing menu promotions)
- 1–2 self-order kiosks near the counter (where customers place their own orders)

We'll follow this one business through both modules so you can see how data flows from one screen to another.

---

# MODULE 1: TV Banner / Digital Display

## What this module is
This is a **digital signage system** — basically a TV screen that automatically shows a slideshow of images/videos (banners) in a continuous loop, like a silent advertisement screen, with **zero button-pressing** by anyone standing near it.

## Why the business needs it
Spice Junction wants to show customers, while they wait:
- Today's special dish
- A "Buy 1 Get 1" offer
- A new menu launch
- Store timings, festival greetings, etc.

Instead of a staff member manually changing slides, the TV should do this **automatically, all day, every day**.

## Who uses it
- **Admin** (a restaurant manager or head-office marketing person) — configures/manages banners.
- **Customers** — only *view* the TV. They never interact with it (no touch, no remote).
- **System** — runs the playback automatically.

## What the Admin does (Banner Management)
The Admin logs into an admin panel (a web dashboard, not shown on the TV itself) and can:
- **Create** a new banner
- **Edit** an existing banner
- **Activate/Deactivate** a banner (turn it on/off without deleting it)
- **Delete** a banner permanently

Each banner is a "record" with these fields:

| Field | Meaning |
|---|---|
| Banner image/video | The actual creative file |
| Title/name | Internal label, e.g. "Diwali Offer Banner" — customers never see this name |
| Display duration | How many seconds this banner stays on screen (for images; videos may just play till end) |
| Start date/time | When this banner should *start* appearing |
| End date/time | When this banner should *stop* appearing |
| Display order/priority | The sequence position in the playlist (1st, 2nd, 3rd...) |
| Active/Inactive status | A manual on/off switch, separate from scheduling |

**Example:** Admin uploads a "Diwali Offer" banner, sets Start = 1 Nov, End = 15 Nov, Order = 1, Status = Active.

The Admin can upload **multiple banners** and arrange them as a **playlist** (an ordered list of banners that play one after another).

## What happens in the system — Continuous Playback
- The system picks all banners that are **currently valid** (Active = Yes, AND today's date/time falls between Start and End).
- It plays them **in order, one after another**.
- When the last one finishes, it **automatically restarts from banner #1** — this is called a "loop." No one has to click "play again."
- **No manual interaction is needed at any point** — this is the defining feature of digital signage.
- **Transition effects** (like fade-in/fade-out between banners) are optional/configurable — the document says "if required," meaning it's a nice-to-have, not mandatory.

## Data created/updated
- A **Banner table** in the database storing all fields above.
- A **Playlist/sequence** which is really just the "display order" field sorted ascending.
- A **TV session/state** (which banner is currently showing, so that on refresh it can pick up correctly — explained below).

## Rules & Validations
1. Only banners where **Active = true** AND **current time is between Start and End** are eligible to play.
2. If a banner's End date/time has passed, the system must **automatically stop showing it** — no manual removal needed.
3. **If NO banner qualifies** (e.g., all expired, or none configured yet), the system must show a **pre-configured default screen/banner** instead of a blank screen.
4. If one banner **fails to load** (broken image link, corrupted video, etc.), the system must **skip it silently and move to the next banner** — it should never get stuck or show a blank/broken screen.
5. If the internet disconnects **temporarily**, banners that are **already downloaded/cached** on the TV device should **keep playing** — the system shouldn't stop show just because Wi-Fi blinked.

## What happens after
- The playback just **keeps looping forever**, 24/7 (or during business hours, whichever is configured), automatically re-evaluating which banners are valid as time passes (so at midnight, an expired banner drops out and a new one may drop in — without anyone touching the TV).

## Display Behaviour (technical presentation rules)
- The banner content should **auto-fit the TV's screen resolution/aspect ratio** — e.g., a banner designed for a 16:9 TV shouldn't look stretched or squeezed on a different-sized screen.
- Images must **not be distorted** (no unnatural stretching).
- The TV runs in **full-screen / kiosk mode** — meaning no browser address bar, no taskbar, nothing else visible except the banner content.
- **Screen stays on continuously** (no auto-sleep/screensaver kicking in).

## Recovery Behaviour (very important — this is a "self-healing" requirement)
The TV must **automatically resume playback correctly** after any of these disruptions, with **no human needing to press anything**:
- Page refresh
- TV or browser restart (e.g., after a power cut)
- Temporary network interruption
- The whole application restarting

This means the system needs to **remember its state** (which banners are valid, roughly where it should resume) so that after a restart, it doesn't show a blank screen — it goes straight back into the loop.

## Multiple TVs
Since Spice Junction has 3 branches (and maybe more than 1 TV per branch):
- Every **TV must have its own unique identity** (e.g., "TV-Udupi-01", "TV-Mangalore-Entrance").
- The Admin can **assign a specific playlist to a specific TV, or to a group of TVs** (e.g., all "Entrance TVs" across branches get the same offer banner, but the "Counter TV" at Udupi shows something different).
- When the Admin changes a banner centrally (from head office), it should **automatically reflect on the assigned TV(s)** — no one has to go physically configure each TV screen.

## Default/Fallback Content
- Admin configures **one default banner/screen** in advance (e.g., just the restaurant logo with "Welcome to Spice Junction").
- This default is shown in **two situations**:
  1. No active/scheduled banner currently qualifies.
  2. A banner exists but its content **failed to load**.
- This guarantees the TV is **never blank**.

## Practical Business Example (Module 1)
- Spice Junction Head Office admin uploads 3 banners:
  1. "Weekday Lunch Combo" — Active, no end date (runs indefinitely), Order 1
  2. "Diwali Special" — Active, Start 1 Nov, End 15 Nov, Order 2
  3. "New Branch Launch – Manipal" — currently Inactive (not ready yet)
- On 5th Nov, TV plays: Lunch Combo → Diwali Special → Lunch Combo → Diwali Special → ... (loop). "New Branch Launch" never shows because it's Inactive.
- On 16th Nov, Diwali banner's End date has passed. TV automatically drops it and now only loops "Weekday Lunch Combo."
- If, say, on 20th Dec, the Admin accidentally deactivates the Lunch Combo banner too (and nothing else is active) — the TV shows the **default "Welcome to Spice Junction" screen** instead of going blank.
- If the Manipal branch TV loses internet for 2 minutes during a network glitch, it **keeps playing whatever banner is already loaded/cached**, and reconnects silently once internet is back.

## What we understood so far (Module 1)
The TV Banner module is a fully automated, self-looping digital display. Admin configures banners with schedules and ordering; the system decides in real time which banners are valid, loops them endlessly, gracefully skips broken content, falls back to a default screen when nothing is valid, and recovers automatically from crashes/network issues. Multiple TVs can be centrally and independently managed.

**Connection to Module 2:** The TV Banner module and the Self-Order Kiosk module are **largely independent systems** — they don't share order data or customer data. However, they are **conceptually connected** in the customer's real-world journey: a customer sees an offer on the TV (e.g., "Buy 1 Get 1 Biryani") while waiting, and then may walk up to the **Kiosk** to actually place that order. So the TV is a *marketing/awareness* layer, and the Kiosk is the *transaction* layer. They likely share the **same Admin panel** (one login for the restaurant's back office) and possibly the **same product/pricing data source**, since a promotional banner should ideally reflect prices that are consistent with what the kiosk actually charges — though the document doesn't explicitly state this data-sharing, so I'm flagging this as an **assumption**, not a stated requirement.

---

# MODULE 2: Self-Order Kiosk

## What this module is
This is a **touchscreen ordering machine** placed inside the restaurant, allowing the customer to browse the menu, customize their food, pay, and get an order token — **without talking to any staff member**.

## Why the business needs it
- Reduces counter queues and staff workload.
- Reduces order-taking errors (customer selects everything themselves).
- Speeds up service, especially during rush hours.

## Who uses it
- **Customer** — the main user; browses, orders, pays.
- **Admin** — configures menu, pricing, kiosk settings from a back-office panel.
- **System** — validates data, processes payment, sends orders to the kitchen.
- **External integrations** — Payment gateway (UPI/Card), Order Management/KOT (Kitchen Order Ticket) system, possibly a receipt printer.

Let's now go screen-by-screen, in the actual order a customer experiences.

---

### 2.1 Kiosk Home Screen

**What happens:** The kiosk shows Spice Junction's logo/branding, available categories (like "Starters," "Biryani," "Beverages"), a language option (if the restaurant serves multilingual customers — e.g., English/Kannada), and a "Start Order" button.

**Rule:** If a customer walks away or doesn't touch the screen for a **configurable period** (e.g., 60 seconds) after starting to browse, the kiosk **automatically returns to this Home Screen** — like a "reset" so the next customer doesn't accidentally continue someone else's cart.

**Business example:** A customer taps "English," then taps "Start Order."

---

### 2.2 Product Browsing

**What the customer does:**
- Browses categories (e.g., taps "Biryani").
- Views a list of products with **name, image, description, price, availability** (e.g., "Chicken Dum Biryani – ₹220 – Available").
- Can **search** for a product by typing (e.g., typing "paneer").
- **Adds to cart**, and from the cart can **increase/decrease quantity** or **remove** an item.

**Data involved:** Product master data (name, image, description, price, category, availability flag) — this comes from the **Admin Configuration** module (explained later) — the kiosk doesn't create this data, it only *displays* it.

**Rule:** Only products marked **"available"** by Admin should be orderable. If a product is out of stock, the customer shouldn't even be able to add it (or it should be visibly disabled).

---

### 2.3 Product Customisation

**What happens:** If the customer picks something customizable — say "Chicken Biryani" — the kiosk may show:
- **Size** (Half/Full)
- **Add-ons** (extra raita, extra gravy)
- **Variants** (Spicy/Mild)
- **Modifiers** — some **mandatory** (e.g., "Choose Spice Level" — must pick one) and some **optional** (e.g., "Add Boiled Egg — optional")
- **Quantity**
- **Special instructions** (free text, e.g., "less oil please")

**Rule (very important):** As soon as the customer changes any of these options, **the price updates immediately on screen** — e.g., Half Biryani ₹150 → customer selects Full → price instantly becomes ₹220 → adds extra egg (+₹15) → shows ₹235.

**Business example:** Customer selects "Chicken Biryani," Size = Full (₹220), Spice Level = Spicy (mandatory, no extra cost), Add-on = Extra Raita (+₹20). Final line price shown = ₹240. Customer taps "Add to Cart."

---

### 2.4 Cart

The Cart screen consolidates everything the customer has added, and must clearly show:
- Product name
- Selected options/customizations (e.g., "Full, Spicy, +Extra Raita")
- Quantity
- Unit price
- Item total (unit price × quantity)
- **Subtotal** (sum of all item totals)
- **Discount**, if any applies (e.g., a running offer)
- **Taxes**, if applicable (e.g., GST)
- **Final payable amount** (subtotal – discount + tax)

Customer can still **edit or remove** items here before checking out.

**Business example (running total for our customer):**
- 1x Full Chicken Biryani (Spicy + Extra Raita) = ₹240
- 1x Cold Coffee = ₹90
- Subtotal = ₹330
- Discount (if a "10% off on orders above ₹300" offer applies) = -₹33
- Tax (say 5% GST on ₹297) = +₹14.85
- **Final Payable = ₹311.85** (rounded to ₹312)

---

### 2.5 Checkout

The customer provides only the **required information** the business has configured — the document specifically says **"Only required fields should be shown"** (so if a business doesn't need mobile number, don't ask for it — it's configurable, not fixed).

Typical fields:
- Name
- Mobile number
- Table/order number (for dine-in)
- Dine-in / Takeaway selection
- Any other mandatory info the business decides

**Business example:** Customer selects "Dine-in," enters Table No. = 7, enters Name = "Rahul," skips mobile number (if it's optional at this branch).

---

### 2.6 Payment

The kiosk supports **configured payment methods** — meaning the Admin decides which are turned on for that kiosk/branch:
- UPI
- Card
- Other configured methods
- **Cash** — but only if the business specifically wants staff-assisted cash collection (this is a conditional/optional method, unlike UPI/Card which are usually self-service)

#### Payment Cases (this is one of the most critical parts of the whole document — must be handled very carefully)

| Case | What must happen |
|---|---|
| **Payment successful** | Order gets confirmed |
| **Payment failed** | Customer is allowed to **retry** |
| **Payment cancelled** (customer backs out) | Order stays **unpaid**, is **not confirmed** |
| **Payment timeout** (no response in time) | System must **verify actual payment status** with the payment gateway before letting the customer try again — don't just assume it failed |
| **Payment succeeds, but kiosk doesn't receive the confirmation response** (e.g., network drop right after paying) | System must **verify status** (check with payment gateway) rather than blindly creating a **second/duplicate order** |
| **Customer clicks "Pay" multiple times** | Only **one** payment/order attempt should actually go through — extra clicks must be ignored/blocked |

**The golden rule stated explicitly in the document: "Customer should never be charged twice for the same order."** This is the single most important business rule in this entire module — everything about verification-before-retry exists to protect this rule.

**Business example:** Rahul pays ₹312 via UPI. His phone shows "Payment Successful," but right at that moment the kiosk's internet blips and it doesn't receive the confirmation. Instead of creating a fresh/duplicate order or showing "Payment Failed" (which could make him pay again), the system must **check with the payment gateway**: "Was this specific transaction ID actually paid?" → gateway confirms yes → system marks the **same, single order** as paid → shows success screen. It must NOT create Order #2 and charge him again.

---

### 2.7 Order Confirmation

Once payment is genuinely successful:
- Show **order confirmation** screen
- Show the **order number/token** (e.g., "Token #47")
- Show **payment status**
- Show **estimated preparation time**, if the business tracks that
- **Print a receipt/token**, if a printer is connected/configured
- Send the order to the **order-management/KOT (Kitchen Order Ticket) system** — this is how the kitchen staff actually gets to know what to cook.

**Business example:** Rahul's screen shows "Order Confirmed – Token #47 – Est. 15 mins," a receipt prints with Token #47, and simultaneously the kitchen's KOT screen/printer receives: "Table 7 – 1x Full Chicken Biryani (Spicy, +Raita), 1x Cold Coffee."

---

### 2.8 Order Status (Lifecycle)

Every order moves through defined statuses that the kiosk (and backend) must correctly track:
1. Order created
2. Payment pending
3. Payment successful
4. Payment failed
5. Order cancelled
6. Order completed

This status list is important because it tells us the order isn't just "placed or not" — it has a proper lifecycle, which matters for the Admin dashboard (to know which orders are stuck in "pending," which failed, etc.).

---

### 2.9 Inactivity Handling

If Rahul starts building a cart but walks away without paying:
- Kiosk shows an **inactivity warning** (e.g., "Are you still there?" after some seconds of no touch).
- If he still doesn't respond, after the **configured timeout**, the system:
  - **Clears the cart/session**
  - **Returns to Home Screen**
  - **Clears any sensitive data** that might have been temporarily held (like partial payment info) — this protects both the next customer's privacy and Rahul's data security.

---

### 2.10 Network Failure Handling

If internet drops while a customer is using the kiosk:
- Kiosk must **clearly tell the customer** the service is temporarily unavailable (not just freeze silently).
- **Checkout/payment must NOT proceed** if backend or payment services are unreachable — this prevents a broken transaction.
- Once connectivity returns, the app should **recover automatically** (no manual restart needed).
- **Partially completed orders should not get accidentally submitted twice** when things reconnect — same duplicate-protection principle as payments.

---

### 2.11 Product Availability (Real-time Check)

- Out-of-stock items shouldn't even be selectable.
- But there's a trickier case: what if an item **was** available when Rahul added it to cart, but by the time he's checking out, the kitchen ran out?
- **Rule:** The system must **re-validate availability right before final order confirmation**. If something is now unavailable, the customer must be **told**, and allowed to **modify the cart** (e.g., remove that item) instead of the order silently going through wrong, or silently failing.

---

### 2.12 Pricing Validation

- The prices shown on kiosk should reflect the **latest configured pricing** (set by Admin).
- But critically: **final pricing must be re-validated by the backend server before confirming the order** — this is a security measure. It means the kiosk (a public-facing device) is **never trusted blindly** for the final amount; the backend independently recalculates the correct price.
- **The kiosk must not be able to manipulate the final payable amount** — this guards against tampering (e.g., someone hacking the kiosk app to send a fake lower price).

---

### 2.13 Kiosk Security

- Runs in **full-screen/kiosk mode** — customer cannot access browser controls, OS settings, developer tools, or other apps. (This is standard "kiosk lockdown" — same idea as the TV's kiosk mode, but here it's even more critical because customers physically touch this device.)
- Customer/session data is **cleared after order completion or timeout**.
- Payment info should **not be stored locally** unless explicitly required *and* implemented securely (this is a strong caution against storing card/UPI details on the kiosk device itself).

---

### 2.14 Hardware Considerations

The kiosk may connect to physical hardware:
- Touchscreen (main input)
- Receipt printer (optional, "if required")
- QR/UPI payment display or scanner (to show a QR code or scan customer's UPI app)
- Card terminal (external card swipe machine, if applicable)
- Customer-facing display (a secondary screen showing the cart, common in retail setups)

**Rule:** If any hardware fails (say the printer runs out of paper), the **kiosk app must not crash** — it should show an appropriate error (e.g., "Printer unavailable — order confirmed digitally, please show token screen") and let the customer/staff recover, rather than the whole ordering flow breaking down.

---

### 2.15 Admin Configuration (Back-office Setup)

This is where Admin sets up everything the kiosk *displays and enforces*:
- Kiosk availability (is ordering open right now, e.g., turned off after closing hours)
- Categories/products
- Product availability (stock on/off)
- Prices
- Add-ons/modifiers
- Taxes
- Discounts
- Payment methods (which ones are enabled)
- Inactivity timeout duration
- Store/order settings (general business rules)
- Kiosk-specific settings (settings that differ per physical kiosk device)

This is the **single source of truth** that Product Browsing, Customisation, Cart, Checkout, and Payment modules all pull from.

---

### 2.16 Multiple Kiosks

Since Spice Junction may have 1–2 kiosks per branch (×3 branches):
- Each kiosk has a **unique identifier** (e.g., "Kiosk-Udupi-01").
- Every order must record **which kiosk generated it** (so Admin/staff know where to deliver, and can audit issues per device).
- Kiosk-specific settings are supported (e.g., maybe Mangalore branch enables Cash payment, but Udupi doesn't).
- **One kiosk's failure/crash must not affect other kiosks** — they operate independently.

---

### 2.17 Order Identification (final data record)

Every order — once created — must contain:
- Unique Order ID (internal system ID)
- Order number/token (what the customer sees, e.g., "#47")
- Kiosk ID (which device created it)
- Order date/time
- Customer information (if collected — remember, some fields are optional)
- Ordered items (with all customizations)
- Payment status
- Order status

This is essentially the **final data structure** that gets sent onward to the **Order Management / KOT system**, and is what Admin sees in reports/order history.

---

### 2.18 Error & Recovery Table (Summary — this consolidates rules from across the whole document)

| Scenario | Expected Behaviour |
|---|---|
| Banner fails to load | Skip banner, continue playlist |
| No active TV banner | Show default content |
| TV network disconnected | Continue with cached content |
| Kiosk internet disconnected | Disable checkout/payment, show status message |
| Product becomes unavailable | Block final order, ask customer to update cart |
| Payment fails | Allow retry |
| Payment cancelled | Order stays unpaid |
| Payment timeout | Verify actual status before allowing retry |
| Payment success but response lost | Verify status, prevent duplicate order |
| Customer leaves kiosk | Clear session after timeout |
| Multiple "Pay" clicks | Only one payment/order attempt processed |
| Backend unavailable | Block order submission entirely |
| Printer unavailable | Show error, continue digitally if business allows |
| Kiosk app crashes | Auto-restart/recover |
| TV app crashes | Auto-restart/recover |
| Session expires | Clear cart, return home |
| Price changes mid-checkout | Revalidate and show updated price |

This table is basically a **checklist for testers/developers** — every one of these must be explicitly built and tested, not left to chance.

## What we understood so far (Module 2)
The Kiosk module lets a customer independently browse, customize, cart, checkout, and pay — with heavy emphasis on **never double-charging, never showing wrong/stale prices, never crashing into a dead-end, and always validating with the backend before confirming anything final**. Every order carries a full identity trail (which kiosk, what items, payment/order status) and flows onward to the kitchen via the Order Management/KOT system.

**Connection back to Module 1:** Both modules are run from the **same restaurant's back-office/Admin panel** conceptually, both require **kiosk-mode lockdown**, both must **self-recover from crashes/network drops without human help**, and both must **never show a broken/blank screen** — TV falls back to a default banner, Kiosk falls back to clear error messaging + auto-recovery. The TV is the "silent advertiser," the Kiosk is the "silent order-taker" — together they minimize the need for staff to interact with customers for browsing/ordering.

---

# FINAL CONSOLIDATED VIEW

## Complete End-to-End Business Flow (real customer journey)

1. Rahul walks into Spice Junction, Udupi branch.
2. **TV Banner** near entrance is looping: "Weekday Lunch Combo" → "10% off orders above ₹300" (automatically, no one touched it).
3. Rahul notices the offer, walks to the **Kiosk**.
4. Kiosk Home Screen → he selects language → taps "Start Order."
5. Browses "Biryani" category → picks "Chicken Biryani" → customizes (Full, Spicy, +Extra Raita) → price updates live to ₹240 → adds to cart.
6. Adds "Cold Coffee" (₹90) too.
7. Views Cart → sees Subtotal ₹330, Discount -₹33 (auto-applied 10% offer, matching what the TV advertised), Tax +₹14.85, Final ₹312.
8. Checkout → enters Table 7, Name "Rahul" (mobile skipped, since it's optional here).
9. Pays via UPI → kiosk shows "Processing" → network blips → kiosk **verifies with payment gateway** rather than assuming failure or re-charging → confirms payment was genuinely successful.
10. Order Confirmed screen shows "Token #47," receipt prints, order sent to **KOT/Kitchen system**.
11. Kitchen prepares food; staff calls "Token #47."
12. Order status moves: Created → Payment Pending → Payment Successful → Order Completed.

## Module-to-Module Dependency Flow

- **Admin Configuration → TV Banner Module**: Admin creates/schedules banners → TV consumes and plays them.
- **Admin Configuration → Kiosk Module**: Admin sets products, prices, taxes, discounts, payment methods, timeouts → Kiosk displays and enforces these.
- **Product Browsing → Customisation → Cart → Checkout → Payment → Order Confirmation**: strictly sequential dependency; each step's output feeds the next (e.g., Cart totals feed into Checkout, Checkout data feeds into Payment, successful Payment triggers Order Confirmation).
- **Kiosk → Order Management/KOT system**: Kiosk pushes the finalized order outward; kitchen depends entirely on this data to know what to cook.
- **Kiosk → Payment Gateway**: External dependency for processing/verifying UPI, Card payments.
- **Kiosk → Printer/Hardware**: Optional dependency for physical receipt output.

## Roles Involved
- **Admin** — configures banners, menu, pricing, kiosks, TVs, payment methods, timeouts.
- **Customer** — views TV passively; actively uses the kiosk to order and pay.
- **Kitchen Staff** (implied, though not explicitly named as a "role" in the document) — receives KOT orders.
- **System/Application** — automated playback, validation, recovery, duplicate-prevention logic.
- **External systems** — Payment Gateway, Order Management/KOT system.

## Important Data Flowing Between Modules
- Product & pricing master data (Admin → Kiosk display)
- Banner assets & schedule (Admin → TV playback)
- Cart contents & customizations (Kiosk internal, Cart → Checkout)
- Final validated order (Kiosk → KOT system)
- Payment transaction status (Kiosk ↔ Payment Gateway)
- Kiosk ID / TV ID tagging (attached to every order / every playlist assignment)

## External Systems/Integrations
- Payment Gateway (UPI, Card, etc.)
- Order Management / KOT (Kitchen Order Ticket) system
- Receipt Printer (hardware integration)
- Possibly a Customer-facing secondary display (hardware)

---

# Ambiguities / Conflicts in the Document (flagging explicitly, not assuming)

1. **No refund process mentioned.** The document covers "payment succeeds but response lost → verify before duplicate order," but never states what happens if verification finds the customer **was charged but the order can't be fulfilled** (e.g., item went out of stock after payment). A refund/reversal flow is not defined.
2. **"If required" appears repeatedly** (language selection, banner transitions, printer, hardware) — meaning these are business decisions, not confirmed requirements. Each business deploying this system needs to explicitly decide yes/no on these.
3. **No default timeout values given** anywhere (banner display duration defaults, kiosk inactivity timeout, payment timeout) — only that they must be "configurable." Actual numbers need to be decided with the client.
4. **No explicit admin roles/permission levels** — the document only says "Admin," with no mention of sub-roles (e.g., branch manager vs head-office admin vs staff who can only handle cash payments). This may need clarification, especially for multi-branch setups like Spice Junction.
5. **Tax calculation method not specified** — whether displayed prices are tax-inclusive or tax-exclusive isn't stated; this affects how the Cart/Checkout math actually gets implemented.
6. **Relationship between TV Banner content and Kiosk pricing/offers isn't explicitly required to sync** — in my example I assumed the TV's "10% off" banner matches the Kiosk's applied discount, but the document never explicitly states these two modules must share offer/discount data. This should be confirmed with the client — otherwise a TV could advertise something the kiosk doesn't actually apply, which would look bad for the business.
7. **Cash payment flow is vague** — it says "only if the business wants staff-assisted cash payment," but doesn't define how a staff-assisted flow integrates into the kiosk's otherwise fully self-service UI (e.g., does the kiosk print a "Pay at Counter" slip? Who marks it as paid?).