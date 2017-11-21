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
    getProjects(userId, bool){
        this.projects = this.database.list(`/users/${userId}/projects`,{
            query:{
                orderByChild:"archived",
                equalTo:bool
            }
        })
        return this.projects;
    }
    addProject(project,title,course,members){
    let key= this.database.list(`/projects`).push(project).key;
    members.forEach(member=>{
        this.database.object(`users/${member.key}/projects/${key}`).set({
            name:title,course:course,project_members:members,archived:false
        });
    })
    return key;
    }
    archiveProject(projectId,members){
        let key=projectId;
        members.forEach(member=>{
            this.database.object(`users/${member.key}/projects/${key}`).update({
              archived:true
            });
            this.database.object(`userTasks/${member.key}/${projectId}`).remove();
        })
        return key;
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
    deleteProject(key,members){
        console.log(members)
        this.database.object(`projects/${key}`).remove();
        this.timelineArray=this.database.list(`/projecttimeline`);
        this.timelineArray.remove(key);
        members.forEach(member=>{
            this.database.object(`users/${member}/projects/${key}`).remove();
            this.database.object(`userTasks/${member}/${key}`).remove();
            this.database.object(`users/${member}/tagged/${key}`).remove();
        });
        this.database.object(`/closeouts/${key}`).remove();
        this.database.object(`/projectNotes/${key}`).remove();
        this.database.object(`/task-logs/${key}`).remove();
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
    editNotification(task,user,taskId){
        this.database.object(`users/${user}/tagged/${taskId}`).update(task)
    }
    deleteTask(userId){
        this.taskObs.remove();
        let userObsTask=this.database.object(`users/${userId}/tagged/${this.taskKey}`);
        userObsTask.remove();
        this.database.object(`users/${userId}/tagged/${this.taskKey}add`).remove();
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
    addTasksForMe(user,projectId,project_name,task_key,dueDate,task_name,type){
        let y=this.database.object(`userTasks/${user}/${projectId}/project_name`);
        y.set(project_name)
        let z=this.database.object(`userTasks/${user}/${projectId}/tasks/${task_key}`)
        z.set({
            start:dueDate,
            content:task_name,
            className:type
        })
    }
 
    addTaskNotif(userId, user,projectId, taskId,taskName,dueDate){
        this.database.object(`users/${userId}/tagged/${projectId}/${taskId}`)
            .set({task_name:taskName,due_date:dueDate,project_id:projectId,task_id:taskId,type:true,manager:user})
    }

    editTasksForMe(user_before,user,projectId,task_key,dueDate,task_name,task_type){
      
        let z=this.database.object(`userTasks/${user_before}/${projectId}/tasks/${task_key}/`)
        z.remove();
        let x=this.database.object(`userTasks/${user}/${projectId}/tasks/${task_key}/`)
        x.set({
            start:dueDate,
            content:task_name,
            className:task_type
        });
    }
    deleteTasksForMe(user,task_key,projectId){
      
        let z=this.database.object(`userTasks/${user}/${projectId}/tasks/${task_key}`)
        z.remove();
    }
    getMyTasks(user){
        return this.database.list(`/userTasks/${user}`)
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
    getLearningProjects(searchtext){
        return this.database.list(`/closeouts`,{
            query:{
                orderByChild:'course',
                startAt:searchtext,
                endAt:`${searchtext}\uf8ff`
            }
        })
    }
    tagUser(projectId,taskId,userId,taskName,dueDate,manager,type){
        if(type==false){
            let userObs=this.database.object(`users/${userId}/tagged/${projectId}/${taskId}`);
            userObs.set({task_name:taskName,due_date:dueDate,project_id:projectId,task_id:taskId,manager:manager,type:type});    
        }
        else{
            let userObs=this.database.object(`users/${userId}/tagged/${taskId}add`);
            userObs.set({task_name:taskName,due_date:dueDate,project_id:projectId,task_id:taskId,manager:manager,type:type});    
        }
    }
    clearOneNotification(userId,taskId,projectId,){
        let userObs=this.database.object(`users/${userId}/tagged/${projectId}/${taskId}`);
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
    getImage(user){
        return this.database.object(`users/${user}/imageUrl`)
    }
    getEditProject(key){
       return this.database.object(`projects/${key}`)
    }
    addProjectNote(projectKey,note){
        this.database.list(`projectNotes/${projectKey}`).push(note)
    }
    getProjectnotes(Id){
        return this.database.list(`projectNotes/${Id}`);
    }
    deleteNote(id,noteId){
        this.database.object(`projectNotes/${id}/${noteId}`).remove();
    }
}