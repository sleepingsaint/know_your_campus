import React from "react";

export default function LogIn() {
  const [username, setUsername] = React.useState<String>("");
  const [password, setPassword] = React.useState<String>("");

  const handleUsername = (e: React.ChangeEvent<HTMLInputElement>) =>
    setUsername(e.target.value);
  const handlePassword = (e: React.ChangeEvent<HTMLInputElement>) =>
    setPassword(e.target.value);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(username, password);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        name="username"
        id="username"
        minLength={8}
        onChange={handleUsername}
        required
      />
      <input
        type="password"
        name="password"
        id="password"
        minLength={8}
        onChange={handlePassword}
        required
      />
      <button type="submit">Log In</button>
    </form>
  );
}
