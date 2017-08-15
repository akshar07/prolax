export class Project {
 
  project_number: string="";
  manager: string="";
  title: string="";
  projectStatus:boolean;
  timeline_key:string="";
  client:string="";
  climate_zone:string="";
  combined: string = `${this.manager}${this.project_number}${this.title}`;
  $key:string;
  assigned_to:{assigned_to:""};
}