import { useEffect, useState } from "react";
import classic from "@/assets/menu-classic.jpg";
import bacon from "@/assets/menu-bacon.jpg";
import chicken from "@/assets/menu-chicken.jpg";
import veggie from "@/assets/menu-veggie.jpg";
import monster from "@/assets/menu-monster.jpg";

export type MenuItem = { id: string; name: string; description: string; price: number; image: string };
export type MenuData = { storeName: string; whatsapp: string; items: MenuItem[] };

export const defaultMenu: MenuData = {
  storeName: "Brasa Burger",
  whatsapp: "5511999999999",
  items: [
    { id: "1", name: "Smash Clássico", description: "Dois smash de 90g, cheddar derretido, picles e molho da casa.", price: 32.9, image: classic },
    { id: "2", name: "Bacon Barbecue", description: "Blend 180g, bacon crocante, cebola caramelizada e barbecue defumado.", price: 39.9, image: bacon },
    { id: "3", name: "Crispy Chicken", description: "Frango empanado crocante, coleslaw e maionese picante.", price: 34.9, image: chicken },
    { id: "4", name: "Portobello Veggie", description: "Portobello grelhado, rúcula, tomate e queijo de cabra.", price: 36.9, image: veggie },
    { id: "5", name: "Monstro Jalapeño", description: "Triplo blend, pepper jack, jalapeños e cebola na chapa.", price: 49.9, image: monster },
  ],
};

const KEY = "cardapio-menu-v1";
export function loadMenu(): MenuData {
  try { const raw = localStorage.getItem(KEY); if (raw) return JSON.parse(raw); } catch {}
  return defaultMenu;
}
export function saveMenu(m: MenuData) { localStorage.setItem(KEY, JSON.stringify(m)); }

export function useMenu() {
  const [menu, setMenu] = useState<MenuData>(defaultMenu);
  useEffect(() => { setMenu(loadMenu()); }, []);
  return [menu, setMenu] as const;
}

export function formatBRL(v: number) {
  return v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export function fileToDataUrl(file: File, max = 900): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const s = Math.min(1, max / Math.max(img.width, img.height));
      const c = document.createElement("canvas");
      c.width = img.width * s; c.height = img.height * s;
      c.getContext("2d")!.drawImage(img, 0, 0, c.width, c.height);
      resolve(c.toDataURL("image/jpeg", 0.82));
    };
    img.onerror = reject;
    img.src = URL.createObjectURL(file);
  });
}
