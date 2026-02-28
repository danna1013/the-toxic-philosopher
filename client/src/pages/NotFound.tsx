import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { Home, ArrowLeft } from "lucide-react";
import StarField from "@/components/StarField";

export default function NotFound() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white relative overflow-hidden flex items-center justify-center">
      <StarField count={150} />
      <div className="absolute inset-0 cosmic-bg pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 text-center px-6"
      >
        <div className="text-8xl md:text-9xl font-bold gradient-text-purple mb-4">404</div>
        <h2 className="text-2xl md:text-3xl font-bold text-white/80 mb-4">
          迷失在宇宙中
        </h2>
        <p className="text-white/40 text-base mb-10 max-w-md mx-auto">
          这个页面似乎不存在，也许它已经被哲学家们质疑到消失了。
        </p>
        <div className="flex items-center justify-center gap-4">
          <button
            onClick={() => window.history.back()}
            className="btn-apple-secondary text-sm px-6 py-3"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            返回
          </button>
          <button
            onClick={() => setLocation("/")}
            className="btn-apple-primary text-sm px-6 py-3"
          >
            <Home className="w-4 h-4 mr-2" />
            回到首页
          </button>
        </div>
      </motion.div>
    </div>
  );
}
