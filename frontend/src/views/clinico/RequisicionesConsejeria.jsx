import React from 'react';
import RequisicionForm from '../../components/requisiciones/RequisicionForm';
import { ConsejeriaSidebar } from '../../components/layout/AdminLayout';

const RequisicionesConsejeria = () => (
  <RequisicionForm
    sidebar={<ConsejeriaSidebar />}
    moduleName="Consejería"
    departamentoFijo="Consejería"
  />
);

export default RequisicionesConsejeria;
