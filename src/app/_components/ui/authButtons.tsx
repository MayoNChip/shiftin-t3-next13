"use client";

import { signOut } from "next-auth/react";
import { Button } from "./button";
import Link from "next/link";

export const LoginButton = () => {
  return (
    <>
      <Link href={"/signin"}>
        <Button>Sign In</Button>
      </Link>
    </>
  );
};

export const LogoutButton = () => {
  return (
    <>
      <Button onClick={() => signOut()}>Sign Out</Button>
    </>
  );
};

export const RegisterButton = () => {
  return (
    <>
      <Link href={"/signup"}>
        <Button>Sign Up</Button>
      </Link>
    </>
  );
};
