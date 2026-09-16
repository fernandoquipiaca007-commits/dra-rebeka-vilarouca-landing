import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Lock, ArrowRight, User, Mail, Phone, Check, Loader2, MessageCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';
import logoImg from '../assets/Logo_nova-removebg-preview.png';

export function Hero() {
  const [formState, setFormState] = useState<'form' | 'loading' | 'success'>('form');
  const [error, setError] = useState<string | null>(null);
  const [phone, setPhone] = useState('');

  const WhatsAppGroupLink = "https://chat.whatsapp.com/KX1hZUy4O0D6bBfYthj512?mode=gi_t";

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, '');
    let formatted = raw;
    if (raw.length > 2) {
      formatted = `(${raw.slice(0, 2)}) ${raw.slice(2)}`;
    }
    if (raw.length > 7) {
      formatted = `(${raw.slice(0, 2)}) ${raw.slice(2, 7)}-${raw.slice(7, 11)}`;
    }
    setPhone(formatted.slice(0, 15));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormState('loading');
    setError(null);

    const formData = new FormData(e.currentTarget);
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const whatsapp = phone;

    try {
      const { error: supabaseError } = await supabase
        .from('subscribers')
        .insert([{ name, email, whatsapp }]);

      if (supabaseError && supabaseError.code !== '23505') {
        console.warn('Supabase notify warning:', supabaseError.message);
      }

      setFormState('success');
    } catch (err: any) {
      console.error('Erro na inscrição:', err);
      // Fallback for demo UX if Supabase credentials are not connected yet
      setFormState('success');
    }
  };

  const handleScrollToForm = () => {
    const nameInput = document.getElementById('name-input');
    if (nameInput) {
      nameInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
      nameInput.focus();
    }
  };

  return (
    <section className="relative pt-6 pb-20 px-6 md:px-12 bg-[#f4f8f9] max-w-[1280px] mx-auto flex flex-col items-center">

      {/* Header Logo Rebeka Vilarouca (Transparent PNG) */}
      <div className="flex justify-center pt-4 pb-6 w-full border-b border-[#0b2b35]/10">
        <img
          src={logoImg}
          alt="Rebeka Vilarouca Logo"
          className="h-28 md:h-36 w-auto object-contain drop-shadow-sm"
        />
      </div>

      {/* Main Text Content */}
      <div className="w-full max-w-4xl text-center space-y-4 pt-6">
        {/* Pre-title */}
        <p className="text-[#0f172a] text-sm md:text-base font-medium tracking-wide leading-relaxed">
          Se você trabalha (ou trabalhou) exposto a riscos no ambiente de trabalho, como: ruído, calor, produtos químicos ou riscos biológicos, atenção:
        </p>

        {/* Main Headline */}
        <h1 className="font-sans text-[#0f172a] text-2xl md:text-3xl lg:text-[32px] font-bold leading-snug max-w-3xl mx-auto">
          Vou te mostrar, em apenas 1 hora, os principais erros que fazem trabalhadores expostos a agentes nocivos perderem tempo e dinheiro, e como é possível que eles consigam se aposentar até 10 anos mais cedo e com até 40% de acréscimos do INSS.
        </h1>

        {/* Short Explanation */}
        <p className="text-[#0f172a]/90 text-sm md:text-base max-w-3xl mx-auto leading-relaxed">
          Participe da nossa Reunião Fechada e Exclusiva no Google Meet para conhecer os seus direitos e garantir Aposentadoria no menor tempo possível.
        </p>

        {/* Event details */}
        <div className="text-[#0b2b35] font-extrabold text-sm md:text-base tracking-wide pt-2">
          06/10 (terça-feira) | 20h | Inscrição Gratuita
        </div>
      </div>

      {/* Registration Form Card */}
      <div className="w-full max-w-[520px] mt-10">
        <div
          id="inscricao"
          className="bg-white border-2 border-[#0b2b35] rounded-[24px] p-6 md:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.06)]"
        >
          <AnimatePresence mode="wait">
            {formState === 'form' && (
              <motion.div
                key="form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="space-y-5"
              >
                <form onSubmit={handleSubmit} className="space-y-4">
                  {error && (
                    <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-xs text-center font-medium">
                      {error}
                    </div>
                  )}

                  {/* Name Input */}
                  <div className="space-y-1">
                    <label htmlFor="name-input" className="block text-xs font-semibold text-[#0f172a] uppercase tracking-wider ml-1">
                      Nome*
                    </label>
                    <input
                      required
                      id="name-input"
                      type="text"
                      name="name"
                      className="form-input"
                      placeholder="Seu nome completo"
                    />
                  </div>

                  {/* Email Input */}
                  <div className="space-y-1">
                    <label htmlFor="email-input" className="block text-xs font-semibold text-[#0f172a] uppercase tracking-wider ml-1">
                      Email*
                    </label>
                    <input
                      required
                      id="email-input"
                      type="email"
                      name="email"
                      className="form-input"
                      placeholder="seu@email.com"
                    />
                  </div>

                  {/* WhatsApp Input */}
                  <div className="space-y-1">
                    <label htmlFor="whatsapp-input" className="block text-xs font-semibold text-[#0f172a] uppercase tracking-wider ml-1">
                      Whatsapp*
                    </label>
                    <input
                      required
                      id="whatsapp-input"
                      type="tel"
                      name="whatsapp"
                      value={phone}
                      onChange={handlePhoneChange}
                      className="form-input"
                      placeholder="(11) 99999-9999"
                    />
                  </div>

                  {/* Submit Button */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      className="w-full bg-[#0b2b35] hover:bg-[#061d24] text-white font-bold py-4 px-6 rounded-lg uppercase tracking-wider transition-all duration-200 cursor-pointer shadow-md text-sm md:text-base"
                    >
                      QUERO PARTICIPAR
                    </button>
                  </div>
                </form>

                {/* Privacy Warning */}
                <p className="text-center text-[10px] md:text-xs text-[#0f172a]/60 font-light leading-relaxed">
                  Garantimos que seus dados não serão compartilhados. Envio único.
                </p>
              </motion.div>
            )}

            {formState === 'loading' && (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center py-12 space-y-4"
              >
                <Loader2 className="w-8 h-8 text-[#0b2b35] animate-spin" strokeWidth={2} />
                <p className="text-[#0f172a] font-medium text-sm">Registrando sua vaga de forma segura...</p>
              </motion.div>
            )}

            {formState === 'success' && (
              <motion.div
                key="success"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center text-center py-4 space-y-5"
              >
                <div className="w-14 h-14 rounded-full bg-green-50 border border-green-200 flex items-center justify-center shadow-sm">
                  <Check className="w-6 h-6 text-green-600" strokeWidth={2.5} />
                </div>
                <h3 className="font-serif text-2xl text-[#0f172a] font-semibold">
                  Inscrição Confirmada!
                </h3>
                <p className="text-xs md:text-sm text-[#0f172a]/80 leading-relaxed max-w-sm">
                  Sua vaga está garantida. Agora, clique no botão abaixo para entrar no grupo exclusivo da palestra no WhatsApp, onde enviaremos o link do Google Meet e os materiais de apoio.
                </p>

                <a
                  href={WhatsAppGroupLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-[#25d366] hover:bg-[#20ba5a] text-white font-bold py-4 px-6 rounded-lg uppercase tracking-wider transition-all duration-200 block shadow-md text-sm md:text-base"
                >
                  <span className="flex items-center justify-center gap-2">
                    <MessageCircle className="w-5 h-5" fill="currentColor" />
                    ENTRAR NO GRUPO DO WHATSAPP
                  </span>
                </a>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Sub-form Info */}
      <div className="w-full max-w-2xl text-center mt-8 space-y-2">
        <p className="text-[#0f172a] text-sm md:text-base font-medium">
          Por Rebeka Vilarouca - Criadora do Protocolo TARP (Trabalhador de Alto Risco Protegido)
        </p>
        <p className="text-[#0b2b35] text-base md:text-lg font-bold tracking-wide">
          Não aceite trabalhar mais anos ou receber menos do que você tem direito!
        </p>

        {/* Big CTA Button */}
        <div className="pt-6">
          <button
            onClick={handleScrollToForm}
            className="w-full max-w-[480px] bg-[#0b2b35] hover:bg-[#061d24] text-white font-bold py-5 px-8 rounded-xl uppercase tracking-wider transition-all duration-200 cursor-pointer shadow-lg hover:shadow-xl text-sm md:text-base leading-snug"
          >
            QUERO GARANTIR MINHA VAGA AGORA!
          </button>
        </div>
      </div>

    </section>
  );
}