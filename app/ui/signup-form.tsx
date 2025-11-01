"use client";

import { useState, useActionState } from "react";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/solid";
import { AtSymbolIcon, KeyIcon, UserIcon } from "@heroicons/react/24/outline";
import { register, type RegisterState } from "../lib/actions/register";
import Link from "next/link";

const initialState: RegisterState = { status: "idle" };

export default function SignupForm() {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [repeatPasswordError, setRepeatPasswordError] = useState("");
  const [state, formAction, isPending] = useActionState(register, initialState);
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    password: "",
    repeatPassword: ""
  });

  const handlePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    const form = e.currentTarget;
    const password = form.password.value;
    const repeatPassword = form.repeatPassword.value;

    if (password !== repeatPassword) {
      e.preventDefault();
      setRepeatPasswordError("Passwords do not match.");
    } else {
      setRepeatPasswordError("");
    }
  };

  return (
    <form onSubmit={handleSubmit} action={formAction} className="space-y-10">
      <div>
        <label htmlFor="firstname" className="block">
          <UserIcon className="size-5 text-red inline mr-2" />
          First Name
        </label>
        <input
          type="text"
          id="firstname"
          name="firstname"
          value={formData.firstname}
          onChange={(e) => setFormData({...formData, firstname: e.target.value})}
          className="w-full border-b outline-none py-1 mt-1"
          required
        />
      </div>
      <div>
        <label htmlFor="lastname" className="block">
          <UserIcon className="size-5 text-red inline mr-2" />
          Last Name
        </label>
        <input
          type="text"
          id="lastname"
          name="lastname"
          value={formData.lastname}
          onChange={(e) => setFormData({...formData, lastname: e.target.value})}
          className="w-full border-b outline-none py-1 mt-1"
          required
        />
      </div>
      <div>
        <label htmlFor="email" className="block">
          <AtSymbolIcon className="size-5 text-red inline mr-2" />
          Email
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={(e) => setFormData({...formData, email: e.target.value})}
          className="w-full border-b outline-none py-1 mt-1"
          required
        />
      </div>
      <div>
        <label htmlFor="password" className="block">
          <KeyIcon className="size-5 text-red inline mr-2" />
          Password
        </label>
        <div className="flex w-full">
          <input
            type={isPasswordVisible ? "text" : "password"}
            id="password"
            name="password"
            value={formData.password}
            onChange={(e) => setFormData({...formData, password: e.target.value})}
            className="w-full border-b outline-none py-1 mt-1"
            required
          />
          <button
            type="button"
            onClick={handlePasswordVisibility}
            className="cursor-pointer border-b"
          >
            {isPasswordVisible ? (
              <EyeSlashIcon className="size-5 text-gray-400 dark:text-foreground" />
            ) : (
              <EyeIcon className="size-5 text-gray-400 dark:text-foreground" />
            )}
          </button>
        </div>
      </div>
      <div>
        <label htmlFor="repeatPassword" className="block">
          <KeyIcon className="size-5 text-red inline mr-2" />
          Repeat Password
        </label>
        <input
          type="password"
          id="repeatPassword"
          name="repeatPassword"
          value={formData.repeatPassword}
          onChange={(e) => setFormData({...formData, repeatPassword: e.target.value})}
          className="w-full border-b outline-none py-1 mt-1"
          required
        />
      </div>
      <button
        type="submit"
        className="cursor-pointer w-full bg-red rounded-md px-4 py-2 text-white font-bold"
        aria-disabled={isPending}
        disabled={isPending}
      >
        {isPending ? "Signing up..." : "Sign Up"}
      </button>
      {repeatPasswordError && (
        <p className="text-sm text-center text-red">{repeatPasswordError}</p>
      )}
      {state?.status === "error" && (
        <div className="text-center text-red text-sm space-y-2">
          <p>{state.message}</p>
          {Array.isArray(state.issues) && (
            <ul className="list-none text-center">
              {state.issues.map((issue: any, i: number) => (
                <li key={i}>{issue.message}</li>
              ))}
            </ul>
          )}
        </div>
      )}
      {state?.status === "success" && (
        <div className="text-center text-red text-sm space-y-2">
          <p>Account created successfully!<br />Please check your email to verify your account.</p>
          <p>
            <b>Didn’t get the verification email?</b>
            <br />
            <Link href="/login" className="underline">Log in</Link> to resend it.
          </p>
        </div>
      )}
    </form>
  );
}
