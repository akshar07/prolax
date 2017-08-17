import { Injectable } from '@angular/core';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';

@Injectable()
export class CommentsService {
    CommentsObs: FirebaseListObservable<any[]>;
    database: AngularFireDatabase;

    constructor(private db:AngularFireDatabase) {
        this.database=db;
    }
    postComment(timelineId,taskId,comment){
        this.CommentsObs=this.database.list(`/projecttimeline/${timelineId}/tasks/${taskId}/comments`);
        this.CommentsObs.push(comment);
    }
    getComments(timelineId,taskId){
        return this.database.list(`/projecttimeline/${timelineId}/tasks/${taskId}/comments`);
    }
}