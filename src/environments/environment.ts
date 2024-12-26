// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  stripe_token: 'pk_test_51OXnbzHafjd0gJ8NRzxGQNzEfRi7Kq3mmzQ9XeRRrfDDAS9XpwG4QQ1OlfvW7KATUQxlc18jFAvqQtvhnfPwxw5m008hhXIKQc',
  paypal_token: 'PAYPAL_TOKEN',

  baseUrl: 'http://localhost:3010/api/shop',
  returnUrl: 'http://localhost:54725'
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
