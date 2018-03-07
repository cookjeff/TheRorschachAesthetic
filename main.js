var player = {health: 100,
	 						x: 100,
							y: 100,
							angle: 0};
var ctx, background, bloodimg, lightbloodimg, frameimg;
var width = 800, height = 800;
var movespeed = 5;
var keypress = {};

var bullets = [];
var zombies = [];
var bloods = [];

var percentgoal = 80;

// Global DOM Elements
var musicElm = document.getElementById("bgmusic"); // music element
var soundElm = document.getElementById("soundfx"); // sound effects element
// Event Listener for Looping Music
	musicElm.addEventListener('ended',function(){
		this.currentTime = 0;
		this.play();
	}, false);
// Music  Variables
var _curMusic = 0; // the current music number that is playing
var _curSFX = 4;	// the current sound effects number that is playing
	//this._curSFX1 = 5;	// the current sound effects 1 number that is playing
	// ~Constants
var MAX_MUSIC_CNT = 9;	// The maximum number of music files (to not extend beyond array bounds).
var MAX_VOLUME_LVL = .9; // The level that the max volume should be (.9 = 90%).
var MIN_VOLUME_LVL = .1; // The level that tests if the volume should be on when toggling (.1 = 90%).
var ZERO_VOLUME_LVL = 0; // the level that means zero volume (no sound playing).

// Audio File-paths
	var MusicFiles =
	{
		0: "audio/RAIdleMusic_0x02_trns_0x06.wav",
		1: "audio/RAIdleMusic_0x02_trns_0x05.wav",
		2: "audio/RALevel2Music.wav",
		3: "audio/RALevel3Music.wav",
		4: "audio/RALevel4Music.wav",
		5: "audio/RALevel5Music.wav",
		6: "79190__nathan-lomeli__iphone-camera-click.wav",
		7: "audio/RALevelLoseSound.wav",
		8: "audio/RAGameWinSound.wav",
		9: "audio/RASpawnSound.wav"
	}
	Object.freeze(MusicFiles);



// BEGIN OF General Audio Playing FUNCTIONS
	// Toggle  Volume Functions
	function toggleGeneralSound(theGeneralSound){
		if (theGeneralSound.volume >= MIN_VOLUME_LVL)
		{
			theGeneralSound.volume = ZERO_VOLUME_LVL;
		} else
		{
			theGeneralSound.volume = MAX_VOLUME_LVL;
		}
	}

	function playGeneralSound(themusicElm, musicPath) {
		//console.log("AudioManager: General Play Music-debug")
		themusicElm.src = musicPath;	// sets the file path
		themusicElm.play();			// plays the music
	}
	function pauseMusic(musicElm) {
		musicElm.pause();			// pauses the music
	}

	// !END OF General Audio Playing FUNCTIONS


	// BEGIN OF Game Specific Audio FUNCTIONS
	// Music Play Functions
	function playIdleMusic ()
	{
		_curMusic = 0;
		playGeneralSound(musicElm,MusicFiles[_curMusic]);
	}
	function playCurrentLevelMusic ()
	{
		if(currlevel >=0 && currlevel < MAX_MUSIC_CNT)
		{
			_curMusic = currlevel;
			playGeneralSound(musicElm,MusicFiles[_curMusic]);
		}
		else
		{
			// console.log("Not valid music file path number")
		}

	}
		// Sound FX Play Functions

	function playLevelWinSound()
	{
		_curSFX = 6;
		playGeneralSound(soundElm,MusicFiles[_curSFX]);
	}
	function playLevelLoseSound()
	{
		_curSFX = 7;
		playGeneralSound(soundElm,MusicFiles[_curSFX]);
	}
	function playGameWinSound()
	{
		_curSFX = 8;
		playGeneralSound(soundElm,MusicFiles[_curSFX]);
	}



	// Volume Control Functions
	function toggleMusic ()
	{
		toggleGeneralSound(musicElm);
	}
	 function toggleEffects ()
	{
		toggleGeneralSound(soundElm);
	}
	// !END OF Game Specific Audio FUNCTIONS


//var debug = true;
var debug = false;

var healthhud,killshud,paintedhud;

var cheatanswer = "ABCABBACA";
var currcheat = "", currcheatindex = 0;


window.onclick = function() {
	//alert("clicked");
	if (splashtimer > -99 && splashtimer < 0) {
		splashtimer = 99;
		setlevel(0);
	}
}

onkeydown = function(k) {
	k.preventDefault();
	keypress[k.keyCode] = true;

	var currchar = String.fromCharCode(k.keyCode);

	if (splashtimer > -99 && splashtimer < 0) {
		splashtimer = 0;
		setlevel(0);
	}
	if (currchar==cheatanswer[currcheatindex]) {
		currcheatindex++;
	}

	if ((currcheatindex)==cheatanswer.length) {
		bloodimg.src = "blood.png";    // Basecase
		lightbloodimg.src = "lightblood.png"; // Basecase
		playGeneralSound(document.getElementById("secretsound"),"fatality.mp3");

		currcheatindex++;
	}
	console.log(currchar);
	//alert(k.keyCode);
}

onkeyup = function(k) {
	keypress[k.keyCode] = false;

}

var splashlimit = 0;
var splashtimer = 0;
var currsplash;

var kills, gridcovered, gridtotal;

var levels = ["level1.gif","level2.gif","level3.gif","level4.gif","level5.gif"];
var levelframes = [3,2,1,2,3];
var xstretch = [700,750,800,700,600];
var ystretch = [800,800,800,800,800];
var frameimgs = ["frame3.png",
									"img/std/Frames/OneToOneFrames/OneToOne_1024x1024_Rrshahck-Ahszthetik-06-trsnp-04.png",
									"frame2.png"];
var levelgrids = [];
var currlevel = 4;
var timer = 0;


levelgrids[0] = 	[[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0], // 0
									[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
									[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],  // 2
									[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
									[0,0,0,1,1,1,0,0,0,0,0,0,0,0,0,0],  // 4
									[0,0,1,1,1,1,0,0,1,1,0,0,0,0,0,0],
									[0,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0],  // 6
									[0,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0],
									[0,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0],  // 8
									[0,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0],
									[0,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0],  // 10
									[0,0,1,1,1,1,1,1,1,1,1,1,0,0,0,0],
									[0,0,1,1,1,1,1,1,1,1,1,0,0,0,0,0],  // 12
									[0,0,0,1,1,1,1,1,1,1,0,0,0,0,0,0],
									[0,0,0,0,1,1,1,1,1,0,0,0,0,0,0,0],  // 14
									[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]];

levelgrids[1] = 	[[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0], // 0
									[0,0,0,0,0,0,1,1,1,0,0,0,0,0,0,0],
									[0,0,0,1,1,1,1,1,1,1,1,0,0,0,0,0],  // 2
									[0,0,0,1,1,1,1,1,1,1,1,0,0,0,0,0],
									[0,0,0,1,1,0,0,0,0,1,1,1,0,0,0,0],  // 4
									[0,0,1,1,1,0,0,0,0,0,1,1,0,0,0,0],
									[0,1,1,1,0,0,0,0,0,0,1,1,0,0,0,0],  // 6
									[0,0,1,1,0,0,0,0,0,0,1,1,0,0,0,0],
									[0,0,0,1,1,0,0,0,0,1,1,1,0,0,0,0],  // 8
									[0,0,0,1,1,1,0,0,1,1,1,1,0,0,0,0],
									[0,0,0,1,1,1,1,1,1,1,1,0,0,0,0,0],  // 10
									[0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0],
									[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],  // 12
									[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
									[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],  // 14
									[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]];

levelgrids[2] = 	[[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0], // 0
									[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
									[0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0],  // 2
									[0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0],
									[0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0],  // 4
									[0,0,1,1,1,0,0,0,0,0,0,0,0,0,0,0],
									[0,0,1,1,1,1,1,1,1,1,1,1,0,0,0,0],  // 6
									[0,0,1,1,1,1,1,1,1,1,1,1,0,0,0,0],
									[0,0,1,1,1,1,1,1,1,1,1,1,1,0,0,0],  // 8
									[0,0,1,1,1,1,1,1,1,1,1,1,1,0,0,0],
									[0,0,0,1,1,1,1,1,1,1,1,1,1,0,0,0],  // 10
									[0,0,0,1,1,1,1,1,1,1,1,1,1,0,0,0],
									[0,0,0,0,1,1,1,1,1,1,1,1,1,0,0,0],  // 12
									[0,0,0,0,1,1,1,1,1,1,1,1,1,0,0,0],
									[0,0,0,0,1,1,1,1,1,1,1,1,1,0,0,0],  // 14
									[0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0]];

levelgrids[3] = 	[[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0], // 0
									[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
									[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],  // 2
									[0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0],
									[0,0,1,0,1,0,0,0,0,1,1,1,0,0,0,0],  // 4
									[0,1,1,1,1,0,1,1,0,1,1,1,0,0,0,0],
									[0,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0],  // 6
									[0,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0],
									[0,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0],  // 8
									[0,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0],
									[0,0,1,1,1,1,1,1,1,1,1,0,0,0,0,0],  // 10
									[0,0,0,1,1,1,1,1,1,1,1,0,0,0,0,0],
									[0,0,0,0,1,1,1,1,1,1,0,0,0,0,0,0],  // 12
									[0,0,0,0,0,1,1,1,1,1,0,0,0,0,0,0],
									[0,0,0,0,0,0,1,1,1,1,0,0,0,0,0,0],  // 14
									[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]];

levelgrids[4] = 	[[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0], // 0
									[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
									[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],  // 2
									[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
									[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],  // 4
									[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
									[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],  // 6
									[0,0,0,0,0,0,1,1,1,1,1,1,0,0,0,0],
									[0,0,0,0,0,0,1,1,1,1,1,0,0,0,0,0],  // 8
									[0,0,0,0,0,0,1,1,1,1,1,0,0,0,0,0],
									[0,0,0,0,0,0,0,1,1,1,0,0,0,0,0,0],  // 10
									[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
									[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],  // 12
									[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
									[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],  // 14
									[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]];

levelgrids[5] = 	[[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0], // 0
									[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
									[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],  // 2
									[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
									[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],  // 4
									[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
									[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],  // 6
									[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
									[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],  // 8
									[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
									[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],  // 10
									[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
									[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],  // 12
									[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
									[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],  // 14
									[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]];

var gradinggrid = 	[[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0], // 0
									[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
									[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],  // 2
									[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
									[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],  // 4
									[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
									[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],  // 6
									[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
									[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],  // 8
									[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
									[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],  // 10
									[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
									[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],  // 12
									[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
									[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],  // 14
									[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]];

var playerimg, zombieimg;


var percentpainted = 0;

var playererimages = {};

function killZombie(zombie) {



	bloods.push(new Blood(zombie.x+15*Math.random(),zombie.y+15*Math.random()));

	var ycoord = Math.floor(bloods[bloods.length-1].x/50), xcoord = Math.floor(bloods[bloods.length-1].y/50);
/*
	if (xcoord < 0)
		xcoord = 0;
	if (ycoord < 0)
		ycoord = 0;
*/
	var neededpaint = gradinggrid[xcoord][ycoord];

	if (neededpaint) {
		gradinggrid[xcoord][ycoord] = 0;
	}
	if (bloods[bloods.length-1].x%100 > 35 && xcoord < 15) {
		gradinggrid[xcoord + 1][ycoord] = 0;
	}
	if (bloods[bloods.length-1].y%100 > 35 && ycoord < 15) {
		gradinggrid[xcoord][ycoord + 1] = 0;
	}
	if ((bloods[bloods.length-1].y%100 > 35 && ycoord < 15) && (bloods[bloods.length-1].x%100 > 35 && xcoord < 15)) {
			gradinggrid[xcoord + 1][ycoord + 1] = 0
	}


 	zombie.x = Math.random()*800;
	zombie.y = Math.random()*800;
}

var winscreen;

function setlevel(ln) {
	currlevel = ln;
	zombiesound.muted = false;
	framesoundplayed = false;

	background = new Image();
	background.src = levels[currlevel];

	frameimg = new Image();
	frameimg.src = frameimgs[levelframes[currlevel]-1];

	kills = 0;
	gridcovered = 0;
	player.health = 100;
	timer = 0;

	bloods = [];

	zombies = [];

	zombies.push(new Zombie(Math.random()*800,Math.random()*800,3.1));
	zombies.push(new Zombie(Math.random()*800,Math.random()*800,2.8));
	zombies.push(new Zombie(Math.random()*800,Math.random()*800,3.3));
	zombies.push(new Zombie(Math.random()*800,Math.random()*800,3.55));
	zombies.push(new Zombie(Math.random()*800,Math.random()*800,3.4));

	playCurrentLevelMusic();

	gradinggrid = 	[[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0], // 0
										[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
										[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],  // 2
										[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
										[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],  // 4
										[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
										[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],  // 6
										[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
										[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],  // 8
										[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
										[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],  // 10
										[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
										[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],  // 12
										[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
										[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],  // 14
										[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]];

	// Count the number that must be colored on the current grid and copy it over
	gridtotal = 0;
	for (var i = 0; i < 16; i++) {
		for (var j = 0; j < 16; j++) {
			if (levelgrids[currlevel][i][j]==1) {
				gridtotal++;
				gradinggrid[i][j]=1;
			}
		}
	}

}

function grade() {
	gridcovered = 0;
	for (var i = 0; i < 16; i++) {
		for (var j = 0; j < 16; j++) {
			if (gradinggrid[i][j]==1 && levelgrids[currlevel][i][j]==1) {
				gridcovered++;
			}
		}
	}
}

var framesoundplayed = false;

function update() {

	if (keypress[32]) {
		if (percentpainted>percentgoal && kills > 10 && currlevel < 4) {
			percentpainted = 0;
			setlevel(++currlevel);
		}
		if (splashtimer > 0.5) {
			splashtimer+=1;
		}
	}

	percentpainted = Math.floor(100-gridcovered/gridtotal*100+0.2);

	elapsedTime = (new Date() - lastDate)/1000;

	timer+=elapsedTime;

	splashtimer += elapsedTime;


	//console.log(splashtimer);


	if (timer > 10-currlevel*2) {
		timer = 0;
		zombies.push(new Zombie(Math.random()*800,Math.random()*800,3.3+Math.random()));
	}

	ctx.clearRect(0, 0, width,height);
		ctx.drawImage(background,10,10);
	handleMovement();
		handleShooting();
	updateZombies();



	// DEAL WITH PLAYER DYING OR WINNING
	if (player.health<0 && splashtimer > 0) {
		if (percentpainted < percentgoal) {
			playLevelLoseSound();
			//if (!debug)
			//		alert("You died... try this level over again!");
			currsplash.src = "death"+parseInt(currlevel+1)+".png";




			if (splashtimer > splashlimit)
				splashtimer = 0;


			setlevel(currlevel);
		} else {
			currlevel++;

			if (currlevel > 4) {
				playGameWinSound();

				splashtimer = -9999;
				currsplash = winscreen;
				shootingsound.muted = true;
				zombiesound.muted = true;

				//window.requestAnimationFrame(null);

				alert("You beat the game!");

			} else {
				setlevel(currlevel);
			}
		}
	}

	if (Math.ceil(100-gridcovered/gridtotal*100+0.2) == 100) {

		if (currlevel > 4) {
			playGameWinSound();

			splashtimer = -9999;
			currsplash = winscreen;
			shootingsound.muted = true;
			zombiesound.muted = true;
			//zombiesound.src = null;
			//window.requestAnimationFrame(null);

			alert("You beat the game!");
		} else {
			//ACE playLevelWinSound();
			currlevel++;
			setlevel(currlevel);
		}
	}





	for (var i = 0; i < bloods.length; i++ ) {
		if (levelgrids[currlevel][Math.floor(bloods[i].y/50)][Math.floor(bloods[i].x/50)]==1) {
			ctx.drawImage(bloodimg,bloods[i].x-50,bloods[i].y-50,100,100);
		} else {
				ctx.drawImage(lightbloodimg,bloods[i].x-50,bloods[i].y-50,100,100);
		}
	}
console.log(moving);
skipstep++;
if (skipstep%6==0)
	updateiter++;

if (!moving)
	updateiter = 2;

////
	//ctx.drawImage(playerimg, player.x, player.y, 50, 50);
	ctx.drawImage(playerimages[currdirection],updateiter%3*64,0,64,64,player.x,player.y,50,50);



	grade();

	for (var i = 0; i < zombies.length; i++ ) {
		ctx.drawImage(zombieimg,zombies[i].x,zombies[i].y,50,50);
	}

	// DEAL WITH THE FRAME
	if (percentpainted >= percentgoal && kills > 10) {
		if (!framesoundplayed) {
			playLevelWinSound();
			framesoundplayed = true;
		}
		ctx.drawImage(frameimg,0,0,xstretch[currlevel],ystretch[currlevel]);//xstretch[currlevel],ystretch[currlevel]);

	}



	if (debug || keypress[16])
		debugGrid();





	if (splashtimer < splashlimit) {
		ctx.clearRect(0,0,800,800);
		ctx.drawImage(currsplash,0,0);
		zombiesound.muted = true;
		hurtsound.muted = true;
	} else {
		killshud.innerHTML="Kills: " + kills;
		paintedhud.innerHTML = "Percent Painted: " + percentpainted + "%";
		healthhud.innerHTML="Health: " + Math.floor(player.health) + "%";

		if ((splashtimer-elapsedTime) < splashlimit) {
			setlevel(currlevel);
		}

	}

	window.requestAnimationFrame(update);


}
var updateiter = 0, skipstep = 0;

function debugGrid() {
	for (var i = 0; i < width/50; i++ ) {
		for (var j = 0; j < width/50; j++) {
			ctx.strokeStyle = "red";
			if (levelgrids[currlevel][j][i]==1)
				ctx.strokeStyle = "blue";
			if (gradinggrid[j][i]==1)
				ctx.strokeStyle = "yellow";
      ctx.beginPath();
      ctx.moveTo(i*50, j*50);
      ctx.lineTo(i*50+50, j*50);
      ctx.lineTo(i*50+50, j*50+50);
      ctx.lineTo(i*50,j*50+50);
      ctx.closePath();
			ctx.fillStyle = "green";
			ctx.fillText(i+","+j,i*50,j*50);
      ctx.stroke();
		}
	}

}

function Zombie(x, y, speed) {
	this.x = x;
	this.y = y;
	this.speed = speed;
}

function Blood(x, y) {
	this.x = x;
	this.y = y;
}

var shootingsound, zombiesound, hurtsound;
function initialize() {

	document.getElementById("secretsound").src="fatality.mp3";

	var updateiter = 0;

	winscreen = new Image();
	winscreen.src = "winscreen.gif";

	playerimages = new Array();
	playerimages[0] = new Image();
	playerimages[0].src = "mainup.png";

	playerimages[1] = new Image();
	playerimages[1].src = "mainright.png";


	playerimages[2] = new Image();
	playerimages[2].src = "maindown.png";

	playerimages[3] = new Image();
	playerimages[3].src = "mainleft.png";


	shootingsound = document.getElementById("shootingsound");
	shootingsound.loop = true;
	shootingsound.muted = true;
	shootingsound.volume = 0.03;
	playGeneralSound(shootingsound,"fire.wav");
	zombiesound = document.getElementById("zombies");
	zombiesound.volume = 0.03;

	hurtsound = document.getElementById("ouch");
	playGeneralSound(hurtsound,"ouch.wav");
	hurtsound.loop = true;
	hurtsound.volume = .5;
	hurtsound.muted = true;

	playGeneralSound(zombiesound,"zombies.wav");

	ctx = document.getElementById("canv").getContext("2d");

	ctx.width = width;
	ctx.height = height;

	currsplash = new Image();
	currsplash.src = "trasplash.png";
	splashlimit = 3;
	splashtimer = -100;




   // TEXTURE INITIALIZATIONS
	playerimg = new Image();
	playerimg.src = "img/std/Player/Player_64_02.png";

	bloodimg = new Image();

    bloodimg.src = "img/std/SpecialFX/Blood/ColorsAbstract_64-v03.png";

	lightbloodimg = new Image();

	lightbloodimg.src = "img/std/SpecialFX/LightBlood/ColorsAbstract_64-v0E.png";


	zombieimg = new Image();
	zombieimg.src = "img/std/Zombies/Zombie-topdown-v01-trns_128x128.png";

	frameimg = new Image();



	healthhud = document.getElementById("health");
	killshud = document.getElementById("kills");
	paintedhud = document.getElementById("painted");

	setlevel(0);
	playCurrentLevelMusic();


}

function updateZombies() {
	for (var i = 0; i < zombies.length; i++) {
		if (player.x > zombies[i].x)
			zombies[i].x += zombies[i].speed;
		else
			zombies[i].x -= zombies[i].speed;

		if (player.y > zombies[i].y)
			zombies[i].y += zombies[i].speed;
		else
			zombies[i].y -= zombies[i].speed;

	}

}

var moving = false;
function handleMovement() {
moving = false;


	if (keypress[65]) {// a
		if(isPassiblex(player.x - movespeed, player.y))
			player.x -= movespeed;

		moving=true;
		currdirection = 3;
	}
	if (keypress[87]) { // w
		if(isPassibley(player.x, player.y - movespeed))
			player.y -= movespeed;
		currdirection = 0;
		moving=true;
	}
	if (keypress[68]) { // d
		if(isPassiblex(player.x + movespeed, player.y))
			player.x += movespeed;
		currdirection = 1;
		moving=true;
	}
	if (keypress[83]) { // s
		if(isPassibley(player.x, player.y + movespeed))
			player.y += movespeed;
		currdirection = 2;
		moving=true;
	}
	ouchtimer-=elapsedTime;

	// Check if a player got nabbed by a zombie
	for (var j = 0; j < zombies.length; j++) {
		if (distance(player.x,player.y,zombies[j].x+25,zombies[j].y+25)<50) {
			killZombie(zombies[j]);
			ouchtimer = 1;
			player.health -= 5+currlevel+Math.random()*10;
		}
	}

	if (ouchtimer > 0 && player.health < 100) {
		hurtsound.muted = false;
	} else {
		hurtsound.muted = true;
	}

}


var canshoot = false;
var currStyle = ["#FFFF00","#FF0000","FF4500","#FF0000"];
var elapsedTime, lastDate = new Date();
var shootiter = 0;
var currdirection = 0;

var ouchtimer = -1;
function handleShooting() {



	var shootingx = 0, shootingy = 0;

	// Shooting
	if (keypress[37]) { // left
		shootingx = -1;
		currdirection = 3;
	}
	if (keypress[38]) { // up
		shootingy = -1;
		currdirection = 0;
	}
	if (keypress[39]) { // right
		shootingx = 1;
		currdirection = 1;
	}
	if (keypress[40]) {	// down
		shootingy = 1;
		currdirection = 2;
	}

	canshoot = !canshoot;

	// If they're shooting
	if ((Math.abs(shootingx)+Math.abs(shootingy))>0) {


		shootingsound.muted = false;

		if ((Math.abs(shootingx)+Math.abs(shootingy))>1) {
			shootingx = shootingx/Math.sqrt(2);
			shootingy = shootingy/Math.sqrt(2);
		}

		var collx = player.x, colly = player.y;
		// Iterate as though raycasting for enemies
		for (var i = 0; i < 12; i++) {
			for (var j = 0; j < zombies.length; j++) {
				if (distance(collx,colly,zombies[j].x+25,zombies[j].y+25)<50) {
					killZombie(zombies[j]);
					kills++;
					continue;
				}
			}
			collx += 37*shootingx;
			colly += 37*shootingy;

		}


		if (canshoot) {
			shootiter++;
			ctx.beginPath();
			ctx.moveTo(player.x+25,player.y+25);
			//ctx.lineTo(player.x+shootingx*300,player.y+shootingy*300);
			ctx.lineTo(player.x+25+500*shootingx,player.y+25+500*shootingy);
			ctx.strokeStyle = currStyle[shootiter%4];
			ctx.stroke();
		}
	} else {
		shootingsound.muted = true;
	}

	lastDate = new Date();

}

function distance(x1, y1, x2, y2) {
	return Math.sqrt((x2-x1)*(x2-x1)+(y2-y1)*(y2-y1));
}


window.onload = function() {



	initialize();


	window.requestAnimationFrame(update);

}


function isPassibley(x,y) {
	//return true;
	return ((y>0&&y<(height-50)));

}

function isPassiblex(x,y) {
	//return true;
	return ((x>0&&x<(width-50)));

}
