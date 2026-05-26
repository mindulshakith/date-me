import { motion } from 'framer-motion';
import PetalRain from '../components/PetalRain';

export default function RejectedPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #fde8f0 0%, #fdf8f3 50%, #ede8f7 100%)' }}>
      <PetalRain count={8} />
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="card-glass rounded-3xl p-8 max-w-sm w-full text-center shadow-xl z-10"
      >
        <img
          src="https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExc2EycmV0OGUwYmEza2RrcWM3b2lvcXFkczFyNzltZG11eXpqNTZyOSZlcD12MV9naWZzX3NlYXJjaCZjdD1n/ghtJghlRKn2P2ITY7M/giphy.gif"
          alt="sad dog"
          className="w-40 h-40 object-cover rounded-full mx-auto mb-4 shadow-lg"
        />
        <h2 className="font-display text-2xl text-rose-400 mb-3">I understand, Roveena.</h2>
        <p className="font-body text-rose-300 leading-relaxed mb-2">
          No feelings were permanently harmed in the making of this website. 🥺
        </p>
        <p className="font-script text-xl mt-4" style={{ color: '#a08ed8' }}>
          Wishing you all the very best. 💛
        </p>
        <p className="font-body text-xs text-rose-200 mt-6 italic">
          — Mindula 
        </p>
      </motion.div>
    </div>
  );
}
