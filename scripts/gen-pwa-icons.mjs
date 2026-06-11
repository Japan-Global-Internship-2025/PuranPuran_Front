// favicon.svg 로부터 PWA 아이콘 PNG들을 생성합니다.
// 실행: node scripts/gen-pwa-icons.mjs
import sharp from "sharp";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const pub = resolve(__dirname, "..", "public");
const svg = readFileSync(resolve(pub, "favicon.svg"));
const BRAND = "#FF871E";

async function run() {
  // 표준 아이콘 (투명 배경 유지) — 192 / 512
  for (const size of [192, 512]) {
    await sharp(svg, { density: 512 })
      .resize(size, size, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .png()
      .toFile(resolve(pub, `pwa-${size}x${size}.png`));
  }

  // 마스커블 아이콘 — 브랜드색으로 가득 채우고 로고를 80% 크기로 중앙 배치 (안전영역 확보)
  const inner = Math.round(512 * 0.8);
  const logo = await sharp(svg, { density: 512 }).resize(inner, inner, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } }).png().toBuffer();
  await sharp({ create: { width: 512, height: 512, channels: 4, background: BRAND } })
    .composite([{ input: logo, gravity: "center" }])
    .png()
    .toFile(resolve(pub, "maskable-512x512.png"));

  // iOS 홈 화면 아이콘 — 투명 없이 브랜드색 배경 (180x180)
  const appleInner = Math.round(180 * 0.86);
  const appleLogo = await sharp(svg, { density: 512 }).resize(appleInner, appleInner, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } }).png().toBuffer();
  await sharp({ create: { width: 180, height: 180, channels: 4, background: BRAND } })
    .composite([{ input: appleLogo, gravity: "center" }])
    .png()
    .toFile(resolve(pub, "apple-touch-icon.png"));

  console.log("PWA icons generated in public/: pwa-192x192.png, pwa-512x512.png, maskable-512x512.png, apple-touch-icon.png");
}

run().catch((e) => { console.error(e); process.exit(1); });
