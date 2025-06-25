import { getDB } from '@/app/api/admin/app';
import type { IOrganisation } from '@/contexts/OrganisationContext/OrganisationContext';
import type { UserRecord } from 'firebase-admin/auth';
import FormData from 'form-data'; // or built-in FormData
import Mailgun from 'mailgun.js';

export const sendResetMail = async ({
  user,
  emailVerificationLink,
  organisationId,
}: {
  user: UserRecord;
  emailVerificationLink: string;
  organisationId: string;
}): Promise<void> => {
  const apiKey = process.env.MAILGUN_APIKEY;

  if (!apiKey) {
    throw new Error('MAILGUN_APIKEY is not set');
  }

  if (!user.email) {
    throw new Error('No email found for user');
  }

  const snapshot = await getDB()
    .ref(`/organisationsData/${organisationId}`)
    .once('value');
  const organisation = snapshot.toJSON() as IOrganisation;

  if (!organisation) {
    throw new Error('Organisation not found');
  }

  const url = new URL(emailVerificationLink);
  const oobCode = url.searchParams.get('oobCode');

  const link = `${Object.entries(organisation.domains)[0][1].value}/forgot-password?oobCode=${oobCode}`;

  const mailgun = new Mailgun(FormData);
  const mg = mailgun.client({ username: 'api', key: apiKey });
  try {
    const data = await mg.messages.create(
      `sandbox5b28a024a9a040a69e7a8dcc71ea51ed.mailgun.org`,
      {
        from: `${organisation.name} <${organisation.sendEmail}>`,
        to: user.email,
        subject: `reset your password for ${organisation.name}`,
        text: `Hello ${user.email},\n\nPlease reset your password by clicking the link below:\n\n${link}\n\nThank you!`,
        html: `<p>Hello ${user.email},</p><p>Please reset your password by clicking the link below:</p><p><a href="${link}">Reset Password</a></p><p>Thank you!</p>`,
        'h:Reply-To': organisation.sendEmail,
        'v:organisationName': organisation.name,
        'v:userEmail': user.email,
      },
    );

    console.log(data); // logs response data
  } catch (error) {
    console.log(error); //logs any error
  }
};
