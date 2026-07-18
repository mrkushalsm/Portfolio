import React, { useState, useEffect } from "react";
import certificateData from "../../data/certificateData";

const Certificates = ({ setBackHandler }) => {
    const [selectedCert, setSelectedCert] = useState(null);

    useEffect(() => {
        if (setBackHandler) {
            setBackHandler(() => {
                if (selectedCert) {
                    setSelectedCert(null);
                    return true;
                }
                return false;
            });
        }
        return () => { if (setBackHandler) setBackHandler(null); };
    }, [selectedCert, setBackHandler]);

    if (selectedCert) {
        return (
            <div className="w-full h-full bg-black text-white flex flex-col font-sans select-none px-4 pt-2">
                <h2 className="text-3xl font-light tracking-tight mb-1 text-[#008272] lowercase">{selectedCert.title}</h2>
                <p className="text-white/70 text-sm tracking-wide mb-4 lowercase">{selectedCert.organization}</p>
                
                <div className="flex-1 flex flex-col justify-center">
                    <img src={selectedCert.image} alt={selectedCert.title} className="w-full object-contain mb-6 drop-shadow-lg" />
                </div>

                <div className="flex flex-col items-start gap-4 mb-8">
                    <p className="text-white/50 text-xs tracking-wider uppercase">{selectedCert.date}</p>
                    {selectedCert.link && (
                        <a 
                            href={selectedCert.link} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="w-full py-3 text-center border-2 border-white rounded-none text-white font-semibold uppercase tracking-widest active:bg-white active:text-black transition-colors"
                        >
                            View Original
                        </a>
                    )}
                </div>
            </div>
        );
    }

    return (
        <div className="w-full h-full bg-black text-white p-4 font-sans select-none overflow-x-hidden">
            <h1 className="text-[54px] font-light leading-none tracking-tight mb-8 lowercase text-[#da3b01] break-words" style={{ marginLeft: "-4px" }}>
                certificates
            </h1>
            
            <div className="flex flex-col gap-6">
                {certificateData.map((cert, index) => (
                    <div
                        key={index}
                        className="cursor-pointer active:opacity-50 transition-opacity"
                        onClick={() => setSelectedCert(cert)}
                    >
                        <img src={cert.image} alt={cert.title} className="w-full h-40 object-cover opacity-90 mb-2" />
                        <h3 className="text-xl font-normal leading-tight tracking-wide">{cert.title}</h3>
                        <p className="text-white/60 text-sm">{cert.organization}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Certificates;
