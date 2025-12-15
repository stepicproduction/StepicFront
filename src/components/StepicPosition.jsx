import React from "react";

function StepicPosition() {
  return (
    <div className="relative w-full h-[500px]">
      {/* === IFRAME GOOGLE MAPS === */}
      <iframe
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d13411.9814155342!2d43.66143689822911!3d-23.35142151288236!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2a75624cba74b029%3A0x73ad56a635517d47!2sSTEPIC!5e1!3m2!1sfr!2smg!4v1765181316046!5m2!1sfr!2smg"
        className="w-full h-full rounded-xl border-0"
        loading="lazy"
        allowFullScreen
        referrerPolicy="no-referrer-when-downgrade"
      ></iframe>
    </div>
  );
}

export default StepicPosition;
