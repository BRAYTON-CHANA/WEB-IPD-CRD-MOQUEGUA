import ExcelJS from 'exceljs';

/**
 * Carga el logo como ArrayBuffer usando fetch
 */
async function loadLogoBuffer() {
  const response = await fetch('/src/app/views/inventario/entradas/utils/logo.png');
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }
  return await response.arrayBuffer();
}

/**
 * Exporta salida y sus activos a Excel con formato profesional IPD
 * Usa exceljs siguiendo estándares del skill xlsx con logo y estilos avanzados
 */
export async function exportarSalidaExcel(salida, activos) {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet(`Salida ${salida.CODIGO_SALIDA}`);

  // Configuración de fuente por defecto (Arial profesional)
  workbook.properties.defaultFont = { name: 'Arial', size: 10 };

  // === LOGO IPD (cargado con fetch) ===
  try {
    const arrayBuffer = await loadLogoBuffer();
    console.log('Logo ArrayBuffer size:', arrayBuffer.byteLength);

    const imageId = workbook.addImage({
      buffer: arrayBuffer,
      extension: 'png',
    });
    console.log('Image ID creado:', imageId);

    // Insertar logo en A1:B3 (3 filas x 2 columnas)
    worksheet.addImage(imageId, {
      tl: { nativeRow: 0, nativeCol: 0 },
      br: { nativeRow: 2, nativeCol: 1 }
    });
    console.log('Logo insertado en A1:B3 (3x2 celdas)');
  } catch (e) {
    console.error('Error al cargar logo IPD:', e);
    // Si falla el logo, dejar espacio en blanco
  }

  // Ajustar alturas de filas para el logo más grande
  worksheet.getRow(1).height = 50;
  worksheet.getRow(2).height = 50;
  worksheet.getRow(3).height = 40;

  // === TÍTULO AL LADO DEL LOGO (C1:G3) ===
  worksheet.mergeCells('C1:G1');
  const tituloCell = worksheet.getCell('C1');
  tituloCell.value = 'NOTA DE SALIDA DEL ALMACÉN';
  tituloCell.font = { bold: true, size: 18, color: { argb: 'DC2626' }, name: 'Arial' }; // Rojo IPD, más grande
  tituloCell.alignment = { horizontal: 'center', vertical: 'center' };

  worksheet.mergeCells('C2:G2');
  const institucionCell = worksheet.getCell('C2');
  institucionCell.value = 'INSTITUTO PERUANO DEL DEPORTE';
  institucionCell.font = { size: 12, color: { argb: 'DC2626' }, name: 'Arial' }; // Rojo IPD
  institucionCell.alignment = { horizontal: 'center', vertical: 'center' };

  worksheet.mergeCells('C3:G3');
  const unidadCell = worksheet.getCell('C3');
  unidadCell.value = 'Unidad Operativa Moquegua';
  unidadCell.font = { size: 11, color: { argb: '6B7280' }, name: 'Arial', italic: true }; // Gris
  unidadCell.alignment = { horizontal: 'center', vertical: 'center' };

  // === SEPARADOR (Fila 4) ===
  worksheet.getRow(4).height = 8;

  // === METADATA EN TABLA ORGANIZADA (Filas 5-6) ===
  const fechaStr = salida.FECHA_EMISION
    ? new Date(salida.FECHA_EMISION).toLocaleDateString('es-PE')
    : '—';

  // Fila 5 - Primera línea de metadata
  worksheet.mergeCells('A5:B5');
  worksheet.getCell('A5').value = `CÓDIGO: ${salida.CODIGO_SALIDA}`;
  worksheet.mergeCells('C5:D5');
  worksheet.getCell('C5').value = `FECHA: ${fechaStr}`;
  worksheet.mergeCells('E5:F5');
  worksheet.getCell('E5').value = `ALMACÉN: ${salida.ALMACEN_NOMBRE || '—'}`;
  worksheet.getCell('G5').value = `TIPO: ${salida.TIPO_SALIDA || '—'}`;

  // Fila 6 - Segunda línea de metadata
  worksheet.mergeCells('A6:C6');
  worksheet.getCell('A6').value = `DESTINATARIO: ${salida.EXTERNO_NOMBRE || 'Sin destinatario'}`;
  worksheet.mergeCells('D6:F6');
  worksheet.getCell('D6').value = `PECOSA: ${salida.NRO_PECOSA || '—'}`;

  // Estilo metadata (fondo gris claro, bordes sutiles)
  [5, 6].forEach(row => {
    ['A', 'B', 'C', 'D', 'E', 'F', 'G'].forEach(col => {
      const cell = worksheet.getCell(`${col}${row}`);
      cell.font = { size: 10, color: { argb: '374151' }, name: 'Arial' };
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'F9FAFB' } };
      cell.border = {
        top: { style: 'thin', color: { argb: 'E5E7EB' } },
        bottom: { style: 'thin', color: { argb: 'E5E7EB' } }
      };
      cell.alignment = { horizontal: 'left', vertical: 'center' };
    });
  });
  worksheet.getRow(5).height = 25;
  worksheet.getRow(6).height = 25;

  // === SEPARADOR (Fila 7) ===
  worksheet.getRow(7).height = 10;

  // === SUBTÍTULO SECCIÓN (Fila 8) ===
  worksheet.mergeCells('A8:G8');
  const seccionCell = worksheet.getCell('A8');
  seccionCell.value = 'DETALLE DE ACTIVOS SALIENTES';
  seccionCell.font = { bold: true, size: 12, color: { argb: 'FFFFFF' }, name: 'Arial' }; // Texto blanco
  seccionCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'DC2626' } }; // Rojo IPD
  seccionCell.alignment = { horizontal: 'center', vertical: 'middle' };
  seccionCell.border = {
    top: { style: 'medium', color: { argb: 'DC2626' } },
    bottom: { style: 'medium', color: { argb: 'DC2626' } }
  };
  worksheet.getRow(8).height = 28;

  // === HEADERS DE TABLA (Fila 9) ===
  const headers = ['N°', 'CÓDIGO PATRIMONIAL', 'NOMBRE DEL ITEM', 'MARCA', 'MODELO', 'CANT', 'ESTADO'];
  const headerRow = worksheet.getRow(9);

  headers.forEach((header, idx) => {
    const cell = headerRow.getCell(idx + 1);
    cell.value = header;
    cell.font = { bold: true, color: { argb: 'FFFFFF' }, name: 'Arial', size: 10 };
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'DC2626' } }; // Rojo IPD
    cell.alignment = { horizontal: 'center', vertical: 'middle' };
    cell.border = {
      top: { style: 'thin', color: { argb: 'FFFFFF' } },
      bottom: { style: 'thin', color: { argb: 'FFFFFF' } },
      left: { style: 'thin', color: { argb: 'DC2626' } },
      right: { style: 'thin', color: { argb: 'DC2626' } }
    };
  });
  headerRow.height = 28;

  // === DATOS DE ACTIVOS (Filas 10 en adelante) ===
  const startRow = 10;
  activos.forEach((activo, idx) => {
    const rowNum = startRow + idx;
    const row = worksheet.getRow(rowNum);

    const cantidad = activo.CANTIDAD || 1;

    row.getCell(1).value = idx + 1; // N°
    row.getCell(2).value = activo.COD_PATRIMONIAL || activo.CODIGOS_COMBINADOS || 'S/C';
    row.getCell(3).value = activo.ITEM_NOMBRE_COMPLETO || '—';
    row.getCell(4).value = activo.MARCA || '—';
    row.getCell(5).value = activo.MODELO || '—';
    row.getCell(6).value = cantidad;
    row.getCell(7).value = activo.ESTADO_CONSERVADO || '—';

    // Colores alternados para filas (zebra striping)
    const fillColor = idx % 2 === 0 ? 'FFFFFF' : 'F9FAFB';

    // Aplicar estilos a todas las celdas de la fila
    for (let col = 1; col <= 7; col++) {
      const cell = row.getCell(col);

      // Fondo alternado
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: fillColor } };

      // Bordes
      cell.border = {
        top: { style: 'thin', color: { argb: 'E5E7EB' } },
        bottom: { style: 'thin', color: { argb: 'E5E7EB' } },
        left: { style: 'thin', color: { argb: 'E5E7EB' } },
        right: { style: 'thin', color: { argb: 'E5E7EB' } }
      };

      // Alineación
      if (col === 1 || col === 6) {
        cell.alignment = { horizontal: 'center', vertical: 'middle' };
      } else {
        cell.alignment = { horizontal: 'left', vertical: 'middle' };
      }

      // Fuente
      cell.font = { name: 'Arial', size: 10, color: { argb: '374151' } };
    }
  });

  // === FILA DE TOTALES ===
  const totalRowNum = startRow + activos.length;
  const totalRow = worksheet.getRow(totalRowNum);

  const totalCantidad = activos.reduce((sum, a) => sum + (a.CANTIDAD || 1), 0);

  totalRow.getCell(1).value = 'TOTALES';
  totalRow.getCell(6).value = totalCantidad;

  // Estilo fila totales (gris, bold)
  for (let col = 1; col <= 7; col++) {
    const cell = totalRow.getCell(col);
    cell.font = { bold: true, name: 'Arial', size: 11, color: { argb: '1F2937' } };
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'E5E7EB' } };
    cell.border = {
      top: { style: 'medium', color: { argb: '6B7280' } },
      bottom: { style: 'medium', color: { argb: '6B7280' } },
      left: { style: 'thin', color: { argb: '9CA3AF' } },
      right: { style: 'thin', color: { argb: '9CA3AF' } }
    };
    cell.alignment = { vertical: 'middle' };

    if (col === 1) {
      cell.alignment = { horizontal: 'left', vertical: 'middle' };
    } else if (col === 6) {
      cell.alignment = { horizontal: 'center', vertical: 'middle' };
    }
  }

  // === FOOTER (Fila después de totales) ===
  const footerRowNum = totalRowNum + 2;
  worksheet.mergeCells(`A${footerRowNum}:G${footerRowNum}`);
  const footerCell = worksheet.getCell(`A${footerRowNum}`);
  footerCell.value = `Documento generado el ${new Date().toLocaleDateString('es-PE')} - Sistema de Inventario IPD`;
  footerCell.font = { italic: true, size: 9, color: { argb: '9CA3AF' }, name: 'Arial' };
  footerCell.alignment = { horizontal: 'center' };

  // === CONFIGURAR ANCHOS DE COLUMNA ===
  // Columnas A y B para el logo (mismo ancho para mantener proporción)
  worksheet.getColumn(1).width = 15;  // Col A - Logo columna 1
  worksheet.getColumn(2).width = 15;  // Col B - Logo columna 2
  worksheet.getColumn(3).width = 40; // NOMBRE DEL ITEM - más ancho
  worksheet.getColumn(4).width = 18; // MARCA
  worksheet.getColumn(5).width = 18; // MODELO
  worksheet.getColumn(6).width = 10;  // CANT
  worksheet.getColumn(7).width = 15; // ESTADO

  // === GENERAR Y DESCARGAR ARCHIVO ===
  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  });

  const fechaArchivo = new Date().toISOString().split('T')[0];
  const nombreArchivo = `Salida_${salida.CODIGO_SALIDA}_${fechaArchivo}.xlsx`;

  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = nombreArchivo;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(link.href);
}
