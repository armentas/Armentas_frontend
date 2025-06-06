// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  stripe_token: 'pk_test_51RHxRbERbT25kIaZNYTsWmzNmUThoPq1kiRgInQtomv84s2s2en08Nftl0mCCZspLzqgWnBz9kruCRHRhZVmwzIy00j3YxewwV',
  paypal_token: 'PAYPAL_TOKEN',

  baseUrl: 'http://localhost:3010/api/shop',
  returnUrl: 'http://localhost:63906'
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
