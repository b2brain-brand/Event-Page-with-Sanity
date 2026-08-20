import Link from 'next/link'

export default function NotFound() {
  return (
    <main>
      <section className="hero">
        <div className="container hero__pad">
          <div className="hero__eyebrow">
            <span className="chip">404</span>
          </div>
          <h1>That event page does not exist.</h1>
          <p className="hero__sub">
            It may have been renamed, or the show has not been published yet.
          </p>
          <div className="hero__ctas">
            <Link href="/events" className="btn btn--primary">
              See all events
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
