import { useEffect } from "preact/hooks";

export function useScreenWakeLock() {
  const supported = "wakeLock" in navigator;

  useEffect(() => {
    if (!supported) return;

    let disposed = false;
    let pending = false;
    let lock: WakeLockSentinel | null = null;

    async function acquire() {
      if (
        disposed ||
        pending ||
        document.visibilityState !== "visible" ||
        (lock && !lock.released)
      ) {
        return;
      }

      pending = true;
      try {
        const acquired = await navigator.wakeLock.request("screen");
        if (disposed) {
          await acquired.release();
          return;
        }
        lock = acquired;
      } catch {
      } finally {
        pending = false;
      }
    }

    void acquire();
    document.addEventListener("visibilitychange", acquire);
    return () => {
      disposed = true;
      document.removeEventListener("visibilitychange", acquire);
      void lock?.release().catch(() => {});
    };
  }, [supported]);
}
