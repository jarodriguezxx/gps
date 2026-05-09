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
