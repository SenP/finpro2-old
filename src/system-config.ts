"use strict";

// SystemJS configuration file, see links for more information
// https://github.com/systemjs/systemjs
// https://github.com/systemjs/systemjs/blob/master/docs/config-api.md

/***********************************************************************************************
 * User Configuration.
 **********************************************************************************************/
/** Map relative paths to URLs. */
const map: any = {
      // angular bundles
      '@angular/core':                      'vendor/@angular/core/bundles/core.umd.js',
      '@angular/common':                    'vendor/@angular/common/bundles/common.umd.js',
      '@angular/compiler':                  'vendor/@angular/compiler/bundles/compiler.umd.js',
      '@angular/platform-browser':          'vendor/@angular/platform-browser/bundles/platform-browser.umd.js',
      '@angular/platform-browser-dynamic':  'vendor/@angular/platform-browser-dynamic/bundles/platform-browser-dynamic.umd.js',
      '@angular/http':                      'vendor/@angular/http/bundles/http.umd.js',
      '@angular/router':                    'vendor/@angular/router/bundles/router.umd.js',
      '@angular/forms':                     'vendor/@angular/forms/bundles/forms.umd.js',
      // dependencies
      'angular2-highcharts':          'vendor/angular2-highcharts/dist',
      'highcharts/highstock.src':     'vendor/angular2-highcharts/dist/highstock.js',
      'ng2-bootstrap/ng2-bootstrap':  'vendor/ng2-bootstrap',
      'moment':                       'vendor/moment/moment.js'
};

/** User packages configuration. */
const packages: any = {
      'angular2-highcharts':          { main: 'index', format: 'cjs', defaultExtension: 'js' },
      'ng2-bootstrap/ng2-bootstrap':  { main: 'ng2-bootstrap', format: 'cjs', defaultExtension: 'js' },
      'moment':                       { format: 'cjs' }
};

////////////////////////////////////////////////////////////////////////////////////////////////
/***********************************************************************************************
 * Everything underneath this line is managed by the CLI.
 **********************************************************************************************/
const barrels: string[] = [
  // Thirdparty barrels.
  'rxjs',

  // App specific barrels.
  'app',
  'app/fptest',
  'app/common',
  'app/dashboard',
  'app/navbar',
  'app/watchlist'
  /** @cli-barrel */
];

const cliSystemConfigPackages: any = {};
barrels.forEach((barrelName: string) => {
  cliSystemConfigPackages[barrelName] = { main: 'index' };
});

/** Type declaration for ambient System. */
declare var System: any;

// Apply the CLI SystemJS configuration.
System.config({
  map: {
    'rxjs': 'vendor/rxjs',
    'main': 'main.js'
  },
  packages: cliSystemConfigPackages
});

// Apply the user's configuration.
System.config({ map, packages });
