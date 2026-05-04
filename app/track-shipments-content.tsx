import { ChevronDown, ChevronLeft, ChevronRight, PackagePlus } from "lucide-react";
import Link from "next/link";

function TrackShipmentsIllustration() {
  return (
    <svg
      className="track-shipments-illustration"
      viewBox="0 0 780 420"
      role="img"
      aria-label="Modern delivery van with shipment tracking route"
    >
      <defs>
        <linearGradient id="shipment-sky" x1="118" x2="650" y1="36" y2="352">
          <stop offset="0" stopColor="#6e92f4" />
          <stop offset="0.54" stopColor="#74b9f4" />
          <stop offset="1" stopColor="#9ed8ef" />
        </linearGradient>
        <linearGradient id="shipment-van" x1="346" x2="700" y1="238" y2="333">
          <stop offset="0" stopColor="#3863db" />
          <stop offset="1" stopColor="#2453c7" />
        </linearGradient>
        <linearGradient id="shipment-window" x1="544" x2="647" y1="224" y2="276">
          <stop offset="0" stopColor="#d9f0ff" />
          <stop offset="1" stopColor="#a7d2fb" />
        </linearGradient>
        <linearGradient id="shipment-box" x1="318" x2="412" y1="268" y2="340">
          <stop offset="0" stopColor="#ffb453" />
          <stop offset="1" stopColor="#f57d3d" />
        </linearGradient>
      </defs>

      <ellipse cx="390" cy="383" rx="355" ry="13" fill="#d6ddfb" opacity="0.72" />

      <path
        d="M155 322c-55-24-81-88-52-141 17-32 46-46 80-49 46-4 72-29 98-65 36-50 126-61 171-16 31 31 38 65 94 73 57 9 111 17 130 75 14 42-2 72 30 109 33 39 20 81-32 81H158c-27 0-36-53-3-67Z"
        fill="url(#shipment-sky)"
      />

      <g className="track-shipments-city" opacity="0.82">
        <rect x="214" y="147" width="54" height="184" fill="#d7e7ff" />
        <rect x="281" y="101" width="76" height="230" fill="#c9dcf8" />
        <rect x="374" y="151" width="37" height="180" fill="#d5e6ff" />
        <rect x="428" y="189" width="62" height="142" fill="#c3d8fa" />
        <rect x="508" y="105" width="43" height="226" fill="#cfe3ff" />
        <rect x="557" y="113" width="72" height="218" fill="#c7dcf7" />
        <rect x="236" y="172" width="23" height="13" fill="#eef6ff" opacity="0.68" />
        <rect x="236" y="204" width="23" height="13" fill="#eef6ff" opacity="0.68" />
        <rect x="236" y="236" width="23" height="13" fill="#eef6ff" opacity="0.68" />
        <rect x="296" y="128" width="47" height="13" fill="#eef6ff" opacity="0.64" />
        <rect x="296" y="159" width="47" height="13" fill="#eef6ff" opacity="0.64" />
        <rect x="296" y="190" width="47" height="13" fill="#eef6ff" opacity="0.64" />
        <rect x="521" y="132" width="22" height="12" fill="#eef6ff" opacity="0.66" />
        <rect x="521" y="164" width="22" height="12" fill="#eef6ff" opacity="0.66" />
        <rect x="521" y="196" width="22" height="12" fill="#eef6ff" opacity="0.66" />
        <rect x="571" y="139" width="42" height="12" fill="#eef6ff" opacity="0.62" />
        <rect x="571" y="170" width="42" height="12" fill="#eef6ff" opacity="0.62" />
        <rect x="571" y="201" width="42" height="12" fill="#eef6ff" opacity="0.62" />
      </g>

      <g className="track-shipments-route">
        <path
          d="M454 172h39v54h52v54h58"
          fill="none"
          stroke="#ffffff"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="5"
        />
        <circle cx="454" cy="172" r="7" fill="#ffffff" />
        <circle cx="603" cy="280" r="8" fill="#ffffff" />
      </g>

      <g className="track-shipments-pin">
        <path
          d="M506 72c-20 0-36 16-36 36 0 26 36 67 36 67s36-41 36-67c0-20-16-36-36-36Z"
          fill="#ffffff"
        />
        <circle cx="506" cy="108" r="14" fill="#6fa7ee" />
      </g>

      <g className="track-shipments-building">
        <rect x="178" y="176" width="164" height="196" rx="15" fill="#f8fbff" />
        <path d="M178 220h164" stroke="#dbe7fb" strokeWidth="4" />
        <path d="M246 372V303h48v69" fill="#d7e5fb" />
        <rect x="202" y="246" width="28" height="45" fill="#dfebfb" />
        <rect x="243" y="246" width="38" height="45" fill="#dfebfb" />
        <rect x="296" y="246" width="29" height="45" fill="#dfebfb" />
        <rect x="202" y="310" width="28" height="44" fill="#dfebfb" />
        <rect x="296" y="310" width="29" height="44" fill="#dfebfb" />
        <rect x="188" y="372" width="144" height="10" rx="2" fill="#25b8d8" />
      </g>

      <g className="track-shipments-package">
        <rect x="333" y="281" width="58" height="55" rx="5" fill="url(#shipment-box)" />
        <path d="M363 281v55" stroke="#ffd08b" strokeWidth="6" />
        <path d="M333 301h58" stroke="#ffd08b" strokeWidth="6" />
        <circle cx="363" cy="318" r="13" fill="#fff2df" opacity="0.78" />
        <path
          d="M357 318h13m-10-5h7m-7 10h7"
          stroke="#f47f3e"
          strokeLinecap="round"
          strokeWidth="2"
        />
      </g>

      <g className="track-shipments-vehicle">
        <path
          d="M392 255c18-19 42-29 73-29h113c25 0 49 9 68 26l45 41c12 10 19 25 19 41v23H374v-45c0-21 6-40 18-57Z"
          fill="url(#shipment-van)"
        />
        <path d="M535 242h70c12 0 23 4 33 12l36 31H535Z" fill="url(#shipment-window)" />
        <path d="M552 250l41 35" stroke="#c0ddfb" strokeWidth="12" opacity="0.75" />
        <rect x="388" y="293" width="108" height="34" rx="7" fill="#456fe0" />
        <rect x="481" y="310" width="41" height="17" rx="8.5" fill="#8a91ea" />
        <path d="M680 300c16 4 27 15 30 33h-49c3-16 9-27 19-33Z" fill="#ffd42a" />
        <circle cx="465" cy="357" r="33" fill="#192f62" />
        <circle cx="465" cy="357" r="22" fill="#8fc4f5" />
        <circle cx="465" cy="357" r="13" fill="#5a74ed" />
        <circle cx="636" cy="357" r="33" fill="#192f62" />
        <circle cx="636" cy="357" r="22" fill="#8fc4f5" />
        <circle cx="636" cy="357" r="13" fill="#5a74ed" />
        <g fill="none" stroke="#ffffff" strokeWidth="4">
          <circle cx="431" cy="296" r="20" />
          <path d="M419 296h24m-18-8h12m-12 16h12" strokeLinecap="round" />
          <circle cx="571" cy="318" r="22" />
          <path d="M558 318h26m-20-9h13m-13 18h13" strokeLinecap="round" />
        </g>
      </g>

      <g className="track-shipments-stack">
        <rect x="218" y="316" width="54" height="56" rx="5" fill="#3466db" />
        <rect x="279" y="323" width="56" height="49" rx="5" fill="#2b5fce" />
        <path d="M245 316v56M307 323v49" stroke="#9cc7ff" strokeWidth="5" />
        <g fill="none" stroke="#ffffff" strokeWidth="4">
          <circle cx="245" cy="344" r="17" />
          <path d="M235 344h20m-15-7h10m-10 14h10" strokeLinecap="round" />
          <circle cx="307" cy="348" r="17" />
          <path d="M297 348h20m-15-7h10m-10 14h10" strokeLinecap="round" />
        </g>
      </g>

      <g className="track-shipments-accent">
        <path d="M136 373c-14-58-10-107 12-146 25 33 25 82-12 146Z" fill="#62cbd7" />
        <path d="M150 375c-12-47-3-87 27-120 13 42 6 82-27 120Z" fill="#85dceb" />
        <path d="M137 376c-27-36-36-72-27-108 27 21 41 58 27 108Z" fill="#51bfce" />
        <rect x="111" y="369" width="62" height="15" rx="4" fill="#ffd21f" />
        <rect x="119" y="382" width="46" height="18" rx="5" fill="#ffc400" />
        <path d="M141 250v126m-15-80 14 18m14-40-13 19m-18 43 16 17" stroke="#2e6095" strokeLinecap="round" strokeWidth="2" />
      </g>
    </svg>
  );
}

export function TrackShipmentsContent() {
  return (
    <div className="track-shipments-content">
      <h1>Track my shipments</h1>

      <section className="track-shipments-panel" aria-label="Track my shipments">
        <div className="track-shipments-empty">
          <div className="track-shipments-visual">
            <TrackShipmentsIllustration />
          </div>

          <div className="track-shipments-copy">
            <h2>You do not currently have any shipments</h2>
            <p>Click below to get started</p>
            <Link className="track-shipments-create-button" href="/shipments/create">
              <PackagePlus aria-hidden="true" size={14} strokeWidth={2.3} />
              <span>Create New Shipment</span>
            </Link>
          </div>
        </div>

        <div className="track-shipments-pagination" aria-label="Shipment pagination">
          <span>Items per page:</span>
          <button className="track-shipments-page-size" type="button">
            <span>20</span>
            <ChevronDown aria-hidden="true" size={13} strokeWidth={2.2} />
          </button>
          <span>0 of 0</span>
          <button type="button" aria-label="Previous page" disabled>
            <ChevronLeft aria-hidden="true" size={19} strokeWidth={2.1} />
          </button>
          <button type="button" aria-label="Next page" disabled>
            <ChevronRight aria-hidden="true" size={19} strokeWidth={2.1} />
          </button>
        </div>
      </section>
    </div>
  );
}
