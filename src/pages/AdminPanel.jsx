import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { 
  Hotel, ArrowLeft, Trash2, CheckCircle, Clock, AlertTriangle, 
  Filter, Search, RefreshCw, Lightbulb, MessageSquare, Mail, QrCode
} from 'lucide-react'

function AdminPanel() {
  const [feedbacks, setFeedbacks] = useState([])
  const [filter, setFilter] = useState('all')
  const [typeFilter, setTypeFilter] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    loadFeedbacks()
  }, [])

  const loadFeedbacks = () => {
    const stored = JSON.parse(localStorage.getItem('hotelFeedbacks') || '[]')
    setFeedbacks(stored.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)))
  }

  const updateStatus = (id, status) => {
    const updated = feedbacks.map(f => 
      f.id === id ? { ...f, status } : f
    )
    setFeedbacks(updated)
    localStorage.setItem('hotelFeedbacks', JSON.stringify(updated))
  }

  const deleteFeedback = (id) => {
    if (confirm('Bu geri bildirimi silmek istediğinizden emin misiniz?')) {
      const updated = feedbacks.filter(f => f.id !== id)
      setFeedbacks(updated)
      localStorage.setItem('hotelFeedbacks', JSON.stringify(updated))
    }
  }

  const filteredFeedbacks = feedbacks.filter(f => {
    const matchesStatus = filter === 'all' || f.status === filter
    const matchesType = typeFilter === 'all' || f.type === typeFilter
    const matchesSearch = f.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (f.roomNumber && f.roomNumber.toString().includes(searchTerm)) ||
                          (f.guestName && f.guestName.toLowerCase().includes(searchTerm.toLowerCase()))
    return matchesStatus && matchesType && matchesSearch
  })

  const getStatusBadge = (status) => {
    switch (status) {
      case 'beklemede':
        return <span className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-medium flex items-center gap-1">
          <Clock className="w-3 h-3" /> Beklemede
        </span>
      case 'inceleniyor':
        return <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium flex items-center gap-1">
          <RefreshCw className="w-3 h-3" /> İnceleniyor
        </span>
      case 'tamamlandi':
        return <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-medium flex items-center gap-1">
          <CheckCircle className="w-3 h-3" /> Tamamlandı
        </span>
      default:
        return null
    }
  }

  const stats = {
    total: feedbacks.length,
    pending: feedbacks.filter(f => f.status === 'beklemede').length,
    inProgress: feedbacks.filter(f => f.status === 'inceleniyor').length,
    completed: feedbacks.filter(f => f.status === 'tamamlandi').length,
    requests: feedbacks.filter(f => f.type === 'istek').length,
    complaints: feedbacks.filter(f => f.type === 'sikayet').length
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-900 to-indigo-900 text-white">
        <div className="container mx-auto px-4 py-6">
          <Link to="/" className="inline-flex items-center gap-2 text-blue-200 hover:text-white mb-4 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Ana Sayfa
          </Link>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Hotel className="w-8 h-8 text-amber-400" />
              <h1 className="text-2xl md:text-3xl font-bold">Admin Paneli</h1>
            </div>
            <div className="flex gap-2">
              <Link
                to="/qr-generator"
                className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg transition-colors text-sm"
              >
                <QrCode className="w-4 h-4" />
                QR Oluştur
              </Link>
              <Link
                to="/email-settings"
                className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg transition-colors text-sm"
              >
                <Mail className="w-4 h-4" />
                E-posta Ayarları
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-8">
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <p className="text-gray-500 text-sm">Toplam</p>
            <p className="text-2xl font-bold text-gray-800">{stats.total}</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <p className="text-amber-500 text-sm">Beklemede</p>
            <p className="text-2xl font-bold text-amber-600">{stats.pending}</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <p className="text-blue-500 text-sm">İnceleniyor</p>
            <p className="text-2xl font-bold text-blue-600">{stats.inProgress}</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <p className="text-emerald-500 text-sm">Tamamlandı</p>
            <p className="text-2xl font-bold text-emerald-600">{stats.completed}</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <p className="text-blue-500 text-sm flex items-center gap-1"><Lightbulb className="w-3 h-3" /> İstekler</p>
            <p className="text-2xl font-bold text-blue-600">{stats.requests}</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <p className="text-rose-500 text-sm flex items-center gap-1"><AlertTriangle className="w-3 h-3" /> Şikayetler</p>
            <p className="text-2xl font-bold text-rose-600">{stats.complaints}</p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Oda no, isim veya mesaj ara..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
              />
            </div>
            <div className="flex gap-2 items-center">
              <Filter className="w-5 h-5 text-gray-400" />
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="px-4 py-2 border border-gray-200 rounded-lg focus:border-blue-500 outline-none"
              >
                <option value="all">Tüm Durumlar</option>
                <option value="beklemede">Beklemede</option>
                <option value="inceleniyor">İnceleniyor</option>
                <option value="tamamlandi">Tamamlandı</option>
              </select>
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="px-4 py-2 border border-gray-200 rounded-lg focus:border-blue-500 outline-none"
              >
                <option value="all">Tüm Türler</option>
                <option value="istek">İstekler</option>
                <option value="sikayet">Şikayetler</option>
              </select>
              <button
                onClick={loadFeedbacks}
                className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                title="Yenile"
              >
                <RefreshCw className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Feedback List */}
        {filteredFeedbacks.length === 0 ? (
          <div className="bg-white rounded-xl p-12 shadow-sm border border-gray-100 text-center">
            <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">Henüz geri bildirim bulunmuyor</p>
            <p className="text-gray-400 text-sm mt-1">QR kodlarını oluşturup odalara yerleştirin</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredFeedbacks.map((feedback) => (
              <div
                key={feedback.id}
                className={`bg-white rounded-xl p-5 shadow-sm border-l-4 ${
                  feedback.type === 'sikayet' ? 'border-l-rose-500' : 'border-l-blue-500'
                } border border-gray-100`}
              >
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-3">
                      <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm font-medium">
                        Oda {feedback.roomNumber}
                      </span>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        feedback.type === 'sikayet' 
                          ? 'bg-rose-100 text-rose-700' 
                          : 'bg-blue-100 text-blue-700'
                      }`}>
                        {feedback.type === 'sikayet' ? '⚠️ Şikayet' : '💡 İstek'}
                      </span>
                      {getStatusBadge(feedback.status)}
                    </div>
                    {feedback.guestName && (
                      <p className="text-sm text-gray-500 mb-1">
                        <span className="font-medium">Misafir:</span> {feedback.guestName}
                      </p>
                    )}
                    <p className="text-gray-800">{feedback.message}</p>
                    <p className="text-xs text-gray-400 mt-2">
                      {new Date(feedback.createdAt).toLocaleString('tr-TR')}
                    </p>
                  </div>
                  <div className="flex md:flex-col gap-2">
                    <select
                      value={feedback.status}
                      onChange={(e) => updateStatus(feedback.id, e.target.value)}
                      className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:border-blue-500 outline-none"
                    >
                      <option value="beklemede">Beklemede</option>
                      <option value="inceleniyor">İnceleniyor</option>
                      <option value="tamamlandi">Tamamlandı</option>
                    </select>
                    <button
                      onClick={() => deleteFeedback(feedback.id)}
                      className="p-2 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                      title="Sil"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminPanel
