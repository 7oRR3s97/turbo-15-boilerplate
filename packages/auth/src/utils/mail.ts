import { Resend } from "resend";

import { env } from "@packages/env";

const resend = new Resend(env.RESEND_TOKEN);

const domain = env.RESEND_FROM;

export const sendTwoFactorTokenEmail = async ({
  email,
  token,
}: {
  email: string;
  token: string;
}) => {
  await resend.emails.send({
    from: "mail@boilerplate.digital",
    to: email,
    subject: "2FA Code",
    html: `<p>Your 2FA code: ${token}</p>`,
  });
};

export const sendPasswordResetEmail = async ({
  email,
  token,
}: {
  email: string;
  token: string;
}) => {
  const tokenConfirmation = env.RESET_PASSWORD_METHOD === "token";
  const resetLink = `${domain}/auth/new-password?token=${token}`;
  const resetBody = tokenConfirmation
    ? `<p>The code to reset your password is: ${token}</p>`
    : `<p>Click <a href="${resetLink}">here</a> to reset password.</p>`;

  await resend.emails.send({
    from: "mail@boilerplate.digital",
    to: email,
    subject: "Reset your password",
    html: resetBody,
  });
};

export const sendVerificationEmail = async ({
  email,
  token,
}: {
  email: string;
  token: string;
}) => {
  const tokenConfirmation = env.EMAIL_CONFIRMATION_METHOD === "token";
  const confirmLink = `${domain}/auth/new-verification-email?token=${token}`;
  const confirmBody = tokenConfirmation
    ? `<p>The code to confirm your email is: ${token}</p>`
    : `<p>Click <a href="${confirmLink}">here</a> to confirm email.</p>`;

  await resend.emails.send({
    from: "mail@auth-masterclass-tutorial.com",
    to: email,
    subject: "Confirm your email",
    html: confirmBody,
  });
};

export const subscribeEmail = async ({
  email,
  firstName,
  lastName,
}: {
  email: string;
  firstName?: string;
  lastName?: string;
}) => {
  const response = await resend.contacts.create({
    email,
    firstName,
    lastName,
    unsubscribed: false,
    audienceId: env.RESEND_AUDIENCE_ID,
  });
  if (response.error) {
    throw new Error("Error subscribing to email");
  }
};
