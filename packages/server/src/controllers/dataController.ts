// server_src/controllers/dataController.ts
import { Request, Response } from 'express';
import DataModel from '../models/data';

export const getSummary = async (req: Request, res: Response) => {
    try {
        const data = await DataModel.getSummaryData();
        return res.status(200).json(data);
    } catch (error) {
        console.error('Error fetching summary data:', error);
        return res.status(500).json({ error: 'Failed to retrieve summary data.' });
    }
};

export const getKpi = async (req: Request, res: Response) => {
    try {
        const kpiScore = await DataModel.getLatestKpi();
        return res.status(200).json({ kpi_score: kpiScore });
    } catch (error) {
        console.error('Error fetching KPI:', error);
        return res.status(500).json({ error: 'Failed to retrieve KPI score.' });
    }
};
