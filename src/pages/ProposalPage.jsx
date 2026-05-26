import { useState, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import emailjs from '@emailjs/browser';
import Confetti from 'react-confetti';
import { useWindowSize } from 'react-use';
import PetalRain from '../components/PetalRain';
import { EMAILJS_CONFIG } from '../emailConfig';

const NO_MESSAGES = [
  "Roveena… the dog is literally crying 🐶😢",
  "Error 404: No not found. Try again!",
  "My heart can't take this… (just kidding, pick Yes 🥺)",
  "Are you sure? Even the dog thinks you should say yes.",
  "I practiced this for weeks. WEEKS. 😭",
  "Okay I'm starting to panic a little…",
  "The dog and I had a whole meeting about this. Vote was unanimous.",
  "Bold of you to keep clicking this. Very bold.",
  "I made a whole website for you, Roveena… 🥺",
  "Last chance before the dog takes over negotiations.",
];

const SAD_MEMES = [
  "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExcWlyeXF3cDU3bzRhY21sdG9tYnB4ZWh2cmN2bnB0bWdya3dzamFjbiZlcD12MV9naWZzX3RyZW5kaW5nJmN0PWc/H5C8CevNMbpBqNqFjl/giphy.gif",
  "https://media.giphy.com/media/v1.Y2lkPWVjZjA1ZTQ3c3B0aGwyanBqNXBienVvY3h3cDMxcnZwaXVlY2Y1dDMxZmh2emc3dyZlcD12MV9naWZzX3RyZW5kaW5nJmN0PWc/wr7oA0rSjnWuiLJOY5/giphy.gif",
  "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExaGxkeHliYmM3MmxmcHYxYnMzejZvY3lyb29kdXo5dm5oZjQydjVyNSZlcD12MV9naWZzX3NlYXJjaCZjdD1n/lGBecpB2dIMwt6ohfI/giphy.gif",
  "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExaGxkeHliYmM3MmxmcHYxYnMzejZvY3lyb29kdXo5dm5oZjQydjVyNSZlcD12MV9naWZzX3NlYXJjaCZjdD1n/98MaHVwJOmWMz4cz1K/giphy.gif",
  "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExaGxkeHliYmM3MmxmcHYxYnMzejZvY3lyb29kdXo5dm5oZjQydjVyNSZlcD12MV9naWZzX3NlYXJjaCZjdD1n/l22ysLe54hZP0wubek/giphy.gif",
  "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExaGxkeHliYmM3MmxmcHYxYnMzejZvY3lyb29kdXo5dm5oZjQydjVyNSZlcD12MV9naWZzX3NlYXJjaCZjdD1n/dJYoOVAWf2QkU/giphy.gif",
  "https://media.giphy.com/media/v1.Y2lkPWVjZjA1ZTQ3dThuanJlbDB5NmFpdDZrcmpwNnR4eWdlZnQ2bDZqbWtjb3JzdHJhdiZlcD12MV9naWZzX3NlYXJjaCZjdD1n/d7rvF20PqNuGKSQGhf/giphy.gif",
  "https://media.giphy.com/media/v1.Y2lkPWVjZjA1ZTQ3dThuanJlbDB5NmFpdDZrcmpwNnR4eWdlZnQ2bDZqbWtjb3JzdHJhdiZlcD12MV9naWZzX3NlYXJjaCZjdD1n/EW79wVgSajjv44E8Hs/giphy.gif",
  "https://media.giphy.com/media/v1.Y2lkPWVjZjA1ZTQ3cHJzZnczcDRvajZpaHN2anZleXRhZWMxcXZ3bWk3NHkyM3J6azRociZlcD12MV9naWZzX3NlYXJjaCZjdD1n/3QWfMsI8IaarXxtBt6/giphy.gif",
  "https://media.giphy.com/media/v1.Y2lkPWVjZjA1ZTQ3M2w3cGlldW1xY2xveDRtMWZldTh3aDIwY2JodmxpZDMxaWo5NHQzMiZlcD12MV9naWZzX3NlYXJjaCZjdD1n/Ib6HUhF07BzRcma1MD/giphy.gif"
];

const DOG_MEME = "https://media.giphy.com/media/MDJ9IbxxvDUQM/giphy.gif";
const HAPPY_DOG = "https://media.giphy.com/media/3ndAvMC5LFPNMCzq7m/giphy.gif";
const SAD_DOG_FINAL = "https://media.giphy.com/media/v1.Y2lkPWVjZjA1ZTQ3aHQ0bHFyZmtueWYyZTFxbWZhbm1ocjdmdmU1dWkwMDR5enZuaXJpYyZlcD12MV9naWZzX3NlYXJjaCZjdD1n/U3bq9IjJtOtXWhhsU8/giphy.gif";

const MAX_NO = 10;

// Sticker slots around the card — partially hanging off edges so content stays clear
const STICKER_SLOTS = [
  { top: '-44px',   left:  '-44px'  },  // top-left
  { top: '-44px',   right: '-44px'  },  // top-right
  { top:  '60px',   left:  '-50px'  },  // left upper
  { top:  '60px',   right: '-50px'  },  // right upper
  { top:  '180px',  left:  '-50px'  },  // left middle
  { top:  '180px',  right: '-50px'  },  // right middle
  { bottom: '-44px', left:  '-44px' },  // bottom-left
  { bottom: '-44px', right: '-44px' },  // bottom-right
  { top:  '-44px',  left:  'calc(50% - 44px)' }, // top center
  { bottom: '-44px', left: 'calc(50% - 44px)' }, // bottom center
];

function StickerMemes({ memes }) {
  return (
    <>
      {memes.map((m, i) => {
        const slot = STICKER_SLOTS[i % STICKER_SLOTS.length];
        return (
          <motion.img
            key={m.id}
            src={SAD_MEMES[m.src % SAD_MEMES.length]}
            alt="sad meme"
            initial={{ opacity: 0, scale: 0.2, rotate: m.rotate - 20 }}
            animate={{ opacity: 1, scale: 1, rotate: m.rotate }}
            transition={{ type: 'spring', stiffness: 220, damping: 16 }}
            className="absolute rounded-2xl shadow-2xl pointer-events-none object-cover"
            style={{
              width: '88px',
              height: '88px',
              ...slot,
              border: '3px solid rgba(251,200,219,0.9)',
              zIndex: 30,
            }}
          />
        );
      })}
    </>
  );
}

export default function ProposalPage() {
  const navigate = useNavigate();
  const { width, height } = useWindowSize();

  const [noCount, setNoCount] = useState(0);
  const [currentMsg, setCurrentMsg] = useState('');
  const [showMsg, setShowMsg] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [yesClicked, setYesClicked] = useState(false);
  const [rejected, setRejected] = useState(false);
  const [bgMemes, setBgMemes] = useState([]);

  const yesScale = 1 + noCount * 0.12;

  const memePositions = useMemo(() =>
    Array.from({ length: MAX_NO }, (_, i) => ({
      id: i,
      src: i,
      rotate: (Math.random() - 0.5) * 30,
    }))
  , []);

  const sendRejectionEmail = useCallback(async () => {
    try {
      await emailjs.send(
        EMAILJS_CONFIG.SERVICE_ID,
        EMAILJS_CONFIG.TEMPLATE_ID,
        {
          to_email: EMAILJS_CONFIG.TO_EMAIL,
          subject: '💔 Date Invitation Update from Roveena',
          message: `Roveena clicked No ${MAX_NO} times and chose not to go on the date. She wishes you well. 💛`,
        },
        EMAILJS_CONFIG.PUBLIC_KEY
      );
    } catch (e) {
      console.warn('Email failed:', e);
    }
  }, []);

  const handleNo = useCallback(() => {
    const next = noCount + 1;
    setNoCount(next);
    setCurrentMsg(NO_MESSAGES[Math.min(noCount, NO_MESSAGES.length - 1)]);
    setShowMsg(true);

    if (next <= memePositions.length) {
      setBgMemes(memePositions.slice(0, next));
    }

    if (next >= MAX_NO) {
      sendRejectionEmail();
      setTimeout(() => setRejected(true), 800);
    }
  }, [noCount, memePositions, sendRejectionEmail]);

  const handleYes = () => {
    setShowConfetti(true);
    setYesClicked(true);
    setTimeout(() => navigate('/date-planner'), 2800);
  };

  if (rejected) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #fde8f0 0%, #fdf8f3 50%, #ede8f7 100%)' }}>
        <PetalRain count={8} />
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="card-glass rounded-3xl p-8 max-w-sm w-full text-center shadow-xl z-10"
        >
          <img src={SAD_DOG_FINAL} alt="sad dog" className="w-40 h-40 object-cover rounded-full mx-auto mb-4 shadow-lg" />
          <h2 className="font-display text-2xl text-rose-400 mb-3">I understand, Roveena.</h2>
          <p className="font-body text-rose-300 leading-relaxed mb-2">
            No feelings were permanently harmed in the making of this website. 🥺
          </p>
          <p className="font-script text-xl mt-4" style={{ color: '#a08ed8' }}>
            Wishing you all the very best. 💛
          </p>
          <p className="font-body text-xs text-rose-200 mt-6 italic">
            — Mindula (& the dog)
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #fde8f0 0%, #fdf8f3 50%, #ede8f7 100%)' }}
    >
      {showConfetti && <Confetti width={width} height={height} colors={['#e8558a', '#f7a0bf', '#c0b0e8', '#fbc8db', '#a08ed8']} />}
      <PetalRain count={20} />

      {/* Ambient blobs */}
      <div className="fixed top-[-80px] left-[-80px] w-72 h-72 rounded-full opacity-20 pointer-events-none"
        style={{ background: 'radial-gradient(circle, #f7a0bf, transparent)' }} />
      <div className="fixed bottom-[-80px] right-[-80px] w-96 h-96 rounded-full opacity-20 pointer-events-none"
        style={{ background: 'radial-gradient(circle, #c0b0e8, transparent)' }} />

      {/* Card — position:relative so stickers are anchored to it */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="card-glass rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl z-10 relative"
        style={{ overflow: 'visible' }}
      >
        {/* Sticker memes anchored to the card */}
        <StickerMemes memes={bgMemes} />

        {/* Header */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="font-script text-2xl mb-1"
          style={{ color: '#a08ed8' }}
        >
          a little something for…
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, type: 'spring', stiffness: 120 }}
          className="font-display text-4xl font-bold mb-6 shimmer-text"
        >
          Roveena 🌸
        </motion.h1>

        {/* Dog GIF */}
        <motion.div
          className="float mx-auto mb-5 relative"
          style={{ width: '160px', height: '160px' }}
        >
          <div className="absolute inset-0 rounded-full opacity-40 heartbeat"
            style={{ background: 'radial-gradient(circle, #fbc8db, transparent)', transform: 'scale(1.3)' }} />
          <img
            src={yesClicked ? HAPPY_DOG : DOG_MEME}
            alt="cute dog"
            className="w-40 h-40 object-cover rounded-full shadow-xl border-4 relative z-10"
            style={{ borderColor: '#fbc8db' }}
          />
        </motion.div>

        {/* Question */}
        <AnimatePresence mode="wait">
          {!yesClicked ? (
            <motion.div key="question" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <p className="font-display text-xl italic text-rose-400 mb-2">Hey Roveena,</p>
              <p className="font-display text-2xl font-bold mb-1" style={{ color: '#c0627a' }}>
                Would you like to go
              </p>
              <p className="font-display text-2xl font-bold mb-6" style={{ color: '#c0627a' }}>
                on a date with me? 💕
              </p>
            </motion.div>
          ) : (
            <motion.div key="yay" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}>
              <p className="font-display text-2xl font-bold shimmer-text mb-2">She said YES!! 🎉</p>
              <p className="font-body text-rose-400 text-sm">Taking you somewhere magical…</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Buttons */}
        {!yesClicked && (
          <div className="flex justify-center items-center gap-4 mt-2" style={{ minHeight: '80px' }}>
            <motion.button
              animate={{ scale: yesScale }}
              transition={{ type: 'spring', stiffness: 200, damping: 15 }}
              whileHover={{ scale: yesScale * 1.07 }}
              whileTap={{ scale: yesScale * 0.95 }}
              onClick={handleYes}
              className="yes-glow rounded-full font-body font-bold text-white shadow-lg"
              style={{
                background: 'linear-gradient(135deg, #e8558a, #f278a3)',
                padding: `${10 + noCount * 1.5}px ${24 + noCount * 3}px`,
                fontSize: `${16 + noCount * 1.2}px`,
              }}
            >
              Yes! 💖
            </motion.button>

            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={handleNo}
              className="px-6 py-3 rounded-full font-body font-bold text-rose-300 border-2 border-rose-200 bg-white/60 text-sm"
              style={{ cursor: 'pointer', flexShrink: 0 }}
            >
              No 🙈
            </motion.button>
          </div>
        )}

        {/* No click message */}
        <AnimatePresence>
          {showMsg && (
            <motion.div
              key={currentMsg}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mt-4 px-4 py-2 rounded-2xl text-sm font-body italic"
              style={{ background: 'rgba(251,200,219,0.5)', color: '#c0627a' }}
            >
              {currentMsg}
            </motion.div>
          )}
        </AnimatePresence>

        {noCount > 0 && noCount < MAX_NO && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-xs text-rose-200 mt-3 font-body"
          >
            ({MAX_NO - noCount} "No"s left before the dog gives up 🐾)
          </motion.p>
        )}

        <p className="font-body text-xs text-rose-200 mt-6 italic">
          made with 🐾 and way too much courage — Mindula
        </p>
      </motion.div>
    </div>
  );
}