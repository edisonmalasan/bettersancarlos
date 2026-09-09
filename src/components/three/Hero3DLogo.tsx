'use client';

import { useEffect, useRef, useState } from 'react';
import type { GLTF } from 'three/examples/jsm/loaders/GLTFLoader.js';
import type * as ThreeTypes from 'three';
import { cn } from '@/lib/utils';

const MODEL_URL = '/assets/models/san-carlos-logo-3d.glb';
const FALLBACK_URL = '/assets/images/logo/better-san-carlos-logo-white.png';

const NORMAL_SCALE = 0.35;
const ENV_INTENSITY = 0.85;

const IDLE_AMPLITUDE = (28 * Math.PI) / 180;
const IDLE_PERIOD = 10;
const FLOAT_AMPLITUDE = 0.05;
const FLOAT_PERIOD = 6;
const PARALLAX_MAX_X = (4 * Math.PI) / 180;
const PARALLAX_MAX_Y = (3 * Math.PI) / 180;
const EASE_FACTOR = 4;
const MAX_PIXEL_RATIO = 2;

type Status = 'loading' | 'ready' | 'fallback';

export default function Hero3DLogo() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<Status>('loading');

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return undefined;

    let disposed = false;
    let raf = 0;
    let running = false;
    let reduced = false;
    let renderer: ThreeTypes.WebGLRenderer | null = null;
    let resizeObserver: ResizeObserver | null = null;
    let envTexture: ThreeTypes.Texture | null = null;
    let pmremGenerator: ThreeTypes.PMREMGenerator | null = null;

    const start = (tick: () => void) => {
      if (!running && !reduced && !document.hidden) {
        running = true;
        raf = requestAnimationFrame(tick);
      }
    };

    const stop = () => {
      running = false;
      cancelAnimationFrame(raf);
    };

    const cleanup = (
      listeners: Array<[EventTarget, string, EventListenerOrEventListenerObject]>,
      traverseRoot: ThreeTypes.Object3D | null
    ) => {
      disposed = true;
      stop();
      listeners.forEach(([target, type, handler]) => target.removeEventListener(type, handler));
      resizeObserver?.disconnect();
      resizeObserver = null;
      if (traverseRoot) {
        traverseRoot.traverse((obj) => {
          const mesh = obj as ThreeTypes.Mesh;
          if (mesh.geometry) mesh.geometry.dispose();
          const materials = Array.isArray(mesh.material)
            ? mesh.material
            : mesh.material
              ? [mesh.material]
              : [];
          materials.forEach((material) => {
            Object.values(material).forEach((value) => {
              if (value && typeof value === 'object' && 'isTexture' in (value as object)) {
                (value as unknown as { dispose: () => void }).dispose();
              }
            });
            material.dispose();
          });
        });
      }
      envTexture?.dispose();
      pmremGenerator?.dispose();
      renderer?.dispose();
      renderer?.forceContextLoss();
      renderer = null;
    };

    (async () => {
      const listeners: Array<[EventTarget, string, EventListenerOrEventListenerObject]> = [];
      try {
        const THREE = await import('three');
        const { GLTFLoader } = await import('three/examples/jsm/loaders/GLTFLoader.js');
        const { RoomEnvironment } =
          await import('three/examples/jsm/environments/RoomEnvironment.js');
        if (disposed) return;

        const canvas = document.createElement('canvas');
        canvas.setAttribute('aria-hidden', 'true');
        canvas.tabIndex = -1;
        canvas.style.width = '100%';
        canvas.style.height = '100%';
        canvas.style.display = 'block';

        try {
          renderer = new THREE.WebGLRenderer({
            canvas,
            alpha: true,
            antialias: true,
            powerPreference: 'low-power',
          });
        } catch {
          setStatus('fallback');
          return;
        }
        renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, MAX_PIXEL_RATIO));
        renderer.outputColorSpace = THREE.SRGBColorSpace;
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 1.12;

        const scene = new THREE.Scene();
        pmremGenerator = new THREE.PMREMGenerator(renderer);
        envTexture = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
        scene.environment = envTexture;
        scene.environmentIntensity = ENV_INTENSITY;
        const keyLight = new THREE.DirectionalLight(0xffffff, 1.1);
        keyLight.position.set(2, 3, 4);
        scene.add(keyLight);
        const fillLight = new THREE.DirectionalLight(0xffffff, 0.35);
        fillLight.position.set(-2.5, -1, 2);
        scene.add(fillLight);

        const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 100);

        const gltf = await new Promise<GLTF>((resolve, reject) => {
          new GLTFLoader().load(MODEL_URL, resolve, undefined, reject);
        });
        if (disposed) {
          cleanup(listeners, scene);
          return;
        }

        const box = new THREE.Box3().setFromObject(gltf.scene);
        gltf.scene.traverse((obj) => {
          const mesh = obj as ThreeTypes.Mesh;
          const materials = Array.isArray(mesh.material)
            ? mesh.material
            : mesh.material
              ? [mesh.material]
              : [];
          materials.forEach((material) => {
            const std = material as ThreeTypes.MeshStandardMaterial;
            if (std.normalMap) std.normalScale = new THREE.Vector2(NORMAL_SCALE, NORMAL_SCALE);
          });
        });
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());
        const maxDim = Math.max(size.x, size.y, size.z) || 1;
        const targetScale = 3 / maxDim;

        const group = new THREE.Group();
        gltf.scene.position.sub(center);
        group.add(gltf.scene);
        group.scale.setScalar(targetScale);
        scene.add(group);

        const radius = box.getBoundingSphere(new THREE.Sphere()).radius * targetScale;
        const distance = (radius / Math.sin((camera.fov * Math.PI) / 360)) * 0.75;
        camera.position.set(0, 0, distance);
        camera.lookAt(0, 0, 0);

        const reducedQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
        const finePointerQuery = window.matchMedia('(pointer: fine)');
        reduced = reducedQuery.matches;

        const clock = new THREE.Clock();
        let tiltX = 0;
        let tiltY = 0;
        let targetTiltX = 0;
        let targetTiltY = 0;

        const onPointerMove = (event: Event) => {
          const pointerEvent = event as PointerEvent;
          if (!finePointerQuery.matches || reducedQuery.matches) return;
          const rect = container.getBoundingClientRect();
          const nx = ((pointerEvent.clientX - rect.left) / rect.width) * 2 - 1;
          const ny = ((pointerEvent.clientY - rect.top) / rect.height) * 2 - 1;
          targetTiltY = THREE.MathUtils.clamp(nx, -1, 1) * PARALLAX_MAX_X;
          targetTiltX = THREE.MathUtils.clamp(ny, -1, 1) * PARALLAX_MAX_Y;
        };
        const onPointerLeave = () => {
          targetTiltX = 0;
          targetTiltY = 0;
        };
        const onVisibilityChange = () => {
          if (document.hidden) stop();
          else start(tick);
        };
        const onReducedChange = () => {
          if (reducedQuery.matches) {
            stop();
            tiltX = 0;
            tiltY = 0;
            targetTiltX = 0;
            targetTiltY = 0;
            group.rotation.set(0, 0, 0);
            group.position.y = 0;
            renderer?.render(scene, camera);
          } else {
            reduced = false;
            start(tick);
          }
        };

        const resize = () => {
          const width = container.clientWidth;
          const height = container.clientHeight;
          if (!width || !height || !renderer) return;
          renderer.setSize(width, height, false);
          camera.aspect = width / height;
          camera.updateProjectionMatrix();
        };

        const tick = () => {
          if (!running || !renderer) return;
          const dt = clock.getDelta();
          const t = clock.elapsedTime;
          const ease = 1 - Math.exp(-dt * EASE_FACTOR);
          tiltX += (targetTiltX - tiltX) * ease;
          tiltY += (targetTiltY - tiltY) * ease;
          group.rotation.y = IDLE_AMPLITUDE * Math.sin((2 * Math.PI * t) / IDLE_PERIOD) + tiltY;
          group.rotation.x = tiltX;
          group.position.y = FLOAT_AMPLITUDE * Math.sin((2 * Math.PI * t) / FLOAT_PERIOD);
          renderer.render(scene, camera);
          raf = requestAnimationFrame(tick);
        };

        container.appendChild(canvas);
        resize();
        resizeObserver = new ResizeObserver(resize);
        resizeObserver.observe(container);

        container.addEventListener('pointermove', onPointerMove);
        container.addEventListener('pointerleave', onPointerLeave);
        listeners.push(
          [container, 'pointermove', onPointerMove],
          [container, 'pointerleave', onPointerLeave],
          [reducedQuery, 'change', onReducedChange],
          [document, 'visibilitychange', onVisibilityChange]
        );
        reducedQuery.addEventListener('change', onReducedChange);
        document.addEventListener('visibilitychange', onVisibilityChange);

        if (reduced) {
          renderer.render(scene, camera);
        } else {
          start(tick);
        }
        if (!disposed) setStatus('ready');
      } catch {
        cleanup(listeners, null);
        if (!disposed) setStatus('fallback');
      }
    })();

    return () => {
      cleanup([], null);
    };
  }, []);

  return (
    <div ref={containerRef} className="relative h-full w-full">
      {status !== 'ready' && (
        <img
          src={FALLBACK_URL}
          alt=""
          aria-hidden="true"
          draggable={false}
          className={cn(
            'absolute inset-0 h-full w-full object-contain',
            status === 'fallback' && 'p-6'
          )}
        />
      )}
    </div>
  );
}
