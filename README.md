# RARITY - Cilt Bakımı & Makyaj Soru-Cevap Topluluğu

✨ RARITY, cilt bakımı ve makyaj konularında soru sorma, cevaplama ve deneyim paylaşma platformudur.


## 🛠️ Teknolojiler

### Backend

- **Framework:** NestJS (TypeScript)
- **ORM:** TypeORM
- **Database:** PostgreSQL
- **Auth:** JWT + Passport

### Frontend

- **Framework:** React + Vite (TypeScript)
- **Styling:** TailwindCSS + Flowbite
- **HTTP:** Axios
- **Routing:** React Router DOM

---

## 📚 API Endpoints

### Auth

| Method | Endpoint       | Açıklama             |
| ------ | -------------- | -------------------- |
| POST   | /auth/register | Yeni kullanıcı kaydı |
| POST   | /auth/login    | Kullanıcı girişi     |

### Users

| Method | Endpoint           | Açıklama                         |
| ------ | ------------------ | -------------------------------- |
| GET    | /users/me          | Mevcut kullanıcı bilgileri (JWT) |
| GET    | /users/profile/:id | Kullanıcı profili (public)       |
| GET    | /users             | Tüm kullanıcılar (Admin)         |
| PATCH  | /users/:id/ban     | Ban/Unban toggle (Admin)         |
| DELETE | /users/:id         | Kullanıcıyı sil (Admin)          |

### Questions

| Method | Endpoint            | Açıklama                                       |
| ------ | ------------------- | ---------------------------------------------- |
| GET    | /questions          | Sorular listesi (arama, filtreleme, sayfalama) |
| GET    | /questions/:id      | Soru detayı                                    |
| GET    | /questions/my       | Kullanıcının soruları (JWT)                    |
| POST   | /questions          | Yeni soru oluştur (JWT)                        |
| PATCH  | /questions/:id      | Soru güncelle (Owner/Admin)                    |
| PUT    | /questions/:id/tags | Soru etiketlerini güncelle (Owner/Admin)       |
| DELETE | /questions/:id      | Soru sil (Owner/Admin)                         |

### Answers

| Method | Endpoint               | Açıklama                     |
| ------ | ---------------------- | ---------------------------- |
| POST   | /questions/:id/answers | Cevap ekle (JWT)             |
| PATCH  | /answers/:id           | Cevap güncelle (Owner/Admin) |
| DELETE | /answers/:id           | Cevap sil (Owner/Admin)      |

### Votes

| Method | Endpoint                 | Açıklama                      |
| ------ | ------------------------ | ----------------------------- |
| POST   | /answers/:id/votes       | Oy ver/kaldır (toggle) (JWT)  |
| GET    | /answers/:id/votes/count | Oy sayısı                     |
| GET    | /answers/:id/votes/check | Kullanıcı oy vermiş mi? (JWT) |

### Tags

| Method | Endpoint  | Açıklama                |
| ------ | --------- | ----------------------- |
| GET    | /tags     | Tüm etiketler (public)  |
| POST   | /tags     | Etiket oluştur (Admin)  |
| PATCH  | /tags/:id | Etiket güncelle (Admin) |
| DELETE | /tags/:id | Etiket sil (Admin)      |

### Reports

| Method | Endpoint             | Açıklama                |
| ------ | -------------------- | ----------------------- |
| POST   | /answers/:id/reports | Cevabı şikayet et (JWT) |

### Admin

| Method | Endpoint                   | Açıklama                                 |
| ------ | -------------------------- | ---------------------------------------- |
| GET    | /admin/reports             | Şikayetleri listele (Admin)              |
| PATCH  | /admin/reports/:id/resolve | Şikayeti çözüldü olarak işaretle (Admin) |
| DELETE | /admin/answers/:id         | Cevabı moderasyon ile sil (Admin)        |
| GET    | /admin/stats               | İstatistikler (Admin)                    |

---

## 🗄️ Veritabanı Şeması

### Entity'ler

1. **User** - Kullanıcı

   - id, name, email, passwordHash, role (ADMIN/USER), isBanned, createdAt

2. **Question** - Soru

   - id, title, content, imageUrl, createdAt, updatedAt, authorId
   - İlişkiler: author (User), answers (Answer[]), tags (Tag[])

3. **Answer** - Cevap

   - id, content, imageUrl, createdAt, updatedAt, authorId, questionId
   - İlişkiler: author (User), question (Question), votes (Vote[]), reports (Report[])

4. **Tag** - Etiket

   - id, name
   - İlişkiler: questions (Question[]) - N:N

5. **Vote** - Faydalı Oyu

   - id, userId, answerId
   - Unique constraint: (userId, answerId)

6. **Report** - Şikayet
   - id, reason, details, status, createdAt, reporterId, answerId
   - İlişkiler: reporter (User), answer (Answer)

### İlişkiler

- **1:N:** User → Questions, User → Answers, Question → Answers
- **N:N:** Question ↔ Tag (question_tags ara tablosu)

---

## 📂 Proje Yapısı

```
/backend
├── src/
│   ├── common/
│   │   ├── decorators/    # CurrentUser, Roles decorators
│   │   ├── enums/         # UserRole, ReportReason, ReportStatus
│   │   └── guards/        # RolesGuard, BannedGuard
│   ├── entities/          # TypeORM entities
│   ├── modules/
│   │   ├── auth/          # Auth module (register, login, JWT)
│   │   ├── users/         # Users module
│   │   ├── questions/     # Questions module
│   │   ├── answers/       # Answers module
│   │   ├── tags/          # Tags module
│   │   ├── votes/         # Votes module
│   │   ├── reports/       # Reports module
│   │   └── admin/         # Admin module
│   ├── seeds/             # Database seeder
│   ├── app.module.ts
│   └── main.ts

/frontend
├── src/
│   ├── components/        # React components
│   ├── contexts/          # AuthContext
│   ├── lib/               # API client (axios)
│   ├── pages/             # Page components
│   │   ├── admin/         # Admin pages
│   │   └── ...
│   ├── types/             # TypeScript types
│   ├── App.tsx
│   └── main.tsx
```

---



## 🤝 Destek

Sorularınız için issue açabilirsiniz.

**RARITY** ✨ - Güzellik dünyasının bilgi paylaşım platformu!
