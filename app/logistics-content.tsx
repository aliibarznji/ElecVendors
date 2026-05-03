"use client";

import { ChevronDown, Mail, Maximize2, User } from "lucide-react";
import type { FormEvent } from "react";
import { useState } from "react";

const logisticsBullets = [
  "Finding a good distributor is difficult. Go direct to retail with Iraq's biggest e-commerce store, and manage your own sales with our tools that allow you to manage your product selection, merchandising, pricing, and promotions.",
  "Need help importing goods into Iraq? We can assist you with shipping, customs & clearance.",
  "Use our warehousing infrastructure to store your goods, with competitive storage rates of just $4 per CBM per month, and only pay for what you use.",
  "Offer a superior customer experience, with Elryan's own fleet providing the last-mile delivery service.",
  "Iraq is a cash economy. We handle the hassle of payment transactions at no additional cost to you.",
];

function LogisticsIllustration() {
  return (
    <svg
      className="logistics-illustration"
      viewBox="0 0 320 150"
      role="img"
      aria-label="Warehouse delivery truck with boxes"
    >
      <circle cx="112" cy="75" r="61" fill="#cfe0f3" />
      <circle cx="229" cy="76" r="73" fill="#edf5ff" />
      <ellipse cx="155" cy="129" rx="120" ry="8" fill="#c5d0de" opacity="0.5" />

      <g fill="#a47a43">
        <rect x="50" y="84" width="23" height="27" />
        <rect x="32" y="95" width="22" height="29" />
        <rect x="58" y="110" width="25" height="18" />
        <rect x="169" y="49" width="32" height="27" />
        <rect x="205" y="55" width="29" height="23" />
        <rect x="179" y="28" width="26" height="21" />
        <rect x="203" y="31" width="29" height="21" />
        <rect x="257" y="100" width="25" height="28" />
        <rect x="280" y="110" width="18" height="18" />
      </g>

      <g stroke="#fff2df" strokeWidth="3">
        <path d="M61 84v27" />
        <path d="M43 95v29" />
        <path d="M185 28v21" />
        <path d="M219 31v21" />
        <path d="M270 100v28" />
      </g>

      <g>
        <rect x="102" y="67" width="109" height="54" rx="3" fill="#ffffff" />
        <rect x="113" y="76" width="34" height="13" fill="#a7793f" />
        <rect x="157" y="76" width="34" height="13" fill="#a7793f" />
        <rect x="113" y="98" width="34" height="13" fill="#a7793f" />
        <rect x="157" y="98" width="34" height="13" fill="#a7793f" />
        <rect x="99" y="62" width="114" height="8" rx="2" fill="#8d6336" />
        <rect x="107" y="121" width="126" height="5" fill="#8d6336" />
        <rect x="214" y="76" width="54" height="49" rx="4" fill="#9d61ba" />
        <rect x="226" y="83" width="28" height="19" fill="#e9f3ff" />
        <rect x="267" y="107" width="17" height="18" fill="#8d6336" />
        <circle cx="128" cy="125" r="14" fill="#5a6472" />
        <circle cx="128" cy="125" r="7" fill="#d8dee8" />
        <circle cx="240" cy="125" r="14" fill="#5a6472" />
        <circle cx="240" cy="125" r="7" fill="#d8dee8" />
      </g>

      <g fill="none" stroke="#7ca0da" strokeLinecap="round" strokeWidth="3">
        <path d="M87 64c-3 0-7 2-9 5" />
        <path d="M83 57c-5-1-11 1-15 6" />
        <path d="M251 65c4 1 8 4 10 8" />
        <path d="M260 58c5 2 9 6 12 11" />
      </g>

      <g>
        <circle cx="84" cy="80" r="8" fill="#e8b991" />
        <path d="M78 88h14l5 38H74z" fill="#4d78bc" />
        <path d="M77 89l-18 13" stroke="#4d78bc" strokeLinecap="round" strokeWidth="6" />
        <path d="M92 89l15 13" stroke="#4d78bc" strokeLinecap="round" strokeWidth="6" />
        <path d="M78 126l-6 18" stroke="#4d78bc" strokeLinecap="round" strokeWidth="6" />
        <path d="M93 126l8 18" stroke="#4d78bc" strokeLinecap="round" strokeWidth="6" />
        <path d="M73 76c5-10 15-9 20-1l-3 5c-5-4-9-4-15 1z" fill="#5f6f89" />
      </g>

      <g>
        <circle cx="272" cy="82" r="8" fill="#e8b991" />
        <path d="M266 90h14l6 37h-26z" fill="#5c86ca" />
        <path d="M266 91l-16 14" stroke="#5c86ca" strokeLinecap="round" strokeWidth="6" />
        <path d="M281 91l17 14" stroke="#5c86ca" strokeLinecap="round" strokeWidth="6" />
        <path d="M264 127l-7 17" stroke="#5c86ca" strokeLinecap="round" strokeWidth="6" />
        <path d="M281 127l8 17" stroke="#5c86ca" strokeLinecap="round" strokeWidth="6" />
        <path d="M263 78c5-9 15-8 19 0l-4 5c-4-3-8-3-13 1z" fill="#5f6f89" />
      </g>
    </svg>
  );
}

function LogisticsRequestForm() {
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
  }

  return (
    <form className="logistics-request-card" onSubmit={handleSubmit}>
      <label className="logistics-form-field">
        <span>Name</span>
        <span className="logistics-input-wrap">
          <input placeholder="Enter your full name here" />
          <User aria-hidden="true" size={17} strokeWidth={2.3} />
        </span>
      </label>

      <label className="logistics-form-field">
        <span>Email Address:</span>
        <span className="logistics-input-wrap">
          <input type="email" placeholder="Enter email address" />
          <Mail aria-hidden="true" size={17} strokeWidth={2.3} />
        </span>
      </label>

      <label className="logistics-form-field">
        <span>Enter Mobile number</span>
        <span className="logistics-phone-wrap">
          <span className="logistics-country-code" aria-label="Iraq country code">
            <span className="iraq-flag" aria-hidden="true" />
            <span>+964</span>
            <ChevronDown aria-hidden="true" size={12} strokeWidth={2.3} />
          </span>
          <input type="tel" aria-label="Mobile number" />
        </span>
        <small>eg : +9647912345678</small>
      </label>

      <label className="logistics-form-field">
        <span>Services required</span>
        <span className="logistics-select-wrap">
          <select defaultValue="" aria-label="Services required">
            <option value="" disabled>
              Services required
            </option>
            <option>Importing and clearance</option>
            <option>Warehousing</option>
            <option>Last-mile delivery</option>
            <option>Payment handling</option>
          </select>
          <ChevronDown aria-hidden="true" size={15} strokeWidth={2.3} />
          <Maximize2 aria-hidden="true" size={15} strokeWidth={2.2} />
        </span>
      </label>

      <button className="logistics-submit-button" type="submit">
        Submit
      </button>
    </form>
  );
}

export function LogisticsContent() {
  const [showRequestForm, setShowRequestForm] = useState(false);

  return (
    <div className="logistics-content">
      <h1>Logistics</h1>

      {showRequestForm ? (
        <LogisticsRequestForm />
      ) : (
        <section className="logistics-panel" aria-label="Logistics turnkey solution">
          <div className="logistics-visual-wrap">
            <LogisticsIllustration />
          </div>

          <div className="logistics-copy">
            <h2>Looking for a turnkey solution?</h2>
            <p>
              If you&apos;re looking to sell your products in Iraq but don&apos;t
              want to make the required investment in building local
              infrastructure, we can help.
            </p>

            <ul>
              {logisticsBullets.map((bullet) => (
                <li key={bullet}>{bullet}</li>
              ))}
            </ul>

            <p>Get started now with just a few clicks.</p>
          </div>

          <button
            className="logistics-start-button"
            type="button"
            onClick={() => setShowRequestForm(true)}
          >
            START
          </button>
        </section>
      )}
    </div>
  );
}
