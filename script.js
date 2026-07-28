// ============================================================
// BẢNG HỆ SỐ TRƯỢT GIÁ (1980 → 2026)
// ============================================================
const SLIDE_MAP = {
    1980: 5.81, 1981: 5.81, 1982: 5.81, 1983: 5.81, 1984: 5.81,
    1985: 5.81, 1986: 5.81, 1987: 5.81, 1988: 5.81, 1989: 5.81,
    1990: 5.81, 1991: 5.81, 1992: 5.81, 1993: 5.81, 1994: 5.81,
    1995: 4.91, 1996: 4.65, 1997: 4.50, 1998: 4.18, 1999: 4.01,
    2000: 4.07, 2001: 4.09, 2002: 3.94, 2003: 3.81, 2004: 3.54,
    2005: 3.27, 2006: 3.05, 2007: 2.81, 2008: 2.29, 2009: 2.14,
    2010: 1.96, 2011: 1.65, 2012: 1.51, 2013: 1.42, 2014: 1.36,
    2015: 1.36, 2016: 1.32, 2017: 1.28, 2018: 1.23, 2019: 1.20,
    2020: 1.16, 2021: 1.14, 2022: 1.11, 2023: 1.07, 2024: 1.03,
    2025: 1.00, 2026: 1.00
};
const FIRST_YEAR = 1980;
const LAST_YEAR = 2026;

function getCoef(year) {
    if (year < 1995) return 5.81;
    if (year > LAST_YEAR) return 1.00;
    return SLIDE_MAP[year] || 1.00;
}

// ============================================================
// HỖ TRỢ THEO ĐỐI TƯỢNG
// ============================================================
const SUPPORT = { normal: 66000, ethnic: 99000, nearpoor: 132000, poor: 165000 };
const SUBJECT_NAME = { normal: 'Bình thường', ethnic: 'Dân tộc thiểu số', nearpoor: 'Cận nghèo', poor: 'Nghèo' };

// ============================================================
// TAB SWITCHING
// ============================================================
document.querySelectorAll('.tab').forEach(btn => {
    btn.addEventListener('click', function() {
        document.querySelectorAll('.tab').forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        document.querySelectorAll('.panel').forEach(p => p.classList.remove('active'));
        document.getElementById(this.dataset.tab).classList.add('active');
    });
});

// ============================================================
// TOGGLE DETAIL
// ============================================================
document.getElementById('toggleDetailBtn').addEventListener('click', function() {
    const wrap = document.getElementById('detailWrap');
    const arrow = document.getElementById('arrowIcon');
    wrap.classList.toggle('open');
    arrow.classList.toggle('open');
});

// ============================================================
// OVERLAY ĐĂNG KÝ KÊNH (ĐÃ SỬA LẠI ĐỂ ĐẢM BẢO CHẠY)
// ============================================================
(function() {
    // Lấy các phần tử
    const overlay = document.getElementById('overlay');
    const subscribeBtn = document.getElementById('subscribeBtn');
    const skipBtn = document.getElementById('skipBtn');
    const waitingDisplay = document.getElementById('waitingDisplay');
    const subText = document.getElementById('subText');
    const icon = document.querySelector('.overlay-box .icon');
    const title = document.querySelector('.overlay-box h2');
    const desc = document.querySelector('.overlay-box p');
    const btnYoutube = document.querySelector('.btn-youtube');

    // Kiểm tra nếu đã đăng ký trước đó
    if (localStorage.getItem('bhxh_subscribed') === 'true') {
        overlay.classList.add('hidden');
    }

    // Xử lý nút "Đăng ký kênh"
    if (subscribeBtn) {
        subscribeBtn.addEventListener('click', function(e) {
            // Lưu trạng thái
            localStorage.setItem('bhxh_subscribed', 'true');
            // Ẩn các thành phần không cần thiết, hiển thị chờ
            if (icon) icon.style.display = 'none';
            if (title) title.textContent = '⏳ Đang chờ bạn đăng ký';
            if (desc) desc.textContent = 'Vui lòng hoàn tất đăng ký kênh YouTube của chúng tôi.';
            if (btnYoutube) btnYoutube.style.display = 'none';
            if (subText) subText.style.display = 'none';
            if (waitingDisplay) waitingDisplay.style.display = 'block';
            // Sau 5 giây reload
            setTimeout(function() {
                window.location.reload();
            }, 5000);
        });
    }

    // Xử lý nút "Bỏ qua (dùng thử)"
    if (skipBtn) {
        skipBtn.addEventListener('click', function() {
            localStorage.setItem('bhxh_subscribed', 'true');
            overlay.classList.add('hidden');
        });
    }

    // Debug: log ra để kiểm tra
    console.log('Overlay initialized. Subscribe button:', subscribeBtn, 'Skip button:', skipBtn);
})();

// ============================================================
// TAB 1: LƯƠNG HƯU (ĐÃ BỎ THÁNG SINH)
// ============================================================
function calcPension() {
    const birthYear = parseInt(document.getElementById('birthYear').value) || 1988;
    const gender = document.getElementById('gender').value;
    const salary = parseFloat(document.getElementById('salary1').value) || 0;
    let yearsInput = parseInt(document.getElementById('yearsInput').value) || 15;
    if (yearsInput < 15) yearsInput = 15;

    const retireAge = gender === 'male' ? 62 : 60;
    const endYear = birthYear + retireAge;
    const currentYear = 2026;

    let maxActualYears = endYear - currentYear;
    if (maxActualYears < 0) maxActualYears = 0;

    let actualYears = Math.min(yearsInput, maxActualYears);
    let buyYears = yearsInput - actualYears;

    const actualStartYear = currentYear;
    const buyStartYear = currentYear + actualYears;

    let rows = [];
    let totalAdj = 0;
    let totalMonths = 0;

    for (let i = 0; i < actualYears; i++) {
        const year = actualStartYear + i;
        let baseYear = currentYear - maxActualYears + 1 + i;
        if (maxActualYears <= 0) baseYear = currentYear + i;
        const coef = getCoef(baseYear);
        const monthly = salary * coef;
        const yearly = monthly * 12;
        totalAdj += yearly;
        totalMonths += 12;
        rows.push({ year, baseYear, coef, monthly, yearly, type: 'thực tế' });
    }

    for (let i = 0; i < buyYears; i++) {
        const year = buyStartYear + i;
        const coef = 1.00;
        const monthly = salary * coef;
        const yearly = monthly * 12;
        totalAdj += yearly;
        totalMonths += 12;
        rows.push({ year, baseYear: year, coef, monthly, yearly, type: 'bù' });
    }

    while (totalMonths / 12 < 15) {
        const year = buyStartYear + buyYears;
        const coef = 1.00;
        const monthly = salary * coef;
        const yearly = monthly * 12;
        totalAdj += yearly;
        totalMonths += 12;
        rows.push({ year, baseYear: year, coef, monthly, yearly, type: 'bù' });
        buyYears++;
    }

    if (totalMonths === 0) {
        document.getElementById('pension1').innerHTML = '⚠️ Không có dữ liệu đóng';
        document.getElementById('years1').textContent = '0';
        document.getElementById('rate1').textContent = '0%';
        document.getElementById('avg1').innerHTML = '0 <small>VNĐ</small>';
        document.getElementById('range1').textContent = '0 năm';
        document.getElementById('retireDate1').textContent = '📅 Nghỉ hưu: năm ' + endYear;
        document.getElementById('detailBody').innerHTML = '<tr><td colspan="6" style="padding:20px;color:#8a9fb0;">Không có dữ liệu</td></tr>';
        document.getElementById('detailFoot').style.display = 'none';
        return;
    }

    const avg = totalAdj / totalMonths;
    const fullYears = Math.floor(totalMonths / 12);

    let rate = 0;
    if (gender === 'male') {
        if (fullYears >= 20) {
            rate = 45 + (fullYears - 20) * 2;
        } else {
            rate = 40 + (fullYears - 15) * 1;
        }
    } else {
        if (fullYears >= 15) {
            rate = 45 + (fullYears - 15) * 2;
        } else {
            rate = 0;
        }
    }
    rate = Math.min(75, Math.max(0, rate));
    const pension = (rate / 100) * avg;

    document.getElementById('pension1').innerHTML = Math.round(pension).toLocaleString() + ' <small>VNĐ</small>';
    document.getElementById('years1').textContent = fullYears + ' năm';
    document.getElementById('rate1').textContent = rate.toFixed(1) + '%';
    document.getElementById('avg1').innerHTML = Math.round(avg).toLocaleString() + ' <small>VNĐ</small>';
    document.getElementById('range1').textContent = yearsInput + ' năm' + (buyYears > 0 ? ' (có ' + buyYears + ' năm đóng bù)' : '');
    document.getElementById('retireDate1').textContent = '📅 Nghỉ hưu: năm ' + endYear;

    let html = '';
    let totalAdjDisplay = 0;
    for (let r of rows) {
        totalAdjDisplay += r.yearly;
        const note = r.type === 'bù' ? ' (bù)' : '';
        html += `<tr class="highlight">
            <td>${r.year}</td>
            <td>${r.baseYear}</td>
            <td>${r.coef.toFixed(2)}</td>
            <td>${Math.round(r.monthly).toLocaleString()}</td>
            <td>${Math.round(r.yearly).toLocaleString()}</td>
            <td>${note}</td>
        </tr>`;
    }
    document.getElementById('detailBody').innerHTML = html;
    document.getElementById('totalAdjDisplay').textContent = Math.round(totalAdjDisplay).toLocaleString();
    document.getElementById('detailFoot').style.display = 'table-footer-group';

    const wrap = document.getElementById('detailWrap');
    const arrow = document.getElementById('arrowIcon');
    if (fullYears > 10) {
        wrap.classList.add('open');
        arrow.classList.add('open');
    } else {
        wrap.classList.remove('open');
        arrow.classList.remove('open');
    }
}

// ============================================================
// TAB 2: ĐÓNG BÙ (ĐÃ SỬA - KHÔNG GHI ĐÈ SỐ THÁNG)
// ============================================================
function calcBuyback() {
    const paidStr = document.getElementById('paid').value || '0/0';
    const gender = document.getElementById('gender2').value;
    const income = parseFloat(document.getElementById('buyIncome').value) || 0;
    const subject = document.getElementById('subject2').value;
    const monthlyRate = parseFloat(document.getElementById('rate2').value) / 100 || 0.0031;
    let months = parseInt(document.getElementById('months2').value) || 60;
    if (months < 1) months = 1;
    if (months > 60) months = 60;

    // KHÔNG tự động ghi đè months nữa
    // Chỉ hiển thị số tháng còn thiếu để tham khảo (không bắt buộc)
    const [yearPaid, monthPaid] = paidStr.split('/').map(Number);
    const totalPaid = (yearPaid || 0) * 12 + (monthPaid || 0);
    const required = 15 * 12;
    let missing = required - totalPaid;
    if (missing < 0) missing = 0;
    if (missing > 60) missing = 60;

    // Vẫn dùng months nhập từ người dùng (không bị ghi đè)
    const support = SUPPORT[subject] || 0;
    const monthlyContribution = income * 0.22;
    const totalPrincipal = monthlyContribution * months;
    const totalSupport = support * months;

    let totalInterest = 0;
    if (months > 0 && monthlyRate > 0) {
        for (let i = 1; i <= months; i++) {
            const remainingMonths = months - i + 1;
            const futureValue = monthlyContribution * Math.pow(1 + monthlyRate, remainingMonths);
            totalInterest += (futureValue - monthlyContribution);
        }
    }

    const totalFutureValue = totalPrincipal + totalInterest;
    const finalAmount = totalFutureValue - totalSupport;

    document.getElementById('buyTotal').innerHTML = Math.round(finalAmount).toLocaleString() + ' <small>VNĐ</small>';
    document.getElementById('buyPrincipal').innerHTML = Math.round(totalPrincipal).toLocaleString() + ' <small>VNĐ</small>';
    document.getElementById('buyInterest').innerHTML = Math.round(totalInterest).toLocaleString() + ' <small>VNĐ</small>';
    document.getElementById('buySupport').innerHTML = Math.round(totalSupport).toLocaleString() + ' <small>VNĐ</small>';
    document.getElementById('buyMonthly').innerHTML = Math.round(monthlyContribution).toLocaleString() + ' <small>VNĐ</small>';
    document.getElementById('badge2').textContent = months + ' tháng';
    if (months === 0) document.getElementById('badge2').textContent = '✅ Đủ 15 năm';
}

// ============================================================
// TAB 3: ĐÓNG TRƯỚC
// ============================================================
function calcAhead() {
    const income = parseFloat(document.getElementById('aheadIncome').value) || 0;
    const subject = document.getElementById('subject3').value;
    let months = parseInt(document.getElementById('aheadMonthsInput').value) || 60;
    if (months < 24) months = 24;
    if (months > 60) months = 60;
    const rate = parseFloat(document.getElementById('aheadRate').value) / 100 || 0.0031;

    const monthlyPay = income * 0.22;
    const principal = monthlyPay * months;
    let presentValue = 0;
    for (let i = 1; i <= months; i++) {
        presentValue += monthlyPay / Math.pow(1 + rate, i - 1);
    }
    const discount = principal - presentValue;
    const support = SUPPORT[subject] || 0;
    const supportTotal = support * months;
    const finalAmount = principal - discount - supportTotal;

    document.getElementById('aheadTotal').innerHTML = Math.round(finalAmount).toLocaleString() + ' <small>VNĐ</small>';
    document.getElementById('aheadPrincipal').innerHTML = Math.round(principal).toLocaleString() + ' <small>VNĐ</small>';
    document.getElementById('aheadDiscount').innerHTML = Math.round(discount).toLocaleString() + ' <small>VNĐ</small>';
    document.getElementById('aheadSupport').innerHTML = Math.round(supportTotal).toLocaleString() + ' <small>VNĐ</small>';
    document.getElementById('aheadMonthsDisplay').textContent = months;
    document.getElementById('range3').textContent = months + ' tháng';
}

// ============================================================
// TAB 4: TỰ NGUYỆN
// ============================================================
function calcVoluntary() {
    const income = parseFloat(document.getElementById('volIncome').value) || 0;
    const subject = document.getElementById('subject4').value;
    const method = parseInt(document.getElementById('volMethod').value) || 12;
    const supported = parseInt(document.getElementById('volSupported').value) || 0;

    const support = SUPPORT[subject] || 0;
    const base = income * 0.22;
    const actualSupport = (supported < 120) ? support : 0;
    const actualPay = base - actualSupport;
    const perPay = actualPay * method;
    const times = 12 / method;

    document.getElementById('volBadge').textContent = SUBJECT_NAME[subject] || 'Bình thường';
    document.getElementById('volTotal').innerHTML = Math.round(actualPay).toLocaleString() + ' <small>VNĐ</small>';
    document.getElementById('volBase').innerHTML = Math.round(base).toLocaleString() + ' <small>VNĐ</small>';
    document.getElementById('volSupport').innerHTML = Math.round(actualSupport).toLocaleString() + ' <small>VNĐ</small>';
    document.getElementById('volPerPay').innerHTML = Math.round(perPay).toLocaleString() + ' <small>VNĐ</small>';
    document.getElementById('volTimes').textContent = times + ' lần';
}

// ============================================================
// GÁN SỰ KIỆN CHO CÁC NÚT
// ============================================================
document.getElementById('btnCalcPension').addEventListener('click', calcPension);
document.getElementById('btnCalcBuyback').addEventListener('click', calcBuyback);
document.getElementById('btnCalcAhead').addEventListener('click', calcAhead);
document.getElementById('btnCalcVoluntary').addEventListener('click', calcVoluntary);

// ============================================================
// GÁN SỰ KIỆN INPUT CHO TỰ ĐỘNG TÍNH
// ============================================================
document.querySelectorAll('#tab1 input, #tab1 select').forEach(el => {
    el.addEventListener('input', calcPension);
    el.addEventListener('change', calcPension);
});

// ============================================================
// KHỞI TẠO - TỰ ĐỘNG TÍNH KHI TẢI TRANG
// ============================================================
window.addEventListener('DOMContentLoaded', function() {
    calcPension();
    calcBuyback();
    calcAhead();
    calcVoluntary();
});

// ============================================================
// OVERLAY ĐĂNG KÝ KÊNH
// ============================================================
(function() {
    const overlay = document.getElementById('overlay');
    const btn = document.getElementById('subscribeBtn');
    const skipBtn = document.getElementById('skipBtn');
    const icon = document.getElementById('iconDisplay');
    const title = document.getElementById('titleDisplay');
    const desc = document.getElementById('descDisplay');
    const subText = document.getElementById('subText');
    const waiting = document.getElementById('waitingDisplay');

    if (localStorage.getItem('bhxh_subscribed') === 'true') {
        overlay.classList.add('hidden');
    }

    btn.addEventListener('click', function(e) {
        localStorage.setItem('bhxh_subscribed', 'true');
        icon.style.display = 'none';
        title.textContent = '⏳ Đang chờ bạn đăng ký';
        desc.textContent = 'Vui lòng hoàn tất đăng ký kênh YouTube của chúng tôi.';
        btn.style.display = 'none';
        subText.style.display = 'none';
        waiting.style.display = 'block';
        setTimeout(function() {
            window.location.reload();
        }, 5000);
    });

    skipBtn.addEventListener('click', function() {
        localStorage.setItem('bhxh_subscribed', 'true');
        overlay.classList.add('hidden');
    });
})();