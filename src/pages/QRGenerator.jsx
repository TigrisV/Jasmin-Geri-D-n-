import { useState } from 'react'
import { Link } from 'react-router-dom'
import { QRCodeSVG } from 'qrcode.react'
import { ArrowLeft, Download, Printer, QrCode } from 'lucide-react'

function QRGenerator() {
  const [baseUrl, setBaseUrl] = useState(window.location.origin)

  const feedbackUrl = `${baseUrl}/feedback`

  const downloadQR = () => {
    const svg = document.getElementById('qr-feedback')
    const svgData = new XMLSerializer().serializeToString(svg)
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    const img = new Image()
    
    img.onload = () => {
      canvas.width = img.width
      canvas.height = img.height
      ctx.fillStyle = 'white'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      ctx.drawImage(img, 0, 0)
      
      const link = document.createElement('a')
      link.download = 'geri-bildirim-qr.png'
      link.href = canvas.toDataURL('image/png')
      link.click()
    }
    
    img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)))
  }

  const printQR = () => {
    const printContent = document.getElementById('print-area')
    const printWindow = window.open('', '', 'width=800,height=600')
    
    printWindow.document.write(`
      <html>
        <head>
          <title>QR Kod Yazdır</title>
          <style>
            body { font-family: Arial, sans-serif; display: flex; justify-content: center; align-items: center; min-height: 100vh; margin: 0; }
            .qr-card {
              padding: 40px;
              border: 2px solid #ddd;
              border-radius: 10px;
              text-align: center;
            }
            .qr-card h3 { margin: 0 0 20px 0; color: #1e3a5f; font-size: 24px; }
            .qr-card p { margin: 20px 0 0 0; font-size: 14px; color: #666; }
            @media print {
              .qr-card { border: 2px solid #000; }
            }
          </style>
        </head>
        <body>
          ${printContent.innerHTML}
        </body>
      </html>
    `)
    
    printWindow.document.close()
    printWindow.focus()
    setTimeout(() => {
      printWindow.print()
      printWindow.close()
    }, 250)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-900 to-teal-900 text-white">
        <div className="container mx-auto px-4 py-6">
          <Link to="/" className="inline-flex items-center gap-2 text-emerald-200 hover:text-white mb-4 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Ana Sayfa
          </Link>
          <div className="flex items-center gap-3">
            <QrCode className="w-8 h-8 text-amber-400" />
            <h1 className="text-2xl md:text-3xl font-bold">QR Kod Oluşturucu</h1>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Settings */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-8">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Ayarlar</h2>
          
          <div className="mb-4">
            <label className="block text-gray-600 text-sm mb-2">Site URL</label>
            <input
              type="text"
              value={baseUrl}
              onChange={(e) => setBaseUrl(e.target.value)}
              className="w-full md:w-1/2 px-4 py-2 border border-gray-200 rounded-lg focus:border-emerald-500 outline-none"
              placeholder="https://otel.com"
            />
            <p className="text-xs text-gray-400 mt-1">
              QR kodun yönlendireceği temel URL (deploy ettikten sonra güncelleyin)
            </p>
          </div>
        </div>

        {/* Single QR Code */}
        <div className="max-w-md mx-auto">
          <div className="qr-card bg-white rounded-xl p-8 shadow-sm border border-gray-100 text-center" id="print-area">
            <h3 className="text-xl font-bold text-gray-800 mb-6">Geri Bildirim QR Kodu</h3>
            
            <div className="bg-white p-4 rounded-lg inline-block border-2 border-gray-100">
              <QRCodeSVG
                id="qr-feedback"
                value={feedbackUrl}
                size={200}
                level="H"
                includeMargin={true}
              />
            </div>

            <p className="text-sm text-gray-500 mt-6 mb-4">
              Bu QR kodu tüm odalarda kullanabilirsiniz
            </p>

            <div className="flex justify-center gap-3">
              <button
                onClick={downloadQR}
                className="inline-flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors"
              >
                <Download className="w-4 h-4" />
                İndir
              </button>
              <button
                onClick={printQR}
                className="inline-flex items-center gap-2 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
              >
                <Printer className="w-4 h-4" />
                Yazdır
              </button>
            </div>

            <p className="text-xs text-gray-400 mt-6 break-all">
              {feedbackUrl}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default QRGenerator
