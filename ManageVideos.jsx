@tailwind base;
@tailwind components;
@tailwind utilities;

html, body {
  background-color: #0B0F0E;
  color: #F5F5F0;
}

* {
  box-sizing: border-box;
}

.font-display {
  letter-spacing: 0.02em;
}

/* Scoreboard ticker dot */
.live-dot {
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #F2B705;
  box-shadow: 0 0 0 0 rgba(242, 183, 5, 0.6);
  animation: pulse-dot 1.6s ease-out infinite;
}

@keyframes pulse-dot {
  0% { box-shadow: 0 0 0 0 rgba(242, 183, 5, 0.55); }
  70% { box-shadow: 0 0 0 8px rgba(242, 183, 5, 0); }
  100% { box-shadow: 0 0 0 0 rgba(242, 183, 5, 0); }
}

/* Diagonal scoreboard corner ribbon on video cards */
.score-corner {
  position: absolute;
  top: 0;
  right: 0;
  background: #1F9D55;
  color: #0B0F0E;
  font-family: 'Anton', sans-serif;
  font-size: 0.7rem;
  padding: 3px 10px 3px 14px;
  clip-path: polygon(15% 0, 100% 0, 100% 100%, 0 100%);
}

.ticker-track {
  display: inline-flex;
  white-space: nowrap;
  animation: ticker-scroll 28s linear infinite;
}

@keyframes ticker-scroll {
  from { transform: translateX(0); }
  to { transform: translateX(-50%); }
}

@media (prefers-reduced-motion: reduce) {
  .ticker-track { animation: none; }
  .live-dot { animation: none; }
}

::selection {
  background: #F2B705;
  color: #0B0F0E;
}
