# QUICK START GUIDE - Parent Homework Support Booking

## For Client Review

### What Is This?
This is a **working mockup** of what parents will see when they click the Homework Support booking link from their email.

**Important:** This is a frontend prototype using mock data only. No real emails are sent, no bookings are saved.

---

## How to View

### Option 1: Local Development
```
1. npm start
2. Open browser to: http://localhost:3000/parent-homework-support
3. Start using the mockup
```

### Option 2: Share Link (if deployed)
```
Send this URL to client/stakeholders:
https://[your-server]/parent-homework-support
```

---

## Demo Credentials

**Email to use:**
```
parent@example.com
```

**That's it!** No password needed for this prototype.

---

## What Parent Sees

### Screen 1: Email Verification
```
Title: Homework Support
Info:  Homework Support — Week 5
       Saturday, September 12, 2026
       Student: Ali Khan

Ask:   "Please enter your registered parent email address to continue."
Input: [ Text field for email ]
Button: [ Continue ]
```

✓ Try entering: `parent@example.com` → Continue
✗ Try entering: `wrong@email.com` → See error

---

### Screen 2: Attendance Choice
```
Title: Homework Support
Info:  Saturday, September 12, 2026
       Student: Ali Khan

Ask:   "Will Ali Khan be attending Homework Support?"
Button 1: [ Yes, my child will attend ]
Button 2: [ No, my child will not attend ]
```

✓ Click either button to proceed

---

### Screen 3A: Not Attending (if chose "No")
```
Title: Not Attending
Message: "Thank you for letting us know.
          You have indicated that Ali Khan will not attend Homework Support this week."
Button: [ Submit Response ]

After Submit:
Title: Response Recorded
Status: Not Attending ✓
Message: "A confirmation email will be sent..."
```

---

### Screen 3B: Time Slots (if chose "Yes")
```
Title: Select Time Slot
Info:  Saturday, September 12, 2026
       Student: Ali Khan

Show three time slots:

┌─────────────────────────────────┐
│ 10:00 AM – 12:00 PM             │
│ 6 places available              │
│ [ Select ]                      │
└─────────────────────────────────┘

┌─────────────────────────────────┐
│ 12:00 PM – 2:00 PM              │
│ FULL  ← (greyed out/disabled)   │
│ [ Full ]  ← (can't click)       │
└─────────────────────────────────┘

┌─────────────────────────────────┐
│ 2:00 PM – 4:00 PM               │
│ 7 places available              │
│ [ Select ]                      │
└─────────────────────────────────┘
```

✓ Click available slots to select
✗ Can't click FULL slot (it's disabled)
Button: [ Confirm Booking ] (greyed out until slot selected)

---

### Screen 4: Confirmation
```
Title: Booking Confirmed
Success Message:
  "Ali Khan is booked for Homework Support."
  
Details:
  Saturday: September 12, 2026
  Time: 10:00 AM – 12:00 PM
  Status: Confirmed ✓
  
Info:
  "A confirmation email will be sent to your registered parent email address."

Button: [ Start Over ]
```

---

## Testing Flows

### Flow 1: Quick "No" Response
```
1. parent@example.com → Continue
2. No, my child will not attend
3. Submit Response
4. See "Response Recorded"
⏱️  Takes ~10 seconds
```

### Flow 2: Book a Time Slot
```
1. parent@example.com → Continue
2. Yes, my child will attend
3. Click any slot except FULL
4. Confirm Booking
5. See "Booking Confirmed"
⏱️  Takes ~15 seconds
```

### Flow 3: Try to Book FULL Slot
```
1. parent@example.com → Continue
2. Yes, my child will attend
3. Try clicking "12:00 PM – 2:00 PM" (FULL)
4. Notice you can't click it
5. Select different slot instead
⏱️  Demonstrates capacity handling
```

### Flow 4: See Edit Booking (if it appears)
```
1. parent@example.com → Continue
2. Instead of "Attendance Choice", see "Edit Booking"
3. Current booking shown: 10:00 AM – 12:00 PM
4. Options:
   - Change Time Slot → Select new time
   - Change to Not Attending → Confirm change
5. See updated booking
```

---

## Key Features to Show Client

### ✓ Email Verification
- Ensures parents use registered email
- Clear error message if wrong email
- Mock validation (production would send real email)

### ✓ Two-Step Attendance
- First: Yes or No?
- Then: Which time? (only if Yes)
- Prevents confusion

### ✓ FULL Slots Are Disabled
- Visually greyed out
- Cannot be selected
- Shows capacity is working
- Button says "Full" instead of "Select"

### ✓ Clear Confirmation
- Shows all booking details
- Confirms success
- Mentions confirmation email
- Professional appearance

### ✓ Edit Existing Booking
- Can change time slot
- Can change to not attending
- Shows current booking
- Previous response preserved

### ✓ Mobile Friendly
- Works on phones and tablets
- Touch-friendly buttons
- Readable on small screens
- No horizontal scrolling

---

## Questions Parent Might Ask

**Q: Will my email be safe?**
A: Yes, we validate and protect parent information. (Frontend only for this prototype)

**Q: What if I change my mind?**
A: You can change your response until the cut-off date.

**Q: Will I get a confirmation?**
A: Yes, an email will be sent to your registered address.

**Q: What if the slot is full?**
A: That slot will be greyed out and you can't select it. Try another time.

**Q: Can I book for multiple children?**
A: This version is for one child per booking. (Design decision for client)

---

## What This Mockup DOES Show

✓ Complete flow from email to confirmation
✓ Email verification
✓ Yes/No attendance choice
✓ Time slot selection with capacity
✓ FULL slot handling
✓ Success confirmation
✓ Edit existing booking
✓ Mobile responsiveness
✓ Error messages
✓ Professional UI/UX

---

## What This Mockup DOES NOT Include

✗ Real email verification
✗ Real email sending
✗ Database/saved bookings
✗ Admin interface
✗ Attendance tracking
✗ Student data from real system
✗ Real time slot capacity
✗ Security/authentication
✗ Multi-child support
✗ Payment processing

---

## Feedback Points

Show to client and ask:

1. **Email Step:** Does this feel right for parents?
2. **Attendance:** Clear Yes/No choices?
3. **Slots:** Can parents understand the time options?
4. **FULL Slots:** Obvious that they can't book this slot?
5. **Confirmation:** Does success message feel complete?
6. **Mobile:** Works well on phone?
7. **Overall:** Is this the journey you want parents to take?

---

## Next Steps After Client Approval

1. ✓ Get client sign-off on flow (what you're viewing now)
2. ⟳ Connect to real backend APIs
3. ⟳ Implement real email verification
4. ⟳ Save bookings to database
5. ⟳ Integrate with scheduler
6. ⟳ Manage real student data
7. ⟳ Send real confirmation emails
8. ⟳ Build admin dashboard

---

## Common Issues & Solutions

**Issue:** "I see 'Edit Booking' but expected 'Attendance Choice'"
- **Reason:** 40% random chance of showing edit flow
- **Solution:** Refresh and try again, or understand this is intentional demo

**Issue:** "Can't proceed past email verification"
- **Reason:** Entered wrong email
- **Solution:** Use exactly: `parent@example.com` (case-insensitive)

**Issue:** "Page looks different on my phone"
- **Reason:** Normal - responsive design adapts to screen size
- **Solution:** This is intentional - should work on all sizes

**Issue:** "Buttons don't respond"
- **Reason:** Likely still submitting (500ms delay)
- **Solution:** Wait for "Confirm Booking" or "Submit Response" to finish

**Issue:** "Do I need to sign up?"
- **Reason:** This is a mockup - no accounts needed
- **Solution:** Just enter the test email and proceed

---

## Support

For technical questions or issues:
1. Check this file first
2. See TESTING_GUIDE.md for detailed test cases
3. See PARENT_BOOKING_MOCKUP_README.md for complete documentation

For client feedback:
- Share URL: `/parent-homework-support`
- Ask: Does this match your vision?
- Request: Any changes needed?

---

## Summary

| Aspect | Status |
|--------|--------|
| Email Verification | ✅ Working |
| Attendance Choice | ✅ Working |
| Time Slot Selection | ✅ Working |
| FULL Slot Handling | ✅ Working |
| Confirmation | ✅ Working |
| Edit Booking | ✅ Working |
| Mobile Design | ✅ Working |
| Mock Data | ✅ Complete |
| Error Handling | ✅ Complete |

---

## Ready to Present! 🎉

This mockup is complete and ready to show the client. All flows work as intended, mock data is realistic, and the UI is professional.

**Access URL:** `http://localhost:3000/parent-homework-support`

**Demo Email:** `parent@example.com`

Go get that client approval! ✓
