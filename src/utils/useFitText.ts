import { useLayoutEffect, type RefObject } from "react";

// Kutudan taşan [data-fit] yazısını sığana kadar küçültür; indirilen görselde metin kesilmesin
export function useFitText(box: RefObject<HTMLElement | null>, start: number, text: string) {
  useLayoutEffect(() => {
    const el = box.current;
    const target = el?.querySelector<HTMLElement>("[data-fit]");
    if (!el || !target) return;
    const fit = () => {
      let size = start;
      target.style.fontSize = `${size}px`;
      while (el.scrollHeight > el.clientHeight && size > 8) {
        size -= 0.5;
        target.style.fontSize = `${size}px`;
      }
    };
    fit();
    document.fonts.ready.then(fit); // yazı tipi geç yüklenirse ölçüler değişir
  }, [box, start, text]);
}
