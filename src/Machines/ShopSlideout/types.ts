import { ExtendedShop } from '../../utils/types';

export const EventTypes = {
  SHOP_GET: 'done.invoke.shop-slideout-get-service' as const
};

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
  type: typeof EventTypes.SHOP_GET;
  data: ResponsePayload;
};

export type DataEvent = CloseEvent | OpenEvent | ResponseEvent;

export type DataContext = {
  shop: ExtendedShop | null;
};

export type DataArgs = [DataContext, DataEvent];
