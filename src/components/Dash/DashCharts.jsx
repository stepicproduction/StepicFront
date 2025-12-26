import React from 'react'
import {
  ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, 
  XAxis, YAxis, CartesianGrid, Tooltip, LineChart, Line,
} from "recharts";

const DashCharts = ({ inscriptionByService, SERVICE_COLORS, temoignagesData, COLORS_TEMOIGNAGES, commandesData, inscriptionsData }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        
        {/* PieChart Inscriptions par service */}
        <div className="bg-white shadow-md rounded-xl p-4">
            <h3 className="font-semibold mb-4">Répartition des inscriptions par service</h3>
            <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                    <Pie
                        data={inscriptionByService} // ⬅️ Utilisation de l'état
                        cx="50%" cy="50%" outerRadius={80} dataKey="value" label
                    >
                        {inscriptionByService.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={SERVICE_COLORS[entry.name] || "#9CA3AF"} />
                        ))}
                    </Pie>
                    <Tooltip />
                </PieChart>
            </ResponsiveContainer>
        </div>

        {/* DonutChart Témoignages */}
        <div className="bg-white shadow-md rounded-xl p-4">
            <h3 className="font-semibold mb-4">Répartition des témoignages</h3>
            <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                    <Pie
                        data={temoignagesData} // ⬅️ Utilisation de l'état
                        cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" label
                    >
                        {temoignagesData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS_TEMOIGNAGES[index % COLORS_TEMOIGNAGES.length]} />
                        ))}
                    </Pie>
                    <Tooltip />
                </PieChart>
            </ResponsiveContainer>
        </div>
        
        {/* BarChart Commandes */}
        <div className="bg-white shadow-md rounded-xl p-4 col-span-2">
            <h3 className="font-semibold mb-4">Nombre de commandes par mois</h3>
            <ResponsiveContainer width="100%" height={250}>
                <BarChart data={commandesData}> 
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="mois" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="commandes" fill="#8884d8" />
                </BarChart>
            </ResponsiveContainer>
        </div>

        {/* LineChart Inscriptions */}
        <div className="bg-white shadow-md rounded-xl p-4 col-span-2">
            <h3 className="font-semibold mb-4">Évolution des inscriptions</h3>
            <ResponsiveContainer width="100%" height={250}>
                <LineChart data={inscriptionsData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="mois" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="inscriptions" stroke="#82ca9d" strokeWidth={2} />
                </LineChart>
            </ResponsiveContainer>
        </div>

    </div>
  )
}

export default DashCharts