interface PostContentProps {
  content: Record<string, unknown>
}

// Converte Tiptap JSON para HTML React-safe
function renderNode(node: Record<string, unknown>): string {
  if (!node) return ''

  switch (node.type) {
    case 'doc':
      return (node.content as Record<string, unknown>[])?.map(renderNode).join('') || ''

    case 'paragraph': {
      const content =
        (node.content as Record<string, unknown>[] | undefined)?.map(renderNode).join('') || ''
      return `<p>${content}</p>`
    }

    case 'heading': {
      const level = (node.attrs as Record<string, unknown>)?.level || 2
      const content =
        (node.content as Record<string, unknown>[] | undefined)?.map(renderNode).join('') || ''
      return `<h${level}>${content}</h${level}>`
    }

    case 'text': {
      let text = escapeHtml((node.text as string) || '')
      const marks = (node.marks as Record<string, unknown>[]) || []
      marks.forEach((mark) => {
        switch (mark.type) {
          case 'bold':
            text = `<strong>${text}</strong>`
            break
          case 'italic':
            text = `<em>${text}</em>`
            break
          case 'code':
            text = `<code>${text}</code>`
            break
          case 'link': {
            const href = (mark.attrs as Record<string, unknown>)?.href || '#'
            text = `<a href="${href}" target="_blank" rel="noopener noreferrer">${text}</a>`
            break
          }
          case 'strike':
            text = `<s>${text}</s>`
            break
        }
      })
      return text
    }

    case 'blockquote': {
      const content =
        (node.content as Record<string, unknown>[] | undefined)?.map(renderNode).join('') || ''
      return `<blockquote>${content}</blockquote>`
    }

    case 'bulletList': {
      const items =
        (node.content as Record<string, unknown>[] | undefined)?.map(renderNode).join('') || ''
      return `<ul>${items}</ul>`
    }

    case 'orderedList': {
      const items =
        (node.content as Record<string, unknown>[] | undefined)?.map(renderNode).join('') || ''
      return `<ol>${items}</ol>`
    }

    case 'listItem': {
      const content =
        (node.content as Record<string, unknown>[] | undefined)?.map(renderNode).join('') || ''
      return `<li>${content}</li>`
    }

    case 'codeBlock': {
      const code =
        (node.content as Record<string, unknown>[] | undefined)
          ?.map((n) => escapeHtml((n.text as string) || ''))
          .join('') || ''
      return `<pre><code>${code}</code></pre>`
    }

    case 'image': {
      const attrs = (node.attrs as Record<string, unknown>) || {}
      const src = attrs.src as string
      const alt = (attrs.alt as string) || ''
      const title = attrs.title as string | undefined
      return `<img src="${src}" alt="${escapeHtml(alt)}"${title ? ` title="${escapeHtml(title)}"` : ''} loading="lazy" />`
    }

    case 'horizontalRule':
      return '<hr />'

    case 'hardBreak':
      return '<br />'

    default:
      return ''
  }
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

export default function PostContent({ content }: PostContentProps) {
  const html = renderNode(content)

  return (
    <div
      className="prose-blog"
      dangerouslySetInnerHTML={{ __html: html }}
      style={{ maxWidth: '100%' }}
    />
  )
}
