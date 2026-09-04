'use client';

import { useEffect, useRef, useState, useCallback } from 'react';

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export default function PWAManager() {
  const [showInstall, setShowInstall] = useState(false);
  const [showUpdate, setShowUpdate] = useState(false);
  const deferredPrompt = useRef<BeforeInstallPromptEvent | null>(null);
  const waitingWorker = useRef<ServiceWorker | null>(null);

  const handleInstall = useCallback(async () => {
    if (!deferredPrompt.current) return;
    deferredPrompt.current.prompt();
    await deferredPrompt.current.userChoice;
    deferredPrompt.current = null;
    setShowInstall(false);
  }, []);

  const handleUpdate = useCallback(() => {
    waitingWorker.current?.postMessage({ type: 'SKIP_WAITING' });
    setShowUpdate(false);
  }, []);

  useEffect(() => {
    // Install prompt
    const onBeforeInstall = (e: Event) => {
      e.preventDefault();
      deferredPrompt.current = e as BeforeInstallPromptEvent;
      const isStandalone =
        window.matchMedia('(display-mode: standalone)').matches ||
        (navigator as unknown as { standalone?: boolean }).standalone;
      if (!isStandalone && !sessionStorage.getItem('pwa-install-dismissed')) {
        setShowInstall(true);
      }
    };
    window.addEventListener('beforeinstallprompt', onBeforeInstall);

    // Service worker registration + update detection
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').then((reg) => {
        setInterval(() => reg.update(), 30 * 60 * 1000);

        reg.addEventListener('updatefound', () => {
          const newWorker = reg.installing;
          if (!newWorker) return;
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              waitingWorker.current = newWorker;
              setShowUpdate(true);
            }
          });
        });
      });

      // Seamless reload on controller change
      let refreshing = false;
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        if (refreshing) return;
        refreshing = true;
        window.location.reload();
      });
    }

    return () => window.removeEventListener('beforeinstallprompt', onBeforeInstall);
  }, []);

  return (
    <>
      {showInstall && (
        <div className="fixed bottom-4 left-1/2 z-[10000] flex w-auto max-w-[calc(100%-32px)] -translate-x-1/2 animate-[swBannerIn_0.3s_ease] items-center gap-3 rounded-[10px] bg-primary px-4 py-3 text-sm text-white shadow-[0_4px_20px_rgba(0,0,0,0.25)] max-[767px]:bottom-0 max-[767px]:left-0 max-[767px]:right-0 max-[767px]:max-w-full max-[767px]:translate-x-0 max-[767px]:animate-[swBannerSlideUp_0.3s_ease] max-[767px]:rounded-none max-[767px]:px-4 max-[767px]:py-[14px]" role="alert" aria-live="polite">
          <div className="flex min-w-0 flex-1 items-center gap-2">
            <i className="bi bi-download shrink-0 text-[1.125rem]" aria-hidden="true"></i>
            <span>Install BetterSanCarlos for quick access to services.</span>
          </div>
          <div className="flex shrink-0 items-center gap-1.5">
            <button className="cursor-pointer rounded-md border-0 bg-[rgba(255,255,255,0.95)] px-4 py-1.5 text-[0.8125rem] font-bold text-primary transition-colors duration-200 hover:bg-white" onClick={handleInstall} aria-label="Install BetterSanCarlos app">
              Install
            </button>
            <button
              className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-full border-0 bg-[rgba(255,255,255,0.15)] text-base text-white transition-colors duration-200 hover:bg-[rgba(255,255,255,0.3)]"
              onClick={() => {
                sessionStorage.setItem('pwa-install-dismissed', '1');
                setShowInstall(false);
              }}
              aria-label="Dismiss install prompt"
            >
              &times;
            </button>
          </div>
        </div>
      )}
      {showUpdate && (
        <div className="fixed bottom-4 left-1/2 z-[10000] flex -translate-x-1/2 animate-[swBannerIn_0.3s_ease] items-center gap-3 rounded-lg bg-primary px-4 py-2.5 text-sm text-white shadow-[0_4px_16px_rgba(0,0,0,0.2)]" role="alert" aria-live="polite">
          <span>A new version is available.</span>
          <button className="cursor-pointer rounded border-0 bg-[rgba(255,255,255,0.2)] px-3.5 py-1.5 text-[0.8125rem] font-semibold text-white transition-colors hover:bg-[rgba(255,255,255,0.35)]" onClick={handleUpdate} aria-label="Update now">
            Update
          </button>
          <button
            className="cursor-pointer rounded border-0 bg-[rgba(255,255,255,0.2)] px-3.5 py-1.5 text-[0.8125rem] font-semibold text-white transition-colors hover:bg-[rgba(255,255,255,0.35)]"
            onClick={() => setShowUpdate(false)}
            aria-label="Dismiss update notice"
          >
            &times;
          </button>
        </div>
      )}
    </>
  );
}
