var getMessage = function(a, b){

	if (typeof(a) === "boolean") {
		if(a) {
			return "Переданное GIF-изображение анимировано и содержит [" + b + "] кадров";
		}
		return "Переданное GIF-изображение не анимировано";
	}
	if (typeof(a) === "number") {
		return "Переданное SVG-изображение содержит [" + a + "] объектов и [" + b * 4 + "] атрибутов";
	}
	if (a) {
		if(b) {
			var minLength = Math.min(a.length, b.length);
			var artifactsSquare = 0;
			var i;
			for(i = 0; i < minLength; i++) {
				artifactsSquare += a[i]*b[i];
			}
			return "Общая площадь артефактов сжатия: [" + artifactsSquare + "] пикселей";
		}
		var amountOfRedPoints = a.reduce(function(sum, current){
			return sum + current;
		}, 0);
		return "Количество красных точек во всех строчках изображения: [" + amountOfRedPoints + "]";
	}

	return "error";
}
