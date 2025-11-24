import React from 'react'

export const H1 = ({children}) => {
    return <h1 className='text-[44px] lg:text-[56px] md:text-[48px] sm:text-[46px] leading-1.2 text-center font-bold mb-[40px]'>{children}</h1>
}

export const H2 = ({children}) => {
    // Les constantes de couleurs (DARK_BLUE, SKY_BLUE, VIOLET) ne sont plus utilisées 
    // dans le className de la ligne pour éviter le problème de détection de Tailwind.
    
    return (
        <div className='flex flex-col items-center mb-[30px]'>
            {/* Le titre H2 lui-même */}
            <h2 className="text-3xl sm:text-[40px] text-[#6c63ff] leading-[1.3] text-center font-semibold mb-4">
            {children}
            </h2>

            
            {/* Ligne décorative : 
            - w-[200px] : Environ 7cm 
            - h-[4px] : Épaisseur "grasse"
            - Dégradé avec les codes hexadécimaux en dur pour garantir leur reconnaissance par Tailwind
            Bleu Nuit : #191970 
            Bleu Ciel : #87ceeb
            Violet : #8a2be2
            */}
            <div className={`
                w-[170px] 
                h-[4px] 
                bg-gradient-to-r 
                from-[#191970]  /* Bleu Nuit */
                via-[#87ceeb]   /* Bleu Ciel */
                to-[#8a2be2]    /* Violet */
                rounded-full
            `}>
                {/* Contenu vide */}
            </div>
        </div>
    );
}

export const H3 = ({children}) => {
    return <h3 className='text-[28px] leading-1.4 mb-[20px]'>{children}</h3>
}

export const P = ({children}) => {
    return <p className='text-[16px] text-black lg:text-[18px] md:text-[17px] sm:text-[16px] leading-1.7 mb-[15px]'>{children}</p>
}