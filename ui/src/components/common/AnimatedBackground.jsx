"use client";

const AnimatedBackground = ({ variant = "default" }) => {
	const backgrounds = {
		default: (
			<div className="fixed inset-0 overflow-hidden pointer-events-none">
				{/* Floating Circles - Light Colors */}
				<div className="absolute top-20 left-10 w-20 h-20 bg-blue-100 rounded-full opacity-30 animate-float"></div>
				<div className="absolute top-40 right-20 w-16 h-16 bg-purple-100 rounded-full opacity-40 animate-float-reverse"></div>
				<div className="absolute bottom-40 left-20 w-24 h-24 bg-green-100 rounded-full opacity-35 animate-drift"></div>
				<div className="absolute bottom-20 right-10 w-12 h-12 bg-pink-100 rounded-full opacity-45 animate-drift-slow"></div>

				{/* Geometric Shapes - Light Colors */}
				<div className="absolute top-60 left-1/4 w-8 h-8 bg-blue-200 rotate-45 opacity-30 animate-pulse-glow"></div>
				<div className="absolute top-80 right-1/3 w-6 h-6 bg-purple-200 rotate-12 opacity-40 animate-float"></div>
				<div className="absolute bottom-60 left-1/3 w-10 h-10 bg-green-200 rotate-45 opacity-35 animate-drift"></div>

				{/* Gradient Orbs - Light Colors */}
				<div className="absolute top-1/4 left-1/2 w-32 h-32 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full opacity-20 animate-pulse-glow blur-xl"></div>
				<div className="absolute bottom-1/4 right-1/4 w-24 h-24 bg-gradient-to-r from-green-100 to-blue-100 rounded-full opacity-25 animate-drift-slow blur-lg"></div>
			</div>
		),

		login: (
			<div className="fixed inset-0 overflow-hidden pointer-events-none">
				{/* Login specific animations */}
				<div className="absolute top-20 left-10 w-20 h-20 bg-blue-300 rounded-full opacity-20 animate-float"></div>
				<div className="absolute top-40 right-20 w-16 h-16 bg-indigo-300 rounded-full opacity-30 animate-float-reverse"></div>
				<div className="absolute bottom-40 left-20 w-24 h-24 bg-cyan-300 rounded-full opacity-25 animate-drift"></div>
				<div className="absolute bottom-20 right-10 w-12 h-12 bg-blue-400 rounded-full opacity-35 animate-drift-slow"></div>

				{/* Lock and Security themed shapes */}
				<div className="absolute top-60 left-1/4 w-8 h-8 bg-blue-400 rotate-45 opacity-20 animate-pulse-glow"></div>
				<div className="absolute top-80 right-1/3 w-6 h-6 bg-indigo-400 rotate-12 opacity-30 animate-float"></div>
				<div className="absolute bottom-60 left-1/3 w-10 h-10 bg-cyan-400 rotate-45 opacity-25 animate-drift"></div>

				{/* Security gradient orbs */}
				<div className="absolute top-1/4 left-1/2 w-32 h-32 bg-gradient-to-r from-blue-300 to-indigo-300 rounded-full opacity-10 animate-pulse-glow blur-xl"></div>
				<div className="absolute bottom-1/4 right-1/4 w-24 h-24 bg-gradient-to-r from-cyan-300 to-blue-300 rounded-full opacity-15 animate-drift-slow blur-lg"></div>
			</div>
		),

		register: (
			<div className="fixed inset-0 overflow-hidden pointer-events-none">
				{/* Registration specific animations */}
				<div className="absolute top-20 left-10 w-20 h-20 bg-green-300 rounded-full opacity-20 animate-float"></div>
				<div className="absolute top-40 right-20 w-16 h-16 bg-emerald-300 rounded-full opacity-30 animate-float-reverse"></div>
				<div className="absolute bottom-40 left-20 w-24 h-24 bg-teal-300 rounded-full opacity-25 animate-drift"></div>
				<div className="absolute bottom-20 right-10 w-12 h-12 bg-green-400 rounded-full opacity-35 animate-drift-slow"></div>

				{/* Welcome themed shapes */}
				<div className="absolute top-60 left-1/4 w-8 h-8 bg-green-400 rotate-45 opacity-20 animate-pulse-glow"></div>
				<div className="absolute top-80 right-1/3 w-6 h-6 bg-emerald-400 rotate-12 opacity-30 animate-float"></div>
				<div className="absolute bottom-60 left-1/3 w-10 h-10 bg-teal-400 rotate-45 opacity-25 animate-drift"></div>

				{/* Welcome gradient orbs */}
				<div className="absolute top-1/4 left-1/2 w-32 h-32 bg-gradient-to-r from-green-300 to-emerald-300 rounded-full opacity-10 animate-pulse-glow blur-xl"></div>
				<div className="absolute bottom-1/4 right-1/4 w-24 h-24 bg-gradient-to-r from-teal-300 to-green-300 rounded-full opacity-15 animate-drift-slow blur-lg"></div>
			</div>
		),
		success: (
			<>
				{/* Enhanced Success celebration animations */}
				<div className="absolute top-20 left-10 w-20 h-20 bg-gradient-to-r from-yellow-300 to-orange-300 rounded-full opacity-25 animate-float"></div>
				<div className="absolute top-40 right-20 w-16 h-16 bg-gradient-to-r from-pink-300 to-purple-300 rounded-full opacity-30 animate-float-reverse"></div>
				<div className="absolute bottom-40 left-20 w-24 h-24 bg-gradient-to-r from-green-300 to-emerald-300 rounded-full opacity-25 animate-drift"></div>
				<div className="absolute bottom-20 right-10 w-12 h-12 bg-gradient-to-r from-blue-300 to-cyan-300 rounded-full opacity-35 animate-drift-slow"></div>

				{/* Additional celebration elements */}
				<div className="absolute top-60 left-1/3 w-14 h-14 bg-gradient-to-r from-yellow-300 to-pink-300 rounded-full opacity-20 animate-float"></div>
				<div className="absolute bottom-60 right-1/3 w-18 h-18 bg-gradient-to-r from-purple-300 to-blue-300 rounded-full opacity-20 animate-drift"></div>

				{/* Celebration shapes with enhanced animations */}
				<div className="absolute top-60 left-1/4 w-8 h-8 bg-yellow-400 rotate-45 opacity-25 animate-pulse-glow"></div>
				<div className="absolute top-80 right-1/3 w-6 h-6 bg-orange-400 rotate-12 opacity-30 animate-float"></div>
				<div className="absolute bottom-60 left-1/3 w-10 h-10 bg-green-400 rotate-45 opacity-25 animate-drift"></div>
				<div className="absolute top-1/2 right-1/4 w-4 h-4 bg-pink-400 rotate-30 opacity-35 animate-pulse-glow"></div>
				<div className="absolute bottom-1/3 left-1/5 w-6 h-6 bg-purple-400 rotate-60 opacity-30 animate-float"></div>

				{/* Enhanced celebration gradient orbs */}
				<div className="absolute top-1/4 left-1/2 w-32 h-32 bg-gradient-to-r from-yellow-300 to-orange-300 rounded-full opacity-12 animate-pulse-glow blur-xl"></div>
				<div className="absolute bottom-1/4 right-1/4 w-24 h-24 bg-gradient-to-r from-green-300 to-yellow-300 rounded-full opacity-15 animate-drift-slow blur-lg"></div>
				<div className="absolute top-1/2 right-1/3 w-20 h-20 bg-gradient-to-r from-pink-300 to-purple-300 rounded-full opacity-10 animate-pulse-glow blur-lg"></div>

				{/* Enhanced confetti elements */}
				<div className="absolute top-10 left-1/3 w-3 h-3 bg-yellow-400 rotate-45 opacity-70 animate-confetti"></div>
				<div
					className="absolute top-20 right-1/3 w-2 h-2 bg-orange-400 rotate-45 opacity-70 animate-confetti"
					style={{ animationDelay: "0.5s" }}
				></div>
				<div
					className="absolute top-30 left-1/2 w-2 h-2 bg-green-400 rotate-45 opacity-70 animate-confetti"
					style={{ animationDelay: "1s" }}
				></div>
				<div
					className="absolute top-40 right-1/4 w-3 h-3 bg-pink-400 rotate-45 opacity-70 animate-confetti"
					style={{ animationDelay: "1.5s" }}
				></div>
				<div
					className="absolute top-50 left-1/5 w-2 h-2 bg-purple-400 rotate-45 opacity-70 animate-confetti"
					style={{ animationDelay: "2s" }}
				></div>
				<div
					className="absolute top-60 right-1/5 w-2 h-2 bg-blue-400 rotate-45 opacity-70 animate-confetti"
					style={{ animationDelay: "2.5s" }}
				></div>

				{/* Celebration sparkles */}
				<div className="absolute top-1/3 left-1/4 w-1 h-1 bg-yellow-300 rounded-full opacity-60 animate-pulse-glow"></div>
				<div
					className="absolute top-1/3 right-1/4 w-1 h-1 bg-orange-300 rounded-full opacity-60 animate-pulse-glow"
					style={{ animationDelay: "0.7s" }}
				></div>
				<div
					className="absolute bottom-1/3 left-1/3 w-1 h-1 bg-pink-300 rounded-full opacity-60 animate-pulse-glow"
					style={{ animationDelay: "1.4s" }}
				></div>
				<div
					className="absolute bottom-1/3 right-1/3 w-1 h-1 bg-purple-300 rounded-full opacity-60 animate-pulse-glow"
					style={{ animationDelay: "2.1s" }}
				></div>
			</>
		),
		illustrations: (
			<div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
				{/* Floating 3D Illustrations */}
				<img
					src="/assets/illustrations/3d_1.png"
					className="absolute top-20 left-10 w-24 h-24 opacity-40 animate-float object-contain drop-shadow-xl"
					alt=""
				/>
				<img
					src="/assets/illustrations/3d_2.png"
					className="absolute top-30 right-20 w-20 h-20 opacity-50 animate-float-reverse object-contain drop-shadow-xl"
					alt=""
				/>
				<img
					src="/assets/illustrations/3d_3.png"
					className="absolute bottom-40 left-20 w-32 h-32 opacity-30 animate-drift object-contain drop-shadow-xl"
					alt=""
				/>
				<img
					src="/assets/illustrations/3d_4.png"
					className="absolute bottom-20 right-10 w-16 h-16 opacity-40 animate-drift-slow object-contain drop-shadow-xl"
					alt=""
				/>

				<img
					src="/assets/illustrations/3d_5.png"
					className="absolute top-60 left-1/3 w-20 h-20 opacity-35 animate-float-no-rotate object-contain drop-shadow-xl"
					alt=""
				/>
				<img
					src="/assets/illustrations/3d_6.png"
					className="absolute bottom-60 right-1/3 w-28 h-28 opacity-25 animate-drift-no-rotate object-contain drop-shadow-xl"
					alt=""
				/>

				<img
					src="/assets/illustrations/3d_7.png"
					className="absolute top-60 left-1/4 w-16 h-16 opacity-30 animate-pulse-glow object-contain drop-shadow-xl"
					alt=""
				/>
				<img
					src="/assets/illustrations/3d_8.png"
					className="absolute top-80 right-1/3 w-12 h-12 opacity-40 animate-float-reverse-no-rotate object-contain drop-shadow-xl"
					alt=""
				/>
				<img
					src="/assets/illustrations/3d_9.png"
					className="absolute bottom-60 left-1/3 w-20 h-20 opacity-35 animate-drift-no-rotate object-contain drop-shadow-xl"
					alt=""
				/>
				<img
					src="/assets/illustrations/3d_10.png"
					className="absolute top-1/2 right-1/4 w-24 h-24 opacity-40 animate-float-no-rotate object-contain drop-shadow-xl"
					alt=""
				/>

				<img
					src="/assets/illustrations/3d_11.png"
					className="absolute bottom-1/3 left-1/5 w-16 h-16 opacity-30 animate-float-reverse-no-rotate object-contain drop-shadow-xl"
					alt=""
				/>
				<img
					src="/assets/illustrations/3d_12.png"
					className="absolute top-1/4 right-1/2 w-14 h-14 opacity-40 animate-drift-slow-no-rotate object-contain drop-shadow-xl"
					alt=""
				/>
				<img
					src="/assets/illustrations/3d_13.png"
					className="absolute bottom-1/4 left-1/2 w-20 h-20 opacity-45 animate-float-reverse object-contain drop-shadow-xl"
					alt=""
				/>

				{/* Enhanced celebration gradient orbs slightly behind the images for depth */}
				<div className="absolute top-1/4 left-1/2 w-48 h-48 bg-[rgb(var(--color-primary))]/20 rounded-full animate-pulse-glow blur-3xl mix-blend-screen"></div>
				<div className="absolute bottom-1/4 right-1/4 w-36 h-36 bg-[rgb(var(--color-secondary))]/20 rounded-full animate-drift-slow blur-2xl mix-blend-screen"></div>
				<div className="absolute top-1/2 right-1/3 w-40 h-40 bg-[rgb(var(--color-primary))]/15 rounded-full animate-pulse-glow blur-2xl mix-blend-screen"></div>
			</div>
		),
	};

	return backgrounds[variant] || backgrounds.default;
};

export default AnimatedBackground;
