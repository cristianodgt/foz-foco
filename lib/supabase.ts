import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export async function uploadImage(
  file: File,
  bucket: string = 'fozfoco',
  folder: string = 'posts'
): Promise<string> {
  const ext = file.name.split('.').pop()
  const filename = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`

  const { error } = await supabase.storage.from(bucket).upload(filename, file, {
    cacheControl: '3600',
    upsert: false,
  })

  if (error) throw new Error(`Upload falhou: ${error.message}`)

  const { data } = supabase.storage.from(bucket).getPublicUrl(filename)
  return data.publicUrl
}

export async function uploadImageFromBuffer(
  buffer: Buffer,
  filename: string,
  mimeType: string,
  bucket: string = 'fozfoco',
  folder: string = 'posts'
): Promise<string> {
  const ext = filename.split('.').pop()
  const path = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`

  const { error } = await supabase.storage.from(bucket).upload(path, buffer, {
    contentType: mimeType,
    cacheControl: '3600',
    upsert: false,
  })

  if (error) throw new Error(`Upload falhou: ${error.message}`)

  const { data } = supabase.storage.from(bucket).getPublicUrl(path)
  return data.publicUrl
}

export async function deleteImage(url: string, bucket: string = 'fozfoco'): Promise<void> {
  const path = url.split(`${bucket}/`)[1]
  if (!path) return
  await supabase.storage.from(bucket).remove([path])
}
