'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  BookOpenCheck,
  ChartNoAxesCombined,
  GraduationCap,
  Presentation,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';

const roles = [
  {
    number: '01',
    title: 'For administrators',
    description:
      'Bring school operations into focus with connected management tools and clear, actionable insights.',
    detail: 'Complete school management',
    icon: ShieldCheck,
  },
  {
    number: '02',
    title: 'For teachers',
    description:
      'Build engaging courses, assign exercises, and spend more time doing what matters: teaching.',
    detail: 'Courses & assignments',
    icon: Presentation,
  },
  {
    number: '03',
    title: 'For students',
    description:
      'Follow your progress, understand your grades, and make every learning session count.',
    detail: 'Progress & interactive learning',
    icon: BookOpenCheck,
  },
];

export default function Home() {
  return (
    <main className="min-h-dvh overflow-hidden bg-[#0a0a0a] text-[#f5f2e9]">
      <header className="relative z-10 border-b border-white/[0.07]">
        <div className="mx-auto flex h-[76px] max-w-7xl items-center justify-between px-5 sm:px-8 lg:px-12">
          <Link href="/" className="flex items-center gap-3" aria-label="EduInsight AI home">
            <span className="flex size-10 items-center justify-center rounded-xl border border-[#c6a96b]/30 bg-[#c6a96b]/[0.08] text-[#d9bd7d]">
              <GraduationCap size={22} strokeWidth={1.7} />
            </span>
            <span className="text-xs font-semibold tracking-[0.16em] text-white">
              EDUINSIGHT <span className="text-[#c6a96b]">AI</span>
            </span>
          </Link>

          <nav className="hidden items-center gap-8 md:flex" aria-label="Main navigation">
            <a href="#platform" className="text-sm text-white/55 transition-colors hover:text-white">
              Platform
            </a>
            <a href="#roles" className="text-sm text-white/55 transition-colors hover:text-white">
              Who it&apos;s for
            </a>
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="hidden rounded-lg px-4 py-2.5 text-sm font-medium text-white/70 transition-colors hover:text-white sm:inline-flex"
            >
              Login
            </Link>
            <Link
              href="/register"
              className="inline-flex min-h-10 items-center gap-2 rounded-lg bg-[#c6a96b] px-4 text-xs font-semibold text-[#17130b] transition-colors hover:bg-[#d8bd83] sm:px-5 sm:text-sm"
            >
              Get Started <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </header>

      <section id="platform" className="relative isolate">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_72%_43%,rgba(198,169,107,0.12),transparent_38%),radial-gradient(ellipse_at_15%_10%,rgba(198,169,107,0.05),transparent_32%)]"
        />
        <div className="mx-auto grid min-h-[650px] max-w-7xl items-center gap-14 px-5 py-20 sm:px-8 md:py-24 lg:grid-cols-[1.05fr_0.95fr] lg:gap-10 lg:px-12">
          <div className="relative z-10 max-w-2xl">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-7 inline-flex items-center gap-2 rounded-full border border-[#c6a96b]/20 bg-[#c6a96b]/[0.06] px-3.5 py-2"
            >
              <Sparkles size={14} className="text-[#d9bd7d]" />
              <span className="text-[10px] font-semibold tracking-[0.13em] text-[#dfc887]">
                A SMARTER WAY TO LEARN
              </span>
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.08 }}
              className="text-[clamp(2.75rem,7vw,5.5rem)] font-semibold leading-[1.02] tracking-[-0.055em] text-white"
            >
              Empowering
              <br />
              education with
              <br />
              <span className="bg-gradient-to-r from-[#f2dfaa] via-[#d7b96f] to-[#a9823d] bg-clip-text text-transparent">
                intelligence.
              </span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.2 }}
              className="mt-7 max-w-xl text-base leading-7 text-white/55 sm:text-lg sm:leading-8"
            >
              One connected learning platform for the people who make education
              happen. Better insights for schools, teachers, and students.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.32 }}
              className="mt-9 flex flex-col gap-3 sm:flex-row"
            >
              <Link
                href="/register"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-[#c6a96b] px-6 text-sm font-semibold text-[#17130b] transition-all hover:-translate-y-0.5 hover:bg-[#d8bd83]"
              >
                Get Started <ArrowRight size={16} />
              </Link>
              <Link
                href="/login"
                className="inline-flex min-h-12 items-center justify-center rounded-lg border border-white/15 bg-white/[0.025] px-6 text-sm font-medium text-white transition-colors hover:border-white/30 hover:bg-white/[0.06]"
              >
                Login
              </Link>
            </motion.div>
            <p className="mt-6 text-xs text-white/35">
              A more connected experience for every step of learning.
            </p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="relative mx-auto w-full max-w-[510px]"
            aria-label="EduInsight learning analytics preview"
          >
            <div className="absolute -inset-8 rounded-full bg-[#c6a96b]/[0.06] blur-3xl" />
            <div className="relative rounded-2xl border border-white/10 bg-[#10100f]/95 p-4 shadow-[0_32px_100px_rgba(0,0,0,0.45)] sm:p-6">
              <div className="flex items-center justify-between border-b border-white/[0.08] pb-5">
                <div className="flex items-center gap-3">
                  <span className="flex size-9 items-center justify-center rounded-lg bg-[#c6a96b]/10 text-[#d9bd7d]">
                    <ChartNoAxesCombined size={18} />
                  </span>
                  <div>
                    <p className="text-xs font-semibold text-white">Learning overview</p>
                    <p className="mt-1 text-[10px] text-white/40">Your school at a glance</p>
                  </div>
                </div>
                <span className="rounded-full border border-emerald-300/15 bg-emerald-300/[0.07] px-2.5 py-1 text-[9px] font-medium text-emerald-200/80">
                  LIVE INSIGHTS
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 py-5">
                <div className="rounded-xl border border-white/[0.07] bg-white/[0.025] p-4">
                  <p className="text-[10px] text-white/40">Learning activity</p>
                  <p className="mt-2 text-2xl font-semibold tracking-tight text-white">+24.8%</p>
                  <p className="mt-1 text-[10px] text-[#cfb577]">Engagement this term</p>
                </div>
                <div className="rounded-xl border border-white/[0.07] bg-white/[0.025] p-4">
                  <p className="text-[10px] text-white/40">Course progress</p>
                  <p className="mt-2 text-2xl font-semibold tracking-tight text-white">On track</p>
                  <p className="mt-1 text-[10px] text-white/40">Across all classrooms</p>
                </div>
              </div>

              <div className="rounded-xl border border-white/[0.07] bg-white/[0.02] p-4 sm:p-5">
                <div className="mb-5 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium text-white/85">Student engagement</p>
                    <p className="mt-1 text-[10px] text-white/35">A clearer picture of progress</p>
                  </div>
                  <span className="text-[10px] text-white/35">THIS TERM</span>
                </div>
                <div className="flex h-28 items-end gap-2 sm:gap-3" aria-hidden="true">
                  {[35, 52, 43, 69, 57, 82, 68, 94, 74, 88, 63, 100].map((height, index) => (
                    <div
                      key={index}
                      className="flex-1 rounded-t-sm bg-gradient-to-t from-[#8c6a35]/55 to-[#d5b66d]"
                      style={{ height: `${height}%`, opacity: 0.48 + (index % 4) * 0.13 }}
                    />
                  ))}
                </div>
                <div className="mt-3 flex justify-between text-[9px] text-white/30">
                  <span>WEEK 01</span><span>WEEK 06</span><span>WEEK 12</span>
                </div>
              </div>
              <div className="mt-4 flex items-center gap-2 px-1 text-[10px] text-white/40">
                <span className="size-1.5 rounded-full bg-[#c6a96b]" />
                Insights that help every learner move forward
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section id="roles" className="border-t border-white/[0.07] bg-[#0d0d0c]">
        <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-24 lg:px-12">
          <div className="mb-10 grid gap-5 sm:mb-12 md:grid-cols-[1fr_auto] md:items-end">
            <div>
              <p className="mb-3 text-[10px] font-semibold tracking-[0.2em] text-[#c6a96b]">
                ONE PLATFORM, EVERY PERSPECTIVE
              </p>
              <h2 className="max-w-xl text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                Designed around the people behind progress.
              </h2>
            </div>
            <p className="max-w-sm text-sm leading-6 text-white/45">
              Thoughtful tools for every role, working together in one seamless
              learning community.
            </p>
          </div>

          <div className="grid gap-3 md:grid-cols-3">
            {roles.map(({ number, title, description, detail, icon: Icon }, index) => (
              <motion.article
                key={number}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.45, delay: index * 0.08 }}
                className="group rounded-xl border border-white/[0.08] bg-white/[0.02] p-6 transition-colors hover:border-[#c6a96b]/25 hover:bg-white/[0.035] sm:p-7"
              >
                <div className="mb-8 flex items-start justify-between">
                  <span className="flex size-11 items-center justify-center rounded-xl border border-[#c6a96b]/20 bg-[#c6a96b]/[0.07] text-[#d9bd7d] transition-colors group-hover:bg-[#c6a96b]/[0.12]">
                    <Icon size={20} strokeWidth={1.7} />
                  </span>
                  <span className="text-[10px] tracking-[0.14em] text-white/25">{number}</span>
                </div>
                <h3 className="text-lg font-semibold text-white">{title}</h3>
                <p className="mt-3 min-h-[72px] text-sm leading-6 text-white/50">{description}</p>
                <div className="mt-6 border-t border-white/[0.08] pt-4 text-xs font-medium text-[#cfb577]">
                  {detail}
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-white/[0.07] px-5 py-16 sm:px-8 sm:py-20 lg:px-12">
        <div className="mx-auto flex max-w-7xl flex-col gap-7 rounded-2xl border border-[#c6a96b]/15 bg-gradient-to-r from-[#c6a96b]/[0.08] via-white/[0.025] to-transparent p-6 sm:p-9 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="mb-2 text-[10px] font-semibold tracking-[0.18em] text-[#c6a96b]">
              YOUR NEXT CHAPTER STARTS HERE
            </p>
            <h2 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">
              Let&apos;s make learning more insightful.
            </h2>
          </div>
          <Link
            href="/register"
            className="inline-flex min-h-12 shrink-0 items-center justify-center gap-2 self-start rounded-lg bg-[#c6a96b] px-5 text-sm font-semibold text-[#17130b] transition-colors hover:bg-[#d8bd83] md:self-auto"
          >
            Get Started <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      <footer className="border-t border-white/[0.07] px-5 py-6 sm:px-8 lg:px-12">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 text-[10px] text-white/35 sm:flex-row sm:items-center sm:justify-between">
          <span>© {new Date().getFullYear()} EduInsight AI</span>
          <span>Built for better learning outcomes.</span>
        </div>
      </footer>
    </main>
  );
}
