import { Button } from "@/components/ui/button";
import { ArrowRight, Lock, Zap, Shield } from "lucide-react";

interface LoginScreenProps {
  onLogin: () => void;
}

export function LoginScreen({ onLogin }: LoginScreenProps) {
  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center relative overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
      <div className="absolute top-0 -right-4 w-72 h-72 bg-yellow-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>

      <div className="z-10 text-center space-y-8 max-w-2xl px-4">
        {/* Logo / Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-slate-400 text-xs font-medium mb-4">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          System Operational • v2.5 Turbo
        </div>

        {/* Hero Text */}
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white">
          IEMO{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600">
            Opus
          </span>
        </h1>

        <p className="text-lg text-slate-400 max-w-lg mx-auto leading-relaxed">
          Your inbox is chaotic. Your time is finite. <br />
          Let the <strong>Context-Aware Intelligence Engine</strong> handle the
          noise so you can focus on the signal.
        </p>

        {/* Feature Grid (Mini) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left my-8">
          <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800 backdrop-blur-sm">
            <Zap className="w-5 h-5 text-yellow-500 mb-2" />
            <h3 className="text-slate-200 font-semibold text-sm">
              Instant Triage
            </h3>
            <p className="text-slate-500 text-xs">
              AI scores urgency instantly.
            </p>
          </div>
          <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800 backdrop-blur-sm">
            <Lock className="w-5 h-5 text-blue-500 mb-2" />
            <h3 className="text-slate-200 font-semibold text-sm">
              Local First
            </h3>
            <p className="text-slate-500 text-xs">
              Secure processing pipeline.
            </p>
          </div>
          <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800 backdrop-blur-sm">
            <Shield className="w-5 h-5 text-purple-500 mb-2" />
            <h3 className="text-slate-200 font-semibold text-sm">
              Spam Shield
            </h3>
            <p className="text-slate-500 text-xs">Auto-drafts rejection.</p>
          </div>
        </div>

        {/* CTA Button */}
        <div className="pt-4">
          <Button
            onClick={onLogin}
            size="lg"
            className="h-12 px-8 text-base bg-white text-slate-950 hover:bg-slate-200 hover:scale-105 transition-all duration-300 shadow-[0_0_20px_rgba(255,255,255,0.3)]"
          >
            Connect Workspace
            <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
          <p className="text-xs text-slate-600 mt-4">
            By connecting, you grant Opus read-access to your Gmail API.
          </p>
        </div>
      </div>
    </div>
  );
}
