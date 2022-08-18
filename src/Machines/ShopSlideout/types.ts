import { ExtendedShop } from '../../utils/types';

export enum EventType {
  ShopGet = 'done.invoke.shop-slideout-get-service'
}

type CloseEvent = {
  type: 'CLOSE';
};

type OpenEvent = {
  type: 'OPEN';
  language: string;
  id: string;
};

export type ResponsePayload = { response: ExtendedShop[] };
type ResponseEvent = {
  type: EventType.ShopGet;
  data: ResponsePayload;
};

export type DataEvent = CloseEvent | OpenEvent | ResponseEvent;

export type DataContext = {
  shop: ExtendedShop | null;
};

export type DataArgs = [DataContext, DataEvent];
