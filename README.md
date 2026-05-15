# Заяц против тигра

Простая браузерная игра в стиле Chrome Dino: белый заяц прыгает через препятствия, а оранжевый тигр его преследует.

## Как играть

- Нажми `Пробел`, чтобы начать игру и прыгать.
- На телефоне можно нажимать на игровое поле.
- Слайдер `Скорость` ускоряет движение.
- Слайдер `Препятствия` делает препятствия чаще и выше.

## Как запустить на компьютере

Открой файл `index.html` в браузере. Дополнительные программы для запуска игры не нужны.

## Как выложить на GitHub Pages

1. Создай аккаунт на [github.com](https://github.com), если его еще нет.
2. Создай новый репозиторий, например `rabbit-vs-tiger`.
3. Загрузи в репозиторий файлы `index.html`, `style.css`, `script.js` и `README.md`.
4. Открой настройки репозитория: `Settings` -> `Pages`.
5. В разделе `Build and deployment` выбери:
   - `Source`: `Deploy from a branch`
   - `Branch`: `main`
   - папка: `/(root)`
6. Нажми `Save`.
7. Через минуту GitHub покажет ссылку на сайт с игрой.

Если используешь Git в терминале:

```bash
git init
git add .
git commit -m "Add rabbit vs tiger game"
git branch -M main
git remote add origin https://github.com/USERNAME/rabbit-vs-tiger.git
git push -u origin main
```

Заменить `USERNAME` нужно на свой логин GitHub.
