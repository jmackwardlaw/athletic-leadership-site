import { Document, Page, Text, View, StyleSheet, pdf } from '@react-pdf/renderer'
import { Submission, formatSubmittedAt } from '../lib/admin'

// ── Colors ────────────────────────────────────────────────────────────────────
const COLOR = {
  red: '#d81300',
  black: '#0d0d0d',
  gray: '#4a4a4a',
  grayLight: '#8a8a8a',
  rule: '#d0d0d0',
}

const PDF_STATUS: Record<string, { bg: string; text: string }> = {
  Pending:     { bg: '#e5e7eb', text: '#1f2937' },
  Reviewed:    { bg: '#dbeafe', text: '#1e3a8a' },
  Admitted:    { bg: '#dcfce7', text: '#14532d' },
  Waitlisted:  { bg: '#fef3c7', text: '#78350f' },
  Conditional: { bg: '#f3e8ff', text: '#581c87' },
  Rejected:    { bg: '#fee2e2', text: '#7f1d1d' },
}

const QUESTIONS = [
  'Describe a time you took responsibility for something that went wrong — in school, sports, or life. What did you do?',
  'Why do you want to be part of the Athletic Leadership program? What do you hope to contribute — not just gain?',
  "Describe someone you consider a great leader in athletics. It doesn't have to be a famous person. What makes them effective?",
  'Have you ever received criticism or feedback that was hard to hear? How did you respond?',
  'Athletic programs need people in many roles — marketing, operations, management, media, and more. Which area interests you most and why?',
  'What does respect look like in an athletic environment — toward coaches, teammates, opponents, and officials?',
  'Is there anything in your background — behavior, grades, or attendance — we should know about? If so, how have you addressed it?',
]

// ── Styles ────────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  page: {
    fontFamily: 'Helvetica',
    fontSize: 9.5,
    color: COLOR.black,
    paddingTop: 0,
    paddingBottom: 40,
    paddingHorizontal: 40,
    lineHeight: 1.45,
  },

  // Compact letterhead (single strip across top)
  letterhead: {
    backgroundColor: COLOR.red,
    color: '#ffffff',
    marginLeft: -40,
    marginRight: -40,
    paddingVertical: 10,
    paddingHorizontal: 40,
    marginBottom: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  letterheadTitle: {
    fontFamily: 'Helvetica-Bold',
    fontSize: 11,
    letterSpacing: 2,
    color: '#ffffff',
  },
  letterheadSub: {
    fontSize: 8,
    color: '#ffffff',
    letterSpacing: 1,
    opacity: 0.92,
  },

  // Applicant header row
  headerRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  applicantName: {
    fontFamily: 'Helvetica-Bold',
    fontSize: 20,
    color: COLOR.black,
    letterSpacing: 0.5,
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingVertical: 2,
    paddingHorizontal: 7,
    fontSize: 8,
    fontFamily: 'Helvetica-Bold',
    letterSpacing: 1.2,
  },
  submittedLine: {
    fontSize: 8.5,
    color: COLOR.gray,
    marginBottom: 10,
  },

  // Four-column info row
  infoRow: {
    flexDirection: 'row',
    marginBottom: 10,
    paddingVertical: 6,
    borderTopWidth: 0.5,
    borderTopColor: COLOR.rule,
    borderBottomWidth: 0.5,
    borderBottomColor: COLOR.rule,
  },
  infoCol: {
    flex: 1,
    paddingRight: 8,
  },
  infoLabel: {
    fontSize: 6.5,
    fontFamily: 'Helvetica-Bold',
    color: COLOR.grayLight,
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    marginBottom: 1,
  },
  infoValue: {
    fontSize: 9,
    color: COLOR.black,
  },

  // Review metadata inline
  reviewLine: {
    fontSize: 8,
    color: COLOR.gray,
    marginBottom: 10,
    fontFamily: 'Helvetica-Oblique',
  },

  // Section titles
  sectionTitle: {
    fontFamily: 'Helvetica-Bold',
    fontSize: 8.5,
    color: COLOR.red,
    textTransform: 'uppercase',
    letterSpacing: 2,
    marginTop: 8,
    marginBottom: 6,
    paddingBottom: 3,
    borderBottomWidth: 0.75,
    borderBottomColor: COLOR.red,
  },

  // Q&A blocks
  essayBlock: {
    marginBottom: 10,
  },
  essayHeader: {
    flexDirection: 'row',
    marginBottom: 2,
  },
  essayNum: {
    fontFamily: 'Helvetica-Bold',
    color: COLOR.red,
    fontSize: 9,
    marginRight: 5,
  },
  essayPrompt: {
    fontFamily: 'Helvetica-Oblique',
    fontSize: 8.5,
    color: COLOR.gray,
    flex: 1,
    lineHeight: 1.35,
  },
  essayAnswer: {
    fontSize: 9.5,
    color: COLOR.black,
    lineHeight: 1.5,
    marginTop: 1,
  },

  // Reviewer notes
  notesBox: {
    borderWidth: 0.75,
    borderColor: COLOR.rule,
    padding: 8,
    minHeight: 28,
    marginBottom: 8,
  },
  notesText: {
    fontSize: 9.5,
    color: COLOR.black,
    lineHeight: 1.5,
  },
  notesEmpty: {
    color: COLOR.grayLight,
    fontSize: 9,
    fontFamily: 'Helvetica-Oblique',
  },

  // Decision row
  decisionRow: {
    flexDirection: 'row',
    marginBottom: 12,
    marginTop: 4,
  },
  decisionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 18,
  },
  checkBox: {
    width: 11,
    height: 11,
    borderWidth: 1,
    borderColor: COLOR.black,
    marginRight: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkMark: {
    fontSize: 10,
    fontFamily: 'Helvetica-Bold',
    color: COLOR.red,
    lineHeight: 1,
    marginTop: -1,
  },
  decisionLabel: {
    fontSize: 9,
    fontFamily: 'Helvetica-Bold',
    letterSpacing: 1,
  },

  // Signatures — two columns side by side
  sigGrid: {
    flexDirection: 'row',
    marginTop: 4,
    marginBottom: 10,
  },
  sigCell: {
    flex: 1,
    paddingRight: 14,
  },
  sigLine: {
    borderBottomWidth: 0.75,
    borderBottomColor: COLOR.black,
    height: 18,
    paddingLeft: 2,
    justifyContent: 'flex-end',
  },
  sigName: {
    fontFamily: 'Helvetica',
    fontSize: 10,
    color: COLOR.black,
  },
  sigCaption: {
    fontSize: 7,
    color: COLOR.gray,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginTop: 2,
  },
  sigSubline: {
    fontSize: 7.5,
    color: COLOR.gray,
    marginTop: 2,
  },

  // Commitments — compact block, kept together on one page
  commitmentsBlock: {
    marginTop: 10,
    paddingTop: 6,
    borderTopWidth: 0.5,
    borderTopColor: COLOR.rule,
  },
  commitment: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  commitmentCheck: {
    color: COLOR.red,
    fontFamily: 'Helvetica-Bold',
    fontSize: 9,
    marginRight: 5,
    lineHeight: 1,
  },
  commitmentText: {
    fontSize: 8,
    color: COLOR.gray,
    lineHeight: 1.4,
    flex: 1,
  },

  // Footer (fixed on every auto-generated page)
  footer: {
    position: 'absolute',
    bottom: 18,
    left: 40,
    right: 40,
    flexDirection: 'row',
    justifyContent: 'space-between',
    fontSize: 6.5,
    color: COLOR.grayLight,
  },
})

interface PdfProps {
  submission: Submission
  reviewerName?: string
}

// ── PDF component ─────────────────────────────────────────────────────────────
function ApplicationPdf({ submission: s, reviewerName }: PdfProps) {
  const fullName = `${s.first_name} ${s.last_name}`.trim() || 'Unnamed Applicant'
  const statusColor = PDF_STATUS[s.status] || PDF_STATUS.Pending
  const reviewer = reviewerName || s.reviewed_by || ''
  const now = new Date()
  const generatedAt = now.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    timeZone: 'America/New_York',
  })

  const responses = [s.q1, s.q2, s.q3, s.q4, s.q5, s.q6, s.q7]

  return (
    <Document
      title={`Athletic Leadership Application — ${fullName}`}
      author="Palmetto High School Athletic Leadership"
      subject="2026-2027 Application"
    >
      <Page size="LETTER" style={styles.page} wrap>
        {/* Letterhead */}
        <View style={styles.letterhead} fixed>
          <Text style={styles.letterheadTitle}>
            ATHLETIC LEADERSHIP APPLICATION 2026–2027
          </Text>
          <Text style={styles.letterheadSub}>PALMETTO HIGH SCHOOL</Text>
        </View>

        {/* Applicant header */}
        <View style={styles.headerRow}>
          <Text style={styles.applicantName}>{fullName.toUpperCase()}</Text>
          <Text
            style={[
              styles.statusBadge,
              { backgroundColor: statusColor.bg, color: statusColor.text },
            ]}
          >
            {s.status.toUpperCase()}
          </Text>
        </View>
        <Text style={styles.submittedLine}>
          {s.grade ? `${s.grade}th Grade` : ''}
          {s.grade && s.timestamp ? '   ·   ' : ''}
          Submitted {formatSubmittedAt(s.timestamp)}
        </Text>

        {/* Four-column info row */}
        <View style={styles.infoRow}>
          <View style={styles.infoCol}>
            <Text style={styles.infoLabel}>Email</Text>
            <Text style={styles.infoValue}>{s.google_email || '—'}</Text>
          </View>
          <View style={styles.infoCol}>
            <Text style={styles.infoLabel}>Phone</Text>
            <Text style={styles.infoValue}>{s.phone || '—'}</Text>
          </View>
          <View style={styles.infoCol}>
            <Text style={styles.infoLabel}>Sports</Text>
            <Text style={styles.infoValue}>{s.sports || '—'}</Text>
          </View>
          <View style={styles.infoCol}>
            <Text style={styles.infoLabel}>Activities</Text>
            <Text style={styles.infoValue}>{s.other_activities || '—'}</Text>
          </View>
        </View>

        {/* Review metadata inline */}
        {(s.reviewed_by || s.reviewed_at) && (
          <Text style={styles.reviewLine}>
            Reviewed by {s.reviewed_by || '—'}
            {s.reviewed_at ? ` on ${formatSubmittedAt(s.reviewed_at)}` : ''}
          </Text>
        )}

        {/* Essay responses */}
        <Text style={styles.sectionTitle}>Short Answer Responses</Text>
        {QUESTIONS.map((prompt, i) => {
          const answer = (responses[i] || '').trim() || '—'
          return (
            <View key={i} style={styles.essayBlock} wrap>
              <View style={styles.essayHeader}>
                <Text style={styles.essayNum}>Q{i + 1}.</Text>
                <Text style={styles.essayPrompt}>{prompt}</Text>
              </View>
              <Text style={styles.essayAnswer}>{answer}</Text>
            </View>
          )
        })}

        {/* Reviewer notes */}
        <Text style={styles.sectionTitle}>Reviewer Notes</Text>
        <View style={styles.notesBox} wrap={false}>
          {s.notes && s.notes.trim() ? (
            <Text style={styles.notesText}>{s.notes}</Text>
          ) : (
            <Text style={styles.notesEmpty}>No typed notes on file.</Text>
          )}
        </View>

        {/* Decision + signatures + commitments — keep together */}
        <View wrap={false}>
          <Text style={styles.sectionTitle}>Decision</Text>
          <View style={styles.decisionRow}>
            {(['Admitted', 'Waitlisted', 'Conditional', 'Rejected'] as const).map(opt => (
              <View key={opt} style={styles.decisionItem}>
                <View style={styles.checkBox}>
                  {s.status === opt && <Text style={styles.checkMark}>✓</Text>}
                </View>
                <Text style={styles.decisionLabel}>{opt.toUpperCase()}</Text>
              </View>
            ))}
          </View>

          <View style={styles.sigGrid}>
            <View style={styles.sigCell}>
              <View style={styles.sigLine}>
                {reviewer ? <Text style={styles.sigName}>{reviewer}</Text> : null}
              </View>
              <Text style={styles.sigCaption}>Reviewer Signature</Text>
              <Text style={styles.sigSubline}>
                {reviewer || 'Name'} — Instructor, Athletic Leadership
              </Text>
              <Text style={styles.sigSubline}>
                Date:{' '}
                {s.reviewed_at ? formatSubmittedAt(s.reviewed_at) : '___________________'}
              </Text>
            </View>
            <View style={styles.sigCell}>
              <View style={styles.sigLine} />
              <Text style={styles.sigCaption}>Second Signature (Optional)</Text>
              <Text style={styles.sigSubline}>Name: ___________________________</Text>
              <Text style={styles.sigSubline}>Title: ____________________________</Text>
              <Text style={styles.sigSubline}>Date: ____________________________</Text>
            </View>
          </View>

          <View style={styles.commitmentsBlock}>
            <Text
              style={[
                styles.sectionTitle,
                { borderBottomWidth: 0, paddingBottom: 0, marginBottom: 4, marginTop: 0 },
              ]}
            >
              Commitments Acknowledged by Applicant
            </Text>
            {[
              'Athletic Leadership is a real commitment — members show up, work hard, and are reliable before, during, and after athletic events.',
              'Students complete an internship with a school athletic program and may be required to attend events outside regular school hours.',
              "Participation requires professional behavior, respect for coaches and staff, and commitment to Palmetto's athletic culture. Enrollment can be revoked.",
            ].map((text, i) => (
              <View key={i} style={styles.commitment}>
                <Text style={styles.commitmentCheck}>✓</Text>
                <Text style={styles.commitmentText}>{text}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Footer on every auto-paginated page */}
        <View style={styles.footer} fixed>
          <Text>{fullName} · Athletic Leadership 2026–2027</Text>
          <Text
            render={({ pageNumber, totalPages }) =>
              `Generated ${generatedAt}  ·  Page ${pageNumber} of ${totalPages}`
            }
          />
        </View>
      </Page>
    </Document>
  )
}

// ── Public: download single PDF ───────────────────────────────────────────────
export async function generateApplicationPdf(
  submission: Submission,
  reviewerName?: string,
): Promise<void> {
  const blob = await pdf(
    <ApplicationPdf submission={submission} reviewerName={reviewerName} />,
  ).toBlob()

  const safeName = `${submission.first_name}_${submission.last_name}`
    .replace(/[^a-zA-Z0-9_-]/g, '')
    .replace(/_+/g, '_')
    .replace(/^_|_$/g, '') || submission.google_sub

  const filename = `AL_Application_${safeName}.pdf`

  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  setTimeout(() => {
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }, 0)
}

// ── Public: build blob for bulk ZIP ───────────────────────────────────────────
export async function buildApplicationPdfBlob(
  submission: Submission,
  reviewerName?: string,
): Promise<Blob> {
  return pdf(
    <ApplicationPdf submission={submission} reviewerName={reviewerName} />,
  ).toBlob()
}

export default ApplicationPdf
