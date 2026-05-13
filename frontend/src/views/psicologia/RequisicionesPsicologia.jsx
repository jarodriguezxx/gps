import React from 'react';
import RequisicionForm from '../../components/requisiciones/RequisicionForm';
import { ClinicoSidebar } from '../../components/layout/AdminLayout';

const RequisicionesPsicologia = () => (
  <RequisicionForm
    sidebar={<ClinicoSidebar />}
    moduleName="Psicología"
    departamentoFijo="Psicología"
  />
);

export default RequisicionesPsicologia;
