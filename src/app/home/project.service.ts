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
       return this.timelineTasks.push(task).key;
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
        this.taskQC1Observable=this.database.object(`/QC1/${timelineId}/${taskId}`);
        this.taskQC1Observable.set(QC1);
    }
    getQC1(timelineId,taskId){
        return this.taskQC1Observable=this.database.object(`/QC1/${timelineId}/${taskId}`);
    }
    editqC1(taskId,timelineId,QC1){
        this.database.object(`/QC1/${timelineId}/${taskId}`).update(QC1);
    }
    addQC2(timelineId,taskId,QC2){
        this.taskQC1Observable=this.database.object(`/QC2/${timelineId}/${taskId}`);
        this.taskQC1Observable.set(QC2);
    }
    getQC2(timelineId,taskId){
        return this.taskQC1Observable=this.database.object(`/QC2/${timelineId}/${taskId}`);
    }
    editqC2(taskId,timelineId,QC2){
        this.database.object(`/QC2/${timelineId}/${taskId}`).update(QC2);
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
    //check
    addTimelineTasks(user,assigned_to,projectId,project_name,task_key,dueDate,task_name){
        let x=this.database.object(`userTasks/${user}/managing_projects/${projectId}/projectName`)
            x.set(project_name);
        let y=this.database.object(`userTasks/${user}/managing_projects/${projectId}/staffList/${assigned_to+task_key}`)
            y.set(task_key);
        }
    editTimelineTasks(user_before,user,assigned_to,projectId,task_key){
        let y=this.database.object(`userTasks/${user_before}/managing_projects/${projectId}/staffList/${user_before+task_key}`)
        y.remove();
        let x=this.database.object(`userTasks/${user}/managing_projects/${projectId}/staffList/${assigned_to+task_key}`)
        x.set(task_key);
    }
    addTasksForMe(user,projectId,project_name,task_key,dueDate,task_name){
        let z=this.database.object(`userTasks/${user}/assigned_tasks/${task_key}`)
        z.set({
            start:dueDate,
            content:task_name
        })
    }
    editTasksForMe(user_before,user,projectId,task_key,dueDate,task_name){
        alert(user_before)
        let z=this.database.object(`userTasks/${user_before}/assigned_tasks/${task_key}/`)
        z.remove();
        let x=this.database.object(`userTasks/${user}/assigned_tasks/${task_key}/`)
        x.set({
            start:dueDate,
            content:task_name
        });
    }
    deleteTimeLineTasks(user,projectId,project_name,task_key){
        let y=this.database.object(`userTasks/${user}/managing_projects/${projectId}/staffList/${user+task_key}`)
        y.remove(); 
    }
    deleteTasksForMe(user,task_key){
        let z=this.database.object(`userTasks/${user}/assigned_tasks/${task_key}/`)
        z.remove();
    }
    getUserTasks(userKey){
        return this.database.list(`/userTasks/${userKey}/assigned_tasks`)
    }
    getAllManagers(){
        return this.database.list(`/users`,{
            query:{
                orderByChild:'manager_access',
                equalTo:true
            }
        })
    }
    //end
    getLearningProjects(){
        return this.database.list(`/closeouts`)
    }
    tagUser(projectId,taskId,userId,taskName,dueDate){
        let userObs=this.database.object(`users/${userId}/tagged/${taskId}`);
        userObs.set({task_name:taskName,due_date:dueDate,project_id:projectId,task_id:taskId});
    }
    clearOneNotification(userId,taskId){
        let userObs=this.database.object(`users/${userId}/tagged/${taskId}`);
        userObs.remove();
    }
    getManagerProjects(manager){
       return this.database.list(`projecttimeline`,{
            query:{
                orderByChild:'manager',
                equalTo:manager
            }
        })
    }
}