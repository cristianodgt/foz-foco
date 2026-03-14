'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import {
  Plus, Edit2, Trash2, Loader2, Eye, MousePointer, ToggleLeft, ToggleRight
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { useToast } from '@/hooks/use-toast'
import { calculateCTR, formatNumber, formatDateShort } from '@/lib/utils'
import type { Ad } from '@/types'

const emptyForm = {
  title: '', client: '', type: 'NATIVE', position: 'FEED_BETWEEN',
  imageUrl: '', targetUrl: '', frequency: 5, active: true,
  startsAt: new Date().toISOString().split('T')[0],
  endsAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
}

export default function CampaignsPage() {
  const [ads, setAds] = useState<Ad[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState<Ad | null>(null)
  const [form, setForm] = useState({ ...emptyForm })
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const { toast } = useToast()

  const fetchAds = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/ads')
      const data = await res.json()
      setAds(Array.isArray(data) ? data : [])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchAds() }, [])

  function openNew() {
    setEditing(null)
    setForm({ ...emptyForm })
    setDialogOpen(true)
  }

  function openEdit(ad: Ad) {
    setEditing(ad)
    setForm({
      title: ad.title, client: ad.client, type: ad.type, position: ad.position,
      imageUrl: ad.imageUrl, targetUrl: ad.targetUrl, frequency: ad.frequency,
      active: ad.active,
      startsAt: new Date(ad.startsAt).toISOString().split('T')[0],
      endsAt: new Date(ad.endsAt).toISOString().split('T')[0],
    })
    setDialogOpen(true)
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('folder', 'ads')
      const res = await fetch('/api/upload', { method: 'POST', body: formData })
      const data = await res.json()
      if (data.url) setForm((f) => ({ ...f, imageUrl: data.url }))
    } finally {
      setUploading(false)
    }
  }

  async function handleSave() {
    if (!form.title || !form.imageUrl || !form.targetUrl) {
      toast({ title: 'Preencha todos os campos obrigatórios', variant: 'destructive' })
      return
    }
    setSaving(true)
    try {
      const url = editing ? `/api/ads/${editing.id}` : '/api/ads'
      const method = editing ? 'PUT' : 'POST'
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (res.ok) {
        toast({ title: editing ? 'Anúncio atualizado' : 'Anúncio criado!' })
        setDialogOpen(false)
        fetchAds()
      }
    } finally {
      setSaving(false)
    }
  }

  async function toggleActive(ad: Ad) {
    await fetch(`/api/ads/${ad.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ active: !ad.active }),
    })
    fetchAds()
  }

  async function deleteAd(id: string) {
    if (!confirm('Deletar este anúncio?')) return
    await fetch(`/api/ads/${id}`, { method: 'DELETE' })
    setAds((prev) => prev.filter((a) => a.id !== id))
    toast({ title: 'Anúncio deletado' })
  }

  const AD_POSITION_LABELS: Record<string, string> = {
    FEED_BETWEEN: 'Entre Posts', FEED_TOP: 'Topo do Feed',
    POST_DETAIL: 'Detalhe do Post', SIDEBAR: 'Sidebar'
  }
  const AD_TYPE_LABELS: Record<string, string> = {
    BANNER: 'Banner', NATIVE: 'Nativo', INTERSTITIAL: 'Interstitial'
  }

  return (
    <div className="space-y-5 max-w-6xl">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Anúncios</h1>
        <Button onClick={openNew}><Plus className="w-4 h-4 mr-2" /> Novo Anúncio</Button>
      </div>

      <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex justify-center py-16"><Loader2 className="w-8 h-8 animate-spin text-gray-400" /></div>
        ) : ads.length === 0 ? (
          <div className="text-center py-16 text-gray-400">Nenhum anúncio cadastrado</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  {['Anúncio', 'Tipo/Posição', 'Impressões', 'Cliques', 'CTR', 'Período', 'Status', ''].map((h) => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y">
                {ads.map((ad) => (
                  <tr key={ad.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        {ad.imageUrl && (
                          <div className="relative w-12 h-10 rounded overflow-hidden flex-shrink-0">
                            <Image src={ad.imageUrl} alt={ad.title} fill className="object-cover" />
                          </div>
                        )}
                        <div>
                          <p className="font-medium text-sm text-gray-900 line-clamp-1">{ad.title}</p>
                          <p className="text-xs text-gray-500">{ad.client}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-xs space-y-0.5">
                        <p className="font-medium text-gray-700">{AD_TYPE_LABELS[ad.type]}</p>
                        <p className="text-gray-400">{AD_POSITION_LABELS[ad.position]}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm flex items-center gap-1 text-gray-600">
                        <Eye className="w-3.5 h-3.5" /> {formatNumber(ad.impressions)}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm flex items-center gap-1 text-gray-600">
                        <MousePointer className="w-3.5 h-3.5" /> {formatNumber(ad.clicks)}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm font-medium text-blue-600">
                        {calculateCTR(ad.clicks, ad.impressions)}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-xs text-gray-500">
                        <p>{formatDateShort(ad.startsAt)}</p>
                        <p>{formatDateShort(ad.endsAt)}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant={ad.active ? 'success' : 'secondary'}>
                        {ad.active ? 'Ativo' : 'Inativo'}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <button onClick={() => toggleActive(ad)} className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Ativar/Desativar">
                          {ad.active ? <ToggleRight className="w-4 h-4 text-green-600" /> : <ToggleLeft className="w-4 h-4" />}
                        </button>
                        <button onClick={() => openEdit(ad)} className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button onClick={() => deleteAd(ad.id)} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editing ? 'Editar Anúncio' : 'Novo Anúncio'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Título *</Label>
                <Input value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} />
              </div>
              <div className="space-y-1.5">
                <Label>Cliente *</Label>
                <Input value={form.client} onChange={(e) => setForm((f) => ({ ...f, client: e.target.value }))} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Tipo</Label>
                <Select value={form.type} onValueChange={(v) => setForm((f) => ({ ...f, type: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="NATIVE">Nativo</SelectItem>
                    <SelectItem value="BANNER">Banner</SelectItem>
                    <SelectItem value="INTERSTITIAL">Interstitial</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Posição</Label>
                <Select value={form.position} onValueChange={(v) => setForm((f) => ({ ...f, position: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="FEED_BETWEEN">Entre Posts</SelectItem>
                    <SelectItem value="FEED_TOP">Topo do Feed</SelectItem>
                    <SelectItem value="POST_DETAIL">Detalhe do Post</SelectItem>
                    <SelectItem value="SIDEBAR">Sidebar</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>URL de Destino *</Label>
              <Input placeholder="https://" value={form.targetUrl} onChange={(e) => setForm((f) => ({ ...f, targetUrl: e.target.value }))} />
            </div>
            <div className="space-y-1.5">
              <Label>Imagem *</Label>
              {form.imageUrl ? (
                <div className="relative h-32 rounded-lg overflow-hidden">
                  <Image src={form.imageUrl} alt="Ad preview" fill className="object-cover" />
                  <button onClick={() => setForm((f) => ({ ...f, imageUrl: '' }))} className="absolute top-2 right-2 bg-black/60 text-white rounded-full p-1">
                    <Loader2 className="w-3 h-3" />
                  </button>
                </div>
              ) : (
                <label className="flex items-center justify-center h-24 border-2 border-dashed rounded-lg cursor-pointer hover:border-blue-400 transition-colors">
                  {uploading ? <Loader2 className="w-5 h-5 animate-spin" /> : <span className="text-sm text-gray-500">Clique para upload</span>}
                  <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                </label>
              )}
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <Label>Frequência</Label>
                <Input type="number" min={1} value={form.frequency} onChange={(e) => setForm((f) => ({ ...f, frequency: parseInt(e.target.value) }))} />
              </div>
              <div className="space-y-1.5">
                <Label>Início</Label>
                <Input type="date" value={form.startsAt} onChange={(e) => setForm((f) => ({ ...f, startsAt: e.target.value }))} />
              </div>
              <div className="space-y-1.5">
                <Label>Fim</Label>
                <Input type="date" value={form.endsAt} onChange={(e) => setForm((f) => ({ ...f, endsAt: e.target.value }))} />
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Switch checked={form.active} onCheckedChange={(v) => setForm((f) => ({ ...f, active: v }))} />
              <Label>Ativo</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancelar</Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
              {editing ? 'Salvar' : 'Criar Anúncio'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
