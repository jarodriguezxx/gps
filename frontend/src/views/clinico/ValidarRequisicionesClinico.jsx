import React from 'react';
import { ClinicoSidebar } from '../../components/layout/AdminLayout';
import ValidarRequisicionesArea from '../../components/requisiciones/ValidarRequisicionesArea';

const ValidarRequisicionesClinico = () => (
  <ValidarRequisicionesArea
    areaNombre="Clínico"
    areaFiltro="Clínico"
    rolHeader="jefe-clinico"
    validatePath="/requisiciones/:id/validar-clinico"
    sidebar={<ClinicoSidebar />}
  />
);

export default ValidarRequisicionesClinico;