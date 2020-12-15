// todo 重构下面代码，使其支持圆形的面积和计算
class Circle {
    constructor(public radius) {
    }
  }
  
  class Rectangle {
    constructor(public width, public height) {
    }
  }
  
  class Square {
    constructor(public width, public height) {
    }
  }
  
  class AreaCalculator {
    /**
     * 计算图形的面积和
     */
    static Area(shapes: Rectangle[]) {
      let area = 0
      for (let shape of shapes) {
        area += shape.width * shape.height
      }
  
      return area
    }
  }
  
  AreaCalculator.Area([
    new Rectangle(2,4), 
    new Rectangle(3,4),
    new Square(3,3),
    new Circle(3),
  ])