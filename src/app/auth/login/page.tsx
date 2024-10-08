import { Metadata } from "next";
import Image from "next/image";
import LoginImage from "@/assets/login-image.jpg";
import LoginForm from "./LoginForm";
import Link from "next/link";
import path from "@/lib/path";
import GoogleSignInButton from "./GoogleSignInButton";

export const metadata: Metadata = { title: "Login" };

export default function LoginPage() {
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
            <GoogleSignInButton />
            <div className="flex items-center gap-3">
              <div className="h-px flex-1 bg-muted" />
              <span>OR</span>
              <div className="h-px flex-1 bg-muted" />
            </div>
            <LoginForm />
            <div className="flex items-center justify-center gap-1">
              <span>Don't have an account?</span>
              <Link
                href={`/${path.AUTH}/${path.SIGN_UP}`}
                className="text-blue-700 transition-all hover:underline"
              >
                Sign up
              </Link>
            </div>
          </div>
        </div>
        <Image
          src={LoginImage}
          alt="background signup image"
          className="hidden w-1/2 object-cover md:block"
        />
      </div>
    </main>
  );
}
