export const SkeletonCard = () => (
  <div style={{ background: '#fff', borderRadius: 16, border: '1.5px solid #E8ECF0', padding: 20, marginBottom: 12 }}>
    <div className="skeleton" style={{ height: 14, width: '30%', marginBottom: 12 }} />
    <div className="skeleton" style={{ height: 12, width: '100%', marginBottom: 8 }} />
    <div className="skeleton" style={{ height: 12, width: '75%' }} />
  </div>
)

export const SkeletonGrid = ({ count = 3 }) => (
  <>
    {Array.from({ length: count }).map((_, i) => (
      <SkeletonCard key={i} />
    ))}
  </>
)