import { useState } from 'react'
import { Hotel, Send, CheckCircle, AlertTriangle, Lightbulb } from 'lucide-react'
import { sendEmailNotification } from '../utils/emailService'

function FeedbackForm() {
    const [formData, setFormData] = useState({
    guestName: '',
    roomNumber: '',
    type: 'istek',
    message: ''
  })
  const [submitted, setSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    // LocalStorage'a kaydet
    const feedbacks = JSON.parse(localStorage.getItem('hotelFeedbacks') || '[]')
    const newFeedback = {
      id: Date.now(),
      ...formData,
      status: 'beklemede',
      createdAt: new Date().toISOString()
    }
    feedbacks.push(newFeedback)
    localStorage.setItem('hotelFeedbacks', JSON.stringify(feedbacks))

    // E-posta bildirimi gönder
    sendEmailNotification(newFeedback)

    setTimeout(() => {
      setIsSubmitting(false)
      setSubmitted(true)
    }, 1000)
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-900 via-emerald-800 to-teal-900 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl p-8 max-w-md w-full text-center shadow-2xl">
          <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-emerald-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Teşekkür Ederiz!
          </h2>
          <p className="text-gray-600 mb-6">
            Geri bildiriminiz başarıyla iletildi. En kısa sürede sizinle ilgileneceğiz.
          </p>
          <div className="bg-emerald-50 rounded-xl p-4 mb-6">
            <p className="text-sm text-emerald-700">
              <span className="font-semibold">Oda:</span> {formData.roomNumber}
            </p>
            <p className="text-sm text-emerald-700">
              <span className="font-semibold">Tür:</span> {formData.type === 'istek' ? 'İstek' : 'Şikayet'}
            </p>
          </div>
          <p className="text-gray-500 text-sm">Bu pencereyi kapatabilirsiniz</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
                    <div className="flex items-center justify-center gap-3 mb-2">
            <Hotel className="w-8 h-8 text-amber-400" />
            <h1 className="text-2xl md:text-3xl font-bold text-white">
              Geri Bildirim Formu
            </h1>
          </div>
                  </div>

        {/* Form */}
        <div className="max-w-lg mx-auto">
          <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-6 md:p-8 shadow-2xl">
            {/* Oda Numarası */}
            <div className="mb-5">
              <label className="block text-gray-700 font-medium mb-2">
                Oda Numarası <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.roomNumber}
                onChange={(e) => setFormData({ ...formData, roomNumber: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                placeholder="Örn: 101"
              />
            </div>

            {/* İsim */}
            <div className="mb-5">
              <label className="block text-gray-700 font-medium mb-2">
                Adınız (Opsiyonel)
              </label>
              <input
                type="text"
                value={formData.guestName}
                onChange={(e) => setFormData({ ...formData, guestName: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                placeholder="Adınızı giriniz"
              />
            </div>

            {/* Tür Seçimi */}
            <div className="mb-5">
              <label className="block text-gray-700 font-medium mb-2">
                Bildirim Türü
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, type: 'istek' })}
                  className={`flex items-center justify-center gap-2 p-4 rounded-xl border-2 transition-all ${
                    formData.type === 'istek'
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 hover:border-gray-300 text-gray-600'
                  }`}
                >
                  <Lightbulb className="w-5 h-5" />
                  <span className="font-medium">İstek</span>
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, type: 'sikayet' })}
                  className={`flex items-center justify-center gap-2 p-4 rounded-xl border-2 transition-all ${
                    formData.type === 'sikayet'
                      ? 'border-rose-500 bg-rose-50 text-rose-700'
                      : 'border-gray-200 hover:border-gray-300 text-gray-600'
                  }`}
                >
                  <AlertTriangle className="w-5 h-5" />
                  <span className="font-medium">Şikayet</span>
                </button>
              </div>
            </div>

            {/* Mesaj */}
            <div className="mb-6">
              <label className="block text-gray-700 font-medium mb-2">
                Mesajınız <span className="text-rose-500">*</span>
              </label>
              <textarea
                required
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                rows={4}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all resize-none"
                placeholder="İstek veya şikayetinizi detaylı bir şekilde yazınız..."
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 rounded-xl font-semibold flex items-center justify-center gap-2 hover:from-blue-700 hover:to-indigo-700 transition-all disabled:opacity-70"
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Gönderiliyor...
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  Gönder
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default FeedbackForm
