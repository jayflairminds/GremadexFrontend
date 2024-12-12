import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export const BarGraphDash = () => {
    const data = [
        { name: 'Approved', value: 1, color: '#82ca9d' },
        { name: 'Pending', value: 4, color: 'red' },
    ];

    return (
        <div style={{ width: '100%', height: 200 , display:"flex", flexDirection:"column", justifyContent:"center", alignItems:"center",padding:"1rem"}}>
            <h5 style={{paddingBottom:"1rem", fontSize:"18px", paddingTop:"1rem"}}>Loan Status </h5>
            <ResponsiveContainer>
                <BarChart
                    data={data}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="value" fill="#82ca9d"  />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};
