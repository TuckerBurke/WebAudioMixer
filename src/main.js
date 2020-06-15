// Modularity
export {init};

import * as audio from './audio.js';
import * as utils from './utils.js';
import * as canvas from './canvas.js';

// Render state machine
let drawParams = 
{
	showGradient	: true,
	showName		: true,
	showBars		: true,
	showCircles		: true,
	showNoise		: false,
	showInvert		: false,
	showEmboss		: false
};

// Semantic variables
let channelOne = 1;
let channelTwo = 2;
let sound1  =  "media/Abstraction - Three Red Hearts - Pixel War 2.wav";


function init()
{
	audio.setupWebaudio(sound1);
	let canvasElement = document.querySelector("canvas");
	setupUI(canvasElement);
	canvas.setupCanvas(canvasElement);
	loop();
}

function setupUI(canvasElement)
{
  // *********************** Track Selection - Channel One ****************************************
  
	// Add event to Channel One's Load Track button
	document.querySelector("#uploadOne").onchange = (e) => {
		
		// Obtain the selected file(s)
		const files = event.target.files;
		
		// Set the file path display in canvas
		canvas.changeFilePath(event.target.value, 1);
		
		// Save the file path to the first file
		let filePath = URL.createObjectURL(files[0]);
		
		// Cue up the file
		audio.loadSoundFile(filePath, channelOne);
		
		// Pause the current track if it is playing
		if(playButtonOne.dataset.playing = "yes")
		{
			// Dispatch click on play button
			playButtonOne.dispatchEvent(new MouseEvent("click"));
		}
	};
  
  
  // *********************** Track Selection - Channel Two ****************************************
  
	// Add event to Channel Two's Load Track button
	document.querySelector("#uploadTwo").onchange = (e) => {
		
		// Obtain the selected file(s)
		const files = event.target.files;
		
		// Set the file path display in canvas
		canvas.changeFilePath(event.target.value, 2);
		
		// Save the file path to the first file
		let filePath = URL.createObjectURL(files[0]);
				
		// Cue up the file
		audio.loadSoundFile(filePath, channelTwo);
		
		// Pause the current track if it is playing
		if(playButtonTwo.dataset.playing = "yes")
		{
			// Dispatch click on play button
			playButtonTwo.dispatchEvent(new MouseEvent("click"));
		}
	};
  
  
  // *********************** Gain - Channel One ****************************************
   
  // Hookup volume slider
  let gainOne = document.querySelector("#gainSliderOne");
  
  // Add event to slider
  gainOne.oninput = e =>
  {
  		// Set the gain
		audio.setGain(e.target.value, channelOne);
  }
  
  
  // *********************** Gain - Channel Two ****************************************
   
  // Hookup volume slider
  let gainTwo = document.querySelector("#gainSliderTwo");
  
  // Add event to slider
  gainTwo.oninput = e =>
  {
  		// Set the gain
		audio.setGain(e.target.value, channelTwo);
  }
  
  
  // *********************** Equalizer - Channel One ************************************
  
  // Hookup high shelf slider 
  let highOne = document.querySelector("#highSliderOne");
  
  // Add event to slider
  highOne.oninput = e =>
  {
  		// Set the high shelf gain
		audio.setHigh(e.target.value, channelOne);
  }
    
  // Hookup low shelf slider 
  let lowOne = document.querySelector("#lowSliderOne");
  
  // Add event to slider
  lowOne.oninput = e =>
  {
  		// Set the high shelf gain
		audio.setLow(e.target.value, channelOne);
  }  
  
  // Hookup peak slider 
  let midOne = document.querySelector("#midSliderOne");
  
  // Add event to slider
  midOne.oninput = e =>
  {
  		// Set the high shelf gain
		audio.setMid(e.target.value, channelOne);
  }
  
  
  // *********************** Equalizer - Channel Two ************************************
  
  // Hookup high shelf slider 
  let highTwo = document.querySelector("#highSliderTwo");
  
  // Add event to slider
  highTwo.oninput = e =>
  {
  		// Set the high shelf gain
		audio.setHigh(e.target.value, channelTwo);
  }  
  
  // Hookup low shelf slider 
  let lowTwo = document.querySelector("#lowSliderTwo");
  
  // Add event to slider
  lowTwo.oninput = e =>
  {
  		// Set the high shelf gain
		audio.setLow(e.target.value, channelTwo);
  }  
  
  // Hookup peak slider 
  let midTwo = document.querySelector("#midSliderTwo");
  
  // Add event to slider
  midTwo.oninput = e =>
  {
  		// Set the high shelf gain
		audio.setMid(e.target.value, channelTwo);
  }
  
  
  // *********************** Volume - Channel One ****************************************
   
  // Hookup volume slider
  let volumeOne = document.querySelector("#volumeSliderOne");
  
  // Add event to slider
  volumeOne.oninput = e =>
  {
  		// Set the gain
		audio.setVolume(e.target.value, channelOne);
  }
  
  
  // *********************** Volume - Channel Two ****************************************
   
  // Hookup volume slider
  let volumeTwo = document.querySelector("#volumeSliderTwo");
  
  // Add event to slider
  volumeTwo.oninput = e =>
  {
  		// Set the gain
		audio.setVolume(e.target.value, channelTwo);
  }
  
  
  // *********************** Play Button - Channel One ****************************************

  // Hookup channel one's play button
  const playButtonOne = document.querySelector("#playButtonOne");
  
  // Give play button on click event
  playButtonOne.onclick = e =>
  {
		// Check if context is in suspended state (autoplay policy)
		if (audio.channelOne_ctx.state == "suspended")
		{
			// Resume play back
			audio.channelOne_ctx.resume();
		}

		// If the data is not playing (paused)
		if (e.target.dataset.playing == "no")
		{
			// play it
			audio.playCurrentSound(channelOne);

			// Also change its "state" for CSS
			e.target.dataset.playing = "yes";	
		}
		//If track IS playing, 
		else
		{
			// pause it
			audio.pauseCurrentSound(channelOne);

			// Also change its "state" for CSS
			e.target.dataset.playing = "no";
		}
  }

  
  // *********************** Play Button - Channel Two ****************************************

  // Hookup channel two's play button
  const playButtonTwo = document.querySelector("#playButtonTwo");
  
  // Give play button on click event
  playButtonTwo.onclick = e =>
  {
		// Check if context is in suspended state (autoplay policy)
		if (audio.channelTwo_ctx.state == "suspended")
		{
			// Resume play back
			audio.channelTwo_ctx.resume();
		}

		// If the data is not playing (paused)
		if (e.target.dataset.playing == "no")
		{
			// play it
			audio.playCurrentSound(channelTwo);

			// Also change its "state" for CSS
			e.target.dataset.playing = "yes";	
		}
		//If track IS playing, 
		else
		{
			// pause it
			audio.pauseCurrentSound(channelTwo);

			// Also change its "state" for CSS
			e.target.dataset.playing = "no";
		}
  }
  
  
  // ******************************** Graduated Cross Fader ****************************************
   
  // Obtain a reference to the graduated cross fader switch linear radio button, when it changes
  document.querySelector("#linear").onchange = (e) =>
  {
  		// Change the graduated fader state in the mixer state machine
  		audio.mixerState.graduatedFader = 0;
		
		// Update the cross fader immediately (took a minute to relize this was a problem
		audio.crossFade(document.querySelector("#crossFader").value);
		
  }
  
   // Obtain a reference to the graduated cross fader switch linear radio button, when it changes
  document.querySelector("#exponential").onchange = (e) =>
  {
  		// Change the graduated fader state in the mixer state machine
  		audio.mixerState.graduatedFader = 1;
		
		// Update the cross fader immediately (took a minute to relize this was a problem
		audio.crossFade(document.querySelector("#crossFader").value);
  }
  
  
  //  ******************************** Hamster Switch ****************************************
  
  // Obtain a reference to the hamster switch regular radio button, when it changes
  document.querySelector("#regular").onchange = (e) =>
  {
  		// Change the hamster switch state in the mixer state machine
  		audio.mixerState.hamsterSwitch = 0;
		
		// Update the cross fader immediately (took a minute to relize this was a problem
		audio.crossFade(document.querySelector("#crossFader").value);
  }
  
   // Obtain a reference to the hamster switch inverted radio button, when it changes
  document.querySelector("#inverted").onchange = (e) =>
  {
  		// Change the hamster switch state in the mixer state machine
  		audio.mixerState.hamsterSwitch = 1;
		
		// Update the cross fader immediately (took a minute to relize this was a problem
		audio.crossFade(document.querySelector("#crossFader").value);
  }
  
  
  // ******************************** Cross Fader ****************************************
   
  // Hookup volume slider
  let crossFader = document.querySelector("#crossFader");
  
  // Add event to slider
  crossFader.oninput = e =>
  {
  		// Set the gain
		audio.crossFade(e.target.value);
  }
  
  
  // ****************** Canvas Filter Check Boxes ******************************************
    
  // Gradient checkbox
  let toggleGradient = document.querySelector("#gradientCB");
  
  // Give it an onclick event (as every click is a change)
  toggleGradient.onclick = e =>
  {
				// Toggle underlying parameter value
		if(drawParams.showGradient)	{ drawParams.showGradient = false; }
		else 						{ drawParams.showGradient = true; }
  }
  
  
  // Bars checkbox
  let toggleBars = document.querySelector("#barsCB");
  
  // Give it an onclick event (as every click is a change)
  toggleBars.onclick = e =>
  {		
		// Toggle underlying parameter value
		if(drawParams.showBars)		{ drawParams.showBars = false; }
		else 						{ drawParams.showBars = true; }
  }
  
 
  // Circles checkbox
  let toggleCircles = document.querySelector("#circlesCB");
  
  // Give it an onclick event (as every click is a change)
  toggleCircles.onclick = e =>
  {		
		// Toggle underlying parameter value
		if(drawParams.showCircles)	{ drawParams.showCircles = false; }
		else 						{ drawParams.showCircles = true; }
  }
  
 
  // Noise Checkbox
  let toggleNoise = document.querySelector("#noiseCB");
  
  // Give it an onclick event (as every click is a change)
  toggleNoise.onclick = e =>
  {		
		// Toggle underlying parameter value
		if(drawParams.showNoise)	{ drawParams.showNoise = false; }
		else 						{ drawParams.showNoise = true; }
  }
  
 
  // Invert checkbox
  let toggleInvert = document.querySelector("#invertCB");
  
  // Give it an onclick event (as every click is a change)
  toggleInvert.onclick = e =>
  {		
		// Toggle underlying parameter value
		if(drawParams.showInvert)	{ drawParams.showInvert = false; }
		else 						{ drawParams.showInvert = true; }
  }
  
 
  // Emboss checkbox
  let toggleEmboss = document.querySelector("#embossCB");
  
  // Give it an onclick event (as every click is a change)
  toggleEmboss.onclick = e =>
  {		
		// Toggle underlying parameter value
		if(drawParams.showEmboss)	{ drawParams.showEmboss = false; }
		else 						{ drawParams.showEmboss = true; }
  }
	
} // end setupUI


function loop()
{
	/* NOTE: This is temporary testing code that we will delete in Part II */
	requestAnimationFrame(loop);
	
	// Refresh canvas render
	canvas.draw(drawParams);
	
}// END loop