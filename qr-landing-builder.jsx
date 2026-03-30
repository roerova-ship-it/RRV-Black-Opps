import { useState, useCallback, useEffect } from "react";

const FONTS = "@import url('https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=Syne:wght@700;800&display=swap');";

const defaultConfig = {
  title: "¡Oferta Exclusiva!",
  subtitle: "Solo para clientes seleccionados",
  description: "Accede a este contenido especial creado únicamente para ti. Esta página tiene un número limitado de accesos.",
  ctaText: "Reclamar ahora",
  ctaUrl: "https://ejemplo.com",
  badgeText: "ACCESO LIMITADO",
  footerText: "Esta página expirará automáticamente.",
  maxUses: 5,
  primaryColor: "#00ffaa",
  accentColor: "#ff3cac",
  bgColor: "#070711",
  textColor: "#e8eaf6",
  hostUrl: "https://mi-sitio.com/promo.html",
};

function generateLandingHTML(cfg) {
  const p = cfg.primaryColor.replace("#", "");
  const a = cfg.accentColor.replace("#", "");
  return `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1.0"/>
<title>${cfg.title}</title>
<link rel="preconnect" href="https://fonts.googleapis.com"/>
<link href="https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=Syne:wght@700;800&display=swap" rel="stylesheet"/>
<style>
:root{--p:${cfg.primaryColor};--a:${cfg.accentColor};--bg:${cfg.bgColor};--txt:${cfg.textColor};}
*{margin:0;padding:0;box-sizing:border-box;}
body{min-height:100vh;background:var(--bg);color:var(--txt);font-family:'Space Mono',monospace;display:flex;align-items:center;justify-content:center;overflow-x:hidden;}
body::before{content:'';position:fixed;inset:0;background:radial-gradient(ellipse 80% 60% at 50% 0%,${cfg.primaryColor}18,transparent 70%),radial-gradient(ellipse 50% 40% at 100% 100%,${cfg.accentColor}15,transparent 60%);pointer-events:none;}
.wrap{max-width:520px;width:90%;padding:2.5rem 2rem;position:relative;animation:fadeUp .8s ease both;}
@keyframes fadeUp{from{opacity:0;transform:translateY(30px);}to{opacity:1;transform:none;}}
.card{background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.08);border-radius:20px;padding:2.5rem 2rem;backdrop-filter:blur(12px);position:relative;overflow:hidden;}
.card::before{content:'';position:absolute;top:0;left:0;right:0;height:2px;background:linear-gradient(90deg,transparent,var(--p),var(--a),transparent);}
.badge{display:inline-block;padding:.3rem .9rem;background:linear-gradient(135deg,var(--p)22,var(--a)22);border:1px solid var(--p);border-radius:999px;font-size:.65rem;letter-spacing:.15em;color:var(--p);font-weight:700;margin-bottom:1.5rem;text-transform:uppercase;}
h1{font-family:'Syne',sans-serif;font-size:clamp(1.6rem,5vw,2.4rem);font-weight:800;line-height:1.15;margin-bottom:.75rem;background:linear-gradient(135deg,var(--txt),var(--p));-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;}
.sub{font-size:.85rem;color:var(--p);letter-spacing:.05em;margin-bottom:1.2rem;opacity:.9;}
p{font-size:.88rem;line-height:1.75;opacity:.75;margin-bottom:2rem;}
.uses-bar{margin-bottom:1.8rem;}
.uses-label{font-size:.7rem;letter-spacing:.1em;opacity:.5;text-transform:uppercase;margin-bottom:.5rem;}
.bar-track{height:4px;background:rgba(255,255,255,.08);border-radius:9px;overflow:hidden;}
.bar-fill{height:100%;border-radius:9px;background:linear-gradient(90deg,var(--p),var(--a));transition:width .6s ease;}
.uses-count{font-size:.72rem;opacity:.55;margin-top:.4rem;}
.cta{display:block;width:100%;padding:1rem 1.5rem;background:linear-gradient(135deg,var(--p),var(--a));border:none;border-radius:12px;color:#000;font-family:'Syne',sans-serif;font-size:1rem;font-weight:700;text-align:center;text-decoration:none;cursor:pointer;transition:transform .2s,box-shadow .2s;letter-spacing:.02em;}
.cta:hover{transform:translateY(-2px);box-shadow:0 8px 30px ${cfg.primaryColor}40;}
.footer{text-align:center;font-size:.7rem;opacity:.35;margin-top:1.5rem;letter-spacing:.05em;}
/* Expired state */
.expired{text-align:center;}
.expired h2{font-family:'Syne',sans-serif;font-size:1.8rem;font-weight:800;color:var(--a);margin-bottom:.75rem;}
.expired p{opacity:.6;font-size:.85rem;}
.pulse{display:inline-block;width:12px;height:12px;border-radius:50%;background:var(--p);animation:pulse 2s infinite;margin-right:.5rem;vertical-align:middle;}
@keyframes pulse{0%,100%{opacity:1;transform:scale(1);}50%{opacity:.4;transform:scale(.8);}}
</style>
</head>
<body>
<div class="wrap">
<div class="card" id="content">
  <div id="main">
    <div class="badge"><span class="pulse"></span>${cfg.badgeText}</div>
    <h1>${cfg.title}</h1>
    <div class="sub">${cfg.subtitle}</div>
    <p>${cfg.description}</p>
    <div class="uses-bar">
      <div class="uses-label">Accesos disponibles</div>
      <div class="bar-track"><div class="bar-fill" id="barFill"></div></div>
      <div class="uses-count" id="usesCount"></div>
    </div>
    <a href="${cfg.ctaUrl}" class="cta" id="ctaBtn">${cfg.ctaText}</a>
  </div>
</div>
<div class="footer">${cfg.footerText}</div>
</div>
<script>
(function(){
  var KEY='_qr_uses_${Math.random().toString(36).slice(2,8)}';
  var MAX=${cfg.maxUses};
  var used=parseInt(localStorage.getItem(KEY)||'0',10);
  var fill=document.getElementById('barFill');
  var count=document.getElementById('usesCount');
  var main=document.getElementById('main');
  if(used>=MAX){
    main.innerHTML='<div class="expired"><h2>⛔ Expirado</h2><p>Este enlace ha alcanzado su límite de '+MAX+' accesos.<br>Contacta al remitente para obtener un nuevo enlace.</p></div>';
    return;
  }
  used++;
  localStorage.setItem(KEY,used);
  var remaining=MAX-used;
  var pct=((MAX-used)/MAX*100).toFixed(0);
  fill.style.width=pct+'%';
  count.textContent=remaining+' de '+MAX+' usos restantes';
  if(remaining===0){
    count.textContent='⚠️ Último acceso — esta página ya no estará disponible.';
    count.style.color='${cfg.accentColor}';
  }
})();
</script>
</body>
</html>`;
}

// ─── Mini live preview ───────────────────────────────────────────────
function LivePreview({ cfg }) {
  const p = cfg.primaryColor;
  const a = cfg.accentColor;
  const bg = cfg.bgColor;
  const txt = cfg.textColor;
  const remaining = cfg.maxUses - 1;
  const pct = Math.round(((cfg.maxUses - 1) / cfg.maxUses) * 100);

  return (
    <div style={{
      background: bg,
      borderRadius: 16,
      padding: "1.5rem",
      fontFamily: "'Space Mono', monospace",
      position: "relative",
      overflow: "hidden",
      minHeight: 320,
      border: "1px solid rgba(255,255,255,0.07)",
    }}>
      {/* Gradient bg effect */}
      <div style={{
        position: "absolute", inset: 0,
        background: `radial-gradient(ellipse 80% 60% at 50% 0%,${p}18,transparent 70%)`,
        pointerEvents: "none",
      }} />
      {/* Top accent line */}
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, height: 2,
        background: `linear-gradient(90deg,transparent,${p},${a},transparent)`,
      }} />

      <div style={{ position: "relative", zIndex: 1 }}>
        {/* Badge */}
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 6,
          padding: "3px 10px",
          border: `1px solid ${p}`,
          borderRadius: 999, fontSize: 9, letterSpacing: "0.12em",
          color: p, fontWeight: 700, marginBottom: "1rem",
          background: `${p}18`,
        }}>
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: p, display: "inline-block" }} />
          {cfg.badgeText}
        </div>

        {/* Title */}
        <div style={{
          fontFamily: "'Syne', sans-serif",
          fontSize: "1.3rem", fontWeight: 800,
          lineHeight: 1.15, marginBottom: "0.4rem",
          background: `linear-gradient(135deg,${txt},${p})`,
          WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
        }}>{cfg.title}</div>

        <div style={{ fontSize: ".72rem", color: p, marginBottom: ".7rem", opacity: .9 }}>
          {cfg.subtitle}
        </div>

        <div style={{ fontSize: ".74rem", lineHeight: 1.65, opacity: .65, color: txt, marginBottom: "1rem" }}>
          {cfg.description.length > 100 ? cfg.description.slice(0, 100) + "…" : cfg.description}
        </div>

        {/* Uses bar */}
        <div style={{ marginBottom: "1rem" }}>
          <div style={{ fontSize: ".6rem", letterSpacing: ".1em", opacity: .45, color: txt, marginBottom: 4, textTransform: "uppercase" }}>
            Accesos disponibles
          </div>
          <div style={{ height: 4, background: "rgba(255,255,255,.08)", borderRadius: 9, overflow: "hidden" }}>
            <div style={{ width: `${pct}%`, height: "100%", borderRadius: 9, background: `linear-gradient(90deg,${p},${a})` }} />
          </div>
          <div style={{ fontSize: ".62rem", opacity: .5, color: txt, marginTop: 4 }}>
            {remaining} de {cfg.maxUses} usos restantes
          </div>
        </div>

        {/* CTA */}
        <div style={{
          display: "block", width: "100%",
          padding: ".7rem 1rem",
          background: `linear-gradient(135deg,${p},${a})`,
          borderRadius: 10, color: "#000",
          fontFamily: "'Syne', sans-serif",
          fontSize: ".85rem", fontWeight: 700, textAlign: "center",
        }}>{cfg.ctaText}</div>
      </div>
    </div>
  );
}

// ─── Field row ────────────────────────────────────────────────────────
function Field({ label, type = "text", value, onChange, hint }) {
  return (
    <div style={{ marginBottom: "1rem" }}>
      <label style={{ display: "block", fontSize: ".68rem", letterSpacing: ".08em", color: "#7a8aa0", marginBottom: 4, textTransform: "uppercase", fontFamily: "'Space Mono', monospace" }}>
        {label}
      </label>
      {type === "textarea" ? (
        <textarea
          value={value}
          onChange={e => onChange(e.target.value)}
          rows={3}
          style={inputStyle}
        />
      ) : (
        <input
          type={type}
          value={value}
          onChange={e => onChange(e.target.value)}
          style={inputStyle}
        />
      )}
      {hint && <div style={{ fontSize: ".6rem", color: "#4a5568", marginTop: 3 }}>{hint}</div>}
    </div>
  );
}

const inputStyle = {
  width: "100%", padding: ".55rem .75rem",
  background: "rgba(255,255,255,.04)",
  border: "1px solid rgba(255,255,255,.08)",
  borderRadius: 8, color: "#e2e8f0",
  fontFamily: "'Space Mono', monospace", fontSize: ".78rem",
  outline: "none", resize: "vertical",
};

function ColorRow({ label, value, onChange }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: ".7rem" }}>
      <input type="color" value={value} onChange={e => onChange(e.target.value)}
        style={{ width: 32, height: 32, border: "none", background: "none", cursor: "pointer", borderRadius: 6 }} />
      <div>
        <div style={{ fontSize: ".65rem", color: "#7a8aa0", letterSpacing: ".06em", textTransform: "uppercase" }}>{label}</div>
        <div style={{ fontSize: ".72rem", color: "#a0aec0", fontFamily: "'Space Mono', monospace" }}>{value}</div>
      </div>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────
export default function QRLandingBuilder() {
  const [cfg, setCfg] = useState(defaultConfig);
  const [tab, setTab] = useState("content"); // content | design | qr
  const [downloaded, setDownloaded] = useState(false);
  const [qrLoaded, setQrLoaded] = useState(false);

  const set = (key) => (val) => setCfg(prev => ({ ...prev, [key]: val }));

  const qrColor = cfg.primaryColor.replace("#", "");
  const qrBg = cfg.bgColor.replace("#", "");
  const qrSrc = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(cfg.hostUrl || "https://ejemplo.com")}&color=${qrColor}&bgcolor=${qrBg}&margin=12&qzone=2`;

  const handleDownload = useCallback(() => {
    const html = generateLandingHTML(cfg);
    const blob = new Blob([html], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "landing-temporal.html";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setDownloaded(true);
    setTimeout(() => setDownloaded(false), 2500);
  }, [cfg]);

  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = FONTS + `
      * { box-sizing: border-box; }
      input[type=color]::-webkit-color-swatch-wrapper { padding: 0; }
      input[type=color]::-webkit-color-swatch { border: none; border-radius: 5px; }
      input:focus, textarea:focus { border-color: rgba(0,255,170,.35) !important; box-shadow: 0 0 0 2px rgba(0,255,170,.1); }
      ::-webkit-scrollbar { width: 4px; } ::-webkit-scrollbar-track { background: transparent; } ::-webkit-scrollbar-thumb { background: rgba(255,255,255,.1); border-radius: 4px; }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  const tabs = [
    { id: "content", label: "✏️ Contenido" },
    { id: "design", label: "🎨 Diseño" },
    { id: "qr", label: "📲 QR & Exportar" },
  ];

  return (
    <div style={{
      minHeight: "100vh",
      background: "#07090f",
      color: "#e2e8f0",
      fontFamily: "'Space Mono', monospace",
      display: "flex",
      flexDirection: "column",
      padding: "1.5rem",
      gap: "1.5rem",
    }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <div style={{
          width: 40, height: 40, borderRadius: 10,
          background: `linear-gradient(135deg,${cfg.primaryColor},${cfg.accentColor})`,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: "1.2rem", flexShrink: 0,
        }}>⚡</div>
        <div>
          <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "1.05rem", lineHeight: 1.1 }}>
            QR Landing Builder
          </div>
          <div style={{ fontSize: ".65rem", color: "#4a6070", letterSpacing: ".05em" }}>
            PÁGINAS TEMPORALES CON LÍMITE DE ACCESO
          </div>
        </div>
        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 6, fontSize: ".65rem" }}>
          <div style={{
            padding: "3px 8px", borderRadius: 6,
            background: "rgba(0,255,170,.1)", border: "1px solid rgba(0,255,170,.2)",
            color: cfg.primaryColor, letterSpacing: ".05em",
          }}>
            MAX {cfg.maxUses} USOS
          </div>
        </div>
      </div>

      {/* Layout */}
      <div style={{ display: "flex", gap: "1.5rem", flex: 1, minHeight: 0 }}>

        {/* LEFT: Editor panel */}
        <div style={{
          flex: "0 0 340px",
          background: "rgba(255,255,255,.02)",
          border: "1px solid rgba(255,255,255,.06)",
          borderRadius: 16,
          display: "flex", flexDirection: "column",
          overflow: "hidden",
        }}>
          {/* Tabs */}
          <div style={{ display: "flex", borderBottom: "1px solid rgba(255,255,255,.06)" }}>
            {tabs.map(t => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                style={{
                  flex: 1, padding: ".7rem .3rem",
                  background: tab === t.id ? "rgba(255,255,255,.05)" : "transparent",
                  border: "none", color: tab === t.id ? "#e2e8f0" : "#4a6070",
                  fontSize: ".65rem", cursor: "pointer",
                  borderBottom: tab === t.id ? `2px solid ${cfg.primaryColor}` : "2px solid transparent",
                  transition: "all .2s", letterSpacing: ".05em",
                  fontFamily: "'Space Mono', monospace",
                }}
              >{t.label}</button>
            ))}
          </div>

          {/* Panel content */}
          <div style={{ flex: 1, overflowY: "auto", padding: "1.25rem" }}>
            {tab === "content" && (
              <>
                <Field label="Título principal" value={cfg.title} onChange={set("title")} />
                <Field label="Subtítulo" value={cfg.subtitle} onChange={set("subtitle")} />
                <Field label="Descripción" type="textarea" value={cfg.description} onChange={set("description")} />
                <Field label="Texto del badge" value={cfg.badgeText} onChange={set("badgeText")} hint="Aparece en la etiqueta superior" />
                <Field label="Texto del botón CTA" value={cfg.ctaText} onChange={set("ctaText")} />
                <Field label="URL del botón CTA" value={cfg.ctaUrl} onChange={set("ctaUrl")} hint="A donde lleva el clic" />
                <Field label="Texto del pie" value={cfg.footerText} onChange={set("footerText")} />
                <div style={{ marginBottom: "1rem" }}>
                  <label style={{ display: "block", fontSize: ".68rem", letterSpacing: ".08em", color: "#7a8aa0", marginBottom: 4, textTransform: "uppercase" }}>
                    Límite de usos
                  </label>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <input
                      type="range" min={1} max={20} value={cfg.maxUses}
                      onChange={e => set("maxUses")(parseInt(e.target.value))}
                      style={{ flex: 1, accentColor: cfg.primaryColor }}
                    />
                    <div style={{
                      minWidth: 36, textAlign: "center", fontWeight: 700,
                      color: cfg.primaryColor, fontSize: ".9rem",
                    }}>{cfg.maxUses}</div>
                  </div>
                </div>
              </>
            )}

            {tab === "design" && (
              <>
                <div style={{ fontSize: ".68rem", color: "#7a8aa0", letterSpacing: ".08em", textTransform: "uppercase", marginBottom: ".75rem" }}>Colores</div>
                <ColorRow label="Color primario" value={cfg.primaryColor} onChange={set("primaryColor")} />
                <ColorRow label="Color acento" value={cfg.accentColor} onChange={set("accentColor")} />
                <ColorRow label="Fondo" value={cfg.bgColor} onChange={set("bgColor")} />
                <ColorRow label="Texto" value={cfg.textColor} onChange={set("textColor")} />

                <div style={{ marginTop: "1.25rem", fontSize: ".68rem", color: "#7a8aa0", letterSpacing: ".08em", textTransform: "uppercase", marginBottom: ".75rem" }}>Presets</div>
                {[
                  { name: "Cyber", p: "#00ffaa", a: "#ff3cac", bg: "#070711", txt: "#e8eaf6" },
                  { name: "Solar", p: "#ffd700", a: "#ff6b35", bg: "#0d0a03", txt: "#fff8e1" },
                  { name: "Aurora", p: "#7c3aed", a: "#06b6d4", bg: "#030712", txt: "#f0f4ff" },
                  { name: "Coral", p: "#ff6b6b", a: "#feca57", bg: "#1a0a08", txt: "#ffe0d0" },
                ].map(preset => (
                  <button
                    key={preset.name}
                    onClick={() => setCfg(prev => ({ ...prev, primaryColor: preset.p, accentColor: preset.a, bgColor: preset.bg, textColor: preset.txt }))}
                    style={{
                      display: "inline-flex", alignItems: "center", gap: 8,
                      padding: ".35rem .75rem", borderRadius: 8, cursor: "pointer",
                      background: "rgba(255,255,255,.04)", border: "1px solid rgba(255,255,255,.07)",
                      color: "#a0b0c0", fontSize: ".7rem", marginRight: 6, marginBottom: 6,
                      fontFamily: "'Space Mono', monospace",
                    }}
                  >
                    <span style={{ display: "flex", gap: 3 }}>
                      {[preset.p, preset.a].map((c, i) => (
                        <span key={i} style={{ width: 10, height: 10, borderRadius: "50%", background: c }} />
                      ))}
                    </span>
                    {preset.name}
                  </button>
                ))}
              </>
            )}

            {tab === "qr" && (
              <>
                <div style={{ marginBottom: "1.25rem" }}>
                  <Field
                    label="URL donde alojarás la página"
                    value={cfg.hostUrl}
                    onChange={set("hostUrl")}
                    hint="El QR apuntará a esta dirección"
                  />
                  <div style={{
                    padding: ".75rem", borderRadius: 8,
                    background: "rgba(255,200,0,.05)", border: "1px solid rgba(255,200,0,.15)",
                    fontSize: ".68rem", color: "#a09040", lineHeight: 1.6,
                  }}>
                    💡 Descarga el HTML → súbelo a tu hosting, GitHub Pages, Netlify, o cualquier servidor → pega la URL aquí.
                  </div>
                </div>

                {/* QR Preview */}
                <div style={{ textAlign: "center", marginBottom: "1.25rem" }}>
                  <div style={{
                    display: "inline-block",
                    padding: 12, borderRadius: 14,
                    background: cfg.bgColor,
                    border: `2px solid ${cfg.primaryColor}40`,
                    position: "relative",
                  }}>
                    {!qrLoaded && (
                      <div style={{ width: 220, height: 220, display: "flex", alignItems: "center", justifyContent: "center", color: "#4a6070", fontSize: ".75rem" }}>
                        Generando QR...
                      </div>
                    )}
                    <img
                      src={qrSrc}
                      alt="Código QR"
                      width={220}
                      height={220}
                      onLoad={() => setQrLoaded(true)}
                      style={{ display: qrLoaded ? "block" : "none", borderRadius: 6 }}
                    />
                  </div>
                  <div style={{ fontSize: ".65rem", color: "#4a6070", marginTop: 8 }}>
                    Escanea para probar la URL configurada
                  </div>
                </div>

                {/* Download button */}
                <button
                  onClick={handleDownload}
                  style={{
                    width: "100%", padding: ".85rem",
                    background: downloaded
                      ? "rgba(0,255,170,.15)"
                      : `linear-gradient(135deg,${cfg.primaryColor},${cfg.accentColor})`,
                    border: downloaded ? `1px solid ${cfg.primaryColor}` : "none",
                    borderRadius: 10,
                    color: downloaded ? cfg.primaryColor : "#000",
                    fontFamily: "'Syne', sans-serif", fontSize: ".9rem", fontWeight: 700,
                    cursor: "pointer", transition: "all .3s", letterSpacing: ".02em",
                  }}
                >
                  {downloaded ? "✅ Descargado!" : "⬇ Descargar landing-temporal.html"}
                </button>

                <div style={{ marginTop: "1rem", fontSize: ".65rem", color: "#4a6070", lineHeight: 1.8 }}>
                  <div>📋 Pasos para usar:</div>
                  <div style={{ paddingLeft: "1rem", marginTop: 4 }}>
                    1. Descarga el archivo HTML<br/>
                    2. Súbelo a tu hosting/servidor<br/>
                    3. Copia la URL pública<br/>
                    4. Pégala arriba ↑ y el QR se actualiza<br/>
                    5. Comparte el QR — se desactivará tras {cfg.maxUses} {cfg.maxUses === 1 ? "uso" : "usos"}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* RIGHT: Preview */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "1rem" }}>
          <div style={{
            fontSize: ".65rem", color: "#4a6070", letterSpacing: ".1em", textTransform: "uppercase",
            display: "flex", alignItems: "center", gap: 8,
          }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#00ffaa", display: "inline-block" }} />
            Vista previa en tiempo real
          </div>

          <LivePreview cfg={cfg} />

          {/* Stats strip */}
          <div style={{
            display: "grid", gridTemplateColumns: "1fr 1fr 1fr",
            gap: ".75rem",
          }}>
            {[
              { label: "Límite de usos", value: cfg.maxUses, icon: "🔢" },
              { label: "Uso #1 activa", value: "Barra visible", icon: "📊" },
              { label: "Tras el límite", value: "Auto-expira", icon: "⛔" },
            ].map(({ label, value, icon }) => (
              <div key={label} style={{
                background: "rgba(255,255,255,.02)", border: "1px solid rgba(255,255,255,.06)",
                borderRadius: 10, padding: ".75rem",
              }}>
                <div style={{ fontSize: ".85rem", marginBottom: 4 }}>{icon}</div>
                <div style={{ fontSize: ".65rem", color: "#4a6070", marginBottom: 2 }}>{label}</div>
                <div style={{ fontSize: ".78rem", color: cfg.primaryColor, fontWeight: 700 }}>{value}</div>
              </div>
            ))}
          </div>

          {/* How it works */}
          <div style={{
            background: "rgba(255,255,255,.02)", border: "1px solid rgba(255,255,255,.06)",
            borderRadius: 12, padding: "1rem 1.25rem",
            fontSize: ".68rem", color: "#5a7080", lineHeight: 1.8,
          }}>
            <div style={{ color: "#7a9ab0", fontWeight: 700, marginBottom: ".5rem", letterSpacing: ".06em" }}>
              ⚙️ CÓMO FUNCIONA EL LÍMITE
            </div>
            El contador usa <code style={{ color: cfg.primaryColor }}>localStorage</code> del navegador. Cada vez que alguien abre la página, se registra el acceso. Tras alcanzar el máximo configurado, la página muestra automáticamente el mensaje de expiración. Cada dispositivo/navegador tiene su propio contador.
          </div>
        </div>
      </div>
    </div>
  );
}
