import { Shield } from "lucide-react"

export function CarexLogo({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className="relative">
        <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center border border-primary/30">
          <Shield className="w-5 h-5 text-primary" />
        </div>
        <div className="absolute -top-1 -right-1 w-3 h-3 bg-primary rounded-full animate-pulse" />
      </div>
      <div className="flex flex-col">
        <span className="text-xl font-bold tracking-tight text-foreground">C.A.R.E.-X</span>
        <span className="text-[10px] text-muted-foreground tracking-widest">BLOCKCHAIN HEALTHCARE</span>
      </div>
    </div>
  )
}
