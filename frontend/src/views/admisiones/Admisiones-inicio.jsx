import React from 'react';

import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowRight, Bell, Plus } from 'lucide-react';
import InstitutionalHeader from '../../components/layout/InstitutionalHeader';
import PrimarySidebarActionButton from '../../components/buttons/PrimarySidebarActionButton';

const citasHoy = [
	{
		hora: '09:00',
		paciente: 'María García López',
		tipo: 'Valoración Inicial',
		profesional: 'Dr. Juan Martínez',
		estado: 'En proceso',
	},
	{
		hora: '09:30',
		paciente: 'José Ramírez Díaz',
		tipo: 'Seguimiento',
		profesional: 'Dra. Laura Medina',
		estado: 'Confirmada',
	},
	{
		hora: '10:00',
		paciente: 'Ana Torres Vela',
		tipo: 'Primera Entrevista',
		profesional: 'Lic. Marco Pineda',
		estado: 'Pendiente',
	},
	{
		hora: '10:45',
		paciente: 'Carlos Bautista Ruiz',
		tipo: 'Valoración Inicial',
		profesional: 'Dr. Juan Martínez',
		estado: 'En proceso',
	},
	{
		hora: '11:20',
		paciente: 'Diana Flores León',
		tipo: 'Seguimiento',
		profesional: 'Dra. Laura Medina',
		estado: 'Confirmada',
	},
];

const seguimiento = [
	{
		nombre: 'Roberto García Mendoza',
		telefono: '3112345678',
		fecha: '25/03/2026',
		motivo: 'Seguimiento de familiar',
		estado: 'Convertido a cita',
		proxima: '28/03/2026',
	},
	{
		nombre: 'Guadalupe Mejía Cano',
		telefono: '3119876543',
		fecha: '25/03/2026',
		motivo: 'Información de ingreso',
		estado: 'En proceso',
		proxima: '28/03/2026',
	},
	{
		nombre: 'Javier López Acosta',
		telefono: '3115567788',
		fecha: '25/03/2026',
		motivo: 'Seguimiento de familiar',
		estado: 'No contestó',
		proxima: '28/03/2026',
	},
	{
		nombre: 'Miriam Hernández Peña',
		telefono: '3111029384',
		fecha: '25/03/2026',
		motivo: 'Validación de documentos',
		estado: 'Convertido a cita',
		proxima: '29/03/2026',
	},
];

const estadoClasses = {
	Confirmada: 'bg-emerald-100 text-emerald-800',
	'En proceso': 'bg-amber-100 text-amber-900',
	Pendiente: 'bg-slate-200 text-slate-700',
	'Convertido a cita': 'bg-emerald-100 text-emerald-800',
	'No contestó': 'bg-rose-100 text-rose-800',
};

const barras = [
	{ label: 'Lun', valor: 42 },
	{ label: 'Mar', valor: 58 },
	{ label: 'Mié', valor: 50 },
	{ label: 'Jue', valor: 72 },
	{ label: 'Vie', valor: 65 },
	{ label: 'Sáb', valor: 35 },
];


const AdmisionesInicio = ({ onOpenEstudio }) => {
	const navigate = useNavigate();
	const location = useLocation();
	const openEstudio = () => {
		if (onOpenEstudio) {
			onOpenEstudio();
			return;
		}
		navigate('/admisiones/estudio-socioeconomico');
	};
	const goInicio = () => navigate('/admisiones');
	const isInicioActive = location.pathname === '/admisiones';
	const isExpedienteActive = location.pathname === '/admisiones/expediente';
	const isEstudioActive = location.pathname === '/admisiones/estudio-socioeconomico';
	const isValoracionActive = location.pathname === '/admisiones/valoracion-diagnostica';
const headerActions = (
        <div className="flex items-center gap-3">
            {/* Botón de Alertas */}
            <button className="relative p-2 text-slate-400 transition-colors hover:text-[#7E1D3B]">
                <Bell size={22} />
                <span className="absolute right-1 top-1 h-2 w-2 rounded-full border-2 border-white bg-rose-500"></span>
            </button>
            
            {/* Botón de Nuevo Ingreso */}
            <button 
                onClick={() => navigate('/admisiones/Valoracion-diagnostica')}
                className="flex items-center gap-2 rounded-xl bg-[#7E1D3B] px-5 py-2.5 text-sm font-bold text-white shadow-lg transition-all hover:bg-[#63162e]"
            >
                <Plus size={18} />
                Nuevo Ingreso
            </button>
        </div>
    );
	return (
	<div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-[1600px] p-4 md:p-6">
        
        {/* REUTILIZACIÓN DEL HEADER */}
        <header className="mb-6 rounded-3xl border border-slate-200 bg-white shadow-sm overflow-hidden">
          <InstitutionalHeader 
            sessionValue="Admisiones" // Aquí iría el nombre del usuario logueado
            actions={headerActions} // Pasamos los botones como props
          />
        </header>
				<main className="space-y-5">
				<div className="grid gap-4 md:grid-cols-[220px_1fr]">
					<aside className="rounded-3xl bg-gradient-to-b from-slate-100 to-white p-3 shadow-inner">
					
						<button
							onClick={goInicio}
							className={`mb-3 w-full rounded-xl px-3 py-3 text-sm font-semibold shadow-md transition ${
								isInicioActive
									? 'bg-[#7E1D3B] text-white hover:bg-[#63162e]'
									: 'border border-[#7E1D3B]/20 bg-[#7E1D3B]/8 text-[#7E1D3B] hover:bg-[#7E1D3B]/12'
							}`}
						>
							Inicio
						</button>
						<button
							onClick={() => navigate('/admisiones/expediente')}
							className={`mb-3 w-full rounded-xl px-3 py-3 text-sm font-semibold shadow-md transition ${
								isExpedienteActive
									? 'bg-[#7E1D3B] text-white hover:bg-[#63162e]'
									: 'border border-[#7E1D3B]/20 bg-[#7E1D3B]/8 text-[#7E1D3B] hover:bg-[#7E1D3B]/12'
							}`}
						>
							Expediente
						</button>
						<button
							onClick={openEstudio}
							className={`mb-2 w-full rounded-xl px-3 py-3 text-sm font-semibold transition ${
								isEstudioActive
									? 'bg-[#7E1D3B] text-white shadow-md hover:bg-[#63162e]'
									: 'border border-[#7E1D3B]/20 bg-[#7E1D3B]/8 text-[#7E1D3B] hover:bg-[#7E1D3B]/12'
							}`}
						>
							Estudio socioeconómico
						</button>
						<button
							onClick={() => navigate('/admisiones/valoracion-diagnostica')}
							className={`mb-2 w-full rounded-xl px-3 py-3 text-sm font-semibold transition ${
								isValoracionActive
									? 'bg-[#7E1D3B] text-white shadow-md hover:bg-[#63162e]'
									: 'border border-[#7E1D3B]/20 bg-[#7E1D3B]/8 text-[#7E1D3B] hover:bg-[#7E1D3B]/12'
							}`}
						>
							Valoración diagnóstica
						</button>

						<div className="mt-5 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
							<p className="text-xs font-semibold uppercase tracking-widest text-slate-500">Indicadores</p>
							<p className="mt-2 text-3xl font-black text-[#7E1D3B]">78%</p>
							<p className="text-xs text-slate-500">Tasa de conversión semanal</p>
						</div>
					</aside>
					<div className="space-y-5">
							

							<section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
								{[
									{ label: 'Atenciones hoy', value: '18', tone: 'emerald' },
									{ label: 'Pacientes nuevos', value: '6', tone: 'sky' },
									{ label: 'Pendientes', value: '12', tone: 'amber' },
									{ label: 'Seguimiento', value: '9', tone: 'rose' },
								].map((item) => (
									<article key={item.label} className="rounded-[24px] border border-slate-200 bg-white p-4 shadow-sm">
										<p className="text-xs uppercase tracking-widest text-slate-500">{item.label}</p>
										<p className={`mt-2 text-3xl font-black ${item.tone === 'emerald' ? 'text-emerald-700' : item.tone === 'sky' ? 'text-sky-700' : item.tone === 'amber' ? 'text-amber-700' : 'text-[#7E1D3B]'}`}>
											{item.value}
										</p>
									</article>
								))}
							</section>

							<section className="grid gap-4 xl:grid-cols-[1.6fr_1fr]">
								<article className="rounded-[28px] border border-slate-200 bg-white p-4 shadow-sm">
									<div className="mb-4 flex items-center justify-between">
										<h2 className="text-xl font-black">Tendencia Semanal de Admisiones</h2>
										<span className="rounded-lg bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
											Últimos 6 días
										</span>
									</div>

									<div className="grid h-44 grid-cols-6 items-end gap-3 rounded-xl bg-slate-50 p-4">
										{barras.map((item) => (
											<div key={item.label} className="flex flex-col items-center gap-2">
												<div className="relative flex h-32 w-full items-end justify-center rounded-md bg-slate-200/60">
													<div
														className="w-full rounded-md bg-gradient-to-t from-[#63162e] to-[#7E1D3B]"
														style={{ height: `${item.valor}%` }}
													/>
												</div>
												<span className="text-xs font-semibold text-slate-500">{item.label}</span>
											</div>
										))}
									</div>
								</article>

								<article className="rounded-[28px] border border-slate-200 bg-white p-4 shadow-sm">
									<div className="mb-4 flex items-center justify-between">
										<h2 className="text-lg font-black">Estado de Gestión</h2>
										<span className="text-xs text-slate-500">Hoy</span>
									</div>

									<div className="mx-auto mb-4 h-40 w-40 rounded-full bg-[conic-gradient(#be123c_0_45%,#16a34a_45%_72%,#f59e0b_72%_89%,#94a3b8_89%_100%)] p-4">
										<div className="flex h-full w-full items-center justify-center rounded-full bg-white text-center">
											<div>
												<p className="text-3xl font-black">89%</p>
												<p className="text-xs uppercase tracking-widest text-slate-500">avance</p>
											</div>
										</div>
									</div>

									<ul className="space-y-2 text-sm">
										<li className="flex items-center justify-between">
											<span className="text-slate-600">Convertidos a cita</span>
											<strong className="text-emerald-700">45%</strong>
										</li>
										<li className="flex items-center justify-between">
											<span className="text-slate-600">Confirmados</span>
											<strong className="text-[#7E1D3B]">27%</strong>
										</li>
										<li className="flex items-center justify-between">
											<span className="text-slate-600">Pendientes</span>
											<strong className="text-amber-700">17%</strong>
										</li>
										<li className="flex items-center justify-between">
											<span className="text-slate-600">No localizados</span>
											<strong className="text-slate-600">11%</strong>
										</li>
									</ul>
								</article>
							</section>

						

							<section className="rounded-[28px] border border-slate-200 bg-white p-4 shadow-sm">
								<div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
									<h2 className="text-2xl font-black">Citas del Día</h2>
									<div className="flex gap-2">
										<button className="rounded-lg bg-[#7E1D3B] px-3 py-2 text-sm font-semibold text-white hover:bg-[#63162e]">
											Agendar Cita
										</button>
										<button className="rounded-lg border border-[#7E1D3B]/20 bg-[#7E1D3B]/8 px-3 py-2 text-sm font-semibold text-[#7E1D3B] hover:bg-[#7E1D3B]/12">
											Agregar Paciente
										</button>
									</div>
								</div>

								<div className="overflow-x-auto">
									<table className="min-w-full border-collapse text-left text-sm">
										<thead>
											<tr className="border-y border-slate-200 bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
												<th className="px-3 py-2 font-semibold">Hora</th>
												<th className="px-3 py-2 font-semibold">Paciente</th>
												<th className="px-3 py-2 font-semibold">Tipo de Cita</th>
												<th className="px-3 py-2 font-semibold">Profesional</th>
												<th className="px-3 py-2 font-semibold">Estado</th>
												<th className="px-3 py-2 font-semibold">Acción</th>
											</tr>
										</thead>
										<tbody>
											{citasHoy.map((item) => (
												<tr key={`${item.hora}-${item.paciente}`} className="border-b border-slate-100">
													<td className="px-3 py-3 font-medium text-slate-700">{item.hora}</td>
													<td className="px-3 py-3">{item.paciente}</td>
													<td className="px-3 py-3">{item.tipo}</td>
													<td className="px-3 py-3">{item.profesional}</td>
													<td className="px-3 py-3">
														<span
															className={`rounded-full px-2 py-1 text-xs font-semibold ${
																estadoClasses[item.estado] || 'bg-slate-200 text-slate-700'
															}`}
														>
															{item.estado}
														</span>
													</td>
													<td className="px-3 py-3">
														<button className="rounded-md border border-slate-300 px-2 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-100">
															Ver
														</button>
													</td>
												</tr>
											))}
										</tbody>
									</table>
								</div>
							</section>

							<section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
								<h2 className="mb-4 text-2xl font-black">Llamadas en Seguimiento</h2>
								<div className="overflow-x-auto">
									<table className="min-w-full border-collapse text-left text-sm">
										<thead>
											<tr className="border-y border-slate-200 bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
												<th className="px-3 py-2 font-semibold">Nombre</th>
												<th className="px-3 py-2 font-semibold">Teléfono</th>
												<th className="px-3 py-2 font-semibold">Fecha/Hora</th>
												<th className="px-3 py-2 font-semibold">Motivo</th>
												<th className="px-3 py-2 font-semibold">Estado</th>
												<th className="px-3 py-2 font-semibold">Próxima Llamada</th>
											</tr>
										</thead>
										<tbody>
											{seguimiento.map((item) => (
												<tr key={`${item.nombre}-${item.telefono}`} className="border-b border-slate-100">
													<td className="px-3 py-3">{item.nombre}</td>
													<td className="px-3 py-3">{item.telefono}</td>
													<td className="px-3 py-3">{item.fecha}</td>
													<td className="px-3 py-3">{item.motivo}</td>
													<td className="px-3 py-3">
														<span
															className={`rounded-full px-2 py-1 text-xs font-semibold ${
																estadoClasses[item.estado] || 'bg-slate-200 text-slate-700'
															}`}
														>
															{item.estado}
														</span>
													</td>
													<td className="px-3 py-3">{item.proxima}</td>
												</tr>
											))}
										</tbody>
									</table>
								</div>
							</section>
						</div>
					</div>
				</main>
			</div>
		</div>
	);
};

export default AdmisionesInicio;