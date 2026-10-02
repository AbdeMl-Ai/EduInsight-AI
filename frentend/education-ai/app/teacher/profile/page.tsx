"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { LoaderCircle, Mail, Phone, User } from "lucide-react";
import LogoutButton from "@/components/app/LogoutButton";
import {
  getTeacherErrorMessage,
  getTeacherProfile,
  type TeacherProfile,
} from "@/lib/teacher-api";

export default function TeacherProfilePage() {
  const [profile, setProfile] = useState<TeacherProfile | null>(null);
  const [error, setError] = useState("");
  useEffect(() => {
    const controller = new AbortController();
    getTeacherProfile(controller.signal)
      .then(setProfile)
      .catch((requestError: unknown) => {
        if (!controller.signal.aborted)
          setError(
            getTeacherErrorMessage(
              requestError,
              "Profile could not be loaded.",
            ),
          );
      });
    return () => controller.abort();
  }, []);
  return (
    <motion.section
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6 pb-24"
    >
      <header>
        <p className="text-[10px] font-semibold tracking-[0.18em] text-[#dfc27e]">
          ACCOUNT
        </p>
        <h1 className="mt-2 text-2xl font-semibold text-white">Profile</h1>
      </header>
      {error && (
        <p
          role="alert"
          className="rounded-2xl border border-rose-300/20 bg-rose-300/[0.05] p-4 text-xs text-rose-200"
        >
          {error}
        </p>
      )}
      {profile ? (
        <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-5">
          <div className="flex size-14 items-center justify-center rounded-full border border-[#c6a96b]/30 bg-[#c6a96b]/[0.08] text-[#dfc27e]">
            <User size={23} />
          </div>
          <h2 className="mt-4 text-xl font-semibold text-white">
            {profile.full_name}
          </h2>
          <div className="mt-5 space-y-3 text-xs text-white/55">
            <p className="flex items-center gap-2">
              <Mail size={15} className="text-[#dfc27e]" />
              {profile.email}
            </p>
            <p className="flex items-center gap-2">
              <Phone size={15} className="text-[#dfc27e]" />
              {profile.phone_number || "No phone number"}
            </p>
          </div>
        </div>
      ) : (
        !error && <LoaderCircle className="animate-spin text-[#dfc27e]" />
      )}
      <LogoutButton />
    </motion.section>
  );
}
