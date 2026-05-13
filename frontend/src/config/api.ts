const DEFAULT_HOST = import.meta.env.VITE_API_HOST || 'http://localhost:4000';
export const API_HOST = DEFAULT_HOST;
export const API_BASE = import.meta.env.VITE_API_URL || `${DEFAULT_HOST}/api`;

export async function fetchJson(path, opts = {}) {
	const url = String(path || '').startsWith('http') ? path : `${API_BASE}${path.startsWith('/') ? '' : '/'}${path}`;
	const res = await fetch(url, opts);
	if (!res.ok) {
		const text = await res.text().catch(() => '');
		const err = new Error(text || `HTTP ${res.status}`);
		// attach response for caller if needed
		// @ts-ignore
		err.response = res;
		throw err;
	}
	return res.json();
}

export function getXRoleHeader() {
	try {
		const user = JSON.parse(localStorage.getItem('marakame_user') || '{}');
		const rol = (user.rol || '').toString().trim();
		const puesto = (user.puesto || '').toString().trim();
		const isJefe = /JEFE|JEFA/i.test(puesto);
		if (isJefe && /MÉDICO|MEDICO/i.test(rol)) return 'jefe-medico';
		if (isJefe && /CLINICO|CLÍNICO/i.test(rol)) return 'jefe-clinico';
		if (isJefe && /ADMISIONES/i.test(rol)) return 'jefe-admisiones';
		if (/ADMINISTRACION|ADMINISTRACIÓN/i.test(rol) || /ADMINISTRACION/i.test(puesto)) return 'administracion';
		if (/DIRECCION|DIRECTORA GENERAL|DIRECTOR GENERAL/i.test(puesto) || /DIRECCION-GENERAL|DIRECCION GENERAL/i.test(rol)) return 'direccion-general';
		if (/MÉDICO|MEDICO/i.test(rol)) return 'medico';
		if (/CLINICO|CLÍNICO/i.test(rol)) return 'clinico';
		if (/ADMISIONES/i.test(rol)) return 'admisiones';
		return '';
	} catch {
		return '';
	}
}
