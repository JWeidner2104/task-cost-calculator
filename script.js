function toggleOtherInput(selectElement, otherInputId) {
    const otherInput = document.getElementById(otherInputId);
    if (selectElement.value === 'other') {
        otherInput.classList.remove('hidden');
    } else {
        otherInput.classList.add('hidden');
    }
}

function calculateTaskCost() {
    const task = document.getElementById('task').value;
    const salary = getFinalValue('salary', 'salaryOther');
    const benefitsPercent = getFinalValue('benefits', 'benefitsOther');
    const taskMinutes = getFinalValue('taskMinutes', 'taskMinutesOther');
    const vacationDays = getFinalValue('vacationDays', 'vacationDaysOther');
    const sickDays = getFinalValue('sickDays', 'sickDaysOther');

    const totalCompensation = salary + (salary * (benefitsPercent / 100));
    const totalWorkingDays = (52 * 5) - (vacationDays + sickDays);
    const hourlyRate = totalCompensation / (totalWorkingDays * 8); 
    const dailyCost = hourlyRate * (taskMinutes / 60);
    const annualCost = dailyCost * totalWorkingDays;

    const result = {
        task,
        salary,
        benefitsPercent,
        taskMinutes,
        vacationDays,
        sickDays,
        totalCompensation: totalCompensation.toFixed(2),
        hourlyRate: hourlyRate.toFixed(2),
        dailyCost: dailyCost.toFixed(2),
        annualCost: annualCost.toFixed(2)
    };

    document.getElementById('result').innerHTML = `
        <strong>Task Cost Summary:</strong><br>
        Total Compensation: $${result.totalCompensation}<br>
        Hourly Rate: $${result.hourlyRate}<br>
        Daily Cost: $${result.dailyCost}<br>
        Annual Task Cost: <strong>$${result.annualCost}</strong>
    `;

    // Send data to Make.com webhook
    fetch('https://hook.us1.make.com/s7lfyy83l9mne35p9iuto47f3gnvtavn', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(result),
    })
    .then(() => {
        console.log("Data sent to Make.com");
    })
    .catch((error) => {
        console.error("Error sending data to Make.com:", error);
    });
}

function getFinalValue(selectId, otherInputId) {
    const selectElement = document.getElementById(selectId);
    const otherInput = document.getElementById(otherInputId);
    if (selectElement.value === 'other' && otherInput.value) {
        return parseFloat(otherInput.value);
    }
    return parseFloat(selectElement.value);
}
