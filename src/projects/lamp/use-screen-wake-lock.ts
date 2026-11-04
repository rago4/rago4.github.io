import { useEffect } from "preact/hooks";

type WakeLockState =
  | { status: "idle" | "requesting" | "disposed" }
  | { status: "held"; lock: WakeLockSentinel };

export function useScreenWakeLock() {
  const supported = "wakeLock" in navigator;

  useEffect(() => {
    if (!supported) return;

    let state: WakeLockState = { status: "idle" };

    async function acquire() {
      if (
        state.status === "disposed" ||
        state.status === "requesting" ||
        document.visibilityState !== "visible" ||
        state.status === "held"
      ) {
        return;
      }

      state = { status: "requesting" };
      try {
        const acquired = await navigator.wakeLock.request("screen");
        if (isDisposed()) {
          await acquired.release();
          return;
        }
        state = { status: "held", lock: acquired };
        acquired.addEventListener(
          "release",
          () => {
            if (state.status === "held" && state.lock === acquired) {
              state = { status: "idle" };
            }
          },
          { once: true },
        );
      } catch {
        if (!isDisposed()) state = { status: "idle" };
      }
    }

    function isDisposed() {
      return state.status === "disposed";
    }

    void acquire();
    document.addEventListener("visibilitychange", acquire);
    return () => {
      const previous = state;
      state = { status: "disposed" };
      document.removeEventListener("visibilitychange", acquire);
      if (previous.status === "held") void previous.lock.release().catch(() => {});
    };
  }, [supported]);
}
