import {appSchema, tableSchema} from '@nozbe/watermelondb';

export const schema = appSchema({
  version: 1,
  tables: [
    tableSchema({
      name: 'blueprints',
      columns: [
        {name: 'title', type: 'string'},
        {name: 'description', type: 'string', isOptional: true},
        {name: 'image_uri', type: 'string'},
        {name: 'thumbnail_uri', type: 'string', isOptional: true},
        {name: 'width', type: 'number'},
        {name: 'height', type: 'number'},
        {name: 'is_favorite', type: 'boolean'},
        {name: 'created_at', type: 'number'},
        {name: 'updated_at', type: 'number'},
      ],
    }),
    tableSchema({
      name: 'annotations',
      columns: [
        {name: 'blueprint_id', type: 'string', isIndexed: true},
        {name: 'type', type: 'string'}, // 'markup', 'measurement', 'note'
        {name: 'layer_id', type: 'string', isIndexed: true},
        {name: 'data', type: 'string'}, // JSON string
        {name: 'position_x', type: 'number'},
        {name: 'position_y', type: 'number'},
        {name: 'color', type: 'string'},
        {name: 'stroke_width', type: 'number', isOptional: true},
        {name: 'is_visible', type: 'boolean'},
        {name: 'created_at', type: 'number'},
        {name: 'updated_at', type: 'number'},
      ],
    }),
    tableSchema({
      name: 'layers',
      columns: [
        {name: 'blueprint_id', type: 'string', isIndexed: true},
        {name: 'name', type: 'string'},
        {name: 'color', type: 'string'},
        {name: 'is_visible', type: 'boolean'},
        {name: 'is_locked', type: 'boolean'},
        {name: 'opacity', type: 'number'},
        {name: 'order', type: 'number'},
        {name: 'created_at', type: 'number'},
        {name: 'updated_at', type: 'number'},
      ],
    }),
    tableSchema({
      name: 'projects',
      columns: [
        {name: 'name', type: 'string'},
        {name: 'description', type: 'string', isOptional: true},
        {name: 'thumbnail_uri', type: 'string', isOptional: true},
        {name: 'is_archived', type: 'boolean'},
        {name: 'created_at', type: 'number'},
        {name: 'updated_at', type: 'number'},
      ],
    }),
    tableSchema({
      name: 'project_blueprints',
      columns: [
        {name: 'project_id', type: 'string', isIndexed: true},
        {name: 'blueprint_id', type: 'string', isIndexed: true},
        {name: 'order', type: 'number'},
        {name: 'created_at', type: 'number'},
      ],
    }),
  ],
});
