// /hub/modules/:moduleId — module detail (list of published items).
// Full markdown rendering + rich item pages land in Phase 2; this is the
// lean Phase-1 version so module navigation works end to end.
import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ExternalLink, FileText, Link2, PlayCircle, Paperclip, BookText } from 'lucide-react'
import { useHubData } from '../../context/HubDataContext'
import { getModule, getPublishedItems } from '../../lib/hub/db'
import type { Item, ItemType, Module, WithId } from '../../lib/hub/types'
import { formatDate } from '../../lib/hub/format'
import { Card, EmptyState, PageHeading } from '../../components/hub/ui'
import HubLoading from '../../components/hub/HubLoading'

const ITEM_ICON: Record<ItemType, typeof FileText> = {
  lesson: BookText,
  resource: FileText,
  link: Link2,
  video: PlayCircle,
  file: Paperclip,
  assignment: FileText,
}

export default function ModulePage() {
  const { moduleId } = useParams()
  const { course, loading: settingsLoading } = useHubData()
  const [module, setModule] = useState<WithId<Module> | null>(null)
  const [items, setItems] = useState<WithId<Item>[]>([])
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    if (settingsLoading || !course?.id || !moduleId) return
    let cancelled = false
    ;(async () => {
      setLoading(true)
      const m = await getModule(course.id, moduleId)
      if (cancelled) return
      if (!m) {
        setNotFound(true)
        setLoading(false)
        return
      }
      setModule(m)
      setItems(await getPublishedItems(course.id, moduleId))
      if (!cancelled) setLoading(false)
    })()
    return () => {
      cancelled = true
    }
  }, [course?.id, moduleId, settingsLoading])

  if (loading || settingsLoading) return <HubLoading />

  if (notFound || !module) {
    return (
      <div>
        <Link to="/hub" className="text-ink-muted text-xs hover:text-white">
          ← Back to dashboard
        </Link>
        <EmptyState>This module isn't available.</EmptyState>
      </div>
    )
  }

  return (
    <div>
      <Link to="/hub" className="text-ink-muted text-xs hover:text-white">
        ← Back to dashboard
      </Link>
      <div className="mt-3">
        <PageHeading eyebrow="Module" title={module.title} />
      </div>
      {module.description && (
        <p className="-mt-4 mb-8 text-ink-muted max-w-2xl">{module.description}</p>
      )}

      {items.length === 0 ? (
        <EmptyState>No items in this module yet.</EmptyState>
      ) : (
        <div className="space-y-3">
          {items.map((item) => {
            const Icon = ITEM_ICON[item.type] ?? FileText
            return (
              <Card key={item.id} className="flex items-start gap-4">
                <Icon className="w-5 h-5 text-brand-red shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-bold text-ink-primary">{item.title}</h3>
                    <span className="text-[10px] uppercase tracking-[0.12em] text-ink-faint">
                      {item.type}
                    </span>
                  </div>
                  {item.dueDate && (
                    <p className="mt-1 text-xs font-bold uppercase tracking-[0.08em] text-ink-secondary">
                      Due {formatDate(item.dueDate)}
                    </p>
                  )}
                  <div className="mt-3 flex flex-wrap gap-2">
                    <Link
                      to={`/hub/modules/${moduleId}/items/${item.id}`}
                      className="btn btn-outline !py-1.5 !px-3.5 !text-xs"
                    >
                      Open
                    </Link>
                    {item.resourceUrl && (
                      <a
                        href={item.resourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-outline !py-1.5 !px-3.5 !text-xs"
                      >
                        Resource <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}
                    {item.gcSubmitUrl && (
                      <a
                        href={item.gcSubmitUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-primary !py-1.5 !px-3.5 !text-xs"
                      >
                        Submit in Classroom <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>
                </div>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
