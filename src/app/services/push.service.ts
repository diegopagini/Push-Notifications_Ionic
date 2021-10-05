import { EventEmitter, Injectable } from '@angular/core';
import {
  OneSignal,
  OSNotification,
  OSNotificationOpenedResult,
  OSNotificationPayload,
} from '@ionic-native/onesignal/ngx';
import { Storage } from '@ionic/storage-angular';

@Injectable({
  providedIn: 'root',
})
export class PushService {
  public messages: OSNotificationPayload[] = [];
  public pushListener: EventEmitter<OSNotificationPayload> =
    new EventEmitter<OSNotificationPayload>();
  private _storage: Storage;

  constructor(private oneSignal: OneSignal, private storage: Storage) {
    this.init();
    this.loadMessages();
  }

  public initialConfiguration() {
    this.oneSignal.startInit(
      '93bbde90-b1b4-4673-9702-544b32890f5b',
      '971278202970'
    );

    this.oneSignal.inFocusDisplaying(
      this.oneSignal.OSInFocusDisplayOption.Notification
    );

    this.oneSignal
      .handleNotificationReceived()
      .subscribe((noti: OSNotification) => {
        // do something when notification is received
        this.notificationRecived(noti);
      });

    this.oneSignal
      .handleNotificationOpened()
      .subscribe(async (noti: OSNotificationOpenedResult) => {
        // do something when a notification is opened
        await this.notificationRecived(noti.notification);
      });

    this.oneSignal.endInit();
  }

  public async getMessages() {
    await this.loadMessages();
    return [...this.messages];
  }

  private async init() {
    const storage = await this.storage.create();
    // eslint-disable-next-line no-underscore-dangle
    this._storage = storage;
  }

  private async notificationRecived(notification: OSNotification) {
    await this.loadMessages();
    const { payload } = notification;
    const pushExists = this.messages.find(
      (push: OSNotificationPayload) =>
        push.notificationID === payload.notificationID
    );
    if (pushExists) {
      return;
    } else {
      this.messages.unshift(payload);
      this.pushListener.emit(payload);
      await this.saveMessages();
    }
  }

  private saveMessages(): void {
    this.storage.set('messages', this.messages);
  }

  private async loadMessages() {
    this.messages = (await this.storage.get('messages')) || [];
    return this.messages;
  }
}
