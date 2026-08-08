// Renders teacher-authored item bodies as markdown.
//
// react-markdown ignores raw HTML unless rehype-raw is added, so untrusted
// markup can't reach the DOM and no sanitizer dependency is needed. Keep it
// that way — adding rehype-raw would make item bodies an XSS vector.
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { cn } from '../../lib/utils'

export default function Markdown({
  children,
  className,
}: {
  children: string
  className?: string
}) {
  return (
    <div className={cn('hub-prose', className)}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          // External links open in a new tab; noopener prevents the opened
          // page from reaching back through window.opener.
          a: ({ node, ...props }) => (
            <a {...props} target="_blank" rel="noopener noreferrer" />
          ),
        }}
      >
        {children}
      </ReactMarkdown>
    </div>
  )
}
