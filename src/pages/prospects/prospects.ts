import { ChangeDetectionStrategy, Component, effect, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { LucideAngularModule, Plus, Trash2, Upload } from 'lucide-angular';
import {
  PROSPECT_STATUS_LABELS,
  PROSPECT_STATUSES,
  Prospect,
  ProspectStatus,
  ProspectUpsert,
} from '../../shared/models/prospect.model';
import { ProspectsFacade } from '../../app/store/prospectsState/prospects.facade';
import { ShellFacade } from '../../app/store/shellState/shell.facade';

/** Prospects (spec §5.6): cards on phone, table on desktop; pipeline status, next action, notes, CSV import. */
@Component({
  selector: 'app-prospects',
  standalone: true,
  imports: [ReactiveFormsModule, LucideAngularModule],
  templateUrl: './prospects.html',
  styleUrl: './prospects.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProspectsPage {
  readonly prospects = inject(ProspectsFacade);
  private readonly shell = inject(ShellFacade);
  private readonly fb = inject(FormBuilder);

  readonly icons = { plus: Plus, upload: Upload, trash: Trash2 };
  readonly statuses = PROSPECT_STATUSES;
  readonly labels = PROSPECT_STATUS_LABELS;

  readonly showAdd = signal(false);

  readonly addForm = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.maxLength(120)]],
    business: [''],
    phone: [''],
    area: [''],
    hasWebsite: ['' as '' | 'yes' | 'no'],
    status: ['to_contact' as ProspectStatus],
    nextAction: [''],
    nextActionDate: [''],
    notes: [''],
  });

  constructor() {
    this.shell.selectProject(null);
    effect(() => {
      this.shell.refreshTick();
      this.prospects.load();
    });
  }

  isSaving(id: string): boolean {
    return this.prospects.saving().includes(id);
  }

  submitAdd(): void {
    if (this.addForm.invalid) {
      this.addForm.markAllAsTouched();
      return;
    }
    const v = this.addForm.getRawValue();
    const body: ProspectUpsert = {
      name: v.name.trim(),
      business: v.business.trim() || null,
      phone: v.phone.trim() || null,
      area: v.area.trim() || null,
      hasWebsite: v.hasWebsite === '' ? null : v.hasWebsite === 'yes',
      status: v.status,
      nextAction: v.nextAction.trim() || null,
      nextActionDate: v.nextActionDate || null,
      notes: v.notes.trim() || null,
    };
    this.prospects.create(body);
    this.addForm.reset({ status: 'to_contact', hasWebsite: '' });
    this.showAdd.set(false);
  }

  onStatus(p: Prospect, event: Event): void {
    const status = (event.target as HTMLSelectElement).value as ProspectStatus;
    if (status !== p.status) this.prospects.setStatus(p.id, status);
  }

  onNextAction(p: Prospect, event: Event): void {
    const nextAction = (event.target as HTMLInputElement).value.trim() || null;
    if (nextAction !== p.nextAction) {
      this.prospects.setNextAction(p.id, { nextAction, nextActionDate: p.nextActionDate });
    }
  }

  onNextActionDate(p: Prospect, event: Event): void {
    const nextActionDate = (event.target as HTMLInputElement).value || null;
    if (nextActionDate !== p.nextActionDate) {
      this.prospects.setNextAction(p.id, { nextAction: p.nextAction, nextActionDate });
    }
  }

  addNote(p: Prospect): void {
    const note = window.prompt(`Add a note for ${p.name}`);
    if (note && note.trim()) this.prospects.addNote(p.id, note.trim());
  }

  remove(p: Prospect): void {
    if (window.confirm(`Remove ${p.name} from prospects? This cannot be undone.`)) {
      this.prospects.remove(p.id);
    }
  }

  onFile(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (file) this.prospects.importCsv(file);
    input.value = '';
  }

  /** Last non-empty line of the notes (the API appends timestamped lines). */
  notesPreview(p: Prospect): string | null {
    const lines = (p.notes ?? '')
      .split('\n')
      .map((l) => l.trim())
      .filter(Boolean);
    return lines.length ? lines[lines.length - 1] : null;
  }
}
