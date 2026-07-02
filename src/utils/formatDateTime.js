/**
 * Verilen tarih stringini tam Türkçe tarih+saat formatında döndürür.
 * Örn: "30 Haz 2024, 17:22:18"
 *
 * @param {string|Date} dateString
 * @returns {string}
 */
export function formatDateTime(dateString, lang = 'tr') {
  if (!dateString) return '';
  const date = new Date(dateString);
  const locale = lang.startsWith('en') ? 'en-US' : 'tr-TR';
  return date.toLocaleString(locale, {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
}
