/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { MusicPlayer } from './components/MusicPlayer';
import { SnakeGame } from './components/SnakeGame';

export default function App() {
  return (
    <div className="flex flex-col h-screen w-full bg-[var(--color-bg)] font-sans text-[var(--color-text-primary)] overflow-hidden">
      <header className="h-[60px] border-b border-[var(--color-border)] flex justify-between items-center px-[40px] bg-[rgba(0,0,0,0.8)] shrink-0">
        <div className="font-[800] text-[1.2rem] tracking-[0.1em] text-[var(--color-neon-cyan)] uppercase">
          NEON // SYNTH
        </div>
        <div className="flex gap-[24px] text-[0.8rem] text-[var(--color-text-dim)]">
          <span>FPS: 60</span>
          <span>latency: 12ms</span>
          <span>v1.0.4-stable</span>
        </div>
      </header>

      <main className="grid grid-cols-[280px_1fr_280px] grid-rows-[1fr_180px] gap-[20px] p-[20px] flex-grow min-h-0">
        <MusicPlayer />
        <SnakeGame />
      </main>
    </div>
  );
}
