// ============================================================
//  SALT Program — Application Receiver
//  Google Apps Script Web App
//  Paste this entire file into Apps Script (script.google.com)
//  and deploy as a Web App.
//  Execute as: Me | Who has access: Anyone
// ============================================================

// ── CONFIG ──────────────────────────────────────────────────
const SHEET_NAME = 'Applications';        // Tab name in your Google Sheet
const NOTIFY_EMAIL = 'wardlawj@apps.anderson1.org';    // YOUR email for new-application alerts
const SEND_ADMIN_ALERTS = true;           // Set false to disable admin email notifications
const SEND_APPLICANT_CONFIRMATION = true; // Set false to disable student receipt emails
const SCHOOL_NAME = 'Palmetto High School';
const INSTRUCTOR_NAME = 'Coach Wardlaw';
const INSTRUCTOR_EMAIL = 'wardlawj@apps.anderson1.org'; // Must match NOTIFY_EMAIL or your actual address
const PROGRAM_NAME = 'SALT Program';
// ────────────────────────────────────────────────────────────

/**
 * Handles POST requests from the SALT application form.
 */
function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    appendToSheet(data);
    if (SEND_ADMIN_ALERTS) sendAdminAlert(data);
    if (SEND_APPLICANT_CONFIRMATION && data.email) sendApplicantConfirmation(data);
    return ContentService
      .createTextOutput(JSON.stringify({ result: 'success' }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ result: 'error', message: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Required for CORS preflight.
 */
function doGet(e) {
  return ContentService
    .createTextOutput(JSON.stringify({ status: 'SALT Application endpoint active' }))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * Writes one application row to the Google Sheet.
 * Creates the sheet and header row automatically on first run.
 */
function appendToSheet(data) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);

  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    const headers = [
      'Timestamp',
      'First Name',
      'Last Name',
      'Grade',
      'Email',
      'Phone',
      'Sports / Programs',
      'Other Activities',
      'Why Interested',
      'Strengths to Contribute',
      'Role Interest',
      'Scenario Response',
      'Leadership Experience',
      'Status',    // Pending / Selected / Waitlist / Not Selected
      'Notes',
    ];
    sheet.appendRow(headers);

    const headerRange = sheet.getRange(1, 1, 1, headers.length);
    headerRange.setBackground('#1a1a1a');
    headerRange.setFontColor('#c8a84b');
    headerRange.setFontWeight('bold');
    sheet.setFrozenRows(1);

    sheet.setColumnWidth(1, 160);
    sheet.setColumnWidth(5, 220);
    sheet.setColumnWidth(9, 300);
    sheet.setColumnWidth(10, 300);
    sheet.setColumnWidth(12, 300);
    sheet.setColumnWidth(13, 250);
  }

  sheet.appendRow([
    data.timestamp || new Date().toLocaleString('en-US', { timeZone: 'America/New_York' }),
    data.firstName || '',
    data.lastName  || '',
    data.grade     || '',
    data.email     || '',
    data.phone     || '—',
    data.sportsPlayed    || '—',
    data.otherActivities || '—',
    data.whyInterested       || '',
    data.strengthsContribute || '',
    data.roleInterest        || '',
    data.scenarioResponse    || '',
    data.leadershipExp       || '—',
    'Pending',  // default Status
    '',         // Notes (blank)
  ]);
}

/**
 * Sends Mr. Wardlaw an alert email when a new application arrives.
 */
function sendAdminAlert(data) {
  const subject = `New SALT Application — ${data.firstName} ${data.lastName} (Grade ${data.grade})`;
  const body = `
New application received for the ${PROGRAM_NAME} at ${SCHOOL_NAME}.

─── APPLICANT ───────────────────────────────────
Name:   ${data.firstName} ${data.lastName}
Grade:  ${data.grade}
Email:  ${data.email}
Phone:  ${data.phone || '—'}

─── ACTIVITY BACKGROUND ─────────────────────────
Sports:      ${data.sportsPlayed || '—'}
Activities:  ${data.otherActivities || '—'}

─── ROLE INTEREST ───────────────────────────────
${data.roleInterest}

─── WHY INTERESTED ──────────────────────────────
${data.whyInterested}

─── STRENGTHS TO CONTRIBUTE ─────────────────────
${data.strengthsContribute}

─── SCENARIO RESPONSE ───────────────────────────
${data.scenarioResponse}

─── LEADERSHIP EXPERIENCE ───────────────────────
${data.leadershipExp || '—'}

─────────────────────────────────────────────────
Submitted: ${data.timestamp}

Review all applications in your Google Sheet.
`.trim();

  GmailApp.sendEmail(NOTIFY_EMAIL, subject, body);
}

/**
 * Sends the applicant a confirmation receipt email.
 */
function sendApplicantConfirmation(data) {
  const roleLabels = {
    operations:  'Operations Lead',
    media:       'Media & Content Lead',
    equipment:   'Equipment Manager',
    spirit:      'Spirit & Engagement Lead',
    development: 'Athletic Development Assistant',
    community:   'Community Relations Coordinator',
    unsure:      'Open to any role',
  };

  const roleDisplay = roleLabels[data.roleInterest] || data.roleInterest;

  const subject = `Application Received — ${PROGRAM_NAME} at ${SCHOOL_NAME}`;

  const htmlBody = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { margin: 0; padding: 0; background: #0f0f0f; font-family: Arial, sans-serif; color: #ffffff; }
    .wrapper { max-width: 580px; margin: 0 auto; background: #0f0f0f; }
    .header { background: #d81300; padding: 28px 32px; }
    .header-label { color: rgba(255,255,255,0.7); font-size: 11px; font-weight: bold; letter-spacing: 0.3em; text-transform: uppercase; margin-bottom: 6px; }
    .header-title { color: #ffffff; font-size: 22px; font-weight: 900; letter-spacing: 0.05em; text-transform: uppercase; }
    .header-sub { color: rgba(255,255,255,0.75); font-size: 12px; margin-top: 4px; }
    .body { padding: 32px; background: #111111; }
    .greeting { font-size: 16px; color: #ffffff; font-weight: 700; margin-bottom: 16px; }
    .text { font-size: 14px; color: #9ca3af; line-height: 1.7; margin-bottom: 16px; }
    .summary-box { background: #0f0f0f; border-left: 3px solid #d81300; padding: 20px 24px; margin: 24px 0; }
    .summary-label { color: #d81300; font-size: 10px; font-weight: 900; letter-spacing: 0.2em; text-transform: uppercase; margin-bottom: 14px; }
    .summary-row { display: flex; gap: 12px; margin-bottom: 10px; }
    .summary-key { color: #6b7280; font-size: 12px; font-weight: bold; width: 90px; flex-shrink: 0; }
    .summary-val { color: #ffffff; font-size: 13px; font-weight: 700; }
    .notice { background: #1a1a1a; border: 1px solid rgba(255,255,255,0.08); padding: 16px 20px; font-size: 13px; color: #6b7280; line-height: 1.6; margin: 24px 0; }
    .notice strong { color: #9ca3af; }
    .footer { background: #0a0a0a; border-top: 1px solid rgba(255,255,255,0.05); padding: 20px 32px; }
    .footer-text { font-size: 11px; color: #4b5563; line-height: 1.6; }
    .red { color: #d81300; }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="header">
      <div class="header-label">Palmetto High School · Anderson District One</div>
      <div class="header-title">SALT Program Application</div>
      <div class="header-sub">Student Athletic Leadership Team · 2026–2027</div>
    </div>
    <div class="body">
      <div class="greeting">Hey ${data.firstName} —</div>
      <p class="text">
        Your application for the <strong style="color:#ffffff">Student Athletic Leadership Team</strong> has been received.
        ${INSTRUCTOR_NAME} reviews all applications personally and will contact selected students before the 2026–2027 school year begins.
      </p>
      <p class="text">
        Not all applicants will be selected — SALT membership is limited and based on character, work ethic, and fit with Palmetto's athletic culture.
      </p>

      <div class="summary-box">
        <div class="summary-label">Your Application Summary</div>
        <div class="summary-row">
          <span class="summary-key">Name</span>
          <span class="summary-val">${data.firstName} ${data.lastName}</span>
        </div>
        <div class="summary-row">
          <span class="summary-key">Grade</span>
          <span class="summary-val">${data.grade}th Grade</span>
        </div>
        <div class="summary-row">
          <span class="summary-key">Email</span>
          <span class="summary-val">${data.email}</span>
        </div>
        <div class="summary-row">
          <span class="summary-key">Role Interest</span>
          <span class="summary-val">${roleDisplay}</span>
        </div>
        <div class="summary-row">
          <span class="summary-key">Submitted</span>
          <span class="summary-val">${data.timestamp}</span>
        </div>
      </div>

      <div class="notice">
        <strong>What happens next:</strong> ${INSTRUCTOR_NAME} will review your application along with all other submissions. 
        Selected students will be notified by email before the school year begins. If you have questions, 
        you can reply to this email or reach out directly.
      </div>

      <p class="text" style="color: #6b7280; font-size: 13px;">
        — <span class="red">${INSTRUCTOR_NAME}</span><br>
        Health & PE · Football Coach<br>
        ${SCHOOL_NAME}
      </p>
    </div>
    <div class="footer">
      <div class="footer-text">
        This confirmation was sent because you submitted an application to the ${PROGRAM_NAME} at ${SCHOOL_NAME}.<br>
        Athletic Leadership &amp; Operations · Anderson School District One
      </div>
    </div>
  </div>
</body>
</html>
  `.trim();

  // Plain text fallback
  const plainText = `
Hey ${data.firstName},

Your application for the Student Athletic Leadership Team (SALT) at ${SCHOOL_NAME} has been received.

APPLICATION SUMMARY
───────────────────
Name:         ${data.firstName} ${data.lastName}
Grade:        ${data.grade}th Grade
Email:        ${data.email}
Role Interest: ${roleDisplay}
Submitted:    ${data.timestamp}

WHAT HAPPENS NEXT
${INSTRUCTOR_NAME} reviews all applications personally. Selected students will be notified 
before the 2026–2027 school year. Not all applicants will be selected — 
SALT membership is limited and based on character, work ethic, and fit.

Questions? Reply to this email or reach out directly.

— ${INSTRUCTOR_NAME}
Health & PE · Football Coach
${SCHOOL_NAME} · Anderson School District One
  `.trim();

  GmailApp.sendEmail(
    data.email,
    subject,
    plainText,
    {
      htmlBody: htmlBody,
      replyTo: INSTRUCTOR_EMAIL,
      name: `${INSTRUCTOR_NAME} — ${SCHOOL_NAME}`,
    }
  );
}
