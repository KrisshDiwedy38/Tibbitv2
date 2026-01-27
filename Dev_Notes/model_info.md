## **What Each Model Does:**

### **Listings App:**

**Category:**
- Organizes listings (Electronics, Books, etc.)
- Can add/remove categories easily

**Listing:**
- Main item being sold
- Tracks: title, price, description, condition, status
- Belongs to seller (User)
- Has category
- Can be marked as sold

**ListingImage:**
- Multiple photos per listing
- Ordered (first image is thumbnail)
- Separate table for scalability

**SavedListing:**
- Users can bookmark/favorite listings
- Many-to-many relationship between User and Listing

---

### **Messaging App:**

**Conversation:**
- Container for messages between buyer and seller
- Links to specific listing
- One conversation per buyer-seller-listing combo
- Tracks when last updated (for sorting inbox)

**Message:**
- Individual chat messages
- Belongs to conversation
- Tracks read/unread status
- Real-time updates via Django Channels later

---

### **Transactions App:**

**Transaction:**
- Records deal initiation
- Generates OTPs for both parties
- Tracks verification status
- Completes when both OTPs verified
- Can be cancelled by either party

**Review:**
- After transaction completes
- Both parties can rate each other
- Builds reputation system
- One review per person per transaction

---

## **Key Relationships:**
```
User (CustomUser)
├── creates → Listings (seller)
├── saves → Listings (saved_listings)
├── participates in → Conversations (as buyer or seller)
├── sends → Messages
└── completes → Transactions (as buyer or seller)

Listing
├── belongs to → Category
├── has many → ListingImages
├── generates → Conversations
└── results in → Transactions

Conversation
├── between → User (buyer) and User (seller)
├── about → Listing
└── contains → Messages

Transaction
├── between → User (buyer) and User (seller)
├── for → Listing
└── generates → Reviews