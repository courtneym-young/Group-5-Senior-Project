
export function formatDate(inputDate: string): string {
    if (inputDate === "") {
        return ""
    }
    const date = new Date(inputDate);
  
    return date.toLocaleString('en-US', {
      month: 'short',
      day: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    }).replace(',', ''); // Removes the comma after the day
  }