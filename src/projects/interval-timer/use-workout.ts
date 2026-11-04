import { useEffect, useReducer, useRef, useState } from "preact/hooks";

type WorkoutState =
  | { status: "ready" | "paused" | "stopped" | "complete"; elapsed: number }
  | { status: "running"; elapsed: number; started: number; offset: number };

type WorkoutEvent = {
  type: "start" | "resume" | "pause" | "stop" | "reset" | "tick";
  now: number;
};

const preparationSeconds = 3;

export function useWorkout(duration: number, rounds: number) {
  const [muted, setMuted] = useState(false);
  const audio = useRef<AudioContext | null>(null);
  const tone = useRef<OscillatorNode | null>(null);
  const total = preparationSeconds + duration;
  const roundDuration = duration / rounds;
  const [state, dispatch] = useReducer(
    (current: WorkoutState, event: WorkoutEvent): WorkoutState => {
      const next =
        current.status === "running"
          ? Math.min(total, current.offset + (event.now - current.started) / 1000)
          : current.elapsed;

      switch (event.type) {
        case "start":
          if (
            current.status !== "ready" &&
            current.status !== "stopped" &&
            current.status !== "complete"
          )
            return current;
          return { status: "running", elapsed: 0, started: event.now, offset: 0 };
        case "resume":
          if (current.status !== "paused") return current;
          return { status: "running", elapsed: next, started: event.now, offset: next };
        case "pause":
          if (current.status !== "running") return current;
          return { status: next >= total ? "complete" : "paused", elapsed: next };
        case "stop":
          if (current.status !== "running" && current.status !== "paused") return current;
          return { status: next >= total ? "complete" : "stopped", elapsed: next };
        case "reset":
          return { status: "ready", elapsed: 0 };
        case "tick":
          if (current.status !== "running") return current;
          return next >= total
            ? { status: "complete", elapsed: total }
            : { ...current, elapsed: next };
      }
    },
    { status: "ready", elapsed: 0 },
  );
  const { status, elapsed } = state;
  const started = state.status === "running" ? state.started : null;
  const offset = state.status === "running" ? state.offset : 0;

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

  function run(type: "start" | "resume") {
    if (
      type === "resume"
        ? status !== "paused"
        : status !== "ready" && status !== "stopped" && status !== "complete"
    )
      return;
    audio.current ??= new AudioContext();
    void audio.current.resume().catch(() => {});
    dispatch({ type, now: performance.now() });
    scheduleSounds(type === "resume" ? elapsed : 0);
  }

  function pause() {
    if (status !== "running") return;
    silence();
    dispatch({ type: "pause", now: performance.now() });
  }

  function stop() {
    if (status !== "running" && status !== "paused") return;
    silence();
    dispatch({ type: "stop", now: performance.now() });
  }

  function reset() {
    silence();
    dispatch({ type: "reset", now: performance.now() });
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
      dispatch({ type: "tick", now: performance.now() });
    }, 50);
    return () => window.clearInterval(interval);
  }, [status, total]);

  useEffect(() => {
    if (muted) silence();
    if (muted || started === null) return;

    let cancelled = false;
    const context = audio.current;
    void context
      ?.resume()
      .then(() => {
        if (!cancelled && tone.current === null) {
          scheduleSounds(Math.min(total, offset + (performance.now() - started) / 1000));
        }
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [muted, started, offset, total]);

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
    start: () => run("start"),
    resume: () => run("resume"),
    pause,
    stop,
    reset,
    toggleMute,
  };
}
