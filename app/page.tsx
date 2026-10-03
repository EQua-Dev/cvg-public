// The Board's front page: who we are, the next fixture and recent results. Rendered on the server.

interface Fixture { date: string; time: string; opponent: string; venue: string; side: "HOME" | "AWAY" | "NEUTRAL"; type: string }
interface Result { date: string; opponent: string; side: string; ourScore: number; theirScore: number; scorers: string[]; potm: string[] }
interface Matches { next?: Fixture; results: Result[] }

const API_URL = process.env.CVG_API_URL ?? "http://localhost:8080";

// Always fresh: people check right after the final whistle.
export const dynamic = "force-dynamic";

async function matches(): Promise<Matches> {
  try {
    const res = await fetch(`${API_URL}/api/public/matches`, { cache: "no-store" });
    return res.ok ? await res.json() : { results: [] };
  } catch {
    return { results: [] };
  }
}

function day(iso: string) {
  return new Date(iso + "T00:00:00").toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short" }).toUpperCase().replace(",", "");
}

function clock(t: string) {
  const [h, m] = t.split(":").map(Number);
  return `${((h + 11) % 12) + 1}:${String(m).padStart(2, "0")}${h < 12 ? "AM" : "PM"}`;
}

export default async function Home() {
  const { next, results } = await matches();
  return (
    <main style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <span className="label">Abuja</span>
      <h1 className="h1">Three estates.<br />One club.</h1>
      <p className="muted" style={{ margin: 0 }}>
        CVG FC brings together players from Choose, Vascumi and Grace Pavillion estates.
      </p>

      {next && (
        <section className="fixture">
          <span className="label">Next match</span>
          <strong className="fixture-vs">CVG FC <span className="muted">vs</span> {next.opponent}</strong>
          <span className="mono" style={{ color: "var(--orange)", fontWeight: 600 }}>{day(next.date)} · {clock(next.time)}</span>
          <span className="muted">{next.venue}</span>
        </section>
      )}

      {results.length > 0 && (
        <section style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <span className="label">Results</span>
          <div className="facts" style={{ marginTop: 0 }}>
            {results.map((r, i) => {
              const o = r.ourScore > r.theirScore ? "W" : r.ourScore === r.theirScore ? "D" : "L";
              return (
                <div key={i} className="result">
                  <span className={`outcome outcome-${o}`}>{o}</span>
                  <span style={{ flex: 1, minWidth: 0 }}>
                    <strong>vs {r.opponent}</strong>
                    <br />
                    <span className="muted" style={{ fontSize: 13 }}>
                      <span className="mono">{day(r.date)}</span>
                      {r.scorers.length > 0 && ` · ⚽ ${r.scorers.join(", ")}`}
                      {r.potm.length > 0 && ` · 🏆 ${r.potm.join(" & ")}`}
                    </span>
                  </span>
                  <span className="mono" style={{ fontWeight: 700, fontSize: 20 }}>{r.ourScore}–{r.theirScore}</span>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {!next && results.length === 0 && <p className="muted" style={{ margin: 0 }}>Fixtures and results will show here.</p>}
    </main>
  );
}
