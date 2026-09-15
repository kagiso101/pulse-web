import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { formatCount } from '../../utils/format';

const W = 100;
const H = 32;
const PAD = 2;

/** Inline SVG line + soft area for a short daily series. Stretches to its container. */
@Component({
  selector: 'pl-sparkline',
  standalone: true,
  templateUrl: './sparkline.html',
  styleUrl: './sparkline.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Sparkline {
  readonly points = input.required<number[]>();
  readonly label = input('trend');

  readonly viewBox = `0 0 ${W} ${H}`;

  private readonly coords = computed(() => {
    const pts = this.points().filter((n) => Number.isFinite(n));
    if (pts.length === 0) return [];
    if (pts.length === 1) pts.push(pts[0]);
    const max = Math.max(...pts);
    const min = Math.min(...pts);
    const span = max - min || 1;
    const stepX = (W - PAD * 2) / (pts.length - 1);
    return pts.map((v, i) => ({
      x: PAD + i * stepX,
      y: H - PAD - ((v - min) / span) * (H - PAD * 2),
    }));
  });

  readonly linePath = computed(() =>
    this.coords()
      .map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x.toFixed(2)} ${p.y.toFixed(2)}`)
      .join(' '),
  );

  readonly areaPath = computed(() => {
    const c = this.coords();
    if (c.length === 0) return '';
    const first = c[0];
    const last = c[c.length - 1];
    return `${this.linePath()} L${last.x.toFixed(2)} ${H} L${first.x.toFixed(2)} ${H} Z`;
  });

  readonly isEmpty = computed(() => this.coords().length === 0);
  readonly ariaLabel = computed(() => {
    const pts = this.points();
    if (pts.length === 0) return `${this.label()}: no data`;
    return `${this.label()}: ${pts.length} points, latest ${formatCount(pts[pts.length - 1])}`;
  });
}
