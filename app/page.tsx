'use client'

import { useState } from 'react'

const screens = [
  'Login / Autenticação', 'Dashboard', 'Agenda', 'Ficha da Criança',
  'Relatório de Sessão', 'Painel de Evolução', 'Aprovação de Relatórios',
  'PEI', 'Área do Responsável', 'Configurações', 'Outro'
]

const profileOptions = ['Supervisor', 'Terapeuta', 'Responsável', 'Escola', 'Recepção']

const bugExamples = [
  {
    type: 'bug',
    title: 'Relatório de sessão não salva quando inclui emoji',
    reporter: 'Juliana Mendes (TO)',
    screen: 'Relatório de Sessão',
    severity: 'P1',
    profiles: ['Terapeuta'],
    description: 'Ao tentar salvar um relatório de sessão que contém emojis no campo de observações, o sistema exibe erro e não salva o conteúdo.',
    steps: '1. Abrir uma sessão existente\n2. Clicar em "Novo Relatório"\n3. Adicionar um emoji (😊) no campo de observações\n4. Clicar em "Salvar"',
    expected: 'O relatório deveria ser salvo normalmente, com o emoji preservado.',
    actual: 'O botão de salvar fica em loading infinito. Após recarregar, dados perdidos.',
    device: 'iPad Pro 11", Safari 17.2'
  },
  {
    type: 'feature',
    title: 'Adicionar campo de "Lição de casa" no relatório de sessão',
    reporter: 'Equipe de Terapeutas',
    screen: 'Relatório de Sessão',
    severity: 'P2',
    profiles: ['Terapeuta', 'Responsável'],
    description: 'Gostaríamos de ter um campo específico para registrar atividades que a família deve fazer em casa entre as sessões.',
    steps: '',
    expected: 'Um campo separado "Atividades para Casa" que apareça destacado para os pais.',
    actual: '',
    device: ''
  }
]

export default function Home() {
  const [formData, setFormData] = useState({
    type: 'bug',
    title: '',
    reporter: '',
    screen: '',
    severity: 'P1',
    profiles: [] as string[],
    description: '',
    steps: '',
    expected: '',
    actual: '',
    device: ''
  })
  
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [ticketUrl, setTicketUrl] = useState('')
  const [errorMsg, setErrorMsg] = useState('')

  const handleProfileToggle = (profile: string) => {
    setFormData(prev => ({
      ...prev,
      profiles: prev.profiles.includes(profile)
        ? prev.profiles.filter(p => p !== profile)
        : [...prev.profiles, profile]
    }))
  }

  const fillExample = () => {
    const example = bugExamples[Math.floor(Math.random() * bugExamples.length)]
    setFormData({
      ...example,
      profiles: example.profiles
    })
  }

  const clearForm = () => {
    setFormData({
      type: 'bug',
      title: '',
      reporter: '',
      screen: '',
      severity: 'P1',
      profiles: [],
      description: '',
      steps: '',
      expected: '',
      actual: '',
      device: ''
    })
    setStatus('idle')
    setErrorMsg('')
  }

  const submitTicket = async () => {
    if (!formData.title) {
      setErrorMsg('Por favor, preencha o título.')
      return
    }
    if (!formData.description) {
      setErrorMsg('Por favor, preencha a descrição.')
      return
    }

    setStatus('loading')
    setErrorMsg('')

    try {
      const response = await fetch('/api/ticket', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      const data = await response.json()

      if (data.success) {
        setStatus('success')
        setTicketUrl(data.url || '')
      } else {
        throw new Error(data.error || 'Erro ao criar ticket')
      }
    } catch (error: any) {
      setStatus('error')
      setErrorMsg(error.message || 'Erro ao criar ticket. Tente novamente.')
    }
  }

  if (status === 'success') {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="bg-white rounded-3xl p-8 shadow-sm text-center max-w-md w-full">
          <div className="w-20 h-20 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce-in">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-serif mb-2">Ticket Criado!</h2>
          <p className="text-gray-500 mb-6">Seu ticket foi adicionado ao Notion</p>
          
          {ticketUrl && (
            <a 
              href={ticketUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-black text-white px-6 py-3 rounded-full font-semibold mb-4 hover:bg-gray-800 transition"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M4 4h10v2H6v12h12v-8h2v10H4V4zm12 0h4v4h-2V6.4l-7.3 7.3-1.4-1.4L16.6 6H14V4z"/>
              </svg>
              Ver no Notion
            </a>
          )}
          
          <div className="flex gap-3 justify-center mt-4">
            <button
              onClick={clearForm}
              className="px-6 py-3 bg-mint text-white rounded-full font-semibold hover:opacity-90 transition"
            >
              + Novo Ticket
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen p-4 sm:p-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-6 pt-4">
          <div className="font-serif text-lg mb-1">Casa do <span className="text-mint">Urso</span></div>
          <h1 className="text-2xl sm:text-3xl font-serif">Reportar Bug ou Melhoria</h1>
          <p className="text-gray-500 text-sm mt-1">Ajude-nos a melhorar o sistema</p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-3xl p-6 shadow-sm space-y-6">
          
          {/* Type Selection */}
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setFormData(prev => ({ ...prev, type: 'bug' }))}
              className={`p-4 rounded-2xl border-2 transition flex flex-col items-center gap-2 ${
                formData.type === 'bug' 
                  ? 'border-coral bg-red-50' 
                  : 'border-gray-200 hover:border-coral/50'
              }`}
            >
              <span className="text-2xl">🐛</span>
              <span className="font-semibold">Bug</span>
            </button>
            <button
              type="button"
              onClick={() => setFormData(prev => ({ ...prev, type: 'feature' }))}
              className={`p-4 rounded-2xl border-2 transition flex flex-col items-center gap-2 ${
                formData.type === 'feature' 
                  ? 'border-purple bg-purple-50' 
                  : 'border-gray-200 hover:border-purple/50'
              }`}
            >
              <span className="text-2xl">✨</span>
              <span className="font-semibold">Melhoria</span>
            </button>
          </div>

          {/* Title */}
          <div>
            <label className="block text-sm font-semibold mb-2">Título *</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-mint focus:outline-none transition"
              placeholder="Resumo curto do problema ou sugestão"
            />
          </div>

          {/* Reporter & Screen */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold mb-2">Reportado por</label>
              <input
                type="text"
                value={formData.reporter}
                onChange={(e) => setFormData(prev => ({ ...prev, reporter: e.target.value }))}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-mint focus:outline-none transition"
                placeholder="Seu nome"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">Tela</label>
              <select
                value={formData.screen}
                onChange={(e) => setFormData(prev => ({ ...prev, screen: e.target.value }))}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-mint focus:outline-none transition bg-white"
              >
                <option value="">Selecione...</option>
                {screens.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>

          {/* Severity (for bugs) */}
          {formData.type === 'bug' && (
            <div>
              <label className="block text-sm font-semibold mb-2">Gravidade</label>
              <div className="flex flex-wrap gap-2">
                {[
                  { value: 'P0', label: 'P0 — Crítico', bg: 'bg-red-500' },
                  { value: 'P1', label: 'P1 — Alto', bg: 'bg-orange-500' },
                  { value: 'P2', label: 'P2 — Médio', bg: 'bg-yellow-400' },
                  { value: 'P3', label: 'P3 — Baixo', bg: 'bg-green-500' },
                ].map(sev => (
                  <button
                    key={sev.value}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, severity: sev.value }))}
                    className={`px-4 py-2 rounded-full text-sm font-medium border-2 transition ${
                      formData.severity === sev.value
                        ? `${sev.bg} border-transparent text-white ${sev.value === 'P2' ? '!text-gray-900' : ''}`
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    {sev.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Profiles */}
          <div>
            <label className="block text-sm font-semibold mb-2">Perfis Afetados</label>
            <div className="flex flex-wrap gap-2">
              {profileOptions.map(profile => (
                <button
                  key={profile}
                  type="button"
                  onClick={() => handleProfileToggle(profile)}
                  className={`px-4 py-2 rounded-full text-sm font-medium border-2 transition ${
                    formData.profiles.includes(profile)
                      ? 'bg-sky border-sky text-white'
                      : 'border-gray-200 hover:border-sky/50'
                  }`}
                >
                  {profile}
                </button>
              ))}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold mb-2">Descrição *</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-mint focus:outline-none transition min-h-24 resize-y"
              placeholder="Descreva o problema ou sugestão em detalhes..."
            />
          </div>

          {/* Steps (for bugs) */}
          {formData.type === 'bug' && (
            <div>
              <label className="block text-sm font-semibold mb-2">Passos para Reproduzir</label>
              <textarea
                value={formData.steps}
                onChange={(e) => setFormData(prev => ({ ...prev, steps: e.target.value }))}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-mint focus:outline-none transition min-h-20 resize-y"
                placeholder={"1. Entrar na tela X\n2. Clicar no botão Y\n3. Ver o erro Z"}
              />
            </div>
          )}

          {/* Expected */}
          <div>
            <label className="block text-sm font-semibold mb-2">
              {formData.type === 'bug' ? 'Comportamento Esperado' : 'Como deveria funcionar?'}
            </label>
            <textarea
              value={formData.expected}
              onChange={(e) => setFormData(prev => ({ ...prev, expected: e.target.value }))}
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-mint focus:outline-none transition min-h-20 resize-y"
              placeholder="O que deveria acontecer?"
            />
          </div>

          {/* Actual (for bugs) */}
          {formData.type === 'bug' && (
            <div>
              <label className="block text-sm font-semibold mb-2">Comportamento Atual</label>
              <textarea
                value={formData.actual}
                onChange={(e) => setFormData(prev => ({ ...prev, actual: e.target.value }))}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-mint focus:outline-none transition min-h-20 resize-y"
                placeholder="O que está acontecendo de errado?"
              />
            </div>
          )}

          {/* Device */}
          <div>
            <label className="block text-sm font-semibold mb-2">Dispositivo / Navegador</label>
            <input
              type="text"
              value={formData.device}
              onChange={(e) => setFormData(prev => ({ ...prev, device: e.target.value }))}
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-mint focus:outline-none transition"
              placeholder="Ex: iPhone 14 Safari, Chrome Windows"
            />
          </div>

          {/* Error Message */}
          {errorMsg && (
            <div className="p-4 bg-red-50 border-2 border-red-200 rounded-xl text-red-600 text-sm">
              {errorMsg}
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-wrap gap-3 pt-2">
            <button
              type="button"
              onClick={clearForm}
              className="px-5 py-3 rounded-full border-2 border-gray-200 text-gray-500 font-semibold hover:border-gray-300 transition"
            >
              Limpar
            </button>
            <button
              type="button"
              onClick={fillExample}
              className="px-5 py-3 rounded-full border-2 border-purple text-purple font-semibold hover:bg-purple/5 transition"
            >
              Exemplo
            </button>
            <button
              type="button"
              onClick={submitTicket}
              disabled={status === 'loading'}
              className="flex-1 min-w-48 px-6 py-3 rounded-full bg-gradient-to-r from-mint to-emerald-500 text-white font-semibold hover:opacity-90 transition disabled:opacity-70 flex items-center justify-center gap-2"
            >
              {status === 'loading' ? (
                <>
                  <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                  </svg>
                  Enviando...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/>
                  </svg>
                  Enviar Ticket
                </>
              )}
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-6 text-gray-400 text-sm">
          Casa do Urso • Sistema de Tickets
        </div>
      </div>
    </div>
  )
}
