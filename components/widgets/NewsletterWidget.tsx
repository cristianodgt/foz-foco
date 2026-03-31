'use client'

import { useState } from 'react'
import { Mail } from 'lucide-react'

export function NewsletterWidget() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email) return
    setStatus('loading')
    // TODO: conectar com API de newsletter
    await new Promise(r => setTimeout(r, 800))
    setStatus('success')
    setEmail('')
  }

  return (
    <div className="widget" style={{ background: 'var(--color-brand)', borderRadius: 10, padding: '18px 16px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
        <Mail size={16} color="#fff" />
        <h3 style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#fff' }}>
          Fique por dentro
        </h3>
      </div>
      <p style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.85)', lineHeight: 1.5, marginBottom: 14 }}>
        Receba as principais notícias de Foz do Iguaçu direto no seu e-mail.
      </p>

      {status === 'success' ? (
        <p style={{ fontSize: '0.85rem', fontWeight: 600, color: '#fff', textAlign: 'center', padding: '10px 0' }}>
          Obrigado! Você está inscrito.
        </p>
      ) : (
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <input
            type="email"
            placeholder="Seu melhor e-mail"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            style={{
              width: '100%',
              padding: '9px 12px',
              borderRadius: 6,
              border: 'none',
              fontSize: '0.825rem',
              outline: 'none',
              background: 'rgba(255,255,255,0.95)',
              color: '#1a1a1a',
              boxSizing: 'border-box'
            }}
          />
          <button
            type="submit"
            disabled={status === 'loading'}
            style={{
              padding: '9px',
              borderRadius: 6,
              border: '2px solid rgba(255,255,255,0.6)',
              background: 'transparent',
              color: '#fff',
              fontWeight: 700,
              fontSize: '0.8rem',
              cursor: 'pointer',
              letterSpacing: '0.05em'
            }}
          >
            {status === 'loading' ? 'Inscrevendo...' : 'Inscrever-se'}
          </button>
        </form>
      )}
    </div>
  )
}
