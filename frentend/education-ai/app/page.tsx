'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { CalendarClock, ClipboardCheck, MessageCircle } from 'lucide-react';

const features = [
  {
    title: 'Smart Scheduling',
    description: 'Automated collision-free timetables.',
    icon: CalendarClock,
  },
  {
    title: 'Effortless Grading',
    description: 'Tap-friendly grading and PDF assignment tracking.',
    icon: ClipboardCheck,
  },
  {
    title: 'Instant Communication',
    description: 'Real-time notifications between admins, teachers, and students.',
    icon: MessageCircle,
  },
];

export default function Home() {
  return (
    <main className="w-full bg-[#0a0a0a] text-white">
      <section className="relative flex min-h-dvh items-center justify-center overflow-hidden bg-[#0a0a0a] px-5 py-24 text-center">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 z-0 size-full object-cover"
        >
          <source src="/hero-bg.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 z-10 bg-gradient-to-b from-[#0a0a0a]/75 via-[#0a0a0a]/55 to-[#0a0a0a]/90" />
        <div className="relative z-20 mx-auto flex max-w-4xl flex-col items-center">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="mb-5 text-[10px] font-semibold tracking-[0.22em] text-amber-200"
          >
            EDUINSIGHT AI
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.1, ease: 'easeOut', delay: 0.15 }}
            className="mb-6 text-5xl font-bold leading-[1.05] text-white drop-shadow-lg sm:text-6xl md:text-7xl"
          >
            Your Learning Journey,
            <br />
            <span className="bg-gradient-to-r from-amber-200 to-amber-500 bg-clip-text text-transparent">
              Powered by AI
            </span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="mb-9 max-w-2xl text-base leading-7 text-gray-200 sm:text-lg"
          >
            Experience education redefined with deep insights, AI-assisted learning, and unparalleled course delivery.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.45, delay: 0.95 }}
          >
            <Link
              href="/student/courses"
              className="inline-flex min-h-12 items-center justify-center rounded-lg border border-white/25 bg-white/10 px-7 text-sm font-semibold text-white shadow-[0_0_24px_rgba(255,255,255,0.1)] backdrop-blur-md transition-colors hover:bg-white/20"
            >
              Enter Dashboard
            </Link>
          </motion.div>
        </div>
      </section>

      <section className="border-t border-white/10 bg-[#10100e] px-5 py-14 sm:py-16">
        <div className="mx-auto max-w-6xl">
          <div className="mb-7 flex items-end justify-between gap-4">
            <div>
              <p className="mb-2 text-[10px] font-semibold tracking-[0.2em] text-amber-300">
                ONE CONNECTED WORKSPACE
              </p>
              <h2 className="text-2xl font-semibold text-white sm:text-3xl">
                Built for the flow of learning
              </h2>
            </div>
          </div>
          <ul className="grid gap-3 md:grid-cols-3">
            {features.map(({ title, description, icon: Icon }, index) => (
              <motion.li
                key={title}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.25 }}
                transition={{ duration: 0.45, delay: index * 0.08 }}
                className="rounded-lg border border-white/10 bg-white/[0.035] p-5 backdrop-blur-sm"
              >
                <span className="mb-4 flex size-10 items-center justify-center rounded-lg border border-amber-200/20 bg-amber-200/[0.07] text-amber-200">
                  <Icon size={19} strokeWidth={1.7} />
                </span>
                <h3 className="text-sm font-semibold text-white">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-white/55">
                  {description}
                </p>
              </motion.li>
            ))}
          </ul>
        </div>
      </section>
    </main>
  );
}
