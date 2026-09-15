import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Copy, LucideAngularModule, Pencil, Plus } from 'lucide-angular';
import { AlertRule, CHANNEL_LABELS, CHANNELS, Channel } from '../../shared/models/alert.model';
import {
  PROJECT_KIND_LABELS,
  PROJECT_KINDS,
  Project,
  ProjectKind,
  ProjectUpsert,
} from '../../shared/models/project.model';
import { CONNECTOR_FLAGS, NotificationChannel } from '../../shared/models/settings.model';
import { relativeTime } from '../../shared/utils/format';
import { injectNow } from '../../shared/utils/now';
import { NotificationService } from '../../shared/services/notification.service';
import { AlertsFacade } from '../../app/store/alertsState/alerts.facade';
import { AuthFacade } from '../../app/store/authState/auth.facade';
import { NoticesFacade } from '../../app/store/noticesState/notices.facade';
import { ProjectsFacade } from '../../app/store/projectsState/projects.facade';
import { SettingsFacade } from '../../app/store/settingsState/settings.facade';
import { ShellFacade } from '../../app/store/shellState/shell.facade';

/** Which alert kinds carry a numeric threshold worth editing. */
const THRESHOLD_KINDS = new Set(['email_failures', 'site_down']);

/** Settings (spec §5.10). */
@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule, LucideAngularModule],
  templateUrl: './settings.html',
  styleUrl: './settings.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingsPage {
  readonly settings = inject(SettingsFacade);
  readonly alerts = inject(AlertsFacade);
  readonly projects = inject(ProjectsFacade);
  readonly notices = inject(NoticesFacade);
  readonly auth = inject(AuthFacade);
  private readonly shell = inject(ShellFacade);
  private readonly notify = inject(NotificationService);
  private readonly fb = inject(FormBuilder);

  readonly icons = { copy: Copy, edit: Pencil, plus: Plus };
  readonly channels = CHANNELS;
  readonly channelLabels = CHANNEL_LABELS;
  readonly kinds = PROJECT_KINDS;
  readonly kindLabels = PROJECT_KIND_LABELS;

  private readonly now = injectNow();

  readonly connectorChips = computed(() => {
    const s = this.settings.settings();
    return CONNECTOR_FLAGS.map((f) => ({ label: f.label, on: s ? s[f.key] === true : null }));
  });

  readonly noticeRows = computed(() =>
    this.notices.items().map((n) => ({ ...n, when: relativeTime(n.createdAt, this.now()) })),
  );

  // ---- project registry form ----
  readonly formOpen = signal(false);
  readonly editingId = signal<string | null>(null);
  readonly editingName = computed(() => {
    const id = this.editingId();
    return id ? (this.projects.items().find((p) => p.id === id)?.name ?? '') : '';
  });

  readonly form = this.fb.nonNullable.group({
    slug: ['', [Validators.required, Validators.pattern(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)]],
    name: ['', Validators.required],
    kind: ['client_site' as ProjectKind, Validators.required],
    siteUrl: [''],
    ga4PropertyId: [''],
    ga4MeasurementId: [''],
    apiHealthUrl: [''],
    netlifySiteId: [''],
    cloudRunService: [''],
    githubRepos: [''],
    color: [''],
    sortOrder: [100],
    active: [true],
  });

  constructor() {
    this.shell.selectProject(null);
    this.settings.load();
    this.alerts.loadRules();
  }

  // ---- notification channel ----
  onChannel(channel: NotificationChannel): void {
    if (this.settings.settings()?.notificationChannel !== channel) {
      this.settings.setNotificationChannel(channel);
    }
  }

  // ---- alert rules ----
  hasThreshold(rule: AlertRule): boolean {
    return rule.threshold !== null || THRESHOLD_KINDS.has(rule.kind);
  }

  toggleRule(rule: AlertRule): void {
    this.alerts.updateRule(rule.id, {
      enabled: !rule.enabled,
      threshold: rule.threshold,
      channel: rule.channel,
    });
  }

  onThreshold(rule: AlertRule, event: Event): void {
    const raw = (event.target as HTMLInputElement).value;
    const threshold = raw === '' ? null : Number(raw);
    if (threshold !== null && !Number.isFinite(threshold)) return;
    if (threshold !== rule.threshold) {
      this.alerts.updateRule(rule.id, { enabled: rule.enabled, threshold, channel: rule.channel });
    }
  }

  onRuleChannel(rule: AlertRule, event: Event): void {
    const channel = (event.target as HTMLSelectElement).value as Channel;
    if (channel !== rule.channel) {
      this.alerts.updateRule(rule.id, {
        enabled: rule.enabled,
        threshold: rule.threshold,
        channel,
      });
    }
  }

  // ---- registry ----
  startAdd(): void {
    this.editingId.set(null);
    this.form.reset({ kind: 'client_site', sortOrder: 100, active: true });
    this.formOpen.set(true);
  }

  startEdit(p: Project): void {
    this.editingId.set(p.id);
    this.form.reset({
      slug: p.slug,
      name: p.name,
      kind: p.kind,
      siteUrl: p.siteUrl ?? '',
      ga4PropertyId: p.ga4PropertyId ?? '',
      ga4MeasurementId: p.ga4MeasurementId ?? '',
      apiHealthUrl: p.apiHealthUrl ?? '',
      netlifySiteId: p.netlifySiteId ?? '',
      cloudRunService: p.cloudRunService ?? '',
      githubRepos: p.githubRepos.join(', '),
      color: p.color ?? '',
      sortOrder: p.sortOrder,
      active: p.active,
    });
    this.formOpen.set(true);
  }

  cancelForm(): void {
    this.formOpen.set(false);
    this.editingId.set(null);
  }

  submitForm(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const v = this.form.getRawValue();
    const body: ProjectUpsert = {
      slug: v.slug.trim(),
      name: v.name.trim(),
      kind: v.kind,
      siteUrl: v.siteUrl.trim() || null,
      ga4PropertyId: v.ga4PropertyId.trim() || null,
      ga4MeasurementId: v.ga4MeasurementId.trim() || null,
      apiHealthUrl: v.apiHealthUrl.trim() || null,
      netlifySiteId: v.netlifySiteId.trim() || null,
      cloudRunService: v.cloudRunService.trim() || null,
      githubRepos: v.githubRepos
        .split(/[,\n]/)
        .map((r) => r.trim())
        .filter(Boolean),
      color: v.color.trim() || null,
      sortOrder: Number(v.sortOrder) || 0,
      active: v.active,
    };
    const id = this.editingId();
    if (id) this.projects.update(id, body);
    else this.projects.create(body);
    this.cancelForm();
  }

  deactivate(p: Project): void {
    if (
      window.confirm(
        `Deactivate ${p.name}? Its pill disappears; snapshots are kept. You can re-activate it by editing it.`,
      )
    ) {
      this.projects.deactivate(p.id);
    }
  }

  // ---- client view tokens ----
  tokenFor(projectId: string) {
    const t = this.projects.tokenResult();
    return t && t.projectId === projectId ? t : null;
  }

  generateToken(p: Project): void {
    if (
      !p.hasClientViewToken ||
      window.confirm(`Replace ${p.name}'s client link? The current link stops working immediately.`)
    ) {
      this.projects.generateToken(p.id);
    }
  }

  revokeToken(p: Project): void {
    if (window.confirm(`Revoke ${p.name}'s client link? Anyone holding it loses access.`)) {
      this.projects.revokeToken(p.id);
    }
  }

  selectAll(event: FocusEvent): void {
    (event.target as HTMLInputElement).select();
  }

  async copy(text: string): Promise<void> {
    try {
      await navigator.clipboard.writeText(text);
      this.notify.success('Copied', 'The client link is on your clipboard.');
    } catch {
      this.notify.warning('Could not copy', 'Select the link and copy it by hand.');
    }
  }
}
