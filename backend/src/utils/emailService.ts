import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendEnrollmentEmail = async (email: string, name: string, tempPassword: string) => {
  const mailOptions = {
    from: `"ExamPro Support" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Welcome to ExamPro – Your Academic Portal is Ready!",
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e2e8f0; rounded: 10px;">
        <h2 style="color: #4f46e5;">Hello, ${name}!</h2>
        <p>An administrator has enrolled you into the <strong>ExamPro – Online Quiz & Exam Platform</strong>.</p>
        <p>Your account is now active. Please use the following temporary credentials to log in and set your personal password:</p>
        <div style="background-color: #f8fafc; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <p style="margin: 0;"><strong>Email:</strong> ${email}</p>
          <p style="margin: 5px 0 0 0;"><strong>Temporary Password:</strong> <code style="background: #e2e8f0; padding: 2px 6px; border-radius: 4px;">${tempPassword}</code></p>
        </div>
        <a href="${process.env.FRONTEND_URL}/login" style="display: inline-block; background-color: #4f46e5; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold;">Login to ExamPro</a>
        <p style="margin-top: 30px; font-size: 12px; color: #64748b;">If you didn't expect this email, please contact your institution's administrator.</p>
      </div>
    `,
  };

  return transporter.sendMail(mailOptions);
};
