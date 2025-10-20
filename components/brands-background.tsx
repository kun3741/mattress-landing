"use client"

import Image from "next/image"

export function BrandsBackground() {
  const logos = [
    { src: "/1 logo 10.png", alt: "Brand 1" },
    { src: "/come-for.png", alt: "Come-for" },
    { src: "/emm.150x100.jpg", alt: "EMM" },
    { src: "/evolution_2024.150x100.jpg", alt: "Evolution" },
    { src: "/fabrika_brn-o7uhcpocfs6s1sa5b6n2l3usbvnih4qa43kodvvg9s.png", alt: "BRN" },
    { src: "/fashion_logo.150x100.jpg", alt: "Fashion" },
    { src: "/FDM big.png", alt: "FDM" },
    { src: "/k1-200x120.png", alt: "K1" },
    { src: "/k6-200x120.png", alt: "K6" },
    { src: "/k8-200x120.png", alt: "K8" },
    { src: "/karib.png", alt: "Karib" },
    { src: "/keiko-col-main-200x120.png", alt: "Keiko" },
    { src: "/logo_arabeska_150x100.150x100.png", alt: "Arabeska" },
    { src: "/logo_belsonno_150x100.150x100.png", alt: "Belsonno" },
    { src: "/logo_palmera.150x100.jpg", alt: "Palmera" },
    { src: "/Logo_ukr.jpg", alt: "Logo Ukr" },
    { src: "/logo-2-400x164.png", alt: "Logo 2" },
    { src: "/logo-belsonno-pure-01-1-150x37.png", alt: "Belsonno Pure" },
    { src: "/logo-kolektsii-dlya-sajtu.150x100.jpg", alt: "Kollektsii" },
    { src: "/logo-magniflex.png", alt: "Magniflex" },
  ]

  return (
    <>
      <style>{`
        @keyframes float-slow {
          0%, 100% { transform: translate(0, 0) rotate(0deg); opacity: 0.04; }
          25% { transform: translate(30px, -30px) rotate(5deg); opacity: 0.06; }
          50% { transform: translate(-20px, 20px) rotate(-5deg); opacity: 0.04; }
          75% { transform: translate(40px, 10px) rotate(3deg); opacity: 0.06; }
        }

        @keyframes float-slow-reverse {
          0%, 100% { transform: translate(0, 0) rotate(0deg); opacity: 0.03; }
          25% { transform: translate(-40px, 20px) rotate(-5deg); opacity: 0.05; }
          50% { transform: translate(30px, -30px) rotate(5deg); opacity: 0.03; }
          75% { transform: translate(-20px, -20px) rotate(-3deg); opacity: 0.05; }
        }

        .brands-bg {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          pointer-events: none;
          z-index: -1;
          overflow: hidden;
          background: linear-gradient(135deg, rgba(240, 245, 255, 0.3) 0%, rgba(245, 240, 255, 0.3) 100%);
        }

        .brand-logo {
          position: absolute;
          opacity: 0.04;
          filter: grayscale(100%) brightness(0.8);
          pointer-events: none;
          transition: filter 0.3s ease;
        }
      `}</style>
      <div className="brands-bg">
        {logos.map((logo, index) => (
          <div
            key={index}
            className="brand-logo"
            style={{
              top: `${(index * 11) % 80 + 5}%`,
              left: `${(index * 17) % 80 + 5}%`,
              width: `${90 + (index % 4) * 10}px`,
              height: `${60 + (index % 4) * 8}px`,
              animation: `${index % 2 === 0 ? 'float-slow' : 'float-slow-reverse'} ${22 + (index % 6) * 2}s ease-in-out infinite`,
              animationDelay: `${(index % 5) * 1.3}s`,
            }}
          >
            <Image
              src={logo.src}
              alt={logo.alt}
              width={120}
              height={80}
              className="w-full h-full object-contain"
              quality={60}
            />
          </div>
        ))}
      </div>
    </>
  )
}
