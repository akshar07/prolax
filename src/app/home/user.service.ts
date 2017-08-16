import { Injectable } from '@angular/core';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { AuthService } from '../auth.service';

@Injectable()
export class UserService {
    users: FirebaseListObservable<any[]>;
    database: AngularFireDatabase;

    constructor(
        db: AngularFireDatabase,
        public authService: AuthService
    ) { 
       this.database=db; 
    }
    usersArray:Array<any>
    getUsers(){
        this.users = this.database.list('/users')
        return this.users;
    }
}