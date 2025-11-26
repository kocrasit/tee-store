# E-Ticaret Platformu

Modern bir e-ticaret platformu. Influencer'lar ve tasarımcılar için özel tasarım yükleme ve satış özellikleri içerir.

## 🚀 Özellikler

### Kullanıcı Rolleri
- **Müşteri**: Ürün satın alma, sipariş takibi, kupon kullanımı
- **Influencer**: Tasarım oluşturma (Canva-benzeri araç), tasarım yükleme, satış takibi
- **Admin**: Ürün yönetimi, kullanıcı yönetimi, sipariş yönetimi

### Ana Özellikler
- 🎨 **Canva-Benzeri Tasarım Aracı**: Fabric.js ile tarayıcıda tasarım oluşturma
- 🛒 **Sepet & Ödeme Sistemi**: Tam fonksiyonel e-ticaret
- 🎫 **Kupon Sistemi**: İndirim kuponları
- 📦 **Sipariş Takibi**: Detaylı sipariş yönetimi
- 🔐 **JWT Authentication**: Güvenli kimlik doğrulama
- 📱 **Responsive Tasarım**: Mobil uyumlu modern UI
- 🎭 **Profil Yönetimi**: Kullanıcı profilleri, şifre değiştirme

## 🛠️ Teknolojiler

### Backend
- Node.js & Express.js
- TypeScript
- MongoDB & Mongoose
- JWT Authentication
- Multer (Dosya yükleme)

### Frontend
- Next.js 14 (App Router)
- React 18
- TypeScript
- Tailwind CSS
- Fabric.js (Canvas tasarım aracı)
- Zustand (State management)
- React Query
- Lucide Icons

## 📦 Kurulum

### Gereksinimler
- Node.js 18+
- MongoDB (Yerel kurulum veya MongoDB Atlas)
- npm veya yarn

> **Not**: Yerel MongoDB kurulumu için: https://www.mongodb.com/try/download/community
> 
> Alternatif olarak MongoDB Atlas (ücretsiz cloud) kullanabilirsiniz: https://www.mongodb.com/cloud/atlas/register

### Backend Kurulumu

```bash
cd backend
npm install
```

`.env` dosyası oluşturun:
```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/ecommerce
JWT_SECRET=your_jwt_secret_key_here
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

Backend'i başlatın:
```bash
npm run dev
```

### Frontend Kurulumu

```bash
cd frontend
npm install
```

`.env.local` dosyası oluşturun:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

Frontend'i başlatın:
```bash
npm run dev
```

## 🎯 Kullanım

1. **Backend**: `http://localhost:5000`
2. **Frontend**: `http://localhost:3000`

### Test Kullanıcıları
Sisteme kayıt olup farklı roller için kullanıcı oluşturabilirsiniz.

## 📁 Proje Yapısı

```
sonproje/
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── middleware/
│   │   └── server.ts
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── admin/
│   │   │   ├── influencer/
│   │   │   ├── profile/
│   │   │   └── ...
│   │   ├── components/
│   │   ├── store/
│   │   └── api/
│   └── package.json
```

## 🎨 Tasarım Aracı

Influencer panelinde bulunan **"Tasarım Oluştur"** özelliği:
- Metin, şekil ve resim ekleme
- Renk seçimi
- Hazır şablonlar
- PNG export
- Doğrudan platforma yayınlama

## 🔒 Güvenlik

- JWT tabanlı kimlik doğrulama
- Şifreler bcrypt ile hashleniyor
- Role-based access control (RBAC)
- XSS koruması
- CORS yapılandırması

## 📝 Lisans

Bu proje MIT lisansı altında lisanslanmıştır.

## 👨‍💻 Geliştirici

Kocra - E-Ticaret Platformu

## 🙏 Teşekkürler

- Fabric.js ekibine canvas aracı için
- Next.js ekibine harika framework için
- Tüm açık kaynak katkıda bulunanlara
