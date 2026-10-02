import type { Metadata } from "next";

// Scanned from the QR code on a CVG ID card. Rendered on the server so it works on any phone camera.

interface Verify {
  code: string;
  fullName: string;
  jerseyNumber?: number;
  status: "TRIALIST" | "ACTIVE" | "INACTIVE" | "LEFT";
  current: boolean;
  season?: string;
  position?: string;
  photoUrl?: string;
}

const API_URL = process.env.CVG_API_URL ?? "http://localhost:8080";

const STATUS: Record<Verify["status"], string> = {
  ACTIVE: "Active",
  TRIALIST: "Trialist",
  INACTIVE: "Inactive",
  LEFT: "Left the club",
};

type Params = Promise<{ code: string; signature: string }>;

async function lookup(code: string, signature: string): Promise<Verify | null> {
  const res = await fetch(`${API_URL}/api/public/verify/${encodeURIComponent(code)}/${encodeURIComponent(signature)}`, {
    cache: "no-store",
  });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`Verify failed: ${res.status}`);
  return res.json();
}

export const metadata: Metadata = {
  title: "Check a CVG ID card",
  robots: { index: false },
};

export default async function VerifyPage({ params }: { params: Params }) {
  const { code, signature } = await params;
  const v = await lookup(code, signature);

  if (!v) {
    return (
      <main>
        <span className="label">ID card check</span>
        <div className="verdict verdict-bad" style={{ marginTop: 12 }}>
          <span className="icon">✕</span>
          We can&apos;t find this card
        </div>
        <p className="muted">The card may be fake or damaged. Ask the person for another form of ID.</p>
      </main>
    );
  }

  return (
    <main>
      <span className="label">ID card check</span>
      <div className={`verdict ${v.current ? "verdict-good" : "verdict-bad"}`} style={{ marginTop: 12 }}>
        <span className="icon">{v.current ? "✓" : "✕"}</span>
        {v.current ? "Current CVG member" : "Not a current member"}
      </div>

      <div className="person">
        {v.photoUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img className="photo" src={v.photoUrl} alt={v.fullName} />
        ) : (
          <div className="photo">{v.jerseyNumber ?? "–"}</div>
        )}
        <div>
          <p className="name">{v.fullName}</p>
          <span className="mono muted">{v.code}</span>
        </div>
      </div>

      <div className="facts">
        <div className="fact"><span className="muted">Status</span><strong>{STATUS[v.status]}</strong></div>
        {v.season && <div className="fact"><span className="muted">Season</span><span>{v.season}</span></div>}
        {v.jerseyNumber != null && <div className="fact"><span className="muted">Jersey</span><span className="mono">{v.jerseyNumber}</span></div>}
        {v.position && <div className="fact"><span className="muted">Position</span><span>{v.position}</span></div>}
      </div>
      <p className="muted" style={{ fontSize: 13, marginTop: 16 }}>
        Checked live just now. Compare the photo and name with the card.
      </p>
    </main>
  );
}
