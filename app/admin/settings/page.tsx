'use client'

import { useEffect, useState } from 'react'
import { Save, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useToast } from '@/hooks/use-toast'

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
  const { toast } = useToast()

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
        toast({ title: 'Configurações salvas!' })
      } else {
        toast({ title: 'Erro ao salvar', variant: 'destructive' })
      }
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-gray-400" /></div>
  }

  return (
    <div className="max-w-2xl space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Configurações</h1>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Site info */}
        <div className="bg-white rounded-xl border shadow-sm p-6 space-y-5">
          <h2 className="font-semibold text-gray-900">Informações do Site</h2>
          <div className="space-y-2">
            <Label>Nome do Site</Label>
            <Input
              value={form.siteName}
              onChange={(e) => setForm((f) => ({ ...f, siteName: e.target.value }))}
            />
          </div>
          <div className="space-y-2">
            <Label>Tagline</Label>
            <Input
              value={form.tagline}
              onChange={(e) => setForm((f) => ({ ...f, tagline: e.target.value }))}
              placeholder="Notícias de Foz do Iguaçu"
            />
          </div>
        </div>

        {/* Social media */}
        <div className="bg-white rounded-xl border shadow-sm p-6 space-y-5">
          <h2 className="font-semibold text-gray-900">Redes Sociais</h2>
          {(['instagram', 'facebook', 'twitter', 'youtube'] as const).map((network) => (
            <div key={network} className="space-y-2">
              <Label className="capitalize">{network}</Label>
              <Input
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

        <Button type="submit" disabled={saving} className="w-full sm:w-auto">
          {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
          Salvar Configurações
        </Button>
      </form>
    </div>
  )
}
