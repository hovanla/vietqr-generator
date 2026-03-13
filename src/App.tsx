import React, { useState, useEffect } from 'react'
import './index.css'

function App() {
  const [input, setInput] = useState<string>('')
  const [amount, setAmount] = useState<number>(2000)
  const [phoneNumbers, setPhoneNumbers] = useState<string[]>([])
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false)
  const [viewMode, setViewMode] = useState<'grid' | 'slider'>('grid')
  const [currentIndex, setCurrentIndex] = useState<number>(0)

  useEffect(() => {
    const savedInput = localStorage.getItem('vietqr_input')
    const savedAmount = localStorage.getItem('vietqr_amount')
    if (savedInput) setInput(savedInput)
    if (savedAmount) setAmount(parseInt(savedAmount))
    
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setIsDarkMode(true)
    }
  }, [])

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', isDarkMode ? 'dark' : 'light')
  }, [isDarkMode])

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (viewMode !== 'slider' || phoneNumbers.length === 0) return

      if (e.key === 'ArrowRight') {
        setCurrentIndex((prev) => (prev < phoneNumbers.length - 1 ? prev + 1 : prev))
      } else if (e.key === 'ArrowLeft') {
        setCurrentIndex((prev) => (prev > 0 ? prev - 1 : prev))
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [viewMode, phoneNumbers.length])

  const handleGenerate = () => {
    const lines = input.split(/\n|,|;/).map(line => line.trim()).filter(line => line.length > 0)
    setPhoneNumbers(lines)
    setCurrentIndex(0)
    localStorage.setItem('vietqr_input', input)
    localStorage.setItem('vietqr_amount', amount.toString())
  }

  const toggleDarkMode = () => setIsDarkMode(!isDarkMode)

  return (
    <div className="container">
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1>VietQR Bulk Generator</h1>
          <p className="subtitle">Tạo hàng loạt mã QR MoMo từ danh sách số điện thoại</p>
        </div>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <button onClick={toggleDarkMode} style={{ background: 'transparent', color: 'var(--text)', fontSize: '1.5rem', padding: '0.5rem' }}>
            {isDarkMode ? '☀️' : '🌙'}
          </button>
        </div>
      </header>

      <section className="card">
        <div className="input-group">
          <div className="input-field">
            <label htmlFor="numbers">Danh sách số điện thoại (Mỗi số 1 dòng hoặc cách nhau bởi dấu phẩy)</label>
            <textarea
              id="numbers"
              placeholder="0901234567&#10;0907654321"
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
          </div>
          <div className="input-row">
            <div className="input-field">
              <label htmlFor="amount">Số tiền (VNĐ)</label>
              <input
                id="amount"
                type="number"
                value={amount}
                onChange={(e) => setAmount(parseInt(e.target.value) || 0)}
              />
            </div>
            <button onClick={handleGenerate} style={{ height: '45px' }}>
              ⚡ Tạo mã QR
            </button>
          </div>
        </div>
      </section>

      {phoneNumbers.length > 0 && (
        <section>
          <div className="actions" style={{ marginBottom: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
              <h2>Kết quả ({phoneNumbers.length} mã)</h2>
              <div className="mode-toggle">
                <button 
                  className={`mode-btn ${viewMode === 'grid' ? 'active' : ''}`}
                  onClick={() => setViewMode('grid')}
                >
                  Grid View
                </button>
                <button 
                  className={`mode-btn ${viewMode === 'slider' ? 'active' : ''}`}
                  onClick={() => setViewMode('slider')}
                >
                  Slider
                </button>
              </div>
            </div>
            <button onClick={() => window.print()} style={{ background: '#333' }}>
              🖨️ In / Lưu PDF
            </button>
          </div>

          {viewMode === 'grid' ? (
            <div className="qr-grid">
              {phoneNumbers.map((phone, index) => (
                <QRCard key={index} phone={phone} amount={amount} />
              ))}
            </div>
          ) : (
            <div className="slider-container">
              <QRCard 
                phone={phoneNumbers[currentIndex]} 
                amount={amount} 
                className="focused" 
              />
              <div className="slider-controls">
                <button 
                  className="nav-btn" 
                  onClick={() => setCurrentIndex(prev => Math.max(0, prev - 1))}
                  disabled={currentIndex === 0}
                >
                  ←
                </button>
                <span className="current-info">
                  {currentIndex + 1} / {phoneNumbers.length}
                </span>
                <button 
                  className="nav-btn" 
                  onClick={() => setCurrentIndex(prev => Math.min(phoneNumbers.length - 1, prev + 1))}
                  disabled={currentIndex === phoneNumbers.length - 1}
                >
                  →
                </button>
              </div>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                Mẹo: Sử dụng phím mũi tên <b>←</b> và <b>→</b> trên bàn phím để chuyển đổi
              </p>
            </div>
          )}
        </section>
      )}

      <footer style={{ marginTop: '4rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
        <p>Built with ❤️ for MoMo users | VietQR © 2026</p>
      </footer>
    </div>
  )
}

function QRCard({ phone, amount, className = '' }: { phone: string, amount: number, className?: string }) {
  const [loading, setLoading] = useState(true)
  const qrUrl = `https://img.vietqr.io/image/momo-${phone}-compact.png?amount=${amount}`

  useEffect(() => {
    setLoading(true)
  }, [phone, amount])

  return (
    <div className={`qr-card ${className}`}>
      <div className="qr-image-container">
        {loading && (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
            <div className="loading-spinner"></div>
          </div>
        )}
        <img
          src={qrUrl}
          alt={`QR ${phone}`}
          onLoad={() => setLoading(false)}
          style={{ display: loading ? 'none' : 'block' }}
        />
      </div>
      <div className="phone-number">{phone}</div>
      <div className="amount-label">{amount.toLocaleString()} VNĐ</div>
    </div>
  )
}


export default App
