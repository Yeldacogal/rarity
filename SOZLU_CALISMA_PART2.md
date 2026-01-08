# 🎓 RARITY - SÖZLÜ SINAV ÇALIŞMA NOTLARI (BÖLÜM 2)

# SERVICE VE CONTROLLER KODLARI

---

## 📚 İÇİNDEKİLER

1. [Questions Service ve Controller](#1-questions-service-ve-controller)
2. [Answers Service ve Controller](#2-answers-service-ve-controller)
3. [Votes Service](#3-votes-service)
4. [Bookmarks Service](#4-bookmarks-service)
5. [Reports Service](#5-reports-service)
6. [Notifications Service](#6-notifications-service)
7. [Admin Service](#7-admin-service)
8. [Tags ve Categories Service](#8-tags-ve-categories-service)

---

## 1. QUESTIONS SERVICE VE CONTROLLER

### 📌 questions.service.ts - findAll() (Soru Listeleme)

```typescript
async findAll(query: QuestionQueryDto): Promise<PaginatedResult<Question>> {
  const { search, tags, sortBy = 'newest', page = 1, limit = 10 } = query;

  const queryBuilder = this.questionRepository
    .createQueryBuilder('question')
    .leftJoinAndSelect('question.author', 'author')
    .leftJoinAndSelect('question.tags', 'tags');

  if (search) {
    queryBuilder.andWhere(
      '(question.title ILIKE :search OR question.content ILIKE :search)',
      { search: `%${search}%` },
    );
  }

  if (tags) {
    const tagIds = tags.split(',').map((id) => parseInt(id, 10));
    queryBuilder
      .innerJoin('question.tags', 'filterTags')
      .andWhere('filterTags.id IN (:...tagIds)', { tagIds });
  }

  switch (sortBy) {
    case 'oldest':
      queryBuilder.orderBy('question.createdAt', 'ASC');
      break;
    case 'mostAnswers':
      queryBuilder
        .loadRelationCountAndMap('question.answerCount', 'question.answers')
        .orderBy('question.answerCount', 'DESC');
      break;
    case 'newest':
    default:
      queryBuilder.orderBy('question.createdAt', 'DESC');
  }

  const total = await queryBuilder.getCount();
  const questions = await queryBuilder
    .skip((page - 1) * limit)
    .take(limit)
    .getMany();

  return {
    data: questions,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
}
```

### QueryBuilder Metodları Açıklaması:

| Metod                                                  | Ne Yapar          | SQL Karşılığı                      |
| ------------------------------------------------------ | ----------------- | ---------------------------------- |
| `createQueryBuilder('question')`                       | Sorgu başlat      | `SELECT * FROM questions question` |
| `leftJoinAndSelect('question.author', 'author')`       | Author'u da getir | `LEFT JOIN users author ON ...`    |
| `andWhere('title ILIKE :search', { search: '%xxx%' })` | Koşul ekle        | `WHERE title ILIKE '%xxx%'`        |
| `innerJoin()`                                          | İç birleştirme    | `INNER JOIN`                       |
| `orderBy('createdAt', 'DESC')`                         | Sırala            | `ORDER BY createdAt DESC`          |
| `skip((page-1) * limit)`                               | Atla              | `OFFSET ...`                       |
| `take(limit)`                                          | Al                | `LIMIT ...`                        |
| `getCount()`                                           | Toplam sayı       | `SELECT COUNT(*)`                  |
| `getMany()`                                            | Sonuçları al      | Tüm satırlar                       |

### ILIKE vs LIKE:

- `LIKE`: Case-sensitive ("Test" ≠ "test")
- `ILIKE`: Case-insensitive ("Test" = "test") - PostgreSQL özel

---

### 📌 questions.service.ts - findOne() (Tek Soru Getir)

```typescript
async findOne(id: number): Promise<Question> {
  const question = await this.questionRepository.findOne({
    where: { id },
    relations: ['author', 'tags', 'answers', 'answers.author', 'answers.votes', 'answers.replies', 'answers.replies.author'],
  });

  if (!question) {
    throw new NotFoundException('Soru bulunamadı');
  }

  question.answers = question.answers
    .filter((answer) => !answer.parentId)
    .sort((a, b) => b.votes.length - a.votes.length);

  return question;
}
```

### Relations Ne Demek?

```typescript
relations: [
  "author", // Soru yazarı
  "tags", // Etiketler
  "answers", // Cevaplar
  "answers.author", // Cevap yazarları
  "answers.votes", // Cevap oyları
  "answers.replies", // Cevaplara yanıtlar
  "answers.replies.author", // Yanıt yazarları
];
```

- İç içe ilişkileri tek sorguda getir
- N+1 problem'i önler

### Cevap Filtreleme:

```typescript
question.answers = question.answers
  .filter((answer) => !answer.parentId) // Sadece ana cevaplar (yanıt olmayanlar)
  .sort((a, b) => b.votes.length - a.votes.length); // Oy sayısına göre sırala
```

---

### 📌 questions.service.ts - create() (Soru Oluştur)

```typescript
async create(dto: CreateQuestionDto, authorId: number): Promise<Question> {
  const { tagIds, ...questionData } = dto;

  const question = this.questionRepository.create({
    ...questionData,
    authorId,
  });

  if (tagIds && tagIds.length > 0) {
    const tags = await this.tagRepository.findBy({ id: In(tagIds) });
    question.tags = tags;
  }

  return this.questionRepository.save(question);
}
```

### In() Operatörü:

```typescript
const tags = await this.tagRepository.findBy({ id: In(tagIds) });
// tagIds = [1, 3, 5]
// SQL: SELECT * FROM tags WHERE id IN (1, 3, 5)
```

### ManyToMany İlişki Kaydetme:

```typescript
question.tags = tags; // Tag array'ini ata
await this.questionRepository.save(question); // TypeORM ara tabloya yazar
```

---

### 📌 questions.service.ts - update() ve remove()

```typescript
async update(id: number, dto: UpdateQuestionDto, userId: number): Promise<Question> {
  const question = await this.findOne(id);

  if (question.authorId !== userId) {
    throw new ForbiddenException('Bu soruyu düzenleme yetkiniz yok');
  }

  const { tagIds, ...updateData } = dto;

  Object.assign(question, updateData);

  if (tagIds !== undefined) {
    if (tagIds.length > 0) {
      const tags = await this.tagRepository.findBy({ id: In(tagIds) });
      question.tags = tags;
    } else {
      question.tags = [];
    }
  }

  return this.questionRepository.save(question);
}

async remove(id: number, userId: number, userRole: UserRole): Promise<void> {
  const question = await this.findOne(id);

  const isOwner = question.authorId === userId;
  const isAdmin = userRole === UserRole.ADMIN;

  if (!isOwner && !isAdmin) {
    throw new ForbiddenException('Bu soruyu silme yetkiniz yok');
  }

  await this.questionRepository.remove(question);
}
```

### Object.assign():

```typescript
Object.assign(question, updateData);
// question.title = updateData.title (varsa)
// question.content = updateData.content (varsa)
// Sadece gönderilen alanları günceller
```

---

### 📌 questions.controller.ts

```typescript
@Controller("questions")
export class QuestionsController {
  constructor(private questionsService: QuestionsService) {}

  @Get()
  findAll(@Query() query: QuestionQueryDto) {
    return this.questionsService.findAll(query);
  }

  @Get(":id")
  findOne(@Param("id", ParseIntPipe) id: number) {
    return this.questionsService.findOne(id);
  }

  @Post()
  @UseGuards(AuthGuard("jwt"))
  create(@Body() dto: CreateQuestionDto, @CurrentUser() user: User) {
    return this.questionsService.create(dto, user.id);
  }

  @Patch(":id")
  @UseGuards(AuthGuard("jwt"))
  update(
    @Param("id", ParseIntPipe) id: number,
    @Body() dto: UpdateQuestionDto,
    @CurrentUser() user: User
  ) {
    return this.questionsService.update(id, dto, user.id);
  }

  @Delete(":id")
  @UseGuards(AuthGuard("jwt"))
  remove(@Param("id", ParseIntPipe) id: number, @CurrentUser() user: User) {
    return this.questionsService.remove(id, user.id, user.role);
  }
}
```

### Decorator'ların Görevi:

| Decorator                      | Ne Yapar                       |
| ------------------------------ | ------------------------------ |
| `@Controller('questions')`     | Base URL: /questions           |
| `@Get()`                       | GET /questions                 |
| `@Get(':id')`                  | GET /questions/5               |
| `@Post()`                      | POST /questions                |
| `@Patch(':id')`                | PATCH /questions/5             |
| `@Delete(':id')`               | DELETE /questions/5            |
| `@UseGuards(AuthGuard('jwt'))` | JWT token zorunlu              |
| `@Query()`                     | URL query string (?search=xxx) |
| `@Param('id')`                 | URL parametresi (:id)          |
| `@Body()`                      | Request body                   |
| `@CurrentUser()`               | JWT'den user                   |

### ParseIntPipe:

```typescript
@Param('id', ParseIntPipe) id: number
// "/questions/abc" → HATA (string number'a dönüşmez)
// "/questions/5" → id = 5 (number)
```

---

## 2. ANSWERS SERVICE VE CONTROLLER

### 📌 answers.service.ts - create()

```typescript
async create(questionId: number, dto: CreateAnswerDto, authorId: number): Promise<Answer> {
  const question = await this.questionRepository.findOne({
    where: { id: questionId },
    relations: ['author'],
  });

  if (!question) {
    throw new NotFoundException('Soru bulunamadı');
  }

  const answer = this.answerRepository.create({
    content: dto.content,
    imageUrl: dto.imageUrl,
    authorId,
    questionId,
    parentId: dto.parentId,
  });

  const savedAnswer = await this.answerRepository.save(answer);

  const answerWithAuthor = await this.answerRepository.findOne({
    where: { id: savedAnswer.id },
    relations: ['author'],
  });

  if (dto.parentId) {
    const parentAnswer = await this.answerRepository.findOne({
      where: { id: dto.parentId },
      relations: ['author'],
    });
    if (parentAnswer && parentAnswer.authorId !== authorId) {
      await this.notificationsService.notifyNewReply(
        parentAnswer,
        answerWithAuthor,
      );
    }
  } else {
    if (question.authorId !== authorId) {
      await this.notificationsService.notifyNewAnswer(question, answerWithAuthor);
    }
  }

  return answerWithAuthor;
}
```

### Bildirim Mantığı:

1. **Yanıt mı?** (`parentId` var mı?)
   - Evet → Üst cevabın yazarına bildirim
2. **Ana cevap mı?** (`parentId` yok)
   - Evet → Soru yazarına bildirim
3. **Kendi kendine bildirim yok!**
   - `parentAnswer.authorId !== authorId`
   - `question.authorId !== authorId`

---

### 📌 answers.service.ts - update() ve remove()

```typescript
async update(id: number, dto: UpdateAnswerDto, userId: number): Promise<Answer> {
  const answer = await this.answerRepository.findOne({
    where: { id },
    relations: ['author'],
  });

  if (!answer) {
    throw new NotFoundException('Cevap bulunamadı');
  }

  if (answer.authorId !== userId) {
    throw new ForbiddenException('Bu cevabı düzenleme yetkiniz yok');
  }

  Object.assign(answer, dto);
  return this.answerRepository.save(answer);
}

async remove(id: number, userId: number, userRole: UserRole): Promise<void> {
  const answer = await this.answerRepository.findOne({
    where: { id },
  });

  if (!answer) {
    throw new NotFoundException('Cevap bulunamadı');
  }

  const isOwner = answer.authorId === userId;
  const isAdmin = userRole === UserRole.ADMIN;

  if (!isOwner && !isAdmin) {
    throw new ForbiddenException('Bu cevabı silme yetkiniz yok');
  }

  await this.answerRepository.remove(answer);
}
```

---

## 3. VOTES SERVICE

### 📌 votes.service.ts - toggleVote() (Oy Ver/Kaldır)

```typescript
async toggleVote(answerId: number, userId: number): Promise<{ voted: boolean; voteCount: number }> {
  const answer = await this.answerRepository.findOne({
    where: { id: answerId },
    relations: ['author'],
  });

  if (!answer) {
    throw new NotFoundException('Cevap bulunamadı');
  }

  const existingVote = await this.voteRepository.findOne({
    where: { answerId, userId },
  });

  if (existingVote) {
    await this.voteRepository.remove(existingVote);
    const voteCount = await this.voteRepository.count({ where: { answerId } });
    return { voted: false, voteCount };
  }

  const vote = this.voteRepository.create({ answerId, userId });
  await this.voteRepository.save(vote);

  const user = await this.userRepository.findOne({ where: { id: userId } });
  if (answer.authorId !== userId) {
    await this.notificationsService.notifyVote(answer, user.name);
  }

  const voteCount = await this.voteRepository.count({ where: { answerId } });
  return { voted: true, voteCount };
}
```

### Toggle Pattern:

```
1. Oy var mı kontrol et
2. VARSA → Sil, voted: false döndür
3. YOKSA → Ekle, voted: true döndür

Aynı endpoint hem oy vermek hem kaldırmak için!
```

### Oy Sayısı:

```typescript
const voteCount = await this.voteRepository.count({ where: { answerId } });
// O cevaba kaç oy verilmiş?
```

---

### 📌 votes.service.ts - checkVote() ve getVoteCount()

```typescript
async checkVote(answerId: number, userId: number): Promise<boolean> {
  const vote = await this.voteRepository.findOne({
    where: { answerId, userId },
  });
  return !!vote;
}

async getVoteCount(answerId: number): Promise<number> {
  return this.voteRepository.count({ where: { answerId } });
}
```

### `!!vote` Ne Demek?

```typescript
!!vote;
// vote varsa → !!{id: 1} → true
// vote yoksa → !!null → false
// Object'i boolean'a çevirir
```

---

## 4. BOOKMARKS SERVICE

### 📌 bookmarks.service.ts - toggleQuestionBookmark()

```typescript
async toggleQuestionBookmark(questionId: number, userId: number): Promise<{ bookmarked: boolean }> {
  const question = await this.questionRepository.findOne({
    where: { id: questionId },
  });

  if (!question) {
    throw new NotFoundException('Soru bulunamadı');
  }

  const existingBookmark = await this.bookmarkRepository.findOne({
    where: { questionId, userId },
  });

  if (existingBookmark) {
    await this.bookmarkRepository.remove(existingBookmark);
    return { bookmarked: false };
  }

  const bookmark = this.bookmarkRepository.create({
    questionId,
    userId,
  });
  await this.bookmarkRepository.save(bookmark);
  return { bookmarked: true };
}
```

### Toggle Bookmark Pattern:

- Vote service ile aynı mantık
- Favori varsa → Kaldır
- Favori yoksa → Ekle

---

### 📌 bookmarks.service.ts - getUserBookmarks()

```typescript
async getUserBookmarks(userId: number) {
  const bookmarks = await this.bookmarkRepository.find({
    where: { userId },
    relations: ['question', 'question.author', 'question.tags', 'answer', 'answer.author', 'answer.question'],
    order: { createdAt: 'DESC' },
  });

  return bookmarks;
}
```

### Relations Açıklaması:

```typescript
relations: [
  "question", // Favori soru
  "question.author", // Sorunun yazarı
  "question.tags", // Sorunun etiketleri
  "answer", // Favori cevap
  "answer.author", // Cevabın yazarı
  "answer.question", // Cevabın ait olduğu soru
];
```

---

## 5. REPORTS SERVICE

### 📌 reports.service.ts - createAnswerReport()

```typescript
async createAnswerReport(answerId: number, dto: CreateReportDto, reporterId: number): Promise<Report> {
  const answer = await this.answerRepository.findOne({
    where: { id: answerId },
  });

  if (!answer) {
    throw new NotFoundException('Cevap bulunamadı');
  }

  const existingReport = await this.reportRepository.findOne({
    where: { answerId, reporterId },
  });

  if (existingReport) {
    throw new ConflictException('Bu cevabı zaten şikayet ettiniz');
  }

  const report = this.reportRepository.create({
    answerId,
    reporterId,
    reason: dto.reason,
    description: dto.description,
  });

  return this.reportRepository.save(report);
}
```

### Duplicate Report Kontrolü:

```typescript
const existingReport = await this.reportRepository.findOne({
  where: { answerId, reporterId },
});
if (existingReport) {
  throw new ConflictException("Bu cevabı zaten şikayet ettiniz");
}
```

- Aynı kullanıcı aynı cevabı 2 kez şikayet edemez

---

## 6. NOTIFICATIONS SERVICE

### 📌 notifications.service.ts - Bildirim Oluşturma

```typescript
async notifyNewAnswer(question: Question, answer: Answer): Promise<void> {
  await this.notificationRepository.save({
    userId: question.authorId,
    type: 'NEW_ANSWER',
    message: `${answer.author.name} sorunuza cevap verdi: "${question.title.substring(0, 50)}..."`,
    questionId: question.id,
    answerId: answer.id,
  });
}

async notifyNewReply(parentAnswer: Answer, reply: Answer): Promise<void> {
  await this.notificationRepository.save({
    userId: parentAnswer.authorId,
    type: 'NEW_REPLY',
    message: `${reply.author.name} cevabınıza yanıt verdi`,
    questionId: reply.questionId,
    answerId: reply.id,
  });
}

async notifyVote(answer: Answer, voterName: string): Promise<void> {
  await this.notificationRepository.save({
    userId: answer.authorId,
    type: 'NEW_VOTE',
    message: `${voterName} cevabınızı beğendi`,
    questionId: answer.questionId,
    answerId: answer.id,
  });
}
```

### Bildirim Türleri:

| Tür          | Ne Zaman             | Kime           |
| ------------ | -------------------- | -------------- |
| `NEW_ANSWER` | Soruya cevap gelince | Soru yazarına  |
| `NEW_REPLY`  | Cevaba yanıt gelince | Cevap yazarına |
| `NEW_VOTE`   | Cevap beğenilince    | Cevap yazarına |

---

### 📌 notifications.service.ts - getUserNotifications() ve markAsRead()

```typescript
async getUserNotifications(userId: number): Promise<Notification[]> {
  return this.notificationRepository.find({
    where: { userId },
    order: { createdAt: 'DESC' },
  });
}

async getUnreadCount(userId: number): Promise<number> {
  return this.notificationRepository.count({
    where: { userId, isRead: false },
  });
}

async markAsRead(id: number, userId: number): Promise<Notification> {
  const notification = await this.notificationRepository.findOne({
    where: { id, userId },
  });

  if (!notification) {
    throw new NotFoundException('Bildirim bulunamadı');
  }

  notification.isRead = true;
  return this.notificationRepository.save(notification);
}

async markAllAsRead(userId: number): Promise<void> {
  await this.notificationRepository.update(
    { userId, isRead: false },
    { isRead: true },
  );
}
```

### update() vs save():

```typescript
// save(): Tek kayıt güncelle
notification.isRead = true;
await this.notificationRepository.save(notification);

// update(): Toplu güncelle
await this.notificationRepository.update(
  { userId, isRead: false }, // WHERE koşulu
  { isRead: true } // SET değerleri
);
```

---

## 7. ADMIN SERVICE

### 📌 admin.service.ts - getReports()

```typescript
async getReports(query: GetReportsQueryDto) {
  const { status, page = 1, limit = 20 } = query;

  const queryBuilder = this.reportRepository
    .createQueryBuilder('report')
    .leftJoinAndSelect('report.reporter', 'reporter')
    .leftJoinAndSelect('report.question', 'question')
    .leftJoinAndSelect('report.answer', 'answer')
    .leftJoinAndSelect('answer.author', 'answerAuthor')
    .leftJoinAndSelect('question.author', 'questionAuthor');

  if (status) {
    queryBuilder.where('report.status = :status', { status });
  }

  queryBuilder.orderBy('report.createdAt', 'DESC');

  const total = await queryBuilder.getCount();
  const reports = await queryBuilder
    .skip((page - 1) * limit)
    .take(limit)
    .getMany();

  return {
    data: reports,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
}
```

---

### 📌 admin.service.ts - resolveReport()

```typescript
async resolveReport(id: number, dto: ResolveReportDto): Promise<Report> {
  const report = await this.reportRepository.findOne({
    where: { id },
    relations: ['answer', 'question'],
  });

  if (!report) {
    throw new NotFoundException('Rapor bulunamadı');
  }

  report.status = dto.status;
  return this.reportRepository.save(report);
}
```

---

### 📌 admin.service.ts - banUser() ve deleteAnswer()

```typescript
async banUser(id: number): Promise<User> {
  const user = await this.userRepository.findOne({ where: { id } });

  if (!user) {
    throw new NotFoundException('Kullanıcı bulunamadı');
  }

  if (user.role === UserRole.ADMIN) {
    throw new ForbiddenException('Admin kullanıcılar engellenemez');
  }

  user.isBanned = !user.isBanned;
  return this.userRepository.save(user);
}

async deleteAnswer(id: number): Promise<void> {
  const answer = await this.answerRepository.findOne({ where: { id } });

  if (!answer) {
    throw new NotFoundException('Cevap bulunamadı');
  }

  await this.answerRepository.remove(answer);
}
```

### Admin Toggle Ban:

```typescript
user.isBanned = !user.isBanned;
// true ise false yap
// false ise true yap
```

---

### 📌 admin.service.ts - getStats() (Dashboard İstatistikleri)

```typescript
async getStats() {
  const userCount = await this.userRepository.count();
  const questionCount = await this.questionRepository.count();
  const answerCount = await this.answerRepository.count();
  const reportCount = await this.reportRepository.count({
    where: { status: ReportStatus.PENDING },
  });

  const recentQuestions = await this.questionRepository.find({
    order: { createdAt: 'DESC' },
    take: 5,
    relations: ['author'],
  });

  const recentReports = await this.reportRepository.find({
    where: { status: ReportStatus.PENDING },
    order: { createdAt: 'DESC' },
    take: 5,
    relations: ['reporter', 'question', 'answer'],
  });

  return {
    userCount,
    questionCount,
    answerCount,
    pendingReportCount: reportCount,
    recentQuestions,
    recentReports,
  };
}
```

---

## 8. TAGS VE CATEGORIES SERVICE

### 📌 tags.service.ts - CRUD İşlemleri

```typescript
async findAll() {
  return this.tagRepository.find({
    relations: ['subcategory', 'subcategory.category'],
    order: { name: 'ASC' },
  });
}

async create(dto: CreateTagDto): Promise<Tag> {
  const existingTag = await this.tagRepository.findOne({
    where: { slug: dto.slug },
  });

  if (existingTag) {
    throw new ConflictException('Bu slug zaten kullanılıyor');
  }

  const tag = this.tagRepository.create({
    name: dto.name,
    slug: dto.slug,
    subcategoryId: dto.subcategoryId,
  });

  return this.tagRepository.save(tag);
}

async update(id: number, dto: UpdateTagDto): Promise<Tag> {
  const tag = await this.tagRepository.findOne({ where: { id } });

  if (!tag) {
    throw new NotFoundException('Etiket bulunamadı');
  }

  if (dto.slug && dto.slug !== tag.slug) {
    const existingTag = await this.tagRepository.findOne({
      where: { slug: dto.slug },
    });
    if (existingTag) {
      throw new ConflictException('Bu slug zaten kullanılıyor');
    }
  }

  Object.assign(tag, dto);
  return this.tagRepository.save(tag);
}

async remove(id: number): Promise<void> {
  const result = await this.tagRepository.delete(id);

  if (result.affected === 0) {
    throw new NotFoundException('Etiket bulunamadı');
  }
}
```

### delete() vs remove():

```typescript
// delete(): ID ile sil, entity yüklemeden
const result = await this.tagRepository.delete(id);
if (result.affected === 0) {
  /* bulunamadı */
}

// remove(): Önce entity yükle, sonra sil
const tag = await this.tagRepository.findOne({ where: { id } });
await this.tagRepository.remove(tag);
```

---

### 📌 categories.service.ts

```typescript
async findAll() {
  return this.categoryRepository.find({
    relations: ['subcategories'],
    order: { name: 'ASC' },
  });
}

async findAllWithTags() {
  return this.categoryRepository.find({
    relations: ['subcategories', 'subcategories.tags'],
    order: { name: 'ASC' },
  });
}
```

### Nested Relations:

```typescript
relations: ["subcategories", "subcategories.tags"];
// Category
//   └── Subcategory[]
//         └── Tag[]
```

---

## 🎯 PUANLAMA KARŞILIĞI (BÖLÜM 2)

| Kriter               | Puan | Bu Dosyada Nerede                                |
| -------------------- | ---- | ------------------------------------------------ |
| **4 Entity**         | 15P  | Question, Answer, Vote, Tag, Report, Bookmark... |
| **1'e Çok İlişki**   | 15P  | findOne() → relations: ['answers', 'author']     |
| **Çoka Çok İlişki**  | 15P  | Question↔Tags → findAll() tags filter            |
| **Frontend-Backend** | 15P  | Controller'lar → API endpoint'leri               |

---

**📝 BÖLÜM 3'TE:** Frontend (React) kodları, Context, Component'ler ve Tailwind!
