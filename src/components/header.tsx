import { IconAt, IconLinkedin, IconTwitter } from "./icons";

export function Header() {
  return (
    <header className="mb-4">
      <nav className="flex items-center justify-between">
        <h1>
          <a className="text-xl font-semibold text-slate-800" href="/">
            @rgolawski
          </a>
        </h1>
        <ul className="flex space-x-1.5">
          {[
            {
              href: "https://www.twitter.com/rgolawski",
              title: "Link to Twitter",
              Icon: IconTwitter,
            },
            {
              href: "https://www.linkedin.com/in/rgolawski/",
              title: "Link to LinkedIn",
              Icon: IconLinkedin,
            },
            {
              href: "mailto:rafal.j.golawski@gmail.com",
              title: "Send e-mail",
              Icon: IconAt,
            },
          ].map((item) => (
            <li key={item.href}>
              <a
                className="flex h-7 w-7 items-center justify-center rounded shadow ring-1 ring-slate-700/10 hover:bg-slate-50"
                href={item.href}
                title={item.title}
              >
                <item.Icon className="h-5 w-5 text-slate-700" />
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
