// /hub/modules/:moduleId — module detail (list of published items) with
// per-item completion ticks and a module progress bar.
import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import {
  CheckCircle2,
  ExternalLink,
  FileText,
  Link2,
  PlayCircle,
  Paperclip,
  BookText,
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { useHubData } from '../../context/HubDataContext'
import { getModule, getPublishedItems, getStudentProgress } from '../../lib/hub/db'
import { completedIds, moduleProgress } from '../../lib/hub/progress'
import type { Item, ItemType, Module, WithId } from '../../lib/hub/types'
import { formatDate } from '../../lib/hub/format'
import { Card, EmptyState, PageHeading, ProgressBar } from '../../components/hub/ui'
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
  const { user } = useAuth()
  const { course, loading: settingsLoading } = useHubData()
  const [module, setModule] = useState<WithId<Module> | null>(null)
  const [items, setItems] = useState<WithId<Item>[]>([])
  const [done, setDone] = useState<Set<string>>(new Set())
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
      const [its, progress] = await Promise.all([
        getPublishedItems(course.id, moduleId),
        user ? getStudentProgress(user.uid) : Promise.resolve([]),
      ])
      if (cancelled) return
      setItems(its)
      setDone(completedIds(progress))
      setLoading(false)
    })()
    return () => {
      cancelled = true
    }
  }, [course?.id, moduleId, user, settingsLoading])

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
        <p className="-mt-4 mb-6 text-ink-muted max-w-2xl">{module.description}</p>
      )}

      {items.length > 0 && (
        <div className="mb-8 max-w-md">
          <ProgressBar {...moduleProgress(items.map((i) => i.id), done)} />
        </div>
      )}

      {items.length === 0 ? (
        <EmptyState>No items in this module yet.</EmptyState>
      ) : (
        <div className="space-y-3">
          {items.map((item) => {
            const Icon = ITEM_ICON[item.type] ?? FileText
            const isDone = done.has(item.id)
            return (
              <Card key={item.id} className="flex items-start gap-4">
                {isDone ? (
                  <CheckCircle2 className="w-5 h-5 text-green-400 shrink-0 mt-0.5" />
                ) : (
                  <Icon className="w-5 h-5 text-brand-red shrink-0 mt-0.5" />
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-bold text-ink-primary">{item.title}</h3>
                    <span className="text-[10px] uppercase tracking-[0.12em] text-ink-faint">
                      {item.type}
                    </span>
                    {isDone && (
                      <span className="text-[10px] uppercase tracking-[0.12em] text-green-400">
                        Complete
                      </span>
                    )}
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
