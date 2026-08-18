// Frontend-only Homework Support API scaffold.
// The backend contract is intentionally not hard-coded here because the backend is
// maintained separately. Replace these placeholders with the exact API contract
// once the backend team provides it.

export const HOMEWORK_SUPPORT_API_STATUS = "PENDING_BACKEND_CONTRACT";

export const sampleHomeworkSupportConfig = {
  termName: "Term 2 2026",
  selectedWeeks: [1, 2, 4],
  saturdaySessionDate: "2026-08-29",
  bookingCutoff: "Friday 6:00 PM",
  slots: [
    { id: 101, label: "9:00 AM - 9:30 AM", capacity: 12, booked: 7, available: 5, isClosed: false },
    { id: 102, label: "9:30 AM - 10:00 AM", capacity: 12, booked: 12, available: 0, isClosed: true },
    { id: 103, label: "10:00 AM - 10:30 AM", capacity: 12, booked: 6, available: 6, isClosed: false },
  ],
};

export const sampleHomeworkSupportDashboard = {
  totals: {
    totalStudents: 48,
    attending: 17,
    notAttending: 9,
    noResponse: 22,
  },
  slots: [
    { id: 101, label: "9:00 AM - 9:30 AM", capacity: 12, booked: 7, available: 5, status: "Open" },
    { id: 102, label: "9:30 AM - 10:00 AM", capacity: 12, booked: 12, available: 0, status: "Full" },
    { id: 103, label: "10:00 AM - 10:30 AM", capacity: 12, booked: 6, available: 6, status: "Open" },
  ],
  studentResponses: [
    {
      studentId: "STU-001",
      name: "Ava Brown",
      parentEmail: "ava.parent@example.com",
      status: "Attending",
      slot: "9:00 AM - 9:30 AM",
      responseDate: "Monday, August 24, 2026",
    },
    {
      studentId: "STU-002",
      name: "Leo Smith",
      parentEmail: "leo.parent@example.com",
      status: "Not Attending",
      slot: "-",
      responseDate: "Tuesday, August 25, 2026",
    },
    {
      studentId: "STU-003",
      name: "Mia Patel",
      parentEmail: "mia.parent@example.com",
      status: "No Response",
      slot: "-",
      responseDate: "-",
    },
  ],
};

export const sampleBookingResponse = {
  bookingId: 999,
  studentName: "Ava Brown",
  parentEmail: "parent@example.com",
  verified: true,
  attendance: "yes",
  slot: { id: 101, label: "9:00 AM - 9:30 AM" },
  status: "Attending",
};

export async function getHomeworkSupportConfig(_centerCode) {
  throw new Error("Backend contract required for Homework Support config API.");
}

export async function getHomeworkSupportDashboard(_centerCode) {
  throw new Error("Backend contract required for Homework Support dashboard API.");
}

export async function getHomeworkSupportBooking(_token) {
  throw new Error("Backend contract required for Homework Support booking lookup API.");
}

export async function submitHomeworkSupportBooking(_payload) {
  throw new Error("Backend contract required for Homework Support booking submission API.");
}

export async function resendHomeworkSupportBookingEmail(_bookingId) {
  throw new Error("Backend contract required for Homework Support resend email API.");
}

export async function updateHomeworkSupportBooking(_bookingId, _payload) {
  throw new Error("Backend contract required for Homework Support manual booking management API.");
}
