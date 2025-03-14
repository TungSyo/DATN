import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root',
})
export class RefreshTokenService {
    private hubConnection!: signalR.HubConnection;

    private baseUrl = environment.baseSignLRUrl;
    public startConnection() {
        this.hubConnection = new signalR.HubConnectionBuilder()
            .withUrl(this.baseUrl + `/hubs/refresh-token-hub`, {
                skipNegotiation: true,
                transport: signalR.HttpTransportType.WebSockets,
                withCredentials: true,
            })
            .build();

        this.hubConnection
            .start()
            .then(() => console.log('Connection started'))
            .catch((err) =>
                console.log('Error while starting connection: ' + err)
            );
    }

    public addActivityListener(callback: (activity: any) => void) {
        this.hubConnection.on('RefreshToken', callback);
    }
    public addActivityChangeRoleListener(callback: (activity: any) => void) {
        this.hubConnection.on('RefreshTokenByRole', callback);
    }
}
