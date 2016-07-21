/// <reference path="../typings/index.d.ts"/>
import {Component} from '@angular/core';
import {Platform, ionicBootstrap} from 'ionic-angular';
import {StatusBar} from 'ionic-native';
import {TabsPage} from './pages/tabs/tabs';
import { Data } from './providers/data/data';
import {Lib} from './providers/lib/lib';
import { AuthService } from './providers/auth-service/auth-service';
import { ClassService } from './providers/class-service/class-service';
import {HomePage} from './pages/home/home';


@Component({
  template: '<ion-nav [root]="rootPage"></ion-nav>'
})
export class MyApp {

  private rootPage:any;

  constructor(private platform:Platform) {
    this.rootPage = HomePage;//TabsPage;

    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
     // StatusBar.styleDefault();
    	// if(window.cordova && window.cordova.plugins.Keyboard) {
    	  //    cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    	   // }
    });
  }
}

ionicBootstrap(MyApp,[AuthService, ClassService, Data, Lib])
