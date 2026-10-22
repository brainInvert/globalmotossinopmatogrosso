import React, { useState } from 'react';
import { X, Lock, Mail, AlertCircle, ArrowRight, ShieldCheck, Check } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const AuthModal: React.FC = () => {
  const { authModalOpen, closeAuthModal, login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!authModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setIsSubmitting(true);

    try {
      await login({ email, password });
    } catch (err: any) {
      setErrorMessage(err.message || 'Credenciais inválidas. Verifique os dados e tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const fillAdminCredentials = () => {
    setEmail('admin@globalmotos.com.br');
    setPassword('admin123');
    setErrorMessage('');
  };

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) closeAuthModal();
      }}
    >
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200 flex flex-col">
        {/* Header with Blue Identity */}
        <div className="bg-gradient-to-r from-blue-700 to-blue-600 px-6 pt-6 pb-5 text-white relative">
          <button
            onClick={closeAuthModal}
            className="absolute top-4 right-4 p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center cursor-pointer"
            aria-label="Fechar"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 mb-2">
            <span className="w-7 h-7 rounded-lg bg-white/20 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4 text-white" />
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-blue-100">
              Global Motos · Gestão
            </span>
          </div>

          <h3 className="font-['Outfit'] text-xl font-extrabold tracking-tight">
            Acesso Administrativo
          </h3>
          <p className="text-xs text-blue-100/90 mt-1 leading-relaxed">
            Área exclusiva para a administração cadastrar motos, gerenciar fotos e moderar anúncios da plataforma.
          </p>
        </div>

        {/* Notice explaining registration rule */}
        <div className="px-6 py-2.5 bg-blue-50/70 border-b border-blue-100 text-[11px] text-blue-800 flex items-center gap-2">
          <ShieldCheck className="w-3.5 h-3.5 text-blue-600 shrink-0" />
          <span>O cadastro e gerenciamento de anúncios são restritos à administração.</span>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {errorMessage && (
            <div className="flex items-start gap-2.5 p-3 text-xs text-rose-700 bg-rose-50 border border-rose-200 rounded-lg">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              E-mail do Administrador
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@globalmotos.com.br"
                className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-600 focus:bg-white transition-all text-slate-900"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Senha de Acesso
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-600 focus:bg-white transition-all text-slate-900"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full mt-2 flex items-center justify-center gap-2 py-2.5 px-4 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 rounded-lg shadow-sm shadow-blue-200 transition-all cursor-pointer min-h-[44px]"
          >
            {isSubmitting ? (
              <span>Autenticando...</span>
            ) : (
              <>
                <span>Entrar no Painel Global Motos</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Quick Demo Credentials Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 text-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="font-semibold text-slate-700">
              Acesso rápido para demonstração:
            </span>
            <span className="text-[10px] text-blue-600 font-bold bg-blue-50 px-2 py-0.5 rounded">
              Ambiente de Testes
            </span>
          </div>
          <button
            type="button"
            onClick={fillAdminCredentials}
            className="w-full py-2 px-3 bg-white hover:bg-blue-50 hover:text-blue-700 hover:border-blue-300 border border-slate-200 rounded-lg text-slate-700 font-medium text-xs transition-colors flex items-center justify-center gap-2 min-h-[40px] cursor-pointer"
          >
            <Check className="w-3.5 h-3.5 text-blue-600" />
            <span>Preencher Credenciais Admin (admin@globalmotos.com.br)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
