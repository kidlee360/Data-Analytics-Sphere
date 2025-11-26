// server_src/models/data.ts
import pool from '../config/db';

class DataModel {
    /**
     * Fetches all analytics data, optionally filtered by the requesting user's ID
     * (though for this mock setup, all users see the same mock data).
     */
    static async getSummaryData() {
        const query = `
            SELECT 
                date, 
                sales_volume, 
                new_signups, 
                active_users, 
                kpi_score, 
                region
            FROM analytics_data 
            ORDER BY date ASC;
        `;
        const result = await pool.query(query);
        return result.rows;
    }
    
    /**
     * Fetches the single, latest KPI score for the 3D widget
     */
    static async getLatestKpi() {
        const query = `
            SELECT kpi_score 
            FROM analytics_data 
            ORDER BY date DESC 
            LIMIT 1;
        `;
        const result = await pool.query(query);
        // If data exists, return the score, otherwise return a default
        return result.rows[0]?.kpi_score || 0.00; 
    }
}

export default DataModel;