import { Metadata } from "next";
import React from "react";
import SignUpImage from "@/assets/signup-image.jpg";
import Image from "next/image";
import Link from "next/link";
import path from "@/lib/path";
import SignUpForm from "./SignUpForm";

export const metadata: Metadata = { title: "Sign Up" };

export default function SingUpPage() {
  return (
    <main className="flex h-screen items-center justify-center p-5">
      <div className="flex h-full max-h-[40rem] w-full max-w-[64rem] overflow-hidden rounded-2xl bg-card shadow-2xl">
        <div className="w-full space-y-10 overflow-y-auto p-10 md:w-1/2">
          <div className="space-y-1 text-center">
            <h1 className="text-3xl font-bold">Sign up to bugbook</h1>
            <span className="text-muted-foreground">
              A placce where even <span className="italic">you</span> can find a
              friend.
            </span>
          </div>
          <div className="space-y-5">
            <SignUpForm />
            <div className="flex items-center justify-center gap-1">
              <span>Already have an account?</span>
              <Link
                href={`/${path.AUTH}/${path.LOGIN}`}
                className="text-blue-700 transition-all hover:underline"
              >
                Log in
              </Link>
            </div>
          </div>
        </div>
        <Image
          src={SignUpImage}
          alt="background signup image"
          className="hidden w-1/2 object-cover md:block"
        />
      </div>
    </main>
  );
}
