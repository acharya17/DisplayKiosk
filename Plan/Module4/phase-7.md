# Module 4 — Customer Self-Order Kiosk

## Phase 7 — Order Confirmation & Completion

### 1. Phase Purpose

Phase 7 starts **only after the payment from Phase 6 has been successfully verified**.

The purpose is to:

**Confirm payment → Create/confirm order → Generate order number/token → Show confirmation → Prepare kiosk for next customer**

This phase is the final customer-facing part of the ordering journey.

---

# 2. Core Flow

```text
Phase 6
Verified Payment Success
      ↓
Confirm Transaction
      ↓
Create / Confirm Order
      ↓
Generate Order Number / Token
      ↓
Order Confirmation
      ↓
Show Order Details
      ↓
Completion
      ↓
Session Reset
      ↓
Welcome / Start Order
```

---

# 3. Phase Scope

### Included

* Payment-success validation
* Order creation/confirmation
* Order number
* Token number where applicable
* Order confirmation screen
* Final order summary
* Paid amount
* Basic order status
* Completion action
* Session cleanup
* Kiosk reset
* Return to Welcome

### Not Included

Do not implement:

* Product management
* Combo management
* Cart editing
* Tax configuration
* Discount configuration
* Payment configuration
* Payment processing

Those are already handled in previous phases/Admin.

---

# 4. Payment Success Validation

Do not enter Phase 7 merely because the frontend receives a success response.

The system must verify:

```text id="w6s9q2"
Payment Initiated
      ↓
Payment Provider
      ↓
Backend Verification
      ↓
Payment = SUCCESS
      ↓
Phase 7
```

If payment is not confirmed:

```text id="j7k3m1"
Payment Not Confirmed
      ↓
Remain in Payment Flow
```

---

# 5. Order Creation

After verified payment:

```text id="f5r2n8"
Verified Payment
      ↓
Create Order
      ↓
Save Order Details
      ↓
Attach Payment Reference
      ↓
Generate Order Number
      ↓
Order Confirmed
```

The order should contain the final validated information from the checkout.

---

# 6. Order Information

The confirmed order should retain:

* Order ID
* Order number
* Kiosk ID/reference
* Products
* Combos
* Variants
* Add-ons/modifiers
* Quantities
* Subtotal
* Discount
* Tax
* Final amount
* Payment status
* Payment reference
* Order status
* Created date/time

Do not expose all technical information to the customer.

---

# 7. Order Number / Token

Generate a clear customer-facing order identifier.

Example:

```text id="c4q8x2"
Order Confirmed ✓

Order #125
```

If the business uses a token system:

```text id="u7m3p1"
Your Token

A125
```

Use the project's configured terminology consistently.

---

# 8. Confirmation Screen

The main screen should be simple and clear.

```text id="s7v2m9"
┌─────────────────────────────────────────────┐
│                                             │
│                    ✓                        │
│                                             │
│             Order Confirmed                 │
│                                             │
│                Order #125                   │
│                                             │
│             Amount Paid                     │
│               ₹845.90                       │
│                                             │
│       Your order has been placed.           │
│                                             │
│              [ Done ]                        │
│                                             │
└─────────────────────────────────────────────┘
```

Do not overload this screen.

---

# 9. Final Order Summary

If the requirement requires the customer to review the completed order, show a compact summary.

```text id="9r3c6x"
Order #125

Chicken Burger ×2        ₹500
Chicken Meal ×1          ₹319

Subtotal                 ₹819
Discount                 -₹50
Tax                      ₹76.90
-----------------------------
Paid Amount              ₹845.90
```

Keep the focus on confirmation.

---

# 10. Payment Status

The confirmation screen should clearly indicate:

```text id="m4x8q2"
Payment
✓ Successful
```

Do not show:

* Raw gateway response
* Internal transaction IDs
* API status
* Technical logs

The payment reference can remain available in the backend/admin monitoring.

---

# 11. Order Status

The order should be created with the appropriate initial status defined by the business.

For example:

```text id="g8p3n1"
Order Confirmed
```

If the system uses a different status such as:

```text id="x5k7v4"
Paid
```

or

```text id="a9r2m6"
Received
```

use the project's defined terminology.

Do not invent additional statuses.

---

# 12. Order Confirmation Failure

If payment succeeds but order creation fails:

**Do not ask the customer to pay again.**

Flow:

```text id="j4w8s2"
Payment SUCCESS
      ↓
Order Creation Failed
      ↓
Verify Existing Payment
      ↓
Retry Order Creation
      ↓
Order Confirmed
```

The backend must ensure the successful payment is not lost or charged again.

This is a critical failure case.

---

# 13. Duplicate Order Prevention

The same successful payment must not create multiple orders.

Example:

```text id="z6m2k8"
Payment Reference
      ↓
Check Existing Order
      ↓
Already Linked?
      ↓
YES → Use Existing Order
      ↓
NO → Create Order
```

This prevents:

* Duplicate orders
* Duplicate payment records
* Duplicate customer charges

---

# 14. Done Action

After confirmation:

```text id="u5k7q3"
[ Done ]
      ↓
Complete Session
      ↓
Reset Kiosk
      ↓
Welcome
```

If automatic reset is part of the kiosk requirement, the confirmation screen can remain visible for a short configured period before resetting.

Do not leave completed customer information on the kiosk indefinitely.

---

# 15. Session Reset

After the order is completed:

```text id="e8p4n2"
Order Completed
      ↓
Clear Cart
      ↓
Clear Product Selections
      ↓
Clear Combo Selections
      ↓
Clear Temporary Checkout Data
      ↓
Clear Payment Session Data
      ↓
Reset Kiosk
```

Do **not** delete the actual order or payment record.

---

# 16. Next Customer Protection

After reset:

```text id="r2v6x9"
Customer A
   ↓
Order #125
   ↓
Reset
   ↓
Customer B
   ↓
Empty New Session
```

Customer B must never see:

* Customer A's cart
* Customer A's order
* Customer A's payment information
* Customer A's selections

---

# 17. Order Persistence

The completed order must remain stored in the backend for Admin monitoring.

```text id="p7n3m5"
Customer Kiosk
      ↓
Order #125
      ↓
Backend
      ↓
Admin Order Monitoring
```

Resetting the kiosk must only reset the **customer session**, not the order.

---

# 18. Admin Synchronisation

After order confirmation:

```text id="q5w8z1"
Kiosk
 ↓
Order Created
 ↓
Backend
 ↓
Admin Order List
 ↓
Order Monitoring
```

Admin should be able to see the completed order through Module 2.

---

# 19. Payment & Order Relationship

The relationship should be:

```text id="n4x7c2"
Order
   ↓
Payment Attempt
   ↓
Verified Payment
   ↓
Payment SUCCESS
   ↓
Order Confirmed
```

The final order should be linked to the successful payment reference.

---

# 20. Order Confirmation UI/UX

The confirmation screen should be:

* Clean
* Minimal
* High contrast
* Easy to understand
* Touch-friendly
* Compact

Avoid:

* Unnecessary navigation
* Product browsing
* Admin information
* Technical information
* Complex buttons

The customer should immediately understand:

**“My order is successfully placed.”**

---

# 21. Completion Flow

Recommended:

```text id="w9m2k5"
✓ Payment Successful
      ↓
✓ Order Confirmed
      ↓
Order #125
      ↓
[ Done ]
      ↓
Reset Kiosk
      ↓
Welcome
```

---

# 22. Error Handling

### Payment Success / Order Pending

```text id="k6p2x8"
Payment received.

Confirming your order...
```

Do not ask the customer to pay again.

### Order Creation Failure

```text id="m8q3v5"
Your payment was received.
We are confirming your order.

Please wait...
```

The system should resolve the order in the backend.

The customer should not be charged again.

---

# 23. Session Timeout

If the confirmation page remains idle:

```text id="x7n4c9"
Order Confirmed
      ↓
Configured Timeout
      ↓
Session Reset
      ↓
Welcome
```

The timeout should apply only after the order has been safely confirmed.

---

# 24. Phase 7 Data Flow

```text id="b3w8m6"
PHASE 6
Payment SUCCESS
      ↓
Verify Payment
      ↓
Check Duplicate Order
      ↓
Create / Confirm Order
      ↓
Generate Order Number
      ↓
Save Order + Payment Reference
      ↓
Show Confirmation
      ↓
Customer Selects Done
      ↓
Clear Customer Session
      ↓
Reset Kiosk
      ↓
WELCOME
```

---

# 25. Phase 7 Acceptance Criteria

### Payment

* Only verified successful payments reach Phase 7.
* Payment reference is linked to the order.
* No duplicate payment is created.

### Order

* Order is created successfully.
* Correct products are stored.
* Correct combos are stored.
* Variants and add-ons are retained.
* Quantities are correct.
* Subtotal is correct.
* Discount is correct.
* Tax is correct.
* Final paid amount is correct.
* Order number/token is generated.

### Confirmation

* Customer sees clear success state.
* Order number/token is displayed.
* Paid amount is displayed.
* No technical information is exposed.

### Recovery

* Payment success + order creation failure is handled safely.
* Duplicate order creation is prevented.
* Customer is not asked to pay again unnecessarily.

### Session

* Cart is cleared after completion.
* Temporary selections are cleared.
* Payment session data is cleared.
* Completed order remains stored.
* Next customer starts with a clean session.

### Admin

* Confirmed order is available for Admin monitoring.
* Payment status is available for Admin monitoring.

---

# 26. Phase 7 Implementation Rules

1. Enter Phase 7 only after verified payment success.
2. Never trust frontend payment success alone.
3. Verify the payment through the backend/provider.
4. Check whether the payment is already linked to an order.
5. Prevent duplicate order creation.
6. Create the order using the validated checkout data.
7. Link the successful payment to the order.
8. Generate the configured order number/token.
9. Preserve the exact final amount from Phase 5.
10. Do not recalculate pricing unnecessarily after successful payment.
11. If order creation fails after payment, retry safely without creating another payment.
12. Never ask the customer to pay again until the original payment status is confirmed.
13. Show a simple confirmation screen.
14. Do not expose technical payment/order information.
15. Keep the confirmation UI compact.
16. Clear the customer session only after order confirmation is safely completed.
17. Do not delete the completed order during session reset.
18. Sync the completed order to Admin monitoring.
19. Ensure the next customer receives a completely clean session.
20. After completion, return the kiosk to the Welcome screen.

---

# 27. Final Phase 7 Flow

```text id="n2f7x4"
PAYMENT SUCCESS
      ↓
VERIFY PAYMENT
      ↓
CHECK DUPLICATE ORDER
      ↓
CREATE / CONFIRM ORDER
      ↓
GENERATE ORDER #
      ↓
SAVE ORDER + PAYMENT
      ↓
┌────────────────────────────┐
│                            │
│       ✓ ORDER CONFIRMED    │
│                            │
│         Order #125         │
│                            │
│        Paid ₹845.90        │
│                            │
│          [ Done ]          │
│                            │
└──────────────┬─────────────┘
               ↓
        RESET SESSION
               ↓
            WELCOME
```

### Phase 7 Goal

**Verified Payment → Confirm Order → Generate Order Number → Show Success → Safely Reset the Customer Session → Return the kiosk to a clean Welcome state.**
