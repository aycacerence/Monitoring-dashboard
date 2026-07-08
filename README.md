# Monitoring Dashboard

Bu proje, kurumsal ağ altyapılarında sistem sağlığını (health-check) izlemek amacıyla geliştirilmiş, yüksek performanslı ve ölçeklenebilir bir **Single Page Application (SPA)** frontend mimarisidir. 

Bu sistem; React 19 ve Sanal DOM motoru kullanılarak inşa edilmiş, grid konfigürasyonları ve asenkron veri yönetim katmanlarıyla hazırlanmıştır.

---

## Proje Hedefleri
- Ağ altyapısındaki cihazların (router, switch, server vb.) sağlık durumlarını anlık ve görsel olarak takip edebilmek.
- Kullanıcıların kendi izleme panellerini (dashboard) sürükle-bırak yöntemiyle özelleştirmelerine olanak tanımak.
- Kurumsal kullanım için Rol Bazlı (Role-Based) erişim denetimi sağlamak ve uluslararası çoklu dil / tema destekleri sunmak.

---

## Temel Mühendislik Kararları ve Sistem Özellikleri

- **Dinamik Grid ve İki Katmanlı Wrapper Mimarisi:** `react-grid-layout` entegrasyonu ile kullanıcılara sürükle-bırak (Drag & Drop) ve yeniden boyutlandırma yeteneği kazandırılmıştır. Kütüphanenin DOM referans uyuşmazlıkları `React.forwardRef` köprüsü ile aşılmış; boyutlandırma sırasındaki taşmalar, iç katmanda `overflow: hidden` ve `min-h-0` CSS kuralları uygulanarak "Zero-Scroll" bütünlüğü ile korunmuştur.
- **Durum Yönetimi (State Management) ve Redux Mimarisi:** "Prop Drilling" (prop aktarım) sorununu önlemek adına sistemin anlık durumu Redux Toolkit ile güvence altına alınmıştır. Yapı tek parça (monolitik) olmak yerine `kpiSlice`, `chartsSlice`, `themeSlice`, `authSlice` gibi bağımsız dilimlere (Modules) bölünerek veri akışı izole edilmiştir.
- **Asenkron API Simülasyonu:** Geliştirme fazında gerçek API bulunmaması, statik veri gömmek (hard-coding) yerine JavaScript `Promise` objeleri ve `setTimeout` kullanılarak çözülmüştür. Redux Thunk aracılığıyla bu simülasyona atılan isteklerle `pending`, `fulfilled` ve `rejected` ağ durumları kusursuzca taklit edilmiş ve UI yükleme (skeleton) statüleri buna entegre edilmiştir.
- **Vektörel Veri Görselleştirme (ECharts):** Ağır DOM hesaplamalarını önlemek için Apache ECharts grafiklerinde "SVG Renderer" motoru aktif edilmiştir. Gereksiz yeniden çizimleri (re-render) önlemek için React'ın `useMemo` kancası, boyut değişimlerine anında adapte olmak için ise modern `ResizeObserver` API kullanılmıştır.
- **Koşullu Render ile Rol Bazlı Güvenlik:** "Cihaz Yönetimi" gibi hassas IP/MAC verisi içeren tablolar, yalnızca CSS ile gizlenmek (`display: none`) yerine, kullanıcının mevcut yetki durumu ("Admin" rolü) kontrol edilerek sanal DOM ağacına hiç inşa edilmemektedir. Ayrıca bu rol bazlı sistem; tema ve dil seçimlerini (Örn: `i18nLang_admin`) localStorage'da role özel tutarak kişiselleştirilmiş bir deneyim sunar.

---

## Arayüz Modülleri

### 1. Ana İzleme Paneli (Dashboard)
Ağ metriklerinin (CPU, Bellek, Disk, Trafik) 60 FPS akıcılıkta animasyonlu kartlar (`useCountUp` hook) ve vektörel grafiklerle takip edildiği ana ekran. Sistemin manuel tetiklemelerle asenkron olarak yenilendiği kontrol merkezidir.
![Ana İzleme Paneli](assets/Ana%20İzleme%20Paneli%20.png?v=3)

### 2. Dinamik Pano Konfigürasyonu (Panel Ayarları)
"Panel Ayarları" (Edit Mode) sekmesinde yer alan; HTML5 Drag API çakışmalarının izole edildiği, Redux state'i ve `localStorage` ile kullanıcı özelinde kaydedilebilen dinamik arayüz. 
Kullanıcı bu modda:
- İstemediği KPI veya grafikleri silebilir.
- Panelin yerleşimini sürükle-bırak ile tamamen baştan şekillendirebilir.
- Hatalı bir işlem yaptığında "Varsayılana Dön" butonuyla ilk baştaki orijinal yapıya dönebilir.
![Panel Ayarları Paneli](assets/Panel%20ayarları%20paneli.png?v=2)

### 3. Tema Yönetimi ve Küreselleşme (i18n)
`themeSlice` ile yönetilen ve Tailwind CSS/Material UI (MUI) entegrasyonu ile performans kaybı yaşanmadan tüm arayüze uygulanan "Dark Mode" mimarisi. Aynı navigasyon (Header) katmanı üzerinden `react-i18next` altyapısıyla anlık çoklu dil (Türkçe / İngilizce) geçişi sağlanmaktadır.
![Dark Mode Desteği](assets/Dark%20mode%20desteği.png?v=2)

---

## Teknoloji Yığını 

* **Çekirdek:** React 19, Vite (ESM tabanlı süper hızlı derleyici)
* **Durum Yönetimi:** Redux Toolkit, Redux Thunk
* **Stil ve Kullanıcı Arayüzü:** Tailwind CSS v4, Material UI (MUI) v5
* **Yönlendirme:** React Router v6 (`<Outlet>` mimarisi ile iç içe rotalar)
* **Veri Görselleştirme:** Apache ECharts (SVG Motoru) + echarts-for-react
* **Uluslararasılaştırma (i18n):** react-i18next
* **Arayüz Motoru:** React Grid Layout (Grid dizilimi için)
* **İkonlar:** MUI Icons Material

---

## Kod Organizasyonu ve Klasör Hiyerarşisi

Büyük ölçekli yazılım projelerinde kodlara müdahale edilmesini zorlaştıran mimari karmaşayı önlemek amacıyla "Separation of Concerns" (Kavramların Ayrılığı) ilkesi mutlak olarak uygulanmıştır:

```text
src/
├── app/          # Merkezi yapılandırmalar ve Redux store entegrasyonu.
├── components/   # İş mantığından izole edilmiş, yeniden kullanılabilir (Reusable) dumb (sunumsal) bileşenler.
│   ├── alerts/   # Alarm, Sistem Özeti, vb. uyarı kartları
│   ├── charts/   # ECharts entegrasyonları (LineChart, PieChart vb.)
│   ├── common/   # Butonlar, Badge, ErrorState, Placeholder gibi jenerik bileşenler
│   ├── dashboard/# DraggableGrid gibi panoya özel layout sistemleri
│   ├── devices/  # Cihaz tablosu ve yönetimi
│   ├── kpi/      # KPI kartları (Sayaçlı metrikler)
│   └── layout/   # Sidebar, Header, PageContainer vb. taslak unsurları
├── data/         # Gelecekte gerçek backend ile değiştirilmek üzere tasarlanmış API simülasyonları (fakeApi.js) ve JSON'lar.
├── features/     # Redux dilimlerini (Slices) ve temel iş mantığını barındıran asıl güç kaynakları.
├── i18n/         # react-i18next motor konfigürasyonları ve ayarları.
├── locales/      # JSON formatında TR/EN dil çeviri sözlükleri.
├── pages/        # Alt bileşenleri bir araya getiren akıllı (Smart) görünümler (örn: DashboardPage).
├── router/       # SPA yönlendirme (routing) sınırları.
├── styles/       # Tailwind CSS (index.css) ve MUI global tema yapılandırmaları.
├── theme/        # MUI'nin özel renk paletlerini yaratan konfigürasyon (theme.js).
└── utils/        # Bileşenlerden bağımsız yardımcı (helper) fonskiyonlar (Tarih formatlama, icon haritalama vb.).
```

---

## Test Mimarisi ve CI/CD Süreçleri

Projenin kalite güvencesi (QA), endüstri standartlarında bir "Test Piramidi" ve modern CI/CD (Sürekli Entegrasyon) akışlarıyla sağlanmaktadır:

*   **Birim ve Bileşen Testleri (Vitest & JSDOM):** 
    *   Testler, ilgili kodun hemen yanında (`__tests__` klasörlerinde) yaşar **(Colocation)**. Bu sayede bir bileşen güncellendiğinde veya silindiğinde, testi de anında geliştiricinin karşısına çıkar.
    *   Uygulamanın mantıksal beyni olan Redux Slice'lar ve Helper fonksiyonların kusursuz çalıştığı izole olarak test edilir.
    *   React bileşenlerinin kullanıcıya doğru render edildiği ve Mock araçlar (Örn: `ResizeObserver` ve `i18n` sahtelemesi) sayesinde çökmeden UI katmanını çizdiği test edilir.
*   **E2E (Uçtan Uca) Testleri (Playwright):** 
    *   Projenin kök dizinindeki `e2e/` klasöründe yer alır. Gerçek bir tarayıcı (Chromium) üzerinden canlı sisteme girerek; güvenlik yetkilendirmeleri (RBAC kısıtlamaları), sayfa geçişleri, tema değişikliği ve sürükle-bırak (Drag&Drop) işlemleri bir insanın yapacağı gibi canlı simüle edilir.
*   **GitHub Actions (Sürekli Entegrasyon - CI):**
    *   Tüm kod değişiklikleri (Push veya Pull Request) GitHub sunucularında 2 aşamalı bir kalite geçidinden (Quality Gate) geçer.
    *   **Aşama 1 (`test` Job):** Kodun temelini test eder (Birim/Bileşen). Burası başarılı  olmazsa diğer aşamaya geçilmez.
    *   **Aşama 2 (`e2e` Job):** Vite'in süper hızlı Production (Preview) sunucusunda gerçek arayüz test edilir. Tamamen sorunsuzsa kod canlıya alınmaya hazır hale gelir.

---

## Kurulum ve Çalıştırma

Projeyi yerel makinenizde (local) çalıştırmak için aşağıdaki adımları izleyebilirsiniz. Node.js'in bilgisayarınızda kurulu olması gerekmektedir.

1. Bağımlılıkları Yükleyin:
```bash
npm install
```

2. Geliştirme Sunucusunu Başlatın:
```bash
npm run dev
```

Uygulama varsayılan olarak `http://localhost:5173` portu üzerinden hızlı yenileme (HMR) desteği ile çalışmaya başlayacaktır.

---

## Projeyi Geliştirme

Bu proje gelecekte geliştirilmeye açık olarak esnek tasarlanmıştır:
- **Yeni Bir Dil Eklemek İçin:** `src/locales/` içerisine örneğin `de/translation.json` oluşturup, ardından `src/i18n/i18n.js` dosyasına bu dili kaydetmeniz yeterlidir.
- **Gerçek Bir Backend'e Geçiş İçin:** `src/features/` altındaki slice'larda bulunan `fetch...` (thunk) işlemlerini axios/fetch kullanarak kendi gerçek API uçlarınıza (endpoint) yönlendirmeniz ve `fakeApi.js` kullanımını bırakmanız yeterlidir. Uygulamanın geri kalan tüm parçaları doğrudan çalışmaya devam edecektir.
