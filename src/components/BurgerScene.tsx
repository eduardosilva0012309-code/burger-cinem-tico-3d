import { useEffect, useRef, useState } from "react";
import bunTop from "@/assets/layer-bun-top.png";
import lettuce from "@/assets/layer-lettuce.png";
import tomato from "@/assets/layer-tomato.png";
import cheese from "@/assets/layer-cheese.png";
import bacon from "@/assets/layer-bacon.png";
import patty from "@/assets/layer-patty.png";
import bunBottom from "@/assets/layer-bun-bottom.png";

const layers = [
  { src: bunTop, name: "Pão Brioche", text: "Amanteigado, selado na chapa e coberto de gergelim.", closed: -70 },
  { src: lettuce, name: "Alface Crespa", text: "Folhas frescas e crocantes, colhidas no dia.", closed: -22 },
  { src: tomato, name: "Tomate Italiano", text: "Fatias suculentas que equilibram cada mordida.", closed: -12 },
  { src: cheese, name: "Cheddar Inglês", text: "Derretido sobre a carne até escorrer.", closed: -2 },
  { src: bacon, name: "Bacon Defumado", text: "Fatias crocantes defumadas na lenha.", closed: 6 },
  { src: patty, name: "Blend 180g", text: "Costela e acém moídos na casa, grelhados na brasa.", closed: 22 },
  { src: bunBottom, name: "Base Tostada", text: "Firme para segurar todo o sabor até o fim.", closed: 70 },
];

const clamp = (v: number) => Math.min(1, Math.max(0, v));
// smooth with a soft overshoot, like a real object settling
const settle = (t: number) => {
  const c = 1.4;
  return 1 + (c + 1) * Math.pow(t - 1, 3) + c * Math.pow(t - 1, 2);
};
const smooth = (t: number) => t * t * (3 - 2 * t);

const embers = Array.from({ length: 22 }, (_, i) => ({
  left: (i * 37) % 100, delay: (i * 0.73) % 8, dur: 7 + ((i * 1.3) % 6), size: 2 + (i % 3),
}));

export function BurgerScene() {
  const ref = useRef<HTMLDivElement>(null);
  const [p, setP] = useState(0);
  const [t, setT] = useState(0);
  const [mobile, setMobile] = useState(false);

  useEffect(() => {
    let target = 0, cur = 0, raf = 0;
    const read = () => {
      const el = ref.current; if (!el) return;
      const r = el.getBoundingClientRect();
      target = clamp(-r.top / (el.offsetHeight - window.innerHeight));
      setMobile(window.innerWidth < 768);
    };
    const loop = (now: number) => {
      cur += (target - cur) * 0.08; // inertia: movement glides instead of jumping
      setP(cur); setT(now / 1000);
      raf = requestAnimationFrame(loop);
    };
    read(); cur = target;
    window.addEventListener("scroll", read, { passive: true });
    window.addEventListener("resize", read);
    raf = requestAnimationFrame(loop);
    return () => { cancelAnimationFrame(raf); window.removeEventListener("scroll", read); window.removeEventListener("resize", read); };
  }, []);

  const n = layers.length;
  const spacing = mobile ? 62 : 105;
  const intro = smooth(clamp(p / 0.08));
  const exit = smooth(clamp((p - 0.88) / 0.12));
  const openAll = clamp((p - 0.08) / 0.35);
  // which ingredient is being "presented"
  const focusF = (p - 0.42) / 0.065;
  const focus = Math.round(focusF);
  const presenting = p > 0.4 && p < 0.88;
  const spin = Math.sin(t * 0.4) * 6 + (1 - openAll) * p * 120;

  return (
    <section ref={ref} className="relative h-[600vh]">
      <div className="sticky top-0 flex h-screen items-center justify-center overflow-hidden bg-scene">
        <div className="pointer-events-none absolute inset-0 spotlight" style={{ opacity: 0.7 + Math.sin(t * 2.3) * 0.08 + Math.sin(t * 5.1) * 0.04 }} />
        <div className="pointer-events-none absolute inset-0">
          {embers.map((e, i) => (
            <span key={i} className="ember" style={{ left: `${e.left}%`, width: e.size, height: e.size, animationDelay: `${e.delay}s`, animationDuration: `${e.dur}s` }} />
          ))}
        </div>

        <div className="absolute top-10 z-30 text-center" style={{ opacity: 1 - openAll * 1.6, transform: `translateY(${-openAll * 40}px)`, filter: `blur(${openAll * 6}px)` }}>
          <p className="font-body text-xs uppercase tracking-[0.5em] text-primary">Feito na brasa</p>
          <h1 className="mt-3 font-display text-6xl text-foreground md:text-8xl">Anatomia do Sabor</h1>
          <p className="mt-2 font-body text-sm text-muted-foreground">Role para abrir ↓</p>
        </div>

        <div className="relative h-[80vh] w-full max-w-5xl [perspective:1400px]"
          style={{ opacity: 1 - exit, transform: `scale(${0.92 + intro * 0.08 - exit * 0.25}) translateY(${-exit * 160}px)`, filter: `blur(${exit * 8}px)` }}>
          {/* steam over the closed burger */}
          <div className="pointer-events-none absolute left-1/2 top-[18%] z-40 -translate-x-1/2" style={{ opacity: 1 - openAll * 2 }}>
            {[0, 1, 2].map((s) => <span key={s} className="steam" style={{ left: (s - 1) * 40, animationDelay: `${s * 1.1}s` }} />)}
          </div>
          {/* contact shadow on the table */}
          <div className="table-shadow absolute left-1/2 top-1/2 -translate-x-1/2"
            style={{ transform: `translate(-50%, ${120 + openAll * spacing * 2.6}px) scaleX(${1 - openAll * 0.35})`, opacity: 0.85 - openAll * 0.4 }} />

          {layers.map((l, i) => {
            // each layer lifts off with its own delay -> natural cascade
            const local = clamp((openAll - i * 0.06) / 0.64);
            const e = settle(local);
            const openY = (i - (n - 1) / 2) * spacing;
            const bob = Math.sin(t * 1.2 + i * 0.9) * 3 * local;
            const y = l.closed + (openY - l.closed) * e + bob;
            const isFocus = presenting && focus === i;
            const dist = presenting ? Math.min(1, Math.abs(focusF - i)) : 0;
            const scale = 1 + (isFocus ? 0.08 * (1 - dist) : 0);
            const dim = presenting ? 0.55 + 0.45 * (1 - Math.min(1, Math.abs(focusF - i) / 1.5)) : 1;
            const tilt = 22 * e + Math.sin(t * 0.8 + i) * 1.5 * local;
            const start = 0.4 + i * 0.065;
            const show = smooth(clamp((p - start) / 0.05));
            const left = i % 2 === 0;
            return (
              <div key={l.name} className="absolute left-1/2 top-1/2" style={{ zIndex: n - i + 10, transform: `translate(-50%, calc(-50% + ${y}px))` }}>
                <img src={l.src} alt={l.name} width={1024} height={1024} draggable={false}
                  className="w-[240px] max-w-none drop-shadow-burger md:w-[360px]"
                  style={{
                    transform: `rotateX(${tilt}deg) rotateZ(${(left ? -1 : 1) * 3 * e}deg) rotateY(${spin * (1 - local)}deg) scale(${scale})`,
                    filter: `brightness(${dim}) saturate(${0.9 + dim * 0.2})`,
                  }} />
                <div className={`absolute top-1/2 hidden w-64 md:block ${left ? "right-full mr-2 text-right" : "left-full ml-2"}`}
                  style={{ opacity: show, transform: `translateY(-50%) translateX(${(1 - show) * (left ? -40 : 40)}px)`, filter: `blur(${(1 - show) * 4}px)` }}>
                  <div className={`mb-2 h-px bg-primary ${left ? "ml-auto" : ""}`} style={{ width: 64 * show }} />
                  <h3 className="font-display text-3xl text-foreground">{l.name}</h3>
                  <p className="font-body text-sm text-muted-foreground">{l.text}</p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="absolute bottom-8 left-0 right-0 px-6 text-center md:hidden">
          {layers.map((l, i) => {
            const start = 0.4 + i * 0.065;
            const a = smooth(clamp((p - start) / 0.02)) * (1 - smooth(clamp((p - start - 0.055) / 0.01)));
            return a > 0.01 ? (
              <div key={l.name} className="absolute inset-x-6 bottom-0" style={{ opacity: a, transform: `translateY(${(1 - a) * 12}px)` }}>
                <h3 className="font-display text-3xl text-primary">{l.name}</h3>
                <p className="font-body text-sm text-muted-foreground">{l.text}</p>
              </div>
            ) : null;
          })}
        </div>
      </div>
    </section>
  );
}
