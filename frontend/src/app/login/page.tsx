import LoginForm from '@/components/LoginForm';
import Link from 'next/link';

export default function LoginPage() {
  return (
    <div className="container mx-auto mt-10 max-w-md">
      <h1 className="text-2xl font-bold mb-5 text-center">Login</h1>
      <LoginForm />
      <p className="mt-4 text-center">
        Don't have an account? <Link href="/signup" className="text-blue-500 hover:underline">Sign up</Link>
      </p>
    </div>
  );
}