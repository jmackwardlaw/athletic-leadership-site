import { Document, Page, Text, View, StyleSheet, pdf } from '@react-pdf/renderer'
import { Submission, formatSubmittedAt } from '../lib/admin'

// ── Colors (PDF can't reference CSS tokens, so we repeat them here) ───────────
const COLOR = {
  red: '#d81300',
  black: '#0d0d0d',
  gray: '#4a4a4a',
  grayLight: '#8a8a8a',
  rule: '#cccccc',
}

// Status → pill colors for the PDF
const PDF_STATUS: Record<string, { bg: string; text: string }> = {
  Pending:     { bg: '#e5e7eb', text: '#1f2937' },
  Reviewed:    { bg: '#dbeafe', text: '#1e3a8a' },
  Admitted:    { bg: '#dcfce7', text: '#14532d' },
  Waitlisted:  { bg: '#fef3c7', text: '#78350f' },
  Conditional: { bg: '#f3e8ff', text: '#581c87' },
  Rejected:    { bg: '#fee2e2', text: '#7f1d1d' },
}

const QUESTIONS = [
  "Describe a time you took responsibility for something that went wrong — in school, sports, or life. What did you do?",
  "Why do you want to be part of the Athletic Leadership program? What do you hope to contribute — not just gain?",
  "Describe someone you consider a great leader in athletics. It doesn't have to be a famous person. What makes them effective?",
  "Have you ever received criticism or feedback that was hard to hear? How did you respond?",
  "Athletic programs need people in many roles — marketing, operations, management, media, and more. Which area interests you most and why?",
  "What does respect look like in an athletic environment — toward coaches, teammates, opponents, and officials?",
  "Is there anything in your background — behavior, grades, or attendance — we should know about? If so, how have you addressed it?",
]

// ── Styles ─────────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  page: {
    fontFamily: 'Helvetica',
    fontSize: 10,
    color: COLOR.black,
    paddingTop: 0,
    paddingBottom: 50,
    paddingHorizontal: 50,
    lineHeight: 1.5,
  },

  // Letterhead
  letterheadBar: {
    backgroundColor: COLOR.red,
    color: '#ffffff',
    marginLeft: -50,
    marginRight: -50,
    paddingVertical: 18,
    paddingHorizontal: 50,
    marginBottom: 28,
  },
  letterheadBarCompact: {
    paddingVertical: 10,
    marginBottom: 18,
  },
  letterheadTitle: {
    fontFamily: 'Helvetica-Bold',
    fontSize: 14,
    letterSpacing: 2,
    marginBottom: 4,
    color: '#ffffff',
  },
  letterheadTitleCompact: {
    fontSize: 11,
    marginBottom: 0,
  },
  letterheadSchool: {
    fontSize: 10,
    marginBottom: 1,
    color: '#ffffff',
  },
  letterheadDistrict: {
    fontSize: 9,
    color: '#ffffff',
    opacity: 0.9,
  },

  // Applicant header
  applicantBlock: { marginBottom: 20 },
  applicantName: {
    fontFamily: 'Helvetica-Bold',
    fontSize: 22,
    color: COLOR.black,
    marginBottom: 4,
    letterSpacing: 1,
  },
  applicantMeta: {
    fontSize: 10,
    color: COLOR.gray,
    marginBottom: 10,
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingVertical: 3,
    paddingHorizontal: 10,
    fontSize: 9,
    fontFamily: 'Helvetica-Bold',
    letterSpacing: 1.5,
  },

  // Section heading
  sectionTitle: {
    fontFamily: 'Helvetica-Bold',
    fontSize: 9,
    color: COLOR.red,
    textTransform: 'uppercase',
    letterSpacing: 2,
    marginTop: 14,
    marginBottom: 8,
    paddingBottom: 4,
    borderBottomWidth: 1,
    borderBottomColor: COLOR.red,
  },

  // Info grid
  infoGrid: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 18 },
  infoCell: { width: '50%', paddingRight: 14, marginBottom: 10 },
  infoLabel: {
    fontSize: 7,
    fontFamily: 'Helvetica-Bold',
    color: COLOR.grayLight,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    marginBottom: 2,
  },
  infoValue: { fontSize: 10, color: COLOR.black },

  // Essays
  essayBlock: { marginBottom: 18 },
  essayHeader: { flexDirection: 'row', marginBottom: 4 },
  essayNum: {
    fontFamily: 'Helvetica-Bold',
    color: COLOR.red,
    fontSize: 10,
    marginRight: 6,
  },
  essayPrompt: {
    fontFamily: 'Helvetica-Oblique',
    fontSize: 9,
    color: COLOR.gray,
    flex: 1,
    lineHeight: 1.4,
  },
  essayAnswer: {
    fontSize: 10,
    color: COLOR.black,
    lineHeight: 1.6,
    marginBottom: 4,
    marginTop: 2,
  },
  essayMeta: {
    fontSize: 7,
    color: COLOR.grayLight,
    textAlign: 'right',
  },

  // Decision / signatures
  notesBox: {
    borderWidth: 1,
    borderColor: COLOR.rule,
    padding: 10,
    minHeight: 60,
    marginBottom: 12,
  },
  notesBoxEmpty: {
    borderWidth: 1,
    borderColor: COLOR.rule,
    padding: 10,
    height: 80,
    marginBottom: 20,
  },
  decisionRow: {
    flexDirection: 'row',
    marginBottom: 24,
    marginTop: 4,
  },
  decisionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 22,
  },
  checkBox: {
    width: 14,
    height: 14,
    borderWidth: 1.2,
    borderColor: COLOR.black,
    marginRight: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkMark: {
    fontSize: 12,
    fontFamily: 'Helvetica-Bold',
    color: COLOR.red,
    lineHeight: 1,
    marginTop: -2,
  },
  decisionLabel: {
    fontSize: 10,
    fontFamily: 'Helvetica-Bold',
    letterSpacing: 1,
  },
  sigBlock: { marginTop: 20, marginBottom: 20 },
  sigLine: {
    borderBottomWidth: 1,
    borderBottomColor: COLOR.black,
    height: 24,
    marginBottom: 4,
    paddingLeft: 2,
    justifyContent: 'flex-end',
  },
  sigName: {
    fontFamily: 'Helvetica',
    fontSize: 11,
    color: COLOR.black,
  },
  sigCaption: {
    fontSize: 8,
    color: COLOR.gray,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  sigSubtext: {
    fontSize: 8,
    color: COLOR.gray,
    marginTop: 3,
  },

  // Commitments block
  commitmentsBlock: {
    marginTop: 24,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: COLOR.rule,
  },
  commitment: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  commitmentCheck: {
    color: COLOR.red,
    fontFamily: 'Helvetica-Bold',
    fontSize: 11,
    marginRight: 8,
    lineHeight: 1,
  },
  commitmentText: {
    fontSize: 9,
    color: COLOR.gray,
    lineHeight: 1.5,
    flex: 1,
  },

  // Footer
  footer: {
    position: 'absolute',
    bottom: 20,
    left: 50,
    right: 50,
    flexDirection: 'row',
    justifyContent: 'space-between',
    fontSize: 7,
    color: COLOR.grayLight,
  },
})

interface PdfProps {
  submission: Submission
  reviewerName?: string
}

// ── PDF component ──────────────────────────────────────────────────────────────
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
      {/* Page 1 — Letterhead + applicant summary */}
      <Page size="LETTER" style={styles.page}>
        <View style={styles.letterheadBar}>
          <Text style={styles.letterheadTitle}>ATHLETIC LEADERSHIP APPLICATION 2026-2027</Text>
          <Text style={styles.letterheadSchool}>Palmetto High School</Text>
          <Text style={styles.letterheadDistrict}>Anderson School District One</Text>
        </View>

        <View style={styles.applicantBlock}>
          <Text style={styles.applicantName}>{fullName.toUpperCase()}</Text>
          <Text style={styles.applicantMeta}>
            {s.grade ? `${s.grade}th Grade` : ''}
            {s.grade && s.timestamp ? '   ·   ' : ''}
            Submitted {formatSubmittedAt(s.timestamp)}
          </Text>
          <Text
            style={[
              styles.statusBadge,
              { backgroundColor: statusColor.bg, color: statusColor.text },
            ]}
          >
            {s.status.toUpperCase()}
          </Text>
        </View>

        <Text style={styles.sectionTitle}>Applicant Information</Text>
        <View style={styles.infoGrid}>
          <InfoCell label="Email (Google-verified)" value={s.google_email || '—'} />
          <InfoCell label="Phone" value={s.phone || '—'} />
          <InfoCell label="Sports / Athletic Programs" value={s.sports || '—'} />
          <InfoCell label="Other Clubs & Activities" value={s.other_activities || '—'} />
        </View>

        {(s.reviewed_by || s.reviewed_at) && (
          <>
            <Text style={styles.sectionTitle}>Review Metadata</Text>
            <View style={styles.infoGrid}>
              <InfoCell label="Reviewed By" value={s.reviewed_by || '—'} />
              <InfoCell
                label="Reviewed At"
                value={s.reviewed_at ? formatSubmittedAt(s.reviewed_at) : '—'}
              />
            </View>
          </>
        )}

        <FooterBlock applicantName={fullName} generatedAt={generatedAt} />
      </Page>

      {/* Page 2+ — Essay responses (auto page-breaks) */}
      <Page size="LETTER" style={styles.page}>
        <View style={[styles.letterheadBar, styles.letterheadBarCompact]}>
          <Text style={[styles.letterheadTitle, styles.letterheadTitleCompact]}>
            ATHLETIC LEADERSHIP APPLICATION 2026-2027
          </Text>
        </View>
        <Text style={styles.sectionTitle}>Short Answer Responses</Text>

        {QUESTIONS.map((prompt, i) => {
          const answer = (responses[i] || '').trim() || '—'
          return (
            <View key={i} style={styles.essayBlock} wrap={true}>
              <View style={styles.essayHeader}>
                <Text style={styles.essayNum}>Q{i + 1}.</Text>
                <Text style={styles.essayPrompt}>{prompt}</Text>
              </View>
              <Text style={styles.essayAnswer}>{answer}</Text>
              <Text style={styles.essayMeta}>{answer.length} characters</Text>
            </View>
          )
        })}

        <FooterBlock applicantName={fullName} generatedAt={generatedAt} />
      </Page>

      {/* Final page — Reviewer notes + decision + signatures + commitments */}
      <Page size="LETTER" style={styles.page}>
        <View style={[styles.letterheadBar, styles.letterheadBarCompact]}>
          <Text style={[styles.letterheadTitle, styles.letterheadTitleCompact]}>
            ATHLETIC LEADERSHIP APPLICATION 2026-2027
          </Text>
        </View>

        <Text style={styles.sectionTitle}>Reviewer Notes</Text>
        <View style={styles.notesBox}>
          {s.notes && s.notes.trim() ? (
            <Text style={styles.essayAnswer}>{s.notes}</Text>
          ) : (
            <Text
              style={{
                color: COLOR.grayLight,
                fontSize: 9,
                fontFamily: 'Helvetica-Oblique',
              }}
            >
              No typed notes on file.
            </Text>
          )}
        </View>

        <Text style={[styles.infoLabel, { marginTop: 12 }]}>
          Additional Notes (Handwritten)
        </Text>
        <View style={styles.notesBoxEmpty} />

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

        {/* Signatures */}
        <View style={styles.sigBlock}>
          <View style={styles.sigLine}>
            {reviewer ? <Text style={styles.sigName}>{reviewer}</Text> : null}
          </View>
          <Text style={styles.sigCaption}>Reviewer Signature</Text>
          <Text style={styles.sigSubtext}>
            {reviewer || 'Name'} — Instructor, Athletic Leadership
          </Text>
          <Text style={styles.sigSubtext}>
            Date:{' '}
            {s.reviewed_at
              ? formatSubmittedAt(s.reviewed_at)
              : '_______________________________'}
          </Text>

          <View style={{ height: 24 }} />

          <View style={styles.sigLine} />
          <Text style={styles.sigCaption}>Second Signature (Optional)</Text>
          <Text style={styles.sigSubtext}>
            Name: ________________________________   Title: ________________________________
          </Text>
          <Text style={styles.sigSubtext}>Date: _______________________________</Text>
        </View>

        {/* Commitments */}
        <View style={styles.commitmentsBlock}>
          <Text
            style={[
              styles.sectionTitle,
              { borderBottomWidth: 0, paddingBottom: 0, marginBottom: 10 },
            ]}
          >
            Commitments Acknowledged by Applicant
          </Text>
          {[
            'Athletic Leadership is a real commitment — not just a class. Members are expected to show up, work hard, and be reliable before, during, and after athletic events.',
            'Students complete an internship with a school athletic program and may be required to attend events outside of regular school hours.',
            "Participation requires professional behavior, respect for coaches and staff, and commitment to Palmetto's athletic culture. Enrollment can be revoked.",
          ].map((text, i) => (
            <View key={i} style={styles.commitment}>
              <Text style={styles.commitmentCheck}>✓</Text>
              <Text style={styles.commitmentText}>{text}</Text>
            </View>
          ))}
        </View>

        <FooterBlock applicantName={fullName} generatedAt={generatedAt} />
      </Page>
    </Document>
  )
}

// ── Small PDF atoms ────────────────────────────────────────────────────────────
function InfoCell({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.infoCell}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  )
}

function FooterBlock({
  applicantName,
  generatedAt,
}: {
  applicantName: string
  generatedAt: string
}) {
  return (
    <View style={styles.footer} fixed>
      <Text>{applicantName} · Athletic Leadership 2026-2027</Text>
      <Text
        render={({ pageNumber, totalPages }) =>
          `Generated ${generatedAt}  ·  Page ${pageNumber} of ${totalPages}`
        }
      />
    </View>
  )
}

// ── Public API: generate PDF as a blob and trigger browser download ────────────
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

// ── Public API: generate PDF as a Blob (for bulk ZIP — used in commit 4) ───────
export async function buildApplicationPdfBlob(
  submission: Submission,
  reviewerName?: string,
): Promise<Blob> {
  return pdf(
    <ApplicationPdf submission={submission} reviewerName={reviewerName} />,
  ).toBlob()
}

export default ApplicationPdf
