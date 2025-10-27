import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, Link } from 'react-router-dom';
import { apiService } from '../services/api';

const CategoryCreate = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name_pt: '',
    name_en: '',
    name_es: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [err, setErr] = useState('');

  const containerStyle = {
    maxWidth: '900px',
    margin: '0 auto',
    padding: '2rem',
  };
  const titleStyle = {
    fontSize: '2rem',
    color: '#2E8B57',
    marginBottom: '1.5rem',
    fontWeight: 'bold',
  };
  const labelStyle = {
    display: 'block',
    fontWeight: '600',
    marginBottom: '0.5rem',
    color: '#374151',
  };
  const inputStyle = {
    width: '100%',
    border: '1px solid #d1d5db',
    borderRadius: '8px',
    padding: '0.75rem 0.9rem',
    outline: 'none',
    marginBottom: '1rem',
  };
  const buttonPrimary = {
    backgroundColor: '#2E8B57',
    color: 'white',
    border: 'none',
    padding: '0.75rem 1.5rem',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '1rem',
    fontWeight: 'bold',
    textDecoration: 'none',
    display: 'inline-block',
    marginRight: '0.75rem',
  };
  const buttonSecondary = {
    backgroundColor: '#e5e7eb',
    color: '#111827',
    border: 'none',
    padding: '0.75rem 1.5rem',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '1rem',
    fontWeight: 'bold',
    textDecoration: 'none',
  };

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setErr('');
    setSubmitting(true);

    try {
      await apiService.createCategory({
        name_pt: form.name_pt.trim(),
        name_en: form.name_en.trim(),
        name_es: form.name_es.trim(),
      });
      navigate('/categories');
    } catch (e) {
      console.error('Erro ao criar categoria:', e);
      setErr(e.message || t('categories.createError', 'Não foi possível criar a categoria.'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={containerStyle}>
      <h1 style={titleStyle}>
        {t('categories.createTitle', '➕ Cadastrar Nova Categoria')}
      </h1>

      {err && (
        <div
          style={{
            backgroundColor: '#fee2e2',
            border: '1px solid #ef4444',
            color: '#991b1b',
            padding: '0.75rem 1rem',
            borderRadius: '8px',
            marginBottom: '1rem',
          }}
        >
          {err}
        </div>
      )}

      <form onSubmit={onSubmit}>
        <div>
          <label htmlFor="name_pt" style={labelStyle}>
            {t('categories.namePt', 'Nome (Português)')}
          </label>
          <input
            id="name_pt"
            name="name_pt"
            value={form.name_pt}
            onChange={onChange}
            placeholder={t('categories.namePtPlaceholder', 'Ex.: Sobremesas')}
            required
            style={inputStyle}
          />
        </div>

        <div>
          <label htmlFor="name_en" style={labelStyle}>
            {t('categories.nameEn', 'Nome (Inglês)')}
          </label>
          <input
            id="name_en"
            name="name_en"
            value={form.name_en}
            onChange={onChange}
            placeholder={t('categories.nameEnPlaceholder', 'e.g., Desserts')}
            required
            style={inputStyle}
          />
        </div>

        <div>
          <label htmlFor="name_es" style={labelStyle}>
            {t('categories.nameEs', 'Nome (Espanhol)')}
          </label>
          <input
            id="name_es"
            name="name_es"
            value={form.name_es}
            onChange={onChange}
            placeholder={t('categories.nameEsPlaceholder', 'p. ej., Postres')}
            required
            style={inputStyle}
          />
        </div>

        <div style={{ marginTop: '1.25rem' }}>
          <button type="submit" disabled={submitting} style={buttonPrimary}>
            {submitting
              ? t('categories.saving', 'Salvando...')
              : t('categories.save', 'Salvar Categoria')}
          </button>

          <Link to="/categories" style={buttonSecondary}>
            {t('common.cancel', 'Cancelar')}
          </Link>
        </div>
      </form>
    </div>
  );
};

export default CategoryCreate;
