import Image from "next/image";
import Link from "next/link";

const switchCards = [
  {
    title: "Illness explained",
    body: "Understand the condition, warning signs, and why treatment timing matters.",
    iconPath: "/infographics/illness-explained.svg",
    href: "/treatments",
  },
  {
    title: "Hospital guidance",
    body: "See what to check in hospitals, ICU backup, and patient support systems.",
    iconPath: "/infographics/hospital-guidance.svg",
    href: "/destinations/india",
  },
  {
    title: "Doctors and duration",
    body: "Know who treats you and expected timeline from admission to follow-up.",
    iconPath: "/infographics/doctors-duration.svg",
    href: "/doctors",
  },
  {
    title: "Quick check price",
    body: "Click CTA to open popup, submit 4 details, and get estimate direction.",
    iconPath: "/infographics/check-price.svg",
    href: "/destinations/india",
  },
];

export function PathwaySwitchCards() {
  return (
    <section className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {switchCards.map((item) => (
        <Link
          key={item.title}
          href={item.href}
          className="rounded-[1.25rem] border border-[var(--line)] bg-[linear-gradient(165deg,#ffffff_0%,#f2f8ff_100%)] p-5 transition hover:-translate-y-0.5 hover:border-[var(--brand)]"
        >
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-full border border-[var(--line)] bg-white">
            <Image src={item.iconPath} alt={item.title} width={44} height={44} />
          </div>
          <h2 className="mt-4 text-base font-semibold text-slate-900">{item.title}</h2>
          <p className="mt-2 text-sm leading-7 text-[var(--muted)]">{item.body}</p>
        </Link>
      ))}
    </section>
  );
}
