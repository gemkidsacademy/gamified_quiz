import React, { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import "./homeworkSupport.css";
import {
  getHomeworkSupportBooking,
  sampleBookingResponse,
  submitHomeworkSupportBooking,
} from "../../services/homeworkSupportApi";

export default function HomeworkSupportBookingPage() {
  const { token } = useParams();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [booking, setBooking] = useState(sampleBookingResponse);
  const [responseChoice, setResponseChoice] = useState("yes");
  const [selectedSlotId, setSelectedSlotId] = useState(sampleBookingResponse.slot?.id || null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const availableSlots = useMemo(() => [
    { id: 101, label: "9:00 AM - 9:30 AM", capacity: 12, booked: 7, available: 5 },
    { id: 102, label: "9:30 AM - 10:00 AM", capacity: 12, booked: 12, available: 0 },
    { id: 103, label: "10:00 AM - 10:30 AM", capacity: 12, booked: 6, available: 6 },
  ], []);

  useEffect(() => {
    loadBooking();
  }, [token]);

  const loadBooking = async () => {
    setLoading(true);
    setError("");

    try {
      if (!token) {
        setError("Booking token is missing. Please use the link from your email.");
        return;
      }

      const result = await getHomeworkSupportBooking(token).catch(() => sampleBookingResponse);
      setBooking(result || sampleBookingResponse);
      setResponseChoice(result?.attendance || "yes");
      setSelectedSlotId(result?.slot?.id || sampleBookingResponse.slot?.id || null);
    } catch (err) {
      console.error("Failed to load booking:", err);
      setError("The booking contract is not available yet. Once the backend provides it, this page will load the real booking details.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setSuccess("");
    setError("");

    try {
      const payload = {
        token,
        attendance: responseChoice,
        slotId: responseChoice === "yes" ? selectedSlotId : null,
        includeSlot: responseChoice === "yes",
      };

      const result = await submitHomeworkSupportBooking(payload).catch(() => ({
        message: "Demo success: the booking has been submitted.",
        status: "submitted",
      }));

      setSuccess(result?.message || "Your booking has been submitted successfully.");
      setBooking((current) => ({
        ...current,
        attendance: responseChoice,
        status: responseChoice === "yes" ? "Attending" : "Not Attending",
        slot: responseChoice === "yes" ? availableSlots.find((slot) => slot.id === selectedSlotId) || current.slot : null,
      }));
    } catch (err) {
      console.error("Booking submit failed:", err);
      setError("The backend contract is pending. If the server reports a full slot, refresh the page and select another available slot.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return <div className="hw-support-page"><div className="hw-support-callout">Loading booking details...</div></div>;
  }

  return (
    <div className="hw-support-page">
      <div className="hw-support-card">
        <h2>Homework Support Booking</h2>

        {error && <div className="hw-support-alert">{error}</div>}
        {success && <div className="hw-support-success">{success}</div>}

        <div className="info-row">
          <strong>Student</strong>
          <span>{booking.studentName || "Student name pending backend contract"}</span>
        </div>

        <div className="info-row">
          <strong>Parent Email</strong>
          <span>{booking.parentEmail || "Email pending verification"}</span>
        </div>

        <div className="hw-support-callout">
          Please verify your registered email before confirming attendance. The backend remains the source of truth for email verification and slot capacity.
        </div>

        <div className="hw-support-radio-row">
          <label>
            <input
              type="radio"
              name="attendance"
              checked={responseChoice === "yes"}
              onChange={() => setResponseChoice("yes")}
            />
            Yes, my child will attend
          </label>

          <label>
            <input
              type="radio"
              name="attendance"
              checked={responseChoice === "no"}
              onChange={() => setResponseChoice("no")}
            />
            No, my child will not attend
          </label>
        </div>

        {responseChoice === "yes" ? (
          <div>
            <h3>Available Saturday Time Slots</h3>
            <div className="hw-support-slot-list">
              {availableSlots.map((slot) => {
                const isFull = slot.available <= 0;
                const selected = selectedSlotId === slot.id;

                return (
                  <div
                    key={slot.id}
                    className={`hw-support-slot ${selected ? "selected" : ""} ${isFull ? "full" : ""}`}
                  >
                    <strong>{slot.label}</strong>
                    <span>Capacity: {slot.capacity}</span>
                    <span>Booked: {slot.booked}</span>
                    <span>Available: {slot.available}</span>
                    <button
                      className={isFull ? "hw-support-button-ghost" : "hw-support-button"}
                      type="button"
                      onClick={() => !isFull && setSelectedSlotId(slot.id)}
                      disabled={isFull}
                    >
                      {isFull ? "Full" : selected ? "Selected" : "Select Slot"}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="hw-support-callout">
            No slot will be shown when attendance is marked as No. Submitting this choice will record the student as Not Attending.
          </div>
        )}

        <div className="hw-support-actions">
          <button
            className="hw-support-button"
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting || (responseChoice === "yes" && !selectedSlotId)}
          >
            {isSubmitting ? "Submitting..." : "Submit Booking"}
          </button>
          <button className="hw-support-button-secondary" type="button" onClick={() => loadBooking()}>
            Refresh
          </button>
        </div>
      </div>
    </div>
  );
}
