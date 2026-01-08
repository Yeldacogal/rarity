import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { FiMessageCircle, FiUsers, FiStar, FiArrowRight } from 'react-icons/fi';

export default function HomePage() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen" style={{ backgroundImage: 'url(/bg-pattern.jpg)', backgroundSize: 'cover', backgroundPosition: 'center', backgroundAttachment: 'fixed' }}>
      <div className="absolute inset-0 bg-white/70 -z-10"></div>
      <section className="relative py-20 px-4 overflow-hidden">
        <div className="absolute top-10 left-10 w-16 h-16 bg-rose-200 rounded-full opacity-50 float-animation"></div>
        <div className="absolute top-40 right-20 w-12 h-12 bg-rose-300 rounded-full opacity-40 float-animation" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-20 left-1/4 w-8 h-8 bg-rose-400 rounded-full opacity-30 float-animation" style={{ animationDelay: '2s' }}></div>

        <div className="max-w-4xl mx-auto text-center">
          <div className="relative window max-w-2xl mx-auto mb-12">
            <img 
              src="/girl.png" 
              alt="" 
              className="absolute -bottom-3 -left-13 w-48 h-48 object-contain hidden md:block z-10"
            />
            <div className="window-header">
              <div className="flex gap-2">
                <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                <div className="w-3 h-3 bg-green-400 rounded-full"></div>
              </div>
              <span>welcome.exe</span>
              <div className="w-16"></div>
            </div>
            <div className="window-content text-center py-12">
              <div className="flex items-center justify-center gap-4 mb-6">
                <img src="/logo.png" alt="" className="w-24 h-24 object-contain" />
                <h1 className="font-pixel text-3xl md:text-4xl text-rose-600 leading-relaxed">
                  RARITY
                </h1>
              </div>
              <p className="text-xl text-gray-600 mb-2">
                Cilt Bakımı & Makyaj
              </p>
              <p className="text-lg text-gray-500 mb-8">
                Soru-Cevap Topluluğu
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/questions"
                  className="btn-primary inline-flex items-center justify-center gap-2 rounded-lg"
                >
                  <FiMessageCircle />
                  Soruları Keşfet
                </Link>
                {!user && (
                  <Link
                    to="/register"
                    className="btn-secondary inline-flex items-center justify-center gap-2 rounded-lg"
                  >
                    Topluluğa Katıl
                    <FiArrowRight />
                  </Link>
                )}
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mt-16">
            <div className="bg-white border-2 border-rose-200 rounded-lg p-6 hover:border-rose-400 transition-colors">
              <div className="w-12 h-12 bg-rose-100 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <FiMessageCircle className="text-rose-500 text-2xl" />
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">Soru Sor</h3>
              <p className="text-gray-500 text-sm">
                Cilt bakımı ve makyaj hakkında merak ettiklerini sor, uzmanlardan cevap al.
              </p>
            </div>

            <div className="bg-white border-2 border-rose-200 rounded-lg p-6 hover:border-rose-400 transition-colors">
              <div className="w-12 h-12 bg-rose-100 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <FiUsers className="text-rose-500 text-2xl" />
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">Topluluk</h3>
              <p className="text-gray-500 text-sm">
                Aynı ilgi alanlarına sahip kişilerle bağlan, deneyimlerini paylaş.
              </p>
            </div>

            <div className="bg-white border-2 border-rose-200 rounded-lg p-6 hover:border-rose-400 transition-colors">
              <div className="w-12 h-12 bg-rose-100 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <FiStar className="text-rose-500 text-2xl" />
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">Faydalı Oylar</h3>
              <p className="text-gray-500 text-sm">
                En faydalı cevapları oyla, en iyi tavsiyeleri bul.
              </p>
            </div>
          </div>
        </div>
      </section>

      {!user && (
        <section className="py-16 px-4 bg-gradient-to-r from-rose-100 to-rose-200">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Hemen Başla!
            </h2>
            <p className="text-gray-600 mb-8">
              Ücretsiz hesap oluştur ve güzellik dünyasının en güncel bilgilerine ulaş.
            </p>
            <Link
              to="/register"
              className="btn-primary inline-flex items-center gap-2 rounded-lg"
            >
              Kayıt Ol
              <FiArrowRight />
            </Link>
          </div>
        </section>
      )}
    </div>
  );
}
