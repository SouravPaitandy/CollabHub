"use client";
import { Button } from "@/components/common/Button";
import TeamMember from "@/components/about/TeamMember";
import Timeline from "@/components/about/TimeLine";
import { motion } from "framer-motion";
import SpotlightCard from "@/components/ui/SpotlightCard";

import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="min-h-screen  selection:bg-indigo-500/30 overflow-hidden">
      {/* Background Ambience */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-600/20 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/20 rounded-full blur-[120px] animate-pulse delay-1000" />
      </div>

      {/* Hero Section */}
      <section className="relative pt-40 pb-20 px-4 text-center z-10">
        <div className="max-w-5xl mx-auto">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-5xl md:text-8xl font-black font-hacker mb-8 bg-clip-text text-transparent bg-gradient-to-b from-white via-white to-white/40"
          >
            OUR STORY
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl md:text-2xl text-gray-400 font-geist-sans mb-12 leading-relaxed max-w-3xl mx-auto"
          >
            <span className="text-indigo-400 font-semibold">Coordly</span>{" "}
            (formerly CollabHub) was born from a vision to revolutionize the way
            teams work together. We believe in the power of seamless
            collaboration to drive innovation and success.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex justify-center"
          >
            <Button
              href="/contact"
              className="bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-4 text-lg rounded-full shadow-[0_0_20px_rgba(79,70,229,0.5)] hover:shadow-[0_0_30px_rgba(79,70,229,0.7)] transition-all duration-300"
            >
              Get in Touch
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-24 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SpotlightCard className="p-8 md:p-16 rounded-[3rem] bg-white/5 border border-white/10 backdrop-blur-xl">
            <div className="flex flex-col md:flex-row items-center justify-between gap-16">
              <div className="md:w-1/2 relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl md:rounded-[2rem] blur-xl opacity-30 group-hover:opacity-50 transition-opacity duration-500"></div>
                <img
                  src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
                  alt="Our Mission"
                  className="relative z-10 w-full h-auto object-cover rounded-2xl md:rounded-[2rem] border border-white/10 shadow-2xl grayscale group-hover:grayscale-0 transition-all duration-500 transform group-hover:scale-[1.02]"
                />
              </div>
              <div className="md:w-1/2">
                <h2 className="text-3xl md:text-5xl font-bold font-hacker text-white mb-8">
                  Mission & Vision
                </h2>
                <p className="text-lg font-geist-sans text-gray-400 leading-relaxed mb-10">
                  At Coordly, our mission is to empower teams of all sizes to
                  achieve their full potential through intuitive, powerful
                  collaboration tools. We&apos;re committed to breaking down
                  communication barriers and fostering a culture of innovation
                  and productivity in every organization we serve.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="bg-white/5 p-6 rounded-2xl border border-white/5 hover:bg-white/10 transition-colors">
                    <h3 className="font-bold text-xl mb-2 text-indigo-400">
                      Innovation
                    </h3>
                    <p className="text-gray-400 text-sm font-geist-sans">
                      Pushing boundaries to create better solutions
                    </p>
                  </div>
                  <div className="bg-white/5 p-6 rounded-2xl border border-white/5 hover:bg-white/10 transition-colors">
                    <h3 className="font-bold text-xl mb-2 text-purple-400">
                      Excellence
                    </h3>
                    <p className="text-gray-400 text-sm font-geist-sans">
                      Committed to delivering quality in everything we do
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </SpotlightCard>
        </div>
      </section>

      {/* Timeline Section */}
      <div className="relative z-10 py-10">
        <div className="text-center mt-12">
          <Link
            href="/updates"
            className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors inline-flex items-center gap-2"
          >
            View our full timeline & updates
            <span className="text-xl">→</span>
          </Link>
        </div>
      </div>

      {/* Team Section */}
      <section className="py-24 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="text-4xl md:text-6xl font-bold font-hacker text-white mb-6">
              Meet The Minds
            </h2>
            <p className="text-xl font-geist-sans text-gray-400 max-w-3xl mx-auto">
              The passionate individuals behind Coordly who are dedicated to
              transforming how teams collaborate
            </p>
          </motion.div>

          <div className="flex justify-center items-center">
            <TeamMember
              name="Sourav Paitandy"
              role="CEO & Founder, CTO, Head of Design"
              image="https://png.pngtree.com/png-vector/20190710/ourlarge/pngtree-user-vector-avatar-png-image_1541962.jpg"
            />
            {/* <TeamMember
              name="Sourav Paitandy"
              role="CTO"
              image="https://png.pngtree.com/png-vector/20190710/ourlarge/pngtree-user-vector-avatar-png-image_1541962.jpg"
            />
            <TeamMember
              name="Sourav Paitandy"
              role="Head of Design"
              image="https://png.pngtree.com/png-vector/20190710/ourlarge/pngtree-user-vector-avatar-png-image_1541962.jpg"
            /> */}
          </div>
        </div>
      </section>

      {/* Join Us Section */}
      <section className="py-32 rounded-4xl relative z-10 overflow-hidden">
        {/* Abstract shapes */}
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-900/40 to-purple-900/40" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-600/10 rounded-full blur-3xl animate-pulse" />

        <div className="max-w-4xl mx-auto text-center relative z-20 px-4">
          <h2 className="text-4xl md:text-6xl font-bold font-hacker text-white mb-8">
            Ready to Shape the Future?
          </h2>
          <p className="text-xl font-geist-sans text-gray-300 mb-12 leading-relaxed">
            We&apos;re always looking for passionate individuals to join our
            team. If you&apos;re excited about creating innovative solutions
            that help teams work better together, we&apos;d love to hear from
            you.
          </p>
          <Button
            href="/careers"
            className="bg-white text-black hover:bg-gray-100 px-10 py-4 rounded-full text-lg font-bold shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:shadow-[0_0_30px_rgba(255,255,255,0.5)] transform transition-all hover:scale-105"
          >
            View Open Positions
          </Button>
        </div>
      </section>
    </div>
  );
}
