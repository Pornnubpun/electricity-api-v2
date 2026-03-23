const request = require('supertest');
const app = require('../index');

describe('Electricity API Endpoints', () => {
    // Test Case 1: Total Usage
    it('should return total electricity usage for all years', async () => {
        // แก้จาก /api/usages/totalyear -> /api/usage/total-by-year (ตรงตาม API 1)
        const res = await request(app).get('/api/usage/total-by-year');
        expect(res.status).toBe(200);
        expect(typeof res.body).toBe('object');
    });

    // Test Case 2: Specific Province Usage
    it('should return electricity usage for a specific province and year', async () => {
        // Path นี้ตรงกับ API 3 แล้ว ทดสอบกรณีหาข้อมูลไม่เจอ
        const res = await request(app).get('/api/usage/Alberta/2566');
        expect(res.status).toBe(200); // เพิ่มเช็ค status 200 ให้ชัวร์
        expect(res.body.message).toBe('Data not found');
    });

    // Test Case 3: Verify Data Structure for Users
    it('should return user history for a specific province as an array', async () => {
        // แก้จาก /api/pastusers/Bangkok -> /api/users/history/Bangkok (ตรงตาม API 6)
        const res = await request(app).get('/api/usershistory/Bangkok');
        expect(res.statusCode).toEqual(200);
        expect(Array.isArray(res.body)).toBe(true);
    });
});