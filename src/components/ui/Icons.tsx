/** Lightweight inline SVG icons (no icon library = smaller bundle). */
type P = React.SVGProps<SVGSVGElement> & { size?: number };

const base = (size = 20) => ({
  width: size,
  height: size,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
  focusable: false,
});

export const PhoneIcon = ({ size, ...p }: P) => (
  <svg {...base(size)} {...p}><path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2" /></svg>
);
export const PinIcon = ({ size, ...p }: P) => (
  <svg {...base(size)} {...p}><path d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21Z" /><circle cx="12" cy="9.5" r="2.5" /></svg>
);
export const ClockIcon = ({ size, ...p }: P) => (
  <svg {...base(size)} {...p}><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg>
);
export const MenuBookIcon = ({ size, ...p }: P) => (
  <svg {...base(size)} {...p}><path d="M7 3v8a2 2 0 0 0 2 2v8M9 3v6M5 3v6M17 21V3c-2 0-4 2-4 6v4h4" /></svg>
);
export const ArrowIcon = ({ size, ...p }: P) => (
  <svg {...base(size)} {...p}><path d="M5 12h14M13 6l6 6-6 6" /></svg>
);
export const ArrowUpRightIcon = ({ size, ...p }: P) => (
  <svg {...base(size)} {...p}><path d="M7 17 17 7M8 7h9v9" /></svg>
);
export const CloseIcon = ({ size, ...p }: P) => (
  <svg {...base(size)} {...p}><path d="M6 6l12 12M18 6 6 18" /></svg>
);
export const ChevronIcon = ({ size, ...p }: P) => (
  <svg {...base(size)} {...p}><path d="m9 6 6 6-6 6" /></svg>
);
export const CopyIcon = ({ size, ...p }: P) => (
  <svg {...base(size)} {...p}><rect x="9" y="9" width="11" height="11" rx="2" /><path d="M5 15V5a2 2 0 0 1 2-2h8" /></svg>
);
export const StarIcon = ({ size, ...p }: P) => (
  <svg {...base(size)} fill="currentColor" stroke="none" {...p}><path d="m12 2.8 2.8 5.9 6.4.8-4.7 4.4 1.2 6.4L12 17.2l-5.7 3.1 1.2-6.4-4.7-4.4 6.4-.8Z" /></svg>
);
export const InstagramIcon = ({ size, ...p }: P) => (
  <svg {...base(size)} {...p}><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r=".8" fill="currentColor" /></svg>
);
export const TikTokIcon = ({ size, ...p }: P) => (
  <svg {...base(size)} {...p}><path d="M14 3v11.5a3.5 3.5 0 1 1-3.5-3.5M14 3c.5 2.8 2.3 4.5 5 4.8" /></svg>
);
export const WhatsAppIcon = ({ size, ...p }: P) => (
  <svg {...base(size)} {...p}><path d="M4 20l1.3-4A8 8 0 1 1 8 18.7Z" /><path d="M9 9.5c0 3 2.5 5.5 5.5 5.5l1-1.5-2-1-1 .8a4 4 0 0 1-1.8-1.8l.8-1-1-2Z" /></svg>
);
/* Service icons */
export const DineInIcon = ({ size, ...p }: P) => (
  <svg {...base(size)} {...p}><path d="M3 11h18M5 11v9M19 11v9M8 11V7a4 4 0 0 1 8 0v4" /></svg>
);
export const OutdoorIcon = ({ size, ...p }: P) => (
  <svg {...base(size)} {...p}><path d="M12 3 3 9h18Z" /><path d="M12 9v12M8 21h8M6 15h12" /></svg>
);
export const TakeoutIcon = ({ size, ...p }: P) => (
  <svg {...base(size)} {...p}><path d="M5 8h14l-1 13H6Z" /><path d="M9 8V6a3 3 0 0 1 6 0v2" /></svg>
);
export const DriveIcon = ({ size, ...p }: P) => (
  <svg {...base(size)} {...p}><path d="M4 16v-4l2-5h12l2 5v4" /><path d="M3 16h18v3H3zM7 19v2M17 19v2M4 12h16" /></svg>
);
export const ParkingIcon = ({ size, ...p }: P) => (
  <svg {...base(size)} {...p}><rect x="3" y="3" width="18" height="18" rx="4" /><path d="M9 17V7h4a3 3 0 0 1 0 6H9" /></svg>
);
