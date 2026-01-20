# Couple HQ - Supabase Kurulum Rehberi

Bu rehber, Couple HQ uygulamasını Supabase ile entegre etmek için gereken adımları açıklar.

## 🚀 Hızlı Başlangıç

### 1. Supabase Projesi Oluştur

1. [Supabase](https://supabase.com) hesabı oluştur (ücretsiz)
2. "New Project" butonuna tıkla
3. Proje adı, database şifresi ve bölge seç
4. Projenin hazır olmasını bekle (1-2 dakika)

### 2. Database Schema'yı Çalıştır

1. Supabase Dashboard'da **SQL Editor** sekmesine git
2. "New Query" butonuna tıkla
3. `supabase-schema.sql` dosyasının içeriğini kopyala ve yapıştır
4. "Run" butonuna tıkla
5. Başarılı mesajını gör: ✅ "Couple HQ database schema created successfully!"

### 3. API Anahtarlarını Al

1. Supabase Dashboard'da **Settings** > **API** sekmesine git
2. Şu bilgileri kopyala:
   - **Project URL** (örn: `https://xxxxx.supabase.co`)
   - **anon public** key (uzun bir string)

### 4. Environment Variables'ı Ayarla

#### Vercel'de Deploy İçin:

1. Vercel Dashboard'da projenize git
2. **Settings** > **Environment Variables** sekmesine git
3. Şu değişkenleri ekle:

```
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

4. "Save" butonuna tıkla
5. Projeyi yeniden deploy et

#### Lokal Geliştirme İçin:

1. Workspace'te `.env` dosyası oluştur (`.env.example`'dan kopyala)
2. Değerleri doldur:

```env
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

3. Uygulamayı yeniden başlat: `npm run dev`

### 5. Realtime'ı Aktifleştir (Opsiyonel ama Önerilen)

1. Supabase Dashboard'da **Database** > **Replication** sekmesine git
2. `couples` tablosunu bul
3. Realtime'ı aktifleştir (toggle switch)
4. Bu sayede farklı cihazlardaki değişiklikler anında senkronize olur! 🔄

## ✅ Test Et

1. Uygulamayı aç
2. Yeni bir çift oluştur (PIN ile)
3. Veri ekle (task, note, vb.)
4. Başka bir cihazdan/tarayıcıdan aynı çift ID'si ve PIN ile giriş yap
5. Verilerin senkronize olduğunu gör! 🎉

## 🔒 Güvenlik Notları

- **PIN Güvenliği**: PIN'ler SHA-256 ile hash'lenerek saklanır
- **RLS (Row Level Security)**: Aktif, ancak PIN doğrulaması uygulama tarafında yapılır
- **Anon Key**: Public key'dir, güvenli bir şekilde client-side'da kullanılabilir
- **Veri Şifreleme**: Supabase tüm verileri transit ve rest'te şifreler

## 📊 Database Yapısı

### `couples` Tablosu

| Kolon | Tip | Açıklama |
|-------|-----|----------|
| `id` | TEXT | Çift ID'si (12 karakter, unique) |
| `pin_hash` | TEXT | SHA-256 hash'lenmiş PIN |
| `data` | JSONB | Tüm çift verileri (tasks, notes, budget, vb.) |
| `created_at` | TIMESTAMPTZ | Oluşturulma zamanı |
| `updated_at` | TIMESTAMPTZ | Son güncelleme zamanı (otomatik) |

### Veri Yapısı (JSONB)

```json
{
  "couple": {
    "partner1": { "name": "...", "avatar": "...", "birthday": "...", "color": "..." },
    "partner2": { "name": "...", "avatar": "...", "birthday": "...", "color": "..." },
    "anniversary": "...",
    "weddingDate": "...",
    "relationshipStart": "..."
  },
  "tasks": [...],
  "notes": [...],
  "goals": [...],
  "budget": {...},
  "events": [...],
  "wishlist": [...],
  "memories": [...],
  "shoppingLists": [...],
  "loveNotes": [...],
  "habits": [...],
  "dateIdeas": [...],
  "mealPlan": {...},
  "settings": {...}
}
```

## 🔄 Senkronizasyon Nasıl Çalışır?

1. **Lokal First**: Tüm değişiklikler önce IndexedDB'ye kaydedilir (hızlı)
2. **Supabase Sync**: Ardından Supabase'e gönderilir (arka planda)
3. **Realtime Updates**: Diğer cihazlar değişiklikleri anında alır
4. **Offline Support**: İnternet yoksa lokal çalışır, bağlantı gelince senkronize olur

## 🛠️ Bakım ve Yönetim

### Eski Verileri Temizleme

Supabase SQL Editor'de çalıştır:

```sql
-- 1 yıldan eski çiftleri sil
SELECT cleanup_old_couples(365);
```

### Veri Yedekleme

1. Supabase Dashboard > **Database** > **Backups**
2. Otomatik yedekler her gün alınır (ücretsiz planda 7 gün saklanır)
3. Manuel yedek almak için "Create Backup" butonuna tıkla

### İstatistikler

```sql
-- Toplam çift sayısı
SELECT COUNT(*) FROM couples;

-- Son 7 günde oluşturulan çiftler
SELECT COUNT(*) FROM couples WHERE created_at > NOW() - INTERVAL '7 days';

-- Son 30 günde aktif çiftler
SELECT COUNT(*) FROM couples WHERE updated_at > NOW() - INTERVAL '30 days';

-- Ortalama veri boyutu
SELECT AVG(pg_column_size(data)) / 1024 as avg_kb FROM couples;
```

## 🆘 Sorun Giderme

### "Supabase not configured" Hatası

- Environment variables'ların doğru ayarlandığından emin ol
- Vercel'de deploy ettiysen, projeyi yeniden deploy et
- Browser console'da `import.meta.env.VITE_SUPABASE_URL` yaz, undefined dönmemeli

### Veriler Senkronize Olmuyor

1. Supabase Dashboard > **Database** > **Replication** > `couples` tablosu aktif mi?
2. Browser console'da hata var mı?
3. Supabase API Status: https://status.supabase.com

### PIN Doğrulama Çalışmıyor

- PIN'in en az 4 karakter olduğundan emin ol
- Browser'ın localStorage'ını temizle ve tekrar dene
- Supabase'de `pin_hash` kolonunun dolu olduğunu kontrol et

## 💰 Maliyet

**Ücretsiz Plan (Free Tier):**
- 500 MB database
- 1 GB dosya depolama
- 2 GB bandwidth
- 50,000 monthly active users
- 500,000 Realtime messages

**Couple HQ için yeterli mi?**
- ✅ Evet! Ortalama bir çift ~100 KB veri kullanır
- ✅ 500 MB = ~5,000 çift
- ✅ Realtime messages çoğu kullanım için yeterli

## 🎉 Tamamlandı!

Artık Couple HQ uygulamanız Supabase ile entegre ve farklı cihazlar arasında senkronize çalışıyor! 🚀

Sorularınız için: [GitHub Issues](https://github.com/yourusername/couple-hq/issues)
