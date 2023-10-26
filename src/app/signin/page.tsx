import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import React from "react";
import { authOptions } from "~/server/auth";
import { SignInForm } from "../_components/SignInForm";

export default async function SignInPage() {
  const session = await getServerSession(authOptions);

  if (session?.user) {
    redirect("/");
    // <div className="flex items-center justify-center w-full min-h-screen">
    // 	<h1 className="text-3xl text-bold">Please sign in to access this page</h1>
    // </div>;
  }

  return (
    <div className="flex-column flex w-full items-center justify-center">
      <div className="my-20 flex flex-col self-center">
        <div className="flex min-w-[460px] flex-col items-center space-y-10 rounded-lg p-10 shadow-md">
          <div>
            <h1 className="text-center text-2xl font-bold">
              Sign in to your account
            </h1>
          </div>
          <SignInForm />
        </div>
      </div>
    </div>
  );
}
