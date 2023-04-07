import package_settings from '../../package.json'

export const environment = {
  production: true,
  api : "https://api.tasks.morriswa.org/v2/",
  auth : {
    "domain" : "morriswa-auth-prod.us.auth0.com",
    "clientId" : "BrgMAolsi3kcVaIdlDnSXUFxjzpVXOWP",
    "audience" : "https://api.tasks.morriswa.org/v2/"
  },
  app_title: package_settings.name,
  app_version: package_settings.version
};
