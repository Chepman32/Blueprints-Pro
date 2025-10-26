import {Model, Relation} from '@nozbe/watermelondb';
import {field, date, readonly, children, immutableRelation} from '@nozbe/watermelondb/decorators';
import {Blueprint} from './Blueprint';

export class Layer extends Model {
  static table = 'layers';
  static associations = {
    blueprints: {type: 'belongs_to' as const, key: 'blueprint_id'},
    annotations: {type: 'has_many' as const, foreignKey: 'layer_id'},
  };

  @field('blueprint_id') blueprintId!: string;
  @field('name') name!: string;
  @field('color') color!: string;
  @field('is_visible') isVisible!: boolean;
  @field('is_locked') isLocked!: boolean;
  @field('opacity') opacity!: number;
  @field('order') order!: number;

  @readonly @date('created_at') createdAt!: Date;
  @readonly @date('updated_at') updatedAt!: Date;

  @immutableRelation('blueprints', 'blueprint_id') blueprint!: Relation<Blueprint>;
  @children('annotations') annotations: any;
}
