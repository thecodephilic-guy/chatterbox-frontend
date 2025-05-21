import SignupForm from "@/components/auth/singup-form"
import Link from "next/link";

export default function SignupPage() {
  return (
    <>
      <SignupForm />
      <div className="mt-4 text-center">
        <p className="text-sm text-gray-600">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-medium text-blue-600 hover:text-blue-500 underline"
          >
            Log in
          </Link>
        </p>
      </div>
    </>
  );
}
