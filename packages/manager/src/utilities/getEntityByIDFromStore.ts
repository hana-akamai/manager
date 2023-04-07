import { curry } from 'ramda';
import store from 'src/store';

export type EntityType = 'linode' | 'nodebalancer';

/**
 * The store uses different structures for storing entity data. Ideally we would use the
 * same pattern for all entities (items and itemsByID), which would make this logic
 * much simpler.
 *
 * @param entityType
 * @param entityID
 *
 * Usage:
 *
 * getEntityByIDFromStore('linode', 123456) => Linode | undefined
 *
 * The function is curried, so you can make entity-specific functions as needed:
 *
 * const getLinode = getEntityByIDFromStore('linode');
 * getLinode(123456) => Linode | undefined
 */
const _getEntityByIDFromStore = (
  entityType: EntityType,
  entityID: string | number
) => {
  if (!entityType || !entityID) {
    return;
  }
  const _store = store.getState();
  const { linodes } = _store.__resources;
  switch (entityType) {
    case 'linode':
      return linodes.itemsById[entityID];
    default:
      return;
  }
};

export const getEntityByIDFromStore = curry(_getEntityByIDFromStore);
