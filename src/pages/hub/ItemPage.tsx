// /hub/modules/:moduleId/items/:itemId — item detail.
// Phase 1 renders the body as plain text; rich markdown rendering is a
// Phase 2 deliverable. Resource + "Submit in Classroom" actions work now.
import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ExternalLink } from 'lucide-react'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '../../lib/firebase'
import { useHubData } from '../../context/HubDataContext'
import type { Item } from '../../lib/hub/types'
import { formatDate } from '../../lib/hub/format'
import { Card, EmptyState, PageHeading } from '../../components/hub/ui'
import HubLoading from '../../components/hub/HubLoading'

export default function ItemPage() {
  const { moduleId, itemId } = useParams()
  const { course, loading: settingsLoading } = useHubData()
  const [item, setItem] = useState<Item | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (settingsLoading || !course?.id || !moduleId || !itemId) return
    let cancelled = false
    ;(async () => {
      setLoading(true)
      const snap = await getDoc(
        doc(db, 'courses', course.id, 'modules', moduleId, 'items', itemId)
      )
      if (cancelled) return
      setItem(snap.exists() ? (snap.data() as Item) : null)
      setLoading(false)
    })()
    return () => {
      cancelled = true
    }
  }, [course?.id, moduleId, itemId, settingsLoading])

  if (loading || settingsLoading) return <HubLoading />

  return (
    <div>
      <Link
        to={`/hub/modules/${moduleId}`}
        className="text-ink-muted text-xs hover:text-white"
      >
        ← Back to module
      </Link>
      {!item || !item.published ? (
        <div className="mt-3">
          <EmptyState>This item isn't available.</EmptyState>
        </div>
      ) : (
        <div className="mt-3">
          <PageHeading eyebrow={item.type} title={item.title} />
          {item.dueDate && (
            <p className="-mt-4 mb-6 text-xs font-bold uppercase tracking-[0.08em] text-ink-secondary">
              Due {formatDate(item.dueDate)}
            </p>
          )}
          {item.body && (
            <Card className="prose-none">
              <p className="whitespace-pre-wrap text-ink-secondary leading-relaxed">
                {item.body}
              </p>
            </Card>
          )}
          <div className="mt-5 flex flex-wrap gap-2">
            {item.resourceUrl && (
              <a
                href={item.resourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-outline !text-xs"
              >
                Open Resource <ExternalLink className="w-4 h-4" />
              </a>
            )}
            {item.gcSubmitUrl && (
              <a
                href={item.gcSubmitUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary !text-xs"
              >
                Submit in Classroom <ExternalLink className="w-4 h-4" />
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
