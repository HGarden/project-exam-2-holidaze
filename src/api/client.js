import { apiURL, withAuthHeaders } from '../constants/apiURL.jsx';

function buildUrl(path, params) {
  const url = new URL(apiURL + path);
  if (params && typeof params === 'object') {
    Object.entries(params).forEach(([k, v]) => {
      if (v === undefined || v === null || v === '') return;
      url.searchParams.set(k, String(v));
    });
  }
  return url.toString();
}

async function parse(res) {
  const ct = res.headers.get('content-type') || '';
  const isJson = ct.includes('application/json');
  const data = isJson ? await res.json() : await res.text();
  if (!res.ok) {
    const msg = isJson ? (data?.errors?.[0]?.message || data?.message) : String(data);
    const err = new Error(msg || `Request failed (${res.status})`);
    err.status = res.status;
    err.body = data;
    throw err;
  }
  return data;
}

export async function request(method, path, { token, params, body, headers } = {}) {
  const url = buildUrl(path, params);
  const init = {
    method,
    headers: withAuthHeaders(token, {
      ...(body ? { 'Content-Type': 'application/json' } : {}),
      ...headers,
    }),
    ...(body ? { body: JSON.stringify(body) } : {}),
  };
  const res = await fetch(url, init);
  return parse(res);
}

export const get = (path, opts) => request('GET', path, opts);
export const post = (path, body, opts = {}) => request('POST', path, { ...opts, body });
export const put = (path, body, opts = {}) => request('PUT', path, { ...opts, body });
export const del = (path, opts) => request('DELETE', path, opts);
