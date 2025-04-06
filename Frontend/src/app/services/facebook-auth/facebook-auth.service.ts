import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environment/environment';
import { HttpClient } from '@angular/common/http';
declare const FB: any;

@Injectable({
  providedIn: 'root'
})
export class FacebookAuthService {

  constructor() {
    FB.init({
      appId: environment.FACEBOOK_ID,
      cookie: true,
      xfbml: true,
      version: 'v12.0'
    });
  }

  http = inject(HttpClient);
  
  withFacebook(): Promise<any> {
    return new Promise((resolve, reject) => {
      FB.login((response: any) => {
        if (response.authResponse) {
          // console.log(response.authResponse.accessToken);         
          resolve(response.authResponse);
        } else {
          reject('User cancelled login or did not fully authorize.');
        }
      }, {
        scope: 'public_profile,email',  // Comma-separated without spaces
        return_scopes: true
      });
    });
  }

  // getFacebookUserData(fields: string = 'id,name,email,picture'): Promise<any> {
  //   return new Promise((resolve, reject) => {
  //     FB.api('/me', { fields }, (response: any) => {
  //       if (response && !response.error) {
  //         console.log(response); 
  //         resolve(response);
  //       } else {
  //         reject(response.error);
  //       }
  //     });
  //   });
  // }

  signUpWithFacebook(token: any) {
    return this.http.post(environment.API_URL_AUTH + 'facebookSignUp', token);
  }

  loginWithFacebook(token: any) {
    return this.http.post(environment.API_URL_AUTH + 'userFacebookLogin', token);
  }

  captainLoginWithFacebook(token: any) {
    return this.http.post(environment.API_URL_AUTH + 'captainFacebookLogin', token);
  }
}
