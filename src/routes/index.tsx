import { createFileRoute, Link } from "@tanstack/react-router";
import { BurgerScene } from "@/components/BurgerScene";
import { formatBRL, useMenu } from "@/lib/menu-store";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Cardápio Digital | Hamburgueria artesanal" },
      { name: "description", content: "Descubra a anatomia do nosso hambúrguer e peça o seu favorito." },
      { property: "og:title", content: "Cardápio Digital | Hamburgueria artesanal" },
      { property: "og:description", content: "Hambúrgueres artesanais feitos na brasa. Escolha e peça." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  const [menu] = useMenu();
  const order = (name: string, price: number) => {
    const msg = encodeURIComponent(`Olá! Quero pedir: ${name} (${formatBRL(price)})`);
    window.open(`https://wa.me/${menu.whatsapp.replace(/\D/g, "")}?text=${msg}`, "_blank");
  };
  return (
    <main className="bg-background">
      <header className="fixed left-0 right-0 top-0 z-50 flex items-center justify-between px-6 py-4">
        <span className="font-display text-2xl tracking-wider text-primary">{menu.storeName}</span>
        <a href="#cardapio" className="font-body text-xs uppercase tracking-[0.3em] text-foreground">Cardápio</a>
      </header>
      <BurgerScene />
      <section id="cardapio" className="relative px-6 py-24">
        <div className="mx-auto max-w-6xl">
          <p className="font-body text-xs uppercase tracking-[0.5em] text-primary">Escolha o seu</p>
          <h2 className="mt-3 font-display text-6xl text-foreground md:text-7xl">Nossos Burgers</h2>
          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {menu.items.map((it) => (
              <article key={it.id} className="group overflow-hidden rounded-2xl border border-border bg-card shadow-card transition-transform duration-500 hover:-translate-y-2">
                <div className="aspect-square overflow-hidden">
                  <img src={it.image} alt={it.name} loading="lazy" width={1024} height={1024} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
                </div>
                <div className="p-6">
                  <div className="flex items-baseline justify-between gap-4">
                    <h3 className="font-display text-3xl text-card-foreground">{it.name}</h3>
                    <span className="font-display text-2xl text-primary">{formatBRL(it.price)}</span>
                  </div>
                  <p className="mt-2 font-body text-sm text-muted-foreground">{it.description}</p>
                  <button onClick={() => order(it.name, it.price)} className="mt-6 w-full rounded-full bg-gradient-fire py-3 font-body text-sm font-semibold uppercase tracking-widest text-primary-foreground shadow-glow transition-transform hover:scale-[1.02]">
                    Pedir agora
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
      <footer className="border-t border-border py-8 text-center font-body text-xs text-muted-foreground">
        {menu.storeName} · <Link to="/painel" className="underline">Painel</Link>
      </footer>
    </main>
  );
}
