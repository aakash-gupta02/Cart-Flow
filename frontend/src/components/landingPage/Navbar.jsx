import React from 'react'

const Navbar = () => {
    return (
        <header className="fixed top-4 left-4 right-4 z-50">
            <div className="max-w-7xl mx-auto">
                <div className="h-14 bg-black/5 border border-white/10 rounded-full flex items-center justify-between px-3 backdrop-blur-xl">
                    <div className="flex items-center justify-between gap-3 pl-1 w-full">
                        <h1 className="text-2xl font-bold tracking-tight text-gray-900">Cart Flow</h1>
                        <div className="flex items-center gap-6">
                            <button className="text-gray-600 hover:text-black">Shop</button>
                            <button className="text-gray-600 hover:text-black">Reviews</button>
                            <button className="text-gray-600 hover:text-black">About</button>
                            <button className="bg-black text-white px-4 py-2 rounded-full hover:bg-gray-900 transition">Sign In</button>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    )
}

export default Navbar