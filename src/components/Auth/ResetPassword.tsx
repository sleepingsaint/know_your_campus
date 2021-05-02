import React, { useState, useEffect, FormEvent } from "react";
import { RESET_PASSWORD } from "../../GraphQL/Mutations";
import { useMutation } from "@apollo/client";
import { useParams } from "react-router-dom";

interface Params {
  token: string;
}

interface ErrorMessage {
  message: string;
  code: string;
}

export default function ResetPassword() {
  const [errors, setErrors] = useState<Array<string>>([]);
  const [password1, setPassword1] = useState<string>("");
  const [password2, setPassword2] = useState<string>("");
  const [reset, { data, loading, error }] = useMutation(RESET_PASSWORD);
  const { token } = useParams<Params>();

  const onPassword1Change = (e: React.ChangeEvent<HTMLInputElement>) =>
    setPassword1(e.target.value);
  const onPassword2Change = (e: React.ChangeEvent<HTMLInputElement>) =>
    setPassword2(e.target.value);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    reset({
      variables: {
        token,
        password1,
        password2,
      },
    });
  };

  useEffect(() => {
    if (data && data.passwordReset) {
      if (data.passwordReset.success) {
        alert("Password has been reset successfully");
      } else {
        let error_fields = data.passwordReset.errors;
        let error_msgs: Array<string> = [];

        for (const key in error_fields) {
          const msgs: Array<ErrorMessage> = error_fields[key];
          msgs.forEach((msg) => error_msgs.push(msg.message));
        }

        setErrors(error_msgs);
      }
    }
  }, [data, loading, reset, token]);

  if (error) {
    console.log(error);
    return <p>Something went wrong. Try Again</p>;
  }

  if (loading) {
    return <p>Resetting....</p>;
  }

  return (
    <form onSubmit={handleSubmit}>
      {errors &&
        errors.map((err: string, index: number) => <p key={index}>{err}</p>)}
      <input
        type="password"
        name="password1"
        id="password1"
        placeholder="New Password"
        minLength={8}
        value={password1}
        onChange={onPassword1Change}
        required
      />
      <input
        type="password"
        name="password2"
        id="password2"
        placeholder="Confirm New Password"
        minLength={8}
        value={password2}
        onChange={onPassword2Change}
        required
      />
      <button type="submit">Reset Password</button>
    </form>
  );
}
