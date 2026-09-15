import { type } from '@ngrx/signals';
import { eventGroup } from '@ngrx/signals/events';
import { AlertEvent, AlertRule, AlertRuleUpdate } from '../../../shared/models/alert.model';

export const alertsEvents = eventGroup({
  source: 'Alerts',
  events: {
    loadRules: type<void>(),
    loadRulesSuccess: type<AlertRule[]>(),
    loadRulesFailure: type<string>(),

    updateRule: type<{ id: string; body: AlertRuleUpdate }>(),
    updateRuleSuccess: type<AlertRule>(),
    updateRuleFailure: type<string>(),

    loadOpenEvents: type<void>(),
    loadOpenEventsSuccess: type<AlertEvent[]>(),
    loadOpenEventsFailure: type<string>(),

    ack: type<{ id: string }>(),
    ackSuccess: type<AlertEvent>(),
    ackFailure: type<string>(),
  },
});
