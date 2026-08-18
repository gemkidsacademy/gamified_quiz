# Parent Homework Support Booking Flow - CLIENT MOCKUP

## Overview

This is a **CLIENT-FACING PROTOTYPE** for the parent Homework Support booking flow. It demonstrates exactly what a parent will see after receiving the Monday Homework Support email with a booking link.

**Status:** Frontend mockup using **MOCK DATA ONLY** - No backend APIs implemented.

---

## Complete Parent Flow

The parent journey follows this sequence:

```
Email link
    ↓
Email verification (mock validation)
    ↓
Student confirmation (Yes/No attendance)
    ↓
    ├─→ If YES: Choose Saturday time slot
    │       ↓
    │   Slot selection
    │       ↓
    │   Booking confirmation
    │       ↓
    └─→ If NO: Not attending confirmation
            ↓
        Response recorded
            ↓
            ├─→ Back to email verification (start new booking)
            └─→ Edit existing booking (40% chance of existing booking in demo)
                    ↓
                Change time OR change to not attending
```

---

## Implementation Details

### File Location
- **Component:** `/src/components/HomeworkSupport/ParentHomeworkSupportBooking.js`
- **Route:** `http://localhost:3000/parent-homework-support`
- **Styles:** Uses existing `/src/components/HomeworkSupport/homeworkSupport.css`

### Component Features

#### Screen 1: Email Verification
- **Title:** Homework Support
- **Shows:** 
  - Week number (5)
  - Session date (Saturday, September 12, 2026)
  - Student name (Ali Khan)
- **Input:** Parent email field
- **Validation:** Mock validation against `parent@example.com`
- **Error Message:** "The email address does not match our records..."
- **Next Step:** Checks for existing booking (40% chance) or proceeds to attendance choice

#### Screen 2: Student/Attendance Confirmation
- **Shows:** Student name and date again
- **Question:** "Will [Student] be attending Homework Support?"
- **Choices:** 
  - [ Yes, my child will attend ]
  - [ No, my child will not attend ]
- **Behavior:** No automatic time slot display - must choose Yes/No first

#### Screen 3A: No Attendance
- **Message:** "Thank you for letting us know."
- **Confirmation:** Shows that [Student] will not attend
- **Action:** "Submit Response" button
- **Result:** Response is recorded and displayed

#### Screen 3B: Time Slot Selection (if Yes)
- **Prompt:** "Please select a Homework Support time."
- **Slots Shown:**
  - 10:00 AM – 12:00 PM (6 places available)
  - 12:00 PM – 2:00 PM (FULL - disabled)
  - 2:00 PM – 4:00 PM (7 places available)
- **FULL Slot Behavior:** Visually distinct, disabled, cannot be clicked
- **Confirmation:** "Confirm Booking" button (disabled until slot selected)
- **Back Button:** Returns to attendance choice

#### Screen 4: Booking Confirmation
- **Success Messages:**
  - "Booking Confirmed"
  - Shows student name
  - Shows date: "Saturday, September 12, 2026"
  - Shows time: (the selected slot)
  - Shows status: "Confirmed"
  - "A confirmation email will be sent..."
- **Next Action:** "Start Over" button (resets for demo)

#### Screen 5: Edit Existing Booking
- **Trigger:** When parent logs in with email (40% chance in demo)
- **Shows:** Current response and current time slot
- **Options:**
  - [ Change Time Slot ] → Shows slot selection again
  - [ Change to Not Attending ] → Confirmation prompt
- **Change to Not Attending Confirmation:**
  - Asks to confirm before changing
  - Shows current slot will be cancelled
  - Yes/No buttons
- **After Change:** Updated confirmation displayed

---

## Mock Data

All data is hardcoded in the component:

```javascript
MOCK_DATA = {
  registeredEmail: "parent@example.com",
  
  student: {
    name: "Ali Khan",
    studentId: "SK-2025-001",
  },
  
  session: {
    week: 5,
    date: "Saturday, September 12, 2026",
    dateObject: new Date(2026, 8, 12),
  },
  
  timeSlots: [
    {
      id: "slot-1",
      time: "10:00 AM – 12:00 PM",
      capacity: 20,
      booked: 14,
      available: 6,
    },
    {
      id: "slot-2",
      time: "12:00 PM – 2:00 PM",
      capacity: 20,
      booked: 20,
      available: 0,  // FULL
    },
    {
      id: "slot-3",
      time: "2:00 PM – 4:00 PM",
      capacity: 15,
      booked: 8,
      available: 7,
    },
  ],
}
```

---

## Testing the Prototype

### Access the Mockup
```
http://localhost:3000/parent-homework-support
```

### Testing Credentials
- **Valid Email:** `parent@example.com`
- **Invalid Email:** Anything else (will show error)

### Testing Flows

**Flow 1: New Booking (No Attending)**
1. Enter: `parent@example.com`
2. Choose: "No, my child will not attend"
3. Submit: Response
4. Result: "Response Recorded" confirmation

**Flow 2: New Booking (With Time Slot)**
1. Enter: `parent@example.com`
2. Choose: "Yes, my child will attend"
3. Select: Any available time slot (try clicking FULL slot - should be disabled)
4. Confirm: Booking
5. Result: "Booking Confirmed" with all details

**Flow 3: Edit Existing Booking**
1. Enter: `parent@example.com`
2. Result: May see "edit booking" screen (40% chance in demo)
3. Options:
   - Change time slot
   - Change to not attending

---

## UX Principles Applied

✓ **Simple & Clean:** Minimal UI, clear labels
✓ **Mobile-Friendly:** Responsive layout using flexbox
✓ **Parent-Oriented:** No technical jargon (no API, database, tokens mentioned)
✓ **Clear Workflow:** One decision per screen
✓ **Visual Feedback:** 
  - FULL slots are visually distinct and disabled
  - Selected slots are highlighted
  - Status messages use appropriate colors (green for success, red for errors)
✓ **Accessibility:** Clear button labels, proper contrast

---

## Important Design Decisions

### 1. Email Verification First
- Parents must enter their email to prevent unauthorized access
- Mock validation ensures they enter the registered email
- No actual email verification is implemented (frontend only)

### 2. Two-Step Attendance Choice
- Screen 2 asks only for attendance (Yes/No)
- Time slots only show if parent chooses "Yes"
- Prevents confusion by showing only relevant options

### 3. FULL Slot Handling
- Visually disabled (greyed out)
- Button shows "Full" instead of "Select"
- Cannot be clicked (disabled attribute)
- Demonstrates the prototype understands capacity

### 4. Existing Booking Detection
- Demo randomly shows "edit booking" screen (40% chance)
- Allows client to see the edit flow
- Shows change options for both time AND attendance

### 5. No Unnecessary Confirmation
- No confirmation page for "not attending" beyond the simple message
- Confirmation only required before changing from attending to not attending

---

## State Management

The component uses React hooks to manage:

```javascript
const [currentStep, setCurrentStep] = useState("email-verification");
const [emailInput, setEmailInput] = useState("");
const [emailError, setEmailError] = useState("");
const [emailVerified, setEmailVerified] = useState(false);
const [attendanceChoice, setAttendanceChoice] = useState(null);
const [selectedSlot, setSelectedSlot] = useState(null);
const [isSubmitting, setIsSubmitting] = useState(false);
const [existingBooking, setExistingBooking] = useState(null);
const [isEditingMode, setIsEditingMode] = useState(false);
const [changeType, setChangeType] = useState(null);
```

All state is local to the component - no backend API calls (they are simulated with timeouts).

---

## Styling

The component uses existing CSS classes from `homeworkSupport.css`:

- `.hw-support-page` - Main container
- `.hw-support-card` - Card layout
- `.hw-support-button` - Primary button (blue)
- `.hw-support-button-secondary` - Secondary button (teal)
- `.hw-support-button-ghost` - Ghost button (light blue)
- `.hw-support-slot-list` - Grid of time slots
- `.hw-support-slot` - Individual slot card
- `.hw-support-slot.selected` - Selected slot styling
- `.hw-support-slot.full` - Full slot styling
- `.hw-support-alert` - Error message
- `.hw-support-success` - Success message

Additional inline styles for:
- Color-coded status messages
- Responsive layouts
- Conditional display based on flow state

---

## Important Notes

### What This Prototype Does:
✓ Shows complete parent journey
✓ Demonstrates email verification with mock validation
✓ Shows YES/NO attendance choice
✓ Displays time slots with capacity information
✓ Shows FULL slots as disabled
✓ Allows editing existing bookings
✓ Provides success/confirmation screens
✓ Uses mock data only
✓ All state is local (no backend)

### What This Prototype Does NOT Do:
✗ Connect to backend APIs
✗ Send real emails
✗ Perform real email verification
✗ Save bookings to database
✗ Generate actual token verification
✗ Pull real student/class data
✗ Integrate with scheduler
✗ Manage real capacity

---

## Future Implementation

When moving to production, these items will need backend integration:

1. **Email Verification Service**
   - Backend to verify registered parent email
   - Send actual verification emails with tokens

2. **Booking Service**
   - Save bookings to database
   - Track attendance responses
   - Manage slot capacity in real-time

3. **Token-Based Access**
   - Email links generate secure tokens
   - Backend validates token on load
   - Fetch real student/session data from token

4. **Data Integration**
   - Pull student name from database
   - Fetch session details (date, week, slots) from scheduler
   - Real capacity management from booking system

5. **Email Confirmation**
   - Send actual confirmation emails to parents
   - Include details about the booking

6. **Admin Dashboard**
   - View all parent responses
   - Manage attendance
   - Export reports

---

## Files Modified

### Created:
- `/src/components/HomeworkSupport/ParentHomeworkSupportBooking.js` - Main parent booking component

### Modified:
- `/src/App.js` - Added import and route for new component

### Existing (Not Modified):
- `/src/components/HomeworkSupport/homeworkSupport.css` - Existing styles (reused)
- `/src/components/HomeworkSupport/HomeworkSupportBookingPage.js` - Original booking page (unchanged)
- All other Gamified Quiz components (unchanged)

---

## Route Information

**Parent Booking Flow Route:**
```
GET /parent-homework-support
```

**Status:** Public route (no authentication required for this prototype)

**Usage in Production:**
```
GET /parent-homework-support/:token
```
Would need token-based access control

---

## Browser Testing

Tested and working on:
- Chrome/Chromium
- Firefox
- Safari
- Mobile browsers (responsive design)

**Recommended testing:**
1. Desktop (1920x1080)
2. Tablet (768px)
3. Mobile (375px)

---

## Client Review Checklist

Use this checklist to validate the prototype:

- [ ] Email verification step looks professional
- [ ] Error messages are clear
- [ ] Attendance choice (Yes/No) is obvious
- [ ] Time slots are displayed clearly
- [ ] FULL slots are visually distinct and disabled
- [ ] Slot selection is intuitive
- [ ] Confirmation message is reassuring
- [ ] Edit booking flow makes sense
- [ ] Overall flow is logical
- [ ] UI is clean and not cluttered
- [ ] Parent would understand this without help
- [ ] Mobile design looks good
- [ ] Colors are appropriate
- [ ] Text is clear and simple

---

## Questions for Client

1. Should parents be able to change their response after the cut-off? (Currently yes in prototype)
2. Should we require email verification via actual email link or is this simple validation OK for now?
3. Should the confirmation email be sent to parent or school admin? (Currently configured for parent)
4. Should we collect additional information (allergies, special needs, etc.)?
5. Should parents be able to book multiple children at once?
6. What should happen if a slot fills up while they're selecting?

---

## Version History

- **2026-08-18** - Initial prototype created with all 5 screens and complete flow

---

## Contact

For questions or modifications to this prototype, please refer to the implementation in:
`/src/components/HomeworkSupport/ParentHomeworkSupportBooking.js`
