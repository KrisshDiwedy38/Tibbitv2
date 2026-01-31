# Django Models Documentation

## Users App

### CustomUser Model

**`save()`**  
Auto-generates a username from the email prefix if no username is provided before saving.

**`get_full_name()`**  
Returns the user's full name by combining first_name and last_name, safely handling empty values.

**`generate_otp()`**  
Generates a secure 6-digit OTP for email verification. Stores the OTP, records the creation timestamp, resets attempt count, saves changes, and returns the OTP. OTP validity: 10 minutes.

**`is_otp_valid()`**  
Checks whether an OTP exists and is still within the 10-minute validity window.

**`verify_otp(entered_otp)`**  
Verifies the entered OTP with a maximum of 5 attempts. On success, marks the email as verified and clears OTP data. Returns (success: bool, message: str).

---

## Listings App

### Listings Model

**`increment_views()`**  
Increments the listing's view count by 1 using an efficient partial database update.

**`mark_as_sold()`**  
Marks the listing as sold by updating its status to sold.

**`is_active()`**  
Returns True if the listing is currently active and available.

(Category, ListingImage, SavedListing use default Django behavior)

---

## Messaging App

### Conversation Model

**`get_other_user(current_user)`**  
Returns the other participant in the conversation based on whether the current user is the buyer or seller.

**`unread_count(user)`**  
Returns the number of unread messages for a user, excluding messages sent by them.

### Message Model

**`mark_as_read()`**  
Marks a message as read if it hasn't already been marked, using an efficient field-only update.

---

## Transactions App

### Transaction Model

**`generate_otps()`**  
Generates separate 6-digit OTPs for both buyer and seller. Records creation timestamps and returns both OTPs. OTP validity: 24 hours.

**`is_seller_otp_valid()` / `is_buyer_otp_valid()`**  
Checks whether the respective OTP exists and has not expired.

**`verify_seller_otp(entered_otp)` / `verify_buyer_otp(entered_otp)`**  
Verifies the provided OTP and marks the respective party as verified. Automatically triggers transaction completion once both parties are verified.

**`_check_completion()` (Internal)**  
Finalizes the transaction when both buyer and seller are verified: Marks transaction as completed, records completion timestamp, marks the associated listing as sold.

**`cancel(cancelled_by)`**  
Cancels the transaction, records who cancelled it, and stores a timestamped note.

**`is_completed()`**  
Returns True if the transaction has been successfully completed.

(Review model uses default Django methods)

---

## Design Patterns Used

**OTP Verification Pattern**  
Secure OTP generation, expiry validation, and verification logic.

**Status & Lifecycle Management**  
Status fields combined with timestamp tracking for traceability.

**Database Efficiency**  
Targeted updates using update_fields to minimize write overhead.