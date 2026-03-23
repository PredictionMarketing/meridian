export { BaseConnector } from './base-connector';
export type { ConnectorConfig, ConnectorStatus, SyncFrequency, LineageLevel } from './base-connector';

export { SlackConnector, createSlackConnector } from './slack.connector';
export type { SlackPersonaMap } from './slack.connector';
