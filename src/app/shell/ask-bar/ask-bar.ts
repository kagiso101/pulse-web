import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { ChevronDown, ChevronUp, LucideAngularModule, Send, Square, X } from 'lucide-angular';
import { ASK_SUGGESTIONS } from '../../../shared/models/ask.model';
import { RANGE_LABELS } from '../../../shared/models/range.model';
import { AskFacade } from '../../store/askState/ask.facade';
import { ProjectsFacade } from '../../store/projectsState/projects.facade';
import { SettingsFacade } from '../../store/settingsState/settings.facade';
import { ShellFacade } from '../../store/shellState/shell.facade';

/**
 * Ask (spec §5.9): one input pinned to the bottom of every authenticated view. Scope is the
 * selected project pill + range. Answers stream into the panel above as plain text.
 */
@Component({
  selector: 'pl-ask-bar',
  standalone: true,
  imports: [LucideAngularModule],
  templateUrl: './ask-bar.html',
  styleUrl: './ask-bar.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AskBar {
  readonly ask = inject(AskFacade);
  readonly shell = inject(ShellFacade);
  readonly settings = inject(SettingsFacade);
  private readonly projects = inject(ProjectsFacade);

  readonly icons = { send: Send, stop: Square, close: X, up: ChevronUp, down: ChevronDown };
  readonly suggestions = ASK_SUGGESTIONS;

  readonly draft = signal('');
  readonly showHistory = signal(false);

  readonly enabled = this.settings.askEnabled;

  readonly scopeLabel = computed(() => {
    const slug = this.shell.selectedSlug();
    const project = slug ? this.projects.activeProjects().find((p) => p.slug === slug) : null;
    return `${project?.name ?? 'All projects'} · ${RANGE_LABELS[this.shell.range()]}`;
  });

  readonly canSend = computed(
    () => this.enabled() && this.draft().trim().length > 0 && !this.ask.isStreaming(),
  );

  readonly answerLines = computed(() => this.ask.answer().split('\n'));

  send(question = this.draft()): void {
    if (!this.enabled() || !question.trim()) return;
    this.ask.ask(question, this.shell.selectedSlug(), this.shell.range());
    this.draft.set('');
  }

  onKeydown(event: KeyboardEvent): void {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      if (this.canSend()) this.send();
    }
  }

  onInput(event: Event): void {
    this.draft.set((event.target as HTMLInputElement).value);
  }

  close(): void {
    if (this.ask.isStreaming()) this.ask.cancel();
    this.ask.setPanelOpen(false);
  }
}
