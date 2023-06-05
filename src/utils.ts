const speciesFix = (str: string) => (
    {
        "Кот": "Коты/кошки",
        "Хомяк": "Хомяки",
        "Собака": "Собаки"
    }
)[str] ?? str

export { speciesFix }