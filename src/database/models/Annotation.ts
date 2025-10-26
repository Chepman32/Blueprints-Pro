import {Model, Relation} from '@nozbe/watermelondb';
import {field, date, readonly, relation, immutableRelation} from '@nozbe/watermelondb/decorators';
import {Blueprint} from './Blueprint';
import {Layer} from './Layer';

export class Annotation extends Model {
  static table = 'annotations';
  static associations = {
    blueprints: {type: 'belongs_to' as const, key: 'blueprint_id'},
    layers: {type: 'belongs_to' as const, key: 'layer_id'},
  };

  @field('blueprint_id') blueprintId!: string;
  @field('layer_id') layerId!: string;
  @field('type') type!: 'markup' | 'measurement' | 'note';
  @field('data') data!: string; // JSON string
  @field('position_x') positionX!: number;
  @field('position_y') positionY!: number;
  @field('color') color!: string;
  @field('stroke_width') strokeWidth?: number;
  @field('is_visible') isVisible!: boolean;

  @readonly @date('created_at') createdAt!: Date;
  @readonly @date('updated_at') updatedAt!: Date;

  @immutableRelation('blueprints', 'blueprint_id') blueprint!: Relation<Blueprint>;
  @immutableRelation('layers', 'layer_id') layer!: Relation<Layer>;
}
