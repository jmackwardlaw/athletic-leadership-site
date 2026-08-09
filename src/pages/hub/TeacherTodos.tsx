// /hub/teacher/todos — CRUD on to-dos surfaced on the student dashboard.
import { useEffect, useMemo, useState, type FormEvent } from 'react'
import { Pencil, Trash2, Plus, Eye, EyeOff } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import {
  createTodo,
  deleteTodo,
  getAllTodos,
  getStudents,
  updateTodo,
} from '../../lib/hub/db'
import type { Todo, UserProfile, WithId } from '../../lib/hub/types'
import { dateInputToTimestamp, formatDate, formatDateInput } from '../../lib/hub/format'
import {
  Card,
  EmptyState,
  Field,
  PageHeading,
  SectionTitle,
  inputClass,
} from '../../components/hub/ui'
import HubLoading from '../../components/hub/HubLoading'

interface FormState {
  title: string
  description: string
  dueDate: string
  gcSubmitUrl: string
  moduleItemRef: string
  audienceAll: boolean
  audienceUids: string[]
  published: boolean
}

const emptyForm: FormState = {
  title: '',
  description: '',
  dueDate: '',
  gcSubmitUrl: '',
  moduleItemRef: '',
  audienceAll: true,
  audienceUids: [],
  published: true,
}

export default function TeacherTodos() {
  const { user } = useAuth()
  const [todos, setTodos] = useState<WithId<Todo>[]>([])
  const [students, setStudents] = useState<WithId<UserProfile>[]>([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState<FormState>(emptyForm)
  const [showForm, setShowForm] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const load = async () => {
    const [t, s] = await Promise.all([getAllTodos(), getStudents()])
    setTodos(t)
    setStudents(s)
  }

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      setLoading(true)
      await load()
      if (!cancelled) setLoading(false)
    })()
    return () => {
      cancelled = true
    }
  }, [])

  const nameByUid = useMemo(() => {
    const m = new Map<string, string>()
    students.forEach((s) => m.set(s.id, s.displayName || s.email))
    return m
  }, [students])

  const startCreate = () => {
    setEditingId(null)
    setForm(emptyForm)
    setError(null)
    setShowForm(true)
  }

  const startEdit = (t: WithId<Todo>) => {
    setEditingId(t.id)
    setForm({
      title: t.title,
      description: t.description || '',
      dueDate: formatDateInput(t.dueDate),
      gcSubmitUrl: t.gcSubmitUrl || '',
      moduleItemRef: t.moduleItemRef || '',
      audienceAll: t.audience === 'all',
      audienceUids: Array.isArray(t.audience) ? t.audience : [],
      published: t.published,
    })
    setError(null)
    setShowForm(true)
  }

  const cancel = () => {
    setShowForm(false)
    setEditingId(null)
    setForm(emptyForm)
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!user) return
    if (!form.title.trim()) return setError('A title is required.')
    if (!form.audienceAll && form.audienceUids.length === 0)
      return setError('Pick at least one student, or choose "All students".')

    setSaving(true)
    setError(null)
    try {
      const payload: Partial<Todo> = {
        title: form.title.trim(),
        description: form.description.trim(),
        audience: form.audienceAll ? 'all' : form.audienceUids,
        published: form.published,
        gcSubmitUrl: form.gcSubmitUrl.trim() || undefined,
        moduleItemRef: form.moduleItemRef.trim() || undefined,
      }
      if (form.dueDate) payload.dueDate = dateInputToTimestamp(form.dueDate)

      if (editingId) {
        await updateTodo(editingId, payload)
      } else {
        await createTodo({
          ...(payload as Omit<Todo, 'createdBy' | 'order'>),
          createdBy: user.uid,
          order: todos.length,
        } as Todo)
      }
      await load()
      cancel()
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('[AL Hub] save todo failed:', err)
      setError('Could not save. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  const togglePublished = async (t: WithId<Todo>) => {
    await updateTodo(t.id, { published: !t.published })
    await load()
  }

  const remove = async (t: WithId<Todo>) => {
    if (!confirm(`Delete "${t.title}"? This can't be undone.`)) return
    await deleteTodo(t.id)
    await load()
  }

  const toggleUid = (uid: string) =>
    setForm((f) => ({
      ...f,
      audienceUids: f.audienceUids.includes(uid)
        ? f.audienceUids.filter((u) => u !== uid)
        : [...f.audienceUids, uid],
    }))

  if (loading) return <HubLoading />

  return (
    <div>
      <PageHeading eyebrow="Teacher" title="To-Dos">
        {!showForm && (
          <button onClick={startCreate} className="btn btn-primary !py-2 !px-4 !text-xs">
            <Plus className="w-4 h-4" /> New To-Do
          </button>
        )}
      </PageHeading>

      {showForm && (
        <Card className="mb-8">
          <SectionTitle>{editingId ? 'Edit To-Do' : 'New To-Do'}</SectionTitle>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Field label="Title" required>
              <input
                type="text"
                value={form.title}
                onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                className={inputClass}
              />
            </Field>
            <Field label="Description">
              <textarea
                value={form.description}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                className={`${inputClass} min-h-[72px] resize-y`}
              />
            </Field>
            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="Due date">
                <input
                  type="date"
                  value={form.dueDate}
                  onChange={(e) => setForm((f) => ({ ...f, dueDate: e.target.value }))}
                  className={inputClass}
                />
              </Field>
              <Field label="Submit in Classroom URL">
                <input
                  type="url"
                  value={form.gcSubmitUrl}
                  onChange={(e) => setForm((f) => ({ ...f, gcSubmitUrl: e.target.value }))}
                  className={inputClass}
                  placeholder="https://classroom.google.com/…"
                />
              </Field>
            </div>
            <Field label="Link to a module item (optional path)">
              <input
                type="text"
                value={form.moduleItemRef}
                onChange={(e) => setForm((f) => ({ ...f, moduleItemRef: e.target.value }))}
                className={inputClass}
                placeholder="courses/{courseId}/modules/{moduleId}/items/{itemId}"
              />
            </Field>

            <div>
              <span className="block text-xs font-bold uppercase tracking-[0.1em] text-ink-secondary mb-2">
                Audience
              </span>
              <div className="flex gap-4 text-sm mb-3">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    checked={form.audienceAll}
                    onChange={() => setForm((f) => ({ ...f, audienceAll: true }))}
                    className="accent-[#d81300]"
                  />
                  All students
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    checked={!form.audienceAll}
                    onChange={() => setForm((f) => ({ ...f, audienceAll: false }))}
                    className="accent-[#d81300]"
                  />
                  Selected students
                </label>
              </div>
              {!form.audienceAll && (
                <div className="max-h-44 overflow-y-auto rounded-token border border-white/10 bg-surface-sunken p-2 space-y-1">
                  {students.length === 0 && (
                    <p className="text-xs text-ink-muted p-2">No students yet.</p>
                  )}
                  {students.map((s) => (
                    <label
                      key={s.id}
                      className="flex items-center gap-2 text-sm px-2 py-1.5 rounded hover:bg-white/5 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={form.audienceUids.includes(s.id)}
                        onChange={() => toggleUid(s.id)}
                        className="accent-[#d81300]"
                      />
                      {s.displayName || s.email}
                    </label>
                  ))}
                </div>
              )}
            </div>

            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <input
                type="checkbox"
                checked={form.published}
                onChange={(e) => setForm((f) => ({ ...f, published: e.target.checked }))}
                className="accent-[#d81300]"
              />
              Published (visible to students)
            </label>

            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/30 text-red-300 text-xs rounded-token">
                {error}
              </div>
            )}

            <div className="flex gap-2">
              <button type="submit" disabled={saving} className="btn btn-primary !text-xs disabled:opacity-60">
                {saving ? 'Saving…' : editingId ? 'Save Changes' : 'Create To-Do'}
              </button>
              <button type="button" onClick={cancel} className="btn btn-outline !text-xs">
                Cancel
              </button>
            </div>
          </form>
        </Card>
      )}

      {todos.length === 0 ? (
        <EmptyState>No to-dos yet. Create one to surface it on the student dashboard.</EmptyState>
      ) : (
        <div className="space-y-3">
          {todos.map((t) => (
            <Card key={t.id} className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-bold text-ink-primary">{t.title}</h3>
                  {!t.published && (
                    <span className="text-[10px] uppercase tracking-[0.12em] text-yellow-300 border border-yellow-500/30 rounded-full px-2 py-0.5">
                      Draft
                    </span>
                  )}
                </div>
                {t.description && (
                  <p className="mt-1 text-sm text-ink-muted">{t.description}</p>
                )}
                <div className="mt-2 text-xs text-ink-faint flex flex-wrap gap-x-3 gap-y-1">
                  {t.dueDate && <span>Due {formatDate(t.dueDate)}</span>}
                  <span>
                    {t.audience === 'all'
                      ? 'All students'
                      : `${t.audience.length} student${t.audience.length === 1 ? '' : 's'}`}
                  </span>
                  {t.gcSubmitUrl && <span>· Classroom link</span>}
                </div>
                {Array.isArray(t.audience) && t.audience.length > 0 && (
                  <div className="mt-1 text-xs text-ink-faint">
                    {t.audience.map((u) => nameByUid.get(u) || u).join(', ')}
                  </div>
                )}
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <IconBtn title={t.published ? 'Unpublish' : 'Publish'} onClick={() => togglePublished(t)}>
                  {t.published ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                </IconBtn>
                <IconBtn title="Edit" onClick={() => startEdit(t)}>
                  <Pencil className="w-4 h-4" />
                </IconBtn>
                <IconBtn title="Delete" onClick={() => remove(t)}>
                  <Trash2 className="w-4 h-4" />
                </IconBtn>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

function IconBtn({
  title,
  onClick,
  children,
}: {
  title: string
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      title={title}
      onClick={onClick}
      className="p-2 rounded-token text-ink-muted hover:text-white hover:bg-white/10 transition-colors"
    >
      {children}
    </button>
  )
}
