export default function Spinner({ className = "h-8 w-8" }) {
  return (
    <div className="flex items-center justify-center py-12">
      <div
        className={`animate-spin rounded-full border-b-2 border-primary-600 ${className}`}
      />
    </div>
  );
}
