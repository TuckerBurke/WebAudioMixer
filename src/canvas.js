// Modularity
export {setupCanvas,draw,changeFilePath};

import * as utils from './utils.js';
import * as audio from './audio.js';

let ctx;
let canvasWidth;
let canvasHeight;
let gradient;
let channelOne_dry;
let channelOne_wet;
let channelTwo_dry;
let channelTwo_wet;
let audioData1;
let audioData2;
let audioData3;
let audioData4;
let filePathChannelOne = "C:\\\\fakepath\Abstraction - Three Red Hearts - Pixel War 2.wav";
let filePathChannelTwo = "C:\\\\fakepath\Abstraction - Three Red Hearts - Pixel War 2.wav";

function setupCanvas(canvasElement)
{
	// create drawing context
	ctx = canvasElement.getContext("2d");
	canvasWidth = canvasElement.width;
	canvasHeight = canvasElement.height;
	
	// create a gradient that runs top to bottom
	gradient = utils.getLinearGradient(ctx,0,0,0,canvasHeight,[	{percent:0,		color:"#778c74"},
																{percent:0.07,	color:"#778c74"},
																{percent:.25,	color:"#afccaa"},
																{percent:.5,	color:"#afccaa"},
																{percent:.75,	color:"#98b294"},
																{percent:1,		color:"#98b294"}]);
	
	// keep a reference to the analyser node
	channelOne_dry = audio.channelOne_analyserNode_dry;
	channelOne_wet = audio.channelOne_analyserNode_wet;
	channelTwo_dry = audio.channelTwo_analyserNode_dry;
	channelTwo_wet = audio.channelTwo_analyserNode_wet;
	
	// this is the array where the analyser data will be stored
	audioData1 = new Uint8Array(channelOne_dry.fftSize/2 - 10);
	audioData2 = new Uint8Array(channelOne_wet.fftSize/2);
	audioData3 = new Uint8Array(channelTwo_dry.fftSize/2);
	audioData4 = new Uint8Array(channelTwo_wet.fftSize/2);
	
}// END setupCanvas

function draw(params={})
{
  	// Populate the audioData arrays with frequency data
	channelOne_dry.getByteFrequencyData(audioData1);
	channelOne_wet.getByteFrequencyData(audioData2);
	channelTwo_dry.getByteFrequencyData(audioData3);
	channelTwo_wet.getByteFrequencyData(audioData4);
	
	ctx.fillStyle = '#778c74';
	ctx.fillRect(0,0,canvasWidth,canvasHeight);
	
	// Draw canvas gradient background
	if(params.showGradient)
	{
		ctx.save();
		ctx.fillStyle = gradient;
		ctx.globalAlpha = 1.0;
		ctx.fillRect(0,0,canvasWidth,canvasHeight);
		ctx.restore();
	}
	
	// Draw channel one dry bars
	if(params.showBars)
	{
		// Local variables
		let margin = 20;
		let offset = 10;
		let screenWidthForBars = (canvasWidth / 2) - (1.5 * margin);
		let barWidth = Math.floor(screenWidthForBars / (audioData1.length));
		let barSpacing = Math.ceil(screenWidthForBars / (audioData1.length));
		let barQuantity = Math.floor(screenWidthForBars / barSpacing); 
		let topOfBarsBox = 80;
		let barsBoxHeight = 40;
		let barHeight = 0;
		let barBoxBottom = topOfBarsBox + barsBoxHeight;
		let audioToPixelConversion = barsBoxHeight / 256;
		
		let endOfChannelOne = margin + (barQuantity * barSpacing) + (0.5 * margin);
		
		ctx.save();
		
		// Change opacity
		ctx.globalAlpha = 0.5;
		ctx.fillStyle = '#3a3a3a';
		
		// Loop through the data and draw dry data
		for(let i = offset; i < barQuantity + offset; i++)
		{
			barHeight = 500;
			ctx.fillRect(margin + 1 + ((i - 10) * barSpacing), topOfBarsBox + 256-audioData1[i], barWidth,  barHeight);
		}
		
		// Loop through the data and draw dry data
		for(let i = offset; i < barQuantity + offset; i++)
		{
			barHeight = 500;
			ctx.fillRect(400 + (0.5 * margin) + 1 + ((i - 10) * barSpacing), topOfBarsBox + 256-audioData3[i], barWidth, barHeight);
		}

		// Change color (drys above, wets below)
		ctx.globalAlpha = 1;
		ctx.fillStyle = '#5a5a5a';
		
		// Loop through the data and draw wet data
		for(let i = offset; i < barQuantity + offset; i++)
		{
			barHeight = 10;
			ctx.fillRect(margin + 1 + ((i - 10) * barSpacing), topOfBarsBox + 256-audioData2[i], barWidth,  barHeight);
		}
		
		// Loop through the data and draw wet data
		for(let i = offset; i < barQuantity + offset; i++)
		{
			barHeight = 10;
			ctx.fillRect(400 + (0.5 * margin) + 1 + ((i - 10) * barSpacing), topOfBarsBox + 256-audioData4[i], barWidth, barHeight);
		}
		
		ctx.restore();
		
	}
	
	// Draw circles for wet data
	if(params.showCircles)
	{
		let maxRadius = (canvasWidth/4) - 20;
		ctx.save();
		ctx.globalAlpha = 0.14;
		
		for(let i = 0; i < audioData2.length; i++)
		{
			// Semi circles
			let percent = audioData1[i] / 255;
			let circleRadius = percent * maxRadius;
			
			ctx.beginPath();
			ctx.strokeStyle = '3a3a3a';
			ctx.arc(canvasWidth / 4, 0, circleRadius, 0, 2 * Math.PI, false);
			ctx.stroke();
			ctx.closePath();
		}
		
		for(let i = 0; i < audioData3.length; i++)
		{
			// Semi circles
			let percent = audioData3[i] / 255;
			let circleRadius = percent * maxRadius;
			
			ctx.beginPath();
			ctx.strokeStyle = '3a3a3a';
			ctx.arc((canvasWidth / 4) * 3, 0, circleRadius, 0, 2 * Math.PI, false);
			ctx.stroke();
			ctx.closePath();
		}
		
		ctx.restore();
		
	}// END showCircles
	
	// Draw bar that emulates a bottom margin (mask)
	let marginBottom = 40;
	
	ctx.save();
	ctx.fillStyle = "#98b294";
	ctx.fillRect(0, canvasHeight - marginBottom, canvasWidth, marginBottom);
	ctx.fillStyle = "#778c74";
	ctx.fillRect(0, 0, canvasWidth, 20);
	ctx.restore();
	
	// Draw track / file name
	if(params.showName)
	{
		// Local variables
		let margin = 20;
		
		ctx.save();
		ctx.fillStyle = '#5a5a5a';
		ctx.font = "14px Ubuntu Mono";
		ctx.fillText (filePathChannelOne.substring(12), 24, 380);
		ctx.fillText (filePathChannelTwo.substring(12), 414, 380);
		ctx.restore();
		
	}
	
	let imageData = ctx.getImageData(0,0, canvasWidth, canvasHeight);
	let data = imageData.data;
	let length = data.length;
	let width = imageData.width; // not using here
	
	// B) Iterate through each pixel, stepping 4 elements at a time (which is the RGBA for 1 pixel)
	for (let i = 0; i < length; i += 4)
	{
		// If noise is activated
		if (params.showNoise && Math.random() < 0.05)
		{
			data[i] = data[i+1] = data[i+2] = 0; // zero out the red and green and blue channels
			data[i + 1] = 255; // make the green channel 100% green
		} // END if
		
		// If inversion is activated
		if (params.showInvert)
		{
			let red = data[i], green = data[i + 1], blue = data[i + 2]
			data[i] = 255 - red; 		// Set red value
			data[i + 1] = 255 - green;	// Set blue value
			data[i + 2] = 255 - blue;	// Set green value
		}
		
	} // END for
	
	// If emboss is activated
	if (params.showEmboss)
	{
			// Note we are skipping through each subpixel
			for (let i = 0; i < length; i++)
			{
				// Skip the alpha channel
				if (i % 4 == 3) continue;
				data[i] = 127 + 2 * data[i] - data[i + 4] - data[i + width * 4];
			}
	}
	
	// D) copy image data back to canvas
	ctx.putImageData(imageData, 0, 0);
	
}// END draw

function changeFilePath(filePath, channel)
{
	// If the path is for channel 1
	if(channel == 1)
	{
		// Save the filepath for display
		filePathChannelOne = filePath;
	}
	// If the path is for channel 2
	else
	{
		// Save the filepath for display
		filePathChannelTwo = filePath;
	}
	
}// END changeFilePath