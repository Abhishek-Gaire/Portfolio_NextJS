import { MapPin } from "lucide-react";
import Link from "next/link";
import HeroAnimated from "./HeroAnimated";

export default function Hero() {
  return (
    <section className="min-h-screen bg-linear-to-br from-gray-900 via-black to-gray-900 relative overflow-hidden flex items-center">
      {/* Background blobs - fine to keep static */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-600/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="flex items-center justify-center min-h-screen">
          <div className="space-y-8 text-center max-w-4xl mx-auto">

            {/* ✅ This content is now in raw HTML - Google can read it */}
            <div className="inline-flex items-center space-x-2 bg-green-500/20 border border-green-500/30 rounded-full px-4 py-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-green-400 text-sm font-medium">
                Available for new projects
              </span>
            </div>

            <div className="space-y-4">
              <h1 className="text-5xl lg:text-7xl font-bold text-white leading-tight">
                Hi, I&apos;m{" "}
                <span className="bg-linear-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  Abhishek Gaire
                </span>
              </h1>
              <p className="text-xl lg:text-2xl text-gray-300 font-light">
                Full-Stack Developer
              </p>
            </div>

            <p className="text-lg text-gray-400 leading-relaxed max-w-2xl">
              I create exceptional digital experiences that combine beautiful
              design with powerful functionality. Specializing in modern web
              technologies and user-centered design principles.
            </p>

            <div className="grid grid-cols-3 gap-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-1">10+</div>
                <div className="text-sm text-gray-400">Projects Completed</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-1">3+</div>
                <div className="text-sm text-gray-400">Years Experience</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-1">100%</div>
                <div className="text-sm text-gray-400">Client Satisfaction</div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/projects"
                className="bg-linear-to-r from-blue-600 to-blue-700 text-white font-semibold px-8 py-4 rounded-xl flex items-center justify-center space-x-2"
              >
                <span>Explore My Full-Stack Projects</span>
              </Link>
              <a
                href="https://vzftblsjklsdaquipabd.supabase.co/storage/v1/object/public/images/cv/Abhishek_Gaire_Resume.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-linear-to-r from-green-600 to-emerald-600 text-white font-semibold px-8 py-4 rounded-xl flex items-center justify-center space-x-2"
              >
                <span>Download CV</span>
              </a>
              <Link
                href="/contact"
                className="border border-white/20 text-white font-semibold px-8 py-4 rounded-xl"
              >
                Start a Conversation
              </Link>
            </div>

            <div className="flex items-center justify-center space-x-2 text-gray-400">
              <MapPin className="w-4 h-4" />
              <span>Based in Pokhara, Nepal</span>
            </div>
          </div>
        </div>
      </div>

      {/* Animations layered on top - client only, doesn't affect SEO */}
      <HeroAnimated />
    </section >
  );
}
