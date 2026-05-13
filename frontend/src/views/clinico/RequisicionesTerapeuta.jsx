import React from 'react';
import RequisicionForm from '../../components/requisiciones/RequisicionForm';
import { TerapeutaSidebar } from '../../components/layout/AdminLayout';

const RequisicionesTerapeuta = () => (
  <RequisicionForm
    sidebar={<TerapeutaSidebar />}
    moduleName="Terapéutica"
    departamentoFijo="Terapéutica"
  />
);

export default RequisicionesTerapeuta;
