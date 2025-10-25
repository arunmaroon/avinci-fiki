export const commonUtil = {
  countdownTimer(totalSeconds: any) {
    // Calculate remaining hours, minutes, and seconds
    var remainingHours = Math.floor(totalSeconds / 3600);
    var remainingMinutes = Math.floor((totalSeconds % 3600) / 60);
    var remainingSeconds = totalSeconds % 60;

    // Format the timer display based on remaining time
    var timerDisplay = "";
    if (remainingHours > 0) {
      timerDisplay += `${remainingHours.toString().padStart(2, "0")}:`;
    }
    if (remainingHours === 0 && remainingMinutes > 0) {
      timerDisplay += `${remainingMinutes.toString().padStart(2, "0")}:`;
    }
    if (remainingHours === 0 && remainingMinutes === 0) {
      timerDisplay += `0:`;
    }
    timerDisplay += `${remainingSeconds.toString().padStart(2, "0")}`;

    return timerDisplay;
  },
};

export default commonUtil;
