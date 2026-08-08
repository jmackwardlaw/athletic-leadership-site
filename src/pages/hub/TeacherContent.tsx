// /hub/teacher/content — author the active course: modules and their items.
// Drafts (published: false) are visible here and nowhere else.
import { useEffect, useState, type FormEvent } from 'react'
import { Timestamp } from 'firebase/firestore'
import {
  ChevronDown,
  ChevronRight,
  Eye,
  EyeOff,
  Pencil,
  Plus,
  Trash2,
} from 'lucide-react'
import { useHubData } from '../../context/HubDataContext'
import {
  createItem,
  createModule,
  deleteItem,
  deleteModule,
  getAllItems,
  getAllModules,
  updateItem,
  updateModule,
} from '../../lib/hub/db'
import type { Item, ItemType, Module, WithId } from '../../lib/hub/types'
import { formatDate, formatDateInput } from '../../lib/hub/format'
import {
  Card,
  EmptyState,
  Field,
  PageHeading,
  SectionTitle,
  inputClass,
} from '../../components/hub/ui'
import Markdown from '../../components/hub/Markdown'
import HubLoading from '../../components/hub/HubLoading'

const ITEM_TYPES: ItemType[] = [
  'lesson',
  'resource',
  'link',
  'video',
  'file',
  'assignment',
]

interface ModuleForm {
  title: string
  description: string
  order: string
  published: boolean
}

interface ItemForm {
  type: ItemType
  title: string
  body: string
  resourceUrl: string
  gcSubmitUrl: string
  dueDate: string
  order: string
  published: boolean
}

const emptyModuleForm: ModuleForm = {
  title: '',
  description: '',
  order: '',
  published: false,
}

const emptyItemForm: ItemForm = {
  type: 'lesson',
  title: '',
  body: '',
  resourceUrl: '',
  gcSubmitUrl: '',
  dueDate: '',
  order: '',
  published: false,
}

/** yyyy-mm-dd from a <input type="date"> → noon local, matching TeacherTodos. */
function dateInputToTimestamp(value: string): Timestamp {
  const [y, m, d] = value.split('-').map(Number)
  return Timestamp.fromDate(new Date(y, m - 1, d, 12, 0, 0))
}

export default function TeacherContent() {
  const { course, loading: courseLoading } = useHubData()
  const [modules, setModules] = useState<WithId<Module>[]>([])
  const [itemsByModule, setItemsByModule] = useState<Record<string, WithId<Item>[]>>({})
  const [expanded, setExpanded] = useState<Set<string>>(new Set())
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  // Module form: null = closed, '' = creating, id = editing that module.
  const [moduleEditing, setModuleEditing] = useState<string | null>(null)
  const [moduleForm, setModuleForm] = useState<ModuleForm>(emptyModuleForm)

  // Item form: which module it belongs to, and '' = creating / id = editing.
  const [itemTarget, setItemTarget] = useState<{ moduleId: string; itemId: string } | null>(
    null
  )
  const [itemForm, setItemForm] = useState<ItemForm>(emptyItemForm)

  const load = async (courseId: string) => {
    const mods = await getAllModules(courseId)
    const entries = await Promise.all(
      mods.map(async (m) => [m.id, await getAllItems(courseId, m.id)] as const)
    )
    setModules(mods)
    setItemsByModule(Object.fromEntries(entries))
  }

  useEffect(() => {
    if (courseLoading || !course?.id) return
    let cancelled = false
    ;(async () => {
      setLoading(true)
      try {
        await load(course.id)
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [course?.id, courseLoading])

  const refresh = async () => {
    if (course?.id) await load(course.id)
  }

  const toggleExpanded = (id: string) =>
    setExpanded((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })

  // ── Module actions ──────────────────────────────────────────────────────
  const startCreateModule = () => {
    setModuleEditing('')
    setModuleForm({ ...emptyModuleForm, order: String(modules.length) })
    setError(null)
  }

  const startEditModule = (m: WithId<Module>) => {
    setModuleEditing(m.id)
    setModuleForm({
      title: m.title,
      description: m.description || '',
      order: String(m.order ?? 0),
      published: m.published,
    })
    setError(null)
  }

  const submitModule = async (e: FormEvent) => {
    e.preventDefault()
    if (!course?.id) return
    if (!moduleForm.title.trim()) return setError('A module title is required.')
    setSaving(true)
    setError(null)
    try {
      const payload: Module = {
        title: moduleForm.title.trim(),
        description: moduleForm.description.trim(),
        order: Number(moduleForm.order) || 0,
        published: moduleForm.published,
      }
      if (moduleEditing) await updateModule(course.id, moduleEditing, payload)
      else await createModule(course.id, payload)
      await refresh()
      setModuleEditing(null)
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('[AL Hub] save module failed:', err)
      setError('Could not save the module. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  const removeModule = async (m: WithId<Module>) => {
    const count = itemsByModule[m.id]?.length ?? 0
    const warning = count
      ? `Delete "${m.title}" and its ${count} item${count === 1 ? '' : 's'}?`
      : `Delete "${m.title}"?`
    if (!course?.id || !confirm(`${warning} This can't be undone.`)) return
    await deleteModule(course.id, m.id)
    await refresh()
  }

  // ── Item actions ────────────────────────────────────────────────────────
  const startCreateItem = (moduleId: string) => {
    setItemTarget({ moduleId, itemId: '' })
    setItemForm({
      ...emptyItemForm,
      order: String(itemsByModule[moduleId]?.length ?? 0),
    })
    setExpanded((prev) => new Set(prev).add(moduleId))
    setError(null)
  }

  const startEditItem = (moduleId: string, item: WithId<Item>) => {
    setItemTarget({ moduleId, itemId: item.id })
    setItemForm({
      type: item.type,
      title: item.title,
      body: item.body || '',
      resourceUrl: item.resourceUrl || '',
      gcSubmitUrl: item.gcSubmitUrl || '',
      dueDate: formatDateInput(item.dueDate),
      order: String(item.order ?? 0),
      published: item.published,
    })
    setError(null)
  }

  const submitItem = async (e: FormEvent) => {
    e.preventDefault()
    if (!course?.id || !itemTarget) return
    if (!itemForm.title.trim()) return setError('An item title is required.')
    setSaving(true)
    setError(null)
    try {
      const payload: Item = {
        type: itemForm.type,
        title: itemForm.title.trim(),
        body: itemForm.body,
        order: Number(itemForm.order) || 0,
        published: itemForm.published,
        ...(itemForm.resourceUrl.trim()
          ? { resourceUrl: itemForm.resourceUrl.trim() }
          : {}),
        ...(itemForm.gcSubmitUrl.trim()
          ? { gcSubmitUrl: itemForm.gcSubmitUrl.trim() }
          : {}),
        ...(itemForm.dueDate ? { dueDate: dateInputToTimestamp(itemForm.dueDate) } : {}),
      }
      if (itemTarget.itemId) {
        await updateItem(course.id, itemTarget.moduleId, itemTarget.itemId, payload)
      } else {
        await createItem(course.id, itemTarget.moduleId, payload)
      }
      await refresh()
      setItemTarget(null)
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('[AL Hub] save item failed:', err)
      setError('Could not save the item. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  const removeItem = async (moduleId: string, item: WithId<Item>) => {
    if (!course?.id || !confirm(`Delete "${item.title}"? This can't be undone.`)) return
    await deleteItem(course.id, moduleId, item.id)
    await refresh()
  }

  if (loading || courseLoading) return <HubLoading />

  if (!course) {
    return (
      <div>
        <PageHeading eyebrow="Teacher" title="Content" />
        <EmptyState>
          No active course is set. Add an <code>activeCourseId</code> to settings/config
          first.
        </EmptyState>
      </div>
    )
  }

  return (
    <div>
      <PageHeading eyebrow="Teacher" title="Content">
        {moduleEditing === null && (
          <button
            onClick={startCreateModule}
            className="btn btn-primary !py-2 !px-4 !text-xs"
          >
            <Plus className="w-4 h-4" /> New Module
          </button>
        )}
      </PageHeading>

      <p className="-mt-4 mb-8 text-sm text-ink-muted">
        Editing <span className="text-ink-primary font-bold">{course.title}</span>.
        Unpublished modules and items are hidden from students.
      </p>

      {error && (
        <div className="mb-5 p-3 bg-red-500/10 border border-red-500/30 text-red-300 text-xs rounded-token">
          {error}
        </div>
      )}

      {moduleEditing !== null && (
        <Card className="mb-8">
          <SectionTitle>{moduleEditing ? 'Edit Module' : 'New Module'}</SectionTitle>
          <form onSubmit={submitModule} className="space-y-4">
            <Field label="Title" required>
              <input
                type="text"
                value={moduleForm.title}
                onChange={(e) =>
                  setModuleForm((f) => ({ ...f, title: e.target.value }))
                }
                className={inputClass}
              />
            </Field>
            <Field label="Description">
              <textarea
                value={moduleForm.description}
                onChange={(e) =>
                  setModuleForm((f) => ({ ...f, description: e.target.value }))
                }
                className={`${inputClass} min-h-[72px] resize-y`}
              />
            </Field>
            <Field label="Order (lowest shows first)">
              <input
                type="number"
                value={moduleForm.order}
                onChange={(e) =>
                  setModuleForm((f) => ({ ...f, order: e.target.value }))
                }
                className={`${inputClass} max-w-[8rem]`}
              />
            </Field>
            <PublishToggle
              checked={moduleForm.published}
              onChange={(v) => setModuleForm((f) => ({ ...f, published: v }))}
            />
            <FormButtons
              saving={saving}
              editing={Boolean(moduleEditing)}
              onCancel={() => setModuleEditing(null)}
              createLabel="Create Module"
            />
          </form>
        </Card>
      )}

      {modules.length === 0 ? (
        <EmptyState>No modules yet. Create one to start building the course.</EmptyState>
      ) : (
        <div className="space-y-3">
          {modules.map((m) => {
            const items = itemsByModule[m.id] ?? []
            const isOpen = expanded.has(m.id)
            return (
              <Card key={m.id}>
                <div className="flex items-start justify-between gap-4">
                  <button
                    onClick={() => toggleExpanded(m.id)}
                    className="flex items-start gap-3 text-left min-w-0 flex-1"
                  >
                    {isOpen ? (
                      <ChevronDown className="w-4 h-4 text-ink-muted shrink-0 mt-1" />
                    ) : (
                      <ChevronRight className="w-4 h-4 text-ink-muted shrink-0 mt-1" />
                    )}
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-bold text-ink-primary">{m.title}</h3>
                        {!m.published && <DraftBadge />}
                        <span className="text-[10px] uppercase tracking-[0.12em] text-ink-faint">
                          {items.length} item{items.length === 1 ? '' : 's'}
                        </span>
                      </div>
                      {m.description && (
                        <p className="mt-1 text-sm text-ink-muted">{m.description}</p>
                      )}
                    </div>
                  </button>
                  <div className="flex items-center gap-1 shrink-0">
                    <IconBtn
                      title={m.published ? 'Unpublish' : 'Publish'}
                      onClick={async () => {
                        await updateModule(course.id, m.id, { published: !m.published })
                        await refresh()
                      }}
                    >
                      {m.published ? (
                        <Eye className="w-4 h-4" />
                      ) : (
                        <EyeOff className="w-4 h-4" />
                      )}
                    </IconBtn>
                    <IconBtn title="Edit module" onClick={() => startEditModule(m)}>
                      <Pencil className="w-4 h-4" />
                    </IconBtn>
                    <IconBtn title="Delete module" onClick={() => removeModule(m)}>
                      <Trash2 className="w-4 h-4" />
                    </IconBtn>
                  </div>
                </div>

                {isOpen && (
                  <div className="mt-4 pl-7 border-l border-white/5 space-y-2">
                    {items.length === 0 && !itemTarget && (
                      <p className="text-sm text-ink-faint">No items in this module yet.</p>
                    )}
                    {items.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-start justify-between gap-3 rounded-token bg-surface-sunken/60 px-3 py-2"
                      >
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="text-sm font-bold text-ink-primary">
                              {item.title}
                            </span>
                            <span className="text-[10px] uppercase tracking-[0.12em] text-ink-faint">
                              {item.type}
                            </span>
                            {!item.published && <DraftBadge />}
                          </div>
                          <div className="mt-0.5 text-xs text-ink-faint flex flex-wrap gap-x-3">
                            {item.dueDate && <span>Due {formatDate(item.dueDate)}</span>}
                            {item.gcSubmitUrl && <span>Classroom link</span>}
                            {item.resourceUrl && <span>Resource link</span>}
                          </div>
                        </div>
                        <div className="flex items-center gap-1 shrink-0">
                          <IconBtn
                            title={item.published ? 'Unpublish' : 'Publish'}
                            onClick={async () => {
                              await updateItem(course.id, m.id, item.id, {
                                published: !item.published,
                              })
                              await refresh()
                            }}
                          >
                            {item.published ? (
                              <Eye className="w-4 h-4" />
                            ) : (
                              <EyeOff className="w-4 h-4" />
                            )}
                          </IconBtn>
                          <IconBtn
                            title="Edit item"
                            onClick={() => startEditItem(m.id, item)}
                          >
                            <Pencil className="w-4 h-4" />
                          </IconBtn>
                          <IconBtn
                            title="Delete item"
                            onClick={() => removeItem(m.id, item)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </IconBtn>
                        </div>
                      </div>
                    ))}

                    {itemTarget?.moduleId === m.id ? (
                      <ItemEditor
                        form={itemForm}
                        setForm={setItemForm}
                        editing={Boolean(itemTarget.itemId)}
                        saving={saving}
                        onSubmit={submitItem}
                        onCancel={() => setItemTarget(null)}
                      />
                    ) : (
                      <button
                        onClick={() => startCreateItem(m.id)}
                        className="btn btn-outline !py-1.5 !px-3.5 !text-xs mt-2"
                      >
                        <Plus className="w-3.5 h-3.5" /> Add Item
                      </button>
                    )}
                  </div>
                )}
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}

function ItemEditor({
  form,
  setForm,
  editing,
  saving,
  onSubmit,
  onCancel,
}: {
  form: ItemForm
  setForm: React.Dispatch<React.SetStateAction<ItemForm>>
  editing: boolean
  saving: boolean
  onSubmit: (e: FormEvent) => void
  onCancel: () => void
}) {
  const [preview, setPreview] = useState(false)
  return (
    <form
      onSubmit={onSubmit}
      className="mt-3 rounded-token border border-white/10 bg-surface-sunken p-4 space-y-4"
    >
      <SectionTitle>{editing ? 'Edit Item' : 'New Item'}</SectionTitle>

      <div className="grid sm:grid-cols-2 gap-4">
        <Field label="Title" required>
          <input
            type="text"
            value={form.title}
            onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
            className={inputClass}
          />
        </Field>
        <Field label="Type">
          <select
            value={form.type}
            onChange={(e) =>
              setForm((f) => ({ ...f, type: e.target.value as ItemType }))
            }
            className={inputClass}
          >
            {ITEM_TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </Field>
      </div>

      <div>
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-xs font-bold uppercase tracking-[0.1em] text-ink-secondary">
            Body (markdown)
          </span>
          <button
            type="button"
            onClick={() => setPreview((p) => !p)}
            className="text-xs text-ink-muted hover:text-white"
          >
            {preview ? 'Edit' : 'Preview'}
          </button>
        </div>
        {preview ? (
          <div className="rounded-token border border-white/10 bg-surface-base p-4 min-h-[160px]">
            {form.body ? (
              <Markdown>{form.body}</Markdown>
            ) : (
              <p className="text-sm text-ink-faint">Nothing to preview yet.</p>
            )}
          </div>
        ) : (
          <textarea
            value={form.body}
            onChange={(e) => setForm((f) => ({ ...f, body: e.target.value }))}
            className={`${inputClass} min-h-[160px] resize-y font-mono !text-[13px]`}
            placeholder={'## Heading\n\nSupports **bold**, lists, links, and tables.'}
          />
        )}
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <Field label="Resource URL">
          <input
            type="url"
            value={form.resourceUrl}
            onChange={(e) => setForm((f) => ({ ...f, resourceUrl: e.target.value }))}
            className={inputClass}
            placeholder="https://…"
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

      <div className="grid sm:grid-cols-2 gap-4">
        <Field label="Due date">
          <input
            type="date"
            value={form.dueDate}
            onChange={(e) => setForm((f) => ({ ...f, dueDate: e.target.value }))}
            className={inputClass}
          />
        </Field>
        <Field label="Order (lowest shows first)">
          <input
            type="number"
            value={form.order}
            onChange={(e) => setForm((f) => ({ ...f, order: e.target.value }))}
            className={inputClass}
          />
        </Field>
      </div>

      <PublishToggle
        checked={form.published}
        onChange={(v) => setForm((f) => ({ ...f, published: v }))}
      />
      <FormButtons
        saving={saving}
        editing={editing}
        onCancel={onCancel}
        createLabel="Create Item"
      />
    </form>
  )
}

function PublishToggle({
  checked,
  onChange,
}: {
  checked: boolean
  onChange: (v: boolean) => void
}) {
  return (
    <label className="flex items-center gap-2 text-sm cursor-pointer">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="accent-[#d81300]"
      />
      Published (visible to students)
    </label>
  )
}

function FormButtons({
  saving,
  editing,
  onCancel,
  createLabel,
}: {
  saving: boolean
  editing: boolean
  onCancel: () => void
  createLabel: string
}) {
  return (
    <div className="flex gap-2">
      <button
        type="submit"
        disabled={saving}
        className="btn btn-primary !text-xs disabled:opacity-60"
      >
        {saving ? 'Saving…' : editing ? 'Save Changes' : createLabel}
      </button>
      <button type="button" onClick={onCancel} className="btn btn-outline !text-xs">
        Cancel
      </button>
    </div>
  )
}

function DraftBadge() {
  return (
    <span className="text-[10px] uppercase tracking-[0.12em] text-yellow-300 border border-yellow-500/30 rounded-full px-2 py-0.5">
      Draft
    </span>
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
