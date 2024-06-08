export default function Loading() {
  return (
    <main className="flex min-h-screen flex-col justify-between bg-slate-50 dark:bg-[#0B1120] transition-colors duration-200 bg-opacity-50">
      <div className="flex-1 py-10">
        <div className="flex pt-[10%] justify-center items-center">
          <div
            className={`h-14 w-14 animate-spin rounded-full border-t-4 border-solid border-gray-500 dark:border-white`}
          />
        </div>
      </div>
    </main>
  );
}
