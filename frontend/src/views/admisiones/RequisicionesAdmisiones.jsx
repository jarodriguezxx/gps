import React from 'react';
import { AdmisionesSidebar } from '../../components/layout/AdminLayout';
import RequisicionForm from '../../components/requisiciones/RequisicionForm';

const RequisicionesAdmisiones = () => (
  <RequisicionForm
    sidebar={<AdmisionesSidebar />}
    moduleName="Admisiones"
    departamentoFijo="Admisiones"
  />
);

export default RequisicionesAdmisiones;
