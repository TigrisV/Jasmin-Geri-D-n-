import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Mail, Save, CheckCircle, AlertCircle, Send, Smartphone } from 'lucide-react'

function EmailSettings() {
  const [settings, setSettings] = useState({
    enabled: false,
    emailTo: '',
    emailServiceId: '',
    emailTemplateId: '',
    emailPublicKey: ''
  })
  const [saved, setSaved] = useState(false)
  const [testStatus, setTestStatus] = useState(null)
  const [errorMsg, setErrorMsg] = useState('')
  const [step, setStep] = useState(1)

  useEffect(() => {
    const stored = localStorage.getItem('emailSettings')
    if (stored) {
      const parsed = JSON.parse(stored)
      setSettings(parsed)
      if (parsed.emailServiceId && parsed.emailTemplateId && parsed.emailPublicKey) {
        setStep(3)
      }
    }
  }, [])

  const handleSave = () => {
    localStorage.setItem('emailSettings', JSON.stringify(settings))
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  const handleTest = async () => {
    setTestStatus('sending')
    setErrorMsg('')
    
    if (!settings.emailServiceId || !settings.emailTemplateId || !settings.emailPublicKey || !settings.emailTo) {
      setTestStatus('error')
      setErrorMsg('Tüm alanları doldurun')
      return
    }

    try {
      const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          service_id: settings.emailServiceId,
          template_id: settings.emailTemplateId,
          user_id: settings.emailPublicKey,
          template_params: {
            to_email: settings.emailTo,
            room_number: 'TEST',
            guest_name: 'Test',
            feedback_type: 'Test Bildirimi',
            category: 'Test',
            priority: 'Normal',
            message: 'E-posta bildirimleri basariyla calisiyor!',
            created_at: new Date().toLocaleString('tr-TR')
          }
        })
      })

      const responseText = await response.text()
      
      if (response.ok) {
        setTestStatus('success')
        setErrorMsg('')
      } else {
        setTestStatus('error')
        setErrorMsg(responseText || `Hata kodu: ${response.status}`)
      }
    } catch (error) {
      setTestStatus('error')
      setErrorMsg(error.message || 'Bağlantı hatası')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-900 to-indigo-900 text-white">
        <div className="container mx-auto px-4 py-6">
          <Link to="/" className="inline-flex items-center gap-2 text-purple-200 hover:text-white mb-4 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Ana Sayfa
          </Link>
          <div className="flex items-center gap-3">
            <Smartphone className="w-8 h-8 text-amber-400" />
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">Telefona Bildirim Ayarları</h1>
              <p className="text-purple-200 text-sm">Misafir istekleri ve şikayetleri e-posta olarak telefonunuza gelsin</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-2xl">
        {/* Nasıl Çalışır */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-5 mb-6">
          <h3 className="font-semibold text-blue-800 mb-3 flex items-center gap-2">
            <Smartphone className="w-5 h-5" />
            Nasıl Çalışır?
          </h3>
          <div className="text-sm text-blue-700 space-y-2">
            <p>✅ Misafir odadaki QR kodu okutup istek/şikayet gönderir</p>
            <p>✅ <strong>Sizin e-postanıza</strong> anında bildirim gelir</p>
            <p>✅ Telefonunuzda e-posta bildirimi açıksa telefona da gelir</p>
            <p className="text-blue-600 font-medium pt-2">Misafire e-posta gitmez, sadece size gelir!</p>
          </div>
        </div>

        {/* Adım Adım Kurulum */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-6">
          <h3 className="font-semibold text-gray-800 mb-4">5 Dakikada Kurulum</h3>
          
          {/* Step 1 */}
          <div className={`p-4 rounded-xl mb-4 ${step >= 1 ? 'bg-purple-50 border-2 border-purple-200' : 'bg-gray-50'}`}>
            <div className="flex items-start gap-3">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm ${step >= 1 ? 'bg-purple-600' : 'bg-gray-400'}`}>
                1
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-gray-800">EmailJS Hesabı Oluşturun (Ücretsiz)</h4>
                <p className="text-sm text-gray-600 mt-1">
                  <a href="https://www.emailjs.com/" target="_blank" rel="noopener" 
                     className="text-purple-600 underline font-medium">emailjs.com</a> adresine gidin → 
                  "Sign Up Free" butonuna tıklayın → Google ile giriş yapın
                </p>
              </div>
            </div>
          </div>

          {/* Step 2 */}
          <div className={`p-4 rounded-xl mb-4 ${step >= 2 ? 'bg-purple-50 border-2 border-purple-200' : 'bg-gray-50'}`}>
            <div className="flex items-start gap-3">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm ${step >= 2 ? 'bg-purple-600' : 'bg-gray-400'}`}>
                2
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-gray-800">Email Service Ekleyin</h4>
                <p className="text-sm text-gray-600 mt-1">
                  Sol menüden "Email Services" → "Add New Service" → "Gmail" seçin → 
                  "Connect Account" ile Gmail hesabınızı bağlayın
                </p>
                <p className="text-xs text-purple-600 mt-2 font-medium">
                  📌 Service ID'yi not alın (service_xxxxx gibi)
                </p>
              </div>
            </div>
          </div>

          {/* Step 3 */}
          <div className={`p-4 rounded-xl mb-4 ${step >= 3 ? 'bg-purple-50 border-2 border-purple-200' : 'bg-gray-50'}`}>
            <div className="flex items-start gap-3">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm ${step >= 3 ? 'bg-purple-600' : 'bg-gray-400'}`}>
                3
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-gray-800">Email Template Oluşturun</h4>
                <p className="text-sm text-gray-600 mt-1">
                  "Email Templates" → "Create New Template" → Aşağıdaki şablonu kopyalayın:
                </p>
                <div className="bg-gray-100 rounded-lg p-3 mt-2 text-xs font-mono">
                  <p><strong>To Email:</strong> {`{{to_email}}`}</p>
                  <p><strong>Subject:</strong> {`🏨 Oda {{room_number}} - {{feedback_type}}`}</p>
                  <p><strong>Content:</strong></p>
                  <p className="whitespace-pre-wrap text-gray-700">{`Oda: {{room_number}}
Misafir: {{guest_name}}
Tür: {{feedback_type}}
Kategori: {{category}}
Öncelik: {{priority}}

Mesaj:
{{message}}

Tarih: {{created_at}}`}</p>
                </div>
                <p className="text-xs text-purple-600 mt-2 font-medium">
                  📌 Template ID'yi not alın (template_xxxxx gibi)
                </p>
              </div>
            </div>
          </div>

          {/* Step 4 */}
          <div className="p-4 rounded-xl bg-gray-50">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full flex items-center justify-center bg-gray-400 text-white font-bold text-sm">
                4
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-gray-800">Public Key'i Alın</h4>
                <p className="text-sm text-gray-600 mt-1">
                  "Account" → "General" bölümünde "Public Key" yazıyor
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Ayarlar Formu */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100">
            <div>
              <h3 className="font-semibold text-gray-800">Bildirim Ayarları</h3>
              <p className="text-sm text-gray-500">EmailJS bilgilerinizi girin</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.enabled}
                onChange={(e) => setSettings({ ...settings, enabled: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
              <span className="ml-2 text-sm font-medium text-gray-700">{settings.enabled ? 'Açık' : 'Kapalı'}</span>
            </label>
          </div>

          {/* E-posta Adresi */}
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">
              📧 Bildirimlerin Geleceği E-posta
            </label>
            <input
              type="email"
              value={settings.emailTo}
              onChange={(e) => setSettings({ ...settings, emailTo: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-all"
              placeholder="sizin@email.com"
            />
            <p className="text-xs text-gray-500 mt-1">Telefonunuzda bu e-postanın bildirimlerini açın</p>
          </div>

          {/* Service ID */}
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">
              Service ID
            </label>
            <input
              type="text"
              value={settings.emailServiceId}
              onChange={(e) => setSettings({ ...settings, emailServiceId: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-all"
              placeholder="service_xxxxxxx"
            />
          </div>

          {/* Template ID */}
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">
              Template ID
            </label>
            <input
              type="text"
              value={settings.emailTemplateId}
              onChange={(e) => setSettings({ ...settings, emailTemplateId: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-all"
              placeholder="template_xxxxxxx"
            />
          </div>

          {/* Public Key */}
          <div className="mb-6">
            <label className="block text-gray-700 font-medium mb-2">
              Public Key
            </label>
            <input
              type="text"
              value={settings.emailPublicKey}
              onChange={(e) => setSettings({ ...settings, emailPublicKey: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-all"
              placeholder="xxxxxxxxxxxxxxx"
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-3">
            <button
              onClick={handleSave}
              className="flex-1 bg-purple-600 text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-purple-700 transition-colors"
            >
              {saved ? (
                <>
                  <CheckCircle className="w-5 h-5" />
                  Kaydedildi!
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  Kaydet
                </>
              )}
            </button>
            <button
              onClick={handleTest}
              disabled={testStatus === 'sending' || !settings.emailTo}
              className="px-6 bg-blue-600 text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {testStatus === 'sending' ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : testStatus === 'success' ? (
                <CheckCircle className="w-5 h-5" />
              ) : testStatus === 'error' ? (
                <AlertCircle className="w-5 h-5" />
              ) : (
                <Send className="w-5 h-5" />
              )}
              Test Gönder
            </button>
          </div>

          {testStatus === 'success' && (
            <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-xl text-center">
              <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <p className="text-green-700 font-medium">Test e-postası gönderildi!</p>
              <p className="text-green-600 text-sm">Telefonunuzu kontrol edin</p>
            </div>
          )}
          {testStatus === 'error' && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-xl text-center">
              <AlertCircle className="w-8 h-8 text-red-600 mx-auto mb-2" />
              <p className="text-red-700 font-medium">Gönderilemedi</p>
              <p className="text-red-600 text-sm mb-2">{errorMsg}</p>
              <div className="text-xs text-left bg-red-100 p-3 rounded-lg mt-2">
                <p className="font-medium mb-1">Kontrol edin:</p>
                <p>• Service ID: {settings.emailServiceId || '❌ Boş'}</p>
                <p>• Template ID: {settings.emailTemplateId || '❌ Boş'}</p>
                <p>• Public Key: {settings.emailPublicKey ? '✅ Girilmiş' : '❌ Boş'}</p>
                <p>• E-posta: {settings.emailTo || '❌ Boş'}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default EmailSettings
