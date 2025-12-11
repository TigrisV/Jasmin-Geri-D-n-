export const sendEmailNotification = async (feedback) => {
  const settings = JSON.parse(localStorage.getItem('emailSettings') || '{}')
  
  // E-posta bildirimleri kapalıysa çık
  if (!settings.enabled) return { success: false, reason: 'disabled' }
  
  // Gerekli ayarlar eksikse çık
  if (!settings.emailServiceId || !settings.emailTemplateId || !settings.emailPublicKey || !settings.emailTo) {
    return { success: false, reason: 'missing_settings' }
  }
  
  // Sadece acil bildirimlerde e-posta gönder ayarı aktifse ve bildirim acil değilse çık
  if (settings.sendOnUrgent && !settings.sendOnNewFeedback) {
    if (feedback.priority !== 'acil' && feedback.priority !== 'yuksek') {
      return { success: false, reason: 'not_urgent' }
    }
  }

  const categoryLabels = {
    genel: 'Genel',
    temizlik: 'Temizlik',
    teknik: 'Teknik Sorun',
    havlu_nevresim: 'Havlu & Nevresim'
  }

  const priorityLabels = {
    dusuk: 'Düşük',
    normal: 'Normal',
    yuksek: 'Yüksek',
    acil: 'ACİL'
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
          room_number: feedback.roomNumber,
          guest_name: feedback.guestName || 'Belirtilmedi',
          feedback_type: feedback.type === 'istek' ? '💡 İstek' : '⚠️ Şikayet',
          category: categoryLabels[feedback.category] || feedback.category,
          priority: priorityLabels[feedback.priority] || feedback.priority,
          message: feedback.message,
          created_at: new Date(feedback.createdAt).toLocaleString('tr-TR')
        }
      })
    })

    if (response.ok) {
      return { success: true }
    } else {
      return { success: false, reason: 'api_error' }
    }
  } catch (error) {
    console.error('Email send error:', error)
    return { success: false, reason: 'network_error' }
  }
}
