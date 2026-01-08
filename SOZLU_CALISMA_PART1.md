# 🎓 RARITY - SÖZLÜ SINAV ÇALIŞMA NOTLARI (BÖLÜM 1)

# BACKEND KODLARI VE AÇIKLAMALARI

---

## 📚 İÇİNDEKİLER

1. [Proje Genel Yapısı](#1-proje-genel-yapısı)
2. [main.ts - Uygulama Başlangıcı](#2-maints---uygulama-başlangıcı)
3. [app.module.ts - Ana Modül](#3-appmodulets---ana-modül)
4. [Entity'ler ve İlişkiler](#4-entityler-ve-ilişkiler)
5. [Auth Modülü (Giriş/Kayıt)](#5-auth-modülü-girişkayıt)
6. [Guards ve Decorators (Yetkilendirme)](#6-guards-ve-decorators-yetkilendirme)

---

## 1. PROJE GENEL YAPISI

### 🎯 Proje Nedir?

**RARITY** - Kozmetik ve güzellik alanında soru-cevap platformu. Kullanıcılar soru sorabilir, cevap yazabilir, oy verebilir, şikayet edebilir.

### 🔧 Kullanılan Teknolojiler

| Backend                             | Frontend                             |
| ----------------------------------- | ------------------------------------ |
| **NestJS** - Node.js framework      | **React 18** - UI library            |
| **TypeORM** - Veritabanı ORM        | **TypeScript** - Tip güvenliği       |
| **PostgreSQL** - Veritabanı         | **Vite** - Build aracı               |
| **JWT** - Token kimlik doğrulama    | **Tailwind CSS** - Stil              |
| **Passport.js** - Auth stratejileri | **Axios** - HTTP client              |
| **bcrypt** - Şifre hashleme         | **React Router** - Sayfa yönlendirme |

### 📁 Backend Klasör Yapısı

```
backend/src/
├── main.ts              → Uygulama giriş noktası
├── app.module.ts        → Ana modül (tüm modülleri birleştirir)
├── health.controller.ts → Sunucu sağlık kontrolü
├── entities/            → Veritabanı tablo tanımları
│   ├── user.entity.ts
│   ├── question.entity.ts
│   ├── answer.entity.ts
│   ├── vote.entity.ts
│   ├── tag.entity.ts
│   ├── category.entity.ts
│   ├── subcategory.entity.ts
│   ├── report.entity.ts
│   ├── bookmark.entity.ts
│   └── notification.entity.ts
├── modules/             → Feature modülleri
│   ├── auth/           → Kimlik doğrulama
│   ├── users/          → Kullanıcı işlemleri
│   ├── questions/      → Soru işlemleri
│   ├── answers/        → Cevap işlemleri
│   ├── votes/          → Oylama
│   ├── tags/           → Etiketler
│   ├── categories/     → Kategoriler
│   ├── reports/        → Şikayetler
│   ├── bookmarks/      → Favoriler
│   ├── notifications/  → Bildirimler
│   ├── uploads/        → Resim yükleme
│   └── admin/          → Admin işlemleri
└── common/             → Ortak kullanılan kodlar
    ├── decorators/     → Custom decorator'lar
    ├── guards/         → Yetki kontrolleri
    └── enums/          → Sabit değerler
```

---

## 2. main.ts - UYGULAMA BAŞLANGICI

### Tam Kod:

```typescript
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ValidationPipe } from "@nestjs/common";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    })
  );

  app.enableCors({
    origin: ["http://localhost:5173"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  });

  await app.listen(3000);
  console.log("Backend is running on http://localhost:3000");
}

bootstrap();
```

### Satır Satır Açıklama:

| Satır | Kod                                 | Açıklama                         |
| ----- | ----------------------------------- | -------------------------------- |
| 1     | `import { NestFactory }`            | NestJS uygulama fabrikası        |
| 2     | `import { AppModule }`              | Ana modülü import et             |
| 3     | `import { ValidationPipe }`         | Validasyon pipe'ı                |
| 6     | `async function bootstrap()`        | Async başlatma fonksiyonu        |
| 7     | `NestFactory.create(AppModule)`     | NestJS uygulamasını oluştur      |
| 9-14  | `ValidationPipe({ ... })`           | Global validasyon ayarları       |
| 10    | `whitelist: true`                   | DTO'da olmayan field'ları SİL    |
| 11    | `transform: true`                   | String → Number otomatik dönüşüm |
| 12    | `forbidNonWhitelisted: true`        | Fazla field varsa HATA ver       |
| 16-21 | `enableCors({ ... })`               | CORS ayarları (Frontend erişimi) |
| 17    | `origin: ['http://localhost:5173']` | Sadece bu URL'den istek kabul et |
| 18    | `credentials: true`                 | Cookie gönderimi izni            |
| 23    | `app.listen(3000)`                  | 3000 portunda dinle              |

### 🎯 CORS Nedir?

- **Cross-Origin Resource Sharing** (Çapraz Kaynak Paylaşımı)
- Frontend (5173) farklı port'ta, Backend (3000) farklı port'ta
- Tarayıcı güvenlik gereği farklı origin'ler arası isteği engeller
- `enableCors()` ile izin veriyoruz

### 🎯 ValidationPipe Nedir?

- Gelen HTTP request'lerini DTO'lara göre doğrular
- Yanlış tip veya eksik veri gelirse hata döner
- Güvenlik için kritik!

---

## 3. app.module.ts - ANA MODÜL

### Tam Kod:

```typescript
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: "postgres",
        host: configService.get("DB_HOST"),
        port: parseInt(configService.get("DB_PORT") || "5432"),
        username: configService.get("DB_USERNAME"),
        password: configService.get("DB_PASSWORD"),
        database: configService.get("DB_NAME"),
        autoLoadEntities: true,
        synchronize: true,
      }),
    }),
    AuthModule,
    UsersModule,
    QuestionsModule,
    AnswersModule,
    TagsModule,
    CategoriesModule,
    VotesModule,
    ReportsModule,
    BookmarksModule,
    NotificationsModule,
    UploadsModule,
    AdminModule,
  ],
  controllers: [HealthController],
})
export class AppModule {}
```

### Parça Parça Açıklama:

**1. ConfigModule:**

```typescript
ConfigModule.forRoot({
  isGlobal: true,
});
```

- `.env` dosyasındaki değişkenleri yükler
- `isGlobal: true`: Tüm modüllerden erişilebilir
- Örnek: `configService.get('DB_HOST')` → `.env`'deki DB_HOST değeri

**2. TypeOrmModule (Veritabanı Bağlantısı):**

```typescript
TypeOrmModule.forRootAsync({
  useFactory: (configService: ConfigService) => ({
    type: "postgres", // PostgreSQL kullan
    host: configService.get("DB_HOST"),
    port: parseInt(configService.get("DB_PORT")),
    username: configService.get("DB_USERNAME"),
    password: configService.get("DB_PASSWORD"),
    database: configService.get("DB_NAME"),
    autoLoadEntities: true, // Entity'leri otomatik bul
    synchronize: true, // Tablo yapısını otomatik güncelle
  }),
});
```

⚠️ **synchronize: true** → Sadece geliştirmede! Production'da **false** olmalı!

**3. Feature Modülleri:**

```typescript
AuthModule,      // Giriş/Kayıt
UsersModule,     // Kullanıcı işlemleri
QuestionsModule, // Soru CRUD
AnswersModule,   // Cevap CRUD
TagsModule,      // Etiket yönetimi
VotesModule,     // Oylama sistemi
ReportsModule,   // Şikayet sistemi
BookmarksModule, // Favori sistemi
// ...
```

---

## 4. ENTITY'LER VE İLİŞKİLER

### 📊 Veritabanı Diyagramı

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│    User     │1───N│  Question   │1───N│   Answer    │
│             │     │             │     │             │
│ id          │     │ id          │     │ id          │
│ name        │     │ title       │     │ content     │
│ email       │     │ content     │     │ authorId    │◄──┐
│ passwordHash│     │ authorId ◄──┤     │ questionId  │   │
│ role        │     │             │     │ parentId ───┼───┘
│ isBanned    │     └──────┬──────┘     └──────┬──────┘
└──────┬──────┘            │                   │
       │              N────┴────N              │
       │              │         │              │
       │         ┌────┴────┐    │         ┌────┴────┐
       │         │   Tag   │    │         │  Vote   │
       │         │         │    │         │         │
       │         │ id      │    │         │ id      │
       │         │ name    │    │         │ userId  │
       │         │ slug    │    │         │ answerId│
       │         └─────────┘    │         └─────────┘
       │                        │
       │    ┌─────────────┐     │    ┌─────────────┐
       │    │  Bookmark   │     │    │   Report    │
       │    │             │     │    │             │
       └───►│ userId      │     └───►│ answerId    │
            │ questionId  │          │ questionId  │
            │ answerId    │          │ reason      │
            └─────────────┘          └─────────────┘
```

---

### 📌 User Entity (user.entity.ts)

```typescript
@Entity("users")
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column({ select: false })
  passwordHash: string;

  @Column({ nullable: true })
  avatarUrl: string;

  @Column({ nullable: true })
  bio: string;

  @Column({
    type: "enum",
    enum: UserRole,
    default: UserRole.USER,
  })
  role: UserRole;

  @Column({ default: false })
  isBanned: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @OneToMany(() => Question, (question) => question.author)
  questions: Question[];

  @OneToMany(() => Answer, (answer) => answer.author)
  answers: Answer[];

  @OneToMany(() => Vote, (vote) => vote.user)
  votes: Vote[];
}
```

### Decorator Açıklamaları:

| Decorator                     | Ne Yapar                     | Örnek                  |
| ----------------------------- | ---------------------------- | ---------------------- |
| `@Entity('users')`            | Bu class "users" tablosu     | CREATE TABLE users     |
| `@PrimaryGeneratedColumn()`   | Auto-increment ID            | id SERIAL PRIMARY KEY  |
| `@Column()`                   | Normal sütun                 | name VARCHAR           |
| `@Column({ unique: true })`   | Benzersiz değer              | email VARCHAR UNIQUE   |
| `@Column({ select: false })`  | Varsayılan sorgularda gelmez | Şifre güvenliği!       |
| `@Column({ nullable: true })` | NULL olabilir                | bio VARCHAR NULL       |
| `@Column({ default: false })` | Varsayılan değer             | isBanned DEFAULT false |
| `@CreateDateColumn()`         | Otomatik tarih               | createdAt TIMESTAMP    |
| `@OneToMany()`                | 1 User → N Question          | 1'e Çok ilişki         |

### `select: false` Neden Önemli?

```typescript
// YANLIŞ - Şifre de gelir!
const user = await userRepo.findOne({ where: { id: 1 } });

// DOĞRU - Şifre gelmez (select: false sayesinde)
const user = await userRepo.findOne({ where: { id: 1 } });

// ŞİFRE GEREKLİYSE - Açıkça iste
const user = await userRepo.findOne({
  where: { id: 1 },
  select: ["id", "email", "passwordHash"], // Manuel olarak ekle
});
```

---

### 📌 Question Entity (question.entity.ts)

```typescript
@Entity("questions")
export class Question {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column("text")
  content: string;

  @Column({ nullable: true })
  imageUrl: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column()
  authorId: number;

  @ManyToOne(() => User, (user) => user.questions, { onDelete: "CASCADE" })
  @JoinColumn({ name: "authorId" })
  author: User;

  @OneToMany(() => Answer, (answer) => answer.question)
  answers: Answer[];

  @ManyToMany(() => Tag, (tag) => tag.questions)
  @JoinTable({
    name: "question_tags",
    joinColumn: { name: "questionId" },
    inverseJoinColumn: { name: "tagId" },
  })
  tags: Tag[];
}
```

### İlişki Türleri Açıklaması:

**1. @ManyToOne (Çoka-Bir):**

```typescript
@ManyToOne(() => User, (user) => user.questions, { onDelete: 'CASCADE' })
@JoinColumn({ name: 'authorId' })
author: User;
```

- N Question → 1 User (Çok soru → bir kullanıcı)
- `@JoinColumn`: Foreign key hangi kolonda
- `onDelete: 'CASCADE'`: User silinince soruları da sil

**2. @OneToMany (Bire-Çok):**

```typescript
@OneToMany(() => Answer, (answer) => answer.question)
answers: Answer[];
```

- 1 Question → N Answer (Bir soru → çok cevap)
- Foreign key karşı tarafta (Answer'da questionId var)

**3. @ManyToMany (Çoka-Çok):**

```typescript
@ManyToMany(() => Tag, (tag) => tag.questions)
@JoinTable({
  name: 'question_tags',        // Ara tablo adı
  joinColumn: { name: 'questionId' },
  inverseJoinColumn: { name: 'tagId' },
})
tags: Tag[];
```

- N Question ↔ N Tag
- Ara tablo `question_tags` oluşur:
  - `questionId` (FK → questions.id)
  - `tagId` (FK → tags.id)

---

### 📌 Answer Entity (answer.entity.ts)

```typescript
@Entity("answers")
export class Answer {
  @PrimaryGeneratedColumn()
  id: number;

  @Column("text")
  content: string;

  @Column({ nullable: true })
  imageUrl: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column()
  authorId: number;

  @Column()
  questionId: number;

  @Column({ nullable: true })
  parentId: number;

  @ManyToOne(() => User, { onDelete: "CASCADE" })
  @JoinColumn({ name: "authorId" })
  author: User;

  @ManyToOne(() => Question, { onDelete: "CASCADE" })
  @JoinColumn({ name: "questionId" })
  question: Question;

  @ManyToOne(() => Answer, (answer) => answer.replies, { nullable: true })
  @JoinColumn({ name: "parentId" })
  parent: Answer;

  @OneToMany(() => Answer, (answer) => answer.parent)
  replies: Answer[];

  @OneToMany(() => Vote, (vote) => vote.answer)
  votes: Vote[];
}
```

### Self-Referencing İlişki (Nested Yorumlar):

```typescript
@Column({ nullable: true })
parentId: number;  // Üst cevabın ID'si

@ManyToOne(() => Answer, (answer) => answer.replies)
parent: Answer;  // Bu cevabın üst cevabı

@OneToMany(() => Answer, (answer) => answer.parent)
replies: Answer[];  // Bu cevaba verilen yanıtlar
```

**Nasıl Çalışır:**

- Ana cevap: `parentId = null`
- Yanıt: `parentId = 5` (5 numaralı cevaba yanıt)
- Yanıta yanıt: `parentId = 10` (10 numaralı cevaba yanıt)

---

### 📌 Vote Entity (vote.entity.ts)

```typescript
@Entity("votes")
@Unique(["userId", "answerId"])
export class Vote {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @Column()
  answerId: number;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => User, (user) => user.votes, { onDelete: "CASCADE" })
  @JoinColumn({ name: "userId" })
  user: User;

  @ManyToOne(() => Answer, (answer) => answer.votes, { onDelete: "CASCADE" })
  @JoinColumn({ name: "answerId" })
  answer: Answer;
}
```

### @Unique Constraint:

```typescript
@Unique(['userId', 'answerId'])
```

- Bir kullanıcı bir cevaba **sadece 1 kez** oy verebilir
- Aynı kombinasyon tekrar eklenirse → **HATA**
- SQL: `UNIQUE(userId, answerId)`

---

### 📌 Tag Entity (tag.entity.ts)

```typescript
@Entity("tags")
export class Tag {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  slug: string;

  @Column({ nullable: true })
  subcategoryId: number;

  @ManyToOne(() => Subcategory, (sub) => sub.tags, { nullable: true })
  @JoinColumn({ name: "subcategoryId" })
  subcategory: Subcategory;

  @ManyToMany(() => Question, (question) => question.tags)
  questions: Question[];
}
```

### Slug Nedir?

- URL-friendly isim
- Örnek: "Cilt Bakımı" → "cilt-bakimi"
- `unique: true` → Aynı slug'dan 2 tane olamaz

---

### 📌 Category ve Subcategory Entity'leri

```typescript
// category.entity.ts
@Entity("categories")
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  slug: string;

  @OneToMany(() => Subcategory, (sub) => sub.category)
  subcategories: Subcategory[];
}

// subcategory.entity.ts
@Entity("subcategories")
export class Subcategory {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  slug: string;

  @Column()
  categoryId: number;

  @ManyToOne(() => Category, (cat) => cat.subcategories, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "categoryId" })
  category: Category;

  @OneToMany(() => Tag, (tag) => tag.subcategory)
  tags: Tag[];
}
```

### Hiyerarşi:

```
Category (Kategori)
  └── Subcategory (Alt Kategori)
        └── Tag (Etiket)

Örnek:
Cilt Bakımı (Category)
  └── Temizleyiciler (Subcategory)
        ├── Yüz Yıkama (Tag)
        └── Tonik (Tag)
```

---

### 📌 Bookmark Entity (bookmark.entity.ts)

```typescript
@Entity("bookmarks")
@Unique(["userId", "questionId"])
@Unique(["userId", "answerId"])
export class Bookmark {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @Column({ nullable: true })
  questionId: number;

  @Column({ nullable: true })
  answerId: number;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => User, { onDelete: "CASCADE" })
  @JoinColumn({ name: "userId" })
  user: User;

  @ManyToOne(() => Question, { nullable: true, onDelete: "CASCADE" })
  @JoinColumn({ name: "questionId" })
  question: Question;

  @ManyToOne(() => Answer, { nullable: true, onDelete: "CASCADE" })
  @JoinColumn({ name: "answerId" })
  answer: Answer;
}
```

### Polimorfik İlişki:

- Hem soruyu hem cevabı favoriye ekleyebilirsin
- `questionId` VEYA `answerId` dolu olur (ikisi birden değil)
- İki ayrı unique constraint var

---

### 📌 Report Entity (report.entity.ts)

```typescript
@Entity("reports")
export class Report {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: "enum",
    enum: ReportReason,
  })
  reason: ReportReason;

  @Column({ nullable: true })
  description: string;

  @Column({
    type: "enum",
    enum: ReportStatus,
    default: ReportStatus.PENDING,
  })
  status: ReportStatus;

  @Column()
  reporterId: number;

  @Column({ nullable: true })
  questionId: number;

  @Column({ nullable: true })
  answerId: number;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => User, { onDelete: "CASCADE" })
  reporter: User;

  @ManyToOne(() => Question, { nullable: true, onDelete: "CASCADE" })
  question: Question;

  @ManyToOne(() => Answer, { nullable: true, onDelete: "CASCADE" })
  answer: Answer;
}
```

### Enum Kullanımı:

```typescript
// report.enum.ts
export enum ReportReason {
  SPAM = "SPAM",
  HARASSMENT = "HARASSMENT",
  INAPPROPRIATE = "INAPPROPRIATE",
  MISINFORMATION = "MISINFORMATION",
  OTHER = "OTHER",
}

export enum ReportStatus {
  PENDING = "PENDING",
  RESOLVED = "RESOLVED",
  REJECTED = "REJECTED",
}
```

---

### 📌 Notification Entity (notification.entity.ts)

```typescript
@Entity("notifications")
export class Notification {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @Column()
  type: string;

  @Column()
  message: string;

  @Column({ default: false })
  isRead: boolean;

  @Column({ nullable: true })
  questionId: number;

  @Column({ nullable: true })
  answerId: number;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => User, { onDelete: "CASCADE" })
  @JoinColumn({ name: "userId" })
  user: User;
}
```

---

## 5. AUTH MODÜLÜ (GİRİŞ/KAYIT)

### 📌 auth.module.ts

```typescript
@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    PassportModule.register({ defaultStrategy: "jwt" }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get("JWT_SECRET"),
        signOptions: { expiresIn: "7d" },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [JwtStrategy, PassportModule],
})
export class AuthModule {}
```

**Modül İçeriği:**

- `TypeOrmModule.forFeature([User])`: User repository'sini kullan
- `PassportModule`: Auth stratejileri için
- `JwtModule`: JWT token oluşturma/doğrulama
- `expiresIn: '7d'`: Token 7 gün geçerli

---

### 📌 auth.service.ts - KAYIT İŞLEMİ

```typescript
async register(dto: RegisterDto): Promise<AuthResponse> {
  const existingUser = await this.userRepository.findOne({
    where: { email: dto.email },
  });

  if (existingUser) {
    throw new ConflictException('Bu email adresi zaten kayıtlı');
  }

  const passwordHash = await bcrypt.hash(dto.password, 10);

  const user = this.userRepository.create({
    name: dto.name,
    email: dto.email,
    passwordHash,
  });

  await this.userRepository.save(user);

  const payload = { sub: user.id, email: user.email };
  const accessToken = this.jwtService.sign(payload);

  const { passwordHash: _, ...userWithoutPassword } = user;
  return {
    user: userWithoutPassword as any,
    accessToken,
  };
}
```

### Adım Adım Açıklama:

1. **Email Kontrolü:**

```typescript
const existingUser = await this.userRepository.findOne({
  where: { email: dto.email },
});
if (existingUser) {
  throw new ConflictException("Bu email adresi zaten kayıtlı");
}
```

- Aynı email ile kayıt varsa hata fırlat

2. **Şifre Hashleme:**

```typescript
const passwordHash = await bcrypt.hash(dto.password, 10);
```

- `bcrypt.hash(şifre, saltRounds)`
- 10 = salt rounds (güvenlik seviyesi)
- Örnek: "123456" → "$2b$10$X7..."

3. **Kullanıcı Oluştur:**

```typescript
const user = this.userRepository.create({ ... });
await this.userRepository.save(user);
```

- `create()`: Entity objesi oluşturur (DB'ye kaydetmez)
- `save()`: DB'ye kaydeder

4. **JWT Token Oluştur:**

```typescript
const payload = { sub: user.id, email: user.email };
const accessToken = this.jwtService.sign(payload);
```

- `payload`: Token içinde saklanacak bilgiler
- `sub`: Subject (kullanıcı ID)
- `sign()`: Token'ı imzalar ve döner

5. **Şifreyi Çıkar:**

```typescript
const { passwordHash: _, ...userWithoutPassword } = user;
```

- Destructuring ile passwordHash'i çıkar
- Kullanıcıya şifre hash'ini göndermiyoruz

---

### 📌 auth.service.ts - GİRİŞ İŞLEMİ

```typescript
async login(dto: LoginDto): Promise<AuthResponse> {
  const user = await this.userRepository.findOne({
    where: { email: dto.email },
    select: ['id', 'name', 'email', 'passwordHash', 'avatarUrl', 'bio', 'role', 'isBanned', 'createdAt'],
  });

  if (!user) {
    throw new UnauthorizedException('Geçersiz email veya şifre');
  }

  if (user.isBanned) {
    throw new ForbiddenException('Hesabınız engellenmiş');
  }

  const isPasswordValid = await bcrypt.compare(dto.password, user.passwordHash);

  if (!isPasswordValid) {
    throw new UnauthorizedException('Geçersiz email veya şifre');
  }

  const payload = { sub: user.id, email: user.email };
  const accessToken = this.jwtService.sign(payload);

  const { passwordHash: _, ...userWithoutPassword } = user;
  return {
    user: userWithoutPassword as any,
    accessToken,
  };
}
```

### Önemli Noktalar:

1. **Şifre ile Birlikte Getir:**

```typescript
select: ['id', 'name', 'email', 'passwordHash', ...]
```

- `passwordHash` normalde gelmez (`select: false`)
- Login için özellikle istememiz gerekiyor

2. **Ban Kontrolü:**

```typescript
if (user.isBanned) {
  throw new ForbiddenException("Hesabınız engellenmiş");
}
```

3. **Şifre Karşılaştır:**

```typescript
const isPasswordValid = await bcrypt.compare(dto.password, user.passwordHash);
```

- `bcrypt.compare()`: Plain text şifreyi hash ile karşılaştırır
- Hash'ten şifreyi geri almak imkansız!

---

### 📌 jwt.strategy.ts - TOKEN DOĞRULAMA

```typescript
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    configService: ConfigService,
    @InjectRepository(User)
    private userRepository: Repository<User>
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get("JWT_SECRET"),
    });
  }

  async validate(payload: { sub: number; email: string }): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id: payload.sub },
    });

    if (!user) {
      throw new UnauthorizedException("Kullanıcı bulunamadı");
    }

    return user;
  }
}
```

### JWT Akışı:

```
1. Login → Token döner: "eyJhbGciOiJIUzI..."

2. Frontend token'ı localStorage'a kaydeder

3. Her API isteğinde:
   Headers: { Authorization: "Bearer eyJhbGciOiJIUzI..." }

4. JwtStrategy token'ı doğrular:
   - jwtFromRequest: Header'dan token'ı al
   - secretOrKey: Gizli anahtar ile doğrula
   - validate(): Token geçerliyse user'ı döndür

5. User, request.user olarak eklenir
```

### Token Yapısı:

```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.  ← Header (algoritma)
eyJzdWIiOjEsImVtYWlsIjoiYWxpQG1haWwuY29tIn0.  ← Payload (veri)
SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c  ← Signature (imza)
```

---

### 📌 auth.controller.ts

```typescript
@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post("register")
  async register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Post("login")
  async login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }
}
```

**Endpoint'ler:**

- `POST /auth/register` → Kayıt ol
- `POST /auth/login` → Giriş yap

---

## 6. GUARDS VE DECORATORS (YETKİLENDİRME)

### 📌 roles.decorator.ts

```typescript
export const ROLES_KEY = "roles";
export const Roles = (...roles: UserRole[]) => SetMetadata(ROLES_KEY, roles);
```

**Kullanımı:**

```typescript
@Roles(UserRole.ADMIN)  // Sadece admin
@Roles(UserRole.USER, UserRole.ADMIN)  // User veya admin
```

---

### 📌 current-user.decorator.ts

```typescript
export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  }
);
```

**Kullanımı:**

```typescript
@Post()
create(@CurrentUser() user: User, @Body() dto: CreateDto) {
  // user = JWT'den gelen kullanıcı bilgisi
}
```

---

### 📌 roles.guard.ts

```typescript
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()]
    );

    if (!requiredRoles) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();

    if (user.isBanned) {
      throw new ForbiddenException("Hesabınız engellenmiş durumda");
    }

    return requiredRoles.some((role) => user.role === role);
  }
}
```

### Nasıl Çalışır:

1. `@Roles(UserRole.ADMIN)` decorator'dan gerekli rolleri al
2. Rol belirtilmemişse herkese izin ver
3. Kullanıcı banlıysa engelle
4. Kullanıcının rolü gerekli rollerden biri mi kontrol et

### Kullanım Örneği:

```typescript
@Post()
@UseGuards(AuthGuard('jwt'), RolesGuard)  // Önce JWT, sonra rol kontrolü
@Roles(UserRole.ADMIN)                      // Sadece admin
createTag(@Body() dto: CreateTagDto) {
  return this.tagsService.create(dto);
}
```

---

## 🎯 PUANLAMA KARŞILIĞI (BÖLÜM 1)

| Kriter              | Puan | Bu Dosyada Nerede                            |
| ------------------- | ---- | -------------------------------------------- |
| **Giriş/Kayıt**     | 10P  | auth.service.ts → register(), login()        |
| **Yetkilendirme**   | 10P  | jwt.strategy.ts, roles.guard.ts              |
| **4 Entity**        | 15P  | User, Question, Answer, Tag, Vote, Report... |
| **1'e Çok İlişki**  | 15P  | User→Questions, Question→Answers             |
| **Çoka Çok İlişki** | 15P  | Question↔Tags (@JoinTable)                   |

---

**📝 BÖLÜM 2'DE:** Service'ler, Controller'lar, Frontend kodları ve Tailwind tasarım detayları!
