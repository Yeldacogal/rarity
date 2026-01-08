# 🎓 RARITY - SÖZLÜ SINAV ÇALIŞMA NOTLARI (BÖLÜM 4)

# TAILWIND CSS, ADMİN PANELİ VE SIKÇA SORULAN SORULAR

---

## 📚 İÇİNDEKİLER

1. [Tailwind CSS Temelleri](#1-tailwind-css-temelleri)
2. [Projede Kullanılan Tailwind Örnekleri](#2-projede-kullanılan-tailwind-örnekleri)
3. [Admin Panel Sayfaları](#3-admin-panel-sayfaları)
4. [TypeScript Tipleri](#4-typescript-tipleri)
5. [Sıkça Sorulan Sorular (SSS)](#5-sıkça-sorulan-sorular-sss)
6. [Hızlı Özet Kartları](#6-hızlı-özet-kartları)

---

## 1. TAILWIND CSS TEMELLERİ

### Tailwind Nedir?

- **Utility-first CSS framework**
- Class'lar ile stil verirsin, CSS yazmadan
- Her class tek bir iş yapar

### Temel Class Kategorileri:

| Kategori         | Örnekler                                       | Açıklama            |
| ---------------- | ---------------------------------------------- | ------------------- |
| **Spacing**      | `p-4`, `m-2`, `px-6`, `my-8`                   | Padding, Margin     |
| **Width/Height** | `w-full`, `h-screen`, `w-64`                   | Genişlik, Yükseklik |
| **Flexbox**      | `flex`, `justify-center`, `items-center`       | Flex layout         |
| **Grid**         | `grid`, `grid-cols-3`, `gap-4`                 | Grid layout         |
| **Colors**       | `bg-pink-600`, `text-white`, `border-gray-300` | Renkler             |
| **Typography**   | `text-lg`, `font-bold`, `text-center`          | Yazı                |
| **Borders**      | `rounded-lg`, `border`, `border-2`             | Kenar               |
| **Effects**      | `shadow-md`, `opacity-50`, `hover:bg-pink-700` | Efektler            |

### Spacing Sistemi:

```
p-1 = padding: 0.25rem (4px)
p-2 = padding: 0.5rem (8px)
p-4 = padding: 1rem (16px)
p-6 = padding: 1.5rem (24px)
p-8 = padding: 2rem (32px)

px = padding-left + padding-right
py = padding-top + padding-bottom
pt, pb, pl, pr = tek yön

Aynı mantık margin için: m-4, mx-auto, my-2...
```

### Responsive Prefixes:

```
sm: 640px+
md: 768px+
lg: 1024px+
xl: 1280px+

Örnek:
className="w-full md:w-1/2 lg:w-1/3"
// Mobil: %100, Tablet: %50, Desktop: %33
```

### State Prefixes:

```
hover: → fare üzerine gelince
focus: → focus olunca
active: → tıklanınca
disabled: → disabled olunca

Örnek:
className="bg-pink-600 hover:bg-pink-700 disabled:opacity-50"
```

---

## 2. PROJEDE KULLANILAN TAILWIND ÖRNEKLERİ

### 📌 Sayfa Container

```html
<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"></div>
```

| Class                  | Ne Yapar                |
| ---------------------- | ----------------------- |
| `max-w-7xl`            | Maksimum genişlik 80rem |
| `mx-auto`              | Yatay ortala            |
| `px-4 sm:px-6 lg:px-8` | Responsive padding      |
| `py-8`                 | Dikey padding           |

### 📌 Kart Tasarımı

```html
<div className="bg-white rounded-lg shadow-md p-6 border border-gray-100"></div>
```

| Class                    | Ne Yapar              |
| ------------------------ | --------------------- |
| `bg-white`               | Beyaz arkaplan        |
| `rounded-lg`             | Yuvarlatılmış köşeler |
| `shadow-md`              | Orta gölge            |
| `p-6`                    | 1.5rem padding        |
| `border border-gray-100` | Açık gri kenar        |

### 📌 Buton Stilleri

```html
<!-- Primary Button -->
<button
  className="bg-pink-600 text-white px-4 py-2 rounded-lg hover:bg-pink-700 transition-colors"
>
  Gönder
</button>

<!-- Secondary Button -->
<button
  className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200"
>
  İptal
</button>

<!-- Danger Button -->
<button className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700">
  Sil
</button>

<!-- Disabled Button -->
<button
  disabled
  className="bg-pink-600 text-white px-4 py-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
>
  Loading...
</button>
```

### 📌 Form Input

```html
<input
  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none"
/>
```

| Class                              | Ne Yapar                  |
| ---------------------------------- | ------------------------- |
| `w-full`                           | Tam genişlik              |
| `px-4 py-2`                        | İç boşluk                 |
| `border border-gray-300`           | Gri kenar                 |
| `rounded-lg`                       | Yuvarlatılmış             |
| `focus:ring-2 focus:ring-pink-500` | Focus'ta pembe halka      |
| `focus:border-transparent`         | Focus'ta kenar gizle      |
| `outline-none`                     | Varsayılan outline kaldır |

### 📌 Flex Layout Örnekleri

```html
<!-- Yatay ortala -->
<div className="flex justify-center">
  <!-- Dikey ortala -->
  <div className="flex items-center">
    <!-- Hem yatay hem dikey ortala -->
    <div className="flex justify-center items-center">
      <!-- Aralarında boşluk -->
      <div className="flex justify-between">
        <!-- Sağa yasla -->
        <div className="flex justify-end">
          <!-- Flex wrap -->
          <div className="flex flex-wrap gap-2"></div>
        </div>
      </div>
    </div>
  </div>
</div>
```

### 📌 Grid Layout Örnekleri

```html
<!-- 3 sütunlu grid -->
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  <!-- 4 sütunlu dashboard -->
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"></div>
</div>
```

### 📌 Responsive Navigation

```html
<nav className="flex items-center space-x-6">
  <!-- space-x-6: Çocuklar arasında yatay boşluk -->
</nav>
```

### 📌 Badge (Bildirim Sayısı)

```html
<span
  className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center"
>
  {count}
</span>
```

| Class                              | Ne Yapar             |
| ---------------------------------- | -------------------- |
| `absolute`                         | Mutlak konumlandırma |
| `-top-1 -right-1`                  | Üst sağ köşeye taşır |
| `rounded-full`                     | Tam yuvarlak         |
| `h-4 w-4`                          | 16x16px              |
| `flex items-center justify-center` | İçeriği ortala       |

### 📌 Loading Spinner

```html
<div
  className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600"
></div>
```

| Class                        | Ne Yapar               |
| ---------------------------- | ---------------------- |
| `animate-spin`               | Döndürme animasyonu    |
| `rounded-full`               | Yuvarlak               |
| `h-12 w-12`                  | 48x48px                |
| `border-b-2 border-pink-600` | Sadece alt kenar pembe |

### 📌 Tag Chips

```html
<span className="px-3 py-1 bg-pink-100 text-pink-800 rounded-full text-sm">
  Cilt Bakımı
</span>
```

### 📌 Hata Mesajı

```html
<div className="bg-red-50 text-red-600 p-4 rounded-lg mb-4">{errorMessage}</div>
```

### 📌 Başarı Mesajı

```html
<div className="bg-green-50 text-green-600 p-4 rounded-lg mb-4">
  İşlem başarılı!
</div>
```

---

## 3. ADMİN PANEL SAYFALARI

### 📌 AdminDashboard.tsx

```typescript
export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    const response = await api.get("/admin/stats");
    setStats(response.data);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Admin Panel</h1>

      {/* İstatistik Kartları */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-gray-500 text-sm font-medium">Kullanıcılar</h3>
          <p className="text-3xl font-bold text-gray-900">{stats?.userCount}</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-gray-500 text-sm font-medium">Sorular</h3>
          <p className="text-3xl font-bold text-gray-900">
            {stats?.questionCount}
          </p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-gray-500 text-sm font-medium">Cevaplar</h3>
          <p className="text-3xl font-bold text-gray-900">
            {stats?.answerCount}
          </p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-gray-500 text-sm font-medium">
            Bekleyen Şikayetler
          </h3>
          <p className="text-3xl font-bold text-red-600">
            {stats?.pendingReportCount}
          </p>
        </div>
      </div>

      {/* Hızlı Linkler */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link
          to="/admin/users"
          className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow"
        >
          <h3 className="font-semibold text-gray-900">Kullanıcı Yönetimi</h3>
          <p className="text-gray-500 text-sm">
            Kullanıcıları görüntüle ve yönet
          </p>
        </Link>

        <Link
          to="/admin/reports"
          className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow"
        >
          <h3 className="font-semibold text-gray-900">Şikayet Yönetimi</h3>
          <p className="text-gray-500 text-sm">Şikayetleri incele ve çöz</p>
        </Link>

        <Link
          to="/admin/tags"
          className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow"
        >
          <h3 className="font-semibold text-gray-900">Etiket Yönetimi</h3>
          <p className="text-gray-500 text-sm">Etiketleri ekle, düzenle, sil</p>
        </Link>
      </div>
    </div>
  );
}
```

---

### 📌 AdminUsersPage.tsx

```typescript
export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    const response = await api.get("/users");
    setUsers(response.data);
  };

  const handleBan = async (userId: number) => {
    await api.patch(`/users/${userId}/ban`);
    fetchUsers(); // Listeyi yenile
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Kullanıcı Yönetimi</h1>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Kullanıcı
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Rol
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Durum
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                İşlem
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.map((user) => (
              <tr key={user.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="h-10 w-10 rounded-full bg-pink-100 flex items-center justify-center">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">
                        {user.name}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {user.email}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${
                      user.role === "ADMIN"
                        ? "bg-purple-100 text-purple-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {user.role}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${
                      user.isBanned
                        ? "bg-red-100 text-red-800"
                        : "bg-green-100 text-green-800"
                    }`}
                  >
                    {user.isBanned ? "Engelli" : "Aktif"}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  {user.role !== "ADMIN" && (
                    <button
                      onClick={() => handleBan(user.id)}
                      className={`text-sm ${
                        user.isBanned ? "text-green-600" : "text-red-600"
                      } hover:underline`}
                    >
                      {user.isBanned ? "Engeli Kaldır" : "Engelle"}
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
```

---

### 📌 AdminReportsPage.tsx

```typescript
export default function AdminReportsPage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>("PENDING");

  useEffect(() => {
    fetchReports();
  }, [statusFilter]);

  const fetchReports = async () => {
    const response = await api.get("/admin/reports", {
      params: { status: statusFilter },
    });
    setReports(response.data.data);
  };

  const handleResolve = async (
    reportId: number,
    status: "RESOLVED" | "REJECTED"
  ) => {
    await api.patch(`/admin/reports/${reportId}/resolve`, { status });
    fetchReports();
  };

  const handleDeleteAnswer = async (answerId: number) => {
    await api.delete(`/admin/answers/${answerId}`);
    fetchReports();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Şikayet Yönetimi</h1>

      {/* Filtre */}
      <div className="mb-6">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg"
        >
          <option value="PENDING">Bekleyenler</option>
          <option value="RESOLVED">Çözülenler</option>
          <option value="REJECTED">Reddedilenler</option>
        </select>
      </div>

      {/* Şikayet Listesi */}
      <div className="space-y-4">
        {reports.map((report) => (
          <div key={report.id} className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-start">
              <div>
                <span
                  className={`px-2 py-1 text-xs rounded-full ${
                    report.reason === "SPAM"
                      ? "bg-yellow-100 text-yellow-800"
                      : report.reason === "HARASSMENT"
                      ? "bg-red-100 text-red-800"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {report.reason}
                </span>

                <p className="mt-2 text-gray-600">{report.description}</p>

                <div className="mt-2 text-sm text-gray-500">
                  Şikayet Eden: {report.reporter.name}
                </div>

                {report.answer && (
                  <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-700">
                      {report.answer.content}
                    </p>
                    <p className="text-xs text-gray-500 mt-2">
                      Yazan: {report.answer.author?.name}
                    </p>
                  </div>
                )}
              </div>

              {report.status === "PENDING" && (
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleResolve(report.id, "RESOLVED")}
                    className="px-3 py-1 bg-green-600 text-white rounded-lg text-sm"
                  >
                    Çözüldü
                  </button>
                  <button
                    onClick={() => handleResolve(report.id, "REJECTED")}
                    className="px-3 py-1 bg-gray-600 text-white rounded-lg text-sm"
                  >
                    Reddet
                  </button>
                  {report.answer && (
                    <button
                      onClick={() => handleDeleteAnswer(report.answer.id)}
                      className="px-3 py-1 bg-red-600 text-white rounded-lg text-sm"
                    >
                      Cevabı Sil
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
```

---

## 4. TYPESCRIPT TİPLERİ

### 📌 types/index.ts

```typescript
export interface User {
  id: number;
  name: string;
  email: string;
  role: "ADMIN" | "USER";
  avatarUrl?: string;
  bio?: string;
  isBanned: boolean;
  createdAt: string;
}

export interface Question {
  id: number;
  title: string;
  content: string;
  imageUrl?: string;
  authorId: number;
  author: User;
  tags: Tag[];
  answers: Answer[];
  createdAt: string;
  updatedAt: string;
}

export interface Answer {
  id: number;
  content: string;
  imageUrl?: string;
  authorId: number;
  questionId: number;
  parentId?: number;
  author: User;
  votes: Vote[];
  replies: Answer[];
  createdAt: string;
  updatedAt: string;
}

export interface Tag {
  id: number;
  name: string;
  slug: string;
  subcategoryId?: number;
  subcategory?: Subcategory;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  subcategories: Subcategory[];
}

export interface Subcategory {
  id: number;
  name: string;
  slug: string;
  categoryId: number;
  category?: Category;
  tags: Tag[];
}

export interface Vote {
  id: number;
  userId: number;
  answerId: number;
}

export interface Bookmark {
  id: number;
  userId: number;
  questionId?: number;
  answerId?: number;
  question?: Question;
  answer?: Answer;
  createdAt: string;
}

export interface Report {
  id: number;
  reason: "SPAM" | "HARASSMENT" | "INAPPROPRIATE" | "MISINFORMATION" | "OTHER";
  description?: string;
  status: "PENDING" | "RESOLVED" | "REJECTED";
  reporterId: number;
  questionId?: number;
  answerId?: number;
  reporter: User;
  question?: Question;
  answer?: Answer;
  createdAt: string;
}

export interface Notification {
  id: number;
  userId: number;
  type: string;
  message: string;
  isRead: boolean;
  questionId?: number;
  answerId?: number;
  createdAt: string;
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
```

### TypeScript Önemli Kavramlar:

**1. Interface vs Type:**

```typescript
// Interface - Genişletilebilir
interface User {
  name: string;
}

// Type - Daha esnek, union types
type Role = "ADMIN" | "USER";
```

**2. Optional Properties:**

```typescript
interface User {
  name: string; // Zorunlu
  bio?: string; // Opsiyonel (undefined olabilir)
}
```

**3. Union Types:**

```typescript
role: "ADMIN" | "USER"; // İkisinden biri olmalı
```

**4. Generic Types:**

```typescript
interface PaginatedResult<T> {
  data: T[];  // T ne olursa o tipte array
}

// Kullanım:
const result: PaginatedResult<Question> = ...
```

---

## 5. SIKÇA SORULAN SORULAR (SSS)

### 🔹 BACKEND SORULARI

**S1: NestJS'te Module-Controller-Service farkı nedir?**

```
Module: Modülü tanımlar, bağımlılıkları belirtir
Controller: HTTP endpoint'lerini tanımlar (route handler)
Service: İş mantığını içerir (business logic)
```

**S2: TypeORM'da `@JoinColumn` ne işe yarar?**

```
Foreign key'in hangi kolonda tutulacağını belirtir.
@ManyToOne ilişkisinde kullanılır.
```

**S3: `onDelete: 'CASCADE'` ne yapar?**

```
Ana kayıt silindiğinde bağlı kayıtları da siler.
User silinince → onun soruları da silinir.
```

**S4: JWT nasıl çalışır?**

```
1. Login'de backend JWT token döner
2. Frontend bu token'ı localStorage'a kaydeder
3. Her istekte Authorization header'ında gönderir
4. Backend token'ı doğrular ve user bilgisini çıkarır
```

**S5: `@Column({ select: false })` ne yapar?**

```
O kolon varsayılan sorgularda gelmez.
Şifre gibi hassas veriler için kullanılır.
Manuel olarak istemek gerekir.
```

**S6: Guard nedir?**

```
İstek controller'a ulaşmadan önce çalışır.
Auth ve rol kontrolü yapar.
true dönerse devam eder, false/error ise reddeder.
```

**S7: DTO nedir, neden kullanılır?**

```
Data Transfer Object.
- Gelen verinin yapısını tanımlar
- Validation kurallarını belirler
- Güvenlik için whitelist filtresi
```

**S8: ValidationPipe'daki `whitelist: true` ne yapar?**

```
DTO'da tanımlı olmayan field'ları otomatik siler.
Güvenlik için önemli - fazla veri gönderilmesini engeller.
```

**S9: `@ManyToMany` ilişkisinde `@JoinTable` ne yapar?**

```
Ara tablonun yapısını tanımlar.
Hangi tarafın "owner" olduğunu belirtir.
Sadece bir tarafta yazılır.
```

**S10: `findOne` vs `find` farkı nedir?**

```
findOne: Tek kayıt döner (veya null)
find: Array döner (boş array olabilir)
```

---

### 🔹 FRONTEND SORULARI

**S11: Context API neden kullanılır?**

```
Prop drilling'den kaçınmak için.
Global state'i tüm componentlere ulaştırır.
Örnek: Kullanıcı bilgisi her yerde lazım.
```

**S12: useEffect dependency array neden önemli?**

```
[]: Sadece ilk render'da çalışır
[dep]: dep değişince tekrar çalışır
Boş bırakılırsa: Her render'da çalışır (tehlikeli!)
```

**S13: useState vs useEffect farkı?**

```
useState: Veri tutmak için (state)
useEffect: Yan etkileri yönetmek için (API çağrıları, DOM manipülasyonu)
```

**S14: Axios interceptor ne işe yarar?**

```
Request: Her istekten önce çalışır (token ekle)
Response: Her cevaptan sonra çalışır (hata yakala)
```

**S15: `e.preventDefault()` ne yapar?**

```
Form submit'te sayfa yenilemeyi engeller.
SPA'larda JavaScript ile formu işleriz.
```

**S16: Controlled vs Uncontrolled input farkı?**

```
Controlled: value + onChange ile state'e bağlı
Uncontrolled: ref ile DOM'dan değer alınır
React'ta controlled tercih edilir.
```

**S17: `useNavigate` ne işe yarar?**

```
Programatik yönlendirme için.
Örnek: Login başarılı → navigate('/');
```

**S18: `useParams` ne döner?**

```
URL parametrelerini döner.
/questions/:id → { id: "5" }
Not: String döner, number için parseInt() gerek!
```

---

### 🔹 TAILWIND SORULARI

**S19: `flex` vs `grid` ne zaman kullanılır?**

```
flex: Tek boyutlu layout (yatay VEYA dikey)
grid: İki boyutlu layout (satır VE sütun)
```

**S20: `space-x-4` ne yapar?**

```
Çocuklar arasına yatay boşluk ekler.
margin-left: 1rem (ilk hariç)
```

**S21: Responsive prefix sırası?**

```
Küçükten büyüğe: (boş), sm:, md:, lg:, xl:
className="w-full md:w-1/2 lg:w-1/3"
```

---

## 6. HIZLI ÖZET KARTLARI

### 🟢 GİRİŞ/KAYIT (10 Puan)

| Dosya                | İçerik                                   |
| -------------------- | ---------------------------------------- |
| `auth.service.ts`    | register(), login(), bcrypt hash/compare |
| `auth.controller.ts` | POST /auth/register, POST /auth/login    |
| `LoginPage.tsx`      | Form, useState, handleSubmit             |
| `RegisterPage.tsx`   | Form, validation                         |
| `AuthContext.tsx`    | login(), logout(), localStorage          |

### 🟡 YETKİLENDİRME (10 Puan)

| Dosya                       | İçerik                      |
| --------------------------- | --------------------------- |
| `jwt.strategy.ts`           | Token doğrulama, validate() |
| `roles.guard.ts`            | Rol kontrolü, ban kontrolü  |
| `roles.decorator.ts`        | @Roles(UserRole.ADMIN)      |
| `current-user.decorator.ts` | @CurrentUser()              |
| `ProtectedRoute.tsx`        | Login gerektiren sayfalar   |
| `AdminRoute.tsx`            | Admin gerektiren sayfalar   |

### 🔵 4+ ENTITY (15 Puan)

| Entity       | İlişkiler                                |
| ------------ | ---------------------------------------- |
| User         | questions, answers, votes                |
| Question     | author, tags, answers                    |
| Answer       | author, question, parent, replies, votes |
| Tag          | questions, subcategory                   |
| Vote         | user, answer                             |
| Report       | reporter, question, answer               |
| Bookmark     | user, question, answer                   |
| Notification | user                                     |
| Category     | subcategories                            |
| Subcategory  | category, tags                           |

### 🟣 1'E ÇOK İLİŞKİ (15 Puan)

```typescript
// User → Questions (1 user, N questions)
@OneToMany(() => Question, (q) => q.author)
questions: Question[];

// Question → Answers (1 question, N answers)
@OneToMany(() => Answer, (a) => a.question)
answers: Answer[];

// Answer → Replies (self-referencing)
@OneToMany(() => Answer, (a) => a.parent)
replies: Answer[];
```

### 🟠 ÇOKA ÇOK İLİŞKİ (15 Puan)

```typescript
// Question ↔ Tag
@ManyToMany(() => Tag, (tag) => tag.questions)
@JoinTable({
  name: 'question_tags',  // Ara tablo
  joinColumn: { name: 'questionId' },
  inverseJoinColumn: { name: 'tagId' },
})
tags: Tag[];
```

### 🔴 FRONTEND-BACKEND BAĞLANTISI (15 Puan)

| Frontend                      | Backend              |
| ----------------------------- | -------------------- |
| `api.ts` (Axios)              | Controller'lar       |
| `interceptors`                | JWT validation       |
| `useEffect` → `api.get()`     | GET endpoint         |
| `handleSubmit` → `api.post()` | POST endpoint        |
| `localStorage.token`          | Authorization header |

### ⚪ TASARIM (20 Puan)

| Özellik       | Tailwind                         |
| ------------- | -------------------------------- |
| Responsive    | `md:`, `lg:` prefix              |
| Hover effects | `hover:bg-pink-700`              |
| Focus states  | `focus:ring-2`                   |
| Spacing       | `p-4`, `m-2`, `space-x-4`        |
| Colors        | `bg-pink-600`, `text-gray-700`   |
| Shadows       | `shadow-md`, `shadow-lg`         |
| Borders       | `rounded-lg`, `border`           |
| Layout        | `flex`, `grid`, `justify-center` |

---

## 📋 DOSYA REFERANS TABLOSU

| Dosya                | Ne İçerir               | Hangi Puan             |
| -------------------- | ----------------------- | ---------------------- |
| `main.ts`            | CORS, ValidationPipe    | Backend yapısı         |
| `app.module.ts`      | TypeORM, modül imports  | Backend yapısı         |
| `user.entity.ts`     | User tablosu, ilişkiler | Entity (15P)           |
| `question.entity.ts` | Question, ManyToMany    | İlişkiler (15P)        |
| `answer.entity.ts`   | Self-referencing        | 1'e Çok (15P)          |
| `auth.service.ts`    | bcrypt, JWT             | Giriş/Kayıt (10P)      |
| `jwt.strategy.ts`    | Token validation        | Yetkilendirme (10P)    |
| `roles.guard.ts`     | Rol kontrolü            | Yetkilendirme (10P)    |
| `AuthContext.tsx`    | Global state            | Frontend-Backend (15P) |
| `api.ts`             | Axios, interceptors     | Frontend-Backend (15P) |
| `Layout.tsx`         | Header, Tailwind        | Tasarım (20P)          |
| `LoginPage.tsx`      | Form, styling           | Giriş + Tasarım        |

---

# 🎯 SON SÖZ

Bu dört bölümlük çalışma notları, projenizdeki tüm önemli kod parçalarını kapsamaktadır. Hoca herhangi bir dosyayı açıp sorduğunda:

1. **Dosyanın hangi feature'a ait olduğunu söyle**
2. **Ne iş yaptığını kısaca açıkla**
3. **Önemli kod satırlarını göster**

Örnek cevap:

> "Bu `questions.service.ts` dosyası, soru CRUD işlemlerini yapan service. `findAll()` metodu QueryBuilder ile soruları filtreleyip, sayfalayıp döndürüyor. `leftJoinAndSelect` ile author ve tags ilişkilerini de çekiyor."

**Başarılar! 🍀**
