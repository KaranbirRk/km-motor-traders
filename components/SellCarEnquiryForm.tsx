"use client";

import React, { useState } from "react";

type Status = "idle" | "submitting" | "success" | "error";

const CONDITIONS = ["Excellent", "Good", "Fair", "Needs Work"] as const;

export default function SellCarEnquiryForm() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [make, setMake] = useState("");
  const [model, setModel] = useState("");
  const [year, setYear] = useState("");
  const [kms, setKms] = useState("");
  const [condition, setCondition] = useState("");
  const [notes, setNotes] = useState("");
  const [company, setCompany] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const vehicleLabel = [year.trim(), make.trim(), model.trim()].filter(Boolean).join(" ");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!firstName.trim()) {
      setStatus("error");
      setErrorMessage("Please enter your first name.");
      return;
    }
    if (!email.trim() && !phone.trim()) {
      setStatus("error");
      setErrorMessage("Please provide an email or phone number so we can respond.");
      return;
    }
    if (!make.trim() || !model.trim() || !year.trim()) {
      setStatus("error");
      setErrorMessage("Please enter your vehicle make, model, and year.");
      return;
    }
    if (!kms.trim()) {
      setStatus("error");
      setErrorMessage("Please enter the odometer (kms).");
      return;
    }
    if (!condition) {
      setStatus("error");
      setErrorMessage("Please select the vehicle condition.");
      return;
    }

    setStatus("submitting");
    setErrorMessage("");

    const structuredNotes = [
      "Sell enquiry details:",
      `Make: ${make.trim()}`,
      `Model: ${model.trim()}`,
      `Year: ${year.trim()}`,
      `KMs: ${kms.trim()}`,
      `Condition: ${condition}`,
      notes.trim() ? `Message: ${notes.trim()}` : null,
    ]
      .filter(Boolean)
      .join("\n");

    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          email: email.trim(),
          phone: phone.trim(),
          company,
          vehicleInterest: `Sell enquiry: ${vehicleLabel}`,
          notes: structuredNotes,
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (res.ok && data.success) {
        setStatus("success");
      } else {
        setStatus("error");
        setErrorMessage(data.message ?? "Something went wrong. Please try again.");
      }
    } catch {
      setStatus("error");
      setErrorMessage("Network error — please try again.");
    }
  };

  if (status === "success") {
    return (
      <div className="bg-white border border-border p-6 text-center">
        <p className="font-display text-lg uppercase tracking-wide text-ink mb-2">
          Quote Request Sent
        </p>
        <p className="text-sm text-ink-muted">
          Thanks {firstName || "there"} — we&apos;ll get back to you about your{" "}
          {vehicleLabel || "vehicle"}.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white border border-border p-5 sm:p-6 space-y-3">
      <p className="font-display text-sm tracking-[0.18em] uppercase text-ink mb-1">
        Get a valuation
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <input
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          maxLength={80}
          placeholder="First Name *"
          className="input-km"
        />
        <input
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          maxLength={80}
          placeholder="Last Name"
          className="input-km"
        />
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className="input-km"
        />
        <input
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          maxLength={40}
          placeholder="Phone"
          className="input-km"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <input
          value={make}
          onChange={(e) => setMake(e.target.value)}
          maxLength={80}
          placeholder="Make *"
          className="input-km"
        />
        <input
          value={model}
          onChange={(e) => setModel(e.target.value)}
          maxLength={80}
          placeholder="Model *"
          className="input-km"
        />
        <input
          value={year}
          onChange={(e) => setYear(e.target.value)}
          inputMode="numeric"
          maxLength={4}
          placeholder="Year *"
          className="input-km"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <input
          value={kms}
          onChange={(e) => setKms(e.target.value)}
          inputMode="numeric"
          maxLength={12}
          placeholder="Odometer (kms) *"
          className="input-km"
        />
        <select
          value={condition}
          onChange={(e) => setCondition(e.target.value)}
          className={`input-km ${condition ? "text-ink" : "text-[#9a968c]"}`}
        >
          <option value="" disabled>
            Condition *
          </option>
          {CONDITIONS.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      <textarea
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        rows={3}
        placeholder="Anything else we should know? (optional)"
        className="input-km resize-none"
      />

      <input
        type="text"
        value={company}
        onChange={(e) => setCompany(e.target.value)}
        name="company"
        tabIndex={-1}
        autoComplete="off"
        className="hidden"
        aria-hidden="true"
      />

      {status === "error" && (
        <p className="text-red-700 text-xs font-medium">{errorMessage}</p>
      )}

      <button
        type="submit"
        disabled={status === "submitting"}
        className="w-full bg-brand text-ink py-3.5 text-xs font-semibold uppercase tracking-[0.18em] hover:bg-brand-hover transition-colors disabled:opacity-60 rounded-sm"
      >
        {status === "submitting" ? "Sending…" : "Request my offer"}
      </button>
    </form>
  );
}
