// 전역 변수
let deliveries = JSON.parse(localStorage.getItem('deliveries') || '[]');
let currentTab = 'auto';

// 택배사 정보
const carriers = {
    '04': { name: 'CJ대한통운', code: '04' },
    '05': { name: '한진택배', code: '05' },
    '08': { name: '롯데택배', code: '08' },
    '06': { name: '로젠택배', code: '06' },
    '23': { name: '경동택배', code: '23' },
    '01': { name: '우체국택배', code: '01' },
    '46': { name: 'CU 편의점택배', code: '46' }
};

// 쇼핑몰 정보
const platforms = {
    naver: { name: '네이버쇼핑', class: 'platform-naver' },
    coupang: { name: '쿠팡', class: 'platform-coupang' },
    oliveyoung: { name: '올리브영', class: 'platform-oliveyoung' }
};

// 탭 전환
function switchTab(tab) {
    currentTab = tab;
    
    document.querySelectorAll('.tab').forEach(el => el.classList.remove('active'));
    event.target.classList.add('active');

    document.getElementById('autoSection').style.display = tab === 'auto' ? 'block' : 'none';
    document.getElementById('manualSection').style.display = tab === 'manual' ? 'block' : 'none';
    document.getElementById('listSection').style.display = tab === 'list' ? 'block' : 'none';

    if (tab === 'list') {
        filterDeliveries();
    }
}

// 자동 조회 (시뮬레이션)
async function autoSearch() {
    const phone = document.getElementById('autoPhone').value.trim();
    const platform = document.getElementById('autoPlatform').value;

    if (!phone) {
        alert('전화번호를 입력해주세요.');
        return;
    }

    showLoading(true);

    try {
        // 시뮬레이션: 랜덤 배송 정보 생성
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        const mockDeliveries = generateMockAutoSearchResults(phone, platform);
        
        if (mockDeliveries.length === 0) {
            alert('해당 전화번호로 조회된 배송 정보가 없습니다.');
            showLoading(false);
            return;
        }

        // 새로 조회된 배송 추가
        for (const delivery of mockDeliveries) {
            const existingIndex = deliveries.findIndex(d => 
                d.trackingNumber === delivery.trackingNumber
            );

            if (existingIndex === -1) {
                deliveries.push(delivery);
                await trackDelivery(delivery.id);
            }
        }

        saveDeliveries();
        updateStats();
        
        alert(`${mockDeliveries.length}개의 배송 정보를 찾았습니다! (시뮬레이션)`);
        
        // 목록 탭으로 이동
        document.querySelectorAll('.tab')[2].click();

    } catch (error) {
        console.error('조회 오류:', error);
        alert('배송 정보 조회 중 오류가 발생했습니다.');
    } finally {
        showLoading(false);
    }
}

// 수동 추가
async function manualAdd() {
    const platform = document.getElementById('platform').value;
    const productName = document.getElementById('productName').value.trim() || '상품';
    const carrier = document.getElementById('carrier').value;
    const trackingNumber = document.getElementById('trackingNumber').value.trim();

    if (!trackingNumber) {
        alert('송장번호를 입력해주세요.');
        return;
    }

    const delivery = {
        id: Date.now(),
        platform,
        productName,
        carrier,
        trackingNumber,
        addedAt: new Date().toISOString(),
        autoAdded: false
    };

    deliveries.push(delivery);
    saveDeliveries();
    
    document.getElementById('productName').value = '';
    document.getElementById('trackingNumber').value = '';
    
    alert('배송이 추가되었습니다! 📦');
    
    await trackDelivery(delivery.id);
    updateStats();
}

// 배송 조회 (시뮬레이션)
async function trackDelivery(deliveryId) {
    const delivery = deliveries.find(d => d.id === deliveryId);
    if (!delivery) return;

    try {
        await new Promise(resolve => setTimeout(resolve, 500));
        const mockData = generateMockTrackingData();

        delivery.level = mockData.level;
        delivery.trackingDetails = mockData.trackingDetails;
        delivery.lastUpdated = new Date().toISOString();
        
        saveDeliveries();
        updateStats();
        
        if (currentTab === 'list') {
            filterDeliveries();
        }

    } catch (error) {
        console.error('배송 조회 오류:', error);
    }
}

// 모의 자동 검색 결과 생성
function generateMockAutoSearchResults(phone, platform) {
    const results = [];
    const numResults = Math.floor(Math.random() * 3) + 1;

    const platformList = platform === 'all' 
        ? ['naver', 'coupang', 'oliveyoung']
        : [platform];

    const products = [
        '무선 이어폰', '키보드', '마우스', '립스틱 세트', 
        '스킨케어 세트', '노트북 파우치', '텀블러', '운동화',
        '블루투스 스피커', '휴대폰 케이스'
    ];

    const carrierCodes = ['04', '05', '08', '06'];

    for (let i = 0; i < numResults; i++) {
        const selectedPlatform = platformList[Math.floor(Math.random() * platformList.length)];
        const product = products[Math.floor(Math.random() * products.length)];
        const carrier = carrierCodes[Math.floor(Math.random() * carrierCodes.length)];
        const trackingNumber = Math.floor(Math.random() * 1000000000000).toString().padStart(12, '0');

        results.push({
            id: Date.now() + i,
            platform: selectedPlatform,
            productName: product,
            carrier: carrier,
            trackingNumber: trackingNumber,
            addedAt: new Date().toISOString(),
            autoAdded: true,
            phone: phone
        });
    }

    return results;
}

// 모의 추적 데이터 생성
function generateMockTrackingData() {
    const levels = [1, 2, 3, 4, 5, 6];
    const level = levels[Math.floor(Math.random() * levels.length)];
    
    const now = new Date();
    const trackingDetails = [];

    const events = [
        { level: 1, kind: '상품인수', where: '서울 강남구 집하장', timeOffset: 48 },
        { level: 2, kind: '상품이동중', where: '서울 강남구 집하장', timeOffset: 36 },
        { level: 3, kind: '배송지도착', where: '경기 성남시 분당구 집하장', timeOffset: 24 },
        { level: 4, kind: '배송출발', where: '경기 성남시 분당구 대리점', timeOffset: 12 },
        { level: 5, kind: '배송출발', where: '경기 성남시 분당구', timeOffset: 6 },
        { level: 6, kind: '배송완료', where: '경기 성남시 분당구 (문앞)', timeOffset: 2 }
    ];

    for (let i = 0; i < level; i++) {
        const event = events[i];
        trackingDetails.push({
            kind: event.kind,
            level: event.level,
            where: event.where,
            timeString: formatDateTimeString(new Date(now - 3600000 * event.timeOffset))
        });
    }

    return {
        level,
        trackingDetails: trackingDetails.reverse()
    };
}

// 배송 삭제
function deleteDelivery(deliveryId) {
    if (confirm('이 배송 정보를 삭제하시겠습니까?')) {
        deliveries = deliveries.filter(d => d.id !== deliveryId);
        saveDeliveries();
        filterDeliveries();
        updateStats();
    }
}

// 필터링
function filterDeliveries() {
    const platformFilter = document.getElementById('filterPlatform').value;
    const statusFilter = document.getElementById('filterStatus').value;

    let filtered = deliveries;

    if (platformFilter) {
        filtered = filtered.filter(d => d.platform === platformFilter);
    }

    if (statusFilter) {
        filtered = filtered.filter(d => {
            if (!d.trackingDetails || d.trackingDetails.length === 0) return false;
            return d.trackingDetails[0].kind === statusFilter;
        });
    }

    renderDeliveries(filtered);
}

// 배송 목록 렌더링
function renderDeliveries(deliveriesToShow = deliveries) {
    const listContainer = document.getElementById('deliveryList');
    const emptyState = document.getElementById('emptyState');

    if (deliveriesToShow.length === 0) {
        listContainer.innerHTML = '';
        emptyState.style.display = 'block';
        return;
    }

    emptyState.style.display = 'none';
    
    listContainer.innerHTML = deliveriesToShow
        .sort((a, b) => new Date(b.addedAt) - new Date(a.addedAt))
        .map(delivery => {
            const platform = platforms[delivery.platform];
            const carrier = carriers[delivery.carrier];
            
            let statusBadge = '<span class="status-badge status-preparing">조회중...</span>';
            let timelineHTML = '';

            if (delivery.trackingDetails && delivery.trackingDetails.length > 0) {
                const latestStatus = delivery.trackingDetails[0];
                const statusClass = latestStatus.level === 6 ? 'delivered' : 
                                  latestStatus.level >= 4 ? 'shipping' : 'preparing';
                statusBadge = `<span class="status-badge status-${statusClass}">${latestStatus.kind}</span>`;

                timelineHTML = `
                    <div class="timeline">
                        <h4 class="timeline-title">📍 배송 상세</h4>
                        ${delivery.trackingDetails.map(event => `
                            <div class="timeline-item">
                                <div class="timeline-time">${event.timeString}</div>
                                <div class="timeline-content">
                                    <div class="timeline-status">${event.kind}</div>
                                    <div class="timeline-location">${event.where}</div>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                `;
            }

            return `
                <div class="delivery-card">
                    <div class="card-header">
                        <div>
                            <span class="platform-badge ${platform.class}">${platform.name}</span>
                            ${delivery.autoAdded ? '<span class="badge" style="background: #28a745; margin-left: 5px;">🔍 자동</span>' : ''}
                        </div>
                        ${statusBadge}
                    </div>
                    
                    <h3 class="product-name">${delivery.productName}</h3>
                    
                    <div class="tracking-info">
                        <div class="tracking-row">
                            <span class="tracking-label">택배사</span>
                            <span class="tracking-value">${carrier.name}</span>
                        </div>
                        <div class="tracking-row">
                            <span class="tracking-label">송장번호</span>
                            <span class="tracking-value">${delivery.trackingNumber}</span>
                        </div>
                        <div class="tracking-row">
                            <span class="tracking-label">등록일</span>
                            <span class="tracking-value">${formatDate(delivery.addedAt)}</span>
                        </div>
                        ${delivery.lastUpdated ? `
                            <div class="tracking-row">
                                <span class="tracking-label">최근 업데이트</span>
                                <span class="tracking-value">${formatDateTime(delivery.lastUpdated)}</span>
                            </div>
                        ` : ''}
                    </div>
                    
                    ${timelineHTML}
                    
                    <div class="card-actions">
                        <button class="btn btn-small btn-refresh" onclick="trackDelivery(${delivery.id})">
                            🔄 새로고침
                        </button>
                        <button class="btn btn-small btn-delete" onclick="deleteDelivery(${delivery.id})">
                            🗑️ 삭제
                        </button>
                    </div>
                </div>
            `;
        }).join('');
}

// 통계 업데이트
function updateStats() {
    document.getElementById('totalCount').textContent = deliveries.length;
    
    const shipping = deliveries.filter(d => 
        d.trackingDetails && 
        d.trackingDetails.length > 0 && 
        d.trackingDetails[0].level >= 2 && 
        d.trackingDetails[0].level < 6
    ).length;
    
    const delivered = deliveries.filter(d => 
        d.trackingDetails && 
        d.trackingDetails.length > 0 && 
        d.trackingDetails[0].level === 6
    ).length;

    document.getElementById('shippingCount').textContent = shipping;
    document.getElementById('deliveredCount').textContent = delivered;
}

// 로딩 표시
function showLoading(show) {
    const overlay = document.getElementById('loadingOverlay');
    if (show) {
        overlay.classList.add('active');
    } else {
        overlay.classList.remove('active');
    }
}

// 로컬 스토리지 저장
function saveDeliveries() {
    localStorage.setItem('deliveries', JSON.stringify(deliveries));
}

// 날짜 포맷팅
function formatDate(dateString) {
    const date = new Date(dateString);
    return `${date.getMonth() + 1}월 ${date.getDate()}일`;
}

function formatDateTime(dateString) {
    const date = new Date(dateString);
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${month}/${day} ${hours}:${minutes}`;
}

function formatDateTimeString(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}`;
}

// 초기화
updateStats();
if (deliveries.length > 0) {
    document.querySelectorAll('.tab')[2].click();
}
