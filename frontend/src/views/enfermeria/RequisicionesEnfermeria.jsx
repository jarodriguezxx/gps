import React from 'react';
import RequisicionForm from '../../components/requisiciones/RequisicionForm';
import { EnfermeriaSidebar } from '../../components/layout/AdminLayout';

export default function RequisicionesEnfermeria() {
  return (
    <RequisicionForm
      sidebar={<EnfermeriaSidebar />}
      moduleName="Enfermería"
      departamentoFijo="Enfermería"
    />
  );
}
