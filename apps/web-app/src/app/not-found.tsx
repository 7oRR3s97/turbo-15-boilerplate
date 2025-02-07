import { Link } from "@packages/ui/base/components/link";

export default function NotFound() {
  return (
    <html lang="pt-br">
      <body>
        <div className="flex h-[100dvh] flex-col items-center justify-center px-4 text-center">
          <div className="space-y-4">
            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
              Page Not Found
            </h1>
            <p className="max-w-md text-gray-500 dark:text-gray-400">
              The page you're looking for doesn't exist or has been moved.
            </p>
            <Link
              className="inline-flex h-10 items-center justify-center rounded-md bg-gray-900 px-6 text-sm font-medium text-gray-50 shadow transition-colors hover:bg-gray-900/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:pointer-events-none disabled:opacity-50 dark:bg-gray-50 dark:text-gray-900 dark:hover:bg-gray-50/90 dark:focus-visible:ring-gray-300"
              href="/"
            >
              Go Back Home
            </Link>
          </div>
        </div>
      </body>
    </html>
  );
}
