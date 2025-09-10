"use client";

import { useState, useActionState } from "react";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/solid";
import { AtSymbolIcon, KeyIcon, UserIcon } from "@heroicons/react/24/outline";
import { register, type RegisterState } from "../lib/actions/register";

const initialState: RegisterState = { status: "idle" };

export default function SignupForm() {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [repeatPasswordError, setRepeatPasswordError] = useState("");
  const [state, formAction, isPending] = useActionState(register, initialState);

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
        <label htmlFor="firstnameInput" className="block">
          <UserIcon className="size-5 text-red-500 inline mr-2" />
          First Name
        </label>
        <input
          type="text"
          id="firstnameInput"
          name="firstname"
          className="w-full border-b outline-none py-1 mt-1"
          required
        />
      </div>
      <div>
        <label htmlFor="lastnameInput" className="block">
          <UserIcon className="size-5 text-red-500 inline mr-2" />
          Last Name
        </label>
        <input
          type="text"
          id="lastnameInput"
          name="lastname"
          className="w-full border-b outline-none py-1 mt-1"
          required
        />
      </div>
      <div>
        <label htmlFor="emailInput" className="block">
          <AtSymbolIcon className="size-5 text-red-500 inline mr-2" />
          Email
        </label>
        <input
          type="email"
          id="emailInput"
          name="email"
          className="w-full border-b outline-none py-1 mt-1"
          required
        />
      </div>
      <div>
        <label htmlFor="passwordInput" className="block">
          <KeyIcon className="size-5 text-red-500 inline mr-2" />
          Password
        </label>
        <div className="flex w-full">
          <input
            type={isPasswordVisible ? "text" : "password"}
            id="passwordInput"
            name="password"
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
        <label htmlFor="repeatPasswordInput" className="block">
          <KeyIcon className="size-5 text-red-500 inline mr-2" />
          Repeat Password
        </label>
        <input
          type="password"
          id="repeatPasswordInput"
          name="repeatPassword"
          className="w-full border-b outline-none py-1 mt-1"
          required
        />
      </div>
      <button
        type="submit"
        className="cursor-pointer w-full bg-red-500 rounded-md px-4 py-2 text-white font-bold"
        aria-disabled={isPending}
        disabled={isPending}
      >
        {isPending ? "Signing up..." : "Sign Up"}
      </button>
      {repeatPasswordError && (
        <p className="text-sm text-center text-red-500">{repeatPasswordError}</p>
      )}
      {state?.status === "error" && (
        <div className="text-center text-red-500 text-sm space-y-2">
          <p>{state.message}</p>
          {Array.isArray(state.issues) && (
            <ul className="list-disc text-left pl-5">
              {state.issues.map((issue: any, i: number) => (
                <li key={i}>{issue.message}</li>
              ))}
            </ul>
          )}
        </div>
      )}
      {state?.status === "success" && (
        <div className="text-center text-red-500 text-sm space-y-2">
          <p>{state.message}</p>
          <p>Please check your email and verify your account to log in.</p>
        </div>
      )}
    </form>
  );
}
