import { motion } from 'motion/react';
import fotoPerfil from '../assets/Foto de perfil.jpeg';

export function Authority() {
  const scrollVariant = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
    }
  };

  return (
    <section className="py-20 relative overflow-hidden bg-white px-6 md:px-12" id="autoridade">
      <div className="max-w-[1140px] mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">

          {/* Photo Column (Right Side on desktop, first on mobile) */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={scrollVariant}
            className="lg:col-span-5 flex justify-center lg:order-2"
          >
            <div className="w-full max-w-[420px] rounded-[24px] overflow-hidden shadow-md">
              <img
                src={fotoPerfil}
                alt="Rebeka Vilarouca"
                className="w-full h-auto block object-cover"
              />
            </div>
          </motion.div>

          {/* Text Column (Left Side on desktop, second on mobile) */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={scrollVariant}
            className="lg:col-span-7 space-y-6 lg:order-1"
          >
            {/* Biography Title */}
            <h2 className="font-serif text-3xl md:text-4xl text-maroon font-semibold tracking-tight">
              Rebeka Vilarouca
            </h2>

            {/* Biography Paragraphs */}
            <div className="space-y-6 text-[#21303e] font-sans text-sm md:text-base leading-relaxed text-justify">
              <p>
                Advogada Previdenciarista e criadora do Protocolo TARP - Trabalhador de Alto Risco Protegido, um método de planejamento previdenciário desenvolvido especialmente para trabalhadores expostos a riscos que desejam construir uma aposentadoria com segurança, estratégia e previsibilidade.
              </p>
              <p>
                Ao longo da sua atuação, Rebeka Vilarouca estruturou um protocolo próprio voltado ao planejamento da aposentadoria do trabalhador exposto a agentes nocivos, organização do histórico contributivo, identificação de falhas e riscos, correção de inconsistências, análise de PPPs, e definição do melhor caminho para a sua aposentadoria, sempre com foco em evitar prejuízos financeiros e decisões precipitadas.
              </p>
              <p>
                Seu objetivo é garantir que você conheça seus direitos e consiga a melhor aposentadoria no menor tempo possível, evitando perdas financeiras e garantindo a averbação correta do tempo de atividade especial.
              </p>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
