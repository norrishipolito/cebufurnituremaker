export default function ProjectDetailLoading() {
  return (
    <main
      aria-busy="true"
      aria-label="Loading project details"
      className="min-h-screen bg-white px-4 py-8 text-gray-950 dark:bg-gray-950 dark:text-white sm:px-6 lg:px-8"
    >
      <div className="mx-auto max-w-7xl animate-pulse">
        <div className="h-9 w-28 rounded-md bg-gray-200 dark:bg-gray-800" />
        <div className="mt-6 grid gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(320px,0.9fr)]">
          <div className="min-h-[360px] rounded-lg bg-gray-200 dark:bg-gray-800 lg:min-h-[620px]" />
          <div className="lg:pt-8">
            <div className="h-6 w-28 rounded-full bg-amber-100 dark:bg-amber-300/15" />
            <div className="mt-4 h-12 w-3/4 rounded-md bg-gray-200 dark:bg-gray-800" />
            <div className="mt-5 h-24 rounded-md bg-gray-100 dark:bg-gray-900" />
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <div className="h-24 rounded-md bg-gray-100 dark:bg-gray-900" />
              <div className="h-24 rounded-md bg-gray-100 dark:bg-gray-900" />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
