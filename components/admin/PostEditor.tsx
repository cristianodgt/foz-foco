'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import Link from '@tiptap/extension-link'
import {
  Bold, Italic, Underline as UnderlineIcon, Heading2, Heading3,
  List, ListOrdered, Link as LinkIcon, Image as ImageIcon, Undo, Redo
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface PostEditorProps {
  content: string
  onChange: (html: string) => void
}

function ToolbarButton({
  onClick, active, disabled, children, title
}: {
  onClick: () => void; active?: boolean; disabled?: boolean; children: React.ReactNode; title?: string
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={cn(
        'p-2 rounded-lg transition-colors',
        active ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-100',
        disabled && 'opacity-30 cursor-not-allowed'
      )}
    >
      {children}
    </button>
  )
}

export function PostEditor({ content, onChange }: PostEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Image.configure({ inline: false, allowBase64: true }),
      Link.configure({ openOnClick: false, HTMLAttributes: { class: 'text-blue-600 underline' } }),
    ],
    content,
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
    editorProps: {
      attributes: {
        class: 'tiptap prose-content min-h-[300px] p-4 focus:outline-none',
      },
    },
  })

  if (!editor) return <div className="h-64 bg-gray-50 rounded-xl animate-pulse" />

  async function insertImage() {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'image/*'
    input.onchange = async () => {
      const file = input.files?.[0]
      if (!file) return
      const formData = new FormData()
      formData.append('file', file)
      formData.append('folder', 'content')
      try {
        const res = await fetch('/api/upload', { method: 'POST', body: formData })
        const data = await res.json()
        if (data.url) {
          editor.chain().focus().setImage({ src: data.url }).run()
        }
      } catch {
        alert('Erro ao fazer upload da imagem')
      }
    }
    input.click()
  }

  function setLink() {
    const url = prompt('URL do link:')
    if (url) {
      editor.chain().focus().setLink({ href: url }).run()
    }
  }

  return (
    <div className="border rounded-xl overflow-hidden bg-white">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-1 p-2 border-b bg-gray-50">
        <ToolbarButton onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive('bold')} title="Negrito">
          <Bold className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive('italic')} title="Itálico">
          <Italic className="w-4 h-4" />
        </ToolbarButton>
        <div className="w-px h-5 bg-gray-300 mx-1" />
        <ToolbarButton onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} active={editor.isActive('heading', { level: 2 })} title="Título H2">
          <Heading2 className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} active={editor.isActive('heading', { level: 3 })} title="Título H3">
          <Heading3 className="w-4 h-4" />
        </ToolbarButton>
        <div className="w-px h-5 bg-gray-300 mx-1" />
        <ToolbarButton onClick={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive('bulletList')} title="Lista">
          <List className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleOrderedList().run()} active={editor.isActive('orderedList')} title="Lista Numerada">
          <ListOrdered className="w-4 h-4" />
        </ToolbarButton>
        <div className="w-px h-5 bg-gray-300 mx-1" />
        <ToolbarButton onClick={setLink} active={editor.isActive('link')} title="Inserir Link">
          <LinkIcon className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton onClick={insertImage} title="Inserir Imagem">
          <ImageIcon className="w-4 h-4" />
        </ToolbarButton>
        <div className="flex-1" />
        <ToolbarButton onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()} title="Desfazer">
          <Undo className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()} title="Refazer">
          <Redo className="w-4 h-4" />
        </ToolbarButton>
      </div>

      {/* Editor */}
      <EditorContent editor={editor} />
    </div>
  )
}
