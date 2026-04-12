import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowRight, Search } from 'lucide-react';
import marakameLogo from '../../assets/marakame.jpeg';

const ropaDiaria = [
	'Pantalón, shorts o pants',
	'Bóxer y/o trusa',
	'Pantaletas',
	'Calcetines',
	'Calcetas',
	'Toalla',
	'Camisa o playera',
	'Camisetas interiores',
	'Brasier',
	'Suéter, chamarra o sudadera (dependiendo temporada)',
	'Short y blusa para baño (traje de baño completo)',
	'Pijama',
];

const calzado = ['Zapatos', 'Tenis', 'Sandalias', 'Pantuflas'];

const otrosArticulos = [
	'Desodorante sin alcohol',
	'Cepillo dental',
	'Pasta dental',
	'Cepillo o peine para el cabello',
	'Jabón de baño',
	'Shampoo',
	'Gel para cabello',
	'Enjuague bucal sin alcohol',
	'Crema corporal y/o para la cara',
	'Rastrillo',
	'Cinto',
	'Gorro y/o cachucha',
	'Lentes o gafas',
	'Reloj de pulso (evitando ser ostentoso)',
	'Corta uñas',
	'Cotones',
	'Talco',
	'Estropajo',
	'Toallas sanitarias/tampones y panti protectores',
	'Brillo labial o gloss o labial',
	'Pertenencias autorizadas por área médica',
];

const InventarioPertenencias = () => {
	const navigate = useNavigate();
	const location = useLocation();
	const isInicioActive = location.pathname === '/medico';
	const isHistoriaActiva = location.pathname === '/medico/historia-medica';
	const isInventarioActive = location.pathname === '/medico/inventario-pertenencias';

	return (
		<div className="min-h-screen bg-[radial-gradient(circle_at_top_right,_rgba(126,29,59,0.10),_transparent_25%),linear-gradient(180deg,_#f8fafc_0%,_#eef2f7_100%)] text-slate-900">
			<header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 px-4 py-4 shadow-sm backdrop-blur md:px-6">
				<div className="mx-auto flex max-w-7xl flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
					<div className="flex items-center gap-4">
						<img
							src={marakameLogo}
							alt="Logo Nayarit Marakame"
							className="h-12 w-auto rounded-xl border border-slate-200 bg-white p-1 shadow-sm"
						/>
						<div>
							<p className="text-xs uppercase tracking-[0.25em] text-[#7E1D3B]">Instituto Marakame</p>
							<h1 className="text-xl font-black uppercase tracking-tight text-[#7E1D3B]">Inventario de pertenencias</h1>
							<p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">Formato de ingreso</p>
						</div>
					</div>

					<div className="flex flex-wrap items-center gap-3">
						<div className="relative min-w-[240px] flex-1 xl:flex-none xl:w-[320px]">
							<Search className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
							<input
								type="text"
								placeholder="Buscar paciente, clave o artículo..."
								className="w-full rounded-2xl border border-slate-200 bg-white py-3 pl-11 pr-4 text-sm outline-none transition focus:border-[#7E1D3B] focus:ring-2 focus:ring-[#7E1D3B]/15"
							/>
						</div>
						<button
							type="button"
							onClick={() => navigate('/medico')}
							className="inline-flex items-center gap-2 rounded-xl bg-[#7E1D3B] px-5 py-3 text-sm font-bold text-white shadow-md shadow-rose-900/15 transition hover:bg-[#63162e]"
						>
							Volver al inicio <ArrowRight size={18} />
						</button>
					</div>
				</div>
			</header>

			<main className="mx-auto w-full max-w-7xl px-4 py-5 md:px-6 md:py-6">
				<div className="grid gap-4 md:grid-cols-[220px_1fr]">
					<aside className="rounded-3xl bg-gradient-to-b from-slate-100 to-white p-3 shadow-inner">
						<button
							onClick={() => navigate('/medico')}
							className={`mb-3 w-full rounded-xl px-3 py-3 text-sm font-semibold shadow-md transition ${
								isInicioActive
									? 'bg-[#7E1D3B] text-white hover:bg-[#63162e]'
									: 'border border-[#7E1D3B]/20 bg-[#7E1D3B]/8 text-[#7E1D3B] hover:bg-[#7E1D3B]/12'
							}`}
						>
							Inicio
						</button>
						<button
							onClick={() => navigate('/medico/historia-medica')}
							className={`mb-2 w-full rounded-xl px-3 py-3 text-sm font-semibold transition ${
								isHistoriaActiva
									? 'bg-[#7E1D3B] text-white shadow-md hover:bg-[#63162e]'
									: 'border border-[#7E1D3B]/20 bg-[#7E1D3B]/8 text-[#7E1D3B] hover:bg-[#7E1D3B]/12'
							}`}
						>
							Historia médica
						</button>
						<button
							onClick={() => navigate('/medico/inventario-pertenencias')}
							className={`mb-2 w-full rounded-xl px-3 py-3 text-sm font-semibold transition ${
								isInventarioActive
									? 'bg-[#7E1D3B] text-white shadow-md hover:bg-[#63162e]'
									: 'border border-[#7E1D3B]/20 bg-[#7E1D3B]/8 text-[#7E1D3B] hover:bg-[#7E1D3B]/12'
							}`}
						>
							Inventario
						</button>
						<button className="w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50">
							Acceso futuro
						</button>

						
					</aside>

					<div className="space-y-5">
						<section className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm md:p-6">
							<h2 className="text-center text-2xl font-black uppercase tracking-tight text-slate-900">Inventario de pertenencias</h2>

							<div className="mt-5 grid gap-4 md:grid-cols-[1.4fr_0.45fr_0.7fr_0.4fr_0.95fr]">
								<div>
									<label className="mb-1 block text-sm font-semibold text-slate-700">Nombre del paciente</label>
									<input className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-[#7E1D3B]" />
								</div>
								<div>
									<label className="mb-1 block text-sm font-semibold text-slate-700">Clave</label>
									<input className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-[#7E1D3B]" />
								</div>
								<div>
									<label className="mb-1 block text-sm font-semibold text-slate-700">Unidad</label>
									<select className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-[#7E1D3B]">
										<option>Dtox</option>
										<option>Unidad 1</option>
										<option>Unidad 2</option>
									</select>
								</div>
								<div>
									<label className="mb-1 block text-sm font-semibold text-slate-700">Cama</label>
									<input className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-[#7E1D3B]" />
								</div>
								<div>
									<label className="mb-1 block text-sm font-semibold text-slate-700">Fecha de ingreso</label>
									<input type="date" className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-[#7E1D3B]" />
								</div>
							</div>

							<div className="mt-6 overflow-x-auto rounded-2xl border border-slate-300">
								<table className="min-w-[980px] w-full border-collapse text-sm">
									<thead>
										<tr className="bg-slate-100 text-xs uppercase tracking-[0.2em] text-slate-600">
											<th className="border border-slate-300 px-3 py-2 text-left">Descripción</th>
											<th className="border border-slate-300 px-3 py-2 text-left">Cantidad</th>
											<th className="border border-slate-300 px-3 py-2 text-left">Observaciones</th>
										</tr>
									</thead>
									<tbody>
										<tr>
											<td colSpan={3} className="border border-slate-300 bg-slate-100 px-3 py-2 text-center text-xs font-black uppercase tracking-[0.2em] text-slate-700">Ropa de uso diario</td>
										</tr>
										{ropaDiaria.map((item) => (
											<tr key={item}>
												<td className="border border-slate-300 px-3 py-2">{item}</td>
												<td className="border border-slate-300 px-3 py-2"><input defaultValue="-" className="w-full bg-transparent outline-none" /></td>
												<td className="border border-slate-300 px-3 py-2"><input className="w-full bg-transparent outline-none" /></td>
											</tr>
										))}

										<tr>
											<td colSpan={3} className="border border-slate-300 bg-slate-100 px-3 py-2 text-center text-xs font-black uppercase tracking-[0.2em] text-slate-700">Calzado</td>
										</tr>
										{calzado.map((item) => (
											<tr key={item}>
												<td className="border border-slate-300 px-3 py-2">{item}</td>
												<td className="border border-slate-300 px-3 py-2"><input defaultValue="-" className="w-full bg-transparent outline-none" /></td>
												<td className="border border-slate-300 px-3 py-2"><input className="w-full bg-transparent outline-none" /></td>
											</tr>
										))}

										<tr>
											<td colSpan={3} className="border border-slate-300 bg-slate-100 px-3 py-2 text-center text-xs font-black uppercase tracking-[0.2em] text-slate-700">Otros artículos</td>
										</tr>
										{otrosArticulos.map((item) => (
											<tr key={item}>
												<td className="border border-slate-300 px-3 py-2">{item}</td>
												<td className="border border-slate-300 px-3 py-2"><input defaultValue="-" className="w-full bg-transparent outline-none" /></td>
												<td className="border border-slate-300 px-3 py-2"><input className="w-full bg-transparent outline-none" /></td>
											</tr>
										))}
									</tbody>
								</table>
							</div>

							<div className="mt-6 grid gap-4 md:grid-cols-2">
								<div className="rounded-2xl border border-slate-300 p-4">
									<label className="mb-2 block text-sm font-semibold text-slate-700">Nombre  del paciente</label>
									<input placeholder="Nombre completo" className="mb-3 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-[#7E1D3B]" />
								</div>
								<div className="rounded-2xl border border-slate-300 p-4">
									<label className="mb-2 block text-sm font-semibold text-slate-700">Nombre del terapeuta de campo</label>
									<input placeholder="Nombre completo" className="mb-3 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-[#7E1D3B]" />
								</div>
							</div>

							<div className="mt-5 flex justify-end">
								<button type="button" className="rounded-xl bg-[#7E1D3B] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#63162e]">
									Guardar formulario
								</button>
							</div>
						</section>
					</div>
				</div>
			</main>
		</div>
	);
};

export default InventarioPertenencias;