import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import emailjs from '@emailjs/browser';
import Confetti from 'react-confetti';
import { useWindowSize } from 'react-use';
import PetalRain from '../components/PetalRain';
import { EMAILJS_CONFIG } from '../emailConfig';

const VIBES = [
  { id: 'cozy', emoji: '☕', label: 'Cozy & Quiet', desc: 'warm corners, soft music, just us' },
  { id: 'adventure', emoji: '🌅', label: 'Fun & Adventurous', desc: 'somewhere new, full of surprises' },
  { id: 'fancy', emoji: '🕯️', label: 'Fancy & Romantic', desc: 'candlelight, elegance, the works' },
  { id: 'surprise', emoji: '🎁', label: 'Surprise Me!', desc: 'I trust you, Mindula 🥺' },
];

const VENUES = [
  { id: 'cafe', emoji: '🍰', label: 'A Cute Café', desc: 'pastries, lattes & good vibes' },
  { id: 'beach', emoji: '🌊', label: 'Beachside Sunset', desc: 'golden hour, sea breeze, magic' },
  { id: 'restaurant', emoji: '🍽️', label: 'Romantic Restaurant', desc: 'fine dining, fairy lights & you' },
  { id: 'outdoor', emoji: '🌿', label: 'Outdoor Picnic', desc: 'flowers, blankets, sky above us' },
];

const TIMES = [
  { id: 'afternoon', emoji: '🌤️', label: 'Afternoon', desc: 'relaxed & sunny' },
  { id: 'evening', emoji: '🌆', label: 'Evening', desc: 'city lights coming alive' },
  { id: 'sunset', emoji: '🌇', label: 'Sunset', desc: 'the golden hour, just for us' },
];

function ChoiceCard({ item, selected, onSelect }) {
  return (
    <motion.button
      whileHover={{ scale: 1.04, y: -3 }}
      whileTap={{ scale: 0.97 }}
      onClick={() => onSelect(item.id)}
      className="w-full text-left p-4 rounded-2xl border-2 transition-all font-body relative overflow-hidden"
      style={{
        borderColor: selected ? '#e8558a' : 'rgba(251,200,219,0.5)',
        background: selected
          ? 'linear-gradient(135deg, rgba(232,85,138,0.12), rgba(192,176,232,0.15))'
          : 'rgba(253,248,243,0.7)',
        boxShadow: selected ? '0 0 20px rgba(232,85,138,0.25)' : 'none',
      }}
    >
      {selected && (
        <motion.div
          layoutId="selection"
          className="absolute top-2 right-2 w-5 h-5 rounded-full flex items-center justify-center text-white text-xs"
          style={{ background: '#e8558a' }}
        >
          ✓
        </motion.div>
      )}
      <span className="text-2xl mb-1 block">{item.emoji}</span>
      <p className="font-bold text-sm" style={{ color: '#c0627a' }}>{item.label}</p>
      <p className="text-xs mt-0.5" style={{ color: '#d4a0b0' }}>{item.desc}</p>
    </motion.button>
  );
}

export default function DatePlannerPage() {
  const { width, height } = useWindowSize();
  const [step, setStep] = useState(0); // 0=vibe, 1=venue, 2=time, 3=done
  const [selections, setSelections] = useState({ vibe: null, venue: null, time: null });
  const [sending, setSending] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  const steps = [
    { key: 'vibe', title: 'What vibe are you feeling?', subtitle: 'This will set the whole mood ✨', items: VIBES },
    { key: 'venue', title: 'Where shall we go?', subtitle: 'Your wish is my command 💕', items: VENUES },
    { key: 'time', title: 'When works best for you?', subtitle: 'Every hour is perfect with you 🌸', items: TIMES },
  ];

  const current = steps[step];

  const handleSelect = (val) => {
    setSelections(prev => ({ ...prev, [current.key]: val }));
  };

  const handleNext = async () => {
    if (step < steps.length - 1) {
      setStep(s => s + 1);
    } else {
      // Submit
      setSending(true);
      const vibeLabel = VIBES.find(v => v.id === selections.vibe)?.label || selections.vibe;
      const venueLabel = VENUES.find(v => v.id === selections.venue)?.label || selections.venue;
      const timeLabel = TIMES.find(v => v.id === selections.time)?.label || selections.time;

      try {
        await emailjs.send(
          EMAILJS_CONFIG.SERVICE_ID,
          EMAILJS_CONFIG.TEMPLATE_ID,
          {
            to_email: EMAILJS_CONFIG.TO_EMAIL,
            subject: '🎉 Roveena said YES! Here are her date preferences!',
            message: `Roveena has chosen her perfect date!\n\n✨ Vibe: ${vibeLabel}\n📍 Venue: ${venueLabel}\n🕐 Time: ${timeLabel}\n\nTime to make it perfect, Mindula! 💕`,
          },
          EMAILJS_CONFIG.PUBLIC_KEY
        );
      } catch (e) {
        console.warn('Email failed:', e);
      }

      setSending(false);
      setShowConfetti(true);
      setStep(3);
    }
  };

  const canProceed = selections[current?.key];
  const vibeLabel = VIBES.find(v => v.id === selections.vibe)?.label;
  const venueLabel = VENUES.find(v => v.id === selections.venue)?.label;
  const timeLabel = TIMES.find(v => v.id === selections.time)?.label;

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #ede8f7 0%, #fdf8f3 50%, #fde8f0 100%)' }}
    >
      {showConfetti && (
        <Confetti width={width} height={height} colors={['#e8558a', '#f7a0bf', '#c0b0e8', '#fbc8db', '#a08ed8']} numberOfPieces={300} recycle={false} />
      )}
      <PetalRain count={15} />

      <div className="fixed top-[-60px] right-[-60px] w-64 h-64 rounded-full opacity-20 pointer-events-none"
        style={{ background: 'radial-gradient(circle, #c0b0e8, transparent)' }} />
      <div className="fixed bottom-[-60px] left-[-60px] w-80 h-80 rounded-full opacity-15 pointer-events-none"
        style={{ background: 'radial-gradient(circle, #f7a0bf, transparent)' }} />

      <AnimatePresence mode="wait">
        {step < 3 ? (
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -60 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className="card-glass rounded-3xl p-7 max-w-sm w-full shadow-2xl z-10"
          >
            {/* Progress dots */}
            <div className="flex justify-center gap-2 mb-6">
              {steps.map((_, i) => (
                <div key={i} className="w-2 h-2 rounded-full transition-all"
                  style={{ background: i <= step ? '#e8558a' : '#fbc8db', transform: i === step ? 'scale(1.4)' : 'scale(1)' }} />
              ))}
            </div>

            <p className="font-script text-lg mb-1 text-center" style={{ color: '#a08ed8' }}>
              Step {step + 1} of {steps.length}
            </p>
            <h2 className="font-display text-2xl font-bold text-center mb-1" style={{ color: '#c0627a' }}>
              {current.title}
            </h2>
            <p className="font-body text-sm text-center mb-5" style={{ color: '#d4a0b0' }}>
              {current.subtitle}
            </p>

            <div className="grid grid-cols-2 gap-3 mb-6">
              {current.items.map(item => (
                <ChoiceCard
                  key={item.id}
                  item={item}
                  selected={selections[current.key] === item.id}
                  onSelect={handleSelect}
                />
              ))}
            </div>

            <motion.button
              whileHover={canProceed ? { scale: 1.04 } : {}}
              whileTap={canProceed ? { scale: 0.96 } : {}}
              onClick={canProceed ? handleNext : null}
              disabled={!canProceed || sending}
              className="w-full py-3 rounded-full font-body font-bold text-white text-base transition-all shadow-lg"
              style={{
                background: canProceed
                  ? 'linear-gradient(135deg, #e8558a, #a08ed8)'
                  : 'rgba(251,200,219,0.5)',
                cursor: canProceed ? 'pointer' : 'not-allowed',
                boxShadow: canProceed ? '0 4px 20px rgba(232,85,138,0.35)' : 'none',
              }}
            >
              {sending ? 'Sending love… 💌' : step < steps.length - 1 ? 'Next →' : 'Lock it in! 💕'}
            </motion.button>
          </motion.div>
        ) : (
          /* Confirmation screen */
          <motion.div
            key="done"
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', stiffness: 120 }}
            className="card-glass rounded-3xl p-8 max-w-sm w-full shadow-2xl z-10 text-center"
          >
            <div className="text-5xl mb-4 float">🎉</div>
            <h2 className="font-display text-3xl font-bold shimmer-text mb-2">It's a Date!</h2>
            <p className="font-script text-xl mb-6" style={{ color: '#a08ed8' }}>
              I cannot wait, Roveena 🌸
            </p>

            <div className="rounded-2xl p-4 mb-6 text-left space-y-3"
              style={{ background: 'rgba(251,200,219,0.25)', border: '1px solid rgba(251,200,219,0.5)' }}>
              <div className="flex items-center gap-3">
                <span className="text-xl">✨</span>
                <div>
                  <p className="text-xs font-body" style={{ color: '#d4a0b0' }}>Vibe</p>
                  <p className="font-bold text-sm" style={{ color: '#c0627a' }}>{vibeLabel}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xl">📍</span>
                <div>
                  <p className="text-xs font-body" style={{ color: '#d4a0b0' }}>Venue</p>
                  <p className="font-bold text-sm" style={{ color: '#c0627a' }}>{venueLabel}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xl">🕐</span>
                <div>
                  <p className="text-xs font-body" style={{ color: '#d4a0b0' }}>Time of Day</p>
                  <p className="font-bold text-sm" style={{ color: '#c0627a' }}>{timeLabel}</p>
                </div>
              </div>
            </div>

            <p className="font-body text-sm leading-relaxed" style={{ color: '#c0627a' }}>
              Your wish is my command. 💕
            </p>

            <p className="font-body text-xs mt-6 italic" style={{ color: '#d4a0b0' }}>
              made with 🐾 and way too much courage — Mindula
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
