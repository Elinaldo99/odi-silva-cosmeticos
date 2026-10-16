import React, { useState, useEffect } from 'react';
import {
  X,
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Loader2,
  LogOut,
  ShieldCheck,
  ShoppingBag,
  ExternalLink,
  Settings,
} from 'lucide-react';
import { useAuth, AuthMode } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export const AuthModal: React.FC = () => {
  const {
    isAuthModalOpen,
    closeAuthModal,
    authMode,
    setAuthMode,
    signInWithEmail,
    signUpWithEmail,
    resetPasswordForEmail,
    signOut,
    user,
    profile,
    isAdmin,
  } = useAuth();

  const { showNotification, setIsAdminOpen } = useCart();

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Reset form when modal opens or mode changes
  useEffect(() => {
    if (isAuthModalOpen) {
      setErrorMessage(null);
      setSuccessMessage(null);
      setPassword('');
      setConfirmPassword('');
      setShowPassword(false);
    }
  }, [isAuthModalOpen, authMode]);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isAuthModalOpen) {
        closeAuthModal();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isAuthModalOpen, closeAuthModal]);

  if (!isAuthModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);
    setIsSubmitting(true);

    try {
      if (authMode === 'login') {
        if (!email || !password) {
          setErrorMessage('Por favor, preencha o e-mail e a senha.');
          setIsSubmitting(false);
          return;
        }

        const { error } = await signInWithEmail(email, password);
        if (error) {
          setErrorMessage(error);
        } else {
          showNotification('Bem-vinda(o) de volta à Odi Silva! 💗');
        }
      } else if (authMode === 'register') {
        if (!name.trim()) {
          setErrorMessage('Por favor, informe seu nome completo.');
          setIsSubmitting(false);
          return;
        }
        if (!email || !password) {
          setErrorMessage('Por favor, preencha todos os campos obrigatórios.');
          setIsSubmitting(false);
          return;
        }
        if (password.length < 6) {
          setErrorMessage('A senha deve ter pelo menos 6 dígitos para sua segurança.');
          setIsSubmitting(false);
          return;
        }
        if (password !== confirmPassword) {
          setErrorMessage('As senhas digitadas não coincidem.');
          setIsSubmitting(false);
          return;
        }

        const { error, requiresConfirmation } = await signUpWithEmail(email, password, name);
        if (error) {
          setErrorMessage(error);
        } else if (requiresConfirmation) {
          setSuccessMessage(
            'Conta criada com sucesso! Enviamos um link de confirmação para o seu e-mail.'
          );
        } else {
          showNotification('Conta criada com sucesso! Seja bem-vinda(o) 💗');
        }
      } else if (authMode === 'forgot') {
        if (!email) {
          setErrorMessage('Por favor, informe o seu e-mail cadastrado.');
          setIsSubmitting(false);
          return;
        }

        const { error } = await resetPasswordForEmail(email);
        if (error) {
          setErrorMessage(error);
        } else {
          setSuccessMessage(
            'Enviamos as instruções de recuperação para o seu e-mail. Verifique sua caixa de entrada.'
          );
        }
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogout = async () => {
    await signOut();
    closeAuthModal();
    showNotification('Você saiu da sua conta com sucesso.');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto bg-stone-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      {/* Background click to dismiss */}
      <div className="fixed inset-0" onClick={closeAuthModal} />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-pink-100/80 overflow-hidden z-10 transition-all">
        {/* Decorative Luxury Top Glow */}
        <div className="h-2 bg-gradient-to-r from-pink-500 via-rose-400 to-amber-300" />

        {/* Close Button */}
        <button
          onClick={closeAuthModal}
          className="absolute top-5 right-5 p-2 rounded-full text-stone-400 hover:text-stone-700 hover:bg-pink-50 transition-colors focus:outline-none"
          aria-label="Fechar modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* If user is already logged in, show user profile view */}
        {user ? (
          <div className="p-8 text-center">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-tr from-pink-500 to-rose-400 p-1 shadow-lg shadow-pink-200/50">
              <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
                <span className="font-serif text-2xl font-bold text-pink-600 uppercase">
                  {profile?.nome?.charAt(0) || user.email?.charAt(0) || 'U'}
                </span>
              </div>
            </div>

            {isAdmin ? (
              <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold mb-2 shadow-sm">
                <ShieldCheck className="w-4 h-4 text-amber-600" />
                <span>Administrador da Loja 👑</span>
              </div>
            ) : (
              <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-pink-50 text-pink-700 text-xs font-semibold mb-2">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Cliente VIP Odi Silva</span>
              </div>
            )}

            <h3 className="text-xl font-serif font-bold text-stone-900">
              {profile?.nome || 'Minha Conta'}
            </h3>
            <p className="text-xs text-stone-500 mt-0.5">{user.email}</p>

            <div className="my-6 p-4 rounded-2xl bg-stone-50 border border-stone-100 text-left space-y-2">
              <div className="flex items-center justify-between text-xs text-stone-600">
                <span className="font-medium text-stone-500">ID da Conta:</span>
                <span className="font-mono text-stone-400 text-[11px] truncate max-w-[170px]">
                  {user.id}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs text-stone-600">
                <span className="font-medium text-stone-500">Nível de Acesso:</span>
                <span className="font-semibold text-stone-800 capitalize">
                  {isAdmin ? 'Administrador' : 'Cliente'}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs text-stone-600">
                <span className="font-medium text-stone-500">Status:</span>
                <span className="inline-flex items-center gap-1 text-emerald-600 font-semibold">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Autenticado no Supabase
                </span>
              </div>
            </div>

            <div className="space-y-3">
              {isAdmin && (
                <button
                  onClick={() => {
                    closeAuthModal();
                    setIsAdminOpen(true);
                  }}
                  className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold text-sm shadow-md shadow-amber-200 flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
                >
                  <Settings className="w-4 h-4" />
                  <span>Abrir Painel Administrativo</span>
                </button>
              )}

              <button
                onClick={handleLogout}
                className="w-full py-3 px-4 rounded-2xl border border-rose-200 bg-rose-50/50 hover:bg-rose-100 text-rose-700 font-medium text-sm flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
              >
                <LogOut className="w-4 h-4" />
                <span>Sair da Conta</span>
              </button>

              <button
                onClick={closeAuthModal}
                className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-pink-600 to-rose-500 text-white font-medium text-sm shadow-md shadow-pink-200 hover:brightness-105 transition-all"
              >
                Continuar Navegando
              </button>
            </div>
          </div>
        ) : (
          <div className="p-6 sm:p-8">
            {/* Header Brand */}
            <div className="text-center mb-6">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-50 border border-pink-100 text-pink-600 text-xs font-semibold mb-2">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Área Exclusiva</span>
              </div>
              <h2 className="font-serif text-2xl font-bold text-stone-900 tracking-tight">
                {authMode === 'login' && 'Entrar na sua Conta'}
                {authMode === 'register' && 'Crie sua Conta'}
                {authMode === 'forgot' && 'Recuperar Senha'}
              </h2>
              <p className="text-xs text-stone-500 mt-1 max-w-xs mx-auto">
                {authMode === 'login' &&
                  'Acesse para acompanhar seus pedidos favoritos e ter atendimento prioritário.'}
                {authMode === 'register' &&
                  'Cadastre-se para aproveitar ofertas exclusivas e agilidade em suas compras.'}
                {authMode === 'forgot' &&
                  'Digite seu e-mail e enviaremos um link seguro para redefinir sua senha.'}
              </p>
            </div>

            {/* Mode Switcher Tabs */}
            {authMode !== 'forgot' && (
              <div className="flex p-1 mb-6 bg-pink-50/60 rounded-2xl border border-pink-100">
                <button
                  type="button"
                  onClick={() => setAuthMode('login')}
                  className={`flex-1 py-2 text-xs font-semibold rounded-xl transition-all ${
                    authMode === 'login'
                      ? 'bg-white text-pink-700 shadow-sm'
                      : 'text-stone-500 hover:text-stone-800'
                  }`}
                >
                  Já tenho conta
                </button>
                <button
                  type="button"
                  onClick={() => setAuthMode('register')}
                  className={`flex-1 py-2 text-xs font-semibold rounded-xl transition-all ${
                    authMode === 'register'
                      ? 'bg-white text-pink-700 shadow-sm'
                      : 'text-stone-500 hover:text-stone-800'
                  }`}
                >
                  Criar conta nova
                </button>
              </div>
            )}

            {/* Alerts */}
            {errorMessage && (
              <div className="mb-5 p-3.5 rounded-2xl bg-rose-50 border border-rose-200/80 flex items-start gap-2.5 text-rose-700 text-xs leading-relaxed animate-in fade-in">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-500" />
                <span>{errorMessage}</span>
              </div>
            )}

            {successMessage && (
              <div className="mb-5 p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200/80 flex items-start gap-2.5 text-emerald-800 text-xs leading-relaxed animate-in fade-in">
                <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-600" />
                <span>{successMessage}</span>
              </div>
            )}

            {/* Main Auth Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name field for Register */}
              {authMode === 'register' && (
                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1.5">
                    Nome Completo
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Ex: Amanda Silva"
                      className="w-full pl-10 pr-4 py-2.5 bg-stone-50 border border-stone-200 rounded-2xl text-xs sm:text-sm text-stone-800 placeholder-stone-400 focus:outline-none focus:border-pink-500 focus:bg-white transition-all"
                    />
                  </div>
                </div>
              )}

              {/* Email field */}
              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1.5">
                  E-mail
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="seuemail@exemplo.com"
                    className="w-full pl-10 pr-4 py-2.5 bg-stone-50 border border-stone-200 rounded-2xl text-xs sm:text-sm text-stone-800 placeholder-stone-400 focus:outline-none focus:border-pink-500 focus:bg-white transition-all"
                  />
                </div>
              </div>

              {/* Password field */}
              {authMode !== 'forgot' && (
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-medium text-stone-700">
                      Senha
                    </label>
                    {authMode === 'login' && (
                      <button
                        type="button"
                        onClick={() => setAuthMode('forgot')}
                        className="text-[11px] text-pink-600 hover:text-pink-700 font-medium hover:underline focus:outline-none"
                      >
                        Esqueceu a senha?
                      </button>
                    )}
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder={authMode === 'register' ? 'Mínimo de 6 caracteres' : '••••••••'}
                      className="w-full pl-10 pr-10 py-2.5 bg-stone-50 border border-stone-200 rounded-2xl text-xs sm:text-sm text-stone-800 placeholder-stone-400 focus:outline-none focus:border-pink-500 focus:bg-white transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-3 text-stone-400 hover:text-stone-600 focus:outline-none"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              )}

              {/* Confirm Password field for Register */}
              {authMode === 'register' && (
                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1.5">
                    Confirmar Senha
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Repita a mesma senha"
                      className="w-full pl-10 pr-10 py-2.5 bg-stone-50 border border-stone-200 rounded-2xl text-xs sm:text-sm text-stone-800 placeholder-stone-400 focus:outline-none focus:border-pink-500 focus:bg-white transition-all"
                    />
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full mt-2 py-3.5 px-4 rounded-2xl bg-gradient-to-r from-pink-600 via-rose-500 to-pink-600 text-white font-semibold text-sm shadow-lg shadow-pink-200/80 hover:shadow-xl hover:shadow-pink-300/80 hover:brightness-105 active:scale-[0.99] transition-all disabled:opacity-60 flex items-center justify-center gap-2 cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Aguarde um momento...</span>
                  </>
                ) : (
                  <>
                    <span>
                      {authMode === 'login' && 'Entrar na Conta'}
                      {authMode === 'register' && 'Concluir Cadastro'}
                      {authMode === 'forgot' && 'Enviar Link de Recuperação'}
                    </span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* Bottom mode switches */}
            <div className="mt-6 pt-5 border-t border-stone-100 text-center">
              {authMode === 'forgot' ? (
                <button
                  type="button"
                  onClick={() => setAuthMode('login')}
                  className="text-xs text-pink-600 hover:text-pink-700 font-semibold inline-flex items-center gap-1 hover:underline"
                >
                  ← Voltar para o Login
                </button>
              ) : authMode === 'login' ? (
                <p className="text-xs text-stone-500">
                  Ainda não tem conta?{' '}
                  <button
                    type="button"
                    onClick={() => setAuthMode('register')}
                    className="text-pink-600 hover:text-pink-700 font-semibold hover:underline"
                  >
                    Cadastre-se gratuitamente
                  </button>
                </p>
              ) : (
                <p className="text-xs text-stone-500">
                  Já possui conta cadastrada?{' '}
                  <button
                    type="button"
                    onClick={() => setAuthMode('login')}
                    className="text-pink-600 hover:text-pink-700 font-semibold hover:underline"
                  >
                    Fazer login
                  </button>
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
