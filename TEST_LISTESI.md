# RARITY - Kapsamli Test Listesi

## PUANLAMA KRITERLERI BAZINDA TEST LISTESI

---

## 1. GIRIS - KAYIT (10 Puan)

### 1.1 Kayit Testleri

- [ ] Kayit sayfasina erisim: http://localhost:5173/register
- [ ] Bos form gonderiminde hata mesaji goruntulenmeli
- [ ] Gecersiz email formatinda hata mesaji goruntulenmeli
- [ ] Kisa sifre (6 karakterden az) hata mesaji goruntulenmeli
- [ ] Sifre tekrari uyusmazliginda hata mesaji goruntulenmeli
- [ ] Basarili kayit sonrasi otomatik giris yapilmali
- [ ] Ayni email ile tekrar kayit denendiginde hata mesaji goruntulenmeli

### 1.2 Giris Testleri

- [ ] Giris sayfasina erisim: http://localhost:5173/login
- [ ] Bos form gonderiminde hata mesaji goruntulenmeli
- [ ] Yanlis email/sifre kombinasyonunda hata mesaji goruntulenmeli
- [ ] Basarili giris sonrasi ana sayfaya yonlendirilmeli
- [ ] Giris sonrasi localStorage'da token saklanmali
- [ ] Giris sonrasi header'da kullanici adi goruntulenmeli

### 1.3 Cikis Testleri

- [ ] Cikis butonuna tiklandiginda oturum sonlanmali
- [ ] Cikis sonrasi login sayfasina yonlendirilmeli
- [ ] Cikis sonrasi localStorage temizlenmeli

---

## 2. YETKILENDIRME (10 Puan)

### 2.1 JWT Token Testleri

- [ ] Giris yapildiginda JWT token alinmali
- [ ] Token her API isteginde Authorization header'da gonderilmeli
- [ ] Gecersiz token ile istek yapildiginda 401 hatasi donmeli
- [ ] Token suresiz/gecersiz oldugunda otomatik cikis yapilmali

### 2.2 Rol Bazli Erisim Testleri

- [ ] Normal kullanici admin paneline erismemeli
- [ ] Admin kullanici admin paneline erismeli
- [ ] Giris yapmamis kullanici korunmus sayfalara erismemeli
- [ ] Banlanan kullanici islem yapamamali

### 2.3 Route Korumasi Testleri

- [ ] /admin/\* route'lari sadece admin icin erislebilir
- [ ] /questions/new sadece giris yapmis kullanici icin erislebilir
- [ ] /profile sadece giris yapmis kullanici icin erislebilir
- [ ] Yetkisiz erisimde login sayfasina yonlendirme

---

## 3. 4 ENTITY (15 Puan)

### 3.1 User Entity Testleri

- [ ] Kullanici olusturma (kayit)
- [ ] Kullanici bilgilerini goruntuleme (profil)
- [ ] Kullanici bilgilerini guncelleme (profil duzenle)
- [ ] Kullanici silme (admin tarafindan)
- [ ] Kullanici banlama/ban kaldirma (admin tarafindan)

### 3.2 Question Entity Testleri

- [ ] Soru olusturma
- [ ] Soru listeleme (pagination ile)
- [ ] Soru detay goruntuleme
- [ ] Soru guncelleme (sadece yazar tarafindan)
- [ ] Soru silme (yazar veya admin tarafindan)
- [ ] Soruya resim ekleme (Cloudinary)

### 3.3 Answer Entity Testleri

- [ ] Cevap olusturma
- [ ] Cevap listeleme (soru detayinda)
- [ ] Cevap guncelleme (sadece yazar tarafindan)
- [ ] Cevap silme (yazar veya admin tarafindan)
- [ ] Cevaba yanitlama (nested replies)
- [ ] Cevaba resim ekleme (Cloudinary)

### 3.4 Tag Entity Testleri

- [ ] Etiket olusturma (admin)
- [ ] Etiket listeleme
- [ ] Etiket guncelleme (admin)
- [ ] Etiket silme (admin)
- [ ] Etiket kategorisi (MAKYAJ/BAKIM)

### 3.5 Subcategory Entity Testleri

- [ ] Alt kategori olusturma (admin)
- [ ] Alt kategori listeleme
- [ ] Alt kategori guncelleme (admin)
- [ ] Alt kategori silme (admin)

### 3.6 Vote Entity Testleri

- [ ] Oy verme (upvote)
- [ ] Oy geri alma (toggle)
- [ ] Oy sayisi goruntuleme

### 3.7 Report Entity Testleri

- [ ] Sikayet olusturma
- [ ] Sikayet listeleme (admin)
- [ ] Sikayet cozumleme (admin)

### 3.8 Notification Entity Testleri

- [ ] Bildirim olusturma (otomatik)
- [ ] Bildirim listeleme
- [ ] Bildirim okundu isaretleme
- [ ] Okunmamis bildirim sayisi

### 3.9 Bookmark Entity Testleri

- [ ] Yer imi ekleme
- [ ] Yer imi kaldirma
- [ ] Yer imlerini listeleme

---

## 4. BIRE COK ILISKI (15 Puan)

### 4.1 User -> Question (Bire Cok)

- [ ] Bir kullanici birden fazla soru sorabilmeli
- [ ] Soru silindiginde kullanici etkilenmemeli
- [ ] Kullanici silindiginde sorulari ne olacak (cascade kontrolu)
- [ ] Soru detayinda yazar bilgisi goruntulenmeli

### 4.2 User -> Answer (Bire Cok)

- [ ] Bir kullanici birden fazla cevap yazabilmeli
- [ ] Cevap silindiginde kullanici etkilenmemeli
- [ ] Cevap detayinda yazar bilgisi goruntulenmeli

### 4.3 Question -> Answer (Bire Cok)

- [ ] Bir soruya birden fazla cevap yazilabilmeli
- [ ] Soru silindiginde cevaplari silinmeli (cascade)
- [ ] Soru detayinda cevap sayisi goruntulenmeli

### 4.4 Answer -> Reply (Bire Cok - Self Reference)

- [ ] Bir cevaba birden fazla yanit yazilabilmeli
- [ ] Parent cevap silindiginde yanitlar silinmeli

### 4.5 Subcategory -> Tag (Bire Cok)

- [ ] Bir alt kategoriye birden fazla etiket baglanabilmeli
- [ ] Alt kategori silindiginde etiketler kategorisiz kalmali

---

## 5. COKA COK ILISKI (15 Puan)

### 5.1 Question <-> Tag (Coka Cok)

- [ ] Bir soruya birden fazla etiket eklenebilmeli
- [ ] Bir etiket birden fazla soruda kullanilabilmeli
- [ ] Soru olusturulurken etiket secimi yapilabilmeli
- [ ] Soru duzenlenirken etiketler guncellenebilmeli
- [ ] Etiket silindiginde sorular etkilenmemeli
- [ ] Soru silindiginde etiketler etkilenmemeli
- [ ] Etiketlere gore soru filtreleme calismali

### 5.2 Frontend'den Iliski Yonetimi

- [ ] TagSelector komponenti ile etiket secimi
- [ ] Secili etiketlerin goruntulenmesi
- [ ] Etiket ekleme/cikarma islemleri
- [ ] Filtre olarak etiket kullanimi

---

## 6. FRONTEND - BACKEND BAGLANTISI (15 Puan)

### 6.1 API Baglantisi

- [ ] axios instance olusturulmus (api.ts)
- [ ] Base URL dogru ayarlanmis
- [ ] Request interceptor token ekliyor
- [ ] Response interceptor hatalari yonetiyor

### 6.2 CRUD Islemleri

- [ ] CREATE: Soru, Cevap, Etiket, Alt Kategori olusturma
- [ ] READ: Listeleme ve detay goruntuleme
- [ ] UPDATE: Guncelleme islemleri
- [ ] DELETE: Silme islemleri

### 6.3 Hata Yonetimi

- [ ] Network hatalari kullaniciya gosteriliyor
- [ ] Validation hatalari form altinda gosteriliyor
- [ ] 401 hatasinda login'e yonlendirme
- [ ] 403 hatasinda yetkisiz mesaji

### 6.4 Loading States

- [ ] Veri yukleme sirasinda loading gosteriliyor
- [ ] Butonlarda loading/disabled state

---

## 7. TASARIM (20 Puan)

### 7.1 Responsive Tasarim

- [ ] Desktop gorunumu duzgun
- [ ] Tablet gorunumu duzgun
- [ ] Mobil gorunumu duzgun
- [ ] Menu mobile'da hamburger menu

### 7.2 UI/UX

- [ ] Tutarli renk paleti (pembe tema)
- [ ] Okunabilir tipografi
- [ ] Hover efektleri
- [ ] Transition animasyonlari
- [ ] Gorsel tutarlilik

### 7.3 Componenetler

- [ ] Header/Navbar duzgun calisiyor
- [ ] Footer mevcut (varsa)
- [ ] Form elementleri stilize
- [ ] Butonlar tutarli
- [ ] Kartlar (QuestionCard, AnswerCard) duzgun

### 7.4 Gorseller

- [ ] Logo goruntuleniyor
- [ ] Dekoratif gorseller (cat, girl, bunny)
- [ ] GIF animasyonlari (nyanCat vb.)
- [ ] Resim yukleme preview

---

## HIZLI TEST SENARYOLARI

### Senaryo 1: Yeni Kullanici Akisi

1. /register'a git
2. Yeni kullanici olustur
3. Otomatik giris oldu mu kontrol et
4. Profil sayfasina git
5. Bilgileri guncelle
6. Yeni soru sor (resim ile)
7. Baska bir soruya cevap yaz
8. Bir cevabi oyla
9. Bir icerik sikayette bulun
10. Cikis yap

### Senaryo 2: Admin Akisi

1. Admin olarak giris yap (admin@test.com / admin123)
2. Admin paneline git
3. Istatistikleri kontrol et
4. Kullanicilari listele
5. Bir kullaniciyi banla/ban kaldir
6. Raporlari kontrol et
7. Bir raporu cozumle
8. Etiket yonetimi - yeni alt kategori ekle
9. Yeni etiket ekle ve alt kategoriye bagla
10. Etiket duzenle/sil

### Senaryo 3: Soru-Cevap Akisi

1. Giris yap
2. Sorular sayfasina git
3. Kategori sec (Makyaj/Bakim)
4. Alt kategori sec
5. Etiketlere gore filtrele
6. Siralama degistir (en yeni, en cok cevap vb.)
7. Bir soruya tikla
8. Cevap yaz
9. Baska bir cevaba yanit yaz
10. Cevap oyla

### Senaryo 4: Resim Yukleme Akisi

1. Giris yap
2. Profil sayfasina git
3. Avatar yukle (Cloudinary)
4. Yeni soru sor - resim ekle
5. Cevap yaz - resim ekle
6. Resimlerin dogru goruntulndigini kontrol et

---

## API ENDPOINT TESTLERI (Postman/curl)

### Auth Endpoints

```
POST /auth/register - Kayit
POST /auth/login - Giris
```

### User Endpoints

```
GET /users/me - Mevcut kullanici
PATCH /users/me - Profil guncelle
GET /users/profile/:id - Kullanici profili
GET /users - Tum kullanicilar (admin)
PATCH /users/:id/ban - Ban toggle (admin)
DELETE /users/:id - Kullanici sil (admin)
```

### Question Endpoints

```
GET /questions - Soru listesi
GET /questions/:id - Soru detay
GET /questions/my - Kendi sorularim
POST /questions - Soru olustur
PATCH /questions/:id - Soru guncelle
DELETE /questions/:id - Soru sil
PUT /questions/:id/tags - Etiket guncelle
```

### Answer Endpoints

```
POST /questions/:questionId/answers - Cevap olustur
PATCH /answers/:id - Cevap guncelle
DELETE /answers/:id - Cevap sil
```

### Tag Endpoints

```
GET /tags - Etiket listesi
GET /tags/:id - Etiket detay
POST /tags - Etiket olustur (admin)
PATCH /tags/:id - Etiket guncelle (admin)
DELETE /tags/:id - Etiket sil (admin)
GET /tags/subcategories - Alt kategori listesi
POST /tags/subcategories - Alt kategori olustur (admin)
PATCH /tags/subcategories/:id - Alt kategori guncelle (admin)
DELETE /tags/subcategories/:id - Alt kategori sil (admin)
```

### Vote Endpoints

```
POST /answers/:answerId/votes - Oy ver/geri al
GET /answers/:answerId/votes/count - Oy sayisi
GET /answers/:answerId/votes/check - Oy kontrolu
```

### Report Endpoints

```
POST /answers/:answerId/reports - Cevap sikayet
POST /questions/:questionId/reports - Soru sikayet
```

### Admin Endpoints

```
GET /admin/reports - Sikayet listesi
PATCH /admin/reports/:id/resolve - Sikayet cozumle
DELETE /admin/answers/:id - Cevap sil
GET /admin/stats - Istatistikler
```

### Notification Endpoints

```
GET /notifications - Bildirim listesi
GET /notifications/unread-count - Okunmamis sayisi
PATCH /notifications/:id/read - Okundu isaretle
PATCH /notifications/read-all - Tumunu okundu isaretle
DELETE /notifications/:id - Bildirim sil
```

### Bookmark Endpoints

```
GET /bookmarks - Yer imi listesi
POST /bookmarks/questions/:id - Yer imi ekle/kaldir
GET /bookmarks/questions/:id - Yer imi kontrolu
```

### Upload Endpoints

```
POST /uploads/image - Resim yukle (Cloudinary)
```

---

## VERITABANI KONTROLLERI

### Entity Iliskileri

- users tablosu mevcut
- questions tablosu mevcut (authorId -> users)
- answers tablosu mevcut (authorId -> users, questionId -> questions)
- tags tablosu mevcut (subcategoryId -> subcategories)
- subcategories tablosu mevcut
- question_tags_tag join tablosu mevcut (coka cok)
- votes tablosu mevcut
- reports tablosu mevcut
- notifications tablosu mevcut
- bookmarks tablosu mevcut

---

## KONTROL LISTESI - ODEV GEREKSINIMLERI

| Gereksinim                   | Durum                                       |
| ---------------------------- | ------------------------------------------- |
| Calisan kullanici sistemi    | [x]                                         |
| En az 2 rol (USER, ADMIN)    | [x]                                         |
| Kayit sistemi                | [x]                                         |
| Giris sistemi                | [x]                                         |
| Yetkilendirme (JWT)          | [x]                                         |
| Rollere gore farkli sayfalar | [x]                                         |
| En az 4 entity               | [x] (9 entity var)                          |
| En az 1 bire-cok iliski      | [x] (User->Question, Question->Answer, vb.) |
| En az 1 coka-cok iliski      | [x] (Question<->Tag)                        |
| Frontend'den iliski yonetimi | [x]                                         |
| React frontend               | [x]                                         |
| NestJS backend               | [x]                                         |
