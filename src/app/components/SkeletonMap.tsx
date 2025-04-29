
export default function SkeletonMap({ className = '' }: { className?: string }) {
    return (
      <div
        className={`bg-gray-200 animate-pulse rounded-3xl ${className}`}
        style={{
          width: '100%',
          height: '100%',
          minHeight: '300px',
        }}
      />
    );
  }
  