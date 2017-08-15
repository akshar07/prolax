import { Pipe, PipeTransform } from '@angular/core';
import { Project } from '../home/project';


@Pipe({
    name: 'projectfilter',
    pure: false
})
export class ProjectFilterPipe implements PipeTransform {
    
    transform(items: Project[], filter: Project):Project[] {
      if (!items || !filter) {
      return items;
    }
    return items.filter((item: Project) => this.applyFilter(item, filter));
   
    }
applyFilter(project: Project, filter: Project): boolean {
    for (let field in filter) {
      if (filter[field]) {
       
          if (project[field].toLowerCase().indexOf(filter[field].toLowerCase()) === -1) {
            return false;
          }
      }
    }
    return true;
}
// };
// }
}