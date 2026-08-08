// /hub — student landing/dashboard (spec §6).
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowUpRight, ExternalLink, Clock, BookOpen } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { useHubData } from '../../context/HubDataContext'
import {
  approvedHours,
  getPublishedItems,
  getPublishedModules,
  getStudentLogs,
  getStudentProgress,
  getTodosForStudent,
} from '../../lib/hub/db'
import { completedIds, courseProgress, moduleProgress } from '../../lib/hub/progress'
import type { Tally } from '../../lib/hub/progress'
import type { InternshipLog, Module, Todo, WithId } from '../../lib/hub/types'
import { formatDate, hoursLabel } from '../../lib/hub/format'
import {
  Card,
  EmptyState,
  ProgressBar,
  SectionTitle,
  StatusBadge,
} from '../../components/hub/ui'
import HubLoading from '../../components/hub/HubLoading'

export default function StudentDashboard() {
  const { user } = useAuth()
  const { settings, course, loading: settingsLoading } = useHubData()
  const [todos, setTodos] = useState<WithId<Todo>[]>([])
  const [logs, setLogs] = useState<WithId<InternshipLog>[]>([])
  const [modules, setModules] = useState<WithId<Module>[]>([])
  const [tallies, setTallies] = useState<Record<string, Tally>>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user || settingsLoading) return
    let cancelled = false
    ;(async () => {
      setLoading(true)
      try {
        const [t, l, m, progress] = await Promise.all([
          getTodosForStudent(user.uid),
          getStudentLogs(user.uid),
          course?.id ? getPublishedModules(course.id) : Promise.resolve([]),
          getStudentProgress(user.uid),
        ])
        if (cancelled) return
        setTodos(t)
        setLogs(l)
        setModules(m)

        // ponytail: one items read per module. At one-class scale that's a
        // handful of reads; if the course ever grows past ~20 modules, denormalise
        // an itemCount onto the module doc instead.
        const done = completedIds(progress)
        const perModule = await Promise.all(
          m.map(async (mod) => {
            const items = course?.id ? await getPublishedItems(course.id, mod.id) : []
            return [mod.id, moduleProgress(items.map((i) => i.id), done)] as const
          })
        )
        if (!cancelled) setTallies(Object.fromEntries(perModule))
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [user, course?.id, settingsLoading])

  if (loading || settingsLoading) return <HubLoading />

  const firstName = (user?.displayName || '').split(' ')[0] || 'there'
  const required = settings?.internshipHoursRequired ?? 0
  const approved = approvedHours(logs)
  const overall = courseProgress(Object.values(tallies))

  return (
    <div className="space-y-12">
      <div>
        <div className="eyebrow-accent mb-2">Welcome back</div>
        <h1
          className="text-3xl sm:text-4xl font-black leading-none"
          style={{ fontFamily: "'Racesport', 'Barlow Condensed', sans-serif" }}
        >
          {firstName}
        </h1>
      </div>

      {/* This Week */}
      <section>
        <SectionTitle>This Week</SectionTitle>
        {todos.length === 0 ? (
          <EmptyState>You're all caught up — no to-dos right now.</EmptyState>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2">
            {todos.map((todo) => (
              <TodoCard key={todo.id} todo={todo} />
            ))}
          </div>
        )}
      </section>

      {/* Internship Hours widget */}
      <section>
        <SectionTitle>Internship Hours</SectionTitle>
        <HoursWidget approved={approved} required={required} recent={logs.slice(0, 3)} />
      </section>

      {/* Modules */}
      <section>
        <SectionTitle>Modules</SectionTitle>
        {modules.length === 0 ? (
          <EmptyState>No modules published yet. Check back soon.</EmptyState>
        ) : (
          <>
            {overall.total > 0 && (
              <Card className="mb-4">
                <ProgressBar {...overall} label="lessons complete" />
              </Card>
            )}
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {modules.map((m) => {
                const tally = tallies[m.id]
                return (
                  <Link key={m.id} to={`/hub/modules/${m.id}`} className="block group">
                    <Card className="h-full card-lift flex flex-col">
                      <div className="flex items-start justify-between gap-3">
                        <BookOpen className="w-5 h-5 text-brand-red shrink-0" />
                        <ArrowUpRight className="w-4 h-4 text-ink-faint group-hover:text-white transition-colors" />
                      </div>
                      <h3 className="mt-3 font-headline font-black uppercase tracking-[0.04em] text-base">
                        {m.title}
                      </h3>
                      {m.description && (
                        <p className="mt-1 text-sm text-ink-muted line-clamp-2">
                          {m.description}
                        </p>
                      )}
                      {tally && tally.total > 0 && (
                        <div className="mt-4 pt-1">
                          <ProgressBar {...tally} />
                        </div>
                      )}
                    </Card>
                  </Link>
                )
              })}
            </div>
          </>
        )}
      </section>
    </div>
  )
}

function TodoCard({ todo }: { todo: WithId<Todo> }) {
  return (
    <Card className="flex flex-col">
      <div className="flex-1">
        <h3 className="font-bold text-ink-primary">{todo.title}</h3>
        {todo.description && (
          <p className="mt-1 text-sm text-ink-muted">{todo.description}</p>
        )}
        {todo.dueDate && (
          <p className="mt-2 text-xs font-bold uppercase tracking-[0.08em] text-ink-secondary">
            Due {formatDate(todo.dueDate)}
          </p>
        )}
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        {todo.moduleItemRef && (
          <Link
            to={moduleItemRefToPath(todo.moduleItemRef)}
            className="btn btn-outline !py-2 !px-4 !text-xs"
          >
            Open
          </Link>
        )}
        {todo.gcSubmitUrl && (
          <a
            href={todo.gcSubmitUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary !py-2 !px-4 !text-xs"
          >
            Submit in Classroom <ExternalLink className="w-3.5 h-3.5" />
          </a>
        )}
      </div>
    </Card>
  )
}

function HoursWidget({
  approved,
  required,
  recent,
}: {
  approved: number
  required: number
  recent: WithId<InternshipLog>[]
}) {
  const pct = required > 0 ? Math.min(100, Math.round((approved / required) * 100)) : 0
  return (
    <Card>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Clock className="w-6 h-6 text-brand-red" />
          <div>
            <div className="text-2xl font-black">
              {hoursLabel(approved)}{' '}
              <span className="text-ink-muted text-lg">/ {hoursLabel(required)}</span>
            </div>
            <div className="text-xs uppercase tracking-[0.1em] text-ink-secondary">
              Approved hours
            </div>
          </div>
        </div>
        <Link to="/hub/internship" className="btn btn-primary !py-2.5 !px-5 !text-xs">
          Log Hours
        </Link>
      </div>

      <div className="mt-4">
        <ProgressBar complete={approved} total={required} pct={pct} showCount={false} />
      </div>

      {recent.length > 0 && (
        <ul className="mt-5 space-y-2">
          {recent.map((log) => (
            <li
              key={log.id}
              className="flex items-center justify-between gap-3 text-sm border-t border-white/5 pt-2"
            >
              <span className="text-ink-secondary">
                {formatDate(log.date)} · {hoursLabel(log.hours)} hrs · {log.site}
              </span>
              <StatusBadge status={log.status} />
            </li>
          ))}
        </ul>
      )}
    </Card>
  )
}

// Turns a stored item path (courses/.../items/itemId) into an in-Hub route.
function moduleItemRefToPath(ref: string): string {
  const m = ref.match(/modules\/([^/]+)\/items\/([^/]+)/)
  if (m) return `/hub/modules/${m[1]}/items/${m[2]}`
  const mod = ref.match(/modules\/([^/]+)/)
  if (mod) return `/hub/modules/${mod[1]}`
  return '/hub'
}
