import {Model, Relation} from '@nozbe/watermelondb';
import {field, date, readonly, immutableRelation} from '@nozbe/watermelondb/decorators';
import {Project} from './Project';
import {Blueprint} from './Blueprint';

export class ProjectBlueprint extends Model {
  static table = 'project_blueprints';
  static associations = {
    projects: {type: 'belongs_to' as const, key: 'project_id'},
    blueprints: {type: 'belongs_to' as const, key: 'blueprint_id'},
  };

  @field('project_id') projectId!: string;
  @field('blueprint_id') blueprintId!: string;
  @field('order') order!: number;

  @readonly @date('created_at') createdAt!: Date;

  @immutableRelation('projects', 'project_id') project!: Relation<Project>;
  @immutableRelation('blueprints', 'blueprint_id') blueprint!: Relation<Blueprint>;
}
