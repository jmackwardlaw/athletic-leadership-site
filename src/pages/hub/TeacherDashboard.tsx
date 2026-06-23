// /hub/teacher — teacher overview (spec §7). Phase 1 surfaces Roster,
// Internship approvals, and To-Dos. Content CMS (Phase 2) and Submissions
// (Phase 4) are shown as upcoming, not yet linked.
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Users, ClipboardCheck, ListTodo, FolderCog, FileCheck2 } from 'lucide-react'
import {
  approvedHours,
  getAllLogs,
  getApprovalQueue,
  getStudents,
} from '../../lib/hub/db'
import { hoursLabel } from '../../lib/hub/format'
import { PageHeading } from '../../components/hub/ui'
import { cn } from '../../lib/utils'
import HubLoading from '../../components/hub/HubLoading'

export default function TeacherDashboard() {
  const [studentCount, setStudentCount] = useState(0)
  const [pendingCount, setPendingCount] = useState(0)
  const [approvedTotal, setApprovedTotal] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      setLoading(true)
      try {
        const [students, queue, logs] = await Promise.all([
          getStudents(),
          getApprovalQueue(),
          getAllLogs(),
        ])
        if (cancelled) return
        setStudentCount(students.length)
        setPendingCount(queue.length)
        setApprovedTotal(approvedHours(logs))
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  if (loading) return <HubLoading />

  return (
    <div>
      <PageHeading eyebrow="Teacher" title="Overview" />

      <div className="grid grid-cols-3 gap-3 mb-8">
        <Stat label="Students" value={String(studentCount)} />
        <Stat label="Awaiting approval" value={String(pendingCount)} />
        <Stat label="Approved hrs (all)" value={hoursLabel(approvedTotal)} />
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <ActionCard
          to="/hub/teacher/roster"
          icon={Users}
          title="Roster"
          desc="All students and their approved internship hours. Export to CSV."
        />
        <ActionCard
          to="/hub/teacher/internship"
          icon={ClipboardCheck}
          title="Internship Approvals"
          desc="Review and approve logged hours."
          badge={pendingCount > 0 ? String(pendingCount) : undefined}
        />
        <ActionCard
          to="/hub/teacher/todos"
          icon={ListTodo}
          title="To-Dos"
          desc="Post weekly to-dos to the student dashboard."
        />
        <ActionCard
          icon={FolderCog}
          title="Content CMS"
          desc="Author courses, modules, and items."
          comingSoon="Phase 2"
        />
        <ActionCard
          icon={FileCheck2}
          title="Submissions"
          desc="Review native submissions with a rubric."
          comingSoon="Phase 4"
        />
      </div>
    </div>
  )
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="card-dark p-4 text-center">
      <div className="text-2xl font-black">{value}</div>
      <div className="text-[10px] uppercase tracking-[0.12em] text-ink-muted">{label}</div>
    </div>
  )
}

function ActionCard({
  to,
  icon: Icon,
  title,
  desc,
  badge,
  comingSoon,
}: {
  to?: string
  icon: typeof Users
  title: string
  desc: string
  badge?: string
  comingSoon?: string
}) {
  const inner = (
    <div
      className={cn(
        'card-dark red-card-edge p-5 h-full',
        to ? 'card-lift' : 'opacity-60'
      )}
    >
      <div className="flex items-start justify-between">
        <Icon className="w-5 h-5 text-brand-red" />
        {badge && (
          <span className="inline-flex items-center justify-center min-w-[22px] h-[22px] px-1.5 rounded-full bg-brand-red text-white text-xs font-bold">
            {badge}
          </span>
        )}
        {comingSoon && (
          <span className="text-[10px] uppercase tracking-[0.12em] text-ink-faint border border-white/10 rounded-full px-2 py-0.5">
            {comingSoon}
          </span>
        )}
      </div>
      <h3 className="mt-3 font-headline font-black uppercase tracking-[0.04em]">{title}</h3>
      <p className="mt-1 text-sm text-ink-muted">{desc}</p>
    </div>
  )
  return to ? (
    <Link to={to} className="block">
      {inner}
    </Link>
  ) : (
    inner
  )
}
