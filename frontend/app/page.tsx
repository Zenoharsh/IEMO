"use client";

import { useState, useEffect } from "react";
import { EmailCard } from "@/components/ui/email-card";
import { Button } from "@/components/ui/button";
import { LoginScreen } from "@/components/ui/login-screen";
import { Checkbox } from "@/components/ui/checkbox"; // Using your newly added component
import {
  LayoutDashboard,
  Briefcase,
  User,
  AlertCircle,
  RefreshCw,
  LogOut,
  CheckSquare,
  ArrowRight,
} from "lucide-react";

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [emails, setEmails] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState("all");

  // --- FETCH DATA ---
  const fetchEmails = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        "http://127.0.0.1:8000/api/fetch-live?limit=6"
      );
      const data = await response.json();
      if (data.emails) {
        setEmails(data.emails);
      }
    } catch (error) {
      console.error("Failed to fetch:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isLoggedIn) fetchEmails();
  }, [isLoggedIn]);

  // --- UPDATED FILTER LOGIC ---
  const filteredEmails = emails.filter((email) => {
    const cat = email.category || "Uncategorized";

    if (filter === "tasks") return true; // Show all actionable items in Task mode
    if (filter === "all") return true;
    if (filter === "urgent") return email.score >= 7 || cat === "Urgent_Action";

    if (filter === "personal") {
      return cat === "Personal_Planning" || cat === "Personal";
    }

    if (filter === "work") {
      return [
        "Urgent_Action",
        "Meeting_Request",
        "Finance_Bill",
        "Newsletter",
        "Work",
      ].includes(cat);
    }

    return true;
  });

  // --- COMPONENT: TODO LIST ITEM ---
  const TodoItem = ({ email }: { email: any }) => {
    const [checked, setChecked] = useState(false);

    return (
      <div
        className={`flex items-center gap-4 p-4 rounded-xl border transition-all duration-300 ${
          checked
            ? "bg-slate-50 border-slate-100 opacity-50"
            : "bg-white border-slate-200 hover:shadow-md"
        }`}
      >
        <Checkbox
          checked={checked}
          onCheckedChange={(c: any) => setChecked(!!c)}
          className="w-5 h-5 border-slate-300 data-[state=checked]:bg-slate-900"
        />

        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            {email.score >= 7 && (
              <span className="bg-red-100 text-red-700 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                Urgent
              </span>
            )}
            <span className="text-xs font-mono text-slate-400 uppercase">
              {email.category}
            </span>
          </div>

          <h4
            className={`font-medium text-slate-800 ${
              checked ? "line-through text-slate-400" : ""
            }`}
          >
            {email.subject}
          </h4>
          <p className="text-xs text-slate-500 mt-0.5">
            Action:{" "}
            <span className="font-semibold text-slate-700">
              {email.draft ? "Review Draft" : "Review required"}
            </span>
          </p>
        </div>

        <Button
          variant="ghost"
          size="sm"
          className="hidden md:flex text-slate-400 hover:text-slate-900"
        >
          Open <ArrowRight className="w-4 h-4 ml-1" />
        </Button>
      </div>
    );
  };

  const NavItem = ({ id, icon: Icon, label }: any) => (
    <button
      onClick={() => setFilter(id)}
      className={`flex items-center gap-3 w-full p-3 rounded-lg transition-all ${
        filter === id
          ? "bg-slate-900 text-white shadow-md"
          : "text-slate-500 hover:bg-slate-100 hover:text-slate-900"
      }`}
    >
      <Icon size={18} />
      <span className="font-medium text-sm">{label}</span>
    </button>
  );

  if (!isLoggedIn) {
    return <LoginScreen onLogin={() => setIsLoggedIn(true)} />;
  }

  return (
    <div className="flex h-screen bg-slate-50 font-sans text-slate-900">
      {/* SIDEBAR */}
      <aside className="w-64 bg-white border-r border-slate-200 p-6 hidden md:flex flex-col">
        <div className="mb-8">
          <h1
            className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent cursor-pointer"
            onClick={() => setIsLoggedIn(false)}
          >
            IEMO Opus
          </h1>
          <p className="text-[10px] text-slate-400 mt-1 uppercase tracking-widest font-bold">
            Intelligence Engine
          </p>
        </div>

        <nav className="space-y-1 flex-1">
          <NavItem id="all" icon={LayoutDashboard} label="Inbox Stream" />
          <NavItem id="urgent" icon={AlertCircle} label="High Priority" />
          <NavItem id="work" icon={Briefcase} label="Work Context" />
          <NavItem id="personal" icon={User} label="Personal" />

          <div className="py-4">
            <div className="h-px bg-slate-100 w-full"></div>
          </div>

          <NavItem id="tasks" icon={CheckSquare} label="Action Plan" />
        </nav>

        <div className="mt-auto pt-6 border-t border-slate-100">
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 mb-4">
            <h4 className="text-[10px] font-bold text-slate-400 mb-2 uppercase">
              System Status
            </h4>
            <div className="flex items-center gap-2 text-xs font-medium text-emerald-600">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              Brain Online
            </div>
          </div>

          <button
            onClick={() => setIsLoggedIn(false)}
            className="flex items-center gap-2 text-xs text-slate-400 hover:text-red-500 transition-colors"
          >
            <LogOut size={14} />
            Disconnect Session
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT Area */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        <header className="h-16 bg-white/80 backdrop-blur-md border-b border-slate-200 px-8 flex justify-between items-center shrink-0 z-10">
          <h2 className="text-lg font-bold text-slate-800 capitalize flex items-center gap-2">
            {filter === "tasks"
              ? "Action Plan"
              : filter === "all"
              ? "Inbox Stream"
              : `${filter} Emails`}
            <span className="text-slate-300 font-light">/</span>
            <span className="text-sm font-normal text-slate-500">
              {filter === "tasks"
                ? `${emails.length} Tasks`
                : `${filteredEmails.length} items`}
            </span>
          </h2>
          <Button
            onClick={fetchEmails}
            disabled={loading}
            variant="outline"
            className="gap-2 border-slate-200 hover:bg-slate-50 hover:text-slate-900"
          >
            <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
            {loading ? "Analyzing..." : "Refresh"}
          </Button>
        </header>

        <div className="flex-1 overflow-y-auto p-8">
          {filter === "tasks" ? (
            <div className="max-w-3xl mx-auto space-y-4">
              <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl mb-6 flex gap-4 items-start">
                <div className="bg-blue-100 p-2 rounded-full text-blue-600 shrink-0">
                  <CheckSquare size={20} />
                </div>
                <div>
                  <h3 className="font-semibold text-blue-900">
                    AI Generated To-Do List
                  </h3>
                  <p className="text-sm text-blue-700 mt-1">
                    Opus analyzed your inbox and extracted these actionable
                    tasks.
                  </p>
                </div>
              </div>

              {[...emails]
                .sort((a, b) => b.score - a.score)
                .map((email, i) => (
                  <div
                    key={i}
                    className="animate-in slide-in-from-bottom-2 duration-500"
                    style={{ animationDelay: `${i * 50}ms` }}
                  >
                    <TodoItem email={email} />
                  </div>
                ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 pb-20">
              {loading &&
                emails.length === 0 &&
                [1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="h-48 rounded-xl bg-slate-200 animate-pulse"
                  ></div>
                ))}

              {!loading && filteredEmails.length === 0 && (
                <div className="col-span-full flex flex-col items-center justify-center py-20 text-slate-400 border-2 border-dashed border-slate-200 rounded-xl">
                  <div className="bg-slate-100 p-4 rounded-full mb-4">
                    <LayoutDashboard className="text-slate-300 w-8 h-8" />
                  </div>
                  <p className="font-medium">
                    No emails found in this category.
                  </p>
                </div>
              )}

              {filteredEmails.map((email, index) => (
                <div
                  key={index}
                  className="animate-in fade-in zoom-in-95 duration-500"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <EmailCard email={email} />
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
