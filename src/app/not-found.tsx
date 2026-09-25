import Link from "next/link";
export default function NotFound() {
  return (
    <div className="zone-light zonewrap">
      <section className="room wrap column-narrow">
        <p className="eyebrow">404</p>
        <h1 className="section-h">Page not found</h1>
        <p className="prose">
          That page does not exist. <Link href="/">Return home</Link>.
        </p>
      </section>
    </div>
  );
}
