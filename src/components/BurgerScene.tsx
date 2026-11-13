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

export function BurgerScene() {
  const ref = useRef<HTMLDivElement>(null);
  const [p, setP] = useState(0);
  useEffect(() => {
    const on = () => {
      const el = ref.current; if (!el) return;
      const r = el.getBoundingClientRect();
      const total = el.offsetHeight - window.innerHeight;
      setP(Math.min(1, Math.max(0, -r.top / total)));
    };
    on(); window.addEventListener("scroll", on, { passive: true }); window.addEventListener("resize", on);
    return () => { window.removeEventListener("scroll", on); window.removeEventListener("resize", on); };
  }, []);

  const open = Math.min(1, Math.max(0, (p - 0.08) / 0.35));
  const ease = 1 - Math.pow(1 - open, 3);
  const exit = Math.max(0, (p - 0.88) / 0.12);
  const spacing = typeof window !== "undefined" && window.innerWidth < 768 ? 62 : 105;
  const n = layers.length;

  return (
    <section ref={ref} className="relative h-[600vh]">
      <div className="sticky top-0 flex h-screen items-center justify-center overflow-hidden bg-scene">
        <div className="pointer-events-none absolute inset-0 spotlight" />
        <div className="absolute top-10 text-center transition-opacity duration-500" style={{ opacity: 1 - open * 1.5 }}>
          <p className="font-body text-xs uppercase tracking-[0.5em] text-primary">Feito na brasa</p>
          <h1 className="mt-3 font-display text-6xl text-foreground md:text-8xl">Anatomia do Sabor</h1>
          <p className="mt-2 font-body text-sm text-muted-foreground">Role para abrir ↓</p>
        </div>

        <div className="relative h-[80vh] w-full max-w-5xl [perspective:1400px]"
          style={{ opacity: 1 - exit, transform: `scale(${1 - exit * 0.2}) translateY(${-exit * 120}px)` }}>
          {layers.map((l, i) => {
            const openY = (i - (n - 1) / 2) * spacing;
            const y = l.closed + (openY - l.closed) * ease;
            const rot = 18 * ease;
            const start = 0.4 + i * 0.065;
            const show = Math.min(1, Math.max(0, (p - start) / 0.05));
            const left = i % 2 === 0;
            return (
              <div key={l.name} className="absolute left-1/2 top-1/2" style={{ zIndex: n - i + 10, transform: `translate(-50%, calc(-50% + ${y}px))` }}>
                <img src={l.src} alt={l.name} width={1024} height={1024}
                  className="w-[240px] max-w-none drop-shadow-burger md:w-[360px]"
                  style={{ transform: `rotateX(${rot}deg) rotateZ(${(left ? -1 : 1) * 4 * ease}deg)` }} />
                <div className={`absolute top-1/2 hidden w-64 -translate-y-1/2 md:block ${left ? "right-full mr-2 text-right" : "left-full ml-2"}`}
                  style={{ opacity: show, transform: `translateY(-50%) translateX(${(1 - show) * (left ? -30 : 30)}px)` }}>
                  <div className={`mb-2 h-px w-16 bg-primary ${left ? "ml-auto" : ""}`} />
                  <h3 className="font-display text-3xl text-foreground">{l.name}</h3>
                  <p className="font-body text-sm text-muted-foreground">{l.text}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* mobile caption */}
        <div className="absolute bottom-8 left-0 right-0 px-6 text-center md:hidden">
          {layers.map((l, i) => {
            const start = 0.4 + i * 0.065;
            const a = p >= start && p < start + 0.065 ? 1 : 0;
            return a ? (<div key={l.name}><h3 className="font-display text-3xl text-primary">{l.name}</h3><p className="font-body text-sm text-muted-foreground">{l.text}</p></div>) : null;
          })}
        </div>
      </div>
    </section>
  );
}
