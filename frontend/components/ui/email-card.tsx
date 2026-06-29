"use client"; // <--- Needed for interactivity

import { useState } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { AlertCircle, Clock, CheckCircle2, Send, Copy } from "lucide-react";

interface EmailProps {
  subject: string;
  sender: string;
  score: number;
  category: string;
  reasoning: string;
  draft?: string; // <--- NEW: We accept the AI's draft
}

export function EmailCard({ email }: { email: EmailProps }) {
  const [draftText, setDraftText] = useState(
    email.draft || "No draft generated."
  );

  // 1. Determine Status Level (Same as before)
  const score = email.score || 0;
  let status: "low" | "medium" | "critical" = "low";
  if (score >= 8) status = "critical";
  else if (score >= 5) status = "medium";

  const styles = {
    critical: {
      border: "border-l-rose-500",
      badge: "bg-rose-100 text-rose-700 hover:bg-rose-200 border-rose-200",
      icon: <AlertCircle className="w-4 h-4 text-rose-500" />,
      shadow: "hover:shadow-rose-100",
    },
    medium: {
      border: "border-l-amber-500",
      badge: "bg-amber-100 text-amber-700 hover:bg-amber-200 border-amber-200",
      icon: <Clock className="w-4 h-4 text-amber-500" />,
      shadow: "hover:shadow-amber-100",
    },
    low: {
      border: "border-l-emerald-500",
      badge:
        "bg-emerald-100 text-emerald-700 hover:bg-emerald-200 border-emerald-200",
      icon: <CheckCircle2 className="w-4 h-4 text-emerald-500" />,
      shadow: "hover:shadow-emerald-100",
    },
  }[status];

  return (
    <Card
      className={`
        h-full flex flex-col justify-between 
        border-l-[6px] ${styles.border} 
        transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${styles.shadow}
      `}
    >
      <CardHeader className="pb-3 space-y-2">
        <div className="flex justify-between items-start gap-3">
          <Badge
            variant="outline"
            className={`gap-1.5 px-2 py-1 ${styles.badge}`}
          >
            {styles.icon}
            <span className="font-semibold">Score: {score}/10</span>
          </Badge>
          <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest truncate max-w-[120px]">
            {email.category}
          </span>
        </div>

        <div>
          <CardTitle className="text-base font-bold leading-tight text-slate-900 line-clamp-2">
            {email.subject || "No Subject"}
          </CardTitle>
          <p className="text-xs text-slate-500 font-medium mt-1 truncate">
            {email.sender || "Unknown Sender"}
          </p>
        </div>
      </CardHeader>

      <CardContent className="pb-3 flex-1">
        <div className="bg-slate-50 p-3 rounded-lg text-xs text-slate-600 leading-relaxed border border-slate-100 h-full">
          {email.reasoning}
        </div>
      </CardContent>

      <CardFooter className="pt-3 border-t border-slate-50 flex gap-3">
        <Button
          variant="ghost"
          size="sm"
          className="flex-1 text-xs text-slate-500 hover:text-slate-800"
        >
          Ignore
        </Button>

        {/* --- THE POPUP WINDOW --- */}
        <Dialog>
          <DialogTrigger asChild>
            <Button
              size="sm"
              className="flex-1 text-xs bg-slate-900 text-white hover:bg-slate-800 shadow-md"
            >
              Draft Reply
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px] bg-white border-2 border-slate-200 shadow-2xl z-[100]">
            <DialogHeader>
              <DialogTitle>AI Suggested Reply</DialogTitle>
              <DialogDescription>
                Review and edit the message before sending.
              </DialogDescription>
            </DialogHeader>

            <div className="py-4">
              <Textarea
                value={draftText}
                onChange={(e) => setDraftText(e.target.value)}
                className="min-h-[200px] font-mono text-sm leading-relaxed"
              />
            </div>

            <DialogFooter className="flex gap-2 sm:justify-between">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigator.clipboard.writeText(draftText)}
              >
                <Copy className="w-4 h-4 mr-2" />
                Copy
              </Button>
              <Button
                size="sm"
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Send className="w-4 h-4 mr-2" />
                Send via Gmail
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        {/* ------------------------ */}
      </CardFooter>
    </Card>
  );
}
