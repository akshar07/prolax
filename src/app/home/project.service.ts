import { Injectable } from '@angular/core';
import { AngularFireDatabase, FirebaseListObservable,FirebaseObjectObservable } from 'angularfire2/database';
import { AuthService } from '../auth.service';
import { Project } from './project';

@Injectable()
export class ProjectService {
    taskQC1Observable: FirebaseObjectObservable<any>;

    taskKey: any;
    timelineKey: any;
    taskObs: FirebaseObjectObservable<any>;
    timelineTasks: FirebaseListObservable<any[]>;
    timelineArray: FirebaseListObservable<any[]>;
    timeline: FirebaseObjectObservable<any>;
    projects: FirebaseListObservable<any[]>;
    database: AngularFireDatabase;

    constructor(
        db: AngularFireDatabase,
        public authService: AuthService
    ) { 
       this.database=db; 
    }
    usersArray:Array<any>
    getProjects(){
        this.projects = this.database.list('/projects')
        return this.projects;
    }
    addProject(project){
       return this.projects.push(project).key
    }
    updateProjectStatus(key,val){
        let projectObj = this.database.object('projects/' + key);
        projectObj.update({
            projectStatus: val
        })
    }
    addTimeline(timeline,key){
        this.timeline = this.database.object(`/projecttimeline/${key}`);
        this.timeline.set(timeline)
    }
    deleteProject(key){
        this.projects.remove(key);
        this.timelineArray=this.database.list(`/projecttimeline`);
        this.timelineArray.remove(key);
        this.database.object(`/closeouts/${key}`).remove();
    }
    getTimeline(timelineId){
        return this.timelineTasks = this.database.list(`/projecttimeline/${timelineId}/tasks`)
    }
    getTimelineInfo(timelineId){
        return this.database.object(`/projecttimeline/${timelineId}`)
    }
    addTasks(task){
        this.timelineTasks.push(task)
    }
    getTask(key,timelineKey){
        this.timelineKey=timelineKey;
        this.taskKey=key;
        this.taskObs=this.database.object(`/projecttimeline/${this.timelineKey}/tasks/${this.taskKey}`);
        return this.taskObs;
    }
    editTask(task){
         this.taskObs.update(task)
    }
    deleteTask(){
        this.taskObs.remove();
    }
    addQC1(timelineId,taskId,QC1){
        this.taskQC1Observable=this.database.object(`/projecttimeline/${timelineId}/tasks/${taskId}/qc1`);
        this.taskQC1Observable.set(QC1);
    }
    getQC1(timelineId,taskId){
        return this.taskQC1Observable=this.database.object(`/projecttimeline/${timelineId}/tasks/${taskId}/qc1`);
    }
    editqC1(taskId,timelineId,QC1){
        this.database.object(`/projecttimeline/${timelineId}/tasks/${taskId}/qc1`).update(QC1);
    }
    addQC2(timelineId,taskId,QC2){
        this.taskQC1Observable=this.database.object(`/projecttimeline/${timelineId}/tasks/${taskId}/qc2`);
        this.taskQC1Observable.set(QC2);
    }
    getQC2(timelineId,taskId){
        return this.taskQC1Observable=this.database.object(`/projecttimeline/${timelineId}/tasks/${taskId}/qc2`);
    }
    editqC2(taskId,timelineId,QC2){
        this.database.object(`/projecttimeline/${timelineId}/tasks/${taskId}/qc2`).update(QC2);
    }
    closeProject(projectId,closeout){
        let closeoutObs=this.database.object(`/closeouts/${projectId}`);
        closeoutObs.set(closeout);
    }
    getCloseout(projectId){
        return this.database.object(`/closeouts/${projectId}`);
    }
    editCloseOut(projectId,closeout){
        let closeoutObs=this.database.object(`/closeouts/${projectId}`);
        closeoutObs.update(closeout);
    }
}