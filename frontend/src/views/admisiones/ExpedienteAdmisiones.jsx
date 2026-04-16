import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowRight, FileText, Search, Sparkles } from 'lucide-react';
import InstitutionalHeader from '../../components/layout/InstitutionalHeader';
import PrimarySidebarActionButton from '../../components/buttons/PrimarySidebarActionButton';

const documentos = [
	{ nombre: 'Estudio socioeconómico', tipo: 'PDF', estado: 'Adjunto', detalle: 'Se recomienda cargar archivo PDF individual' },
	{ nombre: 'Valoración diagnóstica', tipo: 'Registro clínico', estado: 'Adjunto', detalle: 'Información del área de admisiones' },
	{ nombre: 'Consentimiento de ingreso', tipo: 'Documento', estado: 'Pendiente', detalle: 'Por firmar en admisiones' },
];

const notasInterArea = [
	'Admisiones: paciente con acompañante responsable y estudio socioeconómico en proceso.',
	'Médico: valoración clínica inicial compatible con ingreso; pendiente seguimiento de signos.',
	'Admisiones a Médico: expediente listo para traslado al área clínica y revisión física.',
];

const ExpedienteAdmisiones = () => {
	const navigate = useNavigate();
	const location = useLocation();
	const [tab, setTab] = useState('general');
	const isInicioActive = location.pathname === '/admisiones';
	const isExpedienteActive = location.pathname === '/admisiones/expediente';
	const isEstudioActive = location.pathname === '/admisiones/estudio-socioeconomico';
	const isValoracionActive = location.pathname === '/admisiones/valoracion-diagnostica';

	return (
		<div className="min-h-screen bg-slate-50 text-slate-900">
			<div className="mx-auto max-w-[1600px] p-4 md:p-6">
				<header className="mb-6 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
					<InstitutionalHeader
						title="Expediente de admisiones"
						moduleLabel="Documento maestro del área"
						sessionValue="Admisiones"
						badge={<FileText size={16} className="text-[#7E1D3B]" />}
					/>
				</header>

				<main className="space-y-5">
				<div className="grid gap-4 md:grid-cols-[220px_1fr]">
					<aside className="rounded-3xl bg-gradient-to-b from-slate-100 to-white p-3 shadow-inner">
						<PrimarySidebarActionButton
							label="Volver a admisiones"
							onClick={() => navigate('/admisiones')}
							icon={<ArrowRight size={18} />}
						/>
						<button type="button" onClick={() => navigate('/admisiones')} className={`mb-3 w-full rounded-xl px-3 py-3 text-sm font-semibold shadow-md transition ${isInicioActive ? 'bg-[#7E1D3B] text-white hover:bg-[#63162e]' : 'border border-[#7E1D3B]/20 bg-[#7E1D3B]/8 text-[#7E1D3B] hover:bg-[#7E1D3B]/12'}`}>
							Inicio
						</button>
						<button type="button" onClick={() => navigate('/admisiones/expediente')} className={`mb-2 w-full rounded-xl px-3 py-3 text-sm font-semibold transition ${isExpedienteActive ? 'bg-[#7E1D3B] text-white shadow-md hover:bg-[#63162e]' : 'border border-[#7E1D3B]/20 bg-[#7E1D3B]/8 text-[#7E1D3B] hover:bg-[#7E1D3B]/12'}`}>
							Expediente
						</button>
						<button type="button" onClick={() => navigate('/admisiones/estudio-socioeconomico')} className={`mb-2 w-full rounded-xl px-3 py-3 text-sm font-semibold transition ${isEstudioActive ? 'bg-[#7E1D3B] text-white shadow-md hover:bg-[#63162e]' : 'border border-[#7E1D3B]/20 bg-[#7E1D3B]/8 text-[#7E1D3B] hover:bg-[#7E1D3B]/12'}`}>
							Estudio socioeconómico
						</button>
						<button type="button" onClick={() => navigate('/admisiones/valoracion-diagnostica')} className={`mb-2 w-full rounded-xl px-3 py-3 text-sm font-semibold transition ${isValoracionActive ? 'bg-[#7E1D3B] text-white shadow-md hover:bg-[#63162e]' : 'border border-[#7E1D3B]/20 bg-[#7E1D3B]/8 text-[#7E1D3B] hover:bg-[#7E1D3B]/12'}`}>
							Valoración diagnóstica
						</button>
					</aside>

					<div className="space-y-5">
						<section className="rounded-[24px] border border-slate-200 bg-slate-100/70 p-4 shadow-sm md:p-5">
							<div className="flex justify-start">
								<div className="relative w-full md:max-w-md">
									<Search className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
									<input type="text" placeholder="Buscar expediente, nombre o clave..." className="w-full rounded-2xl border border-slate-200 bg-white py-3 pl-11 pr-4 text-sm outline-none transition focus:border-[#7E1D3B] focus:ring-2 focus:ring-[#7E1D3B]/15" />
								</div>
							</div>
						</section>

						<section className="rounded-[24px] border border-slate-200 bg-white p-4 shadow-sm md:p-5">
							<div className="mb-3 flex items-center justify-between gap-3">
								<p className="text-xs font-black uppercase tracking-[0.2em] text-slate-500">Navegación</p>
								<p className="text-xs font-semibold text-slate-500">Pestaña activa: {tab === 'general' ? 'General' : tab === 'docs' ? 'Documentos' : 'Notas'}</p>
							</div>
							<div className="grid gap-2 md:grid-cols-3">
								<button type="button" onClick={() => setTab('general')} className={`rounded-xl px-3 py-2 text-sm font-semibold transition ${tab === 'general' ? 'bg-[#7E1D3B] text-white' : 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50'}`}>General</button>
								<button type="button" onClick={() => setTab('docs')} className={`rounded-xl px-3 py-2 text-sm font-semibold transition ${tab === 'docs' ? 'bg-[#7E1D3B] text-white' : 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50'}`}>Documentos</button>
								<button type="button" onClick={() => setTab('notes')} className={`rounded-xl px-3 py-2 text-sm font-semibold transition ${tab === 'notes' ? 'bg-[#7E1D3B] text-white' : 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50'}`}>Notas entre áreas</button>
							</div>
						</section>

						{tab === 'general' && (
							<>
								

								<section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
									{[
										{ label: 'Paciente', value: 'María García López' },
										{ label: 'Clave', value: '02641' },
										{ label: 'Ingreso', value: '26/04/2026' },
										{ label: 'Estado', value: 'En valoración' },
									].map((item) => (
										<article key={item.label} className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
											<p className="text-xs font-semibold uppercase tracking-widest text-slate-500">{item.label}</p>
											<p className="mt-3 text-2xl font-black text-slate-900">{item.value}</p>
										</article>
									))}
								</section>
							</>
						)}

						{tab === 'docs' && (
							<section className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm md:p-6">
								<div className="mb-4 flex items-center justify-between gap-3">
									<div>
										<p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">Documentos</p>
										<h3 className="text-2xl font-black text-slate-900">PDFs y registros del expediente</h3>
									</div>
									<FileText className="text-[#7E1D3B]" size={22} />
								</div>
								<div className="space-y-3">
									{documentos.map((doc) => (
										<div key={doc.nombre} className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
											<div className="flex items-start justify-between gap-3">
												<div>
													<p className="text-sm font-black text-slate-900">{doc.nombre}</p>
													<p className="text-xs uppercase tracking-[0.2em] text-slate-400">{doc.tipo}</p>
												</div>
												<span className={`rounded-full px-2 py-1 text-xs font-semibold ${doc.estado === 'Adjunto' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-900'}`}>{doc.estado}</span>
											</div>
											<p className="mt-2 text-sm leading-6 text-slate-600">{doc.detalle}</p>
										</div>
									))}
								</div>
							</section>
						)}

						{tab === 'notes' && (
							<>
								<section className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm md:p-6">
									<div className="mb-4 flex items-center justify-between gap-3">
										<div>
											<p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">Notas entre áreas</p>
											<h3 className="text-2xl font-black text-slate-900">Seguimiento cruzado</h3>
										</div>
										<Sparkles className="text-[#7E1D3B]" size={22} />
									</div>
									<div className="space-y-3">
										{notasInterArea.map((nota) => (
											<div key={nota} className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/70 p-4 text-sm leading-6 text-slate-700">{nota}</div>
										))}
									</div>
								</section>
							</>
						)}

						<section className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm md:p-6">
							<div className="mb-4 flex items-center justify-between gap-3">
								<div>
									<p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">Acción rápida</p>
									<h3 className="text-2xl font-black text-slate-900">Abrir módulos del expediente</h3>
								</div>
								<Sparkles className="text-[#7E1D3B]" size={22} />
							</div>
							<div className="grid gap-3 md:grid-cols-3">
								<button type="button" onClick={() => navigate('/admisiones/estudio-socioeconomico')} className="rounded-2xl border border-[#7E1D3B]/20 bg-[#7E1D3B]/8 px-4 py-4 text-left text-sm font-semibold text-[#7E1D3B] transition hover:bg-[#7E1D3B]/12">Abrir estudio socioeconómico</button>
								<button type="button" onClick={() => navigate('/admisiones/valoracion-diagnostica')} className="rounded-2xl border border-[#7E1D3B]/20 bg-[#7E1D3B]/8 px-4 py-4 text-left text-sm font-semibold text-[#7E1D3B] transition hover:bg-[#7E1D3B]/12">Abrir valoración diagnóstica</button>
								<button type="button" onClick={() => navigate('/admisiones')} className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-left text-sm font-semibold text-slate-700 transition hover:bg-slate-100">Volver a inicio de admisiones</button>
							</div>
						</section>
					</div>
				</div>
				</main>
			</div>
		</div>
	);
};

export default ExpedienteAdmisiones;
