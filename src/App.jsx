import { useState } from 'react'

export default function App() {
  return (
    <div className="min-h-screen bg-slate-900 text-white p-8 flex flex-col items-center justify-center">
      <div className="max-w-md w-full bg-slate-800 p-6 rounded-2xl shadow-xl border border-slate-700">
        <h1 className="text-2xl font-bold text-emerald-400 mb-2">
          Rental & Payment Manager
        </h1>
        <p className="text-slate-300 text-sm mb-4">
          Tailwind CSS is configured and working!
        </p>
        <button className="w-full bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-semibold py-2 px-4 rounded-lg transition-colors">
          Ready to build features
        </button>
      </div>
    </div>
  )
}