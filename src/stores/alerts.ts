import { defineStore } from 'pinia';
import { v4 as generateUUID } from 'uuid';

export interface AlertData {
    key?: string;
    title?: string;
    text: string;
    type?: 'info' | 'success' | 'warning' | 'error';
    closable?: boolean;
    useAutoClose?: boolean;
    autoCloseTimeout?: number;
}

interface AlertsState {
    alerts: AlertData[];
}

export const useAlertsStore = defineStore('alerts', {
    state(): AlertsState {
        return {
            alerts: [],
        };
    },
    actions: {
        addAlert(alert: AlertData) {
            const copiedAlert = { ...alert };
            if (!copiedAlert.key) {
                copiedAlert.key = generateUUID().slice(0, 8);
            }
            this.alerts.push(copiedAlert);
        },
    },
});
