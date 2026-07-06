# Monitoring Dashboard

Bu proje, kurumsal ağ altyapılarında sistem sağlığını (health-check) izlemek amacıyla geliştirilmiş, yüksek performanslı ve ölçeklenebilir bir **Single Page Application (SPA)** frontend mimarisidir. 

Bu sistem; React 19 ve Sanal DOM motoru kullanılarak inşa edilmiş, grid konfigürasyonları ve asenkron veri yönetim katmanlarıyla hazırlanmıştır.

---

## Temel Mühendislik Kararları ve Sistem Özellikleri

- **Dinamik Grid ve İki Katmanlı Wrapper Mimarisi:** `react-grid-layout` entegrasyonu ile kullanıcılara sürükle-bırak (Drag & Drop) ve yeniden boyutlandırma yeteneği kazandırılmıştır. Kütüphanenin DOM referans uyuşmazlıkları `React.forwardRef` köprüsü ile aşılmış; boyutlandırma sırasındaki taşmalar, iç katmanda `overflow: hidden` ve `min-h-0` CSS kuralları uygulanarak "Zero-Scroll" bütünlüğü ile korunmuştur.
- **Durum Yönetimi (State Management) ve Redux Mimarisi:** "Prop Drilling" sorununu önlemek adına sistemin anlık durumu Redux Toolkit ile güvence altına alınmıştır. Yapı tek parça olmak yerine `kpiSlice`, `chartsSlice`, `themeSlice` gibi bağımsız dilimlere (Modules) bölünerek veri akışı izole edilmiştir.
- **Asenkron API Simülasyonu:** Geliştirme fazında gerçek API bulunmaması, statik veri gömmek (hard-coding) yerine JavaScript `Promise` objeleri ve `setTimeout` kullanılarak çözülmüştür. Redux Thunk aracılığıyla bu simülasyona atılan isteklerle `pending`, `fulfilled` ve `rejected` ağ durumları kusursuzca taklit edilmiştir.
- **Vektörel Veri Görselleştirme:** Ağır DOM hesaplamalarını önlemek için Apache ECharts grafiklerinde "SVG Renderer" motoru aktif edilmiştir. Gereksiz çizimleri önlemek için React'ın `useMemo` kancası, boyut değişimlerine anında adapte olmak için ise `ResizeObserver` API kullanılmıştır.
- **Koşullu Render ile Rol Bazlı Güvenlik:** "Cihaz Yönetimi" gibi hassas IP/MAC verisi içeren tablolar, CSS ile gizlenmek (display: none) yerine, kullanıcının "Admin" rolü kontrol edilerek DOM ağacına hiç inşa edilmemektedir.

---

## Arayüz Modülleri

### Ana İzleme Paneli
Ağ metriklerinin (CPU, Bellek, Disk, Trafik) 60 FPS akıcılıkta animasyonlu kartlar (`useCountUp` hook) ve vektörel grafiklerle takip edildiği ana ekran. Sistemin manuel tetiklemelerle asenkron olarak yenilendiği kontrol merkezidir.
![Ana İzleme Paneli](assets/Ana%20İzleme%20Paneli%20.png)

### Dinamik Pano Konfigürasyonu
"Panel Ayarları" sekmesinde yer alan; HTML5 Drag API çakışmalarının izole edildiği, Redux state'i ve `localStorage` ile kullanıcı özelinde kaydedilebilen dinamik arayüz.
![Dinamik Pano Konfigürasyonu](assets/Dinamik%20Pano%20Konfigürasyonu.png)

### Tema Yönetimi ve Küreselleşme
`themeSlice` ile yönetilen ve Tailwind/MUI entegrasyonu ile performans kaybı yaşanmadan tüm arayüze uygulanan "Dark Mode" mimarisi. Aynı navigasyon katmanı üzerinden `react-i18next` altyapısıyla anlık çoklu dil (TR/EN) geçişi sağlanmaktadır.
![Dark Mode](assets/Dark%20Mode.png)

---

## Teknoloji Yığını 

* **Çekirdek:** React 19, Vite (ESM)
* **Durum Yönetimi:** Redux Toolkit, Redux Thunk
* **Stil ve Kullanıcı Arayüzü:** Tailwind CSS v4, Material UI (MUI)
* **Yönlendirme:** React Router v6 (`<Outlet>` Mimarisi)
* **Veri Görselleştirme:** Apache ECharts (SVG Motoru)
* **Uluslararasılaştırma (i18n):** react-i18next
* **Arayüz Motoru:** React Grid Layout

---

## Kod Organizasyonu ve Klasör Hiyerarşisi

Büyük ölçekli yazılım projelerinde kodlara müdahale edilmesini zorlaştıran mimari karmaşayı önlemek amacıyla "Separation of Concerns" (Kavramların Ayrılığı) ilkesi uygulanmıştır.

```text
src/
├── app/          # Merkezi yapılandırmalar ve Redux store entegrasyonu.
├── components/   # İş mantığından izole edilmiş, yeniden kullanılabilir (Reusable) dumb bileşenler.
├── data/         # Gelecekte gerçek backend ile değiştirilmek üzere tasarlanmış API simülasyonları.
├── features/     # Redux dilimlerini (Slices) ve temel iş mantığını barındıran modüller.
├── i18n/         # react-i18next motor konfigürasyonları.
├── locales/      # JSON formatında TR/EN çeviri sözlükleri.
├── pages/        # Alt bileşenleri bir araya getiren akıllı (Smart) görünümler.
├── router/       # SPA yönlendirme (routing) sınırları.
├── styles/       # Tailwind CSS ve MUI global tema yapılandırmaları.
└── utils/        # Bileşenlerden bağımsız yardımcı (helper) fonksiyonlar.

