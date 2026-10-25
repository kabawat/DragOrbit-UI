const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const pad = (value) => String(value).padStart(2, "0");

export function formatInvoiceDate(value, pattern = "YYYY-MM-DD") {
  const date = value == null ? new Date() : new Date(value);
  if (Number.isNaN(date.getTime())) return "";

  const hour24 = date.getHours();
  const values = {
    YYYY: String(date.getFullYear()),
    YY: String(date.getFullYear()).slice(-2),
    MMMM: MONTHS[date.getMonth()],
    MMM: MONTHS[date.getMonth()].slice(0, 3),
    MM: pad(date.getMonth() + 1),
    M: String(date.getMonth() + 1),
    Do: `${date.getDate()}${["th", "st", "nd", "rd"][((date.getDate() % 100 - 20) % 10) || date.getDate() % 100] || "th"}`,
    DD: pad(date.getDate()),
    D: String(date.getDate()),
    HH: pad(hour24),
    H: String(hour24),
    hh: pad(hour24 % 12 || 12),
    h: String(hour24 % 12 || 12),
    mm: pad(date.getMinutes()),
    m: String(date.getMinutes()),
    ss: pad(date.getSeconds()),
    s: String(date.getSeconds()),
    A: hour24 < 12 ? "AM" : "PM",
    a: hour24 < 12 ? "am" : "pm",
  };

  return String(pattern).replace(/\[[^\]]*\]|YYYY|MMMM|MMM|YY|MM|Do|DD|HH|hh|mm|ss|M|D|H|h|m|s|A|a/g, (token) => {
    if (token.startsWith("[")) return token.slice(1, -1);
    return values[token] ?? token;
  });
}

export function addInvoiceDays(value, days) {
  const date = value == null ? new Date() : new Date(value);
  date.setDate(date.getDate() + Number(days || 0));
  return date;
}
