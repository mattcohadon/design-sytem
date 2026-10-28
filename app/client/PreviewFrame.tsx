import { useEffect, useRef, useState } from 'react';

/**
 * Iframe d'aperçu qui s'ajuste à la hauteur du composant : la page d'aperçu envoie sa hauteur
 * (message « ds-fit »). `minHeight` réserve la place des menus et fenêtres que le composant ouvre.
 */
export function PreviewFrame({
  src,
  title,
  minHeight = 160,
}: {
  src: string;
  title: string;
  minHeight?: number;
}) {
  const ref = useRef<HTMLIFrameElement>(null);
  const [height, setHeight] = useState<number>();
  useEffect(() => {
    setHeight(undefined);
    const onMessage = (e: MessageEvent) => {
      if (
        e.source === ref.current?.contentWindow &&
        e.data?.type === 'ds-fit' &&
        typeof e.data.height === 'number'
      )
        setHeight(Math.ceil(e.data.height));
    };
    addEventListener('message', onMessage);
    return () => removeEventListener('message', onMessage);
  }, [src]);
  return (
    <iframe
      ref={ref}
      className="catalogue-frame max-h-[calc(100svh-10rem)] w-full rounded-2xl border bg-background"
      style={{ height: Math.min(Math.max(height ?? 320, minHeight), 720) }}
      title={title}
      src={src}
    />
  );
}
