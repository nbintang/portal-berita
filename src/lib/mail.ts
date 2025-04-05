import { generateEmailComponents } from "@/components/Email";
import type { EmailConfig } from "next-auth/providers/email";
import { createTransport } from "nodemailer";
import type { VerificationToken } from "next-auth/adapters";
import { db } from "@/server/db";

export const sendVerificationRequest = async (
  params: Parameters<EmailConfig["sendVerificationRequest"]>[0],
) => {
  console.log("Sending verification request", params);
  const {
    identifier,
    url,
    provider: { server, from },
  } = params;

  const newUrl = new URL(url);
  const otp = newUrl.searchParams.get("otp") ?? "123456";
  if (!otp) throw new Error("Missing OTP");

  const host = newUrl.host;
  const { html, text } = generateEmailComponents({ url, host });
  const transport = createTransport(server);

  const res = await transport.sendMail({
    to: identifier,
    from,
    subject: `Sign in to ${host}`,
    html: await html(otp),
    text,
  });

  const isFailed = res.rejected.length > 0;
  if (isFailed) throw new Error("Email failed to send");
};
export const generateVerificationToken = async () => Math.floor(100000 + Math.random() * 900000).toString();
