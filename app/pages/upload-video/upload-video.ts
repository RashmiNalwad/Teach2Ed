/// <reference path="../../../typings/globals/jquery/index.d.ts"/>
import {Component} from '@angular/core';
import {NavController, NavParams, Platform} from 'ionic-angular';
import {CordovaOauth, Google} from 'ng2-cordova-oauth/core';
import {MediaUploader} from './cors-upload.ts';
//import * as $ from 'jquery';

@Component({
  templateUrl: 'build/pages/upload-video/upload-video.html',
})
export class UploadVideoPage {
  videoTitle: string;
  videoDesc: string;
  videoPrivacy: string;

  tags: any;
  categoryId: number;
  videoId: string;
  uploadStartTime: number;

  authenticated: boolean;
  accessToken: string;

  loggedIn: boolean;
  duringUpload: boolean;
  postUpload: boolean;

  cordovaOauth: any;
  constructor(public nav: NavController, navParams: NavParams, private platform: Platform) {
    let browser_clientid = "648097626079-8c4rcmnpij2i1ifpbva2k6b8ehk0h4lm.apps.googleusercontent.com";
    let appScope = ["https://www.googleapis.com/auth/youtube.upload", "https://www.googleapis.com/auth/youtube"];

    this.videoTitle = navParams.get('AssignmentTitle');
    this.videoDesc  = navParams.get('AssignmentDescription');
    this.videoPrivacy = "public"; //https://support.google.com/youtube/answer/157177?hl=en

    this.tags = ['youtube-cors-upload'];
    this.categoryId = 27; //Education
    this.videoId = '';
    this.uploadStartTime = 0;

    this.loggedIn= false;
    this.duringUpload = false;
    this.postUpload = false;

    this.platform = platform;
    this.cordovaOauth = new CordovaOauth(new Google({"clientId": browser_clientid, "appScope": appScope, "redirectUri": "http://localhost/callback"}));
  }

  login(){
    this.platform.ready().then(() => {
        this.cordovaOauth.login().then((success) => {
            this.loggedIn = true;
            this.accessToken = success.access_token;
            this.authenticated = true;
        }, (error) => {
            alert(error);
        });
    });
  }
  handleUploadClicked() {
      var input = <HTMLInputElement>$('#file')[0];
      var file = input.files[0];
      //var file = ($('#file').get(0).files[0]);
      alert("Uploading: "+file.name+" @ "+file.size+" bytes");
      this.uploadFile(file);
  }

  uploadFile(file) {
      var metadata = {
          snippet: {
              title: this.videoTitle,
              description: this.videoDesc,
              tags: this.tags,
              categoryId: this.categoryId
          },
          status: {
              privacyStatus: this.videoPrivacy
          }
      };
      var uploader = new MediaUploader({
          baseUrl: 'https://www.googleapis.com/upload/youtube/v3/videos',
          file: file,
          token: this.accessToken,
          metadata: metadata,
          params: {
              part: Object.keys(metadata).join(',')
          },
          onError: function(data) {
              var message = data;
              // Assuming the error is raised by the YouTube API, data will be
              // a JSON string with error.message set. That may not be the
              // only time onError will be raised, though.
              try {
                  var errorResponse = JSON.parse(data);
                  message = errorResponse.error.message;
              } finally {
                  alert(message);
              }
          }.bind(this),
          onProgress: function(data) {
              var currentTime = Date.now();
              var bytesUploaded = data.loaded;
              var totalBytes = data.total;
              // The times are in millis, so we need to divide by 1000 to get seconds.
              var bytesPerSecond = bytesUploaded / ((currentTime - this.uploadStartTime) / 1000);
              var estimatedSecondsRemaining = (totalBytes - bytesUploaded) / bytesPerSecond;
              var percentageComplete = (bytesUploaded * 100) / totalBytes;

              $('#upload-progress').attr({
                  value: bytesUploaded,
                  max: totalBytes
              });
              $('#percent-transferred').text(percentageComplete);
              $('#bytes-transferred').text(bytesUploaded);
              $('#total-bytes').text(totalBytes);

              this.duringUpload = true;
          }.bind(this),
          onComplete: function(data) {
              var uploadResponse = JSON.parse(data);
              this.videoId = uploadResponse.id;
              $('#video-id').text(this.videoId);
              this.postUpload = true;
              alert("Successfully uploaded video :" + this.videoId);
          }.bind(this)
      });
      // This won't correspond to the *exact* start of the upload, but it should be close enough.
      this.uploadStartTime = Date.now();
      uploader.upload();
  }
}
