/**
 * Verilen tarih ile şu anki zaman arasındaki farkı hesaplayıp
 * Türkçe görece zaman (relative time) stringi döndürür.
 * 
 * @param {string|Date} dateString - Hedef tarih
 * @returns {string} Örn: "5 dakika önce", "2 saat önce"
 */
export function formatRelativeTime(dateString, lang = 'tr') {
  if (!dateString) return '';

  const date = new Date(dateString);
  const now = new Date();
  
  // Zaman farkı milisaniye cinsinden
  const diffInMs = now - date;
  
  const isEn = lang && lang.startsWith('en');

  // Gelecekteki bir tarih veya çok yakın zaman için koruma
  if (diffInMs < 1000) {
    return isEn ? 'Just now' : 'Şimdi';
  }

  const diffInSeconds = Math.floor(diffInMs / 1000);
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  const diffInHours = Math.floor(diffInMinutes / 60);
  const diffInDays = Math.floor(diffInHours / 24);

  if (diffInSeconds < 60) {
    return isEn ? `${diffInSeconds} seconds ago` : `${diffInSeconds} saniye önce`;
  }
  
  if (diffInMinutes < 60) {
    return isEn ? `${diffInMinutes} minutes ago` : `${diffInMinutes} dakika önce`;
  }
  
  if (diffInHours < 24) {
    return isEn ? `${diffInHours} hours ago` : `${diffInHours} saat önce`;
  }
  
  return isEn ? `${diffInDays} days ago` : `${diffInDays} gün önce`;
}
