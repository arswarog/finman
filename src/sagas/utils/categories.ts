import { Map } from 'immutable';
import { UUID } from '../../models/common/common.types';
import { ICategory } from '../../models/category/category.types';

export function categoriesMapToList<T extends ICategory>(map: Map<UUID, T>): T[] {
    if (!map)
        return [];

    const list = Array.from(map.values())
                      .map(item => {
                              const parent = item.parent && map.get(item.parent);

                              return {
                                  ...item,
                                  name: parent
                                      ? `${parent.name} / ${item.name}`
                                      : item.name,
                                  parentCategory: parent || null,
                              };
                          },
                      );

    list.sort((a, b) => {
        return a.name < b.name
            ? -1
            : a.name > b.name
                ? 1
                : 0;
    });

    return list;
}
