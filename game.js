'use strict';
const cvs = document.getElementById("canvas");
const ctx = cvs.getContext("2d");

const AREA_SIZE = 50;
const CELL_SIZE = 10;

class Cell{
    constructor(x, y, status){
        // Координаты клетки
        this.x = x;
        this.y = y;

        // Статус клетки. Змея, Пища, Мертв
        this.status = status;
    }

    // Отрисовка клетки на поле
    draw(){
        if(this.status == "snake"){
            ctx.fillStyle = '#00ffc6';
        }
        if(this.status == "food"){
            ctx.fillStyle = '#ff0000';
        }
        if(this.status == "dead"){
            ctx.fillStyle = '#ffb511';
        }
        
        ctx.fillRect(this.x*CELL_SIZE, this.y*CELL_SIZE, CELL_SIZE, CELL_SIZE);
    }
}


class Snake{
    constructor(x, y){
        // Координаты головы змейки
        this.x = x;
        this.y = y;

        // Направление движения по осям
        this.vectorX = 1;
        this.vectorY = 0;

        // Массив клеток. составляющх тело змейки
        this.snakeBody = [];

        // Максимальынй размер змейки
        this.snakeMaxLength = 12;

        // Жизнь змейкм
        this.alive = true;
    }


    move(){
        // Задаем координаты в соответствии с вектором движения
        this.x += this.vectorX;
        this.y += this.vectorY;

        // Проверка на выход за пределы поля. Перенос змейки в начало
        if(this.x >= AREA_SIZE) this.x  = 0;
        if(this.y >= AREA_SIZE) this.y  = 0;
        
        // Проверка на выход за пределы поля. Перенос змейки в конец
        if(this.x < 0) this.x  = AREA_SIZE - 1;
        if(this.y < 0) this.y  = AREA_SIZE - 1;


        ctx.clearRect(0, 0, CELL_SIZE * AREA_SIZE, CELL_SIZE * AREA_SIZE);

        // Проверка на пересечение змеи самой себя
        for(let i=0; i<this.snakeBody.length; i++){

            // Если клетки совпадают, змея умирает.
            if(this.snakeBody[i].x == this.x && this.snakeBody[i].y == this.y){

                // Устанавливаем статус "мертв"
                this.alive = false;

                // Перекрашиваем змейку
                for(let i=0; i<this.snakeBody.length; i++){
                    this.snakeBody[i].status = "dead";
                }

            }
            
        }

        // Создаем первую клетку змейки
        this.snakeBody.push(new Cell(this.x, this.y, "snake"));

        // Если размер змейки превышается, выталкиваем последний элемент из хвоста
        if( this.snakeBody.length >= this.snakeMaxLength){
            this.snakeBody.shift();
        }

        // Отрисовываем змейку на поле
        for(let i=0; i<this.snakeBody.length; i++){
            this.snakeBody[i].draw();
        }
    }

    // Изменение направления движения по клавишам
    changeVector(e){
        let button = e.keyCode;
        if(this.vectorX == 0){
            if(button == 39){ // right
                this.vectorX = 1;
                this.vectorY = 0;
            }
            else if(button == 37){ // left
                this.vectorX = -1;
                this.vectorY = 0;
            }
        }
        if(this.vectorY == 0){
            if(button == 40){ // down
                this.vectorX = 0;
                this.vectorY = 1;
            }
            else if(button == 38){ // up
                this.vectorX = 0;
                this.vectorY = -1;
            }
        }
    }
}

// Создаем объект Змейка
let theSnake = new Snake(selfRandom(0, AREA_SIZE),selfRandom(0, AREA_SIZE));

// создаем объект Пища
let food = new Cell(selfRandom(0, AREA_SIZE), selfRandom(0, AREA_SIZE), "food");
food.draw();

// Обработка нажати клавиш
// Оборачиваем в функцию, т.к. теряется контекст
addEventListener("keydown", function(e){theSnake.changeVector(e)});

// Генератор случайного числа в дивпазоне
function selfRandom(min, max)
{
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Главная функция - Игровой цикл
setTimeout(function run() {
    theSnake.move();
    food.draw();

    // Проверка на пищу
    if(theSnake.x == food.x && theSnake.y == food.y){
        theSnake.snakeMaxLength += 5;
        food.x = selfRandom(0, AREA_SIZE);
        food.y = selfRandom(0, AREA_SIZE);
    }

    // Проверка на жизнь. Если змейка умирает - останавливаем игровой цикл
    if(theSnake.alive == true){
        setTimeout(run, 100);
    }

  }, 100);