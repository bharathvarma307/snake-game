import { useEffect, useRef, useState, useCallback } from 'react';
import { Play, RotateCcw } from 'lucide-react';

const GRID_SIZE = 20;
const INITIAL_SNAKE = [{ x: 10, y: 10 }];
const INITIAL_DIRECTION = { x: 0, y: -1 };
const BASE_SPEED = 150;

type Point = { x: number; y: number };

export function SnakeGame() {
  const [snake, setSnake] = useState<Point[]>(INITIAL_SNAKE);
  const [direction, setDirection] = useState<Point>(INITIAL_DIRECTION);
  const [food, setFood] = useState<Point>({ x: 15, y: 5 });
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(true);
  
  const directionRef = useRef(direction);
  directionRef.current = direction;

  const generateFood = useCallback((currentSnake: Point[]) => {
    let newFood: Point;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      if (!currentSnake.some(segment => segment.x === newFood.x && segment.y === newFood.y)) {
        break;
      }
    }
    return newFood;
  }, []);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    setScore(0);
    setGameOver(false);
    setIsPaused(false);
    setFood(generateFood(INITIAL_SNAKE));
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", " "].includes(e.key)) {
        e.preventDefault();
      }

      if (e.key === ' ' && (gameOver || isPaused)) {
        if (gameOver) resetGame();
        else setIsPaused(false);
        return;
      }

      const { x, y } = directionRef.current;
      switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          if (y === 0) setDirection({ x: 0, y: -1 });
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          if (y === 0) setDirection({ x: 0, y: 1 });
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          if (x === 0) setDirection({ x: -1, y: 0 });
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          if (x === 0) setDirection({ x: 1, y: 0 });
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameOver, isPaused]);

  useEffect(() => {
    if (isPaused || gameOver) return;

    const moveSnake = () => {
      setSnake((prevSnake) => {
        const head = prevSnake[0];
        const newHead = {
          x: head.x + directionRef.current.x,
          y: head.y + directionRef.current.y,
        };

        if (
          newHead.x < 0 ||
          newHead.x >= GRID_SIZE ||
          newHead.y < 0 ||
          newHead.y >= GRID_SIZE
        ) {
          setGameOver(true);
          return prevSnake;
        }

        if (prevSnake.some((segment) => segment.x === newHead.x && segment.y === newHead.y)) {
          setGameOver(true);
          return prevSnake;
        }

        const newSnake = [newHead, ...prevSnake];

        if (newHead.x === food.x && newHead.y === food.y) {
          setScore((s) => {
            const newScore = s + 10;
            if (newScore > highScore) setHighScore(newScore);
            return newScore;
          });
          setFood(generateFood(newSnake));
        } else {
          newSnake.pop();
        }

        return newSnake;
      });
    };

    const currentSpeed = Math.max(50, BASE_SPEED - Math.floor(score / 30) * 10);
    const interval = setInterval(moveSnake, currentSpeed);
    return () => clearInterval(interval);
  }, [direction, food, gameOver, isPaused, score, highScore, generateFood]);

  return (
    <div className="contents">
      <section className="col-start-2 row-start-1 bg-[var(--color-card-bg)] border border-[var(--color-neon-pink)] shadow-[inset_0_0_40px_rgba(255,0,255,0.05)] rounded-[16px] p-[20px] flex flex-col items-center justify-center relative overflow-hidden">
        <div className="text-[0.65rem] uppercase tracking-[0.1em] text-[var(--color-text-dim)] self-start absolute top-[20px] left-[20px]">Game Arena - Grid 20x20</div>
        
        <div 
          className="w-[400px] h-[400px] border-[2px] border-[#1a1a1a] grid gap-[1px] bg-[#1a1a1a] mt-[20px]"
          style={{
            gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
            gridTemplateRows: `repeat(${GRID_SIZE}, 1fr)`,
          }}
        >
          {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, i) => {
            const x = i % GRID_SIZE;
            const y = Math.floor(i / GRID_SIZE);
            const isSnakeHead = snake[0].x === x && snake[0].y === y;
            const isSnakeBody = snake.some((segment, idx) => idx !== 0 && segment.x === x && segment.y === y);
            const isFood = food.x === x && food.y === y;

            return (
              <div 
                key={i} 
                className={`w-full h-full ${
                  isFood ? 'bg-[var(--color-neon-yellow)] rounded-full shadow-[0_0_10px_var(--color-neon-yellow)]' : 
                  isSnakeHead ? 'bg-[#fff] shadow-[0_0_10px_var(--color-neon-pink)] z-10' : 
                  isSnakeBody ? 'bg-[var(--color-neon-pink)] rounded-[2px]' : 
                  'bg-[#080808]'
                }`}
              />
            );
          })}
        </div>

        {(gameOver || isPaused) && (
          <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center z-10 backdrop-blur-sm">
            <h2 className="text-[2rem] font-bold text-[var(--color-neon-pink)] mb-[16px] tracking-[0.1em] uppercase">
              {gameOver ? 'Game Over' : 'Ready?'}
            </h2>
            <button
              onClick={gameOver ? resetGame : () => setIsPaused(false)}
              className="flex items-center gap-2 px-6 py-3 bg-transparent border border-[var(--color-neon-cyan)] text-[var(--color-neon-cyan)] rounded-[4px] text-[14px] uppercase cursor-pointer hover:bg-[var(--color-neon-cyan)]/10"
            >
              {gameOver ? 'PLAY AGAIN' : 'START SYSTEM'}
            </button>
          </div>
        )}
      </section>

      <section className="col-span-3 col-start-1 row-start-2 grid grid-cols-4 gap-[20px]">
        <div className="bg-[var(--color-card-bg)] border border-[var(--color-border)] rounded-[16px] p-[20px] flex flex-col text-left justify-center">
          <div className="text-[0.7rem] text-[var(--color-text-dim)] uppercase mt-[4px] mb-[4px]">Current Score</div>
          <div className="font-['Courier_New',monospace] text-[2rem] font-[700] text-[var(--color-neon-yellow)]">{score.toString().padStart(5, '0')}</div>
        </div>
        <div className="bg-[var(--color-card-bg)] border border-[var(--color-border)] rounded-[16px] p-[20px] flex flex-col text-left justify-center">
          <div className="text-[0.7rem] text-[var(--color-text-dim)] uppercase mt-[4px] mb-[4px]">High Score</div>
          <div className="font-['Courier_New',monospace] text-[2rem] font-[700] text-[var(--color-neon-yellow)]">{highScore.toString().padStart(5, '0')}</div>
        </div>
        <div className="bg-[var(--color-card-bg)] border border-[var(--color-border)] rounded-[16px] p-[20px] flex flex-col text-left justify-center">
          <div className="text-[0.7rem] text-[var(--color-text-dim)] uppercase mt-[4px] mb-[4px]">BPM Sync</div>
          <div className="font-['Courier_New',monospace] text-[2rem] font-[700] text-[var(--color-neon-yellow)]">128</div>
        </div>
        <div className="bg-[var(--color-card-bg)] border border-[var(--color-border)] rounded-[16px] p-[20px] flex flex-col text-left justify-center">
          <div className="text-[0.7rem] text-[var(--color-text-dim)] uppercase mt-[4px] mb-[4px]">Multiplier</div>
          <div className="font-['Courier_New',monospace] text-[2rem] font-[700] text-[var(--color-neon-yellow)]">x{(1 + Math.floor(score/50) * 0.2).toFixed(1)}</div>
        </div>
      </section>
    </div>
  );
}
