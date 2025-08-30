import { useRegisterSW } from 'virtual:pwa-register/react'

export default function UpdatePrompt() {
  const { needRefresh, updateServiceWorker, offlineReady } = useRegisterSW()

  if (offlineReady?.value) {
  }
  if (!needRefresh?.value) return null

  return (
    <div style={{
      position:'fixed', left:16, bottom:16, right:16, zIndex:9999,
      background:'#12193a', border:'1px solid #2b366a', borderRadius:12,
      padding:'12px 16px', display:'flex', gap:12, alignItems:'center',
      boxShadow:'0 8px 24px rgba(0,0,0,.3)'
    }}>
      <div style={{flex:1}}>Dostępna jest nowa wersja aplikacji.</div>
      <button onClick={() => updateServiceWorker(true)}>Zaktualizuj</button>
    </div>
  )
}