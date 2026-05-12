import React from 'react';
import { ClinicoSidebar } from '../../components/layout/AdminLayout';
import RequisicionForm from '../../components/requisiciones/RequisicionForm';

const RequisicionesClinico = () => (
  <RequisicionForm
    sidebar={<ClinicoSidebar />}
    moduleName="Clínico"
    departamentoFijo="Clínico"
  />
);

export default RequisicionesClinico;
