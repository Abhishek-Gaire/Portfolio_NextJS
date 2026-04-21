import {
  Mail,
  MapPin,
  Github,
  Linkedin,
  Twitter,
  Download,
  FileText,
} from "lucide-react";

export default function ContactInformation() {
  return (
    <>
      <div>
        <h3 className="text-2xl font-bold mb-8 text-white">
          Contact Information
        </h3>
        <div className="space-y-6">
          <div className="group flex items-start p-6 bg-gray-800/30 backdrop-blur-sm border border-gray-700/50 rounded-xl hover:bg-gray-800/50 hover:border-gray-600/50 transition-all duration-300">
            <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-xl mr-4 group-hover:bg-blue-500/20 group-hover:scale-110 transition-all duration-300">
              <Mail className="text-blue-400" size={24} />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-white mb-1">Email</p>
              <a
                href="mailto:abhisekgaire7@gmail.com"
                className="text-gray-300 hover:text-blue-400 transition-colors text-lg"
              >
                abhisekgaire7@gmail.com
              </a>
            </div>
          </div>

          <div className="group flex items-start p-6 bg-gray-800/30 backdrop-blur-sm border border-gray-700/50 rounded-xl hover:bg-gray-800/50 hover:border-gray-600/50 transition-all duration-300">
            <div className="p-3 bg-purple-500/10 border border-purple-500/20 rounded-xl mr-4 group-hover:bg-purple-500/20 group-hover:scale-110 transition-all duration-300">
              <MapPin className="text-purple-400" size={24} />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-white mb-1">Location</p>
              <p className="text-gray-300 text-lg">Pokhara, Nepal</p>
            </div>
          </div>

          <div className="p-8 bg-linear-to-br from-blue-900/20 to-purple-900/20 backdrop-blur-sm border border-blue-500/30 rounded-2xl">
            <div className="flex items-center mb-4">
              <div className="p-3 bg-blue-500/20 border border-blue-500/30 rounded-xl mr-4">
                <FileText className="text-blue-400" size={24} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">
                  Professional CV
                </h3>
                <p className="text-gray-400 text-sm">
                  Download my complete resume
                </p>
              </div>
            </div>
            <a
              href="https://vzftblsjklsdaquipabd.supabase.co/storage/v1/object/public/images/cv/Abhishek_Gaire_Resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center w-full justify-center px-6 py-3 bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white rounded-xl transition-all duration-300 shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/40 hover:-translate-y-1 group"
            >
              <Download className="w-5 h-5 mr-2 group-hover:animate-bounce" />
              <span className="font-medium">View & Download CV</span>
            </a>
          </div>
        </div>

        <div className="mt-8">
          <h4 className="text-lg font-semibold text-white mb-4">Follow Me</h4>
          <div className="flex space-x-4">
            <a
              href="https://github.com/Abhishek-Gaire"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 bg-gray-800/50 border border-gray-700/50 rounded-xl text-gray-400 hover:text-white hover:bg-gray-700/50 hover:border-gray-600/50 transition-all duration-300 hover:scale-110"
            >
              <Github size={20} />
            </a>
            <a
              href="https://www.linkedin.com/in/abhisek-gaire-359294219/"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 bg-gray-800/50 border border-gray-700/50 rounded-xl text-gray-400 hover:text-blue-400 hover:bg-gray-700/50 hover:border-gray-600/50 transition-all duration-300 hover:scale-110"
            >
              <Linkedin size={20} />
            </a>
            <a
              href="https://x.com/GaireAbhishek44"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 bg-gray-800/50 border border-gray-700/50 rounded-xl text-gray-400 hover:text-blue-400 hover:bg-gray-700/50 hover:border-gray-600/50 transition-all duration-300 hover:scale-110"
            >
              <Twitter size={20} />
            </a>
          </div>
        </div>
      </div>

      <div className="p-8 bg-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl">
        <h3 className="text-xl font-bold text-white mb-4">Why Work With Me?</h3>
        <div className="space-y-4">
          <div className="flex items-start">
            <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 mr-4"></div>
            <div>
              <h4 className="font-semibold text-white">Fast Response</h4>
              <p className="text-gray-400 text-sm">
                I typically respond within 24 hours
              </p>
            </div>
          </div>
          <div className="flex items-start">
            <div className="w-2 h-2 bg-green-400 rounded-full mt-2 mr-4"></div>
            <div>
              <h4 className="font-semibold text-white">Quality Focused</h4>
              <p className="text-gray-400 text-sm">
                Clean code and modern best practices
              </p>
            </div>
          </div>
          <div className="flex items-start">
            <div className="w-2 h-2 bg-purple-400 rounded-full mt-2 mr-4"></div>
            <div>
              <h4 className="font-semibold text-white">Long-term Support</h4>
              <p className="text-gray-400 text-sm">
                Ongoing maintenance and updates
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
