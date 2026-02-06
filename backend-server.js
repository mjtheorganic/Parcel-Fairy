const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
const PORT = 3000;

// 미들웨어
app.use(cors());
app.use(express.json());
app.use(express.static('.'));

// 스마트택배 API 설정
const SWEETTRACKER_API_KEY = 'YOUR_API_KEY_HERE'; // 여기에 발급받은 API 키 입력
const SWEETTRACKER_BASE_URL = 'http://info.sweettracker.co.kr';

// 택배사 코드 매핑
const carrierCodes = {
    '04': 'CJ대한통운',
    '05': '한진택배',
    '08': '롯데택배',
    '06': '로젠택배',
    '23': '경동택배',
    '01': '우체국택배',
    '46': 'CU 편의점택배'
};

/**
 * 배송 조회 API
 * POST /api/track
 * 
 * Request Body:
 * {
 *   "carrier": "04",  // 택배사 코드
 *   "trackingNumber": "123456789012"
 * }
 */
app.post('/api/track', async (req, res) => {
    const { carrier, trackingNumber } = req.body;

    if (!carrier || !trackingNumber) {
        return res.status(400).json({ 
            success: false,
            error: '택배사 코드와 송장번호를 입력해주세요.' 
        });
    }

    try {
        // 스마트택배 API 호출
        const response = await axios.get(`${SWEETTRACKER_BASE_URL}/api/v1/trackingInfo`, {
            params: {
                t_key: SWEETTRACKER_API_KEY,
                t_code: carrier,
                t_invoice: trackingNumber
            }
        });

        const data = response.data;

        // API 응답 에러 체크
        if (data.status === false) {
            return res.status(400).json({
                success: false,
                error: data.msg || '배송 정보를 찾을 수 없습니다.'
            });
        }

        // 성공 응답
        return res.json({
            success: true,
            data: {
                level: data.level,
                trackingDetails: data.trackingDetails || [],
                complete: data.complete,
                senderName: data.senderName,
                receiverName: data.receiverName,
                itemName: data.itemName,
                invoiceNo: data.invoiceNo,
                receiverAddr: data.receiverAddr
            }
        });

    } catch (error) {
        console.error('스마트택배 API 오류:', error.message);

        // API 키가 없거나 에러 발생 시 시뮬레이션 데이터 반환
        if (SWEETTRACKER_API_KEY === 'YOUR_API_KEY_HERE') {
            console.log('⚠️  API 키가 설정되지 않았습니다. 시뮬레이션 데이터를 반환합니다.');
            return res.json({
                success: true,
                simulation: true,
                data: generateSimulationData(carrier, trackingNumber)
            });
        }

        return res.status(500).json({
            success: false,
            error: '배송 조회 중 오류가 발생했습니다.'
        });
    }
});

/**
 * 전화번호로 배송 조회 API
 * POST /api/search-by-phone
 * 
 * Request Body:
 * {
 *   "phone": "010-1234-5678",
 *   "platform": "all" | "naver" | "coupang" | "oliveyoung"
 * }
 * 
 * 참고: 실제로는 각 쇼핑몰의 API 연동이 필요합니다.
 * 현재는 시뮬레이션 데이터를 반환합니다.
 */
app.post('/api/search-by-phone', async (req, res) => {
    const { phone, platform } = req.body;

    if (!phone) {
        return res.status(400).json({
            success: false,
            error: '전화번호를 입력해주세요.'
        });
    }

    try {
        // 실제 환경에서는 각 쇼핑몰 API를 호출하여 주문 내역을 가져옵니다
        // 예시:
        // - 네이버쇼핑: Naver Shopping API
        // - 쿠팡: Coupang Partner API
        // - 올리브영: Olive Young API (비공개)

        // 현재는 시뮬레이션 데이터 반환
        const mockOrders = generateMockOrders(phone, platform);

        return res.json({
            success: true,
            simulation: true,
            data: mockOrders
        });

    } catch (error) {
        console.error('주문 조회 오류:', error);
        return res.status(500).json({
            success: false,
            error: '주문 조회 중 오류가 발생했습니다.'
        });
    }
});

/**
 * 택배사 목록 조회 API
 * GET /api/carriers
 */
app.get('/api/carriers', (req, res) => {
    res.json({
        success: true,
        data: Object.entries(carrierCodes).map(([code, name]) => ({
            code,
            name
        }))
    });
});

/**
 * 시뮬레이션 데이터 생성 함수
 */
function generateSimulationData(carrier, trackingNumber) {
    const now = new Date();
    const levels = [1, 2, 3, 4, 5, 6];
    const level = levels[Math.floor(Math.random() * levels.length)];

    const events = [
        { level: 1, kind: '상품인수', where: '서울 강남구 집하장', timeOffset: 48 },
        { level: 2, kind: '상품이동중', where: '서울 강남구 집하장', timeOffset: 36 },
        { level: 3, kind: '배송지도착', where: '경기 성남시 분당구 집하장', timeOffset: 24 },
        { level: 4, kind: '배송출발', where: '경기 성남시 분당구 대리점', timeOffset: 12 },
        { level: 5, kind: '배송출발', where: '경기 성남시 분당구', timeOffset: 6 },
        { level: 6, kind: '배송완료', where: '경기 성남시 분당구 (문앞)', timeOffset: 2 }
    ];

    const trackingDetails = [];
    for (let i = 0; i < level; i++) {
        const event = events[i];
        const eventTime = new Date(now - 3600000 * event.timeOffset);
        trackingDetails.push({
            kind: event.kind,
            level: event.level,
            where: event.where,
            timeString: formatDateTimeString(eventTime)
        });
    }

    return {
        level,
        trackingDetails: trackingDetails.reverse(),
        complete: level === 6,
        invoiceNo: trackingNumber,
        itemName: '택배 상품'
    };
}

/**
 * 모의 주문 데이터 생성
 */
function generateMockOrders(phone, platform) {
    const orders = [];
    const numOrders = Math.floor(Math.random() * 3) + 1;

    const platforms = platform === 'all' 
        ? ['naver', 'coupang', 'oliveyoung']
        : [platform];

    const products = [
        '무선 이어폰', '키보드', '마우스', '립스틱 세트', 
        '스킨케어 세트', '노트북 파우치', '텀블러', '운동화',
        '블루투스 스피커', '휴대폰 케이스', '충전기', '보조배터리'
    ];

    const carriers = ['04', '05', '08', '06'];

    for (let i = 0; i < numOrders; i++) {
        const selectedPlatform = platforms[Math.floor(Math.random() * platforms.length)];
        const product = products[Math.floor(Math.random() * products.length)];
        const carrier = carriers[Math.floor(Math.random() * carriers.length)];
        const trackingNumber = generateRandomTrackingNumber();

        orders.push({
            platform: selectedPlatform,
            productName: product,
            carrier: carrier,
            trackingNumber: trackingNumber,
            orderDate: new Date(Date.now() - Math.random() * 7 * 24 * 3600000).toISOString()
        });
    }

    return orders;
}

/**
 * 랜덤 송장번호 생성
 */
function generateRandomTrackingNumber() {
    return Math.floor(Math.random() * 1000000000000).toString().padStart(12, '0');
}

/**
 * 날짜 포맷팅
 */
function formatDateTimeString(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}`;
}

// 서버 시작
app.listen(PORT, () => {
    console.log('\n========================================');
    console.log('✅ 통합 택배 배송 조회 서버 실행중');
    console.log('========================================');
    console.log(`📍 서버 주소: http://localhost:${PORT}`);
    console.log(`📦 프론트엔드: http://localhost:${PORT}/frontend.html`);
    console.log('========================================\n');
    
    if (SWEETTRACKER_API_KEY === 'YOUR_API_KEY_HERE') {
        console.log('⚠️  경고: 스마트택배 API 키가 설정되지 않았습니다.');
        console.log('💡 시뮬레이션 모드로 작동합니다.');
        console.log('💡 실제 배송 정보를 조회하려면:');
        console.log('   1. https://tracking.sweettracker.co.kr 에서 회원가입');
        console.log('   2. API 키 발급');
        console.log('   3. server.js 파일의 SWEETTRACKER_API_KEY 변수에 입력\n');
    } else {
        console.log('✅ 스마트택배 API 연동 완료\n');
    }
});

module.exports = app;
