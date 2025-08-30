import { useOnline } from '../hooks/useOnline'

export default function OfflineBanner() {
  const online = useOnline()
  if (online) return null
  return (
    <div style={{
      position: 'fixed', left: 0, right: 0, top: 0, zIndex: 9999,
      background: '#3a2a2a', color: '#fff', padding: '8px 12px',
      textAlign: 'center', borderBottom: '1px solid #5b4040'
    }}>
      Jesteś offline – wyświetlamy dane z pamięci.
    </div>
  )
}
