import { Injectable } from '@angular/core';

import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';

import { Observable } from 'rxjs/Observable';
import { Router } from '@angular/router';

@Injectable()
export class AuthService {
  auth: firebase.auth.Auth;
  user: Observable<firebase.User>;
  userName: string;
  isLoggedIn: boolean;
  constructor(private firebaseAuth: AngularFireAuth, private router: Router, ) {
    this.user = firebaseAuth.authState;
  }
  signup(email: string, password: string, displayName: string) {
    alert(displayName)
    this.firebaseAuth
      .auth
      .createUserWithEmailAndPassword(email, password)
      .then(user => {
        console.log(user);
        return user.updateProfile({ displayName: displayName })
      })
      .catch(err => {
        alert(`'Something went wrong:',${err.message}`);
      });
  }
  login(email: string, password: string) {
    this.firebaseAuth
      .auth
      .signInWithEmailAndPassword(email, password)
      .then(value => {
        if (this.firebaseAuth.auth) {
          this.userName = value.email;
          if (this.firebaseAuth.auth.currentUser) { this.isLoggedIn = true; }
          this.router.navigate(["home"]);
        }
        else {
          alert('Username or Password is not correct!');
          this.router.navigate([""]);
        }
      })
      .catch(err => {
        alert(`Something went wrong:, ${err.message} 
Please contact the administrator`);
      });
  }
  sendToken() {
    if (this.firebaseAuth.auth.currentUser) {
      return true;
    }
    else {
      return false;
    }
  }
  logout() {
    this.sendToken();
    this.firebaseAuth
      .auth
      .signOut();

    this.router.navigate([""]);
  }
  resetPassword(email) {
    this.auth = firebase.auth();
    this.auth.sendPasswordResetEmail(email).then(function () {
      alert(`email sent to ${email}`)
    }, function (error) {
      alert("try again")
    });
  }
}