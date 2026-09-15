import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  signal,
  untracked,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { PROVIDER_LABELS, PROVIDERS, Provider } from '../../shared/models/cost.model';
import { currentMonth, formatCents, formatMonth, randsToCents } from '../../shared/utils/format';
import { BigNumber } from '../../shared/components/big-number/big-number';
import { TrendBars } from '../../shared/components/trend-bars/trend-bars';
import { CostsFacade } from '../../app/store/costsState/costs.facade';
import { ShellFacade } from '../../app/store/shellState/shell.facade';

/** Costs (spec §5.7): this month's total, breakdown by provider, 6-month trend, manual entry. */
@Component({
  selector: 'app-costs',
  standalone: true,
  imports: [ReactiveFormsModule, BigNumber, TrendBars],
  templateUrl: './costs.html',
  styleUrl: './costs.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CostsPage {
  readonly costs = inject(CostsFacade);
  private readonly shell = inject(ShellFacade);
  private readonly fb = inject(FormBuilder);

  readonly providers = PROVIDERS;
  readonly formatCents = formatCents;
  readonly formError = signal<string | null>(null);

  readonly monthLabel = computed(() => formatMonth(this.costs.month()));

  readonly form = this.fb.nonNullable.group({
    provider: ['netlify' as Provider, Validators.required],
    month: [currentMonth(), [Validators.required, Validators.pattern(/^\d{4}-\d{2}$/)]],
    amount: ['', Validators.required],
  });

  constructor() {
    this.shell.selectProject(null);
    effect(() => {
      this.shell.refreshTick();
      untracked(() => this.costs.load(this.costs.month()));
    });
  }

  providerLabel(p: Provider): string {
    return PROVIDER_LABELS[p];
  }

  onMonth(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.costs.load(value || null);
  }

  submit(): void {
    this.formError.set(null);
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.formError.set('Provider, month and amount are all needed.');
      return;
    }
    const v = this.form.getRawValue();
    const amountCents = randsToCents(v.amount);
    if (amountCents === null || amountCents < 0) {
      this.formError.set('Enter the amount in rands, e.g. 249,00.');
      return;
    }
    this.costs.saveManual({ provider: v.provider, month: v.month, amountCents });
    this.form.patchValue({ amount: '' });
  }
}
