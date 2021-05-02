import React, { useState, useEffect } from "react";
import { RESEND_ACTIVATION_MAIL } from "../../GraphQL/Mutations";
import { useMutation } from "@apollo/client";

interface ErrorMessage {
  message: string;
  code: string;
}

export default function ResendActivationMail() {
  const [email, setEmail] = useState<string>("");
  const [errors, setErrors] = useState<Array<string>>([]);
  const [resend, { data, loading, error }] = useMutation(
    RESEND_ACTIVATION_MAIL
  );

  const onEmailChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setEmail(e.target.value);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    resend({
      variables: {
        email,
      },
    });
  };

  useEffect(() => {
    if (data && data.resendActivationEmail) {
      if (data.resendActivationEmail.success) {
          setErrors([]);
        alert("Mail Sent Successfully");
      } else {
        let error_fields = data.resendActivationEmail.errors;
        let error_msgs: Array<string> = [];

        for (const key in error_fields) {
          const msgs: Array<ErrorMessage> = error_fields[key];
          msgs.forEach((msg) => error_msgs.push(msg.message));
        }

        setErrors(error_msgs);
      }
    }
  }, [data, loading, error]);

  if (loading) return <p>Sending Activation Mail</p>;
  if (error) return <p>Something went wrong</p>;

  return (
    <form onSubmit={handleSubmit}>
      {errors &&
        errors.map((e: string, index: number) => <p key={index}>{e}</p>)}
      <input
        type="email"
        name="email"
        placeholder="Registered Email"
        value={email}
        onChange={onEmailChange}
        required
      />
      <button type="submit">Send Activation Mail</button>
    </form>
  );
}
