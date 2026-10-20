import { SITE } from "@/config/site";

/** Current hour+minute in Ethiopia (Africa/Addis_Ababa), regardless of the visitor's timezone. */
export function addisTime(now = new Date()) {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: SITE.hours.timeZone,
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(now);
  const hour = Number(parts.find((p) => p.type === "hour")?.value ?? 0);
  const minute = Number(parts.find((p) => p.type === "minute")?.value ?? 0);
  return { hour, minute };
}

/** True between opening (inclusive) and closing (exclusive), every day. */
export function isOpenNow(now = new Date()) {
  const { hour, minute } = addisTime(now);
  const mins = hour * 60 + minute;
  return mins >= SITE.hours.open * 60 && mins < SITE.hours.close * 60;
}
