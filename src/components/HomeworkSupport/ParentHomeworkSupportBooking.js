import React, { useState } from "react";
import "./homeworkSupport.css";

const MOCK_DATA = {
  registeredEmail: "parent@example.com",
  studentName: "Ali Khan",
  week: 5,
  date: "Saturday, September 12, 2026",
  slots: [
    { id: "slot-1", time: "10:00 AM – 12:00 PM", available: 6 },
    { id: "slot-2", time: "12:00 PM – 2:00 PM", available: 0 },
    { id: "slot-3", time: "2:00 PM – 4:00 PM", available: 7 },
  ],
};

function SessionSummary({ showWeek = false }) {
  return (
    <div className="hw-parent-session">
      {showWeek && <strong>Homework Support — Week {MOCK_DATA.week}</strong>}
      <span>{MOCK_DATA.date}</span>
      <span><strong>Student:</strong> {MOCK_DATA.studentName}</span>
    </div>
  );
}

function PageCard({ title, children }) {
  return (
    <div className="hw-support-page hw-parent-page">
      <main className="hw-support-card hw-parent-card">
        <h2>{title}</h2>
        {children}
      </main>
    </div>
  );
}

function SlotList({ selectedSlotId, onSelect }) {
  return (
    <div className="hw-parent-slot-list" role="radiogroup" aria-label="Homework Support time slots">
      {MOCK_DATA.slots.map((slot) => {
        const isFull = slot.available === 0;
        const isSelected = selectedSlotId === slot.id;

        return (
          <button
            key={slot.id}
            type="button"
            className={`hw-parent-slot ${isSelected ? "selected" : ""} ${isFull ? "full" : ""}`}
            onClick={() => !isFull && onSelect(slot.id)}
            disabled={isFull}
            role="radio"
            aria-checked={isSelected}
          >
            <span className="hw-parent-slot-time">{slot.time}</span>
            <span className="hw-parent-slot-availability">
              {isFull ? "FULL" : `${slot.available} places available`}
            </span>
          </button>
        );
      })}
    </div>
  );
}

export default function ParentHomeworkSupportBooking() {
  const [step, setStep] = useState("email-verification");
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [selectedSlotId, setSelectedSlotId] = useState(null);
  const [existingSlotId, setExistingSlotId] = useState("slot-1");

  const selectedSlot = MOCK_DATA.slots.find((slot) => slot.id === selectedSlotId);
  const existingSlot = MOCK_DATA.slots.find((slot) => slot.id === existingSlotId);

  const verifyEmail = (event) => {
    event.preventDefault();
    if (email.trim().toLowerCase() !== MOCK_DATA.registeredEmail) {
      setEmailError("The email address does not match our records. Please enter the registered parent email address.");
      return;
    }

    setEmailError("");
    setStep("attendance");
  };

  const reset = () => {
    setEmail("");
    setEmailError("");
    setSelectedSlotId(null);
    setStep("email-verification");
  };

  if (step === "email-verification") {
    return (
      <PageCard title="Homework Support">
        <SessionSummary showWeek />
        <p className="hw-parent-prompt">Please confirm your registered parent email address to continue.</p>
        {emailError && <div className="hw-support-alert" role="alert">{emailError}</div>}
        <form className="hw-support-form" onSubmit={verifyEmail}>
          <label htmlFor="parent-email">Registered parent email</label>
          <input
            id="parent-email"
            type="email"
            value={email}
            onChange={(event) => {
              setEmail(event.target.value);
              setEmailError("");
            }}
            autoComplete="email"
            required
          />
          <button className="hw-support-button" type="submit">Continue</button>
        </form>
      </PageCard>
    );
  }

  if (step === "attendance") {
    return (
      <PageCard title="Homework Support">
        <SessionSummary showWeek />
        <p className="hw-parent-question">Will {MOCK_DATA.studentName} be attending Homework Support?</p>
        <div className="hw-parent-actions">
          <button className="hw-support-button" type="button" onClick={() => setStep("slots")}>Yes, my child will attend</button>
          <button className="hw-support-button-secondary" type="button" onClick={() => setStep("not-attending")}>No, my child will not attend</button>
        </div>
        <button className="hw-parent-text-button" type="button" onClick={() => setStep("existing")}>Already responded? View or change response</button>
      </PageCard>
    );
  }

  if (step === "not-attending") {
    return (
      <PageCard title="Not Attending">
        <p className="hw-parent-message">Thank you for letting us know.</p>
        <p className="hw-parent-detail">You have indicated that {MOCK_DATA.studentName} will not attend Homework Support this week.</p>
        <button className="hw-support-button hw-parent-full-button" type="button" onClick={() => setStep("not-attending-confirmed")}>Submit Response</button>
      </PageCard>
    );
  }

  if (step === "not-attending-confirmed") {
    return (
      <PageCard title="Response Recorded">
        <p className="hw-parent-message">Thank you. Your response has been recorded.</p>
        <div className="hw-parent-status"><span>Status</span><strong>Not Attending</strong></div>
        <button className="hw-support-button hw-parent-full-button" type="button" onClick={reset}>Done</button>
      </PageCard>
    );
  }

  if (step === "slots") {
    return (
      <PageCard title="Select a time">
        <p className="hw-parent-prompt">Please select a Homework Support time.</p>
        <div className="hw-parent-date-label"><strong>Saturday:</strong><span>{MOCK_DATA.date}</span></div>
        <SlotList selectedSlotId={selectedSlotId} onSelect={setSelectedSlotId} />
        <button className="hw-support-button hw-parent-full-button" type="button" disabled={!selectedSlot} onClick={() => setStep("booking-confirmed")}>Confirm Booking</button>
      </PageCard>
    );
  }

  if (step === "booking-confirmed") {
    return (
      <PageCard title="Booking Confirmed">
        <p className="hw-parent-message">{MOCK_DATA.studentName} is booked for Homework Support.</p>
        <div className="hw-parent-summary">
          <div><span>Saturday</span><strong>{MOCK_DATA.date}</strong></div>
          <div><span>Time</span><strong>{selectedSlot?.time}</strong></div>
          <div><span>Status</span><strong className="hw-parent-confirmed">Confirmed</strong></div>
        </div>
        <p className="hw-parent-note">A confirmation email will be sent to the registered parent email address.</p>
        <button className="hw-support-button hw-parent-full-button" type="button" onClick={reset}>Done</button>
      </PageCard>
    );
  }

  if (step === "existing") {
    return (
      <PageCard title="Homework Support">
        <SessionSummary />
        <div className="hw-parent-summary">
          <div><span>Current response</span><strong>Attending</strong></div>
          <div><span>Current time</span><strong>{existingSlot.time}</strong></div>
        </div>
        <div className="hw-parent-actions">
          <button className="hw-support-button" type="button" onClick={() => setStep("change-time")}>Change Time</button>
          <button className="hw-support-button-secondary" type="button" onClick={() => setStep("change-attendance")}>Change to Not Attending</button>
        </div>
      </PageCard>
    );
  }

  if (step === "change-time") {
    return (
      <PageCard title="Change your time">
        <p className="hw-parent-prompt">Please select a Homework Support time.</p>
        <div className="hw-parent-date-label"><strong>Saturday:</strong><span>{MOCK_DATA.date}</span></div>
        <SlotList selectedSlotId={existingSlotId} onSelect={setExistingSlotId} />
        <button className="hw-support-button hw-parent-full-button" type="button" onClick={() => setStep("changed-confirmed")}>Confirm Booking</button>
      </PageCard>
    );
  }

  if (step === "changed-confirmed") {
    return (
      <PageCard title="Booking Confirmed">
        <p className="hw-parent-message">{MOCK_DATA.studentName}'s Homework Support time has been updated.</p>
        <div className="hw-parent-summary"><div><span>New time</span><strong>{existingSlot.time}</strong></div><div><span>Status</span><strong className="hw-parent-confirmed">Confirmed</strong></div></div>
        <button className="hw-support-button hw-parent-full-button" type="button" onClick={() => setStep("existing")}>Done</button>
      </PageCard>
    );
  }

  if (step === "existing-not-attending") {
    return (
      <PageCard title="Change response">
        <p className="hw-parent-message">Are you sure you want to change {MOCK_DATA.studentName}'s response to Not Attending?</p>
        <p className="hw-parent-detail">This will cancel the current booking for {existingSlot.time}.</p>
        <div className="hw-parent-actions">
          <button className="hw-support-button" type="button" onClick={() => setStep("not-attending-confirmed")}>Yes, change response</button>
          <button className="hw-support-button-secondary" type="button" onClick={() => setStep("existing")}>Cancel</button>
        </div>
      </PageCard>
    );
  }

  return null;
}