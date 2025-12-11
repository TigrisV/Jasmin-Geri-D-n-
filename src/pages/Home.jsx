import { Link } from 'react-router-dom'
import { Hotel, QrCode, Settings, Mail } from 'lucide-react'

function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Hotel className="w-12 h-12 text-amber-400" />
            <h1 className="text-4xl md:text-5xl font-bold text-white">
              Otel Yönetim Paneli
            </h1>
          </div>
          <p className="text-blue-200 text-lg max-w-2xl mx-auto">
            Misafir geri bildirimlerini yönetin, QR kodları oluşturun ve e-posta ayarlarını yapılandırın.
          </p>
        </div>

        {/* Cards */}
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {/* Admin Panel */}
          <Link
            to="/admin"
            className="group bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 hover:bg-white/20 transition-all duration-300 hover:scale-105"
          >
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-rose-400 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Settings className="w-8 h-8 text-blue-900" />
              </div>
              <h2 className="text-xl font-semibold text-white mb-2">
                Geri Bildirimler
              </h2>
              <p className="text-blue-200 text-sm">
                Gelen istek ve şikayetleri görüntüleyin ve yönetin
              </p>
            </div>
          </Link>

          {/* QR Oluştur */}
          <Link
            to="/qr-generator"
            className="group bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 hover:bg-white/20 transition-all duration-300 hover:scale-105"
          >
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-emerald-400 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <QrCode className="w-8 h-8 text-blue-900" />
              </div>
              <h2 className="text-xl font-semibold text-white mb-2">
                QR Kod Oluştur
              </h2>
              <p className="text-blue-200 text-sm">
                Oda numaralarına özel QR kodlar oluşturun
              </p>
            </div>
          </Link>

          {/* E-posta Ayarları */}
          <Link
            to="/email-settings"
            className="group bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 hover:bg-white/20 transition-all duration-300 hover:scale-105"
          >
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-purple-400 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Mail className="w-8 h-8 text-blue-900" />
              </div>
              <h2 className="text-xl font-semibold text-white mb-2">
                E-posta Ayarları
              </h2>
              <p className="text-blue-200 text-sm">
                Bildirim e-postası ayarlarını yapılandırın
              </p>
            </div>
          </Link>
        </div>

        {/* Footer */}
        <div className="text-center mt-16 text-blue-300 text-sm">
          <p>© 2024 Otel Geri Bildirim Sistemi</p>
        </div>
      </div>
    </div>
  )
}

export default Home
