// /hub/modules/:moduleId/items/:itemId — item detail.
// Body renders as markdown; students mark the item complete themselves
// (see Markdown.tsx for why raw HTML stays disabled).
import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { CheckCircle2, Circle, ExternalLink } from 'lucide-react'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '../../lib/firebase'
import { useAuth } from '../../context/AuthContext'
import { useHubData } from '../../context/HubDataContext'
import { getStudentProgress, setItemComplete } from '../../lib/hub/db'
import { completedIds } from '../../lib/hub/progress'
import type { Item } from '../../lib/hub/types'
import { formatDate } from '../../lib/hub/format'
import { Card, EmptyState, PageHeading } from '../../components/hub/ui'
import Markdown from '../../components/hub/Markdown'
import HubLoading from '../../components/hub/HubLoading'

export default function ItemPage() {
  const { moduleId, itemId } = useParams()
  const { user } = useAuth()
  const { course, loading: settingsLoading } = useHubData()
  const [item, setItem] = useState<Item | null>(null)
  const [complete, setComplete] = useState(false)
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (settingsLoading || !course?.id || !moduleId || !itemId) return
    let cancelled = false
    ;(async () => {
      setLoading(true)
      const [snap, progress] = await Promise.all([
        getDoc(doc(db, 'courses', course.id, 'modules', moduleId, 'items', itemId)),
        user ? getStudentProgress(user.uid) : Promise.resolve([]),
      ])
      if (cancelled) return
      setItem(snap.exists() ? (snap.data() as Item) : null)
      setComplete(completedIds(progress).has(itemId))
      setLoading(false)
    })()
    return () => {
      cancelled = true
    }
  }, [course?.id, moduleId, itemId, user, settingsLoading])

  const toggleComplete = async () => {
    if (!user || !course?.id || !moduleId || !itemId) return
    const next = !complete
    setSaving(true)
    setComplete(next) // optimistic; reverted below if the write fails
    try {
      await setItemComplete(user.uid, { courseId: course.id, moduleId, itemId }, next)
    } catch (err) {
      setComplete(!next)
      // eslint-disable-next-line no-console
      console.error('[AL Hub] could not save progress:', err)
    } finally {
      setSaving(false)
    }
  }

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
            <Card>
              <Markdown>{item.body}</Markdown>
            </Card>
          )}
          <div className="mt-5 flex flex-wrap gap-2">
            <button
              onClick={toggleComplete}
              disabled={saving}
              className={`btn !text-xs disabled:opacity-60 ${
                complete ? 'btn-outline' : 'btn-primary'
              }`}
            >
              {complete ? (
                <>
                  <CheckCircle2 className="w-4 h-4" /> Completed
                </>
              ) : (
                <>
                  <Circle className="w-4 h-4" /> Mark Complete
                </>
              )}
            </button>
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
