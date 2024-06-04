export default function Loading() {
  return (
    <div className="fixed top-0 left-0 w-screen h-screen flex items-center justify-center bg-gray-900 bg-opacity-50">
      <div className="animate-spin rounded-full border-t-4 border-blue-500 border-solid h-20 w-20" />
    </div>
  );
}
