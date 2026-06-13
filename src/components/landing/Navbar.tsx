import { motion } from "framer-motion";
import { Brain } from "lucide-react";
import { Link } from "@tanstack/react-router";

export function Navbar() {
  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="sticky top-0 z-50 w-full"
    >
      <div className="mx-auto mt-4 max-w-6xl px-4">
        <nav className="glass flex items-center justify-between rounded-2xl px-4 py-2.5 shadow-soft">
          <div className="flex items-center gap-2">
            <div className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-primary text-primary-foreground shadow-glow">
              <Brain className="h-4 w-4" strokeWidth={2.5} />
            </div>
            <span className="text-[15px] font-semibold tracking-tight">StudySync</span>
          </div>
          <div className="hidden items-center gap-7 text-sm text-muted-foreground md:flex">
            <a href="#features" className="transition-colors hover:text-foreground">Features</a>
            <a href="#extension" className="transition-colors hover:text-foreground">Extension</a>
            <a href="#showcase" className="transition-colors hover:text-foreground">How it works</a>
            <Link to="/dashboard" className="transition-colors hover:text-foreground">Dashboard</Link>
          </div>
          <div className="flex items-center gap-2">
            <Link
              to="/signin"
              className="hidden rounded-lg px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground sm:inline-block"
            >
              Sign in
            </Link>
            <Link
              to="/signup"
              className="rounded-lg bg-foreground px-3.5 py-1.5 text-sm font-medium text-background transition-transform hover:scale-[1.02]"
            >
              Get Started
            </Link>
          </div>
        </nav>
      </div>
    </motion.header>
  );
}