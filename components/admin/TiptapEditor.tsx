'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import Link from '@tiptap/extension-link'
import Placeholder from '@tiptap/extension-placeholder'
import {
  Bold, Italic, Heading2, Heading3, List, ListOrdered,
  Quote, Minus, Link2, Image as ImageIcon, Undo, Redo, Code,
} from 'lucide-react'

interface TiptapEditorProps {
  content?: Record<string, unknown>
  onChange: (content: Record<string, unknown>) => void
  placeholder?: string
}

export default function TiptapEditor({
  content,
  onChange,
  placeholder = 'Comece a escrever…',
}: TiptapEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Image.configure({ allowBase64: false, inline: false }),
      Link.configure({ openOnClick: false, autolink: true }),
      Placeholder.configure({ placeholder }),
    ],
    content: content && Object.keys(content).length > 0 ? content : undefined,
    onUpdate({ editor }) {
      onChange(editor.getJSON() as Record<string, unknown>)
    },
    editorProps: {
      attributes: {
        style: [
          'min-height: 400px',
          'outline: none',
          'font-family: var(--font-body)',
          'font-size: 1.1rem',
          'line-height: 1.85',
          'color: var(--text)',
          'padding: 1.25rem',
        ].join(';'),
      },
    },
  })

  if (!editor) return null

  function addImage() {
    const url = window.prompt('URL da imagem:')
    if (url) editor?.chain().focus().setImage({ src: url }).run()
  }

  function setLink() {
    const prev = editor?.getAttributes('link').href
    const url = window.prompt('URL do link:', prev)
    if (url === null) return
    if (url === '') {
      editor?.chain().focus().unsetLink().run()
      return
    }
    editor?.chain().focus().setLink({ href: url }).run()
  }

  const toolbarBtnStyle = (active = false) =>
    ({
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '30px',
      height: '30px',
      border: 'none',
      borderRadius: 'var(--radius-sm)',
      cursor: 'pointer',
      transition: 'all var(--transition)',
      backgroundColor: active ? 'var(--emerald-deep)' : 'transparent',
      color: active ? 'var(--emerald-light)' : 'var(--text-faint)',
      flexShrink: 0,
    } as React.CSSProperties)

  const sep = (
    <div
      style={{
        width: '1px',
        height: '20px',
        backgroundColor: 'var(--border)',
        margin: '0 0.25rem',
        flexShrink: 0,
      }}
    />
  )

  return (
    <div
      style={{
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-md)',
        overflow: 'hidden',
        backgroundColor: 'var(--bg-surface)',
      }}
    >
      {/* Toolbar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '0.15rem',
          padding: '0.5rem 0.75rem',
          borderBottom: '1px solid var(--border)',
          backgroundColor: 'var(--bg-surface-2)',
        }}
      >
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          style={toolbarBtnStyle(editor.isActive('bold'))}
          title="Negrito"
        >
          <Bold size={14} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          style={toolbarBtnStyle(editor.isActive('italic'))}
          title="Itálico"
        >
          <Italic size={14} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleCode().run()}
          style={toolbarBtnStyle(editor.isActive('code'))}
          title="Código inline"
        >
          <Code size={14} />
        </button>

        {sep}

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          style={toolbarBtnStyle(editor.isActive('heading', { level: 2 }))}
          title="Título H2"
        >
          <Heading2 size={14} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          style={toolbarBtnStyle(editor.isActive('heading', { level: 3 }))}
          title="Título H3"
        >
          <Heading3 size={14} />
        </button>

        {sep}

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          style={toolbarBtnStyle(editor.isActive('bulletList'))}
          title="Lista"
        >
          <List size={14} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          style={toolbarBtnStyle(editor.isActive('orderedList'))}
          title="Lista numerada"
        >
          <ListOrdered size={14} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          style={toolbarBtnStyle(editor.isActive('blockquote'))}
          title="Citação"
        >
          <Quote size={14} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
          style={toolbarBtnStyle()}
          title="Divisor"
        >
          <Minus size={14} />
        </button>

        {sep}

        <button
          type="button"
          onClick={setLink}
          style={toolbarBtnStyle(editor.isActive('link'))}
          title="Link"
        >
          <Link2 size={14} />
        </button>
        <button
          type="button"
          onClick={addImage}
          style={toolbarBtnStyle()}
          title="Imagem por URL"
        >
          <ImageIcon size={14} />
        </button>

        {sep}

        <button
          type="button"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          style={{ ...toolbarBtnStyle(), opacity: editor.can().undo() ? 1 : 0.3 }}
          title="Desfazer"
        >
          <Undo size={14} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          style={{ ...toolbarBtnStyle(), opacity: editor.can().redo() ? 1 : 0.3 }}
          title="Refazer"
        >
          <Redo size={14} />
        </button>
      </div>

      {/* Área de edição */}
      <EditorContent editor={editor} />

      {/* Estilos do editor */}
      <style>{`
        .tiptap p.is-editor-empty:first-child::before {
          content: attr(data-placeholder);
          color: var(--text-faint);
          font-style: italic;
          pointer-events: none;
          float: left;
          height: 0;
        }
        .tiptap h2 {
          font-family: var(--font-display);
          font-size: 1.5rem;
          color: var(--gold-light);
          margin: 2rem 0 0.75rem;
          border-bottom: 1px solid var(--border);
          padding-bottom: 0.5rem;
        }
        .tiptap h3 {
          font-family: var(--font-display);
          font-size: 1.2rem;
          color: var(--text);
          margin: 1.5rem 0 0.5rem;
        }
        .tiptap p { margin-bottom: 1rem; }
        .tiptap ul, .tiptap ol {
          padding-left: 1.5rem;
          margin-bottom: 1rem;
        }
        .tiptap li { margin-bottom: 0.25rem; }
        .tiptap blockquote {
          border-left: 3px solid var(--gold);
          background: var(--bg-surface-2);
          padding: 1rem 1.25rem;
          margin: 1.5rem 0;
          font-style: italic;
          color: var(--text-muted);
          border-radius: 0 var(--radius-sm) var(--radius-sm) 0;
        }
        .tiptap code {
          background: var(--bg-surface-2);
          padding: 0.2em 0.4em;
          border-radius: 3px;
          font-size: 0.9em;
          color: var(--emerald-light);
          font-family: monospace;
        }
        .tiptap pre {
          background: var(--bg-surface-2);
          border: 1px solid var(--border);
          border-radius: var(--radius-sm);
          padding: 1rem;
          overflow-x: auto;
          margin-bottom: 1rem;
        }
        .tiptap pre code {
          background: transparent;
          padding: 0;
          color: var(--text);
        }
        .tiptap a {
          color: var(--emerald-light);
          border-bottom: 1px solid var(--emerald);
        }
        .tiptap hr {
          border: none;
          border-top: 1px solid var(--border);
          margin: 2rem 0;
        }
        .tiptap img {
          max-width: 100%;
          border-radius: var(--radius-sm);
          border: 1px solid var(--border);
          margin: 1rem 0;
        }
      `}</style>
    </div>
  )
}
