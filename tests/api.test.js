const request = require('supertest');
const app = require('../index');

describe('Electricity API Endpoints (12 Cases)', () => {

    // ==========================================
    // API 1: /api/usage/total-by-year
    // ==========================================
    
    // Case 1 (Valid): ทดสอบว่า API คืนค่ากลับมาเป็น Object และ Status 200 เมื่อเรียกถูกวิธี
    it('should return total electricity usage for all years as an object', async () => {
        const res = await request(app).get('/api/usage/total-by-year');
        expect(res.status).toBe(200);
        expect(typeof res.body).toBe('object');
        expect(Array.isArray(res.body)).toBe(false); // ตรวจสอบให้แน่ใจว่าเป็น Object {} ไม่ใช่ Array []
    });

    // Case 2 (Invalid): ทดสอบการจัดการ Error เบื้องต้น หากผู้ใช้เรียก Method ผิด (เช่นใช้ POST แทน GET) ต้องได้ 404
    it('should return 404 if using incorrect HTTP method (POST) for total usage', async () => {
        const res = await request(app).post('/api/usage/total-by-year');
        expect(res.status).toBe(404);
    });


    // ==========================================
    // API 2: /api/users/total-by-year
    // ==========================================

    // Case 3 (Valid): ทดสอบว่าโครงสร้างข้อมูลจำนวนผู้ใช้รวม เป็น Object ถูกต้องตามที่ออกแบบไว้
    it('should return total electricity users for all years as an object', async () => {
        const res = await request(app).get('/api/users/total-by-year');
        expect(res.status).toBe(200);
        expect(typeof res.body).toBe('object');
    });

    // Case 4 (Invalid): ทดสอบว่าถ้าระบุ Path ผิด (พิมพ์ตกหล่น) ระบบ Express ต้องตีกลับเป็น 404 Not Found
    it('should return 404 for misspelt route on users total API', async () => {
        const res = await request(app).get('/api/users/total-year-typo');
        expect(res.status).toBe(404);
    });


    // ==========================================
    // API 3: /api/usage/:province/:year
    // ==========================================

    // Case 5 (Valid): ทดสอบว่าสามารถดึงข้อมูลการใช้ไฟของจังหวัดและปีที่มีอยู่จริงได้ (ข้อมูลสมบูรณ์จะไม่มี key 'message')
    it('should return usage data for a specific province and year', async () => {
        const res = await request(app).get('/api/usage/Bangkok/2566'); // ทดสอบด้วยข้อมูลที่มีแนวโน้มว่ามีอยู่จริง
        expect(res.status).toBe(200);
        expect(res.body.message).toBeUndefined(); // ถ้าหาข้อมูลเจอ ต้องไม่มีข้อความ "Data not found"
    });

    // Case 6 (Invalid): ทดสอบว่าถ้าระบุจังหวัดหรือปีที่ไม่มีอยู่จริง API จะคืนค่า "Data not found" กลับมาอย่างถูกต้อง
    it('should return "Data not found" message for unknown province and year in usage API', async () => {
        const res = await request(app).get('/api/usage/Alberta/2566');
        expect(res.status).toBe(200); // โค้ดต้นฉบับตั้งใจให้เป็น 200 เสมอ
        expect(res.body.message).toBe('Data not found');
    });


    // ==========================================
    // API 4: /api/users/:province/:year
    // ==========================================

    // Case 7 (Valid): ทดสอบความสมบูรณ์ของข้อมูลผู้ใช้ เมื่อระบุจังหวัดและปีที่ถูกต้อง
    it('should return user data for a specific valid province and year', async () => {
        const res = await request(app).get('/api/users/Bangkok/2566');
        expect(res.status).toBe(200);
        expect(res.body.message).toBeUndefined();
    });

    // Case 8 (Invalid): ทดสอบว่าระบบจัดการกับพารามิเตอร์ผิดรูปแบบ (เช่นใส่ตัวอักษรแทนตัวเลขปี) ได้อย่างถูกต้อง
    it('should return "Data not found" for invalid year format in users API', async () => {
        const res = await request(app).get('/api/users/Phuket/ABCD'); // ส่งค่าปีที่พังเข้าไป
        expect(res.status).toBe(200);
        expect(res.body.message).toBe('Data not found');
    });


    // ==========================================
    // API 5: /api/usagehistory/:province
    // ==========================================

    // Case 9 (Valid): ทดสอบว่า API ประวัติการใช้ไฟของจังหวัด คืนค่ากลับมาในโครงสร้างแบบ Array ถูกต้อง
    it('should return usage history for a specific province as an array', async () => {
        const res = await request(app).get('/api/usagehistory/Bangkok');
        expect(res.status).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
    });

    // Case 10 (Invalid/Edge Case): ทดสอบการทำงานของ .filter() หากหาจังหวัดไม่เจอ ควรได้ Array ว่างกลับมา ไม่ใช่ Error
    it('should return an empty array if province is not found in usage history', async () => {
        const res = await request(app).get('/api/usagehistory/Gotham');
        expect(res.status).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body.length).toBe(0); // ต้องเป็น Array ว่างเท่านั้น
    });


    // ==========================================
    // API 6: /api/usershistory/:province
    // ==========================================

    // Case 11 (Valid): ทดสอบว่า API ประวัติจำนวนผู้ใช้ของจังหวัด คืนค่ากลับมาในโครงสร้างแบบ Array ถูกต้อง
    it('should return user history for a specific province as an array', async () => {
        const res = await request(app).get('/api/usershistory/Bangkok');
        expect(res.status).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
    });

    // Case 12 (Invalid/Edge Case): ทดสอบว่าถ้าใส่จังหวัดแปลกๆ ระบบสามารถรองรับได้โดยไม่พัง และคืนค่าเป็น Array ว่าง
    it('should return an empty array if province is not found in user history', async () => {
        const res = await request(app).get('/api/usershistory/Narnia');
        expect(res.status).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body.length).toBe(0); // ต้องเป็น Array ว่างเท่านั้น
    });

});