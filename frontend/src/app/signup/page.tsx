import SignupForm from '@/components/SignupForm';
import Link from 'next/link';

export default function SignupPage() {
  return (
    <div className="container mx-auto mt-10 max-w-md">
      <h1 className="text-2xl font-bold mb-5 text-center">Sign Up</h1>
      <SignupForm />
      <p className="mt-4 text-center">
        Already have an account? <Link href="/login" className="text-blue-500 hover:underline">Login</Link>
      </p>
    </div>
  );
}