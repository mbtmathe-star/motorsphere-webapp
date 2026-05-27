/**
 * functions/src/utils/email.ts
 *
 * Email sending helper via Resend.
 * Full email templates implemented in Base 4.
 *
 * Resend docs: https://resend.com/docs/introduction
 * API key: RESEND_API_KEY (Firebase Secret Manager)
 *
 * Templates:
 *   welcome          — new user registration
 *   listing-live     — listing approved and published
 *   listing-rejected — listing rejected with reason
 *   new-inquiry      — seller receives an inquiry
 *   inquiry-reply    — buyer receives a reply
 *   admin-new-listing — admin notified of new pending listing
 */

import * as functions from 'firebase-functions/v2';

// TODO: import Resend client when API key is set up
// import { Resend } from 'resend';
// const resend = new Resend(process.env.RESEND_API_KEY);

const FROM_ADDRESS = 'MotorSphere <noreply@motorsphere.co.za>';

interface EmailOptions {
  to:      string;
  subject: string;
  text:    string;
  html?:   string;
}

/**
 * Send a transactional email via Resend.
 * Logs the email in development/emulator mode instead of sending.
 */
export async function sendEmail(options: EmailOptions): Promise<void> {
  const { to, subject, text } = options;

  // TODO: Replace log with actual Resend call in Base 4
  // const { data, error } = await resend.emails.send({
  //   from:    FROM_ADDRESS,
  //   to,
  //   subject,
  //   text,
  //   html:    options.html,
  // });
  // if (error) throw error;

  functions.logger.info('[sendEmail] STUB — would send:', {
    from:    FROM_ADDRESS,
    to,
    subject,
    preview: text.slice(0, 100),
  });
}

/** Welcome email sent to new users */
export async function sendWelcomeEmail(
  to: string,
  displayName: string,
): Promise<void> {
  await sendEmail({
    to,
    subject: 'Welcome to MotorSphere',
    text: [
      `Hi ${displayName},`,
      '',
      'Welcome to MotorSphere — South Africa\'s automotive marketplace.',
      '',
      'You can now browse vehicles and parts, or list your own.',
      '',
      'If you have any questions, reply to this email.',
      '',
      'The MotorSphere Team',
    ].join('\n'),
  });
}

/** Admin notification when a new listing is submitted for review */
export async function sendAdminNewListingEmail(
  listingTitle: string,
  listingId:    string,
  listingType:  'vehicle' | 'part',
): Promise<void> {
  await sendEmail({
    to:      'admin@motorsphere.co.za', // TODO: use env var or Firestore config
    subject: `[ADMIN] New ${listingType} listing pending review`,
    text: [
      `New ${listingType} listing submitted for review.`,
      '',
      `Title: ${listingTitle}`,
      `ID:    ${listingId}`,
      '',
      'Review at: https://motorsphere.co.za/admin/listings',
    ].join('\n'),
  });
}

/** Email seller when their listing is approved */
export async function sendListingLiveEmail(
  to:           string,
  listingTitle: string,
  listingUrl:   string,
): Promise<void> {
  await sendEmail({
    to,
    subject: 'Your listing is live on MotorSphere',
    text: [
      `Great news! Your listing "${listingTitle}" is now live.`,
      '',
      `View your listing: ${listingUrl}`,
      '',
      'The MotorSphere Team',
    ].join('\n'),
  });
}

/** Email seller when their listing is rejected */
export async function sendListingRejectedEmail(
  to:             string,
  listingTitle:   string,
  rejectionNote:  string,
  editUrl:        string,
): Promise<void> {
  await sendEmail({
    to,
    subject: 'Update needed on your MotorSphere listing',
    text: [
      `Your listing "${listingTitle}" needs some changes before it can go live.`,
      '',
      `Reason: ${rejectionNote}`,
      '',
      `Edit your listing: ${editUrl}`,
      '',
      'The MotorSphere Team',
    ].join('\n'),
  });
}
