import React, { useState } from "react";
import certificateData from "@/data/certificateData";
import Image from "next/image";

const Certificates = () => {
    const [selectedCert, setSelectedCert] = useState(null);

    return (
        <div className="p-4">
            <h2 className="text-xl font-bold mb-4">Certificates</h2>
            <div className="grid grid-cols-2 gap-4">
                {certificateData.map((cert, index) => (
                    <div
                        key={index}
                        className="cursor-pointer bg-gray-100 p-2 rounded-lg shadow-md hover:shadow-lg"
                        onClick={() => setSelectedCert(cert)}
                    >
                        <div className="relative w-full h-24 object-cover rounded-md">
                            <Image src={cert.image} alt={cert.title} fill={true}  />
                        </div>
                        <p className="text-center mt-2 font-semibold">{cert.title}</p>
                    </div>
                ))}
            </div>

            {selectedCert && (
                <div className="fixed inset-0 flex items-center justify-center bg-zinc-700/70 p-4">
                    <div className="bg-white p-6 rounded-lg shadow-lg max-w-md">
                        <h3 className="text-lg font-bold">{selectedCert.title}</h3>
                        <p className="text-gray-600">{selectedCert.organization}</p>
                        <div className="relative w-full mt-2 rounded-md">
                            <Image src={selectedCert.image} alt={selectedCert.title} fill={true} />
                        </div>
                        <p className="mt-2 text-sm text-gray-500">{selectedCert.date}</p>
                        <div className="flex justify-end mt-4">
                            <a href={selectedCert.link} target="_blank" className="text-blue-500 hover:underline">View Certificate</a>
                            <button className="ml-4 text-red-500 hover:underline cursor-pointer" onClick={() => setSelectedCert(null)}>Close</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Certificates;
