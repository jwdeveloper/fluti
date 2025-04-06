export class AlertController {
    maxAlerts: number = $state(5);
    displayedAlerts = $derived.by(() => {
        return this.alerts.slice(0, this.maxAlerts);
    });
    alerts: any[] = $state([]);
    isProcessing: boolean = false; // To track if the first alert is being processed


    pushAlertSuccess(message: string) {
        return this.pushAlert(message, 'success')
    }

    pushAlert(message: string, type?: string, time: number = 5000) {
        const alert = {
            id: Math.random().toString(36).substring(7),
            type: type,
            message: message,
            time: time,
        };
        this.alerts.push(alert);
        if (!this.isProcessing) {
            this.processFirstAlert();
        }
    }

    processFirstAlert() {
        if (this.alerts.length > 0) {
            this.isProcessing = true;
            const firstAlert = this.alerts[0];

            setTimeout(() => {
                this.destroy(firstAlert.id);
                this.isProcessing = false;

                // Continue processing the next alert, if any
                this.processFirstAlert();
            }, firstAlert.time);
        }
    }

    destroy(id: string) {
        this.alerts = this.alerts.filter((e) => e.id !== id);
    }
}

const controller = new AlertController();

export const useAlert = () => controller;
