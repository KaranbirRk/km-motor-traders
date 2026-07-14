"use client";

import React, { useState } from "react";
import { InventoryCar } from "../types";

interface Props {
  car: InventoryCar;
}

type Status = "idle" | "submitting" | "success" | "error";

function isFallbackVehicleId(id: string): boolean {
  return /^(inv|saas)-/.test(id);
}

export default function VehicleEnquiryForm({ car }: Props) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [company, setCompany] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const vehicleInterest = `${car.year} ${car.make} ${car.model}`;

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

    setStatus("submitting");
    setErrorMessage("");

    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          email: email.trim(),
          phone: phone.trim(),
          notes: notes.trim(),
          company,
          vehicleId: isFallbackVehicleId(car.id) ? undefined : car.id,
          vehicleInterest,
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
      <div className="border border-border bg-white p-6 text-center">
        <p className="font-display text-lg uppercase tracking-wide text-ink mb-2">
          Enquiry Sent
        </p>
        <p className="text-sm text-ink-muted">
          Thanks {firstName || "there"} — we&apos;ll be in touch about the {vehicleInterest}.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="border border-border bg-white">
      <div className="bg-ink text-white px-5 py-3">
        <p className="font-display text-sm tracking-[0.18em] uppercase">
          Enquire on this car
        </p>
      </div>

      <div className="p-5 space-y-3">
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

        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={3}
          placeholder={`Any questions about this ${vehicleInterest}?`}
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
          {status === "submitting" ? "Sending…" : "Send Enquiry"}
        </button>
      </div>
    </form>
  );
}
