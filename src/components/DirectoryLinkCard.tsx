import Link from 'next/link';

interface DirectoryLinkCardProps {
  href: string;
  icon: string;
  title: string;
  description: string;
}

export default function DirectoryLinkCard({ href, icon, title, description }: DirectoryLinkCardProps) {
  return (
    <Link
      href={href}
      className="group mx-auto mt-8 flex max-w-[720px] items-center gap-4 rounded-xl border border-line bg-white p-6 text-foreground no-underline transition-[border-color,box-shadow,transform] duration-200 hover:-translate-y-0.5 hover:border-primary hover:no-underline hover:shadow-[0_8px_24px_rgba(58, 125, 68,0.12)]"
    >
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-xl text-primary">
        <i className={icon}></i>
      </div>
      <div className="min-w-0 flex-1">
        <h3 className="m-0 mb-1 text-base text-foreground">{title}</h3>
        <p className="m-0 text-[0.8125rem] text-muted-foreground">{description}</p>
      </div>
      <i className="bi bi-arrow-right text-muted-foreground opacity-0 transition-[opacity,transform] duration-200 group-hover:translate-x-1 group-hover:opacity-100"></i>
    </Link>
  );
}
