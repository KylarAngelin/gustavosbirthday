"use client"; 

import { useState, useEffect } from "react";

type ConfettiPiece = {
  id: number;
  left: string;
  color: string;
  tx: string;
  ty: string;
  delay: string;
  duration: string;
  shape: string;
};

export default function Home() {
  const [isMounted, setIsMounted] = useState(false);
  
  // Estados para la animación
  const [showIntroText, setShowIntroText] = useState(true);
  const [darkScreen, setDarkScreen] = useState(true);
  const [fireConfetti, setFireConfetti] = useState(false);
  const [confetti, setConfetti] = useState<ConfettiPiece[]>([]);

  // Estados de control del formulario
  const [isPastDeadline, setIsPastDeadline] = useState(false);
  const [name, setName] = useState("");
  const [attendees, setAttendees] = useState("");
  const [diet, setDiet] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    setIsMounted(true);

    // 1. Restricción de fecha (16 de octubre)
    const deadline = new Date('2026-10-16T23:59:59'); 
    if (new Date() > deadline) {
      setIsPastDeadline(true);
    }

    // 2. Confeti
    const pieces = Array.from({ length: 120 }).map((_, i) => {
      const isLeftCannon = i % 2 === 0;
      return {
        id: i,
        left: isLeftCannon ? '-5%' : '105%',
        color: ['#f2d74e', '#95c3de', '#ff9a91', '#a0e8b7', '#b685e5', '#ff4d4d'][Math.floor(Math.random() * 6)],
        tx: isLeftCannon ? `${Math.random() * 60 + 20}vw` : `-${Math.random() * 60 + 20}vw`,
        ty: `-${Math.random() * 80 + 30}vh`,
        delay: `${Math.random() * 0.4}s`,
        duration: `${Math.random() * 2 + 3}s`,
        shape: Math.random() > 0.5 ? '50%' : '0%'
      };
    });
    setConfetti(pieces);

    // 3. Secuencia de tiempos de la intro
    const timerText = setTimeout(() => setShowIntroText(false), 2500);
    const timerReveal = setTimeout(() => {
      setFireConfetti(true);
      setDarkScreen(false);
    }, 3200);

    return () => {
      clearTimeout(timerText);
      clearTimeout(timerReveal);
    };
  }, []);

  // Función de envío conectada a Web3Forms
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          access_key: "c4c15312-af7a-4df5-85fe-5db133688e7c", 
          subject: "¡Nueva confirmación para el cumpleaños de Gustavo! 🎉",
          "Nombre Completo": name,
          "Número de Asistentes": attendees,
          "Restricciones Alimenticias": diet || "Ninguna",
        }),
      });

      const result = await response.json();
      if (result.success) {
        setIsSuccess(true);
        setName("");
        setAttendees("");
        setDiet("");
      } else {
        throw new Error(result.message || "Error al enviar");
      }
    } catch (error) {
      alert('Hubo un error al enviar tus datos. Por favor intenta de nuevo.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isMounted) return <div className="min-h-screen bg-gray-950"></div>;

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-purple-50 to-pink-50 font-sans text-gray-800 overflow-x-hidden">
      
      {/* TELÓN OSCURO E INTRODUCCIÓN DORADA */}
      <div className={`fixed inset-0 bg-gray-950 z-40 flex items-center justify-center transition-opacity duration-1000 pointer-events-none ${darkScreen ? "opacity-100" : "opacity-0"}`}>
        <h1 className={`text-5xl md:text-7xl lg:text-8xl font-serif font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-600 via-yellow-300 to-yellow-600 text-center tracking-wide transition-all duration-700 transform drop-shadow-2xl ${showIntroText ? "opacity-100 scale-100" : "opacity-0 scale-110"}`}>
          Gustavo's <br /> <span className="text-4xl md:text-6xl">80th Birthday</span>
        </h1>
      </div>

      {/* EFECTO DE CAÑONES DE CONFETI */}
      {fireConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
          {confetti.map((piece) => (
            <div 
              key={piece.id} 
              className="absolute bottom-0 w-3 h-3 opacity-0 shadow-sm"
              style={{
                left: piece.left,
                backgroundColor: piece.color,
                borderRadius: piece.shape,
                ['--tx' as string]: piece.tx,
                ['--ty' as string]: piece.ty,
                animation: `cannonShoot ${piece.duration} ${piece.delay} cubic-bezier(0.25, 1, 0.5, 1) forwards`
              }}
            ></div>
          ))}
        </div>
      )}

      {/* CONTENIDO PRINCIPAL */}
      <main className={`flex flex-col items-center justify-center w-full max-w-4xl mx-auto py-12 px-6 sm:px-12 space-y-24 transition-all duration-1000 transform delay-300 ${darkScreen ? "opacity-0 translate-y-10" : "opacity-100 translate-y-0"}`}>
        
        {/* 1. BIENVENIDA */}
        <section className="text-center space-y-6 mt-10">
          <h1 className="text-5xl md:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-500 tracking-tight pb-2">
            ¡Estás Invitado! 🎉
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            ¡Gracias por confirmar tu asistencia! Estamos muy emocionados de celebrar los 80 años de Gustavo contigo. Prepárate para una tarde inolvidable.
          </p>
        </section>

        {/* 2. FORMULARIO */}
        <section className="w-full bg-white/80 backdrop-blur-md rounded-3xl shadow-xl p-8 md:p-12 border border-pink-100 relative z-10">
          
          {isPastDeadline ? (
            <div className="text-center p-8 bg-gray-50 rounded-2xl border border-gray-200">
              <h3 className="text-2xl font-bold text-gray-800 mb-2">El plazo ha finalizado ⏳</h3>
              <p className="text-gray-600">Ya no estamos recibiendo más confirmaciones para el evento. Si tienes alguna duda, comunícate directamente con los organizadores.</p>
            </div>
          ) : isSuccess ? (
            <div className="text-center p-8 bg-green-50 rounded-2xl border border-green-200">
              <h3 className="text-2xl font-bold text-green-700 mb-2">¡Confirmación Exitosa! ✅</h3>
              <p className="text-green-600">Tus datos han sido enviados correctamente. ¡Nos vemos en la fiesta!</p>
            </div>
          ) : (
            <>
              <div className="text-center mb-8">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-3">
                  Confirma tus datos
                </h2>
                <p className="text-gray-600 max-w-md mx-auto text-sm md:text-base mb-2">
                  Queremos que no falte nada en esta gran tarde. Ayúdanos a planificar el banquete confirmando tu asistencia y la de tus acompañantes.
                </p>
                <span className="inline-block bg-pink-100 text-pink-800 text-xs px-3 py-1 rounded-full font-semibold">
                  Tienes hasta el 16 de octubre para confirmar
                </span>
              </div>

              <form className="max-w-md mx-auto flex flex-col gap-6" onSubmit={handleSubmit}>
                <div className="flex flex-col gap-2">
                  <label htmlFor="name" className="text-sm font-semibold text-gray-700">Nombre Completo</label>
                  <input 
                    type="text" 
                    id="name" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required 
                    disabled={isSubmitting}
                    className="px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-500 bg-white disabled:opacity-50"
                    placeholder="Ej. Juan Pérez"
                  />
                </div>
                
                <div className="flex flex-col gap-2">
                  <label htmlFor="attendees" className="text-sm font-semibold text-gray-700">Número de Asistentes (Incluyéndote)</label>
                  <input 
                    type="number" 
                    id="attendees" 
                    min="1" 
                    max="10" 
                    value={attendees}
                    onChange={(e) => setAttendees(e.target.value)}
                    required 
                    disabled={isSubmitting}
                    className="px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-500 bg-white disabled:opacity-50"
                    placeholder="1"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label htmlFor="diet" className="text-sm font-semibold text-gray-700">Restricciones Alimenticias (Opcional)</label>
                  <textarea 
                    id="diet" 
                    rows={3} 
                    value={diet}
                    onChange={(e) => setDiet(e.target.value)}
                    disabled={isSubmitting}
                    className="px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-500 bg-white disabled:opacity-50"
                    placeholder="Vegetariano, alergia al maní, etc."
                  ></textarea>
                </div>

                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="mt-4 flex items-center justify-center w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-4 rounded-full transition-all text-lg shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? "Enviando..." : "Enviar Confirmación"}
                </button>
              </form>
            </>
          )}
        </section>

        {/* 3. UBICACIÓN */}
        <section className="w-full text-center space-y-8 pb-12 relative z-10">
          <h2 className="text-3xl font-bold text-gray-800">
            ¿Dónde es la fiesta? 📍
          </h2>
          <div className="w-full h-[400px] md:h-[500px] rounded-3xl overflow-hidden shadow-2xl border border-gray-200 bg-gray-100">
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d997.4439981112066!2d-78.48737338754137!3d-0.26392152180895545!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1ses!2sec!4v1790457534908!5m2!1ses!2sec" 
              width="100%" 
              height="100%" 
              style={{ border: 0 }} 
              allowFullScreen
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>

          {/* Botón para abrir en Google Maps */}
          <div>
            <a 
              href="https://www.google.com/maps/search/?api=1&query=-0.26392152180895545,-78.48737338754137" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-8 py-4 bg-white hover:bg-gray-50 text-gray-800 font-bold rounded-full shadow-lg border border-gray-200 transition-all hover:scale-105 text-lg gap-2"
            >
              <span>Abrir en Google Maps</span>
              <svg className="w-5 h-5 text-pink-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          </div>
        </section>

      </main>

      {/* Animación Keyframe */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes cannonShoot {
          0% { transform: translate(0, 0) scale(0) rotate(0deg); opacity: 1; }
          40% { transform: translate(var(--tx), var(--ty)) scale(1.5) rotate(360deg); opacity: 1; }
          100% { transform: translate(calc(var(--tx) + 10vw), 10vh) scale(1) rotate(720deg); opacity: 0; }
        }
      `}} />
    </div>
  );
}