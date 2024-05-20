import React from 'react';
import { Gauge, gaugeClasses } from "@mui/x-charts/Gauge";

function MuiGauge({ value, valueMax }) {
    return (
        <Gauge
            value={value}
            valueMax={valueMax}
            startAngle={-110}
            endAngle={110}
            sx={{
                width: 300,
                height: 300,
                [`& .${gaugeClasses.valueText}`]: {
                    fontSize: 30,
                    transform: 'translate(0px, 0px)',
                },
                [`& .${gaugeClasses.valueArc}`]: {
                    fill: '#cb5918',
                },
            }}
            text={({ value, valueMax }) => `${value} / ${valueMax}`}
        />
    );
}

export default MuiGauge;
