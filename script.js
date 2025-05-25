document.addEventListener('DOMContentLoaded', function() {
    // جلب عناصر الإدخال من الـ HTML
    const highSchoolFinalScoreInput = document.getElementById('highSchoolFinalScore'); // حقل معدل الثانوي العام المباشر

    const firstYearAvgInput = document.getElementById('firstYearAvg');
    const secondYearAvgInput = document.getElementById('secondYearAvg');
    const thirdSem1Input = document.getElementById('thirdSem1');
    const thirdSem2Input = document.getElementById('thirdSem2');
    const thirdSem3Input = document.getElementById('thirdSem3');
    const thirdYearFinalScoreInput = document.getElementById('thirdYearFinalScore'); // حقل إدخال ثالث ثانوي المباشر

    const aptitudeScoreInput = document.getElementById('aptitudeScore');
    const achievementScoreInput = document.getElementById('achievementScore');
    const calculateBtn = document.getElementById('calculateBtn');

    // جلب عناصر عرض النتائج من الـ HTML
    const thirdYearPercentageResultSpan = document.getElementById('thirdYearPercentageResult');
    const highSchoolAverageResultSpan = document.getElementById('highSchoolAverageResult');
    const weightedScoreResultSpan = document.getElementById('weightedScoreResult');

    // عناصر التحكم في طريقة إدخال نسبة ثالث ثانوي (داخل القسم المفصل للثانوي)
    const toggleThirdYearMethod = document.getElementById('toggleThirdYearMethod');
    const thirdYearSemestersSection = document.getElementById('thirdYearSemesters');
    const thirdYearDirectSection = document.getElementById('thirdYearDirect');

    // العناصر الجديدة للتحكم في أقسام الثانوي
    const toggleDetailedHighSchoolBtn = document.getElementById('toggleDetailedHighSchoolBtn');
    const highSchoolDirectInputSection = document.getElementById('highSchoolDirectInputSection');
    const detailedHighSchoolSection = document.getElementById('detailedHighSchoolSection');

    // الأوزان للنسبة الموزونة (ثابتة للقسم العلمي فقط)
    const WEIGHTS = {
        secondary: 0.30,   // 30% لمعدل الثانوي
        aptitude: 0.30,    // 30% للقدرات
        achievement: 0.40  // 40% للتحصيلي
    };

    // دالة مساعدة للتحقق من أن الدرجة صالحة (رقم وليست فارغة، بين 0 و 100)
    function isValidScore(score) {
        return !isNaN(score) && score >= 0 && score <= 100;
    }

    // دالة لمسح شاشات النتائج
    function updateResultsDisplay() {
        thirdYearPercentageResultSpan.textContent = "--";
        highSchoolAverageResultSpan.textContent = "--";
        weightedScoreResultSpan.textContent = "--";
    }

    // إخفاء قسم حساب الثانوي المفصل في البداية
    detailedHighSchoolSection.classList.add('hidden');
    // تأكد من أن قسم إدخال ثالث ثانوي بالفصول ظاهر افتراضياً عند ظهور القسم المفصل
    thirdYearSemestersSection.classList.remove('hidden');
    thirdYearDirectSection.classList.add('hidden');

    // إضافة مستمع حدث لزر "لا أعرف النسبة النهائية للثانوية العامة"
    toggleDetailedHighSchoolBtn.addEventListener('click', function() {
        // تبديل إظهار وإخفاء الأقسام
        highSchoolDirectInputSection.classList.toggle('hidden');
        detailedHighSchoolSection.classList.toggle('hidden');

        // مسح القيم عند التبديل
        highSchoolFinalScoreInput.value = '';
        firstYearAvgInput.value = '';
        secondYearAvgInput.value = '';
        thirdSem1Input.value = '';
        thirdSem2Input.value = '';
        thirdSem3Input.value = '';
        thirdYearFinalScoreInput.value = '';

        updateResultsDisplay(); // مسح النتائج عند التبديل
    });

    // إضافة مستمع حدث لزر تبديل طريقة إدخال نسبة ثالث ثانوي (داخل القسم المفصل)
    toggleThirdYearMethod.addEventListener('change', function() {
        if (toggleThirdYearMethod.checked) {
            thirdYearSemestersSection.classList.add('hidden');
            thirdYearDirectSection.classList.remove('hidden');
        } else {
            thirdYearSemestersSection.classList.remove('hidden');
            thirdYearDirectSection.classList.add('hidden');
        }
        // مسح القيم عند التبديل وتحديث النتائج
        thirdSem1Input.value = '';
        thirdSem2Input.value = '';
        thirdSem3Input.value = '';
        thirdYearFinalScoreInput.value = '';
        updateResultsDisplay();
    });

    // إضافة مستمع حدث عند النقر على زر "احسب"
    calculateBtn.addEventListener('click', function() {
        let thirdYearPercentage;
        let highSchoolAverage;
        let errors = [];

        // 1. تحديد كيفية الحصول على معدل الثانوي العام
        if (!detailedHighSchoolSection.classList.contains('hidden')) { // إذا كان قسم الحساب المفصل ظاهرًا
            // حساب نسبة ثالث ثانوي أولاً (من الفصول أو مباشرة)
            if (toggleThirdYearMethod.checked) { // إدخال مباشر لثالث ثانوي
                thirdYearPercentage = parseFloat(thirdYearFinalScoreInput.value);
                if (!isValidScore(thirdYearPercentage)) {
                    errors.push("الرجاء إدخال نسبة ثالث ثانوي النهائية بشكل صحيح (بين 0 و 100).");
                }
            } else { // حساب ثالث ثانوي من الفصول
                const thirdSem1 = parseFloat(thirdSem1Input.value);
                const thirdSem2 = parseFloat(thirdSem2Input.value);
                const thirdSem3 = parseFloat(thirdSem3Input.value);
                if (!isValidScore(thirdSem1) || !isValidScore(thirdSem2) || !isValidScore(thirdSem3)) {
                    errors.push("الرجاء إدخال جميع درجات فصول ثالث ثانوي بشكل صحيح (بين 0 و 100).");
                } else {
                    thirdYearPercentage = (thirdSem1 * 0.25) + (thirdSem2 * 0.35) + (thirdSem3 * 0.40);
                }
            }

            // حساب معدل الثانوي العام من السنوات (أولى، ثاني، ثالث)
            const firstYearAvg = parseFloat(firstYearAvgInput.value);
            const secondYearAvg = parseFloat(secondYearAvgInput.value);

            if (!isValidScore(firstYearAvg) || !isValidScore(secondYearAvg) || isNaN(thirdYearPercentage)) { // تأكد من ثالث ثانوي أيضاً
                errors.push("الرجاء إدخال معدلات أولى وثاني ثانوي والفصول لثالث ثانوي بشكل صحيح (بين 0 و 100).");
            } else {
                highSchoolAverage = (firstYearAvg * 0.20) + (secondYearAvg * 0.40) + (thirdYearPercentage * 0.40);
            }

        } else { // إذا كان قسم الإدخال المباشر للثانوي ظاهرًا
            highSchoolAverage = parseFloat(highSchoolFinalScoreInput.value);
            if (!isValidScore(highSchoolAverage)) {
                errors.push("الرجاء إدخال معدل الثانوي العام بشكل صحيح (بين 0 و 100).");
            }
            // إذا لم يتم إدخال معدل ثانوي مباشر، فنسبة ثالث ثانوي لا يمكن تحديدها هنا، نضعها "--"
            thirdYearPercentage = NaN; // للدلالة على أنها لم تُحسب بهذه الطريقة
        }

        // 2. جلب درجات القدرات والتحصيلي
        const aptitudeScore = parseFloat(aptitudeScoreInput.value);
        const achievementScore = parseFloat(achievementScoreInput.value);

        // 3. التحقق من صحة درجات القدرات والتحصيلي
        if (!isValidScore(aptitudeScore)) {
            errors.push("الرجاء إدخال درجة القدرات بشكل صحيح (بين 0 و 100).");
        }
        if (!isValidScore(achievementScore)) {
            errors.push("الرجاء إدخال درجة التحصيلي بشكل صحيح (بين 0 و 100).");
        }

        // إذا كان هناك أي أخطاء، اعرضها وتوقف
        if (errors.length > 0) {
            updateResultsDisplay();
            weightedScoreResultSpan.innerHTML = errors.join('<br>'); // عرض الأخطاء بسطر جديد لكل خطأ
            return;
        }

        // 4. عرض النتائج الوسيطة
        thirdYearPercentageResultSpan.textContent = isValidScore(thirdYearPercentage) ? thirdYearPercentage.toFixed(2) + "%" : "--";
        highSchoolAverageResultSpan.textContent = highSchoolAverage.toFixed(2) + "%";

        // 5. حساب النسبة الموزونة النهائية
        const weightedScore =
            (highSchoolAverage * WEIGHTS.secondary) +
            (aptitudeScore * WEIGHTS.aptitude) +
            (achievementScore * WEIGHTS.achievement);

        weightedScoreResultSpan.textContent = weightedScore.toFixed(2) + "%";
    });
});