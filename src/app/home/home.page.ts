import { ApplicationRef, Component, OnDestroy, OnInit } from '@angular/core';
import { OSNotificationPayload } from '@ionic-native/onesignal/ngx';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { PushService } from '../services/push.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit, OnDestroy {
  public messages: OSNotificationPayload[] = [];
  private unsubscribe$: Subject<void> = new Subject<void>();
  constructor(
    public pushService: PushService,
    private applicationRef: ApplicationRef
  ) {}

  ngOnInit(): void {
    this.pushService.pushListener
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((notification: OSNotificationPayload) => {
        this.messages.unshift(notification);
        // Fuerza el ciclo de deteccion de cambios
        this.applicationRef.tick();
      });
  }

  async ionViewWillEnter() {
    this.messages = await this.pushService.getMessages();
  }

  public async deleteMessages() {
    await this.pushService.deleteMessages();
    this.messages = [];
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
