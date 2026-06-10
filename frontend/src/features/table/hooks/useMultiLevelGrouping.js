import { useMemo } from 'react';

/**
 * Custom hook para agrupar datos multinivel según configuración
 * @param {Array} data - Datos a agrupar
 * @param {Array} levelConfigs - Configuración de niveles
 * @returns {Array} Datos agrupados
 */
export const useMultiLevelGrouping = (data, levelConfigs) => {
  return useMemo(() => {
    if (!levelConfigs.length || !data.length) return [];

    const groupByFields = levelConfigs.map(config => config.field);
    
    const group = (items, level = 0) => {
      if (level >= levelConfigs.length) return items;
      
      const config = levelConfigs[level];
      const validHeaders = config.headers?.filter(h => h && h.title) || [];
      const field = config.field || (validHeaders[0]?.title);
      
      if (!field) {
        console.warn(`TableMultiLevel: Nivel ${level + 1} no tiene field ni headers válidos definidos`);
        return items;
      }
      
      const isLastLevel = level + 1 >= levelConfigs.length;
      const groups = new Map();
      
      items.forEach(item => {
        // Skip fila si la PK del nivel es null (LEFT JOIN sin datos en cualquier nivel)
        const boundColumn = config.boundColumn;
        if (boundColumn && (item[boundColumn] === null || item[boundColumn] === undefined)) {
          return;
        }
        
        const key = item[field] !== null && item[field] !== undefined ? item[field] : 'Sin valor';
        if (!groups.has(key)) {
          groups.set(key, {
            key,
            value: item[field] || 'Sin valor',
            field,
            level: level + 1,
            config: { ...config, headers: validHeaders },
            rows: []
          });
        }
        groups.get(key).rows.push(item);
      });
      
      return Array.from(groups.values()).map(groupItem => {
        // Agregar visible al config basado en count de rows
        const hasValidRows = groupItem.rows.length > 0;
        groupItem.config.visible = hasValidRows;
        
        if (isLastLevel) {
          return { ...groupItem, children: null };
        }
        
        const children = group(groupItem.rows, level + 1);
        
        // Si el grupo tiene rows pero children está vacío (todos los items del último nivel eran null)
        // crear un grupo dummy con visible = false y marcar el grupo como hasNullChildren
        if (groupItem.rows.length > 0 && children.length === 0) {
          const nextConfig = levelConfigs[level + 1];
          const nextValidHeaders = nextConfig.headers?.filter(h => h && h.title) || [];
          return {
            ...groupItem,
            hasNullChildren: true, // Marcar para renderizado especial
            children: [{
              key: 'null-group',
              value: 'null',
              field: nextConfig.field || nextValidHeaders[0]?.title,
              level: level + 2,
              config: { ...nextConfig, headers: nextValidHeaders, visible: false },
              rows: []
            }]
          };
        }
        
        return { ...groupItem, children };
      });
    };
    
    return group(data);
  }, [data, levelConfigs]);
};
