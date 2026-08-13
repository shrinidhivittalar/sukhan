import Link from "next/link";
import type { ReactNode } from "react";
import { volumes } from "./data";

export function AuthShell({
  eyebrow,
  title,
  children,
  footnote,
}: {
  eyebrow: string;
  title: string;
  children: ReactNode;
  footnote?: ReactNode;
}) {
  return (
    <main className="login-page">
      <div className="login-image" aria-hidden="true" />
      <section className="login-brand">
        <span className="login-urdu" lang="ur" dir="rtl">لفظ سے آواز تک</span>
        <h1>Sukhan</h1>
        <p>Read the word. Hear the poem. Keep what stays.</p>
        <div className="login-volume-strip" aria-label="Ten-volume Urdu poetry course">
          {volumes.map((volume) => (
            <span key={volume.id}>{String(volume.id).padStart(2, "0")}</span>
          ))}
        </div>
      </section>

      <section className="login-panel" aria-labelledby="auth-title">
        <div className="login-panel-inner">
          <Link className="login-mini-brand" href="/">
            <span lang="ur" dir="rtl">سخن</span> Sukhan
          </Link>
          <div className="login-heading">
            <span>{eyebrow}</span>
            <h2 id="auth-title">{title}</h2>
          </div>
          {children}
          {footnote && <p className="login-footnote">{footnote}</p>}
        </div>
      </section>
    </main>
  );
}
