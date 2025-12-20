export const rows = Array.from({ length: 48 }, (_, index) => ({
  id: index + 1,
  name: `Запись ${String(index + 1).padStart(2, '0')}`,
  category: ['Книги', 'Музыка', 'Игры'][index % 3],
  description:
    index % 5 === 0
      ? 'Длинное описание для проверки переноса текста и ширины столбцов'
      : 'Краткое описание',
  amount: (index + 1) * 125,
}))
