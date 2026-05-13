import React from 'react';
import RequisicionForm from '../../components/requisiciones/RequisicionForm';
import { EnfermeriaSidebar } from '../../components/layout/AdminLayout';

const RequisicionesEnfermeria = () => (
  <RequisicionForm
    sidebar={<EnfermeriaSidebar />}
    moduleName="Enfermería"
    departamentoFijo="Enfermería"
  />
);

export default RequisicionesEnfermeria;
