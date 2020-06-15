// Why are the all of these ES6 Arrow functions instead of regular JS functions?
// No particular reason, actually, just that it's good for you to get used to this syntax
// For Project 2 - any code added here MUST also use arrow function syntax
export {makeColor,
		getRandomColor,
		getLinearGradient};

const makeColor = (red, green, blue, alpha = 1) => 
{
 	return `rgba(${red},${green},${blue},${alpha})`;
};

const getRandom = (min, max) => 
{
 	return Math.random() * (max - min) + min;
};

const getRandomColor = () => 
{
	const floor = 35; // so that colors are not too bright or too dark 
	const getByte = () => getRandom(floor,255-floor);
	return `rgba(${getByte()},${getByte()},${getByte()},1)`;
};

const getLinearGradient = (ctx,startX,startY,endX,endY,colorStops) => 
{
	let lg = ctx.createLinearGradient(startX,startY,endX,endY);
	
	for(let stop of colorStops)
	{
		lg.addColorStop(stop.percent,stop.color);
	}
	
	return lg;
};



