import { Mail, ArrowRight } from "lucide-react";
import Image from "next/image";

const NewsletterSection = () => {
    return (
        <section className="mt-12 overflow-hidden rounded-[2rem] bg-neutral-950 text-white">
            <div className="relative">
                {/* Background Image */}
                <div className="absolute inset-0">
                    <Image
                        src="https://images.unsplash.com/photo-1559697242-a465f2578a95?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=687"
                        alt="Editorial fashion"
                        fill
                        className="object-cover opacity-70"
                    />
                </div>

                {/* Content */}
                <div className="relative flex flex-col justify-between p-8 sm:p-12 min-h-[400px] lg:min-h-[500px]">
                    {/* Top Section - Words */}
                    <div className="flex gap-4 sm:gap-6 text-lg sm:text-xl lg:gap-48 justify-center">
                        <span className="opacity-90 font-light">Elegant.</span>
                        <span className="opacity-90 font-light">Enchanting.</span>
                        <span className="opacity-90 font-light">Versencia.</span>
                    </div>

                    {/* Middle Section - Input & Buttons */}
                    <div className="w-full max-w-2xl mx-auto space-y-6">
                        <h3 className="mt-4 text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-center">
                            Get It Before
                            <br />
                            Everyone Else!
                        </h3>
                        {/* Email Input */}
                        <div className="flex flex-col sm:flex-row gap-4">
                            <div className="flex-1">
                                <div className="flex items-center gap-3 rounded-2xl bg-white/90 backdrop-blur-sm px-4 py-3 ring-1 ring-white/20">
                                    <Mail className="h-5 w-5 text-neutral-700" />
                                    <input
                                        type="email"
                                        placeholder="Your Email Address"
                                        className="flex-1 bg-transparent outline-none text-neutral-900 placeholder:text-neutral-500 text-sm sm:text-base"
                                    />
                                    <button className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-neutral-900 text-white transition-all hover:scale-105 hover:shadow-lg">
                                        <ArrowRight className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Buttons */}
                        <div className="flex flex-col sm:flex-row gap-3">
                            <a
                                href="#"
                                className="flex-1 rounded-2xl bg-white/10 backdrop-blur-sm px-6 py-4 text-sm font-medium ring-1 ring-white/20 text-white inline-flex items-center justify-between transition-all hover:scale-105 hover:bg-white/20"
                            >
                                2025 Lookbook
                                <ArrowRight className="h-4 w-4" />
                            </a>
                            <a
                                href="#"
                                className="flex-1 rounded-2xl bg-white text-neutral-900 px-6 py-4 text-sm font-medium inline-flex items-center justify-between transition-all hover:scale-105 hover:shadow-lg"
                            >
                                Shop Now
                                <ArrowRight className="h-4 w-4" />
                            </a>
                        </div>
                    </div>

                    {/* Spacer to push content up */}
                    {/* <div /> */}
                </div>
            </div>
        </section>
    );
};

export default NewsletterSection;
