import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { LayoutGrid, LucideAngularModule, Rocket, Settings, Users, Wallet } from 'lucide-angular';

/** All · Prospects · Costs · Deploys · Settings — bottom tabs on phone, left rail on desktop. */
@Component({
  selector: 'pl-bottom-nav',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, LucideAngularModule],
  templateUrl: './bottom-nav.html',
  styleUrl: './bottom-nav.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BottomNav {
  readonly items = [
    { path: '/', label: 'All', icon: LayoutGrid, exact: true },
    { path: '/prospects', label: 'Prospects', icon: Users, exact: false },
    { path: '/costs', label: 'Costs', icon: Wallet, exact: false },
    { path: '/deploys', label: 'Deploys', icon: Rocket, exact: false },
    { path: '/settings', label: 'Settings', icon: Settings, exact: false },
  ];
}
