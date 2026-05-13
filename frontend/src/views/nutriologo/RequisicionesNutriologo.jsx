import React from 'react';
import RequisicionForm from '../../components/requisiciones/RequisicionForm';
import { NutriologoSidebar } from '../../components/layout/AdminLayout';

const RequisicionesNutriologo = () => (
  <RequisicionForm
    sidebar={<NutriologoSidebar />}
    moduleName="Nutriología"
    departamentoFijo="Nutriología"
  />
);

export default RequisicionesNutriologo;
