import React from 'react';
import { MedicoSidebar } from '../../components/layout/AdminLayout';
import ValidarRequisicionesArea from '../../components/requisiciones/ValidarRequisicionesArea';

const AREAS_MEDICAS = ['Médico', 'Nutriología', 'Enfermería'];

const ValidarRequisicionesMedico = () => (
  <ValidarRequisicionesArea
    areaNombre="Área Médica"
    areaFiltro={AREAS_MEDICAS}
    rolHeader="jefe-medico"
    validatePath="/requisiciones/:id/validar-medico"
    sidebar={<MedicoSidebar />}
  />
);

export default ValidarRequisicionesMedico;