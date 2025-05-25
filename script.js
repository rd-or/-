document.addEventListener('DOMContentLoaded', function() {
    // جلب عناصر الإدخال من الـ HTML
    const thirdSem1Input = document.getElementById('thirdSem1');
    const thirdSem2Input = document.getElementById('thirdSem2');
    const thirdSem3Input = document.getElementById('thirdSem3');
    const firstYearAvgInput = document.getElementById('firstYearAvg');
    const secondYearAvgInput = document.getElementById('secondYearAvg');
    const aptitudeScoreInput = document.getElementById('aptitudeScore');
    const achievementScoreInput = document.getElementById('achievementScore');
    // const sectionTypeSelect = document.getElementById('sectionType'); // تم إزالة هذا العنصر
    const calculateBtn = document.getElementById('calculateBtn');

    // جلب عناصر عرض النتائج من الـ HTML
    const thirdYearPercentageResultSpan = document.getElementById('thirdYearPercentageResult');
    const highSchoolAverageResultSpan = document.getElementById('highSchoolAverageResult');
    const weightedScoreResultSpan = document.getElementById('weightedScoreResult');

    // الأوزان للنسبة الموزونة (أصبحت ثابتة للقسم العلمي فقط)
    // تم ضبطها بناءً على طلبك: قدرات 30%، ثانوي 30%، تحصيلي 40%
    const WEIGHTS = {
        secondary: 0.30,  // 30% لمعدل الثانوي
        aptitude: 0.30,   // 30% للقدرات
        achievement: 0.40 // 40% للتحصيلي
    };

    // إضافة مستمع حدث عند النقر على زر "احسب"
    calculateBtn.addEventListener('click', function() {
        // 1. جلب قيم المدخلات وتحويلها إلى أرقام عشرية
        const thirdSem1 = parseFloat(thirdSem1Input.value);
        const thirdSem2 = parseFloat(thirdSem2Input.value);
        const thirdSem3 = parseFloat(thirdSem3Input.value);
        const firstYearAvg = parseFloat(firstYearAvgInput.value);
        const secondYearAvg = parseFloat(secondYearAvgInput.value);
        const aptitudeScore = parseFloat(aptitudeScoreInput.value);
        const achievementScore = parseFloat(achievementScoreInput.value); // لم يعد هناك حاجة لـ 'let'

        // دالة مساعدة للتحقق من أن الدرجة صالحة (رقم وليست فارغة، بين 0 و 100)
        function isValidScore(score) {
            return !isNaN(score) && score >= 0 && score <= 100;
        }

        // 2. التحقق من صحة جميع المدخلات الضرورية
        // بما أنه علمي فقط، يجب التحقق من جميع الدرجات بما فيها التحصيلي
        if (!isValidScore(thirdSem1) || !isValidScore(thirdSem2) || !isValidScore(thirdSem3) ||
            !isValidScore(firstYearAvg) || !isValidScore(secondYearAvg) ||
            !isValidScore(aptitudeScore) || !isValidScore(achievementScore)) { // التحقق من التحصيلي هنا
            // إذا كان هناك خطأ في أي من هذه المدخلات، اعرض رسالة خطأ وامنع استكمال الحساب
            thirdYearPercentageResultSpan.textContent = "--";
            highSchoolAverageResultSpan.textContent = "--";
            weightedScoreResultSpan.textContent = "الرجاء إدخال جميع الدرجات بشكل صحيح (بين 0 و 100).";
            return; // توقف عن تنفيذ الدالة
        }

        // 3. حساب نسبة ثالث ثانوي
        // المعادلة: (الفصل الأول * 25%) + (الفصل الثاني * 35%) + (الفصل الثالث * 40%)
        const thirdYearPercentage =
            (thirdSem1 * 0.25) +
            (thirdSem2 * 0.35) +
            (thirdSem3 * 0.40);
        thirdYearPercentageResultSpan.textContent = thirdYearPercentage.toFixed(2) + "%"; // عرض النتيجة مع رقمين عشريين

        // 4. حساب معدل الثانوي
        // المعادلة: (أولى * 20%) + (ثاني * 40%) + (ثالث * 40%)
        // نستخدم هنا "thirdYearPercentage" التي حسبناها للتو
        const highSchoolAverage =
            (firstYearAvg * 0.20) +
            (secondYearAvg * 0.40) +
            (thirdYearPercentage * 0.40);
        highSchoolAverageResultSpan.textContent = highSchoolAverage.toFixed(2) + "%"; // عرض النتيجة مع رقمين عشريين

        // 5. حساب النسبة الموزونة (باستخدام الأوزان الجديدة الثابتة)
        // المعادلة: (ثانوي * 30%) + (قدرات * 30%) + (تحصيلي * 40%)
        const weightedScore =
            (highSchoolAverage * WEIGHTS.secondary) +
            (aptitudeScore * WEIGHTS.aptitude) +
            (achievementScore * WEIGHTS.achievement);

        weightedScoreResultSpan.textContent = weightedScore.toFixed(2) + "%"; // عرض النتيجة النهائية مع رقمين عشريين
    });
});