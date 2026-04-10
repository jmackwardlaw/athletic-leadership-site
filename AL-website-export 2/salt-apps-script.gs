// ============================================================
//  SALT Program — Application Receiver
//  Google Apps Script Web App
//  Paste this entire file into Apps Script (script.google.com)
//  and deploy as a Web App.
// ============================================================

// ── CONFIG ──────────────────────────────────────────────────
const SHEET_NAME = 'Applications';        // Tab name in your Google Sheet
const NOTIFY_EMAIL = 'your@email.com';    // Your email for new-application alerts
const SEND_EMAIL_ALERTS = true;           // Set false to disable email notifications
// ────────────────────────────────────────────────────────────

/**
 * Handles POST requests from the SALT application form.
 * Apps Script requires doPost() for Web App POST handling.
 */
function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    appendToSheet(data);
    if (SEND_EMAIL_ALERTS) sendAlert(data);
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
 * Required for CORS preflight — Apps Script needs doGet too.
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

  // Auto-create sheet + headers if it doesn't exist
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
      'Status',          // For your review workflow: Pending / Selected / Waitlist / Not Selected
      'Notes',           // Your private notes column
    ];
    sheet.appendRow(headers);

    // Format header row
    const headerRange = sheet.getRange(1, 1, 1, headers.length);
    headerRange.setBackground('#1a1a1a');
    headerRange.setFontColor('#c8a84b');
    headerRange.setFontWeight('bold');
    headerRange.setFrozenRows(1);

    // Set column widths for readability
    sheet.setColumnWidth(1, 160);   // Timestamp
    sheet.setColumnWidth(2, 120);   // First Name
    sheet.setColumnWidth(3, 120);   // Last Name
    sheet.setColumnWidth(4, 60);    // Grade
    sheet.setColumnWidth(5, 200);   // Email
    sheet.setColumnWidth(6, 130);   // Phone
    sheet.setColumnWidth(7, 200);   // Sports
    sheet.setColumnWidth(8, 200);   // Activities
    sheet.setColumnWidth(9, 350);   // Why Interested
    sheet.setColumnWidth(10, 350);  // Strengths
    sheet.setColumnWidth(11, 180);  // Role
    sheet.setColumnWidth(12, 350);  // Scenario
    sheet.setColumnWidth(13, 300);  // Leadership
    sheet.setColumnWidth(14, 120);  // Status
    sheet.setColumnWidth(15, 250);  // Notes
  }

  // Append the new application row
  sheet.appendRow([
    data.timestamp || new Date().toLocaleString(),
    data.firstName   || '',
    data.lastName    || '',
    data.grade       || '',
    data.email       || '',
    data.phone       || '—',
    data.sportsPlayed      || '—',
    data.otherActivities   || '—',
    data.whyInterested     || '',
    data.strengthsContribute || '',
    data.roleInterest      || '',
    data.scenarioResponse  || '',
    data.leadershipExp     || '—',
    'Pending',   // Default status
    '',          // Notes (blank)
  ]);

  // Wrap text in long-answer columns
  const lastRow = sheet.getLastRow();
  sheet.getRange(lastRow, 9, 1, 5).setWrap(true);
  sheet.setRowHeight(lastRow, 21); // Keep rows compact; expand manually to read
}

/**
 * Sends an email alert to NOTIFY_EMAIL when a new application arrives.
 */
function sendAlert(data) {
  const subject = `New SALT Application — ${data.firstName} ${data.lastName} (Grade ${data.grade})`;

  const body = `
A new SALT Program application has been submitted.

──────────────────────────────
STUDENT INFORMATION
──────────────────────────────
Name:    ${data.firstName} ${data.lastName}
Grade:   ${data.grade}
Email:   ${data.email}
Phone:   ${data.phone || '—'}

──────────────────────────────
ATHLETIC BACKGROUND
──────────────────────────────
Sports:      ${data.sportsPlayed || '—'}
Activities:  ${data.otherActivities || '—'}

──────────────────────────────
ROLE INTEREST
──────────────────────────────
${data.roleInterest}

──────────────────────────────
WHY INTERESTED
──────────────────────────────
${data.whyInterested}

──────────────────────────────
STRENGTHS TO CONTRIBUTE
──────────────────────────────
${data.strengthsContribute}

──────────────────────────────
SCENARIO RESPONSE
──────────────────────────────
${data.scenarioResponse}

──────────────────────────────
LEADERSHIP EXPERIENCE
──────────────────────────────
${data.leadershipExp || '—'}

──────────────────────────────
View all applications in Google Sheets.
  `.trim();

  GmailApp.sendEmail(NOTIFY_EMAIL, subject, body);
}


// ============================================================
//  DEPLOYMENT INSTRUCTIONS
// ============================================================
//
//  1. Open script.google.com
//  2. Create a new project → paste this entire file
//  3. Update NOTIFY_EMAIL to your email address
//  4. Click "Deploy" → "New Deployment"
//     - Type: Web App
//     - Execute as: Me
//     - Who has access: Anyone
//  5. Authorize when prompted
//  6. Copy the Web App URL
//  7. In ApplicationPage.tsx, replace:
//       const APPS_SCRIPT_URL = 'YOUR_APPS_SCRIPT_WEB_APP_URL_HERE'
//     with:
//       const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/YOUR_ID/exec'
//  8. Re-bundle: bash scripts/bundle-artifact.sh
//
//  SHEET SETUP:
//  - Open any Google Sheet before deploying
//  - The script will auto-create the "Applications" tab
//    with headers and formatting on first submission
//
//  TESTING:
//  - After deploy, submit the form once in demo mode
//    to verify rows appear in the sheet
//  - Check the "Applications" tab in your Google Sheet
// ============================================================
