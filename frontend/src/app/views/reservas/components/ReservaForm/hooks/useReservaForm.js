import { useState, useCallback, useEffect } from 'react';
import { db } from '@/shared/api';

export const useReservaForm = (initialData, onSuccess) => {
  const isEdit = !!initialData;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [conflictos, setConflictos] = useState(null);

  const [solicitanteData, setSolicitanteData] = useState(null);
  const [modoExterno, setModoExterno] = useState('buscar');

  const [nuevoExternoData, setNuevoExternoData] = useState({
    es_persona_juridica: 'natural',
    nombre_o_organizacion: '',
    apellido_o_tipo_sociedad: '',
    dni_ruc: '',
    telefono_contacto: '',
    correo_contacto: '',
    domicilio_ubicacion: '',
    es_menor_de_edad: false,
    tutor_nombre_completo: '',
    tutor_dni: '',
    tutor_telefono: '',
    tutor_parentesco: '',
    emergencia_nombre: '',
    emergencia_telefono: '',
    comentarios: ''
  });

  const getInitialTipo = () => {
    if (initialData?.ID_EXTERNO) return 'EXTERNO';
    if (initialData?.ID_OFICINA) return 'OFICINA';
    if (initialData?.ID_EMPLEADO_RESPONSABLE) return 'EMPLEADO';
    return '';
  };

  const [formData, setFormData] = useState({
    tipo_solicitante: getInitialTipo(),
    id_externo: initialData?.ID_EXTERNO || '',
    id_empleado: initialData?.ID_EMPLEADO_RESPONSABLE || '',
    id_oficina: initialData?.ID_OFICINA || '',
    id_espacio_deportivo: initialData?.ID_ESPACIO_DEPORTIVO || '',
    id_programa: initialData?.ID_PROGRAMA || '',
    notas: initialData?.NOTAS || ''
  });

  const [horarios, setHorarios] = useState(() => {
    if (initialData?.HORARIOS_JSON?.length > 0) {
      return initialData.HORARIOS_JSON.map(h => ({
        fecha: h.fecha,
        hora_inicio: h.hora_inicio,
        hora_fin: h.hora_fin
      }));
    }
    return [{ fecha: '', hora_inicio: '', hora_fin: '' }];
  });

  // Cargar datos iniciales
  useEffect(() => {
    if (initialData?.ID_EXTERNO) loadExternoData(initialData.ID_EXTERNO);
    else if (initialData?.ID_EMPLEADO_RESPONSABLE) loadEmpleadoData(initialData.ID_EMPLEADO_RESPONSABLE);
    else if (initialData?.ID_OFICINA) loadOficinaData(initialData.ID_OFICINA);
  }, []);

  const loadExternoData = async (id) => {
    try {
      const result = await db.select('EXTERNOS', { ID_EXTERNO: id }, '*');
      if (result?.[0]) {
        setSolicitanteData(result[0]);
        setModoExterno('existente');
      }
    } catch (err) {
      console.error('Error cargando externo:', err);
    }
  };

  const loadEmpleadoData = async (id) => {
    try {
      const result = await db.select('vw_empleados_completo', { ID_EMPLEADO: id }, '*');
      if (result?.[0]) setSolicitanteData(result[0]);
    } catch (err) {
      console.error('Error cargando empleado:', err);
    }
  };

  const loadOficinaData = async (id) => {
    try {
      const result = await db.select('OFICINAS', { ID_OFICINA: id }, '*');
      if (result?.[0]) {
        const oficina = result[0];
        if (oficina.ID_INFRAESTRUCTURA) {
          const infraResult = await db.select('INFRAESTRUCTURAS', { ID_INFRAESTRUCTURA: oficina.ID_INFRAESTRUCTURA }, '*');
          setSolicitanteData({ ...oficina, INFRAESTRUCTURA: infraResult?.[0]?.NOMBRE, ...infraResult?.[0] });
        } else {
          setSolicitanteData(oficina);
        }
      }
    } catch (err) {
      console.error('Error cargando oficina:', err);
    }
  };

  const handleChange = useCallback((field, value) => {
    setFormData(prev => {
      const newData = { ...prev, [field]: value };
      if (field === 'tipo_solicitante') {
        newData.id_externo = '';
        newData.id_empleado = '';
        newData.id_oficina = '';
        setSolicitanteData(null);
        setModoExterno('buscar');
      }
      return newData;
    });

    if (field === 'id_externo') {
      value ? loadExternoData(value) : setSolicitanteData(null);
    } else if (field === 'id_empleado') {
      value ? loadEmpleadoData(value) : setSolicitanteData(null);
    } else if (field === 'id_oficina') {
      value ? loadOficinaData(value) : setSolicitanteData(null);
    }
  }, []);

  const handleHorarioChange = useCallback((index, field, value) => {
    setHorarios(prev => prev.map((h, i) => i === index ? { ...h, [field]: value } : h));
  }, []);

  const agregarHorario = useCallback(() => {
    setHorarios(prev => [...prev, { fecha: '', hora_inicio: '', hora_fin: '' }]);
  }, []);

  const eliminarHorario = useCallback((index) => {
    setHorarios(prev => prev.filter((_, i) => i !== index));
  }, []);

  const handleNuevoExternoChange = useCallback((field, value) => {
    setNuevoExternoData(prev => ({ ...prev, [field]: value }));
  }, []);

  const handleNuevoExterno = useCallback(() => {
    setModoExterno('nuevo');
    setFormData(prev => ({ ...prev, id_externo: '' }));
    setSolicitanteData(null);
    setNuevoExternoData({
      es_persona_juridica: 'natural',
      nombre_o_organizacion: '',
      apellido_o_tipo_sociedad: '',
      dni_ruc: '',
      telefono_contacto: '',
      correo_contacto: '',
      domicilio_ubicacion: '',
      es_menor_de_edad: false,
      tutor_nombre_completo: '',
      tutor_dni: '',
      tutor_telefono: '',
      tutor_parentesco: '',
      emergencia_nombre: '',
      emergencia_telefono: '',
      comentarios: ''
    });
  }, []);

  const handleCancelarNuevoExterno = useCallback(() => {
    setModoExterno('buscar');
    setSolicitanteData(null);
  }, []);

  const getSolicitanteValido = () => {
    if (!formData.tipo_solicitante) return false;
    if (formData.tipo_solicitante === 'EXTERNO') {
      if (modoExterno === 'nuevo') {
        return nuevoExternoData.nombre_o_organizacion && nuevoExternoData.dni_ruc;
      }
      return !!formData.id_externo;
    }
    if (formData.tipo_solicitante === 'EMPLEADO') return !!formData.id_empleado;
    if (formData.tipo_solicitante === 'OFICINA') return !!formData.id_oficina;
    return true;
  };

  const handleSubmit = useCallback(async (e, forzar = false) => {
    e?.preventDefault();
    setLoading(true);
    setError(null);
    setConflictos(null);

    try {
      const horariosValidos = horarios.filter(h => h.fecha && h.hora_inicio && h.hora_fin);
      if (horariosValidos.length === 0) throw new Error('Debe agregar al menos un horario');
      if (!formData.id_espacio_deportivo) throw new Error('Debe seleccionar un espacio deportivo');

      // Verificar conflictos de horario (salvo que el usuario ya forzó)
      if (!forzar) {
        const checkResult = await db.executeFunction('fn_verificar_conflictos_horario', {
          p_id_espacio: formData.id_espacio_deportivo,
          p_horarios:   horariosValidos,
          p_id_reserva: isEdit ? initialData.ID_RESERVA : null
        });
        const payload = Array.isArray(checkResult) ? checkResult[0] : checkResult;
        if (payload?.tiene_conflictos) {
          setConflictos({
            espacio_nombre:         payload.espacio_nombre || '',
            infraestructura_nombre: payload.infraestructura_nombre || '',
            items:                  payload.conflictos || []
          });
          setLoading(false);
          return;
        }
      }

      // 1. Si es modo nuevo externo, crearlo primero y obtener el ID
      let idExternoFinal = formData.id_externo;
      if (formData.tipo_solicitante === 'EXTERNO' && modoExterno === 'nuevo') {
        if (!nuevoExternoData.nombre_o_organizacion || !nuevoExternoData.dni_ruc) {
          throw new Error('Complete los datos del nuevo externo (nombre y DNI/RUC son obligatorios)');
        }
        if (!/^\d{8}$|^\d{11}$/.test(nuevoExternoData.dni_ruc)) {
          throw new Error('El DNI debe tener exactamente 8 dígitos numéricos, o el RUC 11 dígitos numéricos');
        }
        const externoResult = await db.insert('EXTERNOS', {
          ES_PERSONA_JURIDICA: nuevoExternoData.es_persona_juridica === 'juridica',
          NOMBRE_O_ORGANIZACION: nuevoExternoData.nombre_o_organizacion,
          APELLIDO_O_TIPO_SOCIEDAD: nuevoExternoData.apellido_o_tipo_sociedad,
          DNI_RUC: nuevoExternoData.dni_ruc,
          TELEFONO_CONTACTO: nuevoExternoData.telefono_contacto,
          CORREO_CONTACTO: nuevoExternoData.correo_contacto,
          DOMICILIO_UBICACION: nuevoExternoData.domicilio_ubicacion,
          ES_MENOR_DE_EDAD: nuevoExternoData.es_menor_de_edad,
          TUTOR_NOMBRE_COMPLETO: nuevoExternoData.tutor_nombre_completo,
          TUTOR_DNI: nuevoExternoData.tutor_dni,
          TUTOR_TELEFONO: nuevoExternoData.tutor_telefono,
          TUTOR_PARENTESCO: nuevoExternoData.tutor_parentesco,
          EMERGENCIA_NOMBRE: nuevoExternoData.emergencia_nombre,
          EMERGENCIA_TELEFONO: nuevoExternoData.emergencia_telefono,
          COMENTARIOS: nuevoExternoData.comentarios,
          ACTIVO: true
        });
        idExternoFinal = externoResult?.[0]?.ID_EXTERNO;
        if (!idExternoFinal) throw new Error('No se pudo obtener ID del externo creado');
      }

      // 2. Preparar params según la firma de las funciones SQL
      const params = {
        p_id_espacio: formData.id_espacio_deportivo,
        p_id_programa: formData.id_programa || null,
        p_id_externo: formData.tipo_solicitante === 'EXTERNO' ? idExternoFinal : null,
        p_id_oficina: formData.tipo_solicitante === 'OFICINA' ? formData.id_oficina : null,
        p_id_empleado: formData.tipo_solicitante === 'EMPLEADO' ? formData.id_empleado : null,
        p_notas: formData.notas || null,
        p_horarios: horariosValidos
      };

      // 3. Llamar función de reserva
      let result;
      if (isEdit) {
        result = await db.executeFunction('sp_actualizar_reserva_con_horarios', {
          p_id_reserva: initialData.ID_RESERVA,
          ...params
        });
      } else {
        result = await db.executeFunction('sp_crear_reserva_con_horarios', params);
      }

      if (result && result.error) throw result.error;
      onSuccess?.(result);
    } catch (err) {
      setError(err.message || 'Error al guardar');
    } finally {
      setLoading(false);
    }
  }, [formData, horarios, modoExterno, nuevoExternoData, isEdit, initialData, onSuccess]);

  return {
    formData,
    horarios,
    solicitanteData,
    modoExterno,
    nuevoExternoData,
    loading,
    error,
    conflictos,
    setConflictos,
    currentPage,
    isEdit,
    setCurrentPage,
    handleChange,
    handleHorarioChange,
    agregarHorario,
    eliminarHorario,
    handleNuevoExterno,
    handleNuevoExternoChange,
    handleCancelarNuevoExterno,
    handleSubmit,
    getSolicitanteValido
  };
};
