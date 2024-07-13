import * as React from 'react';
//this is email template that we will use to send otp.. got this from resend doc.. can use react-form too
interface EmailTemplateProps {
  username: string;
  otp: string;
}

export const EmailTemplate: React.FC<Readonly<EmailTemplateProps>> = ({
  username, otp
}) => (
  <div>
    <h1>Welcome, {username}!</h1>
    <h3>Your OTP is : {otp}</h3>
  </div>
);
