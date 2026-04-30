import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { ArrowRight, FileText, Search, Sparkles, Plus, File, Trash2 } from 'lucide-react';
import marakameLogo from '../../assets/marakame.jpeg';

const ExpedienteMedico = () => {
	const navigate = useNavigate();
	const location = useLocation();
	const { pacienteId } = useParams();
	
	const [tab, setTab] = useState('general');
	const [expediente, setExpediente] = useState(null);
	const [pacienteInfo, setPacienteInfo] = useState(null);
	const [archivos, setArchivos] = useState([]);
	const [cargando, setCargando] = useState(true);
	const [error, setError] = useState(null);
	const [mostrarCrear, setMostrarCrear] = useState(false);
	
	const isMedico = location.pathname === '/medico/expediente';

	// Cargar expediente si viene desde búsqueda
	useEffect(() => {
		const cargarExpediente = async () => {
			try {
				setCargando(true);
				
				// Si hay pacienteId, obtener expediente específico
				if (pacienteId) {
					// Obtener datos del paciente
					const pacResponse = await fetch(`http://localhost:4000/api/pacientes/${pacienteId}`);
					if (pacResponse.ok) {
						setPacienteInfo(await pacResponse.json());
					}
					
					// Obtener expediente del paciente
					const expedResponse = await fetch(`http://localhost:4000/api/expedientes/paciente/${pacienteId}`);
					if (expedResponse.ok) {
						const exp = await expedResponse.json();
						setExpediente(exp);
						
						// Cargar archivos del expediente
						const archResponse = await fetch(`http://localhost:4000/api/expedientes/${exp.id}/archivos`);
						if (archResponse.ok) {
							setArchivos(await archResponse.json());
						}
					} else if (expedResponse.status === 404) {
						setMostrarCrear(true);
					}
				}
				setError(null);
			} catch (err) {
				console.error('Error:', err);
				setError(err.message);
			} finally {
				setCargando(false);
			}
		};

		cargarExpediente();
	}, [pacienteId]);

	// Crear expediente
	const crearExpediente = async () => {
		try {
			const response = await fetch(`http://localhost:4000/api/expedientes/crear/${pacienteId}`, {
				method: 'POST'
			});
			
			if (response.ok) {
				const nuevoExpediente = await response.json();
				setExpediente(nuevoExpediente);
				setMostrarCrear(false);
				setError(null);
			}
		} catch (err) {
			setError('Error al crear expediente: ' + err.message);
		}
	};

	if (cargando) {
		return (
			<div className="flex items-center justify-center min-h-screen">
				<div className="text-center">
					<div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#7E1D3B] mb-3"></div>
					<p>Cargando expediente...</p>
				</div>
			</div>
		);
	}

	if (mostrarCrear && !expediente) {
		return (
			<div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
				<div className="bg-white rounded-3xl border-2 border-dashed border-[#7E1D3B]/30 p-8 max-w-md w-full text-center shadow-lg">
					<FileText className="mx-auto mb-4 text-[#7E1D3B]" size={48} />
					<h2 className="text-2xl font-black text-slate-900 mb-2">Crear Expediente Médico</h2>
					<p className="text-slate-600 mb-6">Este paciente aún no tiene expediente. Crea uno para comenzar a registrar su información.</p>
					<div className="flex gap-3">
						<button
							onClick={() => navigate('/medico')}
							className="flex-1 px-4 py-3 rounded-xl border border-slate-200 text-slate-700 font-semibold hover:bg-slate-50 transition"
						>
							Cancelar
						</button>
						<button
							onClick={crearExpediente}
							className="flex-1 px-4 py-3 rounded-xl bg-[#7E1D3B] text-white font-semibold hover:bg-[#63162e] transition flex items-center justify-center gap-2"
						>
							<Plus size={18} /> Crear
						</button>
					</div>
				</div>
			</div>
		);
	}
	return (
		<div className="min-h-screen bg-[radial-gradient(circle_at_top_right,_rgba(126,29,59,0.10),_transparent_25%),linear-gradient(180deg,_#f8fafc_0%,_#eef2f7_100%)] text-slate-900">
			<header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 px-4 py-4 shadow-sm backdrop-blur md:px-6">
				<div className="mx-auto flex max-w-7xl flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
					<div className="flex items-center gap-4">
						<img src={marakameLogo} alt="Logo Nayarit Marakame" className="h-12 w-auto rounded-xl border border-slate-200 bg-white p-1 shadow-sm" />
						<div>
							<p className="text-xs uppercase tracking-[0.25em] text-[#7E1D3B]">Instituto Marakame</p>
							<h1 className="text-xl font-black uppercase tracking-tight text-[#7E1D3B]">Expediente médico</h1>
							<p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">Seguimiento clínico y documentos</p>
						</div>
					</div>

					<div className="flex flex-wrap items-center gap-3">
						<button type="button" onClick={() => navigate('/medico')} className="inline-flex items-center gap-2 rounded-xl bg-[#7E1D3B] px-5 py-3 text-sm font-bold text-white shadow-md shadow-rose-900/15 transition hover:bg-[#63162e]">
							Volver a médico <ArrowRight size={18} />
						</button>
					</div>
				</div>
			</header>

			<main className="mx-auto w-full max-w-7xl px-4 py-5 md:px-6 md:py-6">
				{error && (
					<div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700">
						⚠️ {error}
					</div>
				)}

				<div className="grid gap-4 md:grid-cols-[220px_1fr]">
					<aside className="rounded-3xl bg-gradient-to-b from-slate-100 to-white p-3 shadow-inner">
						<button type="button" onClick={() => navigate('/medico')} className="mb-3 w-full rounded-xl px-3 py-3 text-sm font-semibold shadow-md transition border border-[#7E1D3B]/20 bg-[#7E1D3B]/8 text-[#7E1D3B] hover:bg-[#7E1D3B]/12">
							Inicio
						</button>
						<button type="button" className="mb-2 w-full rounded-xl bg-[#7E1D3B] px-3 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-[#63162e]">
							Expediente
						</button>
						<button type="button" onClick={() => navigate('/medico/historia-medica')} className="mb-2 w-full rounded-xl border border-[#7E1D3B]/20 bg-[#7E1D3B]/8 px-3 py-3 text-sm font-semibold text-[#7E1D3B] transition hover:bg-[#7E1D3B]/12">
							Historia médica
						</button>
						<button type="button" onClick={() => navigate('/medico/inventario-pertenencias')} className="mb-2 w-full rounded-xl border border-[#7E1D3B]/20 bg-[#7E1D3B]/8 px-3 py-3 text-sm font-semibold text-[#7E1D3B] transition hover:bg-[#7E1D3B]/12">
							Inventario
						</button>
					</aside>

					<div className="space-y-5">
						<section className="rounded-[24px] border border-slate-200 bg-white p-4 shadow-sm md:p-5">
							<div className="mb-3 flex items-center justify-between gap-3">
								<p className="text-xs font-black uppercase tracking-[0.2em] text-slate-500">Navegación</p>
								<p className="text-xs font-semibold text-slate-500">Pestaña activa: {tab === 'general' ? 'General' : tab === 'archivos' ? 'Archivos' : 'Evolución'}</p>
							</div>
							<div className="grid gap-2 md:grid-cols-3">
								<button type="button" onClick={() => setTab('general')} className={`rounded-xl px-3 py-2 text-sm font-semibold transition ${tab === 'general' ? 'bg-[#7E1D3B] text-white' : 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50'}`}>General</button>
								<button type="button" onClick={() => setTab('archivos')} className={`rounded-xl px-3 py-2 text-sm font-semibold transition ${tab === 'archivos' ? 'bg-[#7E1D3B] text-white' : 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50'}`}>Archivos</button>
								<button type="button" onClick={() => setTab('evolucion')} className={`rounded-xl px-3 py-2 text-sm font-semibold transition ${tab === 'evolucion' ? 'bg-[#7E1D3B] text-white' : 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50'}`}>Evolución</button>
							</div>
						</section>

						{tab === 'general' && expediente && (
							<>
								<section className="rounded-[28px] border border-[#7E1D3B]/12 bg-white p-5 shadow-sm md:p-6">
									<div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
										<div>
											<p className="text-xs font-black uppercase tracking-[0.25em] text-[#7E1D3B]">Resumen</p>
											<h2 className="mt-1 text-2xl font-black text-slate-900 md:text-3xl">Expediente del Paciente</h2>
										</div>
										<div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
											Creado: {new Date(expediente.fechaCreacion).toLocaleDateString()}
										</div>
									</div>
								</section>

								<section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
									<article className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
										<p className="text-xs font-semibold uppercase tracking-widest text-slate-500">ID Paciente</p>
										<p className="mt-3 text-2xl font-black text-slate-900">#{pacienteId}</p>
									</article>
									<article className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
										<p className="text-xs font-semibold uppercase tracking-widest text-slate-500">Estado</p>
										<p className="mt-3 text-2xl font-black text-green-600">{expediente.estado}</p>
									</article>
									<article className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
										<p className="text-xs font-semibold uppercase tracking-widest text-slate-500">Archivos</p>
										<p className="mt-3 text-2xl font-black text-slate-900">{archivos.length}</p>
									</article>
								</section>
							</>
						)}

						{tab === 'archivos' && expediente && (
							<section className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm md:p-6">
								<div className="mb-4 flex items-center justify-between gap-3">
									<div>
										<p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">Documentos</p>
										<h3 className="text-2xl font-black text-slate-900">Archivos del expediente</h3>
									</div>
									<File className="text-[#7E1D3B]" size={22} />
								</div>
								
								{archivos.length === 0 ? (
									<p className="text-slate-500 text-center py-8">No hay archivos aún</p>
								) : (
									<div className="space-y-2">
										{archivos.map((archivo) => (
											<div key={archivo.id} className="flex items-center justify-between p-3 rounded-lg border border-slate-200 hover:bg-slate-50">
												<div>
													<p className="font-semibold text-slate-900">{archivo.nombreArchivo}</p>
													<p className="text-xs text-slate-500">{archivo.tipoDocumento}</p>
												</div>
												<button className="p-2 text-slate-400 hover:text-red-500 transition">
													<Trash2 size={18} />
												</button>
											</div>
										))}
									</div>
								)}
							</section>
						)}

						{tab === 'evolucion' && expediente && (
							<section className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm md:p-6">
								<div className="mb-4">
									<p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">Evolución</p>
									<h3 className="text-2xl font-black text-slate-900">Notas de seguimiento</h3>
								</div>
								{expediente.historiaMedica ? (
									<div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
										<p className="text-sm text-slate-700">Historia médica vinculada desde {new Date(expediente.historiaMedica.fechaRegistro).toLocaleDateString()}</p>
									</div>
								) : (
									<p className="text-slate-500 text-center py-8">Sin historia médica vinculada aún</p>
								)}
							</section>
						)}
					</div>
				</div>
			</main>
		</div>
	);
};

export default ExpedienteMedico;
