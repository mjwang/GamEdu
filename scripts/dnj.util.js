Array.dim = function (n, e) {
        var a = [], i;
        for (i = 0; i < n; i += 1) {
                a[i] = e;
        }
        return a;
}

Array.prototype.copy = function () {
        return this.slice(0);
}


Array.prototype.isEmpty = function () {
        return (this.length === 0);
}

function shuffle(array){
	var currentIndex = array.length;
	var randomIndex;
	var temporaryValue;

	while(0 !== currentIndex){
		randomIndex = Math.floor(Math.random() * currentIndex);
		currentIndex -= 1;

		temporaryValue = array[currentIndex];
		array[currentIndex] = array[randomIndex];
		array[randomIndex] = temporaryValue;
	}

	return array;
}

