'use client'

import { useEffect, useState } from 'react'
import { Save, Loader2 } from 'lucide-react'

interface SiteConfigForm {
  siteName: string
  tagline: string
  social: {
    instagram: string
    facebook: string
    twitter: string
    youtube: string
  }
}

export default function SettingsPage() {
  const [form, setForm] = useState<SiteConfigForm>({
    siteName: 'Foz.Foco',
    tagline: 'Notícias de Foz do Iguaçu',
    social: { instagram: '', facebook: '', twitter: '', youtube: '' },
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState<{ msg: string; err?: boolean } | null>(null)

  function showToast(msg: string, err = false) {
    setToast({ msg, err })
    setTimeout(() => setToast(null), 3000)
  }

  useEffect(() => {
    fetch('/api/admin/settings')
      .then((r) => r.json())
      .then((data) => {
        if (data) {
          setForm({
            siteName: data.siteName || 'Foz.Foco',
            tagline: data.tagline || '',
            social: {
              instagram: data.social?.instagram || '',
              facebook: data.social?.facebook || '',
              twitter: data.social?.twitter || '',
              youtube: data.social?.youtube || '',
            },
          })
        }
      })
      .finally(() => setLoading(false))
  }, [])

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (res.ok) {
        showToast('Configurações salvas!')
      } else {
        showToast('Erro ao salvar', true)
      }
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '80px' }}>
        <Loader2 size={28} className="animate-spin" style={{ color: 'var(--adm-muted)' }} />
      </div>
    )
  }

  return (
    <div style={{ maxWidth: '680px', margin: '0 auto' }}>
      {/* Toast */}
      {toast && (
        <div style={{
          position: 'fixed', top: '20px', right: '20px', zIndex: 9999,
          background: toast.err ? '#FF3B3020' : '#34C75920',
          border: `1px solid ${toast.err ? '#FF3B30' : '#34C759'}`,
          color: toast.err ? '#FF3B30' : '#34C759',
          padding: '10px 18px', borderRadius: '10px', fontSize: '13px', fontWeight: 600,
        }}>
          {toast.msg}
        </div>
      )}

      {/* Header */}
      <div style={{ marginBottom: '22px' }}>
        <h1 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--adm-text)', margin: 0 }}>Configurações</h1>
        <p style={{ fontSize: '12px', color: 'var(--adm-muted)', marginTop: '2px' }}>Gerencie as informações do site</p>
      </div>

      <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {/* Informações do site */}
        <div className="adm-panel">
          <h2 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--adm-text)', marginBottom: '18px' }}>
            Informações do Site
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>
              <label className="adm-label">Nome do Site</label>
              <input
                className="adm-input"
                value={form.siteName}
                onChange={(e) => setForm((f) => ({ ...f, siteName: e.target.value }))}
              />
            </div>
            <div>
              <label className="adm-label">Tagline</label>
              <input
                className="adm-input"
                value={form.tagline}
                onChange={(e) => setForm((f) => ({ ...f, tagline: e.target.value }))}
                placeholder="Notícias de Foz do Iguaçu"
              />
            </div>
          </div>
        </div>

        {/* Redes sociais */}
        <div className="adm-panel">
          <h2 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--adm-text)', marginBottom: '18px' }}>
            Redes Sociais
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {(['instagram', 'facebook', 'twitter', 'youtube'] as const).map((network) => (
              <div key={network}>
                <label className="adm-label" style={{ textTransform: 'capitalize' }}>{network}</label>
                <input
                  className="adm-input"
                  value={form.social[network]}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      social: { ...f.social, [network]: e.target.value },
                    }))
                  }
                  placeholder={`https://${network}.com/fozfoco`}
                />
              </div>
            ))}
          </div>
        </div>

        <div>
          <button type="submit" className="adm-btn-primary" disabled={saving}>
            {saving
              ? <Loader2 size={14} className="animate-spin" style={{ marginRight: '6px' }} />
              : <Save size={14} style={{ marginRight: '6px' }} />}
            Salvar Configurações
          </button>
        </div>
      </form>
    </div>
  )
}
