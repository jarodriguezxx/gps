import React from 'react';
import { MedicoSidebar } from '../../components/layout/AdminLayout';
import ValidarRequisicionesArea from '../../components/requisiciones/ValidarRequisicionesArea';

const ValidarRequisicionesMedico = () => (
  <ValidarRequisicionesArea
    areaNombre="Médico"
    areaFiltro="Médico"
    rolHeader="jefe-medico"
    validatePath="/requisiciones/:id/validar-medico"
    sidebar={<MedicoSidebar />}
  />
);

export default ValidarRequisicionesMedico;