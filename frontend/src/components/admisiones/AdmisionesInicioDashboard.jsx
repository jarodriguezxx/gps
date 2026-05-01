import React, { useMemo } from 'react';
import { ArrowRight, CalendarDays, Clock3, PhoneCall, Sparkles, TrendingUp } from 'lucide-react';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

const palette = {
	rose: { card: 'bg-rose-50', badge: 'bg-rose-100 text-rose-700', accent: '#be123c', bar: '#e11d48' },
	emerald: { card: 'bg-emerald-50', badge: 'bg-emerald-100 text-emerald-700', accent: '#047857', bar: '#10b981' },
	sky: { card: 'bg-sky-50', badge: 'bg-sky-100 text-sky-700', accent: '#0369a1', bar: '#0ea5e9' },
	amber: { card: 'bg-amber-50', badge: 'bg-amber-100 text-amber-800', accent: '#b45309', bar: '#f59e0b' },
	violet: { card: 'bg-violet-50', badge: 'bg-violet-100 text-violet-700', accent: '#7c3aed', bar: '#8b5cf6' },
};

const formatHora = (fechaIso) => {
	if (!fechaIso) return '--:--';
	const date = new Date(fechaIso);
	if (Number.isNaN(date.getTime())) return '--:--';
	return date.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit', hour12: false });
};

const formatFechaCorta = (fechaIso) => {
	if (!fechaIso) return '--';
	const date = new Date(fechaIso);
	if (Number.isNaN(date.getTime())) return '--';
	return date.toLocaleDateString('es-MX', { day: '2-digit', month: 'short' });
};

const buildHourData = (citas = []) => {
	const base = Array.from({ length: 12 }, (_, index) => {
		const hour = index + 7;
		return { hour, label: `${String(hour).padStart(2, '0')}:00`, count: 0 };
	});

	citas.forEach((cita) => {
		const value = cita?.fechaHoraProgramada || cita?.fechaProgramada || cita?.fecha;
		if (!value) return;
		const date = new Date(value);
		if (Number.isNaN(date.getTime())) return;
		const hour = date.getHours();
		const bucket = base.find((item) => item.hour === hour);
		if (bucket) {
			bucket.count += 1;
		}
	});

	return base;
};

const CustomTooltip = ({ active, payload, label }) => {
	if (!active || !payload || !payload.length) return null;

	return (
		<div className="rounded-2xl border border-slate-200 bg-white px-3 py-2 text-xs shadow-lg">
			<p className="font-semibold text-slate-900">{label}</p>
			<p className="text-slate-500">{payload[0].value} cita{payload[0].value === 1 ? '' : 's'}</p>
		</div>
	);
};

const AdmisionesInicioDashboard = ({
	kpis = [],
	citas = [],
	eventosProximos = [],
	onAgendarCita,
	onNuevaLlamada,
}) => {
	const upcomingEvents = useMemo(() => {
		const source = eventosProximos.length > 0 ? eventosProximos : citas;
		return [...source]
			.sort((a, b) => new Date(a?.fechaHoraProgramada || 0) - new Date(b?.fechaHoraProgramada || 0))
			.slice(0, 3);
	}, [citas, eventosProximos]);

	const chartData = useMemo(() => buildHourData(citas), [citas]);

	return (
		<section className="space-y-5">
			<div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
				{kpis.map((item) => {
					const tone = palette[item.tone] || palette.rose;
					const Icon = item.icon || Sparkles;

					return (
						<article key={item.label} className={`rounded-[24px] border border-slate-200 ${tone.card} p-5 shadow-sm`}>
							<div className="flex items-start justify-between gap-3">
								<div>
									<p className="text-xs font-semibold uppercase tracking-widest text-slate-500">{item.label}</p>
									<p className="mt-2 text-3xl font-black text-slate-900">{item.value}</p>
									{item.helper ? <p className="mt-1 text-xs font-medium text-slate-500">{item.helper}</p> : null}
								</div>
								<div className={`flex h-11 w-11 items-center justify-center rounded-2xl ${tone.badge}`}>
									<Icon size={18} />
								</div>
							</div>
						</article>
					);
				})}
			</div>

			<div className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
				<article className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
					<div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
						<div>
							<p className="text-xs font-bold uppercase tracking-[0.25em] text-[#7E1D3B]">Próximos Eventos</p>
							<h2 className="text-2xl font-black text-slate-900">Acción inmediata</h2>
							<p className="mt-1 text-sm text-slate-500">Las 3 citas más cercanas para atender hoy.</p>
						</div>
						<div className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
							{upcomingEvents.length} evento{upcomingEvents.length === 1 ? '' : 's'}
						</div>
					</div>

					<div className="space-y-3">
						{upcomingEvents.length === 0 ? (
							<div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 py-8 text-center text-sm text-slate-500">
								No hay eventos próximos por mostrar.
							</div>
						) : upcomingEvents.map((cita, index) => (
							<article key={cita.id || `${cita.pacienteNombre}-${index}`} className="flex items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4">
								<div>
									<p className="text-sm font-black text-slate-900">{cita.pacienteNombre || 'Sin nombre'}</p>
									<p className="text-xs text-slate-500">{cita.tipoAccion || cita.motivo || 'Seguimiento'}</p>
								</div>
								<div className="text-right">
									<p className="text-sm font-semibold text-slate-900">{formatHora(cita.fechaHoraProgramada)}</p>
									<p className="text-xs text-slate-500">{formatFechaCorta(cita.fechaHoraProgramada)}</p>
								</div>
							</article>
						))}
					</div>
				</article>

				<article className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
					<div className="mb-4 flex items-start justify-between gap-3">
						<div>
							<p className="text-xs font-bold uppercase tracking-[0.25em] text-[#7E1D3B]">Flujo de citas</p>
							<h2 className="text-2xl font-black text-slate-900">Citas por hora</h2>
							<p className="mt-1 text-sm text-slate-500">Vista simple del tráfico operativo del día.</p>
						</div>
						<div className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">{citas.length} total</div>
					</div>

					<div className="h-[290px] w-full">
						<ResponsiveContainer width="100%" height="100%">
							<BarChart data={chartData} margin={{ top: 10, right: 12, left: -12, bottom: 0 }}>
								<CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
								<XAxis dataKey="label" tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} />
								<YAxis allowDecimals={false} tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} />
								<Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(126, 29, 59, 0.06)' }} />
								<Bar dataKey="count" radius={[12, 12, 0, 0]} fill="#7E1D3B" />
							</BarChart>
						</ResponsiveContainer>
					</div>
				</article>
			</div>

			<div className="grid gap-3 md:grid-cols-2">
				<button
					type="button"
					onClick={onAgendarCita}
					className="flex items-center justify-between rounded-[28px] border border-[#7E1D3B] bg-[#7E1D3B] px-5 py-5 text-left text-white shadow-[0_18px_40px_rgba(126,29,59,0.18)] transition hover:bg-[#63162e]"
				>
					<div>
						<p className="text-xs font-bold uppercase tracking-[0.22em] text-white/75">Acceso rápido</p>
						<h3 className="mt-1 text-2xl font-black">Agendar Cita</h3>
						<p className="mt-1 text-sm text-white/80">Abre la agenda para programar una nueva visita.</p>
					</div>
					<CalendarDays size={30} className="shrink-0 text-white/90" />
				</button>

				<button
					type="button"
					onClick={onNuevaLlamada}
					className="flex items-center justify-between rounded-[28px] border border-slate-200 bg-white px-5 py-5 text-left text-slate-900 shadow-sm transition hover:border-[#7E1D3B]/30 hover:bg-slate-50"
				>
					<div>
						<p className="text-xs font-bold uppercase tracking-[0.22em] text-slate-500">Acceso rápido</p>
						<h3 className="mt-1 text-2xl font-black">Nueva Llamada</h3>
						<p className="mt-1 text-sm text-slate-500">Registra un nuevo seguimiento telefónico.</p>
					</div>
					<PhoneCall size={30} className="shrink-0 text-[#7E1D3B]" />
				</button>
			</div>
		</section>
	);
};

export default AdmisionesInicioDashboard;
