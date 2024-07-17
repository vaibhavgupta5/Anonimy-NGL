import { resend } from "@/lib/resend";
import { EmailTemplate } from "../../emails/VerificationEmail";

import { ApiResponse } from "@/types/ApiResponse";

// this is send email func .. got from resend email
export default async function SendVerificationEmail(
  email: string,
  username: string,
  verifyCode: string
): Promise<ApiResponse> {
  try {
    await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: email,
      subject: `Hello ${username}`,
      react: EmailTemplate({ username, otp: verifyCode }),
      text: 'it works!',
        });

    return { success: true, message: "Email send successfully" };
  } catch (error) {
    console.error("Error sending verification enail");
    return { success: false, message: "Failed to send email" };
  }
}
