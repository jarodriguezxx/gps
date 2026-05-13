import React from 'react';
import RequisicionForm from '../../components/requisiciones/RequisicionForm';
import { FamiliaSidebar } from '../../components/layout/AdminLayout';

const RequisicionesFamilia = () => (
  <RequisicionForm
    sidebar={<FamiliaSidebar />}
    moduleName="Familia"
    departamentoFijo="Familia"
  />
);

export default RequisicionesFamilia;
