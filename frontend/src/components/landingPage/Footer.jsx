import React from 'react'
import {
    Facebook,
    Twitter,
    Instagram,
    Youtube,
    Github,
    CreditCard,
    Shield,
    HeadphonesIcon,
    Truck,
    ArrowRight
} from "lucide-react"
import NewsletterSection from './NewsLetterSection'

const Footer = () => {
    return (
        <footer className="mt-20 rounded-t-[4rem]  bg-black text-white ">
            <NewsletterSection />

            {/* Main Footer Content */}


            {/* Links Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
                    {/* Company Info */}
                    <div className="lg:col-span-2">
                        <h2 className="text-2xl font-bold mb-4">CartFlow</h2>
                        <p className="text-neutral-400 mb-6 max-w-md">
                            Your one-stop destination for modern shopping experience.
                            Built as a learning project to explore microservices architecture and modern web development.
                        </p>
                        <div className="flex items-center gap-4">
                            <a
                                href="https://github.com"
                                className="h-10 w-10 rounded-lg bg-neutral-800 flex items-center justify-center transition-all hover:bg-neutral-700 hover:scale-110"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <Github className="h-5 w-5" />
                            </a>
                            <a
                                href="#"
                                className="h-10 w-10 rounded-lg bg-neutral-800 flex items-center justify-center transition-all hover:bg-neutral-700 hover:scale-110"
                            >
                                <Twitter className="h-5 w-5" />
                            </a>
                            <a
                                href="#"
                                className="h-10 w-10 rounded-lg bg-neutral-800 flex items-center justify-center transition-all hover:bg-neutral-700 hover:scale-110"
                            >
                                <Instagram className="h-5 w-5" />
                            </a>
                            <a
                                href="#"
                                className="h-10 w-10 rounded-lg bg-neutral-800 flex items-center justify-center transition-all hover:bg-neutral-700 hover:scale-110"
                            >
                                <Facebook className="h-5 w-5" />
                            </a>
                        </div>
                    </div>

                    {/* Shop Links */}
                    <div>
                        <h3 className="font-semibold text-lg mb-4">Shop</h3>
                        <ul className="space-y-3 text-neutral-400">
                            <li><a href="#" className="transition-colors hover:text-white">All Products</a></li>
                            <li><a href="#" className="transition-colors hover:text-white">New Arrivals</a></li>
                            <li><a href="#" className="transition-colors hover:text-white">Best Sellers</a></li>
                            <li><a href="#" className="transition-colors hover:text-white">Sale Items</a></li>
                            <li><a href="#" className="transition-colors hover:text-white">Gift Cards</a></li>
                        </ul>
                    </div>

                    {/* Support Links */}
                    <div>
                        <h3 className="font-semibold text-lg mb-4">Support</h3>
                        <ul className="space-y-3 text-neutral-400">
                            <li><a href="#" className="transition-colors hover:text-white">Contact Us</a></li>
                            <li><a href="#" className="transition-colors hover:text-white">Shipping Info</a></li>
                            <li><a href="#" className="transition-colors hover:text-white">Returns</a></li>
                            <li><a href="#" className="transition-colors hover:text-white">Size Guide</a></li>
                            <li><a href="#" className="transition-colors hover:text-white">FAQs</a></li>
                        </ul>
                    </div>

                    {/* Company Links */}
                    <div>
                        <h3 className="font-semibold text-lg mb-4">Company</h3>
                        <ul className="space-y-3 text-neutral-400">
                            <li><a href="#" className="transition-colors hover:text-white">About Us</a></li>
                            <li><a href="#" className="transition-colors hover:text-white">Careers</a></li>
                            <li><a href="#" className="transition-colors hover:text-white">Privacy Policy</a></li>
                            <li><a href="#" className="transition-colors hover:text-white">Terms of Service</a></li>
                            <li><a href="#" className="transition-colors hover:text-white">Blog</a></li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="border-t border-neutral-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                        <div className="text-neutral-400 text-sm">
                            © 2024 CartFlow. Built for learning purposes.
                            <span className="ml-2 text-blue-400">Microservices ECommerce Project</span>
                        </div>

                        <div className="flex items-center gap-6 text-sm text-neutral-400">
                            <span>Tech Stack:</span>
                            <div className="flex items-center gap-4">
                                <span className="px-3 py-1 bg-neutral-800 rounded-full text-xs">Next.js</span>
                                <span className="px-3 py-1 bg-neutral-800 rounded-full text-xs">Tailwind CSS</span>
                                <span className="px-3 py-1 bg-neutral-800 rounded-full text-xs">Microservices</span>
                                <span className="px-3 py-1 bg-neutral-800 rounded-full text-xs">Node.js</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    )
}

export default Footer