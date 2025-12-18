import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex h-screen flex-col items-center justify-center bg-gray-900 text-white">
      <h2 className="text-4xl font-bold mb-4">404 - Not Found</h2>
      <p className="mb-6">Could not find requested resource</p>
      <Link href="/" className="btn btn-primary">
        Return Home
      </Link>
    </div>
  );
}
