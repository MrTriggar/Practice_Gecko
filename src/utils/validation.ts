// Валидация текста сегмента
export const validateSegmentText = (text: string): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (!text.trim()) {
    errors.push('Текст не может быть пустым');
  }
  
  if (text.length < 2) {
    errors.push('Текст слишком короткий');
  }
  
  // Проверка на технические термины (пример)
  const techTerms = ['YADRO', 'TATLIN', 'API', 'SSD'];
  const upperText = text.toUpperCase();
  techTerms.forEach(term => {
    if (upperText.includes(term) && !text.includes(term)) {
      errors.push(`Термин "${term}" должен быть написан заглавными буквами`);
    }
  });
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

// Проверка времени сегмента
export const validateSegmentTime = (start: number, end: number, duration: number): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (start < 0 || end > duration) {
    errors.push('Время выходит за пределы аудио');
  }
  
  if (start >= end) {
    errors.push('Начало не может быть позже конца');
  }
  
  if (end - start < 0.3) {
    errors.push('Слишком короткий сегмент (меньше 0.3 секунд)');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};