export * from './utility';

import { ServiceWorkerHelper } from './service-worker';
export const ServiceWorkerService = new ServiceWorkerHelper();

import { LocalStorageHelper } from './local-storage';
export const LocalStorageService = new LocalStorageHelper();
export * from './local-storage';

import { Server } from '@/server';
import { AxiosObservable } from 't-axios-rxjs';
export const AxiosService = new AxiosObservable(Server);
