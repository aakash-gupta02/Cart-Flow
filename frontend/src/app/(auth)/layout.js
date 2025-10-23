export default function AuthLayout({ children }) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-[#e8ebe7] to-[#c6cac8]  bg-white/80 backdrop-blur-md rounded-xl shadow-md p-6 ">
                {children}
        </div>
    );
}