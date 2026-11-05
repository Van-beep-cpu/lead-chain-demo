import { LeadForm } from "@/components/LeadForm";

const services = [
  ["Interior walls", "Living rooms, bedrooms and hallways, prepared properly before the first coat."],
  ["Ceilings and trim", "Clean lines around doors, windows and skirting boards."],
  ["Move-in refresh", "A full repaint between tenants or before you move in."],
];

const steps = [
  ["Tell us about the room", "Send a few details through the form."],
  ["Get a clear quote", "We ask for anything that is missing and send a written price."],
  ["We paint, you check", "We protect your floors, finish the work and walk through it with you."],
];

export default function Home() {
  return (
    <>
      <p className="bg-ink px-4 py-2 text-center text-sm text-paper">
        Portfolio demo. Fern &amp; Finch Painting is a fictional company.
      </p>
      <header className="mx-auto flex max-w-6xl items-center justify-between px-4 py-5 sm:px-6">
        <span className="text-xl font-semibold" style={{ fontFamily: "var(--font-display)" }}>Fern &amp; Finch</span>
        <a href="#quote" className="text-sm font-medium underline underline-offset-4">Ask for a quote</a>
      </header>
      <main>
        <section className="mx-auto grid max-w-6xl gap-10 px-4 pb-16 pt-8 sm:px-6 lg:grid-cols-[1.1fr_1fr] lg:pt-14">
          <div>
            <p className="text-sm font-medium uppercase tracking-widest text-clay">Interior painting</p>
            <h1 className="mt-4 text-5xl leading-[1.05] sm:text-7xl">Fresh rooms, without the runaround.</h1>
            <p className="mt-6 max-w-xl text-lg text-ink/75">
              Tell us what needs painting. You get a clear quote and one point of contact from the first message to the final walkthrough.
            </p>
            <div className="mt-8 h-3 w-full max-w-md bg-[linear-gradient(90deg,var(--color-fern)_0_40%,var(--color-clay)_40%_65%,var(--color-line)_65%)]" />
          </div>
          <div id="quote" className="scroll-mt-6"><LeadForm /></div>
        </section>

        <section className="border-y border-line">
          <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
            <h2 className="text-3xl sm:text-4xl">What we paint</h2>
            <div className="mt-8 grid gap-8 md:grid-cols-3">
              {services.map(([title, text]) => (
                <article key={title} className="border-t-2 border-fern pt-4">
                  <h3 className="text-xl">{title}</h3>
                  <p className="mt-2 text-ink/75">{text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <h2 className="text-3xl sm:text-4xl">How it works</h2>
          <ol className="mt-8 grid gap-8 md:grid-cols-3">
            {steps.map(([title, text], index) => (
              <li key={title}>
                <span className="text-4xl text-clay" style={{ fontFamily: "var(--font-display)" }}>{index + 1}</span>
                <h3 className="mt-2 text-xl">{title}</h3>
                <p className="mt-2 text-ink/75">{text}</p>
              </li>
            ))}
          </ol>
        </section>
      </main>
      <footer className="border-t border-line px-4 py-8 text-center text-sm text-ink/70">
        Demo, fictional firm. Built by Northloop to show a website connected to a lead workflow.
        <span className="mt-2 block">
          <a href="https://northloop.systems/impressum" className="underline">Impressum</a>
          {" · "}
          <a href="https://northloop.systems/datenschutz" className="underline">Datenschutz</a>
        </span>
      </footer>
    </>
  );
}
