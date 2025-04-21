import Image from 'next/image';
import { Button } from "@/components/common/Button";
import TeamMember from '@/components/about/TeamMember';
import Timeline from '@/components/about/TimeLine';

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-white via-white to-indigo-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
            {/* Hero Section */}
            <section className="py-24 md:py-32 text-center px-4">
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-4xl md:text-6xl font-extrabold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-600">
                        Our Story
                    </h1>
                    <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-10 leading-relaxed">
                        CollabHub was born from a vision to revolutionize the way teams work together. 
                        We believe in the power of seamless collaboration to drive innovation and success.
                    </p>
                    <div className="flex justify-center">
                        <Button href="/contact" className="bg-indigo-600 hover:bg-indigo-700 text-white">
                            Get in Touch
                        </Button>
                    </div>
                </div>
            </section>

            {/* Mission Section */}
            <section className="py-20 md:py-28 bg-gray-50 dark:bg-gray-800/50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 text-gray-900 dark:text-white">
                        Our Mission
                    </h2>
                    <div className="flex flex-col md:flex-row items-center justify-between gap-12">
                        <div className="md:w-1/2 relative">
                            <div className="absolute -top-3 -left-3 w-full h-full bg-indigo-200 dark:bg-indigo-900 rounded-lg transform -rotate-2"></div>
                            <img 
                                src="https://th.bing.com/th/id/OIP.gstLb1jnX5Hnpfpy10DJvgHaEK?rs=1&pid=ImgDetMain" 
                                alt="Our Mission" 
                                className="rounded-lg shadow-lg relative z-10 w-full h-auto object-cover" 
                            />
                        </div>
                        <div className="md:w-1/2 md:pl-8 mt-10 md:mt-0">
                            <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 leading-relaxed">
                                At CollabHub, our mission is to empower teams of all sizes to achieve their full potential through intuitive, 
                                powerful collaboration tools. We&apos;re committed to breaking down communication barriers and fostering a culture 
                                of innovation and productivity in every organization we serve.
                            </p>
                            <div className="mt-8 flex flex-wrap gap-4">
                                <div className="bg-white dark:bg-gray-700 p-4 rounded-lg shadow-sm flex-1 min-w-[200px]">
                                    <h3 className="font-semibold text-lg mb-2 text-indigo-600 dark:text-indigo-400">Innovation</h3>
                                    <p className="text-gray-600 dark:text-gray-300">Pushing boundaries to create better solutions</p>
                                </div>
                                <div className="bg-white dark:bg-gray-700 p-4 rounded-lg shadow-sm flex-1 min-w-[200px]">
                                    <h3 className="font-semibold text-lg mb-2 text-indigo-600 dark:text-indigo-400">Excellence</h3>
                                    <p className="text-gray-600 dark:text-gray-300">Committed to delivering quality in everything we do</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Timeline Section */}
            <Timeline />

            {/* Team Section */}
            <section className="py-20 md:py-28">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 text-gray-900 dark:text-white">Meet Our Team</h2>
                    <p className="text-center text-lg text-gray-600 dark:text-gray-300 mb-16 max-w-3xl mx-auto">
                        The passionate individuals behind CollabHub who are dedicated to transforming how teams collaborate
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
                        <TeamMember name="Sourav Paitandy" role="CEO & Founder" image="https://png.pngtree.com/png-vector/20190710/ourlarge/pngtree-user-vector-avatar-png-image_1541962.jpg" />
                        <TeamMember name="Sourav Paitandy" role="CTO" image="https://png.pngtree.com/png-vector/20190710/ourlarge/pngtree-user-vector-avatar-png-image_1541962.jpg" />
                        <TeamMember name="Sourav Paitandy" role="Head of Design" image="https://png.pngtree.com/png-vector/20190710/ourlarge/pngtree-user-vector-avatar-png-image_1541962.jpg" />
                    </div>
                </div>
            </section>

            {/* Join Us Section */}
            <section className="py-20 md:py-28 bg-gradient-to-br from-indigo-600 to-purple-700 dark:from-indigo-800 dark:to-purple-900 text-white text-center px-4">
                <div className="max-w-4xl mx-auto">
                    <h2 className="text-3xl md:text-4xl font-bold mb-8">Join Us in Shaping the Future of Collaboration</h2>
                    <p className="text-xl mb-10 leading-relaxed">
                        We&apos;re always looking for passionate individuals to join our team. If you&apos;re excited about creating 
                        innovative solutions that help teams work better together, we&apos;d love to hear from you.
                    </p>
                    <Button href="/careers" className="bg-white text-indigo-600 hover:bg-indigo-50 shadow-lg transform transition-transform hover:scale-105">
                        View Open Positions
                    </Button>
                </div>

                <footer className="pt-20 mt-10 text-center border-t border-indigo-500/30">
                    <div className="flex justify-center space-x-6 mb-8">
                        <a href="#" className="text-white hover:text-indigo-200 transition-colors">
                            <span className="sr-only">Twitter</span>
                            <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                            </svg>
                        </a>
                        <a href="#" className="text-white hover:text-indigo-200 transition-colors">
                            <span className="sr-only">LinkedIn</span>
                            <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                <path fillRule="evenodd" d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" clipRule="evenodd" />
                            </svg>
                        </a>
                        <a href="#" className="text-white hover:text-indigo-200 transition-colors">
                            <span className="sr-only">GitHub</span>
                            <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                            </svg>
                        </a>
                    </div>
                    <p className="text-indigo-100">&copy; 2025 CollabHub. All rights reserved.</p>
                </footer>
            </section>
        </div>
    );
}