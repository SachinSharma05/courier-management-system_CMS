export const MARUTI_PROVIDER_CODE = 'MARUTI';

export const MARUTI_BASE_URL = {
  PROD: 'https://apis.delcaper.com',
  QA: 'https://qaapis.delcaper.com',
  DRS: 'https://devapis.delcaper.com',
};

export const MARUTI_ENDPOINTS = {

    // Login Token / Refresh Token
    LOGIN: '/auth/login',
    REFRESH_TOKEN: '/auth/refresh-token',

    // Serviceability
    ECOMM_SERVICEABILITY: 
        '/fulfillment/public/seller/order/check-ecomm-order-serviceability',
    HYPERLOCAL_SERVICEABILITY: 
        '/fulfillment/public/seller/order/check-feasible',

    // Rate calculation
    ECOMM_RATE_CALCULATION:
        '/fulfillment/rate-card/calculate-rate/ecomm',

    // Tracking
    ECOMM_TRACKING:
        '/fulfillment/public/seller/order/order-tracking',
    HYPERLOCAL_TRACKING:
        '/fulfillment/public/seller/order/order-tracking',

    // Manifest
    ECOMM_CREATE_MANIFEST:
        '/fulfillment/public/seller/order/create-manifest',

    // Cancel Manifest/Order/Shipment
    CANCEL_ORDER:
        '/fulfillment/public/seller/order/cancel-order',

    // Label / Invoice
    ECOMM_LABEL_INVOICE:
        '/fulfillment/public/seller/order/download/label-invoice',

    // Ecomm Ecomm Shipment Booking
    ECOMM_PUSH_ORDER:
        '/fulfillment/public/seller/order/ecomm/push-order',

    // Ecomm Hyperlocal Shipment Booking
    HYPERLOCAL_PUSH_ORDER:
        '/fulfillment/public/seller/order/push-order',

    // DRS API's
    DRS_DELIVERY_STATUS_UPDATE:
        '/cosmo/delivery-status-update',
    CREATE_DRS: '/cosmo/createDrs',
    DRS_SHIPMENT_LIST: '/cosmo/drs-shipment-list',
    VALIDATE_AWBS: '/cosmo/validate-awbs',

    // PRS API's
    CREATE_PRS: '/prs-service/prs',
    PRS_UPDATE_SCANNED_STATUS:
        '/prs-service/status/update-scanned-status',
    PRS_UPDATE_STATUS:
        '/prs-service/status/update-prs-status',
    PRS_GET_ALL_ORDERS: '/prs-service/get-all-orders',
};
