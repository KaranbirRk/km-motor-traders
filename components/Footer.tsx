import React from "react";
import Link from "next/link";
import { CONTACT_INFO } from "../constants";

const Footer: React.FC = () => {
  return (
    <footer className="bg-ink text-white">
      <div className="max-w-6xl mx-auto px-5 sm:px-8 py-14 grid grid-cols-1 md:grid-cols-3 gap-10">
        <div>
          <p className="font-display text-xl tracking-wide uppercase">
            KM Motor Traders
          </p>
          <p className="text-white/50 text-sm mt-2 max-w-xs leading-relaxed">
            {CONTACT_INFO.slogan}
          </p>
          <p className="text-brand text-xs font-semibold tracking-[0.2em] uppercase mt-4">
            {CONTACT_INFO.lmct}
          </p>
        </div>

        <div>
          <p className="font-display text-sm tracking-[0.2em] uppercase text-white/40 mb-4">
            Visit
          </p>
          <p className="text-sm leading-relaxed text-white/80">
            {CONTACT_INFO.address}
          </p>
          <p className="text-sm text-white/55 mt-3">{CONTACT_INFO.hoursWeekday}</p>
          <p className="text-sm text-white/55">{CONTACT_INFO.hoursSunday}</p>
        </div>

        <div>
          <p className="font-display text-sm tracking-[0.2em] uppercase text-white/40 mb-4">
            Contact
          </p>
          <a
            href={`tel:${CONTACT_INFO.phoneTel}`}
            className="inline-block text-2xl font-display tracking-wide text-brand hover:text-white transition-colors"
          >
            {CONTACT_INFO.phone}
          </a>
          <div className="flex gap-4 mt-6">
            <a
              href="#"
              aria-label="Facebook"
              className="w-9 h-9 border border-white/20 flex items-center justify-center text-white/50 hover:border-brand hover:text-brand transition-colors rounded-sm"
            >
              <i className="fab fa-facebook-f text-sm" />
            </a>
            <a
              href="#"
              aria-label="Instagram"
              className="w-9 h-9 border border-white/20 flex items-center justify-center text-white/50 hover:border-brand hover:text-brand transition-colors rounded-sm"
            >
              <i className="fab fa-instagram text-sm" />
            </a>
          </div>
          <Link
            href="/inventory"
            className="inline-block mt-6 text-xs font-semibold uppercase tracking-[0.18em] text-white/60 hover:text-brand transition-colors"
          >
            Browse stock →
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
