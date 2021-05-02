import React, { useState } from "react";
import { CREATE_ACCOUNT } from "../../GraphQL/Mutations";
import { useMutation } from "@apollo/client";

interface ErrorMessage {
  message: string;
  code: string;
}

export default function CreateAccount() {
  const [email, setEmail] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [errors, setErrors] = useState<Array<string>>([]);
  const [createAccount, { data, loading, error }] = useMutation(CREATE_ACCOUNT);

  const handleEmail = (e: React.ChangeEvent<HTMLInputElement>) =>
    setEmail(e.target.value);
  const handleUsername = (e: React.ChangeEvent<HTMLInputElement>) =>
    setUsername(e.target.value);
  const handlePassword = (e: React.ChangeEvent<HTMLInputElement>) =>
    setPassword(e.target.value);
  const handleConfirmPassword = (e: React.ChangeEvent<HTMLInputElement>) =>
    setConfirmPassword(e.target.value);

  React.useEffect(() => {
    if (data && data.register) {
      if (data.register.success) {
        // successfully registered
        let token = data.register.token;
        localStorage.setItem("token", token);
      } else {
        let error_fields = data.register.errors;
        let error_msgs: Array<string> = [];

        for (const key in error_fields) {
          const msgs: Array<ErrorMessage> = error_fields[key];
          msgs.forEach((msg) => error_msgs.push(msg.message));
        }

        setErrors(error_msgs);
      }
    }
  }, [data, loading]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    createAccount({
      variables: {
        email: email,
        username: username,
        password1: password,
        password2: confirmPassword,
      },
    });
  };

  if (error) return <p>Something went wrong try again later. </p>;
  if (loading) return <p>Loading ....</p>;
  if (data && data.register && data.register.success)
    return (
      <p>
        Verification mail has been to the your email. Please verify to access
        this site
      </p>
    );
    
  return (
    <form onSubmit={handleSubmit}>
      {errors &&
        errors.map((e: string, index: number) => <p key={index}>{e}</p>)}
      <input
        type="email"
        name="email"
        placeholder="Email"
        required
        onChange={handleEmail}
        value={email}
      />
      <input
        type="text"
        name="username"
        placeholder="username"
        required
        onChange={handleUsername}
        minLength={5}
        value={username}
      />
      <br />
      <input
        type="password"
        name="password"
        placeholder="password"
        required
        onChange={handlePassword}
        minLength={8}
        value={password}
      />
      <br />
      <input
        type="password"
        name="confirm password"
        placeholder="confirm password"
        required
        onChange={handleConfirmPassword}
        minLength={8}
        value={confirmPassword}
      />
      <button type="submit">Create Account</button>
    </form>
  );
}
