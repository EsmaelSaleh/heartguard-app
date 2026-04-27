export default function MobilePreviewPage() {
  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#0f172a',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px 20px',
      }}
    >
      <div
        style={{
          position: 'relative',
          width: 390,
          height: 720,
          borderRadius: 40,
          border: '10px solid #1e293b',
          boxShadow: '0 0 0 2px #334155, 0 30px 80px rgba(0,0,0,0.7)',
          overflow: 'hidden',
          background: '#fff',
        }}
      >
        {/* Notch */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: '50%',
            transform: 'translateX(-50%)',
            width: 120,
            height: 28,
            background: '#1e293b',
            borderRadius: '0 0 20px 20px',
            zIndex: 10,
          }}
        />
        <iframe
          src="/"
          title="Mobile Preview"
          style={{
            width: 390,
            height: 720,
            border: 'none',
            display: 'block',
          }}
        />
      </div>
    </div>
  );
}
