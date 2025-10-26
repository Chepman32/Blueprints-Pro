import {Model} from '@nozbe/watermelondb';
import {field, date, readonly, children} from '@nozbe/watermelondb/decorators';

export class Project extends Model {
  static table = 'projects';
  static associations = {
    project_blueprints: {type: 'has_many' as const, foreignKey: 'project_id'},
  };

  @field('name') name!: string;
  @field('description') description?: string;
  @field('thumbnail_uri') thumbnailUri?: string;
  @field('is_archived') isArchived!: boolean;

  @readonly @date('created_at') createdAt!: Date;
  @readonly @date('updated_at') updatedAt!: Date;

  @children('project_blueprints') projectBlueprints: any;
}
