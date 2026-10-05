import { useState, useEffect } from 'react'

export default function App() {
  // Carregar dados do LocalStorage ou usar padrões
  const [properties, setProperties] = useState(() => {
    const saved = localStorage.getItem('rental_properties')
    return saved ? JSON.parse(saved) : [
      { id: '1', name: 'Casa de Praia', address: 'Florianópolis, SC' }
    ]
  })

  const [bookings, setBookings] = useState(() => {
    const saved = localStorage.getItem('rental_bookings')
    return saved ? JSON.parse(saved) : []
  })

  // Estados dos formulários
  const [newPropName, setNewPropName] = useState('')
  const [newPropAddress, setNewPropAddress] = useState('')

  const [selectedProp, setSelectedProp] = useState(properties[0]?.id || '')
  const [guestName, setGuestName] = useState('')
  const [checkIn, setCheckIn] = useState('')
  const [checkOut, setCheckOut] = useState('')
  const [totalAmount, setTotalAmount] = useState('')
  const [depositAmount, setDepositAmount] = useState('')
  const [paymentMethod, setPaymentMethod] = useState('Pix')

  // Guardar no LocalStorage sempre que houver alterações
  useEffect(() => {
    localStorage.setItem('rental_properties', JSON.stringify(properties))
  }, [properties])

  useEffect(() => {
    localStorage.setItem('rental_bookings', JSON.stringify(bookings))
  }, [bookings])

  // Funções de envio
  const handleAddProperty = (e) => {
    e.preventDefault()
    if (!newPropName.trim()) return
    const newProp = {
      id: Date.now().toString(),
      name: newPropName,
      address: newPropAddress
    }
    setProperties([...properties, newProp])
    if (!selectedProp) setSelectedProp(newProp.id)
    setNewPropName('')
    setNewPropAddress('')
  }

  const handleAddBooking = (e) => {
    e.preventDefault()
    if (!selectedProp || !guestName || !totalAmount) return

    const newBooking = {
      id: Date.now().toString(),
      propertyId: selectedProp,
      guestName,
      checkIn,
      checkOut,
      totalAmount: parseFloat(totalAmount),
      depositAmount: parseFloat(depositAmount) || 0,
      depositPaid: false,
      balancePaid: false,
      paymentMethod,
    }

    setBookings([newBooking, ...bookings])
    setGuestName('')
    setCheckIn('')
    setCheckOut('')
    setTotalAmount('')
    setDepositAmount('')
  }

  const toggleDeposit = (id) => {
    setBookings(bookings.map(b => b.id === id ? { ...b, depositPaid: !b.depositPaid } : b))
  }

  const toggleBalance = (id) => {
    setBookings(bookings.map(b => b.id === id ? { ...b, balancePaid: !b.balancePaid } : b))
  }

  const deleteBooking = (id) => {
    setBookings(bookings.filter(b => b.id !== id))
  }

  // Cálculos financeiros
  const totalRevenue = bookings.reduce((sum, b) => {
    let paid = 0
    if (b.depositPaid) paid += b.depositAmount
    if (b.balancePaid) paid += (b.totalAmount - b.depositAmount)
    return sum + paid
  }, 0)

  const pendingRevenue = bookings.reduce((sum, b) => {
    let pending = 0
    if (!b.depositPaid) pending += b.depositAmount
    if (!b.balancePaid) pending += (b.totalAmount - b.depositAmount)
    return sum + pending
  }, 0)

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-8 font-sans">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Cabeçalho */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
          <div>
            <h1 className="text-3xl font-bold text-emerald-400">Gestão de Alugueres e Alojamento</h1>
            <p className="text-slate-400 text-sm">Controlo de propriedades, reservas e pagamentos</p>
          </div>
        </header>

        {/* Resumo Financeiro */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
            <p className="text-slate-400 text-sm font-medium">Total Recebido</p>
            <p className="text-2xl font-bold text-emerald-400 mt-1">
              R$ {totalRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </p>
          </div>
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
            <p className="text-slate-400 text-sm font-medium">Pagamentos Pendentes</p>
            <p className="text-2xl font-bold text-amber-400 mt-1">
              R$ {pendingRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </p>
          </div>
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
            <p className="text-slate-400 text-sm font-medium">Total de Reservas</p>
            <p className="text-2xl font-bold text-slate-100 mt-1">{bookings.length}</p>
          </div>
        </div>

        {/* Formulários */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Adicionar Propriedade */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 h-fit">
            <h2 className="text-lg font-semibold text-slate-200 mb-4">1. Adicionar Imóvel</h2>
            <form onSubmit={handleAddProperty} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Nome do Imóvel</label>
                <input
                  type="text"
                  placeholder="Ex: Chalé na Praia"
                  value={newPropName}
                  onChange={(e) => setNewPropName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Endereço / Localização</label>
                <input
                  type="text"
                  placeholder="Ex: Canasvieiras, Florianópolis"
                  value={newPropAddress}
                  onChange={(e) => setNewPropAddress(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-emerald-500"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium py-2 rounded-lg text-sm transition-colors"
              >
                Guardar Imóvel
              </button>
            </form>
          </div>

          {/* Nova Reserva */}
          <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-xl p-6">
            <h2 className="text-lg font-semibold text-slate-200 mb-4">2. Registar Nova Reserva</h2>
            <form onSubmit={handleAddBooking} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Selecionar Imóvel</label>
                <select
                  value={selectedProp}
                  onChange={(e) => setSelectedProp(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-emerald-500"
                >
                  {properties.map(p => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Nome do Hóspede</label>
                <input
                  type="text"
                  placeholder="Nome completo"
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Data de Entrada (Check-In)</label>
                <input
                  type="date"
                  value={checkIn}
                  onChange={(e) => setCheckIn(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Data de Saída (Check-Out)</label>
                <input
                  type="date"
                  value={checkOut}
                  onChange={(e) => setCheckOut(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Valor Total (R$)</label>
                <input
                  type="number"
                  placeholder="0,00"
                  value={totalAmount}
                  onChange={(e) => setTotalAmount(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Valor do Sinal / Depósito (R$)</label>
                <input
                  type="number"
                  placeholder="0,00"
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Forma de Pagamento</label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-emerald-500"
                >
                  <option value="Pix">Pix</option>
                  <option value="Transferência Bancária">Transferência Bancária</option>
                  <option value="Dinheiro">Dinheiro</option>
                  <option value="Cartão de Crédito">Cartão de Crédito</option>
                </select>
              </div>

              <div className="sm:col-span-2 pt-2">
                <button
                  type="submit"
                  className="w-full bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-semibold py-2 rounded-lg text-sm transition-colors"
                >
                  Guardar Reserva
                </button>
              </div>
            </form>
          </div>

        </div>

        {/* Lista de Reservas */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <h2 className="text-lg font-semibold text-slate-200 mb-4">Reservas e Controlo de Pagamentos</h2>
          
          {bookings.length === 0 ? (
            <p className="text-slate-500 text-sm py-4">Nenhuma reserva registada até ao momento. Adicione uma acima!</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {bookings.map((booking) => {
                const prop = properties.find(p => p.id === booking.propertyId)
                const remaining = booking.totalAmount - booking.depositAmount

                return (
                  <div key={booking.id} className="bg-slate-950 border border-slate-800 rounded-lg p-5 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between">
                        <div>
                          <span className="text-xs font-semibold text-emerald-400 bg-emerald-950/60 border border-emerald-800/50 px-2 py-0.5 rounded">
                            {prop?.name || 'Imóvel'}
                          </span>
                          <h3 className="text-base font-semibold text-slate-100 mt-2">{booking.guestName}</h3>
                        </div>
                        <button
                          onClick={() => deleteBooking(booking.id)}
                          className="text-slate-500 hover:text-red-400 text-xs px-2 py-1 rounded"
                        >
                          Eliminar
                        </button>
                      </div>

                      <p className="text-xs text-slate-400 mt-2">
                        📅 {booking.checkIn || 'A definir'} &rarr; {booking.checkOut || 'A definir'}
                      </p>
                      <p className="text-xs text-slate-400 mt-1">
                        💳 Pagamento: {booking.paymentMethod}
                      </p>

                      <div className="mt-4 pt-3 border-t border-slate-800 flex justify-between text-xs">
                        <span className="text-slate-400">Valor Total:</span>
                        <span className="font-semibold text-slate-200">
                          R$ {booking.totalAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </span>
                      </div>
                    </div>

                    {/* Botões de Controlo de Pagamento */}
                    <div className="mt-4 pt-3 border-t border-slate-800 grid grid-cols-2 gap-2 text-xs">
                      <button
                        onClick={() => toggleDeposit(booking.id)}
                        className={`p-2 rounded-md font-medium border text-center transition-all ${
                          booking.depositPaid
                            ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-300'
                            : 'bg-amber-950/20 border-amber-500/40 text-amber-300 hover:bg-amber-950/40'
                        }`}
                      >
                        Sinal (R$ {booking.depositAmount}): <br />
                        <strong>{booking.depositPaid ? '✓ Pago' : 'Pendente'}</strong>
                      </button>

                      <button
                        onClick={() => toggleBalance(booking.id)}
                        className={`p-2 rounded-md font-medium border text-center transition-all ${
                          booking.balancePaid
                            ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-300'
                            : 'bg-amber-950/20 border-amber-500/40 text-amber-300 hover:bg-amber-950/40'
                        }`}
                      >
                        Restante (R$ {remaining}): <br />
                        <strong>{booking.balancePaid ? '✓ Pago' : 'Pendente'}</strong>
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

      </div>
    </div>
  )
}