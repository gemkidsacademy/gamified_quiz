# Homework Support Feature Context

## 1. PROJECT PURPOSE

We are implementing a new feature called:

Homework Support Booking

Our current understanding of the client's business purpose is:

The client already provides Homework Support on Saturdays.

We are NOT building the actual educational Homework Support program.

We are building a system that digitizes the weekly parent confirmation and booking process so the client can know:

- which students intend to attend
- which students do not intend to attend
- which students have not responded
- which Saturday time slot each attending student selected
- how many students are booked into each slot
- whether a slot has reached capacity

The business purpose is to allow the client to plan teachers/staff and Saturday capacity.

---

## 2. CURRENT DEVELOPMENT STRATEGY

We are deliberately building this feature in stages.

Stage 1:
Frontend prototype using mock data.

Stage 2:
Show the prototype to the client and confirm that the workflow/UI matches what they actually want.

Stage 3:
Design and implement the backend.

Stage 4:
Define exact FastAPI API contracts.

Stage 5:
Replace the frontend mock data with real APIs.

Stage 6:
Integration testing.

DO NOT skip directly to backend implementation unless explicitly instructed.

---

## 3. DIVISION OF RESPONSIBILITIES

Frontend:
Codex is helping implement the React frontend.

Backend:
The backend will be implemented separately with ChatGPT assistance.

Backend includes:
- FastAPI
- PostgreSQL
- SQLAlchemy
- database design
- booking logic
- capacity enforcement
- parent verification
- email logic
- SendGrid
- separate Homework Support scheduler

Do not invent backend APIs.

Do not invent database structures.

Do not modify backend code.

When backend API contracts are provided later, implement the frontend against those exact contracts.

---

## 4. EXISTING SYSTEM SAFETY RULE

The existing Gamified Quiz functionality is working.

The existing Gamified Quiz scheduler is working.

The Homework Support feature MUST NOT modify or refactor:

- existing Gamified Quiz scheduler
- existing quiz generation
- existing quiz flows
- existing scheduler configuration
- existing unrelated Admin functionality

Homework Support will have its own separate scheduler.

---

## 5. CURRENT FRONTEND IMPLEMENTATION

The repository is a React frontend.

The following Homework Support prototype files have been created/used:

- src/components/HomeworkSupport/HomeworkSupportAdmin.js
- src/components/HomeworkSupport/HomeworkSupportBookingPage.js
- src/components/HomeworkSupport/homeworkSupport.css
- src/services/homeworkSupportApi.js

The Homework Support tab has been connected to the actual mounted Admin Dashboard.

The Admin route is:

/AdminPanel

The actual dashboard component is:

AdminDashboardNew

The Homework Support parent prototype route has also been created.

Verified current source details:

- src/App.js includes the AdminPanel route rendering AdminDashboardNew.
- src/components/AdminDashboardNew.js includes the Homework Support tab and renders HomeworkSupportAdmin.
- src/components/HomeworkSupport/HomeworkSupportAdmin.js is the active mock configuration/dashboard prototype for Homework Support.
- src/services/homeworkSupportApi.js contains mock service data and intentionally throws backend-contract errors.

Inspect the current source files to verify exact paths and implementation details rather than assuming these names remain unchanged.

---

## 6. ADMIN WORKFLOW WE AGREED ON

The Admin workflow should be:

Academic Term
↓
Select existing academic weeks
↓
Configure each selected Homework Support week
↓
Configure Saturday date
↓
Configure booking cut-off
↓
Create/configure time slots
↓
Save configuration

The Admin is selecting EXISTING academic weeks.

The Admin is NOT creating new academic weeks.

Therefore there should NOT be an "Add Selected Week" action.

If an "Add Selected Week" button exists in the current code, it should be removed/replaced as previously discussed.

---

## 7. CONFIGURATION TAB

The Configuration tab should answer:

"What should be available?"

It should contain setup/configuration information only.

For each selected Homework Support week:

- Homework Support week
- Saturday session date
- booking cut-off
- configured time slots

Each time slot has:

- start time
- end time
- capacity

Admin must be able to:

- Add Time Slot
- Edit Time Slot
- Remove Time Slot

Do NOT assume slots are 30 minutes.

The client requirement does not specify 30-minute slots.

Use configurable start/end times.

Example:

10:00 AM – 12:00 PM
Capacity: 20

12:00 PM – 2:00 PM
Capacity: 20

2:00 PM – 4:00 PM
Capacity: 15

---

## 8. IMPORTANT CONFIGURATION/DASHBOARD SEPARATION

We explicitly decided that Configuration should NOT mix setup with live booking information.

Configuration should NOT show:

- Booked
- Available
- Open to parents
- Closed to parents
- live booking status

Configuration should focus on creating/editing/removing the slots and setting their capacity.

The Weekly Dashboard should handle live/operational information.

---

## 9. WEEKLY DASHBOARD

The Weekly Dashboard should eventually show:

- Total Students
- Attending
- Not Attending
- No Response
- slot capacity
- booked count
- available count
- full/open/closed status
- individual student responses
- selected slot for each student

Admin should also be able to manage live slots from the dashboard, including:

- Close Slot
- Reopen Slot

These actions are different from removing a configured slot.

Close Slot:
The slot remains configured but parents cannot book it.

Reopen Slot:
The slot becomes available for booking again.

Remove Slot:
The slot is removed from the configured slots for that Homework Support week.

---

## 10. PARENT WORKFLOW

The intended parent flow is:

Parent receives email
↓
Clicks student-specific booking link
↓
Verifies registered parent email
↓
Sees student
↓
Selects Yes or No

If No:
Submit response.
No time slot selection is required.

If Yes:
Show available Saturday time slots.
Parent selects one.
Submit booking.
Show confirmation.

The same link should ideally allow the parent to review/change the response before the booking cut-off, subject to final client confirmation.

---

## 11. CAPACITY

Capacity is an important business rule.

Example:

Capacity: 20
Booked: 19
Available: 1

If the slot is full:

Capacity: 20
Booked: 20
Available: 0
Status: FULL

The backend will eventually be the authoritative source of capacity.

The frontend must not rely on frontend-only calculations for final booking decisions.

The backend must re-check capacity when a booking is submitted to prevent two parents from taking the last available place simultaneously.

---

## 12. MONDAY EMAIL SCHEDULER

We have agreed that Homework Support needs a SEPARATE scheduler from the existing Gamified Quiz scheduler.

Conceptually:

Existing:
Gamified Quiz Scheduler
↓
existing quiz generation

New:
Homework Support Scheduler
↓
Homework Support parent invitation emails

The new scheduler will eventually:

- check Homework Support configuration
- determine which weeks require Homework Support
- identify eligible students/parents
- send the Monday invitation email
- record that the invitation was sent

The existing Gamified Quiz scheduler must remain untouched.

The exact Monday email time still needs client confirmation unless a standard time is agreed.

---

## 13. EMAIL

The existing backend already has SendGrid email infrastructure.

The existing application uses SendGrid for emails with PDF attachments.

Homework Support will eventually use the same general email infrastructure where appropriate, but the exact backend implementation/API will be defined separately.

Do not implement email logic in the frontend prototype.

---

## 14. CLIENT REQUIREMENT INTERPRETATION

Our current interpretation of the client's requirement is:

The client is NOT asking us to build Homework Support itself.

They are asking us to digitize the weekly parent attendance/booking process for an already-existing Saturday Homework Support service.

The system's main purpose is to help the client understand expected Saturday attendance and slot distribution so they can arrange teachers/staff accordingly.

This interpretation should be confirmed with the client.

---

## 15. OPEN CLIENT QUESTIONS

Before backend implementation, the following should be confirmed with the client:

1. Who exactly receives the Monday email?
   - Every student?
   - Students belonging to selected classes?
   - Students belonging to the selected session/week?
   - Another eligibility rule?

2. How is the Saturday date determined?
   - Automatically from the existing academic week/session?
   - Manually configured by Admin?

3. Are time slots completely configurable?
   - What typical slot durations does the client use?

4. What time on Monday should invitation emails be sent?

5. What is the normal booking cut-off?

6. Is parent booking change/cancellation definitely required before the cut-off?

7. Can a parent with multiple children manage each child's response separately?

8. What should happen to students who have not responded by the cut-off?

9. Does the Weekly Dashboard provide all the information the client needs to arrange teachers?

Do not make permanent backend/business-rule decisions for these unanswered questions.

---

## 16. CURRENT MOCK DATA RULE

The current frontend is a prototype.

Mock data is intentional.

Do not replace mock data with backend calls until the backend contracts are explicitly provided.

The mock service/data layer should be structured so that later:

React components
↓
Homework Support service
↓
Real FastAPI APIs

can replace:

React components
↓
Homework Support service
↓
Mock data

without redesigning the UI.

---

## 17. WHAT HAS ALREADY BEEN DISCUSSED/DECIDED

Important decisions made during development:

- Use a separate Homework Support scheduler.
- Do not modify the existing Gamified Quiz scheduler.
- Use mock data first.
- Get client alignment on UI/workflow before backend implementation.
- Admin selects existing academic weeks; Admin does not create weeks.
- Remove "Add Selected Week" concept.
- Saturday date belongs to the Homework Support week/event.
- Start/end times belong to individual bookable slots.
- Do not assume 30-minute slots.
- Admin needs to be able to add/edit/remove slots.
- Configuration should not be overloaded with live booking information.
- Booked/available/open/closed belongs primarily in the Weekly Dashboard.
- Close/Reopen is different from Remove.
- Parent chooses Yes/No.
- Yes requires slot selection.
- No does not require slot selection.
- Capacity must ultimately be enforced by backend.
- Parent-specific booking links and registered email verification are part of the intended flow.

---

## 18. CURRENT STATUS

Verified current status as of 2026-08-17.

### COMPLETED

- Homework Support frontend prototype files exist in the repo.
- Homework Support tab is connected to the mounted Admin Dashboard in AdminDashboardNew.
- Admin route /AdminPanel is wired to the active dashboard component.
- Parent booking prototype route exists in App.js.
- Frontend mock service layer exists in src/services/homeworkSupportApi.js.
- Configuration tab has been structured to keep setup-only fields and slot editing actions.
- The UI separation between Configuration and Weekly Dashboard responsibilities has been implemented in the prototype.

### IN PROGRESS

- Finalizing the mock frontend prototype and keeping setup vs live booking responsibilities clearly separated.
- Review of the prototype flow against the client requirement and expected admin workflow.

### NOT STARTED

- Backend database design.
- FastAPI endpoint design.
- Homework Support scheduler implementation.
- Monday invitation email logic.
- Parent booking verification logic.
- Capacity enforcement logic in backend.
- Replace mock data with live API calls.
- Integration testing.

### BLOCKED / WAITING FOR CLIENT

- Exact Monday email recipient eligibility rule.
- How the Saturday date is defined or auto-generated.
- Typical time-slot duration expectations from the client.
- Exact booking cut-off time.
- Whether parents can change or cancel bookings before cut-off.
- Whether multiple children are managed separately.
- What should happen to non-responders after cut-off.
- Confirmation that the dashboard contains all operational data the client needs.

---

## 19. NEXT STEP

The immediate next step is:

Finish the mock frontend prototype and review it with the client.

Do NOT start backend API implementation until the workflow is confirmed.

After client confirmation:

1. Backend database design
2. FastAPI endpoints
3. Separate Homework Support scheduler
4. Monday invitation emails
5. Parent booking/verification
6. Capacity enforcement
7. Admin dashboard APIs
8. Connect React frontend to APIs
9. Integration testing

---

## 20. INSTRUCTIONS FOR FUTURE CODEX SESSIONS

When a new Codex session starts:

1. Read this file first.
2. Inspect the current repository state.
3. Check the current implementation before making assumptions.
4. Continue from the documented status.
5. Do not modify Gamified Quiz functionality.
6. Do not modify the existing Gamified Quiz scheduler.
7. Do not invent backend APIs.
8. Do not invent database structures.
9. Ask for clarification if a requested change conflicts with the documented workflow.
10. Update this document whenever a significant implementation decision or milestone changes.

---

## Working Arrangement Summary

- React frontend prototype is the current focus.
- Backend implementation is separate and intentionally deferred.
- Homework Support must not interfere with the existing Gamified Quiz or scheduler.
- The Configuration tab is focused on setup only.
- The Weekly Dashboard is responsible for operational booking states.
- All current frontend logic is mock-data based and should remain so until the API contract is provided.
