import { useEffect, useRef, useState } from "preact/hooks";

type Status = "ready" | "running" | "paused" | "stopped" | "complete";

const preparationSeconds = 3;

export function useWorkout(duration: number, rounds: number) {
  const [status, setStatus] = useState<Status>("ready");
  const [elapsed, setElapsed] = useState(0);
  const [muted, setMuted] = useState(false);
  const clock = useRef({ started: 0, elapsed: 0 });
  const audio = useRef<AudioContext | null>(null);
  const tone = useRef<OscillatorNode | null>(null);
  const total = preparationSeconds + duration;
  const roundDuration = duration / rounds;

  function silence() {
    tone.current?.stop();
    tone.current?.disconnect();
    tone.current = null;
  }

  function scheduleSounds(offset: number) {
    silence();
    const context = audio.current;
    if (!context || muted) return;

    const oscillator = context.createOscillator();
    const gain = context.createGain();
    oscillator.connect(gain);
    gain.connect(context.destination);
    gain.gain.value = 0;
    const start = context.currentTime + 0.02;

    function beep(at: number, length: number, frequency = 880) {
      if (at < offset) return;
      const time = start + at - offset;
      oscillator.frequency.setValueAtTime(frequency, time);
      gain.gain.setValueAtTime(0, time);
      gain.gain.linearRampToValueAtTime(0.2, time + 0.01);
      gain.gain.setValueAtTime(0.2, time + length - 0.02);
      gain.gain.linearRampToValueAtTime(0, time + length);
    }

    for (const remaining of [3, 2, 1]) beep(preparationSeconds - remaining, 0.12);
    beep(preparationSeconds, Math.min(0.6, roundDuration / 2));
    for (let round = 1; round <= rounds; round++) {
      const boundary = preparationSeconds + round * roundDuration;
      for (const remaining of [3, 2, 1]) {
        if (remaining < roundDuration) beep(boundary - remaining, 0.12);
      }
      beep(
        boundary,
        round === rounds ? 1.2 : Math.min(0.6, roundDuration / 2),
        round === rounds ? 660 : 880,
      );
    }

    oscillator.start();
    oscillator.stop(start + total - offset + 1.3);
    oscillator.onended = () => {
      oscillator.disconnect();
      gain.disconnect();
      if (tone.current === oscillator) tone.current = null;
    };
    tone.current = oscillator;
  }

  function currentElapsed() {
    return Math.min(
      total,
      clock.current.elapsed + (performance.now() - clock.current.started) / 1000,
    );
  }

  function run(offset: number) {
    audio.current ??= new AudioContext();
    void audio.current
      .resume()
      .then(() => {
        if (clock.current.started === started && tone.current === null)
          scheduleSounds(currentElapsed());
      })
      .catch(() => {});
    const started = performance.now();
    clock.current = { started, elapsed: offset };
    setElapsed(offset);
    setStatus("running");
    scheduleSounds(offset);
  }

  function pause() {
    const next = currentElapsed();
    silence();
    clock.current = { started: 0, elapsed: next };
    setElapsed(next);
    setStatus(next >= total ? "complete" : "paused");
  }

  function stop() {
    const next = status === "running" ? currentElapsed() : elapsed;
    silence();
    clock.current = { started: 0, elapsed: next };
    setElapsed(next);
    setStatus(next >= total ? "complete" : "stopped");
  }

  function reset() {
    silence();
    clock.current = { started: 0, elapsed: 0 };
    setElapsed(0);
    setStatus("ready");
  }

  function toggleMute() {
    if (muted && status === "running") {
      void audio.current?.resume();
    }
    setMuted(!muted);
  }

  useEffect(() => {
    if (status !== "running") return;
    const interval = window.setInterval(() => {
      const next = currentElapsed();
      setElapsed(next);
      if (next >= total) setStatus("complete");
    }, 50);
    return () => window.clearInterval(interval);
  }, [status, total]);

  useEffect(() => {
    if (muted) silence();
    else if (status === "running") scheduleSounds(currentElapsed());
  }, [muted]);

  useEffect(
    () => () => {
      tone.current?.stop();
      void audio.current?.close();
    },
    [],
  );

  const workoutElapsed = Math.max(0, elapsed - preparationSeconds);
  const preparing = elapsed < preparationSeconds;
  const round = Math.min(rounds, Math.floor(workoutElapsed / roundDuration) + 1);
  const remaining = elapsed >= total ? 0 : roundDuration - (workoutElapsed % roundDuration);

  return {
    status,
    muted,
    preparing,
    round,
    remaining,
    preparationRemaining: Math.ceil(preparationSeconds - elapsed),
    totalRemaining: duration - workoutElapsed,
    workoutElapsed,
    start: () => run(0),
    resume: () => run(elapsed),
    pause,
    stop,
    reset,
    toggleMute,
  };
}
