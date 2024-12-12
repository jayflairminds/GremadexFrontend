import React, { useState } from 'react';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from 'recharts';
import { Modal } from 'antd';
import expanIcon from '../../../assets/sidebar/expandIcon.svg';

const reviewProgressData = [
    { month: '1', Electrical: 0, Plumbing: 0, HVAC: 0, Elevators: 0, Equipment: 0, Specialties: 0, Finishes: 0, Carpentry: 0, Doors: 0, Glass: 0, Thermal: 0, Metals: 0, Masonry: 0, Concrete: 0, Excavation: 5 },
    { month: '2', Electrical: 0, Plumbing: 0, HVAC: 0, Elevators: 0, Equipment: 0, Specialties: 0, Finishes: 0, Carpentry: 0, Doors: 0, Glass: 0, Thermal: 0, Metals: 0, Masonry: 0, Concrete: 0, Excavation: 30 },
    { month: '3', Electrical: 0, Plumbing: 0, HVAC: 0, Elevators: 0, Equipment: 0, Specialties: 0, Finishes: 0, Carpentry: 0, Doors: 0, Glass: 0, Thermal: 0, Metals: 0, Masonry: 0, Concrete: 0, Excavation: 100 },
    { month: '4', Electrical: 0, Plumbing: 0, HVAC: 0, Elevators: 0, Equipment: 0, Specialties: 0, Finishes: 0, Carpentry: 0, Doors: 0, Glass: 0, Thermal: 0, Metals: 0, Masonry: 0, Concrete: 5, Excavation: 100 },
    // Continue adding data for remaining months...
];

export const ProgressMonth = () => {
    const [isModalVisible, setIsModalVisible] = useState(false);

    const showModal = () => {
        setIsModalVisible(true);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    return (
        <div style={{ width: '100%', height: 230, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", padding: "0.2rem" }}>
            <div style={{ display: "flex", width: "100%", justifyContent: "space-between", alignItems: "center" }}>
                <h5 style={{ paddingBottom: "0rem", fontSize: "18px", paddingTop: "0.2rem", color: "white" }}>Review Progress Over Months</h5>
                {/* <div style={{ cursor: "pointer", paddingBottom: "5px" }}> */}
                    <img style={{ height: "17%", width: "17%" }} src={expanIcon} alt="Expand" onClick={showModal} />
                {/* </div> */}
            </div>

            <ResponsiveContainer width="100%" height="100%">
                <LineChart
                    data={reviewProgressData}
                    margin={{
                        top: 20,
                        right: 30,
                        bottom: 5,
                        left: 0,
                    }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="Excavation" stroke="#82ca9d" />
                    <Line type="monotone" dataKey="Concrete" stroke="#8884d8" />
                    {/* Add more Line components for each review progress data key */}
                </LineChart>
            </ResponsiveContainer>

            <Modal
                title="Review Progress Details"
                visible={isModalVisible}
                onCancel={handleCancel}
                footer={null}
                width={"100%"}
            >
                <div style={{ height: '500px' }}> {/* Optional height for consistency */}
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart
                            data={reviewProgressData}
                            margin={{
                                top: 20,
                                right: 30,
                                bottom: 5,
                                left: 0,
                            }}
                        >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="month" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Line type="monotone" dataKey="Excavation" stroke="#82ca9d" />
                            <Line type="monotone" dataKey="Concrete" stroke="#8884d8" />
                            {/* Add more Line components for each review progress data key */}
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </Modal>
        </div>
    );
};
