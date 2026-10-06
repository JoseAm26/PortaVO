// src/app/core/services/analytics.service.ts

import { Injectable } from '@angular/core';
import { environments } from '../../../environments/environments';

declare global {
  interface Window {
    dataLayer: any[];
    gtag: (...args: any[]) => void;
  }
}

@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {

  private initialized = false;

  init(): void {

    if (this.initialized) {
      return;
    }

    const script = document.createElement('script');
    script.async = true;
    script.src =
      `https://www.googletagmanager.com/gtag/js?id=${environments.googleAnalyticsId}`;

    document.head.appendChild(script);

    window.dataLayer = window.dataLayer || [];

    window.gtag = function () {
      window.dataLayer.push(arguments);
    };

    window.gtag('js', new Date());

    window.gtag(
      'config',
      environments.googleAnalyticsId
    );

    this.initialized = true;
  }

  pageView(url: string): void {

    if (!this.initialized) return;

    window.gtag('event', 'page_view', {
      page_path: url
    });
  }

  event(
    eventName: string,
    params?: Record<string, any>
  ): void {

    if (!this.initialized) return;

    window.gtag('event', eventName, params);
  }
}
