// Limite padrão (MB) — ajuste como preferir
const DEFAULT_MAX_MB = 10;

class ApiService {
  // ... resto do arquivo inalterado ...

  async uploadImage(file, opts = { maxMB: DEFAULT_MAX_MB }) {
    // Checagem no cliente: tipo e tamanho
    if (!file.type.startsWith('image/')) {
      throw new Error('Formato inválido. Envie uma imagem (JPEG, PNG, WEBP...).');
    }
    const maxBytes = (opts.maxMB ?? DEFAULT_MAX_MB) * 1024 * 1024;
    if (file.size > maxBytes) {
      throw new Error(`Arquivo muito grande. Tamanho máximo: ${opts.maxMB ?? DEFAULT_MAX_MB} MB.`);
    }

    const formData = new FormData();
    formData.append('file', file);

    const res = await fetch(`${API_BASE_URL}/api/uploads/image`, {
      method: 'POST',
      body: formData,
    });

    if (res.status === 413) {
      // Nginx/Server rejeitou por tamanho
      throw new Error('Arquivo muito grande para o servidor (413). Tente um arquivo menor.');
    }

    if (!res.ok) {
      const txt = await res.text();
      throw new Error(txt || 'Falha no upload');
    }

    return await res.json(); // { public_id, thumbnail_url, medium_url, large_url }
  }
}

