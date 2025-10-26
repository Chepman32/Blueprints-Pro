import {create} from 'zustand';
import {database, Blueprint} from '@database';
import {Q} from '@nozbe/watermelondb';

interface BlueprintStore {
  selectedBlueprint: Blueprint | null;
  setSelectedBlueprint: (blueprint: Blueprint | null) => void;

  blueprints: Blueprint[];
  loadBlueprints: () => Promise<void>;

  createBlueprint: (data: {
    title: string;
    description?: string;
    imageUri: string;
    width: number;
    height: number;
  }) => Promise<Blueprint>;

  updateBlueprint: (
    blueprint: Blueprint,
    data: Partial<{
      title: string;
      description: string;
      isFavorite: boolean;
    }>
  ) => Promise<void>;

  deleteBlueprint: (blueprint: Blueprint) => Promise<void>;

  searchBlueprints: (query: string) => Promise<Blueprint[]>;
}

export const useBlueprintStore = create<BlueprintStore>((set, get) => ({
  selectedBlueprint: null,
  blueprints: [],

  setSelectedBlueprint: (blueprint) => {
    set({selectedBlueprint: blueprint});
  },

  loadBlueprints: async () => {
    const blueprints = await database
      .get<Blueprint>('blueprints')
      .query(Q.sortBy('updated_at', Q.desc))
      .fetch();
    set({blueprints});
  },

  createBlueprint: async (data) => {
    const blueprint = await database.write(async () => {
      return await database.get<Blueprint>('blueprints').create((record) => {
        record.title = data.title;
        record.description = data.description;
        record.imageUri = data.imageUri;
        record.width = data.width;
        record.height = data.height;
        record.isFavorite = false;
      });
    });

    await get().loadBlueprints();
    return blueprint;
  },

  updateBlueprint: async (blueprint, data) => {
    await database.write(async () => {
      await blueprint.update((record) => {
        if (data.title !== undefined) record.title = data.title;
        if (data.description !== undefined) record.description = data.description;
        if (data.isFavorite !== undefined) record.isFavorite = data.isFavorite;
      });
    });

    await get().loadBlueprints();
  },

  deleteBlueprint: async (blueprint) => {
    await database.write(async () => {
      await blueprint.markAsDeleted();
    });

    await get().loadBlueprints();
  },

  searchBlueprints: async (query) => {
    if (!query.trim()) {
      return get().blueprints;
    }

    const blueprints = await database
      .get<Blueprint>('blueprints')
      .query(
        Q.where('title', Q.like(`%${Q.sanitizeLikeString(query)}%`)),
        Q.sortBy('updated_at', Q.desc)
      )
      .fetch();

    return blueprints;
  },
}));
