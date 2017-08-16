export class Project {
  project_number: string="";
  manager: string="";
  title: string="";
  projectStatus:boolean=false;
  client:string="";
  climate_zone:string="";
  services:[""];
  assigned_to:[""];
  startDate:string=""
  endDate:string="";
  combined?: string = `${this.manager}${this.project_number}${this.title}`;
}