import React from "react";
import { LOGIN } from "../../GraphQL/Mutations";
import { useMutation } from "@apollo/client";

interface ErrorMessage {
  message: string;
  code: string;
}

export default function LogIn() {
  const [username, setUsername] = React.useState<string>("");
  const [password, setPassword] = React.useState<string>("");
  const [errors, setErrors] = React.useState<Array<string>>([]);

  const [login, { data, loading, error }] = useMutation(LOGIN);

  const handleUsername = (e: React.ChangeEvent<HTMLInputElement>) =>
    setUsername(e.target.value);
  const handlePassword = (e: React.ChangeEvent<HTMLInputElement>) =>
    setPassword(e.target.value);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    login({
      variables: {
        username: username,
        password: password,
      },
    });
  };

  React.useEffect(() => {
    if (data && data.tokenAuth) {
      if (data.tokenAuth.success) {
        localStorage.setItem("token", data.tokenAuth.token);
        localStorage.setItem("refreshToken", data.tokenAuth.refreshToken);
        localStorage.setItem("user", JSON.stringify(data.tokenAuth.user));
      } else {
        let error_fields = data.tokenAuth.errors;
        let error_msgs: Array<string> = [];

        for (const key in error_fields) {
          const msgs: Array<ErrorMessage> = error_fields[key];
          msgs.forEach((msg) => error_msgs.push(msg.message));
        }

        setErrors(error_msgs);
      }
    }
  }, [data, loading, error]);

  if(loading) return <p>Loading....</p>
  if(error) return <p>Something went wrong</p>

  return (
    
    <form onSubmit={handleSubmit}>
      {errors && errors.map(e => <p>{e}</p>)}
      <input
        type="text"
        name="username"
        id="username"
        minLength={8}
        onChange={handleUsername}
        required
        placeholder="username"
        value={username}
      />
      <input
        type="password"
        name="password"
        id="password"
        minLength={8}
        onChange={handlePassword}
        required
        placeholder="password"
        value={password}
      />
      <button type="submit">Log In</button>
    </form>
  );
}
