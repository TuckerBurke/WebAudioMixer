// Modularity ****************************************************************************
export {channelOne_ctx,
		channelTwo_ctx,
		setupWebaudio,
		loadSoundFile,
		setGain,
		setHigh,
		setLow,
		setMid,
		setVolume,
		playCurrentSound,
		pauseCurrentSound,
		crossFade,
		channelOne_analyserNode_dry,
		channelTwo_analyserNode_dry,
		channelOne_analyserNode_wet,
		channelTwo_analyserNode_wet,
		mixerState};


// Variables *****************************************************************************
let channelOne_ctx;
let channelTwo_ctx;

let channelSelect;
let highShelfFreq = 1280.0;
let lowShelfFreq = 160.0;
let peakCenter = 720.0;
let peakWidth = 1.12;

// Properties
let channelOne_element;
let	channelOne_sourceNode;
let	channelOne_analyserNode_dry;
let	channelOne_gainNode;
let channelOne_highShelf;
let channelOne_lowShelf;
let channelOne_mid;
let channelOne_volume;
let channelOne_crossFader;
let	channelOne_analyserNode_wet;

let channelTwo_element;
let	channelTwo_sourceNode;
let	channelTwo_analyserNode_dry;
let	channelTwo_gainNode;
let channelTwo_highShelf;
let channelTwo_lowShelf;
let channelTwo_mid;
let channelTwo_volume;
let channelTwo_crossFader;
let	channelTwo_analyserNode_wet;

// Mixer state machine
let mixerState =
{
	graduatedFader	: 0,
	hamsterSwitch   : 0
};

// Fake enum (see main.js/DEFAULTS)
const DEFAULTS = Object.freeze({ gain		:	1.0,
								 shelfGain	:	0.0,
								 numSamples	:	256 });


// Methods ******************************************************************************

function setupWebaudio(filePath)
{
	// Define audio context
	const AudioContext = window.AudioContext || window.webkitAudioContext;
	
	
	// *********************** Setup Channel One ****************************************
	
	// Create audio context
	channelOne_ctx = new AudioContext();
	
	// Select channel, used predominantly as a parameter
	channelSelect = 1;
	
	// Create audio element
	channelOne_element = new Audio();

	// Select the source file for the element
	loadSoundFile(filePath, channelSelect);

	// Create an a source node that points at the element
	channelOne_sourceNode = channelOne_ctx.createMediaElementSource(channelOne_element);

	// Create an analyser node for the dry incoming audio
	channelOne_analyserNode_dry = channelOne_ctx.createAnalyser();	

	// Create "bins" for audio data - fft stands for Fast Fourier Transform
	channelOne_analyserNode_dry.fftSize = DEFAULTS.numSamples;

	// Create a gain node for the channel
	channelOne_gainNode = channelOne_ctx.createGain();
	channelOne_gainNode.gain.value = DEFAULTS.gain;
	
	// Create high shelf filter for the equalizer section
	channelOne_highShelf = channelOne_ctx.createBiquadFilter();
	channelOne_highShelf.type = "highshelf";
	channelOne_highShelf.frequency.setValueAtTime(highShelfFreq, channelOne_ctx.currentTime);
	channelOne_highShelf.gain.setValueAtTime(DEFAULTS.shelfGain, channelOne_ctx.currentTime);
	
	// Create low shelf filter for the equalizer section
	channelOne_lowShelf = channelOne_ctx.createBiquadFilter();
	channelOne_lowShelf.type = "lowshelf";
	channelOne_lowShelf.frequency.setValueAtTime(lowShelfFreq, channelOne_ctx.currentTime);
	channelOne_lowShelf.gain.setValueAtTime(DEFAULTS.shelfGain, channelOne_ctx.currentTime);
	
	// Create peaking filter node for the mid of equalizer section
	channelOne_mid = channelOne_ctx.createBiquadFilter();
	channelOne_mid.type = "peaking";
	channelOne_mid.frequency.setValueAtTime(peakCenter, channelOne_ctx.currentTime);
	channelOne_mid.Q.setValueAtTime(peakWidth, channelOne_ctx.currentTime);
	channelOne_mid.gain.setValueAtTime(DEFAULTS.shelfGain, channelOne_ctx.currentTime);
	
	// Create a gain node that represents the volume slider
	channelOne_volume = channelOne_ctx.createGain();
	channelOne_volume.gain.value = DEFAULTS.gain;
	
	// Create an additional analyser node to visualize channel one wet signal
	channelOne_analyserNode_wet = channelOne_ctx.createAnalyser();	
	channelOne_analyserNode_wet.fftSize = DEFAULTS.numSamples;
	
	// Create a gain node that represents the cross fader
	channelOne_crossFader = channelOne_ctx.createGain();
	channelOne_crossFader.gain.value = DEFAULTS.gain;
	
	// Assemble audio node graph DRY
	channelOne_sourceNode.connect(channelOne_analyserNode_dry);
	channelOne_analyserNode_dry.connect(channelOne_gainNode);
	channelOne_gainNode.connect(channelOne_highShelf);
	channelOne_highShelf.connect(channelOne_lowShelf);
	channelOne_lowShelf.connect(channelOne_mid);
	channelOne_mid.connect(channelOne_volume);
	channelOne_volume.connect(channelOne_analyserNode_wet);
	channelOne_analyserNode_wet.connect(channelOne_crossFader);
	channelOne_crossFader.connect(channelOne_ctx.destination);
	
	
	// *********************** Setup Channel Two ****************************************
	
	// Create audio context
	channelTwo_ctx = new AudioContext();
	
	// Select channel, used predominantly as a parameter
	channelSelect = 2;
	
	// Create audio element
	channelTwo_element = new Audio();

	// Select the source file for the element
	loadSoundFile(filePath, channelSelect);

	// Create an a source node that points at the element
	channelTwo_sourceNode = channelTwo_ctx.createMediaElementSource(channelTwo_element);

	// Create an analyser node for the dry incoming audio
	channelTwo_analyserNode_dry = channelTwo_ctx.createAnalyser();	

	// Create "bins" for audio data - fft stands for Fast Fourier Transform
	channelTwo_analyserNode_dry.fftSize = DEFAULTS.numSamples;

	// Create a gain node for the channel
	channelTwo_gainNode = channelTwo_ctx.createGain();
	channelTwo_gainNode.gain.value = DEFAULTS.gain;
	
	// Create high shelf filter for the equalizer section
	channelTwo_highShelf = channelTwo_ctx.createBiquadFilter();
	channelTwo_highShelf.type = "highshelf";
	channelTwo_highShelf.frequency.setValueAtTime(highShelfFreq, channelTwo_ctx.currentTime);
	channelTwo_highShelf.gain.setValueAtTime(DEFAULTS.shelfGain, channelTwo_ctx.currentTime);
	
	// Create low shelf filter for the equalizer section
	channelTwo_lowShelf = channelTwo_ctx.createBiquadFilter();
	channelTwo_lowShelf.type = "lowshelf";
	channelTwo_lowShelf.frequency.setValueAtTime(lowShelfFreq, channelTwo_ctx.currentTime);
	channelTwo_lowShelf.gain.setValueAtTime(DEFAULTS.shelfGain, channelTwo_ctx.currentTime);
	
	// Create peaking filter node for the mid of equalizer section
	channelTwo_mid = channelTwo_ctx.createBiquadFilter();
	channelTwo_mid.type = "peaking";
	channelTwo_mid.frequency.setValueAtTime(peakCenter, channelTwo_ctx.currentTime);
	channelTwo_mid.Q.setValueAtTime(peakWidth, channelTwo_ctx.currentTime);
	channelTwo_mid.gain.setValueAtTime(DEFAULTS.shelfGain, channelTwo_ctx.currentTime);
	
	// Create a gain node that represents the volume slider
	channelTwo_volume = channelTwo_ctx.createGain();
	channelTwo_volume.gain.value = DEFAULTS.gain;
	
	// Create an additional analyser node to visualize channel two's wet signal
	channelTwo_analyserNode_wet = channelTwo_ctx.createAnalyser();	
	channelTwo_analyserNode_wet.fftSize = DEFAULTS.numSamples;
	
	// Create a gain node that represents the cross fader
	channelTwo_crossFader = channelTwo_ctx.createGain();
	channelTwo_crossFader.gain.value = DEFAULTS.gain;
	
	// Assemble audio node graph
	channelTwo_sourceNode.connect(channelTwo_analyserNode_dry);
	channelTwo_analyserNode_dry.connect(channelTwo_gainNode);
	channelTwo_gainNode.connect(channelTwo_highShelf);
	channelTwo_highShelf.connect(channelTwo_lowShelf);
	channelTwo_lowShelf.connect(channelTwo_mid);
	channelTwo_mid.connect(channelTwo_volume);
	channelTwo_volume.connect(channelTwo_analyserNode_wet);
	channelTwo_analyserNode_wet.connect(channelTwo_crossFader);
	channelTwo_crossFader.connect(channelTwo_ctx.destination);
}


function loadSoundFile(filePath, channel)
{
	// If channel one
	if(channel == 1)
	{
		// Set the file path of channel one's element
		channelOne_element.src = filePath;
	}
	// If channel two
	else if(channel == 2)
	{
		// Set the file path of channel two's element
		channelTwo_element.src = filePath;
	}
	// Otherwise
	else
	{
		// Issue and error message
		console.log("Invalid channel selected");
	}
}


function playCurrentSound(channel)
{
	// If channel one
	if(channel == 1)
	{
		// Play channel one's element
		channelOne_element.play();
	}
	//If channel two
	else if(channel == 2)
	{
		// Play channel two's element
		channelTwo_element.play();
	}
	// Otherwise
	else
	{
		// Issue and error
		console.log("Invalid channel selected");
	}
}


function pauseCurrentSound(channel)
{
	// If channel one
	if(channel == 1)
	{
		// Pause channel one's element
		channelOne_element.pause();
	}
	// If channel two
	else if(channel == 2)
	{
		// Pause channel two's element
		channelTwo_element.pause();
	}
	// Otherwise
	else
	{
		// Issue and error message
		console.log("Invalid channel selected");
	}
}


function setGain(value, channel)
{
	// Cast the incoming parameter as a number
	value = Number(value);
	
	// If channel one
	if(channel == 1)
	{
		// Adjust channel one's gain
		channelOne_gainNode.gain.value = value;
	}
	// If channel two
	else if(channel == 2)
	{
		// Adjust channel two's gain
		channelTwo_gainNode.gain.value = value;
	}
	// Otherwise
	else
	{
		// Issue and error message
		console.log("Invalid channel selected");
	}
}


function setHigh(value, channel)
{
	// Cast the incoming parameter as a number
	value = Number(value);
	
	// If channel one
	if(channel == 1)
	{
		// Adjust channel one's high shelf gain
		channelOne_highShelf.gain.setValueAtTime(value, channelOne_ctx.currentTime);
	}
	// If channel two
	else if(channel == 2)
	{
		// Adjust channel two's high shelf gain
		channelTwo_highShelf.gain.setValueAtTime(value, channelOne_ctx.currentTime);
	}
	// Otherwise
	else
	{
		// Issue and error message
		console.log("Invalid channel selected");
	}
}


function setLow(value, channel)
{
	// Cast the incoming parameter as a number
	value = Number(value);
	
	// If channel one
	if(channel == 1)
	{
		// Adjust channel one's low shelf gain
		channelOne_lowShelf.gain.setValueAtTime(value, channelOne_ctx.currentTime);
	}
	// If channel two
	else if(channel == 2)
	{
		// Adjust channel two's low shelf gain
		channelTwo_lowShelf.gain.setValueAtTime(value, channelOne_ctx.currentTime);
	}
	// Otherwise
	else
	{
		// Issue and error message
		console.log("Invalid channel selected");
	}
}


function setMid(value, channel)
{
	// Cast the incoming parameter as a number
	value = Number(value);
	
	// If channel one
	if(channel == 1)
	{
		// Adjust channel one's peak gain
		channelOne_mid.gain.setValueAtTime(value, channelOne_ctx.currentTime);
	}
	// If channel two
	else if(channel == 2)
	{
		// Adjust channel two's peak gain
		channelTwo_mid.gain.setValueAtTime(value, channelTwo_ctx.currentTime);
	}
	// Otherwise
	else
	{
		// Issue and error message
		console.log("Invalid channel selected");
	}
}


function setVolume(value, channel)
{
	// Cast the incoming parameter as a number
	value = Number(value);
	
	// If channel one
	if(channel == 1)
	{
		// Adjust channel one's volume
		channelOne_volume.gain.value = value;
	}
	// If channel two
	else if(channel == 2)
	{
		// Adjust channel two's volume
		channelTwo_volume.gain.value = value;
	}
	// Otherwise
	else
	{
		// Issue and error message
		console.log("Invalid channel selected");
	}
}


function crossFade(value)
{
	// Cast the incoming parameter as a number
	value = Number(value);
	
	if(mixerState.graduatedFader && mixerState.hamsterSwitch)
	{
		// If on left edge of fader
		if(value <= 0.05)
		{
			// Adjust channel two's volume clamped
			channelOne_crossFader.gain.value = 0;

			// Adjust channel two's volume clamped
			channelTwo_crossFader.gain.value = 1;	
		}

		// If on right edge of fader
		else if(value >= 0.95)
		{
		
			// Adjust channel one's volume
			channelOne_crossFader.gain.value = 1;

			// Adjust channel two's volume
			channelTwo_crossFader.gain.value = 0;
		}
		
		// Middle of fader
		else
		{
			// Adjust channel one's volume
			channelOne_crossFader.gain.value = 1;

			// Adjust channel two's volume
			channelTwo_crossFader.gain.value = 1;
		}
	
	}
	
	// Just the graduated cross fader is activated
	else if(mixerState.graduatedFader)
	{
		// If on left edge of fader
		if(value <= 0.05)
		{
			// Adjust channel two's volume clamped
			channelOne_crossFader.gain.value = 1;

			// Adjust channel two's volume clamped
			channelTwo_crossFader.gain.value = 0;	
		}

		// If on right edge of fader
		else if(value >= 0.95)
		{
		
			// Adjust channel one's volume
			channelOne_crossFader.gain.value = 0;

			// Adjust channel two's volume
			channelTwo_crossFader.gain.value = 1;
		}
		
		// Middle of fader
		else
		{
			// Adjust channel one's volume
			channelOne_crossFader.gain.value = 1;

			// Adjust channel two's volume
			channelTwo_crossFader.gain.value = 1;
		}
	
	}
	
	// Just the hamster switch is activated
	else if(mixerState.hamsterSwitch)
	{		
		// If on left half of fader
		if(value <= 0.5)
		{
			// If cross fader is at less than 0 (something would be wrong)
			if(value < 0)
			{
				// Adjust channel one's volume
				channelOne_crossFader.gain.value = 1;

				// Adjust channel two's volume
				channelTwo_crossFader.gain.value = 0;

				// Issue warning message
				console.log("Cross fader out of range");
			}

			// Adjust channel one's volume
			channelOne_crossFader.gain.value = value * 2;

			// Adjust channel two's volume
			channelTwo_crossFader.gain.value = 1;
		}

		// If on right half of fader
		else if(value > 0.5)
		{
			// If cross fader is at greater than 1 (something would be wrong)
			if(value > 1)
			{
				// Adjust channel one's volume
				channelOne_crossFader.gain.value = 0;

				// Adjust channel two's volume
				channelTwo_crossFader.gain.value = 1;

				// Issue warning message
				console.log("Cross fader out of range");
			}

			// Adjust channel one's volume
			channelOne_crossFader.gain.value = 1;

			// Adjust channel two's volume
			channelTwo_crossFader.gain.value = (1 - value) * 2;
		}
	}
	
	// Otherwise both are turned off
	else
	{		
		// If on left half of fader
		if(value <= 0.5)
		{
			// If cross fader is at less than 0 (something would be wrong)
			if(value < 0)
			{
				// Adjust channel one's volume
				channelOne_crossFader.gain.value = 1;

				// Adjust channel two's volume
				channelTwo_crossFader.gain.value = 0;

				// Issue warning message
				console.log("Cross fader out of range");
			}

			// Adjust channel one's volume
			channelOne_crossFader.gain.value = 1;

			// Adjust channel two's volume
			channelTwo_crossFader.gain.value = value * 2;
		}

		// If on right half of fader
		else if(value > 0.5)
		{
			// If cross fader is at greater than 1 (something would be wrong)
			if(value > 1)
			{
				// Adjust channel one's volume
				channelOne_crossFader.gain.value = 0;

				// Adjust channel two's volume
				channelTwo_crossFader.gain.value = 1;

				// Issue warning message
				console.log("Cross fader out of range");
			}

			// Adjust channel one's volume
			channelOne_crossFader.gain.value = (1 - value) * 2;

			// Adjust channel two's volume
			channelTwo_crossFader.gain.value = 1;
		}
	}

}