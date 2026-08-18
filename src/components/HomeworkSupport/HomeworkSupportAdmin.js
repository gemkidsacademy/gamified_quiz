import React, { useEffect, useState } from "react";
import "./homeworkSupport.css";
import {
  getHomeworkSupportConfig,
  getHomeworkSupportDashboard,
  sampleHomeworkSupportConfig,
  sampleHomeworkSupportDashboard,
  resendHomeworkSupportBookingEmail,
  updateHomeworkSupportBooking,
} from "../../services/homeworkSupportApi";

const createMockWeeks = (termId, firstMonday) => Array.from({ length: 5 }, (_, index) => {
  const start = new Date(`${firstMonday}T00:00:00Z`);
  start.setUTCDate(start.getUTCDate() + (index * 7));
  const end = new Date(start);
  end.setUTCDate(end.getUTCDate() + 6);
  const saturday = new Date(start);
  saturday.setUTCDate(saturday.getUTCDate() + 5);

  return {
    id: `${termId}-week-${index + 1}`,
    week_number: index + 1,
    start_date: start.toISOString().slice(0, 10),
    end_date: end.toISOString().slice(0, 10),
    saturday_session_date: saturday.toISOString().slice(0, 10),
  };
});

const MOCK_ACADEMIC_TERMS = [
  {
    id: "term-1-2026",
    name: "Term 1 2026",
    weeks: createMockWeeks("term-1", "2026-01-05"),
  },
  {
    id: "term-2-2026",
    name: "Term 2 2026",
    weeks: [
      { id: "term-2-week-1", week_number: 1, start_date: "2026-08-24", end_date: "2026-08-30", saturday_session_date: "2026-08-29" },
      { id: "term-2-week-2", week_number: 2, start_date: "2026-08-31", end_date: "2026-09-06", saturday_session_date: "2026-09-05" },
      { id: "term-2-week-3", week_number: 3, start_date: "2026-09-07", end_date: "2026-09-13", saturday_session_date: "2026-09-12" },
      { id: "term-2-week-4", week_number: 4, start_date: "2026-09-14", end_date: "2026-09-20", saturday_session_date: "2026-09-19" },
      { id: "term-2-week-5", week_number: 5, start_date: "2026-09-21", end_date: "2026-09-27", saturday_session_date: "2026-09-26" },
    ],
  },
  {
    id: "term-3-2026",
    name: "Term 3 2026",
    weeks: createMockWeeks("term-3", "2026-10-05"),
  },
  {
    id: "term-4-2026",
    name: "Term 4 2026",
    weeks: createMockWeeks("term-4", "2026-11-02"),
  },
];

const formatCalendarDate = (date) => new Intl.DateTimeFormat("en-US", {
  weekday: "long",
  month: "long",
  day: "numeric",
  year: "numeric",
  timeZone: "UTC",
}).format(new Date(`${date}T00:00:00Z`));

const AUTOMATION_EMAIL_STATUSES = {
  1: "Scheduled",
  2: "Sent",
  3: "Cancelled/Disabled",
  4: "Not Sent",
  5: "Scheduled",
};

export default function HomeworkSupportAdmin({ loggedInUser }) {
  const [activeView, setActiveView] = useState("config");
  const [config, setConfig] = useState(sampleHomeworkSupportConfig);
  const [selectedTermId, setSelectedTermId] = useState("term-2-2026");
  const [selectedConfigWeekId, setSelectedConfigWeekId] = useState("term-2-week-1");
  const [weekSlotConfigurations, setWeekSlotConfigurations] = useState(() => (
    Object.fromEntries(
      MOCK_ACADEMIC_TERMS[1].weeks.map((week) => [week.id, sampleHomeworkSupportConfig.slots])
    )
  ));
  const [dashboard, setDashboard] = useState(sampleHomeworkSupportDashboard);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [slotFormOpen, setSlotFormOpen] = useState(false);
  const [editingSlotId, setEditingSlotId] = useState(null);
  const [slotDraft, setSlotDraft] = useState({
    startTime: "09:00",
    endTime: "09:30",
    capacity: 8,
  });
  const [automationSettings, setAutomationSettings] = useState({
    invitationsEnabled: true,
    invitationDay: "Monday",
    invitationTime: "9:00 AM",
    responseDay: "Wednesday",
    responseTime: "11:59 PM",
  });
  const [automationSaved, setAutomationSaved] = useState(false);

  useEffect(() => {
    if (!loggedInUser?.center_code) {
      return;
    }

    loadHomeworkSupportData();
  }, [loggedInUser]);

  const loadHomeworkSupportData = async () => {
    setLoading(true);
    setError("");

    try {
      const [configResponse, dashboardResponse] = await Promise.all([
        getHomeworkSupportConfig(loggedInUser.center_code).catch(() => sampleHomeworkSupportConfig),
        getHomeworkSupportDashboard(loggedInUser.center_code).catch(() => sampleHomeworkSupportDashboard),
      ]);

      setConfig(configResponse || sampleHomeworkSupportConfig);
      setDashboard(dashboardResponse || sampleHomeworkSupportDashboard);
    } catch (err) {
      console.error("Failed to load Homework Support data:", err);
      setError("The Homework Support backend contract is not available yet. This UI is ready for the contract once provided.");
      setConfig(sampleHomeworkSupportConfig);
      setDashboard(sampleHomeworkSupportDashboard);
    } finally {
      setLoading(false);
    }
  };

  const handleManualBookingUpdate = async (bookingId, action) => {
    try {
      await updateHomeworkSupportBooking(bookingId, { action });
      await loadHomeworkSupportData();
    } catch (err) {
      console.error("Manual update failed:", err);
      setError("Manual booking action is pending backend contract support.");
    }
  };

  const handleResendEmail = async (bookingId) => {
    try {
      await resendHomeworkSupportBookingEmail(bookingId);
      await loadHomeworkSupportData();
    } catch (err) {
      console.error("Resend email failed:", err);
      setError("Resend email is pending backend contract support.");
    }
  };

  const handleAddSlot = () => {
    if (!slotDraft.startTime || !slotDraft.endTime || !slotDraft.capacity) {
      setError("Please complete all slot fields before adding a time slot.");
      return;
    }

    setError("");
    const newSlot = {
      id: Date.now(),
      label: `${slotDraft.startTime} - ${slotDraft.endTime}`,
      capacity: Number(slotDraft.capacity),
      booked: 0,
      available: Number(slotDraft.capacity),
      isClosed: false,
    };

    setWeekSlotConfigurations((current) => ({
      ...current,
      [selectedConfigWeekId]: [...(current[selectedConfigWeekId] || []), newSlot],
    }));
    setSlotDraft({ startTime: "09:00", endTime: "09:30", capacity: 8 });
    setSlotFormOpen(false);
  };

  const handleEditSlot = (slot) => {
    setEditingSlotId(slot.id);
    setSlotDraft({
      startTime: slot.startTime || "09:00",
      endTime: slot.endTime || "09:30",
      capacity: slot.capacity || 8,
    });
    setSlotFormOpen(true);
  };

  const handleSaveEditedSlot = () => {
    if (!editingSlotId) return;

    setWeekSlotConfigurations((current) => ({
      ...current,
      [selectedConfigWeekId]: (current[selectedConfigWeekId] || []).map((slot) => {
        if (slot.id !== editingSlotId) return slot;

        const updatedCapacity = Number(slotDraft.capacity);
        const safeBooked = Math.min(slot.booked || 0, updatedCapacity);

        return {
          ...slot,
          label: `${slotDraft.startTime} - ${slotDraft.endTime}`,
          capacity: updatedCapacity,
          booked: safeBooked,
          available: Math.max(updatedCapacity - safeBooked, 0),
          startTime: slotDraft.startTime,
          endTime: slotDraft.endTime,
        };
      }),
    }));

    setEditingSlotId(null);
    setSlotDraft({ startTime: "09:00", endTime: "09:30", capacity: 8 });
    setSlotFormOpen(false);
  };

  const handleRemoveSlot = (slot) => {
    const hasBookings = (slot.booked || 0) > 0;

    const confirmed = window.confirm(
      hasBookings
        ? "This slot currently has bookings. Are you sure you want to remove it?"
        : "Remove this slot from the configured Homework Support slots?"
    );

    if (!confirmed) return;

    setWeekSlotConfigurations((current) => ({
      ...current,
      [selectedConfigWeekId]: (current[selectedConfigWeekId] || []).filter((item) => item.id !== slot.id),
    }));
  };

  const formatTimeLabel = (time) => {
    if (!time) return "";
    const [hours, minutes] = time.split(":");
    const hour = Number(hours);
    const suffix = hour >= 12 ? "PM" : "AM";
    const normalizedHour = hour % 12 || 12;
    return `${normalizedHour}:${minutes} ${suffix}`;
  };

  const handleToggleSlotClosed = (slotId) => {
    setWeekSlotConfigurations((current) => ({
      ...current,
      [selectedConfigWeekId]: (current[selectedConfigWeekId] || []).map((slot) => {
        if (slot.id !== slotId) return slot;
        return {
          ...slot,
          isClosed: !slot.isClosed,
        };
      }),
    }));
  };

  const handlePreviewParentBooking = () => {
    window.open("/parent-homework-support", "_blank", "noopener,noreferrer");
  };

  const selectedAcademicTerm = MOCK_ACADEMIC_TERMS.find((term) => term.id === selectedTermId) || MOCK_ACADEMIC_TERMS[1];
  const selectedAcademicWeeks = selectedAcademicTerm.weeks.filter((week) => (config.selectedWeeks || []).includes(week.week_number));
  const activeConfigWeek = selectedAcademicWeeks.find((week) => week.id === selectedConfigWeekId) || selectedAcademicWeeks[0];
  const activeWeekSlots = activeConfigWeek
    ? (weekSlotConfigurations[activeConfigWeek.id] || config.slots || [])
    : [];

  const handleAcademicTermChange = (event) => {
    const term = MOCK_ACADEMIC_TERMS.find((item) => item.id === event.target.value);
    if (!term) return;

    setSelectedTermId(term.id);
    setSelectedConfigWeekId(null);
    setConfig((current) => ({
      ...current,
      termName: term.name,
      selectedWeeks: [],
    }));
  };

  const handleHomeworkWeekChange = (event) => {
  const weekNumber = Number(event.target.value);

  if (!weekNumber) return;

  setConfig((current) => {
    const currentWeeks = current.selectedWeeks || [];

    if (currentWeeks.includes(weekNumber)) {
      return current;
    }

    return {
      ...current,
      selectedWeeks: [...currentWeeks, weekNumber],
    };
  });

    setSelectedConfigWeekId(selectedAcademicTerm.weeks.find((week) => week.week_number === weekNumber)?.id || null);

  event.target.value = "";
};

const handleRemoveHomeworkWeek = (weekNumber) => {
  setConfig((current) => ({
    ...current,
    selectedWeeks: (current.selectedWeeks || []).filter(
      (week) => week !== weekNumber
    ),
  }));
};

  const selectedAutomationWeeks = selectedAcademicWeeks.map((week) => ({
    week: week.week_number,
    sessionDate: formatCalendarDate(week.saturday_session_date),
    invitationDate: formatCalendarDate(week.start_date),
    invitationTime: automationSettings.invitationTime,
    emailStatus: AUTOMATION_EMAIL_STATUSES[week.week_number] || "Scheduled",
  }));

  const updateAutomationSetting = (field, value) => {
    setAutomationSaved(false);
    setAutomationSettings((current) => ({ ...current, [field]: value }));
  };

  const handleSaveAutomationSettings = () => {
    setAutomationSaved(true);
  };

  const handleDashboardAction = (action) => {
    setError(`${action} is available for this client demonstration.`);
  };

  return (
    <div className="hw-support-page">
      <div className="hw-support-header">
        <h2>Homework Support</h2>
        <span className="hw-support-status-badge">Frontend scaffold</span>
      </div>

      <button
        className="hw-support-button"
        onClick={handlePreviewParentBooking}
        type="button"
      >
        Preview Parent Booking Form
      </button>

      {error && <div className="hw-support-alert">{error}</div>}

      <div className="hw-support-grid">
        <button
          className="hw-support-button-ghost"
          onClick={() => setActiveView("config")}
          type="button"
        >
          Configuration
        </button>
        <button
          className="hw-support-button-ghost"
          onClick={() => setActiveView("dashboard")}
          type="button"
        >
          Weekly Dashboard
        </button>
        <button
          className="hw-support-button-ghost"
          onClick={() => setActiveView("automation")}
          type="button"
        >
          Automation
        </button>
      </div>

      {loading ? (
        <div className="hw-support-callout">Loading Homework Support data...</div>
      ) : activeView === "config" ? (
        <div className="hw-support-card">
          <h3>Homework Support Configuration</h3>
          <div className="hw-support-form">
            <p className="hw-support-callout">
              Academic terms and their weeks already exist. Select the weeks that should have Homework Support sessions.
            </p>

            <label>
              Academic Term
              <select value={selectedAcademicTerm.id} onChange={handleAcademicTermChange}>
                {MOCK_ACADEMIC_TERMS.map((term) => <option key={term.id} value={term.id}>{term.name}</option>)}
              </select>
            </label>

            <label>
  Select Homework Support Week

  <select
    defaultValue=""
    onChange={handleHomeworkWeekChange}
  >
    <option value="" disabled>
      Select a week
    </option>

    {selectedAcademicTerm.weeks
      .filter(
        (week) =>
          !(config.selectedWeeks || []).includes(week.week_number)
      )
      .map((week) => (
        <option
          key={week.id}
          value={week.week_number}
        >
          Week {week.week_number}
        </option>
      ))}
  </select>
</label>

            <p className="hw-support-selection-hint">
              Select the existing academic weeks that will have Homework Support.
            </p>

            <div className="hw-support-selected-sessions">
  <strong>Selected Homework Support Sessions</strong>

  {selectedAcademicWeeks.length ? (
    selectedAcademicWeeks.map((week) => (
      <div
        className="hw-support-selected-session"
        key={week.id}
      >
        <strong>Week {week.week_number}</strong>

        <span>Saturday Session</span>

        <span>
          {formatCalendarDate(week.saturday_session_date)}
        </span>

        <button
          type="button"
          className="hw-support-button-ghost"
          onClick={() =>
            handleRemoveHomeworkWeek(week.week_number)
          }
        >
          Remove
        </button>
      </div>
    ))
  ) : (
    <span className="hw-support-selection-hint">
      Select a week to view its existing Saturday session date.
    </span>
  )}
</div>

            <div className="hw-support-card hw-support-week-slots">
              <h4>Time Slots and Capacity</h4>
              <p className="hw-support-callout">
                Configure slots independently for each selected Homework Support week.
              </p>
              {activeConfigWeek ? (
                <>
                  <strong>Week {activeConfigWeek.week_number} · {formatCalendarDate(activeConfigWeek.saturday_session_date)}</strong>
                  <div className="hw-support-actions">
                    <button
                      className="hw-support-button"
                      type="button"
                      onClick={() => {
                        setSelectedConfigWeekId(activeConfigWeek.id);
                        setSlotFormOpen(true);
                        setEditingSlotId(null);
                        setSlotDraft({ startTime: "09:00", endTime: "09:30", capacity: 8 });
                      }}
                    >
                      Add Time Slot
                    </button>
                  </div>

                  {slotFormOpen && (
                    <div className="hw-support-form">
                      <label>
                        Start Time
                        <input
                          type="time"
                          value={slotDraft.startTime}
                          onChange={(event) => setSlotDraft((current) => ({ ...current, startTime: event.target.value }))}
                        />
                      </label>
                      <label>
                        End Time
                        <input
                          type="time"
                          value={slotDraft.endTime}
                          onChange={(event) => setSlotDraft((current) => ({ ...current, endTime: event.target.value }))}
                        />
                      </label>
                      <label>
                        Maximum Capacity
                        <input
                          type="number"
                          min="1"
                          value={slotDraft.capacity}
                          onChange={(event) => setSlotDraft((current) => ({ ...current, capacity: Number(event.target.value) }))}
                        />
                      </label>
                      <div className="hw-support-actions">
                        <button className="hw-support-button-ghost" type="button" onClick={() => setSlotFormOpen(false)}>Cancel</button>
                        <button className="hw-support-button" type="button" onClick={editingSlotId ? handleSaveEditedSlot : handleAddSlot}>
                          {editingSlotId ? "Save Time Slot" : "Add Time Slot"}
                        </button>
                      </div>
                    </div>
                  )}

                  <div className="hw-support-slot-list">
                    {activeWeekSlots.map((slot) => (
                      <div key={slot.id} className="hw-support-slot">
                        <strong>{slot.label || `${slot.startTime} - ${slot.endTime}`}</strong>
                        <span>Maximum capacity: {slot.capacity}</span>
                        <div className="hw-support-actions">
                          <button className="hw-support-button-ghost" type="button" onClick={() => handleEditSlot(slot)}>Edit Time Slot</button>
                          <button className="hw-support-button-ghost" type="button" onClick={() => handleRemoveSlot(slot)}>Remove Time Slot</button>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="hw-support-empty">Select a Homework Support week to configure its slots.</div>
              )}
            </div>

            <label>
              Booking Cut-off
              <input value={config.bookingCutoff || "Awaiting backend contract"} readOnly />
            </label>
          </div>

          

          <div className="hw-support-actions">
            <button className="hw-support-button" type="button">
              Save Configuration
            </button>
          </div>
        </div>
      ) : activeView === "automation" ? (
        <div className="hw-support-automation">
          <div className="hw-support-card">
            <h3>Automatic Parent Invitations</h3>
            <div className="hw-support-form">
              <label className="hw-support-toggle-row">
                <span>Enable automatic invitations</span>
                <input
                  type="checkbox"
                  checked={automationSettings.invitationsEnabled}
                  onChange={(event) => updateAutomationSetting("invitationsEnabled", event.target.checked)}
                />
                <strong>{automationSettings.invitationsEnabled ? "ON" : "OFF"}</strong>
              </label>

              <label>
                Invitation day
                <select
                  value={automationSettings.invitationDay}
                  onChange={(event) => updateAutomationSetting("invitationDay", event.target.value)}
                >
                  {[
                    "Monday",
                    "Tuesday",
                    "Wednesday",
                    "Thursday",
                    "Friday",
                  ].map((day) => <option key={day}>{day}</option>)}
                </select>
              </label>

              <label>
                Invitation time
                <select
                  value={automationSettings.invitationTime}
                  onChange={(event) => updateAutomationSetting("invitationTime", event.target.value)}
                >
                  {["8:00 AM", "9:00 AM", "10:00 AM", "12:00 PM", "3:00 PM"].map((time) => <option key={time}>{time}</option>)}
                </select>
              </label>
            </div>
            <p className="hw-support-callout hw-support-automation-note">
              Invitation day and time are configurable by the administrator.
            </p>
          </div>

          <div className="hw-support-card">
            <h3>Homework Support Email Schedule</h3>
            <p className="hw-support-automation-note">
              These are the Homework Support weeks selected in Configuration.
            </p>
            <h4>{config.termName || "Term 2 2026"}</h4>
            <div className="hw-support-automation-weeks">
              {selectedAutomationWeeks.length ? selectedAutomationWeeks.map(({ week, sessionDate, invitationDate, invitationTime, emailStatus }) => (
                <div className="hw-support-automation-week" key={week}>
                  <strong>Week {week}</strong>
                  <span>Saturday/session: {sessionDate}</span>
                  <span>Invitation: {invitationDate} at {invitationTime}</span>
                  <span className="hw-support-email-status">Email status: {emailStatus}</span>
                </div>
              )) : <div className="hw-support-empty">No Homework Support weeks are selected in Configuration.</div>}
            </div>
          </div>

          <div className="hw-support-card">
            <h3>Parent Response Deadline</h3>
            <div className="hw-support-form">
              <label>
                Responses close on
                <select
                  value={automationSettings.responseDay}
                  onChange={(event) => updateAutomationSetting("responseDay", event.target.value)}
                >
                  {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"].map((day) => <option key={day}>{day}</option>)}
                </select>
              </label>

              <label>
                Response deadline time
                <select
                  value={automationSettings.responseTime}
                  onChange={(event) => updateAutomationSetting("responseTime", event.target.value)}
                >
                  {["5:00 PM", "6:00 PM", "9:00 PM", "11:59 PM"].map((time) => <option key={time}>{time}</option>)}
                </select>
              </label>
            </div>
            <p className="hw-support-callout hw-support-automation-note">
              Parents will not be able to submit or change their response after the response deadline.
            </p>
          </div>

          <div className="hw-support-automation-summary">
            <h3>Homework Support Automation</h3>
            <p><strong>Invitation:</strong> {automationSettings.invitationDay} at {automationSettings.invitationTime}</p>
            <p><strong>Response deadline:</strong> {automationSettings.responseDay} at {automationSettings.responseTime}</p>
            <div>
              <strong>Upcoming Homework Support:</strong>
              {selectedAutomationWeeks.length ? (
                <ul>
                  {selectedAutomationWeeks.map(({ week }) => <li key={week}>Week {week}</li>)}
                </ul>
              ) : <p>No weeks selected</p>}
            </div>
          </div>

          {automationSaved && <div className="hw-support-success" role="status">Automation settings saved.</div>}
          <button className="hw-support-button" type="button" onClick={handleSaveAutomationSettings}>
            Save Automation Settings
          </button>
        </div>
      ) : (
        <div className="hw-support-card">
          <h3>Homework Support Weekly Dashboard</h3>

          <div className="hw-support-grid">
            <div className="hw-support-card">
              <h4>Total Students</h4>
              <p>{dashboard.totals?.totalStudents ?? 0}</p>
            </div>
            <div className="hw-support-card">
              <h4>Attending</h4>
              <p>{dashboard.totals?.attending ?? 0}</p>
            </div>
            <div className="hw-support-card">
              <h4>Not Attending</h4>
              <p>{dashboard.totals?.notAttending ?? 0}</p>
            </div>
            <div className="hw-support-card">
              <h4>No Response</h4>
              <p>{dashboard.totals?.noResponse ?? 0}</p>
            </div>
          </div>

          <h4 style={{ marginTop: 20 }}>Slot Capacity Status</h4>
          <table className="hw-support-table">
            <thead>
              <tr>
                <th>Slot</th>
                <th>Capacity</th>
                <th>Booked</th>
                <th>Available</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {(dashboard.slots || []).map((slot) => (
                <tr key={slot.id}>
                  <td>{slot.label}</td>
                  <td>{slot.capacity}</td>
                  <td>{slot.booked}</td>
                  <td>{slot.available}</td>
                  <td>{slot.status}</td>
                  <td>
                    <div className="hw-support-actions">
                      <button
                        className="hw-support-button-ghost"
                        type="button"
                        onClick={() => handleManualBookingUpdate(slot.id, "change-slot")}
                      >
                        Change Slot
                      </button>
                      <button
                        className={slot.status === "Closed" ? "hw-support-button-ghost" : "hw-support-button"}
                        type="button"
                        onClick={() => handleToggleSlotClosed(slot.id)}
                      >
                        {slot.status === "Closed" ? "Reopen Slot" : "Close Slot"}
                      </button>
                      <button
                        className="hw-support-button-ghost"
                        type="button"
                        onClick={() => handleDashboardAction("Edit Capacity")}
                      >
                        Edit Capacity
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="hw-support-dashboard-section-heading">
            <h4>Student Responses</h4>
            <button className="hw-support-button" type="button" onClick={() => handleDashboardAction("Add Student")}>
              Add Student
            </button>
          </div>
          {(dashboard.studentResponses || []).length === 0 ? (
            <div className="hw-support-empty">No student responses yet.</div>
          ) : (
            <table className="hw-support-table">
              <thead>
                <tr>
                  <th>Student ID</th>
                  <th>Name</th>
                  <th>Parent Email</th>
                  <th>Status</th>
                  <th>Slot</th>
                  <th>Response Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {(dashboard.studentResponses || []).map((row) => (
                  <tr key={row.studentId}>
                    <td>{row.studentId}</td>
                    <td>{row.name}</td>
                    <td>{row.parentEmail || "-"}</td>
                    <td>{row.status}</td>
                    <td>{row.slot || "-"}</td>
                    <td>{row.responseDate || "-"}</td>
                    <td>
                      <div className="hw-support-actions">
                        {row.status === "No Response" && (
                          <button
                            className="hw-support-button-ghost"
                            type="button"
                            onClick={() => handleResendEmail(row.studentId)}
                          >
                            Resend Email
                          </button>
                        )}
                        {row.status === "Attending" && (
                          <>
                            <button className="hw-support-button-ghost" type="button" onClick={() => handleDashboardAction("Change Slot")}>Change Slot</button>
                            <button className="hw-support-button-ghost" type="button" onClick={() => handleDashboardAction("Mark Not Attending")}>Mark Not Attending</button>
                            <button className="hw-support-button-ghost" type="button" onClick={() => handleDashboardAction("Cancel/Remove Booking")}>Cancel/Remove Booking</button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
}
