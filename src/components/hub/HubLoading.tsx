// Full-screen branded loading state for the Hub.
export default function HubLoading({ label = 'Loading…' }: { label?: string }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#0d0d0d] to-[#1a1a1a] text-white">
      <div className="h-10 w-10 rounded-full border-2 border-white/15 border-t-brand-red animate-spin" />
      <p className="mt-4 eyebrow">{label}</p>
    </div>
  )
}
