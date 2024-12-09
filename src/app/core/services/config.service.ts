import { isPlatformServer } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Inject, Injectable, makeStateKey, PLATFORM_ID, TransferState } from '@angular/core';
import { BehaviorSubject, firstValueFrom } from 'rxjs';

const CONFIG_KEY = makeStateKey<{ [key: string]: any }>('app-config');

@Injectable({
  providedIn: 'root',
})
export class ConfigService {
  // private config = {};
  private config: { [key: string]: any } = {};

  constructor(private http: HttpClient, private transferState: TransferState,
    @Inject(PLATFORM_ID) private platformId: any) {}

  async loadConfig(): Promise<void> {
    // try {
    //   const data = await this.http
    //     .get<{ [key: string]: any; }>('/assets/config.json')
    //     .toPromise();
    //   if (data) {
    //     this.config = data;
    //   } else {
    //     console.error('No configuration found in config.json');
    //   }
    //   console.log(this.config);
    // } catch (error) {
    //   console.error('Failed to load config:', error);
    //   throw error;
    // }

    if (this.transferState.hasKey(CONFIG_KEY)) {
      this.config = this.transferState.get(CONFIG_KEY, {});
    } else if (isPlatformServer(this.platformId)) {
      try {
        const data = await this.http.get<{ [key: string]: any }>('/assets/config.json').toPromise();
        this.transferState.set(CONFIG_KEY, data || {});
        this.config = data || {};
      } catch (error) {
        console.error('Failed to load config:', error);
      }
    }
    console.log(this.config);
  }

  getConfig(): { [key: string]: any } {
    // console.log(this.config);
    return this.config;
  }
  
}