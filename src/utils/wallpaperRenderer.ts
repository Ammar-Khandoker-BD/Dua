import { IslamicDua, WallpaperPreset } from '../data/duas';

export interface RenderOptions {
  resolution: { width: number; height: number; label: string };
  dua: IslamicDua;
  additionalDuas?: IslamicDua[];
  layoutMode: 'single' | 'chunks' | 'dual' | 'grid4';
  backgroundSrc: string;
  overlayOpacity: number; // 0.2 to 0.9
  vignette: boolean;
  borderOrnament: boolean;
  designerCredit: string;
  showDesignerCredit: boolean;
  showArabic: boolean;
  showPronunciation: boolean;
  showMeaning: boolean;
  showVirtue: boolean;
  fontSizeScale: number; // 0.8 to 1.3
  arabicFont: 'Amiri' | 'Scheherazade New';
  banglaFont: 'Hind Siliguri' | 'Noto Serif Bengali';
  accentTheme: 'gold' | 'emerald' | 'cyan' | 'rose' | 'amber';
}

export const RESOLUTIONS = [
  { width: 3840, height: 2160, label: '4K Ultra-HD (3840 × 2160)' },
  { width: 2560, height: 1440, label: '2K QHD (2560 × 1440)' },
  { width: 1920, height: 1080, label: 'Full HD (1920 × 1080)' },
];

// Helper to wrap text cleanly on canvas
function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number
): string[] {
  const words = text.split(' ');
  const lines: string[] = [];
  let currentLine = '';

  for (let i = 0; i < words.length; i++) {
    const word = words[i];
    const testLine = currentLine.length === 0 ? word : `${currentLine} ${word}`;
    const metrics = ctx.measureText(testLine);
    if (metrics.width > maxWidth && i > 0) {
      lines.push(currentLine);
      currentLine = word;
    } else {
      currentLine = testLine;
    }
  }
  if (currentLine.length > 0) {
    lines.push(currentLine);
  }
  return lines;
}

// Draw Islamic Corner Arabesque filigree
function drawIslamicCorner(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number,
  rotation: number,
  color: string
) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rotation);
  ctx.strokeStyle = color;
  ctx.fillStyle = color;
  ctx.lineWidth = size * 0.035;

  // L-corner boundary
  ctx.beginPath();
  ctx.moveTo(0, size);
  ctx.lineTo(0, size * 0.3);
  ctx.quadraticCurveTo(0, 0, size * 0.3, 0);
  ctx.lineTo(size, 0);
  ctx.stroke();

  // Secondary inner arch
  ctx.lineWidth = size * 0.02;
  ctx.beginPath();
  ctx.moveTo(size * 0.15, size * 0.7);
  ctx.quadraticCurveTo(size * 0.15, size * 0.15, size * 0.7, size * 0.15);
  ctx.stroke();

  // 8-pointed star accent at the vertex
  const starR = size * 0.08;
  const cx = size * 0.28;
  const cy = size * 0.28;
  ctx.beginPath();
  for (let i = 0; i < 8; i++) {
    const angle = (i * Math.PI) / 4;
    const r = i % 2 === 0 ? starR : starR * 0.5;
    const px = cx + Math.cos(angle) * r;
    const py = cy + Math.sin(angle) * r;
    if (i === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.closePath();
  ctx.fill();

  ctx.restore();
}

export async function renderWallpaperToCanvas(
  canvas: HTMLCanvasElement,
  options: RenderOptions
): Promise<void> {
  const { width, height } = options.resolution;
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  // Wait for fonts to be ready
  if (document.fonts) {
    try {
      await document.fonts.ready;
    } catch {
      // ignore
    }
  }

  // 1. Draw Background Image or Fallback Gradient
  try {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = options.backgroundSrc;

    await new Promise((resolve) => {
      if (img.complete) {
        resolve(true);
      } else {
        img.onload = () => resolve(true);
        img.onerror = () => resolve(false);
      }
    });

    if (img.naturalWidth > 0) {
      // Cover fit
      const scale = Math.max(width / img.naturalWidth, height / img.naturalHeight);
      const drawW = img.naturalWidth * scale;
      const drawH = img.naturalHeight * scale;
      const offsetX = (width - drawW) / 2;
      const offsetY = (height - drawH) / 2;
      ctx.drawImage(img, offsetX, offsetY, drawW, drawH);
    } else {
      // Fallback deep dark Islamic gradient
      const grad = ctx.createLinearGradient(0, 0, width, height);
      grad.addColorStop(0, '#040d12');
      grad.addColorStop(0.5, '#0b1d28');
      grad.addColorStop(1, '#020609');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);
    }
  } catch {
    const grad = ctx.createLinearGradient(0, 0, width, height);
    grad.addColorStop(0, '#021e17');
    grad.addColorStop(0.5, '#062d23');
    grad.addColorStop(1, '#020d0a');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);
  }

  // 2. Darkness & Contrast Scrim Overlay
  ctx.fillStyle = `rgba(3, 7, 18, ${options.overlayOpacity})`;
  ctx.fillRect(0, 0, width, height);

  // 3. Ambient Radial Vignette for maximum text readability in center
  if (options.vignette) {
    const vignette = ctx.createRadialGradient(
      width / 2,
      height / 2,
      Math.min(width, height) * 0.25,
      width / 2,
      height / 2,
      Math.max(width, height) * 0.75
    );
    vignette.addColorStop(0, 'rgba(0, 0, 0, 0)');
    vignette.addColorStop(0.7, 'rgba(0, 0, 0, 0.45)');
    vignette.addColorStop(1, 'rgba(0, 0, 0, 0.85)');
    ctx.fillStyle = vignette;
    ctx.fillRect(0, 0, width, height);
  }

  // Color schemes
  const colorMap = {
    gold: {
      primary: '#fde047',
      goldGlow: 'rgba(250, 204, 21, 0.35)',
      cardBg: 'rgba(15, 23, 42, 0.65)',
      border: 'rgba(234, 179, 8, 0.45)',
      white: '#ffffff',
      subtext: '#e2e8f0',
      highlight: '#fef08a'
    },
    emerald: {
      primary: '#34d399',
      goldGlow: 'rgba(52, 211, 153, 0.35)',
      cardBg: 'rgba(6, 40, 31, 0.65)',
      border: 'rgba(52, 211, 153, 0.4)',
      white: '#ffffff',
      subtext: '#e6fffa',
      highlight: '#a7f3d0'
    },
    cyan: {
      primary: '#38bdf8',
      goldGlow: 'rgba(56, 189, 248, 0.35)',
      cardBg: 'rgba(12, 30, 48, 0.65)',
      border: 'rgba(56, 189, 248, 0.4)',
      white: '#ffffff',
      subtext: '#f0f9ff',
      highlight: '#bae6fd'
    },
    amber: {
      primary: '#fbbf24',
      goldGlow: 'rgba(251, 191, 36, 0.35)',
      cardBg: 'rgba(30, 20, 10, 0.68)',
      border: 'rgba(251, 191, 36, 0.45)',
      white: '#ffffff',
      subtext: '#fef3c7',
      highlight: '#fde68a'
    },
    rose: {
      primary: '#f43f5e',
      goldGlow: 'rgba(244, 63, 94, 0.35)',
      cardBg: 'rgba(35, 12, 20, 0.65)',
      border: 'rgba(244, 63, 94, 0.4)',
      white: '#ffffff',
      subtext: '#ffe4e6',
      highlight: '#fecdd3'
    }
  };

  const theme = colorMap[options.accentTheme] || colorMap.gold;
  const baseScale = width / 3840; // proportional scale for 4K down to 1080p
  const fontMult = options.fontSizeScale * baseScale;

  // 4. Subtle Outer Frame & Corner Arabesques
  if (options.borderOrnament) {
    const margin = 80 * baseScale;
    const cornerSize = 140 * baseScale;

    ctx.strokeStyle = theme.border;
    ctx.lineWidth = 2 * baseScale;
    ctx.strokeRect(margin, margin, width - margin * 2, height - margin * 2);

    // Subtle inner secondary hair-line
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
    ctx.lineWidth = 1 * baseScale;
    const innerM = margin + 18 * baseScale;
    ctx.strokeRect(innerM, innerM, width - innerM * 2, height - innerM * 2);

    // Draw 4 corners
    drawIslamicCorner(ctx, margin, margin, cornerSize, 0, theme.primary);
    drawIslamicCorner(ctx, width - margin, margin, cornerSize, Math.PI / 2, theme.primary);
    drawIslamicCorner(ctx, width - margin, height - margin, cornerSize, Math.PI, theme.primary);
    drawIslamicCorner(ctx, margin, height - margin, cornerSize, -Math.PI / 2, theme.primary);
  }

  // 5. Layout Rendering
  if (options.layoutMode === 'chunks' && options.dua.chunks) {
    renderChunksLayout(ctx, options, width, height, theme, baseScale, fontMult);
  } else if (options.layoutMode === 'dual' && options.additionalDuas && options.additionalDuas.length > 0) {
    renderDualLayout(ctx, options, width, height, theme, baseScale, fontMult);
  } else if (options.layoutMode === 'grid4' && options.additionalDuas && options.additionalDuas.length >= 3) {
    renderGrid4Layout(ctx, options, width, height, theme, baseScale, fontMult);
  } else {
    // Default: Single Hero Dua (e.g. Sayyidul Istighfar)
    renderSingleHeroLayout(ctx, options, width, height, theme, baseScale, fontMult);
  }

  // 6. Watermark / Designer Credit Signature
  if (options.showDesignerCredit && options.designerCredit.trim().length > 0) {
    ctx.save();
    const credY = height - 55 * baseScale;
    const credX = width - 120 * baseScale;

    ctx.font = `600 ${22 * baseScale}px 'Plus Jakarta Sans', sans-serif`;
    ctx.fillStyle = theme.primary;
    ctx.textAlign = 'right';
    ctx.shadowColor = 'rgba(0,0,0,0.8)';
    ctx.shadowBlur = 8 * baseScale;

    // Small star emblem before text
    const textStr = `✦  ${options.designerCredit}`;
    ctx.fillText(textStr, credX, credY);

    // Sub-label "4K Islamic Wallpaper"
    ctx.font = `400 ${15 * baseScale}px 'Plus Jakarta Sans', sans-serif`;
    ctx.fillStyle = 'rgba(255,255,255,0.7)';
    ctx.fillText('Ultra-HD Desktop Wallpaper · সহীহ হাদিস ও নির্ভুল উচ্চারণ', credX, credY + 24 * baseScale);

    ctx.restore();
  }
}

// Single Hero Layout (Centered, majestic, legible for 4K desktop reading)
function renderSingleHeroLayout(
  ctx: CanvasRenderingContext2D,
  options: RenderOptions,
  width: number,
  height: number,
  theme: any,
  baseScale: number,
  fontMult: number
) {
  const { dua } = options;
  const centerX = width / 2;
  const cardW = width * 0.84;
  const startY = height * 0.12;

  // Header Title
  ctx.save();
  ctx.textAlign = 'center';

  // Badge/Pill replacement: Clean editorial title
  ctx.font = `700 ${38 * fontMult}px '${options.banglaFont}', sans-serif`;
  ctx.fillStyle = theme.primary;
  ctx.shadowColor = theme.goldGlow;
  ctx.shadowBlur = 15 * baseScale;
  ctx.fillText(dua.title, centerX, startY);

  // Subtitle
  ctx.font = `400 ${22 * fontMult}px '${options.banglaFont}', sans-serif`;
  ctx.fillStyle = theme.subtext;
  ctx.shadowBlur = 0;
  ctx.fillText(dua.subtitle, centerX, startY + 44 * baseScale);

  // Subtle separator line with center star
  const lineY = startY + 70 * baseScale;
  ctx.strokeStyle = theme.border;
  ctx.lineWidth = 1.5 * baseScale;
  ctx.beginPath();
  ctx.moveTo(centerX - 240 * baseScale, lineY);
  ctx.lineTo(centerX - 30 * baseScale, lineY);
  ctx.moveTo(centerX + 30 * baseScale, lineY);
  ctx.lineTo(centerX + 240 * baseScale, lineY);
  ctx.stroke();

  ctx.fillStyle = theme.primary;
  ctx.font = `${20 * baseScale}px sans-serif`;
  ctx.fillText('۞', centerX, lineY + 6 * baseScale);

  let currentY = lineY + 60 * baseScale;

  // Main Card Container Background
  const cardH = height * 0.68;
  const cardX = (width - cardW) / 2;
  ctx.fillStyle = theme.cardBg;
  ctx.beginPath();
  roundRect(ctx, cardX, currentY - 20 * baseScale, cardW, cardH, 24 * baseScale);
  ctx.fill();
  ctx.strokeStyle = theme.border;
  ctx.lineWidth = 1.5 * baseScale;
  ctx.stroke();

  // Arabic Content
  if (options.showArabic) {
    ctx.font = `700 ${46 * fontMult}px '${options.arabicFont}', serif`;
    ctx.fillStyle = theme.highlight;
    ctx.shadowColor = 'rgba(0,0,0,0.9)';
    ctx.shadowBlur = 10 * baseScale;

    // Wrap Arabic lines
    const maxTextW = cardW - 120 * baseScale;
    const arabicLines = wrapText(ctx, dua.arabic, maxTextW);
    const lineHeight = 76 * fontMult;

    currentY += 24 * baseScale;
    arabicLines.forEach((line) => {
      ctx.fillText(line, centerX, currentY);
      currentY += lineHeight;
    });
    ctx.shadowBlur = 0;
  }

  // Bengali Pronunciation
  if (options.showPronunciation) {
    currentY += 16 * baseScale;
    ctx.font = `600 ${22 * fontMult}px '${options.banglaFont}', sans-serif`;
    ctx.fillStyle = theme.primary;
    ctx.fillText('— বিশুদ্ধ বাংলা উচ্চারণ —', centerX, currentY);
    currentY += 36 * baseScale;

    ctx.font = `500 ${27 * fontMult}px '${options.banglaFont}', sans-serif`;
    ctx.fillStyle = theme.white;
    const maxTextW = cardW - 140 * baseScale;
    const pronunLines = wrapText(ctx, dua.pronunciation, maxTextW);
    const lineHeight = 44 * fontMult;

    pronunLines.forEach((line) => {
      ctx.fillText(line, centerX, currentY);
      currentY += lineHeight;
    });
  }

  // Bengali Meaning
  if (options.showMeaning) {
    currentY += 20 * baseScale;
    ctx.font = `600 ${22 * fontMult}px '${options.banglaFont}', sans-serif`;
    ctx.fillStyle = theme.primary;
    ctx.fillText('— বাংলা অনুবাদ ও অর্থ —', centerX, currentY);
    currentY += 36 * baseScale;

    ctx.font = `400 ${26 * fontMult}px '${options.banglaFont}', sans-serif`;
    ctx.fillStyle = '#f1f5f9';
    const maxTextW = cardW - 140 * baseScale;
    const meaningLines = wrapText(ctx, `"${dua.meaning}"`, maxTextW);
    const lineHeight = 42 * fontMult;

    meaningLines.forEach((line) => {
      ctx.fillText(line, centerX, currentY);
      currentY += lineHeight;
    });
  }

  // Virtue / Hadith Reference Box at Bottom of Card
  if (options.showVirtue) {
    const bottomBoxY = currentY + 24 * baseScale;
    const boxW = cardW - 100 * baseScale;
    const boxX = (width - boxW) / 2;

    ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
    ctx.beginPath();
    roundRect(ctx, boxX, bottomBoxY, boxW, 85 * baseScale, 14 * baseScale);
    ctx.fill();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
    ctx.stroke();

    ctx.font = `600 ${20 * fontMult}px '${options.banglaFont}', sans-serif`;
    ctx.fillStyle = theme.primary;
    ctx.fillText(`ফজিলত ও হাদিস রেফারেন্স (${dua.reference})`, centerX, bottomBoxY + 30 * baseScale);

    ctx.font = `400 ${18 * fontMult}px '${options.banglaFont}', sans-serif`;
    ctx.fillStyle = '#cbd5e1';
    const maxVTextW = boxW - 60 * baseScale;
    const virtueLines = wrapText(ctx, dua.virtue, maxVTextW);
    if (virtueLines.length > 0) {
      ctx.fillText(virtueLines[0], centerX, bottomBoxY + 60 * baseScale);
    }
  }

  ctx.restore();
}

// Chunks Layout (Ideal for step-by-step memorizing from desktop wallpaper)
function renderChunksLayout(
  ctx: CanvasRenderingContext2D,
  options: RenderOptions,
  width: number,
  height: number,
  theme: any,
  baseScale: number,
  fontMult: number
) {
  const { dua } = options;
  const chunks = dua.chunks || [];
  const centerX = width / 2;

  ctx.save();
  ctx.textAlign = 'center';

  // Title
  ctx.font = `700 ${36 * fontMult}px '${options.banglaFont}', sans-serif`;
  ctx.fillStyle = theme.primary;
  ctx.shadowColor = theme.goldGlow;
  ctx.shadowBlur = 12 * baseScale;
  ctx.fillText(`${dua.title} · মুখস্থ করার সহজ ধাপসমূহ`, centerX, height * 0.1);

  ctx.font = `400 ${20 * fontMult}px '${options.banglaFont}', sans-serif`;
  ctx.fillStyle = theme.subtext;
  ctx.shadowBlur = 0;
  ctx.fillText('বাক্যভিত্তিক অর্থ ও উচ্চারণ লক্ষ্য করে সহজেই মুখস্থ সম্পন্ন করুন', centerX, height * 0.1 + 38 * baseScale);

  // Render 7 chunks in a clean dual/staggered presentation or 2-column grid
  const cols = 2;
  const rows = Math.ceil(chunks.length / cols);
  const gridW = width * 0.88;
  const gridStartX = (width - gridW) / 2;
  const gridStartY = height * 0.18;
  const colGap = 30 * baseScale;
  const rowGap = 20 * baseScale;
  const itemW = (gridW - colGap * (cols - 1)) / cols;
  const itemH = (height * 0.72 - rowGap * (rows - 1)) / rows;

  chunks.forEach((chunk, idx) => {
    const col = idx % cols;
    const row = Math.floor(idx / cols);
    const x = gridStartX + col * (itemW + colGap);
    const y = gridStartY + row * (itemH + rowGap);

    // Card background
    ctx.fillStyle = theme.cardBg;
    ctx.beginPath();
    roundRect(ctx, x, y, itemW, itemH, 16 * baseScale);
    ctx.fill();
    ctx.strokeStyle = theme.border;
    ctx.lineWidth = 1.2 * baseScale;
    ctx.stroke();

    // Step Number Badge
    ctx.fillStyle = theme.primary;
    ctx.font = `700 ${18 * fontMult}px 'Plus Jakarta Sans', sans-serif`;
    ctx.textAlign = 'left';
    ctx.fillText(`ধাপ 0${idx + 1}`, x + 24 * baseScale, y + 36 * baseScale);

    // Arabic line
    ctx.textAlign = 'right';
    ctx.font = `700 ${32 * fontMult}px '${options.arabicFont}', serif`;
    ctx.fillStyle = theme.highlight;
    ctx.fillText(chunk.arabic, x + itemW - 24 * baseScale, y + 42 * baseScale);

    // Pronunciation
    ctx.textAlign = 'left';
    ctx.font = `600 ${22 * fontMult}px '${options.banglaFont}', sans-serif`;
    ctx.fillStyle = theme.white;
    const pronunLines = wrapText(ctx, chunk.pronunciation, itemW - 48 * baseScale);
    ctx.fillText(pronunLines[0] || chunk.pronunciation, x + 24 * baseScale, y + 78 * baseScale);

    // Meaning
    ctx.font = `400 ${20 * fontMult}px '${options.banglaFont}', sans-serif`;
    ctx.fillStyle = '#cbd5e1';
    const meaningLines = wrapText(ctx, `অর্থ: ${chunk.meaning}`, itemW - 48 * baseScale);
    ctx.fillText(meaningLines[0] || chunk.meaning, x + 24 * baseScale, y + 114 * baseScale);
  });

  ctx.restore();
}

// Dual Layout (Sayyidul Istighfar + Ayat al-Kursi side by side)
function renderDualLayout(
  ctx: CanvasRenderingContext2D,
  options: RenderOptions,
  width: number,
  height: number,
  theme: any,
  baseScale: number,
  fontMult: number
) {
  const d1 = options.dua;
  const d2 = options.additionalDuas![0];
  const containerW = width * 0.90;
  const colW = (containerW - 40 * baseScale) / 2;
  const startX = (width - containerW) / 2;
  const startY = height * 0.12;
  const colH = height * 0.76;

  [d1, d2].forEach((dua, colIdx) => {
    const x = startX + colIdx * (colW + 40 * baseScale);
    const centerX = x + colW / 2;

    // Card background
    ctx.fillStyle = theme.cardBg;
    ctx.beginPath();
    roundRect(ctx, x, startY, colW, colH, 20 * baseScale);
    ctx.fill();
    ctx.strokeStyle = theme.border;
    ctx.lineWidth = 1.5 * baseScale;
    ctx.stroke();

    ctx.save();
    ctx.textAlign = 'center';

    // Title
    ctx.font = `700 ${32 * fontMult}px '${options.banglaFont}', sans-serif`;
    ctx.fillStyle = theme.primary;
    ctx.fillText(dua.title, centerX, startY + 50 * baseScale);

    ctx.font = `400 ${18 * fontMult}px '${options.banglaFont}', sans-serif`;
    ctx.fillStyle = theme.subtext;
    ctx.fillText(dua.subtitle, centerX, startY + 82 * baseScale);

    // Arabic
    let currY = startY + 140 * baseScale;
    ctx.font = `700 ${34 * fontMult}px '${options.arabicFont}', serif`;
    ctx.fillStyle = theme.highlight;
    const arabicLines = wrapText(ctx, dua.arabic, colW - 60 * baseScale);
    arabicLines.slice(0, 5).forEach((line) => {
      ctx.fillText(line, centerX, currY);
      currY += 52 * fontMult;
    });

    // Pronunciation
    currY += 20 * baseScale;
    ctx.font = `600 ${22 * fontMult}px '${options.banglaFont}', sans-serif`;
    ctx.fillStyle = theme.primary;
    ctx.fillText('উচ্চারণ', centerX, currY);
    currY += 34 * baseScale;

    ctx.font = `500 ${21 * fontMult}px '${options.banglaFont}', sans-serif`;
    ctx.fillStyle = theme.white;
    const pronunLines = wrapText(ctx, dua.pronunciation, colW - 60 * baseScale);
    pronunLines.slice(0, 5).forEach((line) => {
      ctx.fillText(line, centerX, currY);
      currY += 36 * fontMult;
    });

    // Meaning
    currY += 20 * baseScale;
    ctx.font = `600 ${22 * fontMult}px '${options.banglaFont}', sans-serif`;
    ctx.fillStyle = theme.primary;
    ctx.fillText('বাংলা অর্থ', centerX, currY);
    currY += 34 * baseScale;

    ctx.font = `400 ${20 * fontMult}px '${options.banglaFont}', sans-serif`;
    ctx.fillStyle = '#e2e8f0';
    const meaningLines = wrapText(ctx, dua.meaning, colW - 60 * baseScale);
    meaningLines.slice(0, 5).forEach((line) => {
      ctx.fillText(line, centerX, currY);
      currY += 32 * fontMult;
    });

    ctx.restore();
  });
}

// 4 Grid Layout (4 Essential Duas on desktop)
function renderGrid4Layout(
  ctx: CanvasRenderingContext2D,
  options: RenderOptions,
  width: number,
  height: number,
  theme: any,
  baseScale: number,
  fontMult: number
) {
  const all4 = [options.dua, ...(options.additionalDuas || [])].slice(0, 4);
  const containerW = width * 0.90;
  const containerH = height * 0.78;
  const startX = (width - containerW) / 2;
  const startY = height * 0.11;
  const gap = 30 * baseScale;
  const cardW = (containerW - gap) / 2;
  const cardH = (containerH - gap) / 2;

  all4.forEach((dua, idx) => {
    const col = idx % 2;
    const row = Math.floor(idx / 2);
    const x = startX + col * (cardW + gap);
    const y = startY + row * (cardH + gap);
    const centerX = x + cardW / 2;

    ctx.fillStyle = theme.cardBg;
    ctx.beginPath();
    roundRect(ctx, x, y, cardW, cardH, 18 * baseScale);
    ctx.fill();
    ctx.strokeStyle = theme.border;
    ctx.lineWidth = 1.2 * baseScale;
    ctx.stroke();

    ctx.save();
    ctx.textAlign = 'center';

    // Title
    ctx.font = `700 ${26 * fontMult}px '${options.banglaFont}', sans-serif`;
    ctx.fillStyle = theme.primary;
    ctx.fillText(dua.title, centerX, y + 42 * baseScale);

    // Arabic
    ctx.font = `700 ${30 * fontMult}px '${options.arabicFont}', serif`;
    ctx.fillStyle = theme.highlight;
    const arabicLines = wrapText(ctx, dua.arabic, cardW - 50 * baseScale);
    let currY = y + 90 * baseScale;
    arabicLines.slice(0, 3).forEach((line) => {
      ctx.fillText(line, centerX, currY);
      currY += 46 * fontMult;
    });

    // Pronunciation
    ctx.font = `600 ${20 * fontMult}px '${options.banglaFont}', sans-serif`;
    ctx.fillStyle = theme.white;
    const pronunLines = wrapText(ctx, dua.pronunciation, cardW - 50 * baseScale);
    currY += 10 * baseScale;
    pronunLines.slice(0, 3).forEach((line) => {
      ctx.fillText(line, centerX, currY);
      currY += 32 * fontMult;
    });

    // Meaning
    ctx.font = `400 ${18 * fontMult}px '${options.banglaFont}', sans-serif`;
    ctx.fillStyle = '#cbd5e1';
    const meaningLines = wrapText(ctx, `অর্থ: ${dua.meaning}`, cardW - 50 * baseScale);
    currY += 8 * baseScale;
    meaningLines.slice(0, 3).forEach((line) => {
      ctx.fillText(line, centerX, currY);
      currY += 28 * fontMult;
    });

    ctx.restore();
  });
}

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) {
  if (w < 2 * r) r = w / 2;
  if (h < 2 * r) r = h / 2;
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}
