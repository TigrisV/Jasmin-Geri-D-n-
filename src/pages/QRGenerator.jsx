import { useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import { QRCodeSVG } from 'qrcode.react'
import { Hotel, ArrowLeft, Download, Plus, Trash2, Printer, QrCode } from 'lucide-react'

function QRGenerator() {
  const [rooms, setRooms] = useState([{ id: 1, number: '101' }])
  const [baseUrl, setBaseUrl] = useState(window.location.origin)
  const printRef = useRef()

  const addRoom = () => {
    const lastRoom = rooms[rooms.length - 1]
    const nextNumber = lastRoom ? parseInt(lastRoom.number) + 1 : 101
    setRooms([...rooms, { id: Date.now(), number: nextNumber.toString() }])
  }

  const removeRoom = (id) => {
    setRooms(rooms.filter(r => r.id !== id))
  }

  const updateRoomNumber = (id, number) => {
    setRooms(rooms.map(r => r.id === id ? { ...r, number } : r))
  }

  const downloadQR = (roomNumber) => {
    const svg = document.getElementById(`qr-${roomNumber}`)
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
      link.download = `oda-${roomNumber}-qr.png`
      link.href = canvas.toDataURL('image/png')
      link.click()
    }
    
    img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)))
  }

  const printAllQRs = () => {
    const printContent = document.getElementById('print-area')
    const printWindow = window.open('', '', 'width=800,height=600')
    
    printWindow.document.write(`
      <html>
        <head>
          <title>QR Kodları Yazdır</title>
          <style>
            body { font-family: Arial, sans-serif; }
            .qr-card {
              display: inline-block;
              padding: 20px;
              margin: 10px;
              border: 2px solid #ddd;
              border-radius: 10px;
              text-align: center;
              page-break-inside: avoid;
            }
            .qr-card h3 { margin: 0 0 10px 0; color: #1e3a5f; }
            .qr-card p { margin: 10px 0 0 0; font-size: 12px; color: #666; }
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

  const generateBulkRooms = () => {
    const start = prompt('Başlangıç oda numarası:', '101')
    const end = prompt('Bitiş oda numarası:', '110')
    
    if (start && end) {
      const startNum = parseInt(start)
      const endNum = parseInt(end)
      const newRooms = []
      
      for (let i = startNum; i <= endNum; i++) {
        newRooms.push({ id: Date.now() + i, number: i.toString() })
      }
      
      setRooms(newRooms)
    }
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

          <div className="flex flex-wrap gap-3">
            <button
              onClick={addRoom}
              className="inline-flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Oda Ekle
            </button>
            <button
              onClick={generateBulkRooms}
              className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <QrCode className="w-4 h-4" />
              Toplu Oluştur
            </button>
            <button
              onClick={printAllQRs}
              className="inline-flex items-center gap-2 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
            >
              <Printer className="w-4 h-4" />
              Tümünü Yazdır
            </button>
          </div>
        </div>

        {/* QR Codes Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6" id="print-area">
          {rooms.map((room) => (
            <div
              key={room.id}
              className="qr-card bg-white rounded-xl p-6 shadow-sm border border-gray-100 text-center"
            >
              <div className="flex items-center justify-between mb-4">
                <input
                  type="text"
                  value={room.number}
                  onChange={(e) => updateRoomNumber(room.id, e.target.value)}
                  className="w-20 text-center text-lg font-bold text-gray-800 border border-gray-200 rounded-lg px-2 py-1 focus:border-emerald-500 outline-none"
                />
                <button
                  onClick={() => removeRoom(room.id)}
                  className="p-2 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="bg-white p-4 rounded-lg inline-block border-2 border-gray-100">
                <QRCodeSVG
                  id={`qr-${room.number}`}
                  value={`${baseUrl}/feedback/${room.number}`}
                  size={150}
                  level="H"
                  includeMargin={true}
                />
              </div>

              <div className="mt-4">
                <p className="text-sm text-gray-500 mb-3">Oda {room.number}</p>
                <button
                  onClick={() => downloadQR(room.number)}
                  className="inline-flex items-center gap-2 text-emerald-600 hover:text-emerald-700 text-sm font-medium"
                >
                  <Download className="w-4 h-4" />
                  İndir
                </button>
              </div>

              <p className="text-xs text-gray-400 mt-3 break-all">
                {baseUrl}/feedback/{room.number}
              </p>
            </div>
          ))}
        </div>

        {rooms.length === 0 && (
          <div className="bg-white rounded-xl p-12 shadow-sm border border-gray-100 text-center">
            <QrCode className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">Henüz oda eklenmedi</p>
            <button
              onClick={addRoom}
              className="mt-4 inline-flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              İlk Odayı Ekle
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default QRGenerator
