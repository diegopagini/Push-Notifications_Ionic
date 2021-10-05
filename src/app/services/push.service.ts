import { Injectable } from '@angular/core';
import { OneSignal } from '@ionic-native/onesignal/ngx';

@Injectable({
  providedIn: 'root',
})
export class PushService {
  constructor(private oneSignal: OneSignal) {}

  public initialConfiguration() {
    this.oneSignal.startInit(
      '93bbde90-b1b4-4673-9702-544b32890f5b',
      '971278202970'
    );

    this.oneSignal.inFocusDisplaying(
      this.oneSignal.OSInFocusDisplayOption.InAppAlert
    );

    this.oneSignal.handleNotificationReceived().subscribe((noti) => {
      // do something when notification is received
      console.log(`Notificacion recibida`, noti);
    });

    this.oneSignal.handleNotificationOpened().subscribe((noti) => {
      // do something when a notification is opened
      console.log(`Notificacion abierta`, noti);
    });

    this.oneSignal.endInit();
  }
}
