import {Model} from '@nozbe/watermelondb';
import {field, date, readonly, children} from '@nozbe/watermelondb/decorators';

export class Blueprint extends Model {
  static table = 'blueprints';
  static associations = {
    annotations: {type: 'has_many' as const, foreignKey: 'blueprint_id'},
    layers: {type: 'has_many' as const, foreignKey: 'blueprint_id'},
  };

  @field('title') title!: string;
  @field('description') description?: string;
  @field('image_uri') imageUri!: string;
  @field('thumbnail_uri') thumbnailUri?: string;
  @field('width') width!: number;
  @field('height') height!: number;
  @field('is_favorite') isFavorite!: boolean;

  @readonly @date('created_at') createdAt!: Date;
  @readonly @date('updated_at') updatedAt!: Date;

  @children('annotations') annotations: any;
  @children('layers') layers: any;
}
