import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { defaultMenu, fileToDataUrl, saveMenu, useMenu, type MenuItem } from "@/lib/menu-store";

export const Route = createFileRoute("/painel")({
  head: () => ({
    meta: [
      { title: "Painel do Cardápio" },
      { name: "description", content: "Edite nome, fotos e preços do cardápio digital." },
      { property: "og:title", content: "Painel do Cardápio" },
      { property: "og:description", content: "Gerencie os hambúrgueres do cardápio." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Painel,
});

const input = "w-full rounded-lg border border-input bg-background px-3 py-2 font-body text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring";

function Painel() {
  const [menu, setMenu] = useMenu();
  const [saved, setSaved] = useState(false);
  const upd = (id: string, patch: Partial<MenuItem>) =>
    setMenu({ ...menu, items: menu.items.map((i) => (i.id === id ? { ...i, ...patch } : i)) });
  const save = () => {
    try { saveMenu(menu); setSaved(true); setTimeout(() => setSaved(false), 2000); }
    catch { alert("Espaço cheio: use fotos menores."); }
  };
  return (
    <main className="min-h-screen bg-background px-6 py-12 font-body text-foreground">
      <div className="mx-auto max-w-4xl">
        <div className="flex items-center justify-between">
          <h1 className="font-display text-5xl">Painel</h1>
          <Link to="/" className="text-sm text-primary underline">Ver cardápio</Link>
        </div>
        <div className="mt-8 grid gap-4 rounded-2xl border border-border bg-card p-6 md:grid-cols-2">
          <label className="text-sm">Nome da hamburgueria
            <input className={input} value={menu.storeName} onChange={(e) => setMenu({ ...menu, storeName: e.target.value })} /></label>
          <label className="text-sm">WhatsApp para pedidos (com DDI e DDD)
            <input className={input} value={menu.whatsapp} onChange={(e) => setMenu({ ...menu, whatsapp: e.target.value })} /></label>
        </div>
        <div className="mt-8 space-y-4">
          {menu.items.map((it) => (
            <div key={it.id} className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-4 md:flex-row">
              <label className="relative block h-36 w-36 shrink-0 cursor-pointer overflow-hidden rounded-xl">
                <img src={it.image} alt={it.name} className="h-full w-full object-cover" />
                <span className="absolute inset-x-0 bottom-0 bg-background/80 py-1 text-center text-xs">Trocar foto</span>
                <input type="file" accept="image/*" className="hidden" onChange={async (e) => {
                  const f = e.target.files?.[0]; if (f) upd(it.id, { image: await fileToDataUrl(f) });
                }} />
              </label>
              <div className="grid flex-1 gap-2">
                <input className={input} value={it.name} placeholder="Nome" onChange={(e) => upd(it.id, { name: e.target.value })} />
                <textarea className={input} value={it.description} placeholder="Descrição" onChange={(e) => upd(it.id, { description: e.target.value })} />
                <div className="flex gap-2">
                  <input className={input} type="number" step="0.1" value={it.price} onChange={(e) => upd(it.id, { price: Number(e.target.value) })} />
                  <button className="rounded-lg border border-destructive px-4 text-sm text-destructive" onClick={() => setMenu({ ...menu, items: menu.items.filter((i) => i.id !== it.id) })}>Remover</button>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-6 flex flex-wrap gap-3">
          <button className="rounded-full border border-border px-6 py-3 text-sm" onClick={() => setMenu({ ...menu, items: [...menu.items, { id: crypto.randomUUID(), name: "Novo burger", description: "", price: 30, image: defaultMenu.items[0]!.image }] })}>+ Adicionar burger</button>
          <button className="rounded-full bg-gradient-fire px-8 py-3 text-sm font-semibold text-primary-foreground shadow-glow" onClick={save}>{saved ? "Salvo!" : "Salvar alterações"}</button>
        </div>
      </div>
    </main>
  );
}
