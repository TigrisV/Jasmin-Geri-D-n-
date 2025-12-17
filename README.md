# Otel Geri Bildirim Sistemi

Otel misafirlerinin odalarındaki QR kodunu okutarak istek ve şikayetlerini iletebilecekleri modern bir PWA uygulaması.

## Özellikler

- 🏨 **QR Kod ile Geri Bildirim**: Her oda için benzersiz QR kod oluşturma
- 📝 **Geri Bildirim Formu**: Misafirlerin istek ve şikayetlerini iletebileceği kullanıcı dostu form
- 👨‍💼 **Admin Paneli**: Gelen bildirimleri görüntüleme, filtreleme ve yönetme
- 📧 **E-posta Bildirimi**: Yeni geri bildirimler için anında e-posta bildirimi
- 📱 **PWA Desteği**: Telefona uygulama olarak kurulabilir
- 🖨️ **Toplu QR Yazdırma**: Tüm odalar için QR kodlarını tek seferde yazdırma

## Yerel Kurulum

```bash
npm install
npm run dev
```

## Deploy (Railway)

### Adım 1: GitHub'a Yükle
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/KULLANICI_ADINIZ/otel-geri-bildirim.git
git push -u origin main
```

### Adım 2: Railway'e Deploy Et
1. [railway.app](https://railway.app) adresine gidin
2. GitHub ile giriş yapın
3. "New Project" → "Deploy from GitHub repo"
4. Bu repoyu seçin
5. Otomatik deploy başlayacak
6. "Settings" → "Generate Domain" ile URL alın

## Telefona Kurulum (PWA)

Deploy ettikten sonra:

**iPhone:**
1. Safari'de siteyi açın
2. Paylaş butonu → "Ana Ekrana Ekle"

**Android:**
1. Chrome'da siteyi açın
2. Menü → "Uygulamayı yükle" veya "Ana ekrana ekle"

## Sayfalar

| Sayfa | URL | Açıklama |
|-------|-----|----------|
| Ana Sayfa | `/` | Admin yönetim paneli |
| Geri Bildirim | `/feedback` | Misafir formu (QR ile) |
| QR Generator | `/qr-generator` | QR kod oluşturma |
| E-posta Ayarları | `/email-settings` | Bildirim ayarları |
| Admin Panel | `/admin` | Geri bildirim yönetimi |

## E-posta Bildirimi Kurulumu

1. [emailjs.com](https://emailjs.com) hesabı oluşturun
2. Gmail servisini bağlayın
3. Template oluşturun
4. `/email-settings` sayfasından bilgileri girin

## Teknolojiler

- React 18 + Vite
- React Router
- TailwindCSS
- Lucide Icons
- QRCode.react
- EmailJS
- PWA (Service Worker)
