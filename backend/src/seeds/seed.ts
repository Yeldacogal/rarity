import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from '../entities/user.entity';
import { Question } from '../entities/question.entity';
import { Answer } from '../entities/answer.entity';
import { Tag } from '../entities/tag.entity';
import { Vote } from '../entities/vote.entity';
import { Report } from '../entities/report.entity';
import { Category } from '../entities/category.entity';
import { Subcategory } from '../entities/subcategory.entity';
import { UserRole } from '../common/enums/user-role.enum';
import * as dotenv from 'dotenv';

dotenv.config();

const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASS || 'postgres',
  database: process.env.DB_NAME || 'rarity',
  entities: [User, Question, Answer, Tag, Vote, Report, Category, Subcategory],
  synchronize: true,
});

async function seed() {
  console.log('🌱 Starting database seed...');

  await AppDataSource.initialize();
  console.log('✅ Database connected');

  const userRepo = AppDataSource.getRepository(User);
  const tagRepo = AppDataSource.getRepository(Tag);
  const questionRepo = AppDataSource.getRepository(Question);
  const answerRepo = AppDataSource.getRepository(Answer);
  const categoryRepo = AppDataSource.getRepository(Category);
  const subcategoryRepo = AppDataSource.getRepository(Subcategory);

  await AppDataSource.query('TRUNCATE TABLE "reports" CASCADE');
  await AppDataSource.query('TRUNCATE TABLE "votes" CASCADE');
  await AppDataSource.query('TRUNCATE TABLE "answers" CASCADE');
  await AppDataSource.query('TRUNCATE TABLE "question_tags" CASCADE');
  await AppDataSource.query('TRUNCATE TABLE "questions" CASCADE');
  await AppDataSource.query('TRUNCATE TABLE "tags" CASCADE');
  await AppDataSource.query('TRUNCATE TABLE "subcategories" CASCADE');
  await AppDataSource.query('TRUNCATE TABLE "categories" CASCADE');
  await AppDataSource.query('TRUNCATE TABLE "users" CASCADE');
  console.log('🗑️  Cleared existing data');

  const adminPassword = await bcrypt.hash('admin123', 10);
  const userPassword = await bcrypt.hash('user123', 10);

  const admin = await userRepo.save({
    name: 'Admin',
    email: 'admin@rarity.com',
    passwordHash: adminPassword,
    role: UserRole.ADMIN,
  });

  const user1 = await userRepo.save({
    name: 'Ayşe Yılmaz',
    email: 'ayse@example.com',
    passwordHash: userPassword,
    role: UserRole.USER,
  });

  const user2 = await userRepo.save({
    name: 'Fatma Kaya',
    email: 'fatma@example.com',
    passwordHash: userPassword,
    role: UserRole.USER,
  });

  const user3 = await userRepo.save({
    name: 'Zeynep Demir',
    email: 'zeynep@example.com',
    passwordHash: userPassword,
    role: UserRole.USER,
  });

  const user4 = await userRepo.save({
    name: 'Elif Öztürk',
    email: 'elif@example.com',
    passwordHash: userPassword,
    role: UserRole.USER,
  });

  const user5 = await userRepo.save({
    name: 'Merve Aydın',
    email: 'merve@example.com',
    passwordHash: userPassword,
    role: UserRole.USER,
  });

  console.log('👤 Created 6 users');

  const categoryMakyaj = await categoryRepo.save({
    name: 'Makyaj',
    slug: 'makyaj',
    description: 'Makyaj ürünleri ve teknikleri hakkında sorular',
    icon: '💄',
    order: 0,
  });

  const categoryBakim = await categoryRepo.save({
    name: 'Bakım',
    slug: 'bakim',
    description: 'Cilt, saç ve vücut bakımı hakkında sorular',
    icon: '🧴',
    order: 1,
  });

  const categorySacBakim = await categoryRepo.save({
    name: 'Saç Bakımı',
    slug: 'sac-bakimi',
    description: 'Saç bakımı ve şekillendirme hakkında sorular',
    icon: '💇',
    order: 2,
  });

  const categoryParfum = await categoryRepo.save({
    name: 'Parfüm',
    slug: 'parfum',
    description: 'Parfüm ve kokular hakkında sorular',
    icon: '🌸',
    order: 3,
  });

  console.log('📁 Created 4 categories');

  const subYuzMakyaji = await subcategoryRepo.save({
    name: 'Yüz Makyajı',
    category: 'makyaj',
    categoryId: categoryMakyaj.id,
  });

  const subGozMakyaji = await subcategoryRepo.save({
    name: 'Göz Makyajı',
    category: 'makyaj',
    categoryId: categoryMakyaj.id,
  });

  const subDudakMakyaji = await subcategoryRepo.save({
    name: 'Dudak Makyajı',
    category: 'makyaj',
    categoryId: categoryMakyaj.id,
  });

  const subCiltBakimi = await subcategoryRepo.save({
    name: 'Cilt Bakımı',
    category: 'bakim',
    categoryId: categoryBakim.id,
  });

  const subVucutBakimi = await subcategoryRepo.save({
    name: 'Vücut Bakımı',
    category: 'bakim',
    categoryId: categoryBakim.id,
  });

  const subGunesKoruma = await subcategoryRepo.save({
    name: 'Güneş Koruma',
    category: 'bakim',
    categoryId: categoryBakim.id,
  });

  const subSacBakimi = await subcategoryRepo.save({
    name: 'Saç Bakımı',
    category: 'sac-bakimi',
    categoryId: categorySacBakim.id,
  });

  const subSacSekil = await subcategoryRepo.save({
    name: 'Saç Şekillendirme',
    category: 'sac-bakimi',
    categoryId: categorySacBakim.id,
  });

  console.log('📂 Created 8 subcategories');

  const tagCiltBakimi = await tagRepo.save({ name: 'Cilt Bakımı', category: 'bakim', subcategoryId: subCiltBakimi.id });
  const tagMakyaj = await tagRepo.save({ name: 'Makyaj', category: 'makyaj', subcategoryId: subYuzMakyaji.id });
  const tagGunesKoruyucu = await tagRepo.save({ name: 'Güneş Koruyucu', category: 'bakim', subcategoryId: subGunesKoruma.id });
  const tagNemlendirici = await tagRepo.save({ name: 'Nemlendirici', category: 'bakim', subcategoryId: subCiltBakimi.id });
  const tagSerum = await tagRepo.save({ name: 'Serum', category: 'bakim', subcategoryId: subCiltBakimi.id });
  const tagTemizleyici = await tagRepo.save({ name: 'Temizleyici', category: 'bakim', subcategoryId: subCiltBakimi.id });
  const tagGozMakyaji = await tagRepo.save({ name: 'Göz Makyajı', category: 'makyaj', subcategoryId: subGozMakyaji.id });
  const tagDudakBakimi = await tagRepo.save({ name: 'Dudak Bakımı', category: 'makyaj', subcategoryId: subDudakMakyaji.id });
  const tagAntiAging = await tagRepo.save({ name: 'Anti-Aging', category: 'bakim', subcategoryId: subCiltBakimi.id });
  const tagAkne = await tagRepo.save({ name: 'Akne', category: 'bakim', subcategoryId: subCiltBakimi.id });
  const tagSacBakimi = await tagRepo.save({ name: 'Saç Bakımı', category: 'sac-bakimi', subcategoryId: subSacBakimi.id });
  const tagTirnakBakimi = await tagRepo.save({ name: 'Tırnak Bakımı', category: 'bakim', subcategoryId: subVucutBakimi.id });
  const tagParfum = await tagRepo.save({ name: 'Parfüm', category: 'parfum' });
  const tagVucutBakimi = await tagRepo.save({ name: 'Vücut Bakımı', category: 'bakim', subcategoryId: subVucutBakimi.id });
  const tagDoğalUrunler = await tagRepo.save({ name: 'Doğal Ürünler', category: 'bakim' });

  console.log('🏷️  Created 15 tags');

  const q1 = await questionRepo.save({
    title: 'Kuru cilt için en iyi nemlendirici hangisi?',
    content: 'Kışın cildim çok kuruyor ve pullanmalar oluyor. Yoğun nemlendirme sağlayan ama gözenekleri tıkamayan bir ürün arıyorum. Özellikle gece kullanımı için önerileriniz nelerdir? Bütçe olarak orta segment düşünüyorum.',
    authorId: user1.id,
    tags: [tagCiltBakimi, tagNemlendirici],
  });

  const q2 = await questionRepo.save({
    title: 'Günlük makyaj rutini için öneriler',
    content: 'İşe giderken hızlı ama şık görünmek istiyorum. Sabahları vaktim çok kısıtlı. 10 dakikada yapılabilecek, doğal ama bakımlı gösteren günlük makyaj önerileri alabilir miyim? Hangi ürünler mutlaka olmalı?',
    authorId: user2.id,
    tags: [tagMakyaj, tagGozMakyaji],
  });

  const q3 = await questionRepo.save({
    title: 'Vitamin C serum ne zaman kullanılmalı?',
    content: 'Vitamin C serum aldım ama sabah mı yoksa akşam mı kullanmam gerektiğini bilmiyorum. Güneş koruyucu ile birlikte kullanabilir miyim? Retinol ile aynı anda kullanmak sakıncalı mı?',
    authorId: user3.id,
    tags: [tagCiltBakimi, tagSerum, tagGunesKoruyucu],
  });

  const q4 = await questionRepo.save({
    title: 'Akne izleri için hangi ürünler etkili?',
    content: 'Geçmişte ciddi akne problemi yaşadım ve maalesef izleri kaldı. Hem kırmızı izler hem de çukurlar var. Bu izleri azaltmak için hangi aktif maddeleri ve ürünleri kullanmalıyım? Profesyonel tedavi şart mı?',
    authorId: user1.id,
    tags: [tagCiltBakimi, tagAkne, tagSerum],
  });

  const q5 = await questionRepo.save({
    title: 'SPF 50 güneş kremi önerileri',
    content: 'Yazın denize gideceğim ve yüksek koruma faktörlü güneş kremi arıyorum. Yağlı cildim var, bu yüzden mat bitişli ve suya dayanıklı bir ürün olması önemli. Hangi markaları önerirsiniz?',
    authorId: user4.id,
    tags: [tagGunesKoruyucu, tagCiltBakimi],
  });

  const q6 = await questionRepo.save({
    title: 'Göz altı morlukları için çözüm',
    content: 'Kronik uyku problemim yok ama sürekli göz altı morluklarım var. Genetik olabilir mi? Kapatıcı dışında kalıcı çözüm var mı? Hangi göz kremleri etkili olur?',
    authorId: user5.id,
    tags: [tagCiltBakimi, tagAntiAging, tagGozMakyaji],
  });

  const q7 = await questionRepo.save({
    title: 'Doğal içerikli şampuan önerileri',
    content: 'Saçlarım çok yıpranmış ve kuru. Sülfatsız, parabensiz doğal içerikli şampuan arıyorum. Organik sertifikalı olursa daha iyi. Türkiye\'de bulunabilecek markaları önerir misiniz?',
    authorId: user2.id,
    tags: [tagSacBakimi, tagDoğalUrunler],
  });

  const q8 = await questionRepo.save({
    title: 'Kalıcı ruj önerileri - kurumayan formül',
    content: 'Kalıcı ruj kullanmak istiyorum ama çoğu dudaklarımı çok kurutuyor. Hem dayanıklı hem de nemlendirici özelliği olan ruj markaları var mı? Transfer yapmayan ama kurutmayan formül arıyorum.',
    authorId: user3.id,
    tags: [tagMakyaj, tagDudakBakimi],
  });

  const q9 = await questionRepo.save({
    title: 'Retinol kullanımına nasıl başlamalıyım?',
    content: '30 yaşına girdim ve anti-aging rutinine başlamak istiyorum. Retinol\'ün etkili olduğunu duydum ama tahrişten korkuyorum. Düşük konsantrasyonla mı başlamalıyım? Hangi sıklıkta kullanmalıyım?',
    authorId: user4.id,
    tags: [tagCiltBakimi, tagAntiAging, tagSerum],
  });

  const q10 = await questionRepo.save({
    title: 'Tırnak kırılması nasıl önlenir?',
    content: 'Tırnaklarım çok kolay kırılıyor ve uzamıyor. Biotin takviyesi alıyorum ama pek fayda görmüyorum. Tırnak güçlendirici ürün önerileri veya evde yapılabilecek bakım tarifleri var mı?',
    authorId: user5.id,
    tags: [tagTirnakBakimi, tagDoğalUrunler],
  });

  const q11 = await questionRepo.save({
    title: 'Yaz için hafif parfüm önerileri',
    content: 'Yazın kullanabileceğim taze, hafif ve kalıcı parfümler arıyorum. Narenciye veya çiçeksi notalar olabilir. Ofis ortamı için uygun, bunaltıcı olmayan öneriler alabilir miyim?',
    authorId: user1.id,
    tags: [tagParfum],
  });

  const q12 = await questionRepo.save({
    title: 'Vücut peelingi ne sıklıkla yapılmalı?',
    content: 'Vücut peeling ürünleri kullanmak istiyorum ama ne sıklıkla yapılması gerektiğini bilmiyorum. Tüy dönmesi problemim var, peeling yardımcı olur mu? Kahve peelingi mi yoksa şeker peelingi mi daha iyi?',
    authorId: user2.id,
    tags: [tagVucutBakimi, tagDoğalUrunler],
  });

  const q13 = await questionRepo.save({
    title: 'Yağlı cilt için fondöten önerileri',
    content: 'Yağlı cildim var ve fondötenler 2-3 saat sonra akmaya başlıyor. Mat bitişli, uzun süre kalıcı fondöten arıyorum. Primer kullanmak şart mı? Bütçe dostu öneriler de olursa sevinirim.',
    authorId: user3.id,
    tags: [tagMakyaj, tagCiltBakimi],
  });

  const q14 = await questionRepo.save({
    title: 'Hassas cilt için temizleyici önerileri',
    content: 'Cildim çok hassas ve çoğu temizleyici kızarıklık yapıyor. Parfümsüz, alkol içermeyen, pH dengeli temizleyici arıyorum. Köpüren mi yoksa jel formül mü tercih etmeliyim?',
    authorId: user4.id,
    tags: [tagCiltBakimi, tagTemizleyici],
  });

  const q15 = await questionRepo.save({
    title: 'Kaş laminasyonu yaptırmak istiyorum',
    content: 'Kaş laminasyonu çok popüler oldu. Yaptıranlar memnun mu? Ne kadar kalıcı oluyor? Kaşlara zarar veriyor mu? Fiyatları nasıl? İstanbul\'da güvenilir yer önerileri de alabilir miyim?',
    authorId: user5.id,
    tags: [tagMakyaj, tagGozMakyaji],
  });

  console.log('❓ Created 15 questions');

  await answerRepo.save([
    {
      content: 'CeraVe Moisturizing Cream harika bir seçenek! Hyaluronik asit ve seramid içeriyor. Gece yatmadan önce kalın bir tabaka sürersen sabaha kadar cildin ipek gibi oluyor.',
      authorId: user2.id,
      questionId: q1.id,
    },
    {
      content: 'La Roche-Posay Toleriane Ultra deneyebilirsin. Hassas ciltler için de uygun ve parfümsüz. Ben 2 yıldır kullanıyorum, kışın bile cildim kurumadı.',
      authorId: user3.id,
      questionId: q1.id,
    },
    {
      content: 'Bütçe dostu seçenek istersen Neutrogena Hydro Boost çok iyi. Jel formülü var ama çok iyi nemlendiriyor. Üzerine yağ bazlı bir ürün sürmeni öneririm gece.',
      authorId: admin.id,
      questionId: q1.id,
    },

    {
      content: 'BB krem + maskara + dudak nemlendiricisi üçlüsü benim günlük favori kombinasyonum. 5 dakikada halloluyor ve çok doğal görünüyor.',
      authorId: user1.id,
      questionId: q2.id,
    },
    {
      content: 'Kaş jeli kullanmayı unutma! Düzgün kaşlar yüzü çok toparlıyor. Bir de kirpik kıvırıcı + maskara kombinasyonu gözleri açıyor.',
      authorId: user4.id,
      questionId: q2.id,
    },

    {
      content: 'Vitamin C serumu kesinlikle sabah kullan! Antioksidan özelliği sayesinde gün içinde çevresel faktörlere karşı koruma sağlıyor. Güneş koruyucuyla birlikte kullanmak şart.',
      authorId: admin.id,
      questionId: q3.id,
    },
    {
      content: 'Retinol ile aynı anda kullanma, birbirlerini etkisiz hale getirebilirler. Sabah C vitamini, akşam retinol rutini en ideali.',
      authorId: user5.id,
      questionId: q3.id,
    },

    {
      content: 'Niacinamide ve AHA/BHA içeren ürünler akne izleri için çok etkili. The Ordinary\'nin %10 Niacinamide serumu hem uygun fiyatlı hem etkili.',
      authorId: user2.id,
      questionId: q4.id,
    },
    {
      content: 'Kırmızı izler için Vitamin C, çukurlar için ise retinol ve profesyonel tedaviler (microneedling, lazer) gerekebilir. Sabırlı olmalısın, sonuçlar 3-6 ayda görülür.',
      authorId: admin.id,
      questionId: q4.id,
    },

    {
      content: 'La Roche-Posay Anthelios Dry Touch SPF50+ denedim, yağlı ciltler için birebir. Mat bitişli ve suya dayanıklı. Biraz pahalı ama değer.',
      authorId: user3.id,
      questionId: q5.id,
    },
    {
      content: 'Bioderma Photoderm MAX Aquafluide de çok iyi. Ultra hafif ve yağlı ciltlere uygun. Makyaj altına da kullanılabilir.',
      authorId: user1.id,
      questionId: q5.id,
    },

    {
      content: 'Genetik faktör büyük rol oynuyor maalesef. Kafein içeren göz kremleri geçici olarak hafifletebilir. The Ordinary Caffeine Solution uygun fiyatlı bir seçenek.',
      authorId: user4.id,
      questionId: q6.id,
    },

    {
      content: 'Yves Rocher\'in sülfatsız şampuanları çok iyi. Doğal içerikli ve uygun fiyatlı. Watsons\'da bulabilirsin.',
      authorId: user5.id,
      questionId: q7.id,
    },
    {
      content: 'Logona ve Lavera markaları tamamen organik sertifikalı. Biraz pahalı ama saç sağlığı için değer. Gratis\'te satılıyor.',
      authorId: user1.id,
      questionId: q7.id,
    },

    {
      content: 'Maybelline SuperStay Matte Ink denedim, 16 saat kalıyor ve dudakları çok kurutmuyor. Altına dudak peelingi + balm sür.',
      authorId: user2.id,
      questionId: q8.id,
    },

    {
      content: '%0.25 veya %0.3 ile başla, haftada 2 gece kullan. Tahriş olmazsa yavaşça artır. Kesinlikle güneş koruyucu kullan çünkü retinol cildi güneşe duyarlı hale getirir.',
      authorId: admin.id,
      questionId: q9.id,
    },
    {
      content: 'The Ordinary Retinol 0.2% in Squalane ile başlamıştım, çok yumuşak bir giriş oldu. Şimdi %0.5 kullanıyorum. Sandviç yöntemi de işe yarıyor: nemlendirici-retinol-nemlendirici.',
      authorId: user3.id,
      questionId: q9.id,
    },

    {
      content: 'OPI Nail Envy tırnak güçlendirici olarak harika çalışıyor. 2 haftada fark görürsün. Tırnaklarını suyla fazla temas ettirme.',
      authorId: user4.id,
      questionId: q10.id,
    },

    {
      content: 'Dolce & Gabbana Light Blue yazın favorim! Akdeniz esintisi veriyor. Versace Bright Crystal da çok güzel ve daha uygun fiyatlı.',
      authorId: user2.id,
      questionId: q11.id,
    },
    {
      content: 'Jo Malone Lime Basil & Mandarin ofis için mükemmel. Çok hafif ve taze. Kalıcılık için krem versiyonuyla katmanla.',
      authorId: user5.id,
      questionId: q11.id,
    },

    {
      content: 'Haftada 1-2 kez yeterli, daha fazlası cildi tahriş eder. Tüy dönmesi için düzenli peeling çok etkili. Kahve peelingi selülite de iyi geliyor!',
      authorId: user1.id,
      questionId: q12.id,
    },

    {
      content: 'Estee Lauder Double Wear efsane! 24 saat kalıyor ve hiç akmıyor. Primer olarak Benefit Porefessional kullan.',
      authorId: user3.id,
      questionId: q13.id,
    },
    {
      content: 'Bütçe dostu seçenek istersen L\'Oreal Infallible Fresh Wear deneyebilirsin. Mat bitişli ve uzun ömürlü.',
      authorId: user4.id,
      questionId: q13.id,
    },

    {
      content: 'Avene Extremely Gentle Cleanser tam sana göre. Parfümsüz, pH dengeli ve köpürmeyen formülü var. Hassas ciltler için tasarlanmış.',
      authorId: admin.id,
      questionId: q14.id,
    },

    {
      content: 'Ben yaptırdım, çok memnunum! 6-8 hafta kalıyor. Kaşlara zarar vermedi. Fiyatlar 200-500 TL arası değişiyor. Profesyonel birine gitmeni öneririm.',
      authorId: user2.id,
      questionId: q15.id,
    },
    {
      content: 'Instagram\'da @browartist_istanbul çok iyiymiş, arkadaşım yaptırdı memnun. Öncesinde kaşlara boya da yapıyorlar, daha dolgun görünüyor.',
      authorId: user1.id,
      questionId: q15.id,
    },
  ]);

  console.log('💬 Created 25 answers');
  console.log('');
  console.log('✨ Seed completed successfully!');
  console.log('');
  console.log('📧 Demo accounts:');
  console.log('   Admin: admin@rarity.com / admin123');
  console.log('   User:  ayse@example.com / user123');
  console.log('   User:  fatma@example.com / user123');
  console.log('   User:  zeynep@example.com / user123');
  console.log('   User:  elif@example.com / user123');
  console.log('   User:  merve@example.com / user123');

  await AppDataSource.destroy();
  process.exit(0);
}

seed().catch((error) => {
  console.error('❌ Seed failed:', error);
  process.exit(1);
});
