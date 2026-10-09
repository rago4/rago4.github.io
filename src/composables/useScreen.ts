import { onMounted, onUnmounted, ref } from 'vue';

export function useScreen() {
  const isFullscreen = ref(false);
  const status = ref('');
  let statusTimeout: ReturnType<typeof setTimeout> | undefined;
  let wakeLock: WakeLockSentinel | null = null;
  let requestingWakeLock = false;
  let disposed = false;

  function announce(message: string) {
    status.value = message;
    clearTimeout(statusTimeout);
    statusTimeout = setTimeout(() => { status.value = ''; }, 4500);
  }

  async function toggleFullscreen() {
    try {
      if (document.fullscreenElement) await document.exitFullscreen();
      else if (document.documentElement.requestFullscreen) await document.documentElement.requestFullscreen();
      else announce('Use your browser’s fullscreen option to fill the screen.');
    } catch {
      announce('Use your browser’s fullscreen option to fill the screen.');
    }
  }

  async function keepAwake() {
    if (disposed || !('wakeLock' in navigator) || document.visibilityState !== 'visible' || wakeLock || requestingWakeLock) return;
    requestingWakeLock = true;
    try {
      const lock = await navigator.wakeLock.request('screen');
      if (disposed) { await lock.release(); return; }
      wakeLock = lock;
      lock.addEventListener('release', () => { if (wakeLock === lock) wakeLock = null; });
    } catch {
      // Wake lock is optional and may be denied by the device or browser.
    } finally {
      requestingWakeLock = false;
    }
  }

  function syncFullscreen() { isFullscreen.value = Boolean(document.fullscreenElement); }
  function syncVisibility() { if (document.visibilityState === 'visible') keepAwake(); }

  onMounted(() => {
    syncFullscreen();
    document.addEventListener('fullscreenchange', syncFullscreen);
    document.addEventListener('visibilitychange', syncVisibility);
    keepAwake();
  });

  onUnmounted(() => {
    disposed = true;
    clearTimeout(statusTimeout);
    document.removeEventListener('fullscreenchange', syncFullscreen);
    document.removeEventListener('visibilitychange', syncVisibility);
    wakeLock?.release().catch(() => {});
  });

  return { isFullscreen, status, toggleFullscreen, keepAwake };
}
