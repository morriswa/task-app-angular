// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.
import package_settings from '../../package.json'

export const environment = {
  production: false,
  api : "http://localhost:8080/tasks/dev/",
  auth : {
    "domain" : "dev-9deub659.us.auth0.com",
    "clientId" : "D82AElolOXM7YOl9sIxVl8ipGuztaT04",
    "audience" : "http://localhost:8080/tasks/dev/",
  },
  app_version: package_settings.version
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
