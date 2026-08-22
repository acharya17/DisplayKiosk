# Module 4 — Customer Self-Order Kiosk

## Phase 8 — Session Reset & Kiosk Ready State

### 1. Phase Purpose

Phase 8 is the **final operational phase** of the customer ordering flow.

After the order is successfully confirmed in Phase 7, the kiosk must safely clear the completed customer's temporary session data and return to a **clean, ready-to-use state for the next customer**.

The key principle is:

> **Clear the customer session, not the completed order.**

---

# 2. Core Flow

```text
Phase 7
Order Confirmed
      ↓
Show Order / Token
      ↓
Customer Completes
      ↓
Clear Customer Session
      ↓
Clear Cart
      ↓
Clear Temporary Selections
      ↓
Clear Payment Session
      ↓
Reset Kiosk State
      ↓
Return to Welcome
      ↓
Ready for Next Customer
```

---

# 3. Phase Scope

### Included

* Customer session cleanup
* Cart cleanup
* Product selection cleanup
* Combo selection cleanup
* Temporary checkout data cleanup
* Payment-session cleanup
* Temporary UI state reset
* Kiosk state reset
* Return to Welcome
* Next-customer readiness
* Session timeout/reset handling

### Not Included

Do not:

* Delete completed orders
* Delete payment transactions
* Modify product configuration
* Modify kiosk configuration
* Modify tax/discount configuration
* Logout the kiosk from its existing authentication
* Create a new login flow

---

# 4. Important Login Rule

The kiosk's **existing authentication/session must remain active**.

```text id="4d7j2n"
Existing Kiosk Login
        ↓
Customer Session
        ↓
Order
        ↓
Reset Customer Session
        ↓
Welcome
```

Do **not** do:

```text id="x8m2q4"
Order Complete
      ↓
Kiosk Logout
      ↓
Login Screen
```

The kiosk should stay authenticated and ready for the next customer.

---

# 5. What Should Be Cleared?

After successful order completion, clear temporary customer data:

### Clear

* Cart
* Product selections
* Variant selections
* Add-on selections
* Combo selections
* Temporary checkout state
* Temporary pricing state
* Payment-session state
* Temporary customer information, if collected
* Current order draft

### Keep

* Completed Order
* Order Number
* Payment Transaction
* Payment Reference
* Kiosk Configuration
* Product Configuration
* Category Configuration
* Tax Configuration
* Discount Configuration
* Existing Kiosk Login

---

# 6. Reset Flow

```text id="7v3k9p"
Order Confirmed
      ↓
Mark Customer Session Complete
      ↓
Clear Cart
      ↓
Clear Selections
      ↓
Clear Payment Session
      ↓
Reset UI
      ↓
Load Welcome State
```

The reset should happen reliably even if the customer does not manually interact with the kiosk after completion.

---

# 7. Welcome State

After reset, return to the existing Welcome/Start Order screen from Phase 1.

```text id="q2f6m8"
┌─────────────────────────────────────┐
│                                     │
│          SPICE JUNCTION             │
│                                     │
│             Welcome                 │
│                                     │
│        [ Start Order ]              │
│                                     │
└─────────────────────────────────────┘
```

No previous order information should remain visible.

---

# 8. Automatic Reset

The kiosk can automatically reset after a configured completion period.

Example:

```text id="z6m3w8"
Order Confirmed
      ↓
Show Confirmation
      ↓
Configured Delay
      ↓
Reset Session
      ↓
Welcome
```

The delay should come from the kiosk/session settings if such a setting exists in Admin.

Do not hardcode unnecessary timing values.

---

# 9. Manual Done Action

If the confirmation page contains:

```text id="s8q2m5"
[ Done ]
```

then:

```text id="c7n4x1"
Done
 ↓
Reset Session
 ↓
Welcome
```

The button should not delete the order.

---

# 10. Previous Customer Data Protection

This is one of the most important Phase 8 requirements.

Example:

```text id="m5w8q3"
Customer A
 ↓
Cart A
 ↓
Payment
 ↓
Order #125
 ↓
Reset
 ↓
Customer B
```

Customer B must start with:

```text id="b9x2k6"
Cart = Empty
Selections = Empty
Checkout = Empty
Payment Session = New
```

Customer B must never see Customer A's information.

---

# 11. Payment Session Reset

After successful payment/order confirmation:

```text id="j7q4n2"
Payment Session
      ↓
Completed
      ↓
Remove from Active Customer Session
```

Do not allow the old payment session to be reused by the next customer.

The completed payment record remains in the backend.

---

# 12. Cart Reset

Before returning to Welcome:

```text id="h3p8w6"
Cart
 ↓
Remove all temporary cart items
 ↓
Cart Count = 0
```

The next customer should see:

```text id="r5m2x7"
Cart (0)
```

---

# 13. Product & Combo Selection Reset

Clear all temporary configuration:

```text id="n6v3k9"
Variant Selection
      ↓
Clear

Add-on Selection
      ↓
Clear

Combo Selection
      ↓
Clear
```

This prevents selections from Customer A appearing for Customer B.

---

# 14. UI State Reset

Reset:

* Current category
* Search text
* Selected product
* Selected combo
* Product details
* Quantity controls
* Modal/dialog state
* Error messages
* Loading states
* Cart state
* Payment state

The kiosk should return to a clean initial state.

---

# 15. Search Reset

If the previous customer searched:

```text id="p4m7x2"
Search:
"Chicken"
```

after reset:

```text id="x6q3n8"
Search:
Empty
```

The next customer should not inherit the previous search.

---

# 16. Category Reset

If the previous customer was browsing:

```text id="w2k8m5"
Category:
Desserts
```

after reset:

```text id="v7n4q1"
Welcome
```

When the next customer starts, the normal default category/menu state should be used.

---

# 17. Session Timeout / Abandoned Order

Phase 8 should also support cleanup when a customer abandons the kiosk.

Example:

```text id="m8q3z6"
Customer Starts Order
      ↓
Inactive
      ↓
Configured Session Timeout
      ↓
Warning
      ↓
No Interaction
      ↓
Clear Temporary Session
      ↓
Welcome
```

The exact timeout should follow the existing kiosk inactivity/session configuration.

---

# 18. Warning Before Reset

If the customer has an active cart and the kiosk is about to reset because of inactivity:

```text id="q5x8m2"
Your session is about to expire.

Your current order will be cleared.

[Continue Ordering]
[Start Over]
```

Use this only for **inactivity/session timeout**, not for normal successful order completion.

---

# 19. Successful Order vs Abandoned Session

These two flows must remain separate.

### Successful Order

```text id="g8n4y2"
Payment Success
 ↓
Order Confirmed
 ↓
Clear Session
 ↓
Welcome
```

### Abandoned Session

```text id="z3m7q5"
Customer Inactive
 ↓
Session Timeout
 ↓
Clear Temporary Data
 ↓
Welcome
```

In both cases, only temporary session data is cleared.

---

# 20. Reset Failure Handling

If the frontend reset process fails partially, the application should still attempt to restore a clean state.

Example:

```text id="v4q8m1"
Reset
 ↓
Clear Local Session
 ↓
Reload Initial Kiosk State
 ↓
Welcome
```

The completed order must remain safe in the backend.

---

# 21. Kiosk Configuration Must Remain

Do not reset the kiosk's permanent configuration.

Keep:

* Kiosk ID
* Kiosk settings
* Enabled categories
* Enabled products
* Payment configuration
* Tax/discount configuration
* Existing authentication
* Hardware/configuration state

Only the **customer transaction session** is reset.

---

# 22. Admin Synchronisation

The completed order should already be available to Admin.

```text id="y6p2k9"
Customer Kiosk
      ↓
Confirmed Order
      ↓
Backend
      ↓
Admin
      ↓
Order Monitoring
```

Phase 8 must not remove this record.

---

# 23. Kiosk Ready State

After reset:

```text id="n7x4m2"
Kiosk Authenticated
        ↓
Configuration Available
        ↓
Customer Session Empty
        ↓
Welcome Screen
        ↓
Ready for Next Customer
```

This should be the normal idle state.

---

# 24. Recommended Flow

```text id="k4m8x2"
┌─────────────────────────┐
│    ORDER CONFIRMED      │
│                         │
│       Order #125        │
│       ₹845.90 Paid      │
│                         │
│        [ Done ]         │
└────────────┬────────────┘
             ↓
      CLEAR SESSION
             ↓
   ┌──────────────────┐
   │ Cart             │ → Clear
   │ Product Selection│ → Clear
   │ Combo Selection  │ → Clear
   │ Payment Session  │ → Clear
   │ Checkout State   │ → Clear
   └─────────┬────────┘
             ↓
       RESET UI STATE
             ↓
          WELCOME
             ↓
      NEXT CUSTOMER
```

---

# 25. Phase 8 Acceptance Criteria

### Session

* Customer session is cleared after completion.
* Existing kiosk authentication remains active.
* No new login is required.
* Next customer starts with a clean session.

### Cart

* Cart is empty after reset.
* Previous products are removed from temporary state.
* Cart count resets.

### Selections

* Variants are cleared.
* Add-ons are cleared.
* Combo selections are cleared.
* Quantity state is cleared.

### Payment

* Previous payment session cannot be reused.
* Completed payment remains stored.
* Payment transaction is not deleted.

### Order

* Completed order remains stored.
* Order number remains valid.
* Admin can still monitor the order.

### UI

* Welcome screen is restored.
* Search is cleared.
* Category state is reset.
* Error/loading states are cleared.
* No previous customer information remains.

### Inactivity

* Configured inactivity timeout is respected.
* Warning is shown before clearing an active session where required.
* Abandoned sessions are safely cleared.

---

# 26. Phase 8 Implementation Rules

1. Do not create another login.
2. Keep the existing kiosk authentication active.
3. Clear only temporary customer session data.
4. Never delete completed orders.
5. Never delete payment transactions.
6. Clear the cart after successful completion.
7. Clear all product selections.
8. Clear all combo selections.
9. Clear temporary checkout information.
10. Clear the completed payment session from the active kiosk session.
11. Reset search and category state.
12. Reset UI state.
13. Return to the existing Welcome screen.
14. Ensure the next customer receives a clean session.
15. Respect configured inactivity/session timeout settings.
16. Warn the customer before clearing an active abandoned session where required.
17. Do not reset permanent kiosk configuration.
18. Do not reset kiosk authentication.
19. Do not create duplicate orders during reset.
20. Keep completed order/payment records available to Admin.
21. Make the reset reliable even after application refresh/restart.
22. Keep the transition from completed order → Welcome simple and fast.

---

# 27. Final Phase 8 Flow

```text id="q8m4z1"
PHASE 7
ORDER CONFIRMED
      ↓
SHOW ORDER # / TOKEN
      ↓
CUSTOMER COMPLETES
      ↓
CLEAR CUSTOMER SESSION
      ↓
CLEAR CART
      ↓
CLEAR SELECTIONS
      ↓
CLEAR PAYMENT SESSION
      ↓
RESET UI
      ↓
WELCOME
      ↓
READY FOR NEXT CUSTOMER
```

### Phase 8 Goal

**Safely close the completed customer session, preserve the order/payment records, reset all temporary kiosk data, and return the kiosk to a clean Welcome state without requiring another login.**
