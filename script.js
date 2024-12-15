function toggleOtherInput(selectElement, otherInputId) {
    const otherInput = document.getElementById(otherInputId);
    if (selectElement.value === 'other') {
        otherInput.classList.remove('hidden');
    } else {
        otherInput.classList.add('hidden');
    }
}

function getFinalValue(selectId, otherInputId) {
    const selectElement = document.getElementById(selectId);
    const otherInput = document.getElementById(otherInputId);
    if (selectElement.value === 'other' && otherInput.value) {
        return parseFloat(otherInput.value);
    }
    return parseFloat(selectElement.value);
}

function calculateTaskCost() {
    const task = document.getElementById('task').value;
    const salary = getFinalValue('salary', 'salaryOther');
    const benefitsPercent = getFinalValue('benefits', 'benefitsOther') / 100;
    const taskMinutes = getFinalValue('taskMinutes', 'taskMinutesOther');
    const vacationDays = getFinalValue('vacationDays', 'vacationDaysOther');
    const sickDays = getFinalValue('sickDays', 'sickDaysOther');

    if (isNaN(salary) || isNaN(benefitsPercent) || isNaN(taskMinutes) || isNaN(vacationDays) || isNaN(sickDays)) {
        document.getElementById('result').innerText = "Please fill out all required fields.";
        return;
    }

    const totalCompensation = salary + (salary * benefitsPercent);
    const totalWorkingDays = (52 * 5) - (vacationDays + sickDays);
    const totalWorkingWeeks = totalWorkingDays / 5;
    const totalWorkingHours = totalWorkingWeeks * 40;
    const hourlyRate = totalCompensation / totalWorkingHours;

    const dailyCost = hourlyRate * (taskMinutes / 60);
    const annualCost = dailyCost * totalWorkingDays;

    const result = {
        task,
        salary,
        benefitsPercent: benefitsPercent * 100,
        taskMinutes,
        vacationDays,
        sickDays,
        totalCompensation: totalCompensation.toFixed(2),
        hourlyRate: hourlyRate.toFixed(2),
        dailyCost: dailyCost.toFixed(2),
        annualCost: annualCost.toFixed(2),
    };

    // Display the calculated results
    document.getElementById('result').innerHTML = `
        <strong>Task Cost Summary:</strong><br>
        Total Compensation: $${result.totalCompensation}<br>
        Hourly Rate: $${result.hourlyRate}<br>
        Daily Cost: $${result.dailyCost}<br>
        Annual Task Cost: <strong>$${result.annualCost}</strong>
    `;

    // Send the data to Make.com webhook
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
