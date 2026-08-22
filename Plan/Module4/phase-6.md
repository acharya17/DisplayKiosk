# Module 4 — Customer Self-Order Kiosk

## Phase 6 — Online Payment

### 1. Phase Purpose

Phase 6 handles the **online payment process** after the customer has reviewed and confirmed the final amount from Phase 5.

The kiosk should use the **payment methods configured in the Admin module** and must ensure that the payment amount exactly matches the validated final order amount.

### Core Flow

```text
Phase 5
Confirmed Final Amount
      ↓
Create Payment Session
      ↓
Display Available Online Payment
      ↓
Customer Initiates Payment
      ↓
QR / Payment Interface
      ↓
Payment Processing
      ↓
Verify Payment
      ↓
┌───────────────┴───────────────┐
↓                               ↓
SUCCESS                         FAILED
↓                               ↓
Phase 7                         Retry / Back
Order Confirmation
```

---

# 2. Phase Scope

### Included

* Payment session creation
* Configured online payment methods
* QR payment
* Payment initiation
* Payment processing state
* Payment verification
* Payment success
* Payment failure
* Payment timeout
* Retry payment
* Payment cancellation
* Duplicate-payment prevention
* Payment amount validation
* Payment status handling

### Not Included

Do not implement:

* New login
* Product management
* Cart management
* Tax configuration
* Discount configuration
* Payment method configuration
* Manual/cash payment
* Final order monitoring

Payment configuration is handled by Admin.

---

# 3. Payment Dependency

```text
Admin
  ↓
Payment Configuration
  ↓
Enabled Online Methods
  ↓
Customer Kiosk
  ↓
Phase 5 Final Amount
  ↓
Phase 6 Payment
```

The kiosk should **consume the configured payment methods**.

Do not hardcode payment methods in the frontend.

---

# 4. Payment Entry

After Phase 5:

```text
Final Amount
₹845.90

[ Pay ₹845.90 ]
```

When the customer selects Pay:

```text
id="p8n4z1"
Pay
 ↓
Validate Final Amount
 ↓
Create Payment Session
 ↓
Payment Screen
```

The payment session should be created using the exact validated amount.

---

# 5. Available Payment Methods

Only show methods enabled in Admin.

Example:

```text
Complete Payment

Amount
₹845.90

[ UPI / QR ]
```

If multiple online methods are configured:

```text
Choose Payment Method

[ UPI ]
[ QR Code ]
[ Other Enabled Method ]
```

Do not show disabled or unavailable methods.

---

# 6. QR Payment

For QR-based payment:

```text
id="7f3k9q"
Complete Payment

₹845.90

       ┌───────────┐
       │           │
       │ QR CODE   │
       │           │
       └───────────┘

Scan using your UPI app
```

The QR should represent the **current payment session and exact amount**.

Do not generate a static QR that can cause incorrect payment tracking.

---

# 7. Payment Instructions

Keep instructions short.

Example:

> Scan the QR code using your UPI app and complete the payment.

Avoid technical information such as:

* Transaction API
* Payment gateway ID
* Request ID
* Internal payment status
* Backend errors

---

# 8. Payment Processing

After payment initiation:

```text
Payment Processing

Please wait...
```

The system should continuously verify the payment status according to the configured payment integration.

Do not immediately assume that payment is successful just because the customer initiated the payment.

---

# 9. Payment Status

The payment should have clear internal states such as:

```text
INITIATED
   ↓
PENDING
   ↓
SUCCESS
```

or:

```text
INITIATED
   ↓
PENDING
   ↓
FAILED / EXPIRED / CANCELLED
```

The customer-facing UI should remain simple.

---

# 10. Successful Payment

When payment is verified successfully:

```text
Payment Successful ✓

₹845.90 Paid
```

Then:

```text
Payment Success
      ↓
Confirmed Transaction
      ↓
Phase 7
Order Confirmation
```

Do not create duplicate payment requests after success.

---

# 11. Payment Failure

If payment fails:

```text
Payment Failed

Your payment could not be completed.

[Try Again]
[Back to Order]
```

The customer can:

* Retry payment
* Return to the order review/payment flow

Do not automatically mark the order as paid.

---

# 12. Payment Pending

If the payment is still being verified:

```text
Payment Processing

Please wait while we confirm your payment.
```

Continue verification according to the payment integration.

Do not allow the customer to create another payment session unnecessarily.

---

# 13. Payment Timeout

If the payment session expires:

```text
Payment Session Expired

Please start the payment again.

[Try Again]
[Back to Order]
```

A new payment session should be created for the retry.

Do not reuse an expired payment session.

---

# 14. Payment Cancellation

If the customer cancels payment:

```text
Payment Cancelled

Your order has not been paid.

[Return to Order]
[Try Payment Again]
```

The cart should remain available.

Do not clear the customer's order just because payment was cancelled.

---

# 15. Duplicate Payment Prevention

This is critical.

Once payment is initiated:

```text
Pay
 ↓
Payment Session Created
 ↓
Disable Pay CTA
 ↓
Wait for Result
```

Prevent:

* Multiple clicks
* Multiple payment sessions
* Duplicate QR generation
* Duplicate payment requests
* Duplicate order creation

---

# 16. Payment Amount Validation

The payment amount must match the Phase 5 validated amount.

Example:

```text
Phase 5
Final Amount = ₹845.90
        ↓
Payment Session
Amount = ₹845.90
        ↓
Payment Gateway
Amount = ₹845.90
```

If the amounts do not match:

```text
Payment cannot be started.

Please review your order.
```

Do not proceed with an inconsistent amount.

---

# 17. Payment Verification

Payment success must be confirmed through the configured payment provider/backend.

```text
Customer Pays
      ↓
Payment Provider
      ↓
Payment Status
      ↓
Backend Verification
      ↓
SUCCESS
      ↓
Phase 7
```

Do not trust only frontend callbacks or customer actions.

---

# 18. Payment Success But UI Not Updated

If payment succeeds but the kiosk does not immediately receive the result:

```text
Payment Completed
      ↓
Continue Verification
      ↓
Backend Confirms SUCCESS
      ↓
Show Success
```

Do not ask the customer to pay again before confirming the original transaction status.

This is important for preventing duplicate charges.

---

# 19. Network Failure During Payment

If network connectivity is temporarily lost:

```text
Payment In Progress
      ↓
Connection Problem
      ↓
Continue / Verify Payment Status
      ↓
Backend Result
```

Do not immediately mark the payment as failed.

The payment status must be verified before allowing another payment attempt.

---

# 20. Payment Retry

If the payment is definitively failed:

```text
Payment Failed
      ↓
[Try Again]
      ↓
Create New Payment Session
      ↓
New QR / Payment Interface
      ↓
Process Payment
```

Do not reuse the failed payment session.

---

# 21. Back to Order

If the customer returns to the order:

```text
Payment
 ↓ Back
Order Summary
 ↓
Cart
```

The cart should remain intact.

If the customer changes the cart:

```text
Cart Changed
 ↓
Recalculate
 ↓
Phase 5
 ↓
New Final Amount
 ↓
New Payment Session
```

Never continue with an old payment session after the payable amount changes.

---

# 22. Payment Method Unavailable

If an Admin-configured payment method becomes unavailable:

```text
UPI
Currently unavailable
```

Do not allow the customer to initiate payment through it.

If another enabled online method exists, show that method.

---

# 23. No Payment Method Available

If no online payment method is available:

```text
Online payment is currently unavailable.

Please try again later.
```

Do not display a broken or empty payment page.

---

# 24. Payment Screen UI

Recommended compact layout:

```text
┌─────────────────────────────────────────────┐
│ ← Back              Complete Payment        │
├─────────────────────────────────────────────┤
│                                             │
│              Amount to Pay                  │
│                 ₹845.90                     │
│                                             │
│              ┌───────────┐                  │
│              │           │                  │
│              │ QR CODE   │                  │
│              │           │                  │
│              └───────────┘                  │
│                                             │
│        Scan using your UPI app              │
│                                             │
│          Waiting for payment...             │
│                                             │
│              [ Cancel ]                     │
└─────────────────────────────────────────────┘
```

Keep the payment page:

* Simple
* Focused
* Large enough for touch
* Free of unnecessary information

---

# 25. Payment Success UI

```text
┌─────────────────────────────────────────────┐
│                                             │
│                    ✓                        │
│                                             │
│          Payment Successful                 │
│                                             │
│              ₹845.90 Paid                   │
│                                             │
│        Preparing your order...              │
│                                             │
└─────────────────────────────────────────────┘
```

Then automatically move to Phase 7.

---

# 26. Payment Failure UI

```text
┌─────────────────────────────────────────────┐
│                                             │
│          Payment Failed                     │
│                                             │
│     Your payment was not completed.         │
│                                             │
│       [ Try Again ]                         │
│       [ Back to Order ]                     │
│                                             │
└─────────────────────────────────────────────┘
```

Keep the message customer-friendly.

---

# 27. Payment Security

The kiosk should not store sensitive payment information.

Do not store/display:

* UPI credentials
* Bank credentials
* Card PIN
* OTP
* Sensitive payment authentication data

Use the configured payment provider's secure payment flow.

---

# 28. Payment Session Relationship

Each payment attempt should have a unique payment session/reference.

Conceptually:

```text
Order/Checkout
      ↓
Payment Attempt 1
      ↓
Failed
      ↓
Payment Attempt 2
      ↓
Success
```

The system should maintain the correct final successful payment reference.

---

# 29. Order Creation Boundary

Payment and order creation must be clearly separated.

Recommended:

```text
Phase 5
Final Amount
      ↓
Phase 6
Payment
      ↓
Payment Verified SUCCESS
      ↓
Phase 7
Order Confirmation / Final Order
```

Do not treat:

```text
QR Generated
```

as:

```text
Order Paid
```

---

# 30. Phase 6 Data Flow

```text
PHASE 5
Confirmed Final Amount
      ↓
Validate Amount
      ↓
Create Payment Session
      ↓
Load Enabled Online Method
      ↓
Display QR / Payment Interface
      ↓
Customer Pays
      ↓
Payment Verification
      ↓
┌─────────────────────┐
│                     │
SUCCESS            FAILED
│                     │
↓                     ↓
PHASE 7          Retry / Back
```

---

# 31. Phase 6 Acceptance Criteria

### Payment

* Payment starts with the exact Phase 5 amount.
* Only configured online payment methods are shown.
* QR payment works where configured.
* Payment session is created correctly.
* Payment status is verified.
* Successful payment is confirmed by backend/provider.

### Failure Handling

* Failed payment can be retried.
* Expired payment can be restarted.
* Cancelled payment returns safely.
* Pending payment is handled correctly.
* Network failure does not incorrectly create a second payment.
* Payment success is not duplicated.

### Security

* Sensitive payment data is not stored by the kiosk.
* Payment is handled through the approved provider.
* Payment amount cannot be manipulated from the frontend.

### Navigation

* Back to order works.
* Cart remains available after payment failure/cancellation.
* Changed cart creates a new pricing/payment flow.
* Successful payment moves to Phase 7.

### UI/UX

* Compact payment screen.
* Clear amount.
* Clear QR/payment method.
* Clear status.
* No unnecessary information.
* No excessive whitespace.
* Touch-friendly controls.

---

# 32. Phase 6 Implementation Rules

1. Start only after Phase 5 confirms the final amount.
2. Revalidate the payable amount before creating payment.
3. Use only Admin-enabled online payment methods.
4. Do not hardcode payment methods.
5. Create a unique payment session for each payment attempt.
6. Prevent duplicate payment initiation.
7. Disable repeated Pay actions while processing.
8. Verify payment through the backend/provider.
9. Never trust only frontend payment success.
10. Do not create a successful order before payment is confirmed.
11. Handle pending payments safely.
12. Handle failed payments safely.
13. Handle expired payment sessions.
14. Handle cancelled payments.
15. Handle network interruptions during payment.
16. Do not ask the customer to pay again until the previous payment status is known.
17. If the cart changes, return through Phase 5 and recalculate.
18. Do not reuse an expired/failed payment session.
19. Do not store sensitive payment credentials.
20. Keep the payment UI simple and kiosk-friendly.
21. On verified success, continue to Phase 7.
22. On definitive failure, allow retry or return to order.

---

# 33. Final Phase 6 Flow

```text
PHASE 5
Final Amount
    ↓
₹845.90
    ↓
Validate Amount
    ↓
Create Payment Session
    ↓
Online Payment
    ↓
QR / Configured Method
    ↓
Customer Pays
    ↓
Verify Payment
    ↓
       ┌───────────────┐
       │               │
    SUCCESS         FAILED
       │               │
       ↓               ↓
   PHASE 7        Try Again
Order Confirmation   OR
                    Back
```

### Phase 6 Goal

**Take the exact validated amount from Phase 5 → create a secure online payment session → process and verify the payment → prevent duplicate charges → send only verified successful payments to Phase 7 for order confirmation.**
