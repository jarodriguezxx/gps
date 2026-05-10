import React from 'react';
import { MedicoSidebar } from '../../components/layout/AdminLayout';
import RequisicionForm from '../../components/requisiciones/RequisicionForm';

const RequisicionesMedico = () => (
  <RequisicionForm
    sidebar={<MedicoSidebar />}
    moduleName="Médico"
    departamentoFijo="Médico"
  />
);

export default RequisicionesMedico;
