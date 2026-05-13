import React from 'react';
import { JefeClinicoSidebar } from '../../components/layout/AdminLayout';
import ValidarRequisicionesArea from '../../components/requisiciones/ValidarRequisicionesArea';

const AREAS_CLINICAS = ['Clínico', 'Psicología', 'Consejería', 'Familia', 'Terapéutica'];

const ValidarRequisicionesClinico = () => (
  <ValidarRequisicionesArea
    areaNombre="Área Clínica"
    areaFiltro={AREAS_CLINICAS}
    rolHeader="jefe-clinico"
    validatePath="/requisiciones/:id/validar-clinico"
    sidebar={<JefeClinicoSidebar />}
  />
);

export default ValidarRequisicionesClinico;