/** Bandeau d'ouverture de page : la navigation et le contenu commencent en dessous. */
export function Hero({ title, lead }: { title: string; lead: string }) {
  return (
    <section className="relative isolate overflow-hidden">
      <svg
        aria-hidden
        viewBox="0 0 1440 360"
        preserveAspectRatio="xMidYMin slice"
        fill="none"
        stroke="currentColor"
        className="absolute inset-0 -z-10 size-full text-border [mask-image:linear-gradient(to_bottom,black_30%,transparent)]"
      >
        <circle cx="720" cy="640" r="440" />
        <circle cx="720" cy="640" r="580" />
        <circle cx="720" cy="640" r="720" />
      </svg>
      <div className="mx-auto grid max-w-3xl gap-4 px-6 pt-16 pb-14 text-center">
        <h2
          id="ds-title"
          tabIndex={-1}
          className="text-5xl font-medium tracking-tight outline-none"
        >
          {title}
        </h2>
        <p className="mx-auto max-w-xl text-base text-muted-foreground">
          {lead}
        </p>
      </div>
    </section>
  );
}
