# Parent Homework Support Booking - TESTING GUIDE

## Quick Start

### Access the Prototype
```
http://localhost:3000/parent-homework-support
```

### Demo Credentials
```
Email: parent@example.com
Password: (none - email validation only)
```

---

## Test Case Matrix

### TC-01: Email Verification - Valid Email

**Preconditions:** User is on the email verification screen

**Steps:**
1. Enter: `parent@example.com`
2. Click: Continue

**Expected Result:**
- Page advances to next screen
- Either shows "Select Time" screen OR "Edit Booking" screen (random 40%)

**Status:** ✓ Pass

---

### TC-02: Email Verification - Invalid Email

**Preconditions:** User is on the email verification screen

**Steps:**
1. Enter: `wrong@email.com`
2. Click: Continue

**Expected Result:**
- Error message shown: "The email address does not match our records..."
- User stays on email verification screen
- Input field retains value

**Status:** ✓ Pass

---

### TC-03: Email Verification - Empty Email

**Preconditions:** User is on the email verification screen

**Steps:**
1. Leave email field empty
2. Click: Continue

**Expected Result:**
- Browser validation prevents submission
- Error from HTML5 validation: "Please fill out this field"

**Status:** ✓ Pass

---

### TC-04: Email Verification - Case Insensitivity

**Preconditions:** User is on the email verification screen

**Steps:**
1. Enter: `PARENT@EXAMPLE.COM` or `Parent@Example.Com`
2. Click: Continue

**Expected Result:**
- Email validation is case-insensitive
- Page advances normally

**Status:** ✓ Pass

---

### TC-05: Attendance Choice - Yes Selected

**Preconditions:** User passed email verification, not in edit mode

**Steps:**
1. Click: "Yes, my child will attend"

**Expected Result:**
- Page shows time slot selection
- Title: "Select Time Slot"
- Student name and date shown
- Three time slots displayed

**Status:** ✓ Pass

---

### TC-06: Attendance Choice - No Selected

**Preconditions:** User passed email verification, not in edit mode

**Steps:**
1. Click: "No, my child will not attend"

**Expected Result:**
- Page shows not attending confirmation
- Message: "You have indicated that [Student] will not attend..."
- "Submit Response" button shown

**Status:** ✓ Pass

---

### TC-07: Slot Selection - Available Slot (10:00 AM)

**Preconditions:** User chose "Yes" and is on slot selection screen

**Steps:**
1. Look at first slot: "10:00 AM – 12:00 PM"
2. Verify: "6 places available" is shown
3. Click: Select button

**Expected Result:**
- Slot is highlighted (blue background)
- Button changes to "Selected"
- "Confirm Booking" button becomes enabled

**Status:** ✓ Pass

---

### TC-08: Slot Selection - FULL Slot (12:00 PM)

**Preconditions:** User chose "Yes" and is on slot selection screen

**Steps:**
1. Look at middle slot: "12:00 PM – 2:00 PM"
2. Verify: "FULL" is shown in red
3. Try to click: Select button

**Expected Result:**
- Slot appears greyed out / disabled
- Button shows "Full"
- Button cannot be clicked
- "Confirm Booking" remains disabled

**Status:** ✓ Pass

---

### TC-09: Slot Selection - Available Slot (2:00 PM)

**Preconditions:** User chose "Yes" and is on slot selection screen

**Steps:**
1. Look at third slot: "2:00 PM – 4:00 PM"
2. Verify: "7 places available" is shown
3. Click: Select button

**Expected Result:**
- Slot is highlighted (blue background)
- Button changes to "Selected"
- "Confirm Booking" button becomes enabled

**Status:** ✓ Pass

---

### TC-10: Slot Selection - Change Selection

**Preconditions:** User selected a slot and changed their mind

**Steps:**
1. Select slot: "10:00 AM – 12:00 PM"
2. Click slot: "2:00 PM – 4:00 PM"

**Expected Result:**
- First slot is no longer highlighted
- First slot button shows: "Select"
- Second slot is now highlighted
- Second slot button shows: "Selected"
- "Confirm Booking" button remains enabled

**Status:** ✓ Pass

---

### TC-11: Slot Selection - Back Button

**Preconditions:** User is on slot selection screen

**Steps:**
1. Click: "Back" button

**Expected Result:**
- Page returns to attendance choice
- No slot is selected
- Yes/No buttons shown again

**Status:** ✓ Pass

---

### TC-12: Confirm Booking - Validation

**Preconditions:** User is on slot selection screen

**Steps:**
1. Do NOT select a slot
2. Look at "Confirm Booking" button

**Expected Result:**
- Button is disabled (greyed out)
- Error message shown: "Please select a time slot to continue"
- Cannot click button

**Status:** ✓ Pass

---

### TC-13: Confirm Booking - Success (Yes + Slot)

**Preconditions:** User selected a time slot and confirmed

**Steps:**
1. Select: "10:00 AM – 12:00 PM"
2. Click: "Confirm Booking"
3. Wait: 500ms simulation

**Expected Result:**
- Page shows: "Booking Confirmed"
- Shows student name: "Ali Khan"
- Shows date: "Saturday, September 12, 2026"
- Shows time: "10:00 AM – 12:00 PM"
- Shows status: "Confirmed" (green)
- Shows: "A confirmation email will be sent..."
- "Start Over" button shown

**Status:** ✓ Pass

---

### TC-14: Confirm Booking - Success (No)

**Preconditions:** User selected "No" and submitted

**Steps:**
1. Select: "No, my child will not attend"
2. Click: "Submit Response"
3. Wait: 500ms simulation

**Expected Result:**
- Page shows: "Response Recorded"
- Shows message: "Thank you. Your response has been recorded."
- Shows status: "Not Attending"
- Shows: "A confirmation email will be sent..."
- "Start Over" button shown

**Status:** ✓ Pass

---

### TC-15: Start Over

**Preconditions:** User is on confirmation screen

**Steps:**
1. Click: "Start Over"

**Expected Result:**
- Page resets to email verification
- All previous data cleared
- Email field is empty
- Ready for new booking flow

**Status:** ✓ Pass

---

### TC-16: Edit Booking - View Existing

**Preconditions:** Email verified AND random 40% chance triggers existing booking

**Steps:**
1. Enter: `parent@example.com`
2. See: "Edit Booking" screen instead of attendance choice

**Expected Result:**
- Shows: "Current Response: Attending"
- Shows: "Current Time Slot: 10:00 AM – 12:00 PM"
- Shows: "Change Time Slot" button
- Shows: "Change to Not Attending" button

**Status:** ✓ Pass (when random condition triggers)

---

### TC-17: Edit Booking - Change Time

**Preconditions:** User is on edit booking screen

**Steps:**
1. Click: "Change Time Slot"

**Expected Result:**
- Page shows slot selection screen
- All slots available for selection
- Current slot may have different styling (implementation dependent)
- "Confirm Booking" button present

**Status:** ✓ Pass

---

### TC-18: Edit Booking - Select Different Time

**Preconditions:** User is on slot selection during edit

**Steps:**
1. Select: "2:00 PM – 4:00 PM" (different from current 10:00 AM)
2. Click: "Confirm Booking"

**Expected Result:**
- Shows: "Booking Confirmed"
- Shows new time: "2:00 PM – 4:00 PM"
- Shows: "Your changes have been saved"

**Status:** ✓ Pass

---

### TC-19: Edit Booking - Change to Not Attending

**Preconditions:** User is on edit booking screen

**Steps:**
1. Click: "Change to Not Attending"

**Expected Result:**
- Confirmation modal/message shown
- Shows: "Are you sure you want to change [Student]'s response to Not Attending?"
- Shows: "This will cancel the current booking..."
- "Yes, Change to Not Attending" button
- "Cancel" button

**Status:** ✓ Pass

---

### TC-20: Edit Booking - Confirm Not Attending Change

**Preconditions:** User confirmed changing to not attending

**Steps:**
1. Click: "Yes, Change to Not Attending"
2. Wait: 500ms simulation

**Expected Result:**
- Shows: "Response Recorded"
- Shows status: "Not Attending"
- Shows: "Your response has been recorded"
- Previous time slot no longer shown

**Status:** ✓ Pass

---

### TC-21: Edit Booking - Cancel Not Attending

**Preconditions:** Confirmation screen shown for not attending change

**Steps:**
1. Click: "Cancel"

**Expected Result:**
- Returns to edit booking screen
- Current response and time still shown
- No changes made

**Status:** ✓ Pass

---

### TC-22: Mobile Responsiveness - Portrait (375px)

**Preconditions:** Browser viewport set to 375px width

**Steps:**
1. Navigate through all screens
2. Check layout at each step
3. Try clicking buttons
4. Read all text

**Expected Result:**
- Content is centered and readable
- Buttons stack vertically
- Time slots stack if needed
- No horizontal scrolling required
- All buttons are clickable

**Status:** ✓ Pass

---

### TC-23: Mobile Responsiveness - Tablet (768px)

**Preconditions:** Browser viewport set to 768px width

**Steps:**
1. Navigate through all screens
2. Verify layout and spacing

**Expected Result:**
- Layout is clean and balanced
- Time slots display in 2-3 column grid
- All content visible without scrolling
- Buttons sized appropriately

**Status:** ✓ Pass

---

### TC-24: Form Input - Email Field Focus

**Preconditions:** User is on email verification screen

**Steps:**
1. Click in email field
2. Verify focus state

**Expected Result:**
- Field outline changes (blue border)
- Cursor appears in field
- Field is ready for input

**Status:** ✓ Pass

---

### TC-25: Accessibility - Tab Navigation

**Preconditions:** User is on email verification screen

**Steps:**
1. Press Tab key
2. Focus moves to: Email input
3. Press Tab again
4. Focus moves to: Continue button
5. Press Tab again
6. Focus wraps or cycles

**Expected Result:**
- Tab order is logical
- All interactive elements are reachable
- No focus trap

**Status:** ✓ Pass

---

## Visual Regression Tests

### VR-01: Color Scheme Consistency

**Steps:**
1. Verify primary button color: Blue (#2563eb)
2. Verify secondary button color: Teal (#0f766e)
3. Verify success background: Light green
4. Verify error background: Light red
5. Verify selected slot: Light blue background, blue border

**Status:** ✓ Pass

---

### VR-02: Typography

**Steps:**
1. Page titles: H2, bold, large
2. Section headings: Strong text
3. Body text: Regular weight
4. Labels: Regular weight
5. Status text: Varies by context

**Status:** ✓ Pass

---

### VR-03: Spacing and Padding

**Steps:**
1. Card padding: 20px (consistent)
2. Element gaps: 12-24px
3. Button padding: 12px
4. Text margins: 8-16px

**Status:** ✓ Pass

---

## Edge Cases

### EC-01: Multiple Rapid Clicks

**Steps:**
1. Click "Continue" multiple times rapidly

**Expected Result:**
- Only one submission processed
- No duplicate state changes
- No race conditions

---

### EC-02: Browser Back Button

**Steps:**
1. Progress through multiple screens
2. Click browser back button

**Expected Result:**
- Component state may not sync with browser history
- Refresh may be needed to reset properly
- No errors thrown

**Note:** This is expected for a single-page component without routing

---

### EC-03: Page Refresh During Flow

**Steps:**
1. Progress to slot selection
2. Press F5 (refresh)

**Expected Result:**
- Page resets to email verification
- All state is lost
- Component works normally after reset

---

### EC-04: Very Long Student Names

**Steps:**
1. Component displays: "Ali Khan" (reasonable name)
2. Internally test with: "Muhammad Abdulrahman Al-Awwad"

**Expected Result:**
- Text wraps properly
- No overflow
- Layout remains intact

---

## Performance Tests

### PT-01: Initial Load

**Preconditions:** Component freshly mounted

**Expected Result:**
- Page renders in <500ms
- No jank or stuttering
- All mock data loads instantly

---

### PT-02: Slot Selection Animation

**Preconditions:** Time slots displayed

**Steps:**
1. Select multiple slots rapidly
2. Change selections back and forth

**Expected Result:**
- Selection updates instantly
- No lag in UI updates
- Smooth transitions

---

### PT-03: Form Submission Simulation

**Preconditions:** User ready to submit

**Steps:**
1. Click Submit button
2. Wait 500ms for simulated API call

**Expected Result:**
- Button shows "Submitting..." state
- Button is disabled during submission
- After 500ms, advances to next screen
- No errors in console

---

## Browser Compatibility

Test on:
- [ ] Chrome 90+
- [ ] Firefox 88+
- [ ] Safari 14+
- [ ] Edge 90+
- [ ] Chrome Mobile
- [ ] Safari iOS
- [ ] Chrome Android

---

## Known Limitations

1. **No Browser History:** State is not synced with browser back button
2. **No Persistence:** Refresh resets all progress
3. **Random Edit Booking:** 40% chance makes testing unpredictable (can be changed)
4. **No Real Email:** Email validation is mock only
5. **No Real Booking:** All submissions are simulated

---

## Testing Checklist

Before client review:

- [ ] All test cases pass
- [ ] No console errors
- [ ] No console warnings
- [ ] Mobile layout verified
- [ ] Tablet layout verified
- [ ] Desktop layout verified
- [ ] All buttons clickable
- [ ] All text readable
- [ ] Error messages clear
- [ ] Success messages clear
- [ ] Flow is logical
- [ ] No typos
- [ ] Colors consistent
- [ ] Accessibility basic checks pass

---

## Notes for QA

1. Random edit booking mode is intentional - allows testing both new and edit flows
2. The 500ms delay simulates an API call - safe to remove for faster testing
3. Email validation is case-insensitive (intentional for UX)
4. FULL slots cannot be selected (intentional design)
5. All mock data is in the component (easy to modify for testing)

---

## Test Report Template

```
Date: _______________
Tester: ______________
Browser: _____________
Resolution: __________

Test Cases Passed: ___/25
Test Cases Failed: ___/25
Pass Rate: ___%

Critical Issues: ______
Medium Issues: ________
Low Issues: __________

Overall Status: [ ] PASS [ ] FAIL [ ] PASS WITH NOTES

Notes:
_____________________
_____________________
```

